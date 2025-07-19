// 向后兼容导出
// 保持 getMsgType 函数的独立导出
import { NetMsgType } from '@/web-base/netBase/NetMsgType'

export { WebSocketClient } from './WebSocketClient'
export { QueueManager } from './QueueManager'
export { ConnectionManager } from './ConnectionManager'
export { MessageHandler } from './MessageHandler'
export { WS_CONFIG, WsConnectionState, WsEventType } from './config'
export type * from './types'

// 默认导出保持与原 Ws.ts 兼容
export { WebSocketClient as default } from './WebSocketClient'

// 兼容原有的导出
export { WebSocketClient as WsClass } from './WebSocketClient'

/**
 * 通过消息ID获取消息类型名称
 * @param msgID 消息ID
 * @returns 消息类型名称
 */
export function getMsgType(msgID: number): string {
  const msgType: any = NetMsgType.msgType
  for (const key in msgType) {
    if (msgType[key] === msgID) {
      return key
    }
  }
  return 'unknownType'
}
