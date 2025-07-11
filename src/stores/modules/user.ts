import { defineStore } from 'pinia'

import { NetMsgType } from '@/web-base/netBase/NetMsgType'

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
      const res = await wsRequest<ReqLoginPacket, ResLoginPacket>(loginInfo, NetMsgType.msgType.msg_req_login)
      console.log('getUserLoginInfo----res: ', res)
      this.loginInfo = res
    },
    async getUserInfo() {
      const userInfo = await wsRequest({}, NetMsgType.msgType.msg_notify_user_info, true)
      console.log('userInfo-----: ', userInfo);
      this.userInfo = userInfo
    },
    async getVIPInfo() {
      const vipInfo = await wsRequest({}, NetMsgType.msgType.msg_notify_vip_info, true)
      this.vipInfo = vipInfo
    },
    async getUserCollected() {
      const collected = await wsRequest({}, NetMsgType.msgType.msg_notify_req_my_games, true)
      this.collected = collected
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

interface LoginInfo {
  uid: string
  server_id: number
  token: string
  type: number
  version: number
  device_id: string
  ip: string
  flag_id: number
  flag_type: number
}

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
// req_login.username = form.value.username;
// req_login.login_type = _isEmail ? 5 : 4;
// req_login.password = form.value.password;
// req_login.captcha = v;
// req_login.device_id = await getDeviceId();
// req_login.device_model = device_model;
// req_login.channel_id = Number(route.query.channel_id) || 123;
// req_login.aaa = aaa.toString();
// req_login.bbb = bbb;
// req_login.ip = await IP();

export interface LoginInfoRequest {
  username: string
  password: string
  // 登录类型 5: 邮箱 4: 手机号
  login_type: 5 | 4
  // 验证码
  captcha: string
  // 设备ID
  device_id: string
  // 设备型号
  device_model: string
  // 渠道ID
  channel_id: number
  // ip
  ip: string
  // 随机数
  aaa: string
  // 随机数
  bbb: string
}
