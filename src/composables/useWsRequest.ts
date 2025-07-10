import PKwebsocket from '@/web-base/socket/Ws'
import eventBus from '@/web-base/socket/eventBus'
import type { WsEvents } from '@/types/ws-events'

/**
 * 基于 mitt 与 Ws 封装的请求函数，支持 async/await
 * @param packet   通过 NetPacket.xx() 构造的请求体
 * @param event    对应服务器返回事件常量，来自 WsEventName
 * @param needLogin 是否需要登录，默认 false
 * @param timeout  超时时间（ms），默认 10s
 */
export function wsRequest<K extends keyof WsEvents>(
  packet: any,
  event: K,
  needLogin = false,
  timeout = 10_000,
): Promise<WsEvents[K]> {
  return new Promise((resolve, reject) => {
    // 超时处理
    const timer = setTimeout(() => {
      eventBus.off(event, handler as any)
      reject(new Error(`WebSocket request timeout: ${String(event)}`))
    }, timeout)

    // 单次回调
    function handler(payload: WsEvents[K]) {
      clearTimeout(timer)
      eventBus.off(event, handler as any)
      resolve(payload)
    }

    // 绑定事件
    eventBus.on(event, handler as any)

    // 发包，写入回调名方便重连补发
    PKwebsocket.instance.send(packet, needLogin, {
      callbackName: String(event),
    })
  })
}
