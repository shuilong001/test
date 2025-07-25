import router from '@/router'
import eventBus from '@/web-base/socket/eventBus'
import { showToast } from 'vant'
import { usePageStore } from '@/stores/modules/page'
import { WebSocketClient } from '@/web-base/socket'

export function useAppSetting() {
  const getAppSetting = async () => {
    const pageStore = usePageStore()
    let appSetting = pageStore.settings || {}
    const query = router.currentRoute.value.query
    const c = query.c || sessionStorage.getItem('c') || import.meta.env.VITE_SERVER_NAME || 'develop'
    const settingUrl = `https://config.pkbet.cloud/pkbet_${c}.json`
    if (!appSetting.third_game_manage) {
      const settingsRes1 = await fetch(`${settingUrl}?${new Date().getTime()}`)
      if (!settingsRes1.ok) {
        return showToast('config_json_err')
      }
      appSetting = await settingsRes1.json()
    }
    else {
      const settingsRes1 = await fetch(`${settingUrl}?${new Date().getTime()}`)
      if (!settingsRes1.ok) {
        return showToast('config_json_err')
      }
      appSetting = await settingsRes1.json()
    }
    appSetting._backend_upload = appSetting.backend_upload // 保留原始的 backend_upload
    appSetting.backend_upload = appSetting.media_url
    pageStore.setSettings(appSetting)
  }
  const initPKwebsocket = async () => {
    await getAppSetting()
    // 确保WebSocket客户端实例在连接之前被创建，这样事件监听器会被正确设置
    const wsClient = WebSocketClient.instance
    await wsClient.init()
  }

  function cleanupEventBus() {
    eventBus.off('msg_notify_check_version')
    eventBus.off('msg_nodify_login')
    eventBus.off('msg_notify_login_result')
    eventBus.off('unknownType')
  }
  return { getAppSetting, initPKwebsocket, cleanupEventBus }
}
