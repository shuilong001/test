export interface PacketBase {
  getMsgID: () => number
  encode: (buf: Uint8Array) => void
  build: (buf: Uint8Array) => number
  [key: string]: any
}

export interface ReqLoginPacket {
  /** 登录类型（5: 邮箱 4: 手机号） */
  login_type: 5 | 4
  username: string
  password: string
  device_id: string
  device_model: string
  channel_id: number
  aaa: string
  bbb: string
  ip: string
  captcha: string
}
export interface ResLoginPacket {
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

export interface ResNodifyLoginPacket {
  code: number
  message: string
  user_id: number
  token: string
  account_type: number
  is_default_bankpwd: number
  tokenid: string
  newguidestate: number
  ipGroupName: string
}

export interface ResNodifyUserInfo {
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

export interface ResMyGames {
  recently: {
    agent_id: number
    game_id: string
  }[]
  collected: {
    agent_id: number
    game_id: string
  }[]
}

export interface ResGamesFullInfo {
  /** 游戏ID */
  three_gameid: {
    agent_id: number
    game_id: string
  }
  /** 庄家优势 */
  dealer_advantage: string
  /** 返奖率（RTP） */
  rtp: string
  /** 转轴，例如 "5X4" */
  reels: string
  /** 最大盈利 */
  max_win: number
  /** 波动性（1.高、2.中、3.低） */
  volatility: number
  /** 最小投注 */
  min_bet: number
  /** 最大投注 */
  max_bet: number
  /** 当日最高盈利 */
  daily_max_win: number
  /** 更新时间 */
  updated_at: string
  /** 游戏评分 举例"[3,0,0,0,0,3,5]" 1.点赞总人数 2.1星人数 3.2星人数  4.3星人数 5.4星人数  6.5星人数  7.自己评分数 */
  rating: string
  /** 货币类型 */
  money_type: string
  /** 游戏状态 0,表示未点赞，未收藏  1,表示已点赞，未收藏  2,表示未点赞，已收藏  3,表示已点赞，已收藏 */
  game_status: number
  /** 点赞数 */
  like_count: number
  /** 收藏数 */
  favorite_count: number
  /** 是否是自研游戏 1自研 */
  custom_game: number
}

interface Gift_money_statu {
  status: number
  money: number
}

interface Holiday_reward_statu {
  status: number
  money: number
}

interface Promotional_reward_statu {
  status: number
  money: number
}

interface Vip_level_reward_config {
  level: number
  target_bet_money: number
  promotional_reward_status: Promotional_reward_statu
  gift_money_amount: number
  ratio: string
}

export interface ResVipInfo {
  total_bet_money: number
  current_vip_level: number
  last_month_vip_level: number
  gift_money_status: Gift_money_statu
  holiday_reward_status: Holiday_reward_statu
  mysterious_reward_status: number
  vip_level_reward_config: Vip_level_reward_config[]
  daily_rebate: number
}
export interface ResUserInfo {
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

export interface ResRoleInfo {
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
