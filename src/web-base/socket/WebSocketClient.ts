import type { IMessagePacket, IQueueRequest, IRequestConfig, IWebSocketClient } from './types'
import { WS_CONFIG, WsConnectionState, WsEventType } from './config'
import { ConnectionManager } from './ConnectionManager'
import { QueueManager } from './QueueManager'
import { MessageHandler } from './MessageHandler'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { NetPacket } from '@/web-base/netBase/NetPacket'
import { getFastestUrl } from '@/web-base/utils/useStoreMethods'
import { NET_VERSION } from '@/constants'
import eventBus from './eventBus'

/**
 * 新的 WebSocket 客户端
 * 整合连接管理、队列管理和消息处理功能
 */
export class WebSocketClient implements IWebSocketClient {
  private static _instance?: WebSocketClient

  private connectionManager: ConnectionManager
  private queueManager: QueueManager
  private messageHandler: MessageHandler

  private constructor() {
    // 初始化各个管理器
    this.connectionManager = new ConnectionManager(
      getFastestUrl,
      this.onConnectionStateChange.bind(this),
    )

    this.queueManager = new QueueManager()

    this.messageHandler = new MessageHandler(
      this.getMsgType.bind(this),
      this.onMessageDecoded.bind(this),
    )

    this.setupEventHandlers()
    this.setupDependencyInjection()
  }

  /**
   * 获取单例实例
   */
  static get instance(): WebSocketClient {
    if (!WebSocketClient._instance) {
      WebSocketClient._instance = new WebSocketClient()
    }
    return WebSocketClient._instance
  }

  /**
   * 初始化客户端
   */
  async init(): Promise<string> {
    this.resetStates()
    return this.connectionManager.init()
  }

  /**
   * 重新初始化
   */
  reInit(): void {
    this.pauseWs()

    setTimeout(() => {
      this.connectionManager.resume()
      this.init().catch((error) => {
        console.error('重新初始化失败:', error)
      })
    }, 1000)
  }

  /**
   * 发送请求
   */
  send(obj: IMessagePacket, needLogin: boolean = false, config?: IRequestConfig): boolean | void {
    // 检查暂停状态
    if (this.connectionManager.getState().paused) {
      // console.log('连接已暂停，跳过发送')
      return false
    }
    const state = this.connectionManager.getStateManager().getState()
    // 检查登录状态
    if (needLogin) {
      if (!state.isLoggedIn) {
        // console.log('未登录，添加到登录队列', obj)
        this.addToQueue(obj, needLogin, config)
        return
      }
    }
    else {
      // 检查连接状态
      if (state.connectionState !== WsConnectionState.CONNECTED) {
        // console.log('未连接，添加到连接队列', obj)
        this.addToQueue(obj, needLogin, config)
        return
      }

      // 如果暂停状态，重新激活连接
      if (this.connectionManager.getState().paused) {
        this.connectionManager.resume()
        return
      }
    }

    // 检查 WebSocket 连接状态
    if (this.connectionManager.isConnecting()) {
      // console.log('连接中，添加到队列')
      this.addToQueue(obj, needLogin, config)
      return false
    }

    // 发送请求
    if (config?.callbackName) {
      this.addToSendingList(obj, needLogin, config)
    }

    this.messageHandler.sendMessage(obj)
    return true
  }

  /**
   * 从队列发送请求（避免递归调用）
   * @private
   */
  private sendFromQueue(obj: IMessagePacket, needLogin: boolean = false, config?: IRequestConfig): boolean {
    // 检查暂停状态
    if (this.connectionManager.getState().paused) {
      console.log('连接已暂停，队列请求延迟发送')
      return false
    }

    // 检查 WebSocket 连接状态，如果正在连接中或未连接，直接返回 false
    const ws = this.connectionManager.getState().ws
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log('WebSocket 未就绪，队列请求无法发送')
      return false
    }

    // 针对队列重发，跳过登录和连接状态检查，直接发送
    if (config?.callbackName) {
      this.addToSendingList(obj, needLogin, config)
    }

