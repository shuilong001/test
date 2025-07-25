import { WsConnectionState } from './config'
// import { useSystemStore } from '@/stores/modules/system'
// import { usePageStore } from '@/stores/modules/page'
import eventBus from './eventBus'

/**
 * 连接状态信息接口
 */
export interface IConnectionStateInfo {
  /** WebSocket 连接状态 */
  connectionState: WsConnectionState
  /** 是否已登录 */
  isLoggedIn: boolean
  /** 连接质量评分 (0-100) */
  connectionQuality: number
  /** 最后连接时间 */
  lastConnectedAt?: Date
  /** 最后断开时间 */
  lastDisconnectedAt?: Date
  /** 重连次数 */
  reconnectCount: number
  /** 当前延迟(ms) */
  ping?: number
  /** 连接错误信息 */
  lastError?: string
}

/**
 * 连接状态变化事件
 */
export interface IConnectionStateChangeEvent {
  /** 旧状态 */
  oldState: IConnectionStateInfo
  /** 新状态 */
  newState: IConnectionStateInfo
  /** 变化时间 */
  timestamp: Date
  /** 变化原因 */
  reason?: string
}

/**
 * 连接状态管理器
 * 统一管理 WebSocket 连接状态、登录状态和相关的业务逻辑
 */
export class ConnectionStateManager {
  private state: IConnectionStateInfo = {
    connectionState: WsConnectionState.DISCONNECTED,
    isLoggedIn: false,
    connectionQuality: 0,
    reconnectCount: 0,
  }

  // private systemStore: ReturnType<typeof useSystemStore>
  // private pageStore: ReturnType<typeof usePageStore>
  private stateChangeListeners: Array<(event: IConnectionStateChangeEvent) => void> = []
  private reconnectHistory: Date[] = []
  private connectionStartTime?: Date
  private heartbeatInterval?: NodeJS.Timeout
  private qualityCheckInterval?: NodeJS.Timeout

  constructor() {
    // this.systemStore = useSystemStore()
    // this.pageStore = usePageStore()
    this.startQualityMonitoring()
  }

  /**
   * 更新连接状态
   */
  updateConnectionState(
    newConnectionState: WsConnectionState,
    reason?: string,
  ): void {
    const oldState = { ...this.state }
    const now = new Date()

    this.state.connectionState = newConnectionState

    // 更新连接时间记录
    if (newConnectionState === WsConnectionState.CONNECTED) {
      this.state.lastConnectedAt = now
      this.connectionStartTime = now
      this.state.reconnectCount = 0
      this.updateConnectionQuality(80) // 连接成功时初始质量为80
      this.startHeartbeat()
    }
    else if (newConnectionState === WsConnectionState.DISCONNECTED) {
      this.state.lastDisconnectedAt = now
      this.connectionStartTime = undefined
      this.updateConnectionQuality(0)
      this.stopHeartbeat()

      // 自动登出
      if (this.state.isLoggedIn) {
        this.updateLoginState(false, '连接断开自动登出')
      }
    }
    else if (newConnectionState === WsConnectionState.RECONNECTING) {
      this.state.reconnectCount++
      this.recordReconnectAttempt()
      this.updateConnectionQuality(Math.max(0, this.state.connectionQuality - 20))
    }

    // 触发状态变化事件
    const changeEvent: IConnectionStateChangeEvent = {
      oldState,
      newState: { ...this.state },
      timestamp: now,
      reason,
    }

    this.notifyStateChange(changeEvent)
  }

  /**
   * 更新登录状态
   */
  updateLoginState(isLoggedIn: boolean, reason?: string): void {
    if (this.state.isLoggedIn === isLoggedIn) {
      return // 状态未变化
    }

    const oldState = { ...this.state }
    this.state.isLoggedIn = isLoggedIn

    // 如果登录成功，提升连接质量
    if (isLoggedIn && this.state.connectionState === WsConnectionState.CONNECTED) {
      this.updateConnectionQuality(Math.min(100, this.state.connectionQuality + 10))
    }

    // 触发状态变化事件
    const changeEvent: IConnectionStateChangeEvent = {
      oldState,
      newState: { ...this.state },
      timestamp: new Date(),
      reason: reason || (isLoggedIn ? '用户登录' : '用户登出'),
    }

    this.notifyStateChange(changeEvent)
  }

  /**
   * 更新连接质量
   */
  updateConnectionQuality(quality: number): void {
    this.state.connectionQuality = Math.max(0, Math.min(100, quality))
  }

