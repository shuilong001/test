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

/* 公告消息 */
async function onHander_system_notice(message: any) {
  if (Local.get('show_notice') === 0) { // 不展示公告，只有手动登录时才展示
    return
  }
  Local.set('show_notice', 0)
  if (message.notice_list?.length) {
    const dialogList: any = message.notice_list.filter((item: any) => item.position === 1)
    const paomaList: any = message.notice_list.filter((item: any) => item.position === 0)
    // 弹窗公告
    let localIds = [] // 本地记录的不再显示
    try {
      localIds = JSON.parse(localStorage.getItem('readed_notice_ids') || '[]')
    }
    catch {
      localIds = []
    }
    const list: any = dialogList
      .filter((item: any) => !localIds.includes(item.title))
      .sort((a: any, b: any) => {
        return b.priority - a.priority
      })
    if (list.length) {
      // await getLocale(settings.value);
      // await user.setNoticeList(list);
      // user.setNotice(true);
      // noticeRef.value && noticeRef.value.open();
    }
    // 轮播公告
    paomaList.forEach((item: any) => {
      console.error('轮播公告', item)
      // page.setTextAnnouncementMore(t(item.title) + " - " + t(item.content));
    })
  }
}

/* 系统消息通知 */
async function onHandler_system_msg(m: any) {
  if (m.code === 903) {
    if (m.Params[0] === 1) {
      // 弹窗公告
      try {
        // const list: any = [
        //   {
        //     content: `${m.Params[3]}`,
        //     title: `${m.Params[2]}`,
        //     position: 1,
        //     priority: m.priority,
        //     type: m.Params[1],
        //   },
        // ];
        // await getLocale(settings.value);
        // await user.setNoticeList(list);
        // user.setNotice(true);
        // noticeRef.value && noticeRef.value.open();
      }
      catch { }
    }
  }
  else {
    if (m.Params && m.Params.length === 6) {
      // 跑马灯
      // ***[0]*** 在 [3] 获得 [4] 金币奖励！
      // const str = t("home_notice_mixtext", {
      //   user: `${m.Params[0]?.substr(0, 4)}***`,
      //   game: m.Params[3] ? t(m.Params[3]) : "",
      //   money: m.Params[4] ? Number(m.Params[4]).toLocaleString() : 0,
      // });
      // page.setTextAnnouncementMore(str);
    }
  }
}

/* 余额变化1 */
async function handleUpdateMoney1(data: any) {
  console.error('余额变化1', data)
}

/* 余额变化2 */
async function handleUpdateMoney2(data: any) {
  console.error('余额变化2', data)
}

/* 邮件列表 */
async function handleEmailInfo(rs: any) {
  console.error('返回的邮件列表', rs)
  /*
    list: 消息中心数据
    rewardList: 奖励邮箱数据
    email_readed: 已读
    email_unget: 未领取
    hasNoRead: 是否有未读邮件
    hasNoReceive: 是否有未领取奖励
  */
}

/* 新邮件 */
async function handleNewEmail(rs: any) {
  console.error('新邮件', rs)
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

/* 获取到的所有收藏的游戏id集合 */
async function resAllCollect(data: any) {
  console.error('获取到的收藏的游戏id集合', data)
  // await User(pinia).getCollected(data.collected);
}

/* 收藏/取消收藏游戏操作的反馈 */
const allCollected = computed(() => []) // 所有已收藏的数据
async function resCollect(data: any) {
  if (data.rlt === 0) {
    // 这里原来是根据 本地缓存的id 来判断是否收藏成功还是取消收藏 可以看看是否有更合理的方式
    console.error('收藏/取消收藏游戏操作的反馈', data, allCollected.value)
  }
  else if (data.rlt === 1) {
    // 收藏达到上限
  }
  else {
    // 未知错误
  }
}

/* 返回的用户角色详情 */
async function handleRoleInfo(data: any) {
  console.error('返回的用户角色信息', data)
}

/* 返回的用户基础信息 */
async function handleUserInfo(data: any) {
  console.error('返回的用户基础信息', data)
}

/* 返回的用户会员信息 */
async function handleVipInfo(data: any) {
  console.error('返回的用户会员信息', data)
}

/* 充值成功，弹出提示 */
async function handleDepositSuc(data: any) {
  if (data?.amount) {
    // showNotify.success(t("deposit_page_depSuccess")); // 充值成功需要弹出提示
  }
}

export function useGlobalEvent() {
  /* 监听一些全局事件 */
  function initEventBus() {
    const userStore = useUserStore()
    const { t } = useI18n()

    /* ----- 下方是后台主动推送的数据事件 ----- */

    // 异地登录提醒
    eventBus.on('msg_notify_diff_loc_login_notification', diffOfflineFunc)
    // 公告信息
    eventBus.on('msg_notify_send_system_notice', onHander_system_notice)
    // 系统消息
    eventBus.on('msg_notify_sys_msg', onHandler_system_msg)
    // 余额变化1
    eventBus.on('msg_notify_roleinfo_with_id', handleUpdateMoney1)
    // 余额变化2
    eventBus.on('msg_notify_money_update2', handleUpdateMoney2)
    // 返回的邮件列表
    eventBus.on('msg_notify_email_list', handleEmailInfo)
    // 监听新邮件
    eventBus.on('msg_notify_new_email', handleNewEmail)

    /* ----- 下方是发起协议后获得的数据事件 ----- */

    // 获取到的第三方游戏返回url（打开游戏）
    eventBus.on('msg_notify_3rd_game_login_result', gameUrlResult)
    // 获取到的收藏的游戏id集合
    eventBus.on('msg_notify_all_collected', resAllCollect)
    // 添加到收藏的反馈
    eventBus.on('msg_notify_modify_collect', resCollect)
    // 返回的用户角色信息
    eventBus.on('msg_notify_roleinfo_msg', handleRoleInfo)
    // 返回的用户基础信息
    eventBus.on('msg_notify_user_info', handleUserInfo)
    // 返回的用户会员信息
    eventBus.on('msg_notify_vip_info', handleVipInfo)
    // 充值成功
    eventBus.on('msg_notify_recharge_success_from_third', handleDepositSuc)

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
