import { defineStore } from 'pinia'

import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { WebSocketClient } from '@/web-base/socket'

interface UserState {
  // 登录信息
  loginInfo: ResNodifyLoginPacket
  // vip信息
  vipInfo: VipInfo
  // 用户信息
  userInfo: UserInfo
  // 用户角色信息
  roleInfo: RoleInfo
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

export interface VipInfo {
  total_bet_money: number
  current_vip_level: number
  last_month_vip_level: number
  gift_money_status: Gift_money_statu
  holiday_reward_status: Holiday_reward_statu
  mysterious_reward_status: number
  vip_level_reward_config: Vip_level_reward_config[]
  daily_rebate: number
}

interface RoleInfo {
  id: number
  nickname: string
  head_photo: string
  money: number
  vip_lv: number
  sex: number
  signature: string
  mobile: string
  bank_money: number
  password_state: number
  agent_level: number
  recharge_amount: number
  reserve0: number
  reserve1: number
  reserve2: number
  reserve3: number
  reserve4: number
  withdraw_pwd_status: number
  withdraw_pwd: string
  currencyrate: number
  currencyrate_fix: number
}
interface UserInfo {
  result: number
  full_name: string
  email: string
  currency: number
  country: number
  usdt_rate: number
  real_name: string
  mobile: string
  account_type: number
}

export interface Gift_money_statu {
  status: number
  money: number
}

export interface Holiday_reward_statu {
  status: number
  money: number
}

export interface Promotional_reward_statu {
  status: number
  money: number
}

export interface Vip_level_reward_config {
  level: number
  target_bet_money: number
  promotional_reward_status: Promotional_reward_statu
  gift_money_amount: number
  ratio: string
}
