export interface SlotsMatchListPayload {
  list: any[]
}

export interface VersionCheckPayload {
  version: number
  result: number
}

// 统一事件名，避免魔法字符串
export const WsEventName = {
  SlotsMatchList: 'msg_notify_slots_match_list',
  CheckVersion: 'msg_notify_check_version',
  RepeatLogin: 'msg_notify_repeat_login',
} as const

export type WsEventNameType = typeof WsEventName[keyof typeof WsEventName]

// 用常量作为键，确保类型一致且易于重构
export interface WsEvents {
  [WsEventName.SlotsMatchList]: SlotsMatchListPayload
  [WsEventName.CheckVersion]: VersionCheckPayload
  [WsEventName.RepeatLogin]: any
  // 其他事件可按需继续补充 ↓
  [event: string]: any
  [event: symbol]: any
}
