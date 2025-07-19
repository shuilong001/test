import type { WsConnectionState } from './config'

/**
 * 消息包基础接口
 */
export interface IMessagePacket {
  getMsgID: () => number
  build: (buf: number[]) => void
  encode: (buf: number[]) => void
  decode: (buf: number[], index: number) => number
}

/**
 * 请求配置接口
 */
export interface IRequestConfig {
  /** 回调名称，用于响应匹配 */
  callbackName?: string
  /** 回调函数 */
  callback?: (message: any) => void
  /** 超时时间（毫秒） */
  timeout?: number
}

/**
 * 队列中的请求项
 */
export interface IQueueRequest {
  /** 消息包对象 */
  obj: IMessagePacket
  /** 是否需要登录 */
  needLogin: boolean
  /** 请求配置 */
  config?: IRequestConfig
  /** 消息ID */
  msgID: number
  /** 回调名称 */
  callbackName?: string
  /** 创建时间戳 */
  timestamp: number
}

/**
 * WebSocket 连接状态接口
 */
export interface IConnectionState {
  /** 连接状态 */
  state: WsConnectionState
  /** 是否正在加载 */
  loading: boolean
  /** 是否正在获取最快地址 */
  fasterLoading: boolean
  /** 是否暂停 */
  paused: boolean
  /** 当前 IP 地址 */
  ip: string
  /** WebSocket 实例 */
  ws?: WebSocket & { id?: number }
}

/**
 * 消息解码结果接口
 */
export interface IDecodedMessage {
  /** 状态码 */
  code: number
  /** 消息内容 */
  message?: string
  /** 其他数据 */
  [key: string]: any
}

/**
 * WebSocket 事件数据接口
 */
export interface IWsEventData {
  /** 事件类型 */
  type: string
  /** 事件数据 */
  data?: any
  /** 错误信息 */
  error?: Error
  /** 时间戳 */
  timestamp: number
}

/**
 * 连接管理器接口
 */
export interface IConnectionManager {
  /** 初始化连接 */
  init: () => Promise<string>
  /** 连接 WebSocket */
  connect: () => void
  /** 重新连接 */
  reconnect: () => void
  /** 暂停连接 */
  pause: () => void
  /** 恢复连接 */
  resume: () => void
  /** 关闭连接 */
  close: () => void
  /** 获取连接状态 */
  getState: () => IConnectionState
}

/**
 * 消息队列管理器接口
 */
export interface IQueueManager {
  /** 添加请求到队列 */
  addToQueue: (request: IQueueRequest, needLogin: boolean) => void
  /** 发送队列中的所有请求 */
  sendAll: (needLogin: boolean) => void
  /** 添加到发送中列表 */
  addToSendingList: (request: IQueueRequest) => void
  /** 从发送中列表移除 */
  removeFromSendingList: (msgID: number, message?: any) => void
  /** 清空所有队列 */
  clearAll: () => void
  /** 获取队列状态 */
  getQueueStatus: () => {
    connectList: IQueueRequest[]
    loginList: IQueueRequest[]
    sendingList: IQueueRequest[]
  }
}

/**
 * 消息处理器接口
 */
export interface IMessageHandler {
  /** 接收消息 */
  receiveMessage: (buf: Uint8Array, event: MessageEvent) => void
  /** 解码消息 */
  decodeMessage: (bodyLen: number, event: MessageEvent) => void
  /** 发送消息 */
  sendMessage: (packet: IMessagePacket) => void
}

/**
 * WebSocket 客户端接口
 */
export interface IWebSocketClient {
  /** 发送请求 */
  send: (obj: IMessagePacket, needLogin: boolean, config?: IRequestConfig) => boolean | void
  /** 初始化客户端 */
  init: () => Promise<string>
  /** 重新初始化 */
  reInit: () => void
  /** 暂停客户端 */
  pauseWs: () => void
  /** 恢复连接 */
  reConnectWs: () => void
  /** 关闭连接 */
  closeWs: () => void
}

/**
 * 错误类型枚举
 */
export enum WsErrorType {
  CONNECTION_FAILED = 'connection_failed',
  MESSAGE_DECODE_ERROR = 'message_decode_error',
  QUEUE_OVERFLOW = 'queue_overflow',
  TIMEOUT = 'timeout',
  AUTHENTICATION_FAILED = 'authentication_failed',
  UNKNOWN = 'unknown',
}

/**
 * WebSocket 错误接口
 */
export interface IWsError extends Error {
  type: WsErrorType
  code?: number
  data?: any
}
