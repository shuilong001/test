import { isEmpty, merge } from 'lodash-es'
import { getMsgType, WebSocketClient } from '@/web-base/socket'
import eventBus from '@/web-base/socket/eventBus'
import { NetPacket } from '@/web-base/netBase/NetPacket'
import type { IMessagePacket } from '@/web-base/socket/types'
import { useSystemStore } from '@/stores/modules/system'

/**
 * WebSocket 请求配置接口
 */
export interface WsRequestConfig<P = Record<string, any>> {
  data?: P
  msgId: number
  /** 回调消息ID，如果不提供则使用 msgId */
  callbackId?: number
  /** 是否需要登录验证 */
  needLogin?: boolean
  /** 请求超时时间（毫秒），默认 10000ms */
  timeout?: number
}

/**
 * WebSocket 请求错误类型
 */
export class WsRequestError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error,
  ) {
    super(message)
    this.name = 'WsRequestError'
  }
}

/**
 * 消息包构造函数类型
 */
type PacketConstructor = () => IMessagePacket & Record<string, any>

/**
 * 格式化函数类型
 */
type FormatFunction = (name: string) => string

/**
 * 基于 mitt 与 WebSocket 封装的类型安全请求函数，支持 async/await
 *
 * @template P 请求数据类型
 * @template T 响应数据类型
 * @param data 通过 NetPacket.xx() 构造的请求体数据
 * @param msgId 消息ID，来自 NetMsgType.msgType
 * @param config 请求配置选项
 * @returns Promise<T> 返回类型化的响应数据
 *
 * @example
 * ```typescript
 * // 基础用法
 * const result = await wsRequest(
 *   { username: 'test', password: '123' },
 *   NetMsgType.msgType.msg_req_login
 * )
 *
 * // 带配置的用法
 * const userInfo = await wsRequest<LoginData, UserInfo>(
 *   loginData,
 *   NetMsgType.msgType.msg_req_login,
 *   { needLogin: false, timeout: 15000 }
 * )
 * ```
 */
export async function wsRequest<T = any, P = Record<string, any>>(
  requestData: WsRequestConfig<P>,
): Promise<T> {
  const {
    data = {},
    msgId,
    callbackId,
    needLogin = false,
    timeout = 10000,
  } = requestData
  // 参数验证
  if (typeof msgId !== 'number' || msgId <= 0) {
    return Promise.reject(new WsRequestError(
      `无效的消息ID: ${msgId}`,
      'INVALID_MSG_ID',
    ))
  }

  // 类型安全的超时验证
  if (timeout <= 0 || timeout > 60000) {
    return Promise.reject(new WsRequestError(
      `超时时间必须在 1-60000ms 之间，当前值: ${timeout}`,
      'INVALID_TIMEOUT',
    ))
  }
  const systemStore = useSystemStore()
  if (!systemStore.isWebSocketReady) {
    await systemStore.initWebSocket()
  }
  return new Promise<T>((resolve, reject) => {
    let isResolved = false
    let timeoutTimer: NodeJS.Timeout | null = null

    // 获取事件名称
    const eventName = getMsgType(msgId)
    // msg_req_slots_match_info --> msg_notify_slots_match_info
    const defaultCallbackName = eventName.replace(/^msg_req_/, 'msg_notify_')
    const callbackName = callbackId ? getMsgType(callbackId) : defaultCallbackName

    // 验证事件名称
    if (eventName === 'unknownType') {
      reject(new WsRequestError(
        `未知的消息ID: ${msgId}`,
        'UNKNOWN_MSG_ID',
      ))
      return
    }

    // 清理函数
    const cleanup = (): void => {
      if (timeoutTimer) {
        clearTimeout(timeoutTimer)
        timeoutTimer = null
      }
      eventBus.off(callbackName, handler)
    }

    // 超时处理
    timeoutTimer = setTimeout(() => {
      if (!isResolved) {
        isResolved = true
        cleanup()
        reject(new WsRequestError(
          `WebSocket 请求超时: ${callbackName} (${timeout}ms)`,
          'TIMEOUT',
        ))
      }
    }, timeout)

    // 响应处理器
    function handler(payload: T): void {
      if (!isResolved) {
        isResolved = true
        cleanup()
        resolve(payload)
      }
    }

    try {
      // 绑定事件监听
      eventBus.on(callbackName, handler)

      // 构造请求包
      const packet = buildRequestPacket(eventName, data)
      if (!packet) {
        throw new WsRequestError(
          `无法构造请求包: ${eventName}`,
          'PACKET_BUILD_FAILED',
        )
      }
      // 发送请求
      const sendResult = WebSocketClient.instance.send(packet, needLogin, {
        callbackName,
        timeout,
      })

      // 检查发送结果
      if (sendResult === false) {
        throw new WsRequestError(
          `WebSocket 发送失败: ${eventName}`,
          'SEND_FAILED',
        )
      }
    }
    catch (error) {
      if (!isResolved) {
        isResolved = true
        cleanup()

        if (error instanceof WsRequestError) {
          reject(error)
        }
        else {
          reject(new WsRequestError(
            `请求处理失败: ${error instanceof Error ? error.message : String(error)}`,
            'REQUEST_FAILED',
            error instanceof Error ? error : undefined,
          ))
        }
      }
    }
  })
}

/**
 * 构造请求包
 * @param eventName 事件名称
 * @param data 请求数据
 * @returns 构造的请求包或 null
 */
function buildRequestPacket<P>(
  eventName: string,
  data: P,
): IMessagePacket | null {
  // 消息名称格式化规则
  // msg_req_login --> req_login
  // msg_notify_user_info --> req_user_info
  // msg_notify_req_my_games --> notify_req_my_games
  const formatFunctions: FormatFunction[] = [
    (name: string) => name.replace(/^msg_(req|notify)_(.+)$/, 'req_$2'),
    (name: string) => name.replace(/^msg_(req|notify)_(.+)$/, 'notify_$2'),
  ]

  // 查找匹配的包构造函数
  for (const formatFunc of formatFunctions) {
    const packetName = formatFunc(eventName)

    // 安全访问 NetPacket 的属性
    if (packetName in NetPacket) {
      const packetConstructor = (NetPacket as any)[packetName] as PacketConstructor

      if (typeof packetConstructor === 'function') {
        try {
          const basePacket = packetConstructor()

          // 安全合并数据
          if (isEmpty(data)) {
            return basePacket
          }

          // 类型安全的数据合并
          return merge(basePacket, data) as IMessagePacket
        }
        catch (error) {
          console.error(`构造请求包失败 [${packetName}]:`, error)
          continue
        }
      }
    }
  }

  console.error(`${eventName} 无法自动匹配到请求包构造函数`)
  return null
}
