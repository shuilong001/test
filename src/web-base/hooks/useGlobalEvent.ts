// 需要全局监听并处理的事件
import { useUserStore } from '@/stores/modules/user'
import { useI18n } from 'vue-i18n'
import { NetPacket } from '@/web-base/netBase/NetPacket'
import { getDeviceId } from '@/web-base/network/Utils'
import { NetEnumDef } from '@/web-base/netBase/NetEnumDef'
import { NET_VERSION } from '@/constants'
import { IP } from '@/web-base/utils/useStoreMethods'
import eventBus from '@/web-base/socket/eventBus'
import { WebSocketClient } from '@/web-base/socket'
import router from '@/router'

/* 异地登录回调 */
async function diffOfflineFunc(res: any) {
  // 您的账号上次在2024-05-28 19:20:02于xx的xx设备登录，如非本人操作，则密码可能泄露，建议您修改密码
  console.error('异地登录', res)
  res.ip && (await getIPAddress([res]))
  //   diffOfflineObj.value.show = true;
  //   diffOfflineObj.value.content = t("home_page_diffOfflineContent", {
  //     time: convertObjectToDateString(res.login_time),
  //     device: res.device_id ? getDeviceType(res.device_id) : "",
  //     ip: res.location,
  //   });
}

/* 打开游戏 */
async function gameUrlResult(message: any) {
  // 在游戏页面不需要做回调处理
  //   if (route.name == "openGame") {
  //     return false;
  //   }
  if (message.code !== 0) { // 打开失败
    // showToast.fail(message.msg);
    // Page(pinia).setThirdGameIsRequest(false)
    return
  }
  if (message.url.includes('<!doctype html>')) { // 获取gameUrl
    message.url = `data:text/html;charset=utf-8,${encodeURIComponent(
      String(message.url),
    )}`
  }
  Local.set('gameUrl', message.url)
  // 打开游戏

  // 自研游戏 如果当前还在游戏页面 主动断开ws
  //   if (["openGame", "game"].includes(route.name) && item.agentId === ZiYanGame) {
  //     PKwebsocket.instance.pauseWs()
  //   }
}

export function useGlobalEvent() {
  /* 监听一些全局事件 */
  function initEventBus() {
    const userStore = useUserStore()
    const { t } = useI18n()

    /* ----- 下方是后台主动推送的数据事件 ----- */

    // 异地登录提醒
    eventBus.on('msg_notify_diff_loc_login_notification', diffOfflineFunc)

    /* ----- 下方是发起协议后获得的数据事件 ----- */

    // 获取第三方游戏返回url（打开游戏）
    eventBus.on('msg_notify_3rd_game_login_result', gameUrlResult)

    /* ----- 下方是一些系统流程相关的事件 ----- */

    /* 版本检测 */
    eventBus.on('msg_notify_check_version', (res: any) => {
      if (res.result === 2) { // 版本信息异常
        showToast(t('home_all_version_error'))
        setInterval(() => {
          showToast(t('home_all_version_error'))
        }, 6000)
        return
      }
      // 如果本地已经登录了，那么同步服务端状态
      if (userStore.token) {
        syncLoginStatusFromServe()
      }
    })

    /* 登录成功，需要同步服务器登录状态 */
    eventBus.on('msg_nodify_login', (res: ResNodifyLoginPacket) => {
      if (res.code === 1) {
        userStore.setLoginInfo(res)
        syncLoginStatusFromServe()
        // 发送邀请码
        const agent_id = localStorage.getItem('agent_id')
        if (Number(agent_id)) {
          const rq = NetPacket.req_set_invitecode()
          rq.superior_id = agent_id as string
          WebSocketClient.instance.send(rq, true)
        }
      }
    })

    /* 监听登录成功，然后释放登录等待池 */
    eventBus.on('msg_notify_login_result', (res: any) => {
      sessionStorage.setItem('dis_repeat_login', '')
      if (res && res.result === 1) { // 登录成功
        // 同步用户数据
        userStore.getUserInfo()

        // 同步会员信息
        userStore.getVIPInfo()
        // 我的收藏
        // userStore.getUserCollected()
        WebSocketClient.instance.sendAll(true)
      }
      else { // 登录失败，清空缓存，退出登录状态
        if (!res.hideTip) { // 主动触发时不用提示信息
          showToast(t('home_all_login_error'))
        }
        setTimeout(() => {
          userStore.logout()
          router.replace({
            path: '/',
          })
          setTimeout(() => {
            WebSocketClient.instance.closeWs()
          })
        }, res.hideTip ? 400 : 1000)
      }
    })

    /* 未知消息类型 */
    eventBus.on('unknownType', (res) => {
      console.error('-- 接收到未知消息 --', res)
    })

    async function syncLoginStatusFromServe() {
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
      WebSocketClient.instance.send(tb_req, false)
      // 记录一个标识，当在登录成功前 收到  msg_notify_repeat_login 消息，则忽略。
      // 登录成功后 清除这个标识
      sessionStorage.setItem('dis_repeat_login', '1')
    }
  }

  return { initEventBus }
}
