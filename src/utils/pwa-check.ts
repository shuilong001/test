/**
 * PWA 功能检查工具
 */

export interface PWACheckResult {
  serviceworker: boolean
  manifest: boolean
  installable: boolean
  standalone: boolean
  cacheStorage: boolean
  pushNotifications: boolean
  backgroundSync: boolean
  offlineReady: boolean
  details: {
    serviceWorkerRegistered: boolean
    serviceWorkerActive: boolean
    manifestFound: boolean
    manifestValid: boolean
    installPromptAvailable: boolean
    isStandalone: boolean
    cacheStorageSupported: boolean
    pushNotificationsSupported: boolean
    backgroundSyncSupported: boolean
    isOnline: boolean
    cachedResources: string[]
  }
}

/**
 * 检查 PWA 功能
 */
export async function checkPWAFeatures(): Promise<PWACheckResult> {
  const result: PWACheckResult = {
    serviceworker: false,
    manifest: false,
    installable: false,
    standalone: false,
    cacheStorage: false,
    pushNotifications: false,
    backgroundSync: false,
    offlineReady: false,
    details: {
      serviceWorkerRegistered: false,
      serviceWorkerActive: false,
      manifestFound: false,
      manifestValid: false,
      installPromptAvailable: false,
      isStandalone: false,
      cacheStorageSupported: false,
      pushNotificationsSupported: false,
      backgroundSyncSupported: false,
      isOnline: navigator.onLine,
      cachedResources: [],
    },
  }

  // 检查 Service Worker
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        result.details.serviceWorkerRegistered = true
        if (registration.active) {
          result.details.serviceWorkerActive = true
          result.serviceworker = true
        }
      }
    }
    catch (error) {
      console.warn('Service Worker 检查失败:', error)
    }
  }

  // 检查 Manifest
  try {
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement
    if (manifestLink) {
      result.details.manifestFound = true

      // 尝试获取 manifest 内容
      const response = await fetch(manifestLink.href)
      if (response.ok) {
        const manifest = await response.json()
        if (manifest.name && manifest.icons && manifest.start_url) {
          result.details.manifestValid = true
          result.manifest = true
        }
      }
    }
  }
  catch (error) {
    console.warn('Manifest 检查失败:', error)
  }

  // 检查是否可安装
  result.details.installPromptAvailable = 'beforeinstallprompt' in window
  result.installable = result.details.installPromptAvailable

  // 检查是否在独立模式运行
  result.details.isStandalone
    = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone
      || document.referrer.includes('android-app://')
  result.standalone = result.details.isStandalone

  // 检查 Cache Storage
  if ('caches' in window) {
    result.details.cacheStorageSupported = true
    try {
      const cacheNames = await caches.keys()
      if (cacheNames.length > 0) {
        result.cacheStorage = true

        // 获取缓存资源
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const requests = await cache.keys()
          result.details.cachedResources.push(
            ...requests.map(req => `[${cacheName}] ${req.url}`),
          )
        }
      }
    }
    catch (error) {
      console.warn('Cache Storage 检查失败:', error)
    }
  }

  // 检查推送通知
  if ('Notification' in window && 'PushManager' in window) {
    result.details.pushNotificationsSupported = true
    result.pushNotifications = Notification.permission === 'granted'
  }

  // 检查后台同步
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    result.details.backgroundSyncSupported = true
    result.backgroundSync = true
  }

  // 检查离线可用性
  result.offlineReady = result.serviceworker && result.cacheStorage

  return result
}

/**
 * 生成 PWA 检查报告
 */
