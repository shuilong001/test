import router from '@/router'
import eventBus from '@/web-base/socket/eventBus'
import { useUserStore } from '@/stores/modules/user'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { NetPacket } from '@/web-base/netBase/NetPacket'
import { getDeviceId } from '@/web-base/net/Utils'
import { IP } from '@/web-base/utils/useStoreMethods'
import PKwebsocket from '@/web-base/socket/Ws'
import { NetEnumDef } from '@/web-base/netBase/NetEnumDef'
import { useSystemStore } from '@/stores/modules/system'
import { usePageStore } from '@/stores/modules/page'
import { NET_VERSION } from '@/constants'

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
    PKwebsocket.instance.init()
  }
  /* 监听一些全局事件 */
  function initEventBus() {
    const userStore = useUserStore()
    const systemStore = useSystemStore()
    const pageStore = usePageStore()
    const { t } = useI18n()
    eventBus.on('msg_notify_check_version', (res: any) => { // 版本检测
      console.log('msg_notify_check_version--res: ', res)
      if (res.result === 2) { // 版本信息异常
        showToast(t('home_all_version_error'))
        setInterval(() => {
          showToast(t('home_all_version_error'))
        }, 6000)
        return
      }
      // 如果本地已经登录了，那么同步服务端状态
      if (userStore.token) {
      // 登录服务器
        console.error('登录服务器11')
        syncLoginStatusFromServe()
      }
    })
    eventBus.on('msg_nodify_login', (res: ResNodifyLoginPacket) => { // 登录成功，需要同步服务器登录状态
      if (res.code === 1) {
      // 登录服务器
        console.error('登录服务器22')
        userStore.setLoginInfo(res)
        syncLoginStatusFromServe()
        // 发送邀请码
        const agent_id = localStorage.getItem('agent_id')
        if (Number(agent_id)) {
          const rq = NetPacket.req_set_invitecode()
          rq.superior_id = agent_id as string
          PKwebsocket.instance.send(rq, true)
        }
      }
    })

    eventBus.on('msg_notify_login_result', (res: any) => { // 监听登录成功，然后释放登录等待池
      sessionStorage.setItem('dis_repeat_login', '')
      if (res && res.result === 1) { // 登录成功
        systemStore.setLoggedIn(true)
        // pageStore.setPageLoading(false)
        setTimeout(() => {
        // 同步用户数据
        // 同步用户数据
          userStore.getUserInfo()

          // 同步会员信息
          userStore.getVIPInfo()

          pageStore.setReConnectWs(false)
          // 我的收藏
          // userStore.getUserCollected()
        }, 1000)
        setTimeout(() => {
          if (!systemStore.isWsLogin)
            return
          PKwebsocket.instance.sendAll(true)
        }, 2000)
      }
      else { // 登录失败，清空缓存，退出登录状态
        if (!res.hideTip) { // 主动触发时不用提示信息
          showToast(t('home_all_login_error'))
        }
        setTimeout(() => {
          userStore.logout()
          systemStore.setWsConnected(false)
          router.replace({
            path: '/',
          })
          setTimeout(() => {
            PKwebsocket.instance.closeWs()
          })
        }, res.hideTip ? 400 : 1000)
      }
    })
    // 监听未知的事件
    eventBus.on('unknownType', (res) => {
      console.error('-- 接收到未知消息 --', res)
    })

    async function syncLoginStatusFromServe() {
      console.error('同步登录状态')
      const res = userStore.loginInfo
      // 同步登录状态
      const tb_req = NetPacket.req_role_login_with_ip()
      tb_req.uid = String(res.user_id)
      tb_req.server_id = 2
      tb_req.token = res.token
      tb_req.type = NetEnumDef.connect_type.re_connect
      tb_req.version = NET_VERSION
      tb_req.device_id = await getDeviceId()
      tb_req.ip = await IP()
      PKwebsocket.instance.send(tb_req, false)
      // 记录一个标识，当在登录成功前 收到  msg_notify_repeat_login 消息，则忽略。
      // 登录成功后 清除这个标识
      sessionStorage.setItem('dis_repeat_login', '1')
    }
  }
  function cleanupEventBus() {
    eventBus.off('msg_notify_check_version')
    eventBus.off('msg_nodify_login')
    eventBus.off('msg_notify_login_result')
    eventBus.off('unknownType')
  }
  return { getAppSetting, initPKwebsocket, initEventBus, cleanupEventBus }
}