  /**
   * 设置网络延迟
   */
  setPing(ping: number): void {
    this.state.ping = ping

    // 根据延迟调整连接质量
    if (ping < 100) {
      this.updateConnectionQuality(Math.min(100, this.state.connectionQuality + 1))
    }
    else if (ping > 500) {
      this.updateConnectionQuality(Math.max(0, this.state.connectionQuality - 2))
    }
  }

  /**
   * 设置错误信息
   */
  setError(error: string): void {
    this.state.lastError = error
    this.updateConnectionQuality(Math.max(0, this.state.connectionQuality - 10))
  }

  /**
   * 获取当前状态
   */
  getState(): Readonly<IConnectionStateInfo> {
    return { ...this.state }
  }

  /**
   * 获取连接稳定性评分 (0-100)
   */
  getStabilityScore(): number {
    const baseScore = this.state.connectionQuality

    // 考虑重连次数
    const reconnectPenalty = Math.min(30, this.state.reconnectCount * 5)

    // 考虑连接时长
    const connectionDuration = this.connectionStartTime
      ? Date.now() - this.connectionStartTime.getTime()
      : 0
    const durationBonus = Math.min(20, connectionDuration / (60 * 1000)) // 每分钟+1分，最多20分

    return Math.max(0, Math.min(100, baseScore - reconnectPenalty + durationBonus))
  }

  /**
   * 检查是否需要重连
   */
  shouldReconnect(): boolean {
    // 如果重连次数过多，降低重连频率
    if (this.state.reconnectCount > 5) {
      const lastReconnect = this.reconnectHistory[this.reconnectHistory.length - 1]
      if (lastReconnect && Date.now() - lastReconnect.getTime() < 30000) {
        return false // 30秒内不重连
      }
    }

    return this.state.connectionState === WsConnectionState.DISCONNECTED
      || this.state.connectionState === WsConnectionState.RECONNECTING
  }

  /**
   * 添加状态变化监听器
   */
  addStateChangeListener(listener: (event: IConnectionStateChangeEvent) => void): void {
    this.stateChangeListeners.push(listener)
  }

  /**
   * 移除状态变化监听器
   */
  removeStateChangeListener(listener: (event: IConnectionStateChangeEvent) => void): void {
    const index = this.stateChangeListeners.indexOf(listener)
    if (index > -1) {
      this.stateChangeListeners.splice(index, 1)
    }
  }

  /**
   * 重置连接统计
   */
  resetStats(): void {
    this.state.reconnectCount = 0
    this.state.connectionQuality = 50
    this.state.lastError = undefined
    this.reconnectHistory = []
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.stopHeartbeat()
    this.stopQualityMonitoring()
    this.stateChangeListeners = []
    this.reconnectHistory = []
  }

  /**
   * 通知状态变化
   */
  private notifyStateChange(event: IConnectionStateChangeEvent): void {
    // 发送事件总线事件
    eventBus.emit('connection-state-change', event)

    // 通知所有监听器
    this.stateChangeListeners.forEach((listener) => {
      try {
        listener(event)
      }
      catch (error) {
        console.error('状态变化监听器执行错误:', error)
      }
    })

    // 日志记录
    // console.log(
    //   `%c连接状态变化: ${event.oldState.connectionState} -> ${event.newState.connectionState}`,
    //   'color: #2196F3',
    //   event.reason,
    // )
  }

  /**
   * 记录重连尝试
   */
  private recordReconnectAttempt(): void {
    const now = new Date()
    this.reconnectHistory.push(now)

    // 只保留最近10次重连记录
    if (this.reconnectHistory.length > 10) {
      this.reconnectHistory.shift()
    }
  }

  /**
   * 启动心跳检测
   */
  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatInterval = setInterval(() => {
      if (this.state.connectionState === WsConnectionState.CONNECTED) {
        // 这里可以发送心跳包并测量延迟
        // 暂时只是保持连接质量
        this.updateConnectionQuality(
          Math.max(10, this.state.connectionQuality - 0.1),
        )
      }
    }, 10000) // 10秒检查一次
  }

  /**
   * 停止心跳检测
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = undefined
    }
  }

  /**
   * 启动连接质量监控
   */
  private startQualityMonitoring(): void {
    this.qualityCheckInterval = setInterval(() => {
      // 定期检查连接质量并调整
      if (this.state.connectionState === WsConnectionState.CONNECTED) {
        const score = this.getStabilityScore()

        if (score < 30) {
          console.warn('连接质量较差，稳定性评分:', score)
          eventBus.emit('connection-quality-warning', { score })
        }
      }
    }, 30000) // 30秒检查一次
  }

  /**
   * 停止连接质量监控
   */
  private stopQualityMonitoring(): void {
    if (this.qualityCheckInterval) {
      clearInterval(this.qualityCheckInterval)
      this.qualityCheckInterval = undefined
    }
  }
}