    this.messageHandler.sendMessage(obj)
    return true
  }

  /**
   * 暂停 WebSocket
   */
  pauseWs(): void {
    console.log('暂停 WebSocket')
    this.connectionManager.pause()
  }

  /**
   * 恢复 WebSocket 连接
   */
  reConnectWs(): void {
    console.log('恢复 WebSocket 连接')
    this.connectionManager.resume()
  }

  /**
   * 关闭 WebSocket
   */
  closeWs(): void {
    console.log('关闭 WebSocket')
    this.connectionManager.close()
  }

  /**
   * 发送队列中的所有请求
   */
  sendAll(needLogin: boolean): void {
    this.queueManager.sendAll(needLogin)
  }

  /**
   * 获取队列状态（用于调试）
   */
  getQueueStatus() {
    return this.queueManager.getQueueStatus()
  }

  /**
   * 获取连接状态信息
   */
  getConnectionInfo() {
    return this.connectionManager.getStateManager().getState()
  }

  /**
   * 获取连接稳定性评分
   */
  getStabilityScore(): number {
    return this.connectionManager.getStateManager().getStabilityScore()
  }

  /**
   * 连接状态变化处理
   */
  private onConnectionStateChange(state: any): void {
    if (state.state === 'connected') {
      this.sendVersionCheck()
    }
  }

  /**
   * 消息解码完成处理
   */
  private onMessageDecoded(msgID: number, message: any): void {
    // 从发送队列中移除已完成的请求
    this.queueManager.removeFromSendingList(msgID, message)

    // 处理登录完成事件 - 同时支持新旧消息类型
    const isLoginSuccess = (
      msgID === NetMsgType.msgType.msg_notify_login_result
      || msgID === NetMsgType.msgType.msg_nodify_login
    ) && message.result === 1
    if (isLoginSuccess) {
      console.log('登录成功，更新状态')
      // 使用状态管理器更新登录状态
      this.connectionManager.getStateManager().updateLoginState(true, '用户登录成功')

      // 发送登录队列中的请求 -- 这个暂时不知道有没有必要，先保留
      setTimeout(() => {
        this.queueManager.sendAll(true)
      }, 1000)
    }
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers(): void {
    // WebSocket 事件处理
    eventBus.on(WsEventType.OPEN, this.onWebSocketOpen.bind(this))
    eventBus.on(WsEventType.MESSAGE, this.onWebSocketMessage.bind(this))
    eventBus.on('clear-sending-queue', this.onClearSendingQueue.bind(this))
  }

  /**
   * 设置依赖注入
   */
  private setupDependencyInjection(): void {
    // 为队列管理器注入发送方法和消息类型获取方法
    // 使用 sendFromQueue 避免递归调用
    this.queueManager.setSendRequestMethod((request: IQueueRequest): boolean => {
      const success = this.sendFromQueue(request.obj, request.needLogin, request.config)
      if (!success) {
        console.log('队列请求发送失败，将在下次连接时重试')
      }
      return success
    })
    this.queueManager.setGetMsgTypeMethod(this.getMsgType.bind(this))

    // 为消息处理器注入发送方法
    this.messageHandler.setSendDataMethod((data: ArrayBuffer) => {
      const ws = this.connectionManager.getState().ws
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
      else {
        console.error('WebSocket 未连接，无法发送数据')
      }
    })
  }

  /**
   * WebSocket 打开事件处理
   */
  private onWebSocketOpen(): void {
    // 等待一小段时间确保连接完全稳定，然后处理队列
    setTimeout(() => {
      this.processConnectionQueue()
    }, WS_CONFIG.CONNECTION.QUEUE_SEND_DELAY)
  }

  /**
   * 处理连接队列中的请求
   */
  private processConnectionQueue(): void {
    // 再次检查连接状态，确保WebSocket仍然处于连接状态
    const ws = this.connectionManager.getState().ws
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket连接不稳定，延迟处理连接队列')
      return
    }

    // 获取队列状态
    const queueSizes = this.queueManager.getQueueSizes()

    if (queueSizes.connect > 0) {
      this.queueManager.sendAll(false)
    }
  }

  /**
   * WebSocket 消息事件处理
   */
  private onWebSocketMessage(eventData: any): void {
    const event = eventData.data as MessageEvent

    // 处理不同类型的消息数据
    if (typeof event.data === 'string') {
      // 字符串类型消息
      const array: number[] = []
      for (let i = 0; i < event.data.length; i++) {
        array.push(event.data.charCodeAt(i))
      }
      const buf = new Uint8Array(array)
      this.messageHandler.receiveMessage(buf)
    }
    else {
      // 二进制类型消息
      const reader = new FileReader()
      reader.readAsArrayBuffer(event.data)
      reader.onload = () => {
        const buf = new Uint8Array(reader.result as ArrayBuffer)
        this.messageHandler.receiveMessage(buf)
      }
    }
  }

  /**
   * 清空发送队列事件处理
   */
  private onClearSendingQueue(): void {
    console.log('清空发送队列')
    this.queueManager.clearSendingList()
  }

  /**
   * 发送版本检查请求
   */
  private sendVersionCheck(): void {
    setTimeout(() => {
      const req = NetPacket.req_check_version()
      req.version = NET_VERSION
      this.send(req, false)
    }, WS_CONFIG.CONNECTION.VERSION_CHECK_DELAY)
  }

  /**
   * 处理所有待发送的队列
   */
  private processAllPendingQueues(): void {
    // 检查连接状态
    if (this.connectionManager.getState().loading) {
      console.log('连接仍在进行中，延迟处理队列')
      setTimeout(() => this.processAllPendingQueues(), 1000)
      return
    }

    const ws = this.connectionManager.getState().ws
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket未连接，无法处理队列')
      return
    }

    const queueSizes = this.queueManager.getQueueSizes()
    console.log('处理所有待发送队列:', queueSizes)

    // 先处理连接队列（不需要登录的请求）
    if (queueSizes.connect > 0) {
      console.log('处理连接队列')
      this.queueManager.sendAll(false)
    }

    // 如果已登录，处理登录队列
    if (this.connectionManager.getStateManager().getState().isLoggedIn && queueSizes.login > 0) {
      console.log('用户已登录，处理登录队列')
      setTimeout(() => {
        this.queueManager.sendAll(true)
      }, WS_CONFIG.CONNECTION.QUEUE_SEND_DELAY)
    }
  }

  /**
   * 添加到队列
   */
  private addToQueue(obj: IMessagePacket, needLogin: boolean, config?: IRequestConfig): void {
    const request: IQueueRequest = {
      obj,
      needLogin,
      config,
      msgID: obj.getMsgID(),
      callbackName: config?.callbackName,
      timestamp: Date.now(),
    }

    this.queueManager.addToQueue(request, needLogin)
  }

  /**
   * 添加到发送中列表
   */
  private addToSendingList(obj: IMessagePacket, needLogin: boolean, config?: IRequestConfig): void {
    const request: IQueueRequest = {
      obj,
      needLogin,
      config,
      msgID: obj.getMsgID(),
      callbackName: config?.callbackName,
      timestamp: Date.now(),
    }

    this.queueManager.addToSendingList(request)
  }

  /**
   * 获取消息类型名称
   */
  private getMsgType(msgID: number): string {
    const msgType: any = NetMsgType.msgType
    for (const key in msgType) {
      if (msgType[key] === msgID) {
        return key
      }
    }
    return 'unknownType'
  }

  /**
   * 重置状态
   */
  private resetStates(): void {
    this.queueManager.clearAll()
    this.messageHandler.reset()
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.connectionManager.close()
    this.queueManager.clearAll()
    this.messageHandler.cleanup()

    // 清理事件监听器
    eventBus.off(WsEventType.OPEN, this.onWebSocketOpen.bind(this))
    eventBus.off(WsEventType.MESSAGE, this.onWebSocketMessage.bind(this))
    eventBus.off('clear-sending-queue', this.onClearSendingQueue.bind(this))
  }
}