export function generatePWAReport(checkResult: PWACheckResult): string {
  const { details } = checkResult

  let report = '=== PWA 功能检查报告 ===\n\n'

  // 基础功能
  report += '📋 基础功能:\n'
  report += `  Service Worker: ${checkResult.serviceworker ? '✅' : '❌'}\n`
  report += `  Manifest: ${checkResult.manifest ? '✅' : '❌'}\n`
  report += `  可安装: ${checkResult.installable ? '✅' : '❌'}\n`
  report += `  独立模式: ${checkResult.standalone ? '✅' : '❌'}\n\n`

  // 高级功能
  report += '🚀 高级功能:\n'
  report += `  缓存存储: ${checkResult.cacheStorage ? '✅' : '❌'}\n`
  report += `  推送通知: ${checkResult.pushNotifications ? '✅' : '❌'}\n`
  report += `  后台同步: ${checkResult.backgroundSync ? '✅' : '❌'}\n`
  report += `  离线可用: ${checkResult.offlineReady ? '✅' : '❌'}\n\n`

  // 详细信息
  report += '📊 详细信息:\n'
  report += `  网络状态: ${details.isOnline ? '在线' : '离线'}\n`
  report += `  Service Worker 注册: ${details.serviceWorkerRegistered ? '是' : '否'}\n`
  report += `  Service Worker 激活: ${details.serviceWorkerActive ? '是' : '否'}\n`
  report += `  Manifest 文件: ${details.manifestFound ? '找到' : '未找到'}\n`
  report += `  Manifest 有效: ${details.manifestValid ? '是' : '否'}\n`
  report += `  安装提示可用: ${details.installPromptAvailable ? '是' : '否'}\n`
  report += `  缓存支持: ${details.cacheStorageSupported ? '是' : '否'}\n`
  report += `  推送通知支持: ${details.pushNotificationsSupported ? '是' : '否'}\n`
  report += `  后台同步支持: ${details.backgroundSyncSupported ? '是' : '否'}\n\n`

  // 缓存资源
  if (details.cachedResources.length > 0) {
    report += '💾 缓存资源:\n'
    details.cachedResources.slice(0, 10).forEach((resource) => {
      report += `  ${resource}\n`
    })
    if (details.cachedResources.length > 10) {
      report += `  ... 还有 ${details.cachedResources.length - 10} 个资源\n`
    }
    report += '\n'
  }

  // 建议
  report += '💡 建议:\n'
  if (!checkResult.serviceworker) {
    report += '  - 检查 Service Worker 注册和激活\n'
  }
  if (!checkResult.manifest) {
    report += '  - 检查 Manifest 文件配置\n'
  }
  if (!checkResult.cacheStorage) {
    report += '  - 检查缓存策略配置\n'
  }
  if (!checkResult.installable) {
    report += '  - 确保满足 PWA 安装条件\n'
  }

  return report
}

/**
 * 在控制台输出 PWA 检查结果
 */
export async function logPWAStatus() {
  console.group('🔍 PWA 功能检查')

  try {
    const result = await checkPWAFeatures()
    const report = generatePWAReport(result)

    console.log(report)
    console.log('原始数据:', result)
  }
  catch (error) {
    console.error('PWA 检查失败:', error)
  }

  console.groupEnd()
}

/**
 * 创建 PWA 状态面板
 */
export function createPWAStatusPanel(): HTMLElement {
  const panel = document.createElement('div')
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    font-family: monospace;
    font-size: 12px;
    max-width: 400px;
    max-height: 500px;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 10000;
  `

  panel.innerHTML = '<div>正在检查 PWA 功能...</div>'

  checkPWAFeatures().then((result) => {
    const report = generatePWAReport(result)
    panel.innerHTML = `<pre>${report}</pre>`

    // 添加关闭按钮
    const closeBtn = document.createElement('button')
    closeBtn.textContent = '关闭'
    closeBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
    `
    closeBtn.onclick = () => panel.remove()
    panel.appendChild(closeBtn as unknown as Node)
  })

  return panel
}

// 开发模式下自动检查
if (import.meta.env.DEV) {
  // 页面加载完成后延迟执行
  window.addEventListener('load', () => {
    setTimeout(logPWAStatus, 2000)
  })
}

// 导出全局方法供开发者调试使用
if (typeof window !== 'undefined') {
  (window as any).checkPWA = logPWAStatus;
  (window as any).showPWAPanel = () => {
    const panel = createPWAStatusPanel()
    document.body.appendChild(panel as unknown as Node)
  }
}
