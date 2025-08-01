// 事件处理相关类型定义

import type { EventHandler } from './eventConfig'

// 登录通知数据类型
export interface ResNodifyLoginPacket {
  code: number
  user_id: number
  token: string
}

// 登录结果数据类型
export interface LoginResultData {
  result: number
  hideTip?: boolean
}

// 版本检测结果类型
export interface VersionCheckResult {
  result: number
}

// 异地登录数据类型
export interface DiffOfflineData {
  ip?: string
  login_time?: number
  device_id?: string
  location?: string
}

// 系统通知数据类型
export interface SystemNoticeData {
  notice_list?: Array<{
    title: string
    content: string
    position: number
    priority: number
    type?: number
  }>
}

// 系统消息数据类型
export interface SystemMsgData {
  code: number
  Params?: any[]
  priority?: number
}

// 邮件信息数据类型
export interface EmailInfoData {
  list?: any[]
  rewardList?: any[]
  email_readed?: number
  email_unget?: number
  hasNoRead?: boolean
  hasNoReceive?: boolean
}

// 游戏URL结果数据类型
export interface GameUrlResultData {
  code: number
  url: string
  msg?: string
}

// 收藏操作结果数据类型
export interface CollectResultData {
  rlt: number
  collected?: number[]
}

// 用户信息数据类型
export interface UserInfoData {
  user_id?: number
  username?: string
  balance?: number
  [key: string]: any
}

// 充值成功数据类型
export interface DepositSuccessData {
  amount?: number
  [key: string]: any
}

// 事件监听器管理接口
export interface EventListenerManager {
  addEventListener: (eventType: string, handler: EventHandler) => void
  removeEventListener: (eventType: string, handler: EventHandler) => void
  removeAllEventListeners: () => void
}

// 事件清理函数类型
export type EventCleanupFunction = () => void
