import { defineStore } from 'pinia'
import { Local } from '@/web-base/utils/storage'
// import { i18n } from '@/languages';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
interface UserState {
  isLogin: boolean
  isReg: boolean
  isRegQuit: boolean
  isForget: boolean
  isNotice: boolean
  noticeList: any
  // isSilder: boolean,
  info: TUserInfo // 用户详情
  loginInfo: any // 登录详情
  roleInfo: TRoleInfo // 角色详情
  VIPinfo: TVIPInfo // vip详情
  myEmail: any // 邮箱列表
  wsOpen: boolean
  allCollected: any
  appHeight: number
  currencyRate: any // 未登录汇率
  shopInfoData: any
  bankCardInfoList: any
  bonusData: any
}

export const useUserStore = defineStore('user', {

  state: (): UserState => ({
    appHeight: (window.visualViewport ? window.visualViewport.height : window.innerHeight),
    wsOpen: false,
    isLogin: false,
    isReg: false,
    isRegQuit: false,
    isForget: false,
    isNotice: false, // 公告开关
    noticeList: [], // 公告列表
    info: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo') as string) as TUserInfo : {},
    loginInfo: null,
    VIPinfo: sessionStorage.getItem('VIPinfo') ? JSON.parse(sessionStorage.getItem('VIPinfo') as string) as TVIPInfo : {},
    allCollected: [],
    roleInfo: sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo') as string) as TRoleInfo
      : {
          currencyrate: 0,
          nickname: '',
          money: 0,
          bank_money: 0,
          head_photo: '',
          vip_lv: 0,
          id: '',
        },
    myEmail: {
      email_id_list: [],
      hasNoRead: false, // 是否有未读消息
      hasNoReceive: false, // 是否有领取的奖励邮件
      list: [], // 消息中心数据
      rewardList: [], // 奖励邮箱数据
      email_readed: [], // 是否已读数据
      email_unget: [], // 未领取数据
    },
    bonusData: {
      type: 0,
      related_id: [],
    },
    currencyRate: 0,
    shopInfoData: {}, // 充值方式列表数据
    bankCardInfoList: {}, // 提现方式列表数据
  }),
  actions: {
    async setWsOpen(value: boolean) {
      this.wsOpen = value
    },
    setAppHeight(value: number) {
      this.appHeight = this.appHeight + value
    },
    async setShopInfoData(value: any) {
      this.shopInfoData = value
    },
    async setBankCardInfoData(value: any) {
      this.bankCardInfoList = value
    },
    // 获取标签下拉选择框数据
    async setLogin(value: boolean) {
      this.isLogin = value
    },
    async setReg(value: boolean) {
      this.isReg = value
    },
    async setRegQuit(value: boolean) {
      this.isRegQuit = value
    },
    async setForget(value: boolean) {
      this.isForget = value
    },
    async setNotice(value: boolean) {
      this.isNotice = value
    },
    async setNoticeList(value: boolean) {
      this.noticeList = value
    },
    async setBonusData(info: any) {
      this.bonusData = info
    },
    async setEmailList(info: any) {
      if (!info) {
        this.myEmail = {
          email_id_list: [],
          hasNoRead: false, // 是否有未读消息
          hasNoReceive: false, // 是否有领取的奖励邮件
          list: [], // 消息中心数据
          rewardList: [], // 奖励邮箱数据
          email_readed: [], // 是否已读数据
          email_unget: [], // 未领取数据
        }
      }
      else {
        this.myEmail = info
      }
      // this.emailList = info
    },
    async getUserLoginInfo(info?: any) {
      if (info) {
        Local.set('user', info)
        this.loginInfo = info
      }
      else {
        this.loginInfo = Local.get('user')
      }
    },

    async getInfo(userInfo: any) {
      this.info = userInfo
      this.info.hideString = '******'
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    async getVIPInfo(userInfo: TVIPInfo) {
      this.VIPinfo = userInfo
      sessionStorage.setItem('VIPinfo', JSON.stringify(userInfo))
    },
    async getRoleInfo(roleInfo: TRoleInfo) {
      sessionStorage.setItem('roleInfo', JSON.stringify(roleInfo))
      this.roleInfo = roleInfo
      Local.set('roleInfo', roleInfo)
      Local.set('deviceid', roleInfo?.id || '')
    },
    async getCurrencyRate(data: any) {
      this.currencyRate = Number(data.currency_rate)
    },
    async getCollected(data: any) {
      this.allCollected = data?.map((e: any) => `${e.agent_id}-${e.game_id}`)
    },
    addOrDeleteCollectedKey(key: string) {
      if (this.allCollected.includes(key)) {
        this.allCollected = this.allCollected.filter((e: string) => e !== key)
      }
      else {
        this.allCollected.push(key)
      }
    },
  },
  getters: {
    token(state) {
      return state.loginInfo ? state.loginInfo.token : null
    },
    userInfo(state) {
      return state.loginInfo || {}
    },
    isLocalLoggedIn(state) { // 是否有本地登录信息
      if (state.loginInfo && state.loginInfo.token)
        return true
      return false
    },
  },
})

export default useUserStore
