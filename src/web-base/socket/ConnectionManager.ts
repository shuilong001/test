import type { IConnectionManager, IConnectionState } from './types'
import { WS_CONFIG, WsConnectionState, WsEventType } from './config'
import { ConnectionStateManager } from './ConnectionStateManager'
import eventBus from './eventBus'

/**
 * WebSocket 连接管理器
 * 负责 WebSocket 连接的生命周期管理
 */
export class ConnectionManager implements IConnectionManager {
  private state: IConnectionState = {
    state: WsConnectionState.DISCONNECTED,
    loading: false,
    fasterLoading: false,
    paused: false,
    ip: '',
    ws: undefined,
  }

  private reconnectTimer?: NodeJS.Timeout
  private getFasterUrlFn?: () => Promise<string>
  private onStateChangeFn?: (state: IConnectionState) => void
  private stateManager: ConnectionStateManager

  constructor(
    getFasterUrl: () => Promise<string>,
    onStateChange?: (state: IConnectionState) => void,
  ) {
    this.getFasterUrlFn = getFasterUrl
    this.onStateChangeFn = onStateChange
    this.stateManager = new ConnectionStateManager()
  }

  /**
   * 初始化连接
   */
  async init(): Promise<string> {
    if (this.state.paused) {
      console.log('连接已暂停，跳过初始化')
      return Promise.reject(new Error('Connection is paused'))
    }

    if (this.state.loading || this.state.fasterLoading) {
      return
      // return Promise.reject(new Error('Connection already in progress'))
    }

    this.updateState({
      state: WsConnectionState.CONNECTING,
      loading: true,
      fasterLoading: true,
    })

    try {
      const ip = await this.getFastestUrl()
      this.updateState({
        ip,
        fasterLoading: false,
      })

      this.connect()
      return ip
    }
    catch (error) {
      this.updateState({
        state: WsConnectionState.DISCONNECTED,
        loading: false,
        fasterLoading: false,
      })
      throw error
    }
  }

  /**
   * 连接 WebSocket
   */
  connect(): void {
    if (!this.state.ip) {
      console.error('IP 地址为空，无法连接')
      return
    }

    console.log('%c--- 开始连接 ---', 'color: #f3b40b', this.state.ip)

    // 清理旧连接
    this.cleanupWebSocket()

    const ws = new WebSocket(this.state.ip, []) as WebSocket & { id?: number }
    ws.id = Date.now()

    this.updateState({ ws })

    this.setupWebSocketEventHandlers(ws)
  }

  /**
   * 重新连接
   */
  reconnect(): void {
    console.log('准备重新连接...')
    this.clearReconnectTimer()

    this.updateState({
      state: WsConnectionState.RECONNECTING,
      loading: false,
    })

    // 更新状态管理器
    this.stateManager.updateConnectionState(WsConnectionState.RECONNECTING, '开始重连')

    // 根据重连次数调整延迟
    const stateInfo = this.stateManager.getState()
    const baseDelay = WS_CONFIG.CONNECTION.RECONNECT_DELAY
    const adaptiveDelay = Math.min(baseDelay * 1.5 ** stateInfo.reconnectCount, 30000)

    this.reconnectTimer = setTimeout(() => {
      this.init().catch((error) => {
        console.error('重连失败:', error)
        this.stateManager.setError(`重连失败: ${error.message}`)
      })
    }, adaptiveDelay)
  }

  /**
   * 暂停连接
   */
  pause(): void {
    console.log('暂停 WebSocket 连接')
    this.updateState({ paused: true })
    this.close()
  }

  /**
   * 恢复连接
   */
  resume(): void {
    if (!this.state.paused)
      return

    console.log('恢复 WebSocket 连接')
    this.updateState({
      paused: false,
      state: WsConnectionState.CONNECTING,
    })

    this.connect()
  }

  /**
   * 关闭连接
   */
  close(): void {
    this.clearReconnectTimer()
    this.cleanupWebSocket()
    this.stateManager.cleanup()

    this.updateState({
      state: WsConnectionState.DISCONNECTED,
      ws: undefined,
    })
  }

  /**
   * 获取连接状态
   */
  getState(): IConnectionState {
    return { ...this.state }
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.state.state === WsConnectionState.CONNECTED
      && this.state.ws?.readyState === WebSocket.OPEN
  }

  /**
   * 检查是否正在连接
   */
  isConnecting(): boolean {
    return this.state.state === WsConnectionState.CONNECTING
      || this.state.ws?.readyState === WebSocket.CONNECTING
  }

