// WebSocket 兼容层 - 为了保持向后兼容性
// 将逐步迁移到新的 WebSocketClient 架构

import { WebSocketClient } from './WebSocketClient'

/**
 * 向后兼容的 WebSocket 类
 * @deprecated 请使用新的 WebSocketClient，这个类仅用于兼容现有代码
 */
export class WsClass {
  private static _instance: WsClass

  /**
   * 获取单例实例
   */
  public static get instance(): WsClass {
    if (!WsClass._instance) {
      WsClass._instance = new WsClass()
    }
    return WsClass._instance
  }

  private constructor() {
    // 私有构造函数
  }

  /**
   * 初始化 WebSocket 连接
   * @deprecated 使用 WebSocketClient.instance.init()
   */
  init(): Promise<string> {
    console.warn('WsClass.init() 已废弃，请使用 WebSocketClient.instance.init()')
    return WebSocketClient.instance.init()
  }

  /**
   * 重新初始化
   * @deprecated 使用 WebSocketClient.instance.reInit()
   */
  reInit(): void {
    console.warn('WsClass.reInit() 已废弃，请使用 WebSocketClient.instance.reInit()')
    WebSocketClient.instance.reInit()
  }

  /**
   * 发送消息
   * @deprecated 使用 WebSocketClient.instance.send()
   */
  send(obj: any, needLogin: boolean, config?: any): boolean | void {
    return WebSocketClient.instance.send(obj, needLogin, config)
  }

  /**
   * 暂停 WebSocket
   * @deprecated 使用 WebSocketClient.instance.pauseWs()
   */
  pauseWs(): void {
    console.warn('WsClass.pauseWs() 已废弃，请使用 WebSocketClient.instance.pauseWs()')
    WebSocketClient.instance.pauseWs()
  }

  /**
   * 重新连接
   * @deprecated 使用 WebSocketClient.instance.reConnectWs()
   */
  reConnectWs(): void {
    console.warn('WsClass.reConnectWs() 已废弃，请使用 WebSocketClient.instance.reConnectWs()')
    WebSocketClient.instance.reConnectWs()
  }

  /**
   * 关闭连接
   * @deprecated 使用 WebSocketClient.instance.closeWs()
   */
  closeWs(): void {
    console.warn('WsClass.closeWs() 已废弃，请使用 WebSocketClient.instance.closeWs()')
    WebSocketClient.instance.closeWs()
  }

  /**
   * 发送队列中的所有请求
   * @deprecated 使用 WebSocketClient.instance.sendAll()
   */
  sendAll(needLogin: boolean): void {
    console.warn('WsClass.sendAll() 已废弃，请使用 WebSocketClient.instance.sendAll()')
    WebSocketClient.instance.sendAll(needLogin)
  }
}

// 兼容原有的默认导出
export default WsClass

// 重新导出新的架构组件（推荐使用）
export { WebSocketClient } from './WebSocketClient'
export { getMsgType } from './index'
export * from './types'
export * from './config'
