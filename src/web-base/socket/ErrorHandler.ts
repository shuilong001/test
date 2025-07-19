import { WsErrorType } from './types'
import type { IWsError } from './types'
import { WS_CONFIG } from './config'
import eventBus from './eventBus'
import { i18n } from '@/utils/i18n'
import { showToast } from 'vant'

/**
 * 错误详情接口
 */
export interface IErrorDetail {
  /** 错误类型 */
  type: WsErrorType
  /** 错误代码 */
  code?: number
  /** 错误消息 */
  message: string
  /** 原始错误对象 */
  originalError?: Error
  /** 错误数据 */
  data?: any
  /** 发生时间 */
  timestamp: Date
  /** 错误来源 */
  source?: string
  /** 是否可恢复 */
  recoverable: boolean
  /** 建议的恢复操作 */
  suggestedAction?: string
}

/**
 * 错误统计接口
 */
export interface IErrorStatistics {
  /** 总错误数 */
  totalErrors: number
  /** 按类型分组的错误数 */
  errorsByType: Record<WsErrorType, number>
  /** 最近的错误 */
  recentErrors: IErrorDetail[]
  /** 最后一个错误 */
  lastError?: IErrorDetail
}

/**
 * WebSocket 错误处理器
 * 统一管理所有 WebSocket 相关的错误处理
 */
export class ErrorHandler {
  private errorHistory: IErrorDetail[] = []
  private maxHistorySize = 50
  private errorStatistics: IErrorStatistics = {
    totalErrors: 0,
    errorsByType: {} as Record<WsErrorType, number>,
    recentErrors: [],
  }

  private errorListeners: Array<(error: IErrorDetail) => void> = []

  constructor() {
    // 初始化错误统计
    Object.values(WsErrorType).forEach((type) => {
      this.errorStatistics.errorsByType[type] = 0
    })
  }

  /**
   * 处理错误
   */
  handleError(
    type: WsErrorType,
    message: string,
    options: {
      code?: number
      originalError?: Error
      data?: any
      source?: string
      showToast?: boolean
      recoverable?: boolean
      suggestedAction?: string
    } = {},
  ): IErrorDetail {
    const {
      code,
      originalError,
      data,
      source,
      showToast: shouldShowToast = true,
      recoverable = false,
      suggestedAction,
    } = options

    // 创建错误详情
    const errorDetail: IErrorDetail = {
      type,
      code,
      message,
      originalError,
      data,
      timestamp: new Date(),
      source,
      recoverable,
      suggestedAction,
    }

    // 更新统计信息
    this.updateStatistics(errorDetail)

    // 添加到历史记录
    this.addToHistory(errorDetail)

    // 处理特定类型的错误
    this.handleSpecificError(errorDetail)

    // 显示用户提示
    if (shouldShowToast) {
      this.showErrorToast(errorDetail)
    }

    // 通知监听器
    this.notifyListeners(errorDetail)

    // 发送错误事件
    eventBus.emit('ws-error', errorDetail)

    // 日志记录
    this.logError(errorDetail)

    return errorDetail
  }

  /**
   * 创建标准错误对象
   */
  createError(
    type: WsErrorType,
    message: string,
    code?: number,
    data?: any,
  ): IWsError {
    const error = new Error(message) as IWsError
    error.type = type
    error.code = code
    error.data = data
    error.name = 'WebSocketError'
    return error
  }

  /**
   * 处理连接错误
   */
  handleConnectionError(message: string, originalError?: Error): IErrorDetail {
    return this.handleError(WsErrorType.CONNECTION_FAILED, message, {
      originalError,
      source: 'ConnectionManager',
      recoverable: true,
      suggestedAction: '检查网络连接或稍后重试',
    })
  }

  /**
   * 处理消息解码错误
   */
  handleMessageDecodeError(message: string, data?: any): IErrorDetail {
    return this.handleError(WsErrorType.MESSAGE_DECODE_ERROR, message, {
      data,
      source: 'MessageHandler',
      recoverable: false,
      suggestedAction: '联系技术支持',
    })
  }

  /**
   * 处理队列溢出错误
   */
  handleQueueOverflowError(queueType: string, size: number): IErrorDetail {
    return this.handleError(WsErrorType.QUEUE_OVERFLOW, `${queueType}队列溢出`, {
      data: { queueType, size },
      source: 'QueueManager',
      recoverable: true,
      suggestedAction: '减少并发请求或等待队列处理完成',
    })
  }

  /**
   * 处理超时错误
   */
  handleTimeoutError(operation: string, timeout: number): IErrorDetail {
    return this.handleError(WsErrorType.TIMEOUT, `${operation}操作超时`, {
      data: { operation, timeout },
      source: 'WebSocketClient',
      recoverable: true,
      suggestedAction: '检查网络连接或增加超时时间',
    })
  }

  /**
   * 处理认证错误
   */
  handleAuthenticationError(message: string, code?: number): IErrorDetail {
    return this.handleError(WsErrorType.AUTHENTICATION_FAILED, message, {
      code,
      source: 'AuthenticationSystem',
      recoverable: false,
      suggestedAction: '重新登录或联系客服',
    })
  }

  /**
   * 检查是否应该显示错误消息
   */
  private shouldShowError(message: string): boolean {
    return !WS_CONFIG.SILENT_ERROR_MESSAGES.includes(message as any)
  }

  /**
   * 处理特定类型的错误
   */
  private handleSpecificError(error: IErrorDetail): void {
    switch (error.type) {
      case WsErrorType.CONNECTION_FAILED:
        // 连接失败可能需要触发重连
        eventBus.emit('connection-retry-needed', error)
        break

      case WsErrorType.AUTHENTICATION_FAILED:
        // 认证失败需要清理登录状态
        eventBus.emit('authentication-failed', error)
        break

      case WsErrorType.QUEUE_OVERFLOW:
        // 队列溢出需要清理队列
        eventBus.emit('queue-cleanup-needed', error)
        break

      case WsErrorType.TIMEOUT:
        // 超时错误可能需要重新发送请求
        eventBus.emit('request-timeout', error)
        break
    }
  }

