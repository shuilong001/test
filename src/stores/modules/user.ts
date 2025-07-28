import { defineStore } from 'pinia'

import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { WebSocketClient } from '@/web-base/socket'

interface UserState {
  // 登录信息
  loginInfo: ResNodifyLoginPacket
  // vip信息
  vipInfo: ResVipInfo
  // 用户信息
  userInfo: ResUserInfo
  // 用户角色信息
  roleInfo: ResRoleInfo
}
export const useUserStore = defineStore('user-store', {
  state: (): UserState => ({
    loginInfo: null,
    vipInfo: null,
    userInfo: null,
    roleInfo: null,
  }),
  actions: {
    setLoginInfo(loginInfo: ResNodifyLoginPacket) {
      this.loginInfo = loginInfo
    },
    async getUserLoginInfo(loginInfo: ReqLoginPacket) {
      return await wsRequest<ResNodifyLoginPacket, ReqLoginPacket>({
        data: loginInfo,
        msgId: NetMsgType.msgType.msg_req_login,
        callbackId: NetMsgType.msgType.msg_nodify_login,
      })
    },
    async getUserInfo() {
      this.userInfo = await wsRequest({
        msgId: NetMsgType.msgType.msg_notify_user_info,
        needLogin: true,
      })
    },
    async getVIPInfo() {
      this.vipInfo = await wsRequest({
        msgId: NetMsgType.msgType.msg_notify_vip_info,
        needLogin: true,
      })
    },
    async getUserCollected() {
      const collected = await wsRequest({
        msgId: NetMsgType.msgType.msg_notify_req_my_games,
        needLogin: true,
      })
      this.collected = collected
    },
    logout() {
      this.loginInfo = null
      this.vipInfo = null
      this.userInfo = null
      this.roleInfo = null
      // 重新初始化WebSocket连接
      WebSocketClient.instance?.reInit()
    },
  },
  getters: {
    token(state) {
      return state.loginInfo ? state.loginInfo.token : null
    },
    // userInfo(state) {
    //   return state.loginInfo || {}
    // },
    // 是否有本地登录信息
    isLogin(state) {
      return state.loginInfo?.token && state.userInfo?.full_name
    },
  },
  persist: {
    key: 'user-store',
    storage: localStorage,
    pick: ['loginInfo', 'vipInfo', 'userInfo', 'roleInfo'],
  },
})

export default useUserStore
