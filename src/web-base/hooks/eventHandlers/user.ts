// 用户相关事件处理函数

import { useUserStore } from '@/stores/modules/user'
import { i18n } from '@/utils/i18n'
import { NetPacket } from '@/web-base/netBase/NetPacket'
import { getDeviceId } from '@/web-base/network/Utils'
import { NetEnumDef } from '@/web-base/netBase/NetEnumDef'
import { NET_VERSION } from '@/constants'
import { IP } from '@/web-base/utils/useStoreMethods'
import { WebSocketClient } from '@/web-base/socket'
import router from '@/router'
import type {
  DepositSuccessData,
  LoginResultData,
  UserInfoData,
  VersionCheckResult,
} from './types'

/* 余额变化1 */
export async function handleUpdateMoney1(data: UserInfoData) {
  console.error('余额变化1', data)
}

/* 余额变化2 */
export async function handleUpdateMoney2(data: UserInfoData) {
  console.error('余额变化2', data)
}

/* 返回的用户角色详情 */
export async function handleRoleInfo(data: UserInfoData) {
  console.error('返回的用户角色信息', data)
}

/* 返回的用户基础信息 */
export async function handleUserInfo(data: UserInfoData) {
  console.error('返回的用户基础信息', data)
}

/* 返回的用户会员信息 */
export async function handleVipInfo(data: UserInfoData) {
  console.error('返回的用户会员信息', data)
}

/* 充值成功，弹出提示 */
export async function handleDepositSuc(data: DepositSuccessData) {
  if (data?.amount) {
    // showNotify.success(t("deposit_page_depSuccess")); // 充值成功需要弹出提示
  }
}

/* 版本检测 */
export function handleVersionCheck(res: VersionCheckResult) {
  const userStore = useUserStore()

  if (res.result === 2) { // 版本信息异常
    showToast(i18n.global.t('home_all_version_error'))
    setInterval(() => {
      showToast(i18n.global.t('home_all_version_error'))
    }, 6000)
    return
  }
  // 如果本地已经登录了，那么同步服务端状态
  if (userStore.token) {
    syncLoginStatusFromServe()
  }
}

/* 登录成功，需要同步服务器登录状态 */
export function handleLoginNotify(res: ResNodifyLoginPacket) {
  const userStore = useUserStore()

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
}

/* 监听登录成功，然后释放登录等待池 */
export function handleLoginResult(res: LoginResultData) {
  const userStore = useUserStore()

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
      showToast(i18n.global.t('home_all_login_error'))
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
}

export async function syncLoginStatusFromServe() {
  const userStore = useUserStore()
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

declare function showToast(message: string): void
