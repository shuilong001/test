import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

/**
 * 嵌套页面使用的 hook，负责管理与 iframe 的通信和缓存
 *
 * @param {object} options 配置项
 * @param {object} options.iframeRef iframe 的引用，默认为 null
 * @param {string} options.iframeSrc iframe 的源地址，默认为空字符串
 * @returns {object} 返回一个对象，包含以下属性：
 *  - sendMessageToIframe: 向 iframe 发送消息的函数
 */
export function useNestedIframe({ iframeRef = null, iframeSrc = ref('') } = {}, onReceiveMessage) {
  const targetOrigin = ref('')
  // 设置允许的来源
  const allowedOrigins = computed(() => [targetOrigin.value])
  const isIframeLoaded = ref(false)

  // 计算 targetOrigin，当 iframeSrc 变化时更新
  watch(iframeSrc, (newSrc) => {
    try {
      const url = new URL(newSrc)
      targetOrigin.value = url.origin
    }
    catch (error) {
      console.warn('Invalid iframeSrc:', newSrc, error)
      targetOrigin.value = ''
    }
  }, { immediate: true })

  // 向 iframe 发送消息
  const sendMessageToIframe = (message) => {
    if (iframeRef?.value?.contentWindow) {
      iframeRef.value.contentWindow.postMessage(message, targetOrigin.value)
    }
    else {
      console.warn('iframeRef 未定义或 iframe 尚未加载')
    }
  }

  // 处理收到的消息
  const handleMessage = (event) => {
    const { origin, data } = event
    const isAllowedOrigin = !allowedOrigins.value.length || allowedOrigins.value.includes(origin)
    console.log(allowedOrigins.value, origin, 'isAllowedOriginisAllowedOrigin')
    if (!isAllowedOrigin) {
      console.warn(`收到来自未授权源 ${origin} 的消息，已忽略`)
      return
    }
    console.log(`收到ifram消息：${data}`)

    // if (data.type === 'ready') {
    //   console.log('收到 iframe ready 消息，发送初始化配置')
    //   sendMessageToIframe({ type: 'init' })
    // }

    onReceiveMessage?.(event)
  }

  // 清除缓存数据
  // const clearCacheData = () => {
  //   sendMessageToIframe({ type: 'clear-cache' })
  // }

  // 处理 iframe 加载完成事件
  const handleIframeLoad = () => {
    isIframeLoaded.value = true
    console.log('iframe 页面已加载')
  }

  // 监听消息事件
  onMounted(() => {
    window.addEventListener('message', handleMessage)
    if (iframeRef?.value) {
      iframeRef.value.addEventListener('load', handleIframeLoad)
    }
  })

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('message', handleMessage)
    if (iframeRef?.value) {
      iframeRef.value.removeEventListener('load', handleIframeLoad)
    }
  })

  return {
    sendMessageToIframe,
    isIframeLoaded,
  }
}
