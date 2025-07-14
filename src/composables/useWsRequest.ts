import { isEmpty, merge } from 'lodash-es'
import PKwebsocket, { getMsgType } from '@/web-base/socket/Ws'
import eventBus from '@/web-base/socket/eventBus'
import { NetPacket } from '@/web-base/netBase/NetPacket'
// PacketBase 类型在 types/net-packet.d.ts 中声明
import type { PacketBase } from '@/types/net-packet'

/**
 * 基于 mitt 与 Ws 封装的请求函数，支持 async/await
 * @param data   通过 NetPacket.xx() 构造的请求体
 * @param event    对应服务器返回事件常量，来自 WsEventName
 * @param needLogin 是否需要登录，默认 false
 * @param timeout  超时时间（ms），默认 10s
 */
export function wsRequest<P, T = any>(
  data: P,
  msgId: number,
  config: {
    callbackId?: number
    needLogin?: boolean
    timeout?: number
  } = {
    needLogin: false,
    timeout: 10000,
  },
): Promise<T> {
  const { callbackId, needLogin = false, timeout = 10000 } = config || {}
  // 发送，先把 id 转为协议字符串，确保与后端返回保持一致
  const eventName =  getMsgType(msgId as number) as string
  const callbackName = callbackId ? getMsgType(callbackId as number) as string : eventName
  return new Promise((resolve, reject) => {
    // 超时处理
    const timer = setTimeout(() => {
      eventBus.off(callbackName, handler as any)
      reject(new Error(`WebSocket request timeout: ${String(callbackName)}`))
    }, timeout)

    // 单次回调
    function handler(payload: T) {
      clearTimeout(timer)
      eventBus.off(callbackName, handler as any)
      resolve(payload)
    }

    // 绑定事件
    eventBus.on(callbackName, handler as any)
    // msg_req_login --> req_login
    // msg_notify_user_info --> req_user_info
    // msg_notify_req_my_games --> notify_req_my_games
    // 按上述顺序匹配，找到type of function 的包
    const formatFuncList  = [
      (name: string) => name.replace(/^msg_(req|notify)_(.+)$/, 'req_$2'), 
      (name: string) => name.replace(/^msg_(req|notify)_(.+)$/, 'notify_$2'), 
    ]
    const findPacket = formatFuncList.find(func => typeof NetPacket[func(eventName)] === 'function')
    if (findPacket) {
      const base = NetPacket[findPacket(eventName)]()
      const packet = isEmpty(data) ? base : merge(base, data)
      PKwebsocket.instance.send(packet as unknown as P extends PacketBase ? P : PacketBase, needLogin, {
        callbackName: String(callbackName),
      })
    }
    else {
      console.error(`${eventName} 无法自动匹配到请求，请手动检查！`)
    }
  })
}