  /**
   * 获取连接状态管理器
   */
  getStateManager(): ConnectionStateManager {
    return this.stateManager
  }

  /**
   * 获取最快 URL
   */
  private async getFastestUrl(): Promise<string> {
    if (!this.getFasterUrlFn) {
      throw new Error('getFasterUrl 函数未设置')
    }

    const maxRetries = 3
    let retryCount = 0

    const tryGetUrl = async (): Promise<string> => {
      try {
        console.log('%c-- 检测最快地址中 --', 'color: #f3b40b')
        return await this.getFasterUrlFn!()
      }
      catch (error) {
        console.error(error)
        retryCount++
        if (retryCount >= maxRetries) {
          throw new Error(`获取最快地址失败，已重试 ${maxRetries} 次`)
        }

        console.warn(`获取最快地址失败，${WS_CONFIG.CONNECTION.FASTER_URL_RETRY_DELAY}ms 后重试 (${retryCount}/${maxRetries})`)
        await new Promise(resolve =>
          setTimeout(resolve, WS_CONFIG.CONNECTION.FASTER_URL_RETRY_DELAY),
        )

        return tryGetUrl()
      }
    }

    return tryGetUrl()
  }

  /**
   * 设置 WebSocket 事件处理器
   */
  private setupWebSocketEventHandlers(ws: WebSocket & { id?: number }): void {
    ws.onopen = () => {
      if (ws.id !== this.state.ws?.id) {
        console.warn('收到历史 WebSocket 的 open 事件，忽略')
        return
      }

      console.log(`%c--- onopen --- ${ws.id}`, 'color: #f3b40b')

      this.updateState({
        state: WsConnectionState.CONNECTED,
        loading: false,
      })

      // 更新状态管理器
      this.stateManager.updateConnectionState(WsConnectionState.CONNECTED, 'WebSocket 连接成功')

      eventBus.emit(WsEventType.OPEN, { timestamp: Date.now() })
    }

    ws.onclose = (event) => {
      if (ws.id !== this.state.ws?.id) {
        console.warn('收到历史 WebSocket 的 close 事件，忽略')
        return
      }

      console.log('--- onclose ---', event)

      this.updateState({
        state: WsConnectionState.DISCONNECTED,
        ws: undefined,
      })

      // 更新状态管理器
      this.stateManager.updateConnectionState(WsConnectionState.DISCONNECTED, 'WebSocket 连接关闭')

      eventBus.emit(WsEventType.CLOSE, {
        data: event,
        timestamp: Date.now(),
      })

      // 主动断开不需要重连
      if (!this.state.paused && this.stateManager.shouldReconnect()) {
        this.reconnect()
      }
    }

    ws.onerror = (event) => {
      if (ws.id !== this.state.ws?.id) {
        console.warn('收到历史 WebSocket 的 error 事件，忽略')
        return
      }

      console.error('--- onerror ---', event)

      this.updateState({
        state: WsConnectionState.DISCONNECTED,
        ws: undefined,
      })

      // 更新状态管理器
      this.stateManager.updateConnectionState(WsConnectionState.DISCONNECTED, 'WebSocket 连接错误')
      this.stateManager.setError('WebSocket 连接错误')

      eventBus.emit(WsEventType.ERROR, {
        error: new Error('WebSocket 连接错误'),
        data: event,
        timestamp: Date.now(),
      })

      if (this.stateManager.shouldReconnect()) {
        this.reconnect()
      }
    }

    ws.onmessage = (event) => {
      eventBus.emit(WsEventType.MESSAGE, {
        data: event,
        timestamp: Date.now(),
      })
    }
  }

  /**
   * 清理 WebSocket 连接
   */
  private cleanupWebSocket(): void {
    if (this.state.ws) {
      // 移除事件监听器
      this.state.ws.onopen = null
      this.state.ws.onmessage = null
      this.state.ws.onerror = null
      this.state.ws.onclose = null

      // 关闭连接
      if (this.state.ws.readyState === WebSocket.OPEN
        || this.state.ws.readyState === WebSocket.CONNECTING) {
        try {
          this.state.ws.close()
        }
        catch (error) {
          console.error('关闭 WebSocket 失败:', error)
        }
      }
    }
  }

  /**
   * 清理重连定时器
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = undefined
    }
  }

  /**
   * 更新状态并通知
   */
  private updateState(updates: Partial<IConnectionState>): void {
    this.state = { ...this.state, ...updates }

    if (this.onStateChangeFn) {
      this.onStateChangeFn(this.state)
    }
  }
}
