<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { showNotify } from 'vant'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt: () => Promise<void>
}

const showInstallPrompt = ref(false)
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

// 检查是否已经安装了 PWA
function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone
    || document.referrer.includes('android-app://')
}

// 检查是否应该显示安装提示
function shouldShowInstallPrompt() {
  const lastDismissed = localStorage.getItem('pwa-install-dismissed')
  const installLater = localStorage.getItem('pwa-install-later')

  if (lastDismissed) {
    const dismissedTime = new Date(lastDismissed).getTime()
    const now = new Date().getTime()
    // 如果用户选择了"不再提示"，则 7 天后再提示
    if (now - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
      return false
    }
  }

  if (installLater) {
    const laterTime = new Date(installLater).getTime()
    const now = new Date().getTime()
    // 如果用户选择了"稍后提醒"，则 1 天后再提示
    if (now - laterTime < 24 * 60 * 60 * 1000) {
      return false
    }
  }

  return true
}

// 处理 beforeinstallprompt 事件
function handleBeforeInstallPrompt(e: BeforeInstallPromptEvent) {
  // 阻止浏览器默认的安装提示
  e.preventDefault()

  // 如果应用已安装或不应该显示提示，则返回
  if (isAppInstalled() || !shouldShowInstallPrompt()) {
    return
  }

  // 保存事件，稍后使用
  deferredPrompt.value = e

  // 延迟显示提示，给用户一些时间浏览应用
  setTimeout(() => {
    showInstallPrompt.value = true
  }, 3000)
}

// 安装应用
async function installApp() {
  if (!deferredPrompt.value) {
    // 如果没有 beforeinstallprompt 事件，显示手动安装指引
    showManualInstallGuide()
    return
  }

  try {
    // 显示安装提示
    await deferredPrompt.value.prompt()

    // 等待用户选择
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      showNotify({ type: 'success', message: '安装成功！' })
    }

    // 清理
    deferredPrompt.value = null
    showInstallPrompt.value = false
  }
  catch (error) {
    console.error('安装失败:', error)
    showNotify({ type: 'danger', message: '安装失败，请重试' })
  }
}

// 稍后安装
function installLater() {
  localStorage.setItem('pwa-install-later', new Date().toISOString())
  showInstallPrompt.value = false
}

// 关闭安装提示
function dismissInstall() {
  localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
  showInstallPrompt.value = false
}

// 显示手动安装指引
function showManualInstallGuide() {
  const userAgent = navigator.userAgent.toLowerCase()
  let message = ''

  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    message = '请点击地址栏右侧的"安装"图标'
  }
  else if (userAgent.includes('safari')) {
    message = '请点击分享按钮，然后选择"添加到主屏幕"'
  }
  else if (userAgent.includes('firefox')) {
    message = '请点击地址栏右侧的"安装"图标'
  }
  else {
    message = '请在浏览器菜单中选择"添加到主屏幕"'
  }

  showNotify({
    type: 'primary',
    message,
    duration: 5000,
  })

  showInstallPrompt.value = false
}

onMounted(() => {
  // 监听 beforeinstallprompt 事件
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

  // 监听应用安装事件
  window.addEventListener('appinstalled', () => {
    showNotify({ type: 'success', message: '应用已成功安装到主屏幕！' })
    localStorage.removeItem('pwa-install-dismissed')
    localStorage.removeItem('pwa-install-later')
  })
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
})

// 暴露方法给父组件
defineExpose({
  showInstallPrompt: () => {
    if (!isAppInstalled()) {
      showInstallPrompt.value = true
    }
  },
})
</script>

<template>
  <van-overlay
    v-if="showInstallPrompt"
    :show="showInstallPrompt"
    class="install-prompt-overlay"
    @click="dismissInstall"
  >
    <div class="install-prompt" @click.stop>
      <div class="install-header">
        <div class="app-icon">
          <img src="/pwa/logo_192x192.png" alt="PKBET">
        </div>
        <div class="app-info">
          <h3>添加到主屏幕</h3>
          <p>将 PKBET 添加到主屏幕，享受更好的使用体验</p>
        </div>
        <button class="close-btn" @click="dismissInstall">
          <van-icon name="cross" />
        </button>
      </div>

      <div class="install-benefits">
        <div class="benefit-item">
          <van-icon name="flash" />
          <span>更快的加载速度</span>
        </div>
        <div class="benefit-item">
          <van-icon name="offline" />
          <span>离线可用</span>
        </div>
        <div class="benefit-item">
          <van-icon name="desktop-o" />
          <span>原生应用体验</span>
        </div>
      </div>

      <div class="install-actions">
        <van-button
          class="install-btn"
          type="primary"
          size="large"
          @click="installApp"
        >
          立即安装
        </van-button>
        <van-button
          class="later-btn"
          size="large"
          @click="installLater"
        >
          稍后提醒
        </van-button>
      </div>
    </div>
  </van-overlay>
</template>

<style scoped lang="scss">
.install-prompt-overlay {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 10000;
}

.install-prompt {
  background: white;
  border-radius: 16px 16px 0 0;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  margin: 0 16px;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);

  .dark & {
    background: var(--van-gray-8);
    color: white;
  }
}

.install-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;

  .app-icon {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .app-info {
    flex: 1;

    h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--van-text-color);
    }

    p {
      margin: 0;
      font-size: 14px;
      color: var(--van-text-color-2);
      line-height: 1.4;
    }
  }

  .close-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 32px;
    height: 32px;
    border: none;
    background: var(--van-gray-2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .dark & {
      background: var(--van-gray-7);
      color: white;
    }

    &:hover {
      background: var(--van-gray-3);

      .dark & {
        background: var(--van-gray-6);
      }
    }
  }
}

.install-benefits {
  margin-bottom: 24px;

  .benefit-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    color: var(--van-text-color-2);
    font-size: 14px;

    .van-icon {
      color: var(--van-primary-color);
      font-size: 16px;
    }
  }
}

.install-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .install-btn {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    font-weight: 600;
  }

  .later-btn {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    background: transparent;
    color: var(--van-text-color-2);
    border: 1px solid var(--van-border-color);

    &:hover {
      background: var(--van-gray-1);

      .dark & {
        background: var(--van-gray-7);
      }
    }
  }
}

@media (max-width: 480px) {
  .install-prompt {
    margin: 0;
    border-radius: 16px 16px 0 0;
  }
}
</style>
