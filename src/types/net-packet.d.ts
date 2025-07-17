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
// {
//   "result": 1,
//   "full_name": "mk123456",
//   "email": "",
//   "currency": 1,
//   "country": 0,
//   "usdt_rate": 24030,
//   "real_name": "",
//   "mobile": "",
//   "account_type": 3
// }
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
declare module '@/web-base/netBase/NetPacket' {
  /**
   * 登录请求包
   */
  function req_login(): ReqLoginPacket
  // 其余 NetPacket.xx() 可在此处按需追加声明
}
