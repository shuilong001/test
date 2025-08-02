import { defineStore } from 'pinia'

import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { WebSocketClient } from '@/web-base/socket'

interface UserState {
  // 登录信息
  loginInfo: Ref<ResNodifyLoginPacket | null>
  // vip信息
  vipInfo: Ref<ResVipInfo | null>
  // 用户信息
  userInfo: Ref<ResUserInfo | null>
  // 用户角色信息
  roleInfo: Ref<ResRoleInfo | null>
  // 用户token
  token: ComputedRef<string>
  // 是否登录
  isLogin: ComputedRef<boolean>
  // 设置登录信息
  setLoginInfo: (value: ResNodifyLoginPacket) => void
  // 获取用户登录信息
  getUserLoginInfo: (value: ReqLoginPacket) => Promise<ResNodifyLoginPacket>
  // 获取用户信息
  getUserInfo: () => Promise<void>
  // 获取VIP信息
  getVIPInfo: () => Promise<void>
  // 获取用户收藏
  getUserCollected: () => Promise<void>
  // 登出
  logout: () => void
}

export const useUserStore = defineStore('user-store', (): UserState => {
  const loginInfo = ref<ResNodifyLoginPacket | null>(null)
  const vipInfo = ref<ResVipInfo | null>(null)
  const userInfo = ref<ResUserInfo | null>(null)
  const roleInfo = ref<ResRoleInfo | null>(null)

  const token = computed(() => loginInfo.value?.token)
  const isLogin = computed(() => !!loginInfo.value?.token && !!userInfo.value?.full_name)

  const setLoginInfo = (value: ResNodifyLoginPacket) => {
    loginInfo.value = value
  }

  const getUserLoginInfo = async (value: ReqLoginPacket) => {
    return await wsRequest<ResNodifyLoginPacket, ReqLoginPacket>({
      data: value,
      msgId: NetMsgType.msgType.msg_req_login,
      callbackId: NetMsgType.msgType.msg_nodify_login,
    })
  }

  const getUserInfo = async () => {
    userInfo.value = await wsRequest<ResUserInfo, void>({
      msgId: NetMsgType.msgType.msg_notify_user_info,
      needLogin: true,
    })
  }

  const getVIPInfo = async () => {
    vipInfo.value = await wsRequest<ResVipInfo, void>({
      msgId: NetMsgType.msgType.msg_notify_vip_info,
      needLogin: true,
    })
  }

  const getUserCollected = async () => {
    return await wsRequest<void, void>({
      msgId: NetMsgType.msgType.msg_notify_req_my_games,
      needLogin: true,
    })
  }

  const logout = () => {
    loginInfo.value = null
    vipInfo.value = null
    userInfo.value = null
    roleInfo.value = null
    // 重新初始化WebSocket连接
    WebSocketClient.instance?.reInit()
  }

  return {
    loginInfo,
    vipInfo,
    userInfo,
    roleInfo,
    token,
    isLogin,
    setLoginInfo,
    getUserLoginInfo,
    getUserInfo,
    getVIPInfo,
    getUserCollected,
    logout,
  }
}, {
  persist: {
    storage: localStorage,
    key: 'user-store',
    pick: ['loginInfo', 'vipInfo', 'userInfo', 'roleInfo'],
  },
})
export default useUserStore