  /**
   * 显示错误提示
   */
  private showErrorToast(error: IErrorDetail): void {
    if (!this.shouldShowError(error.message)) {
      return
    }

    const t = i18n.global.t
    let toastMessage = error.message

    // 根据错误类型自定义消息
    switch (error.type) {
      case WsErrorType.CONNECTION_FAILED:
        toastMessage = t('error.connection_failed') || '连接失败'
        break
      case WsErrorType.TIMEOUT:
        toastMessage = t('error.timeout') || '请求超时'
        break
      case WsErrorType.AUTHENTICATION_FAILED:
        toastMessage = t('error.authentication_failed') || '认证失败'
        break
      default:
        // 尝试翻译原始消息
        // const translatedMessage = t(error.message)
        // if (translatedMessage !== error.message) {
        //   toastMessage = translatedMessage
        // }
    }

    showToast({
      message: toastMessage,
      type: 'fail',
      duration: 3000,
    })
  }

  /**
   * 更新错误统计
   */
  private updateStatistics(error: IErrorDetail): void {
    this.errorStatistics.totalErrors++
    this.errorStatistics.errorsByType[error.type]++
    this.errorStatistics.lastError = error

    // 更新最近错误列表（保留最近10个）
    this.errorStatistics.recentErrors.unshift(error)
    if (this.errorStatistics.recentErrors.length > 10) {
      this.errorStatistics.recentErrors.pop()
    }
  }

  /**
   * 添加到历史记录
   */
  private addToHistory(error: IErrorDetail): void {
    this.errorHistory.unshift(error)

    // 限制历史记录大小
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize)
    }
  }

  /**
   * 通知监听器
   */
  private notifyListeners(error: IErrorDetail): void {
    this.errorListeners.forEach((listener) => {
      try {
        listener(error)
      }
      catch (listenerError) {
        console.error('错误监听器执行失败:', listenerError)
      }
    })
  }

  /**
   * 记录错误日志
   */
  private logError(error: IErrorDetail): void {
    const logLevel = this.getLogLevel(error.type)
    const logMessage = `[${error.type}] ${error.message}`

    switch (logLevel) {
      case 'error':
        console.error(logMessage, error)
        break
      case 'warn':
        console.warn(logMessage, error)
        break
      case 'info':
        console.info(logMessage, error)
        break
      default:
        console.log(logMessage, error)
    }
  }

  /**
   * 获取日志级别
   */
  private getLogLevel(errorType: WsErrorType): string {
    switch (errorType) {
      case WsErrorType.CONNECTION_FAILED:
      case WsErrorType.AUTHENTICATION_FAILED:
        return 'error'
      case WsErrorType.TIMEOUT:
      case WsErrorType.QUEUE_OVERFLOW:
        return 'warn'
      case WsErrorType.MESSAGE_DECODE_ERROR:
        return 'error'
      default:
        return 'info'
    }
  }

  /**
   * 添加错误监听器
   */
  addErrorListener(listener: (error: IErrorDetail) => void): void {
    this.errorListeners.push(listener)
  }

  /**
   * 移除错误监听器
   */
  removeErrorListener(listener: (error: IErrorDetail) => void): void {
    const index = this.errorListeners.indexOf(listener)
    if (index > -1) {
      this.errorListeners.splice(index, 1)
    }
  }

  /**
   * 获取错误统计
   */
  getStatistics(): Readonly<IErrorStatistics> {
    return { ...this.errorStatistics }
  }

  /**
   * 获取错误历史
   */
  getErrorHistory(): Readonly<IErrorDetail[]> {
    return [...this.errorHistory]
  }

  /**
   * 获取特定类型的错误
   */
  getErrorsByType(type: WsErrorType): IErrorDetail[] {
    return this.errorHistory.filter(error => error.type === type)
  }

  /**
   * 清理错误历史
   */
  clearHistory(): void {
    this.errorHistory = []
    this.errorStatistics = {
      totalErrors: 0,
      errorsByType: {} as Record<WsErrorType, number>,
      recentErrors: [],
    }

    // 重新初始化统计
    Object.values(WsErrorType).forEach((type) => {
      this.errorStatistics.errorsByType[type] = 0
    })
  }

  /**
   * 检查是否有严重错误
   */
  hasCriticalErrors(): boolean {
    const criticalTypes = [
      WsErrorType.CONNECTION_FAILED,
      WsErrorType.AUTHENTICATION_FAILED,
    ]

    return criticalTypes.some(type =>
      this.errorStatistics.errorsByType[type] > 0,
    )
  }

  /**
   * 获取错误恢复建议
   */
  getRecoveryAdvice(): string[] {
    const advice: string[] = []
    const stats = this.errorStatistics

    if (stats.errorsByType[WsErrorType.CONNECTION_FAILED] > 3) {
      advice.push('网络连接不稳定，建议检查网络设置')
    }

    if (stats.errorsByType[WsErrorType.TIMEOUT] > 5) {
      advice.push('请求超时频繁，建议降低并发请求数量')
    }

    if (stats.errorsByType[WsErrorType.QUEUE_OVERFLOW] > 0) {
      advice.push('请求队列溢出，建议减少并发操作')
    }

    if (stats.errorsByType[WsErrorType.AUTHENTICATION_FAILED] > 0) {
      advice.push('认证失败，建议重新登录')
    }

    return advice
  }
}
