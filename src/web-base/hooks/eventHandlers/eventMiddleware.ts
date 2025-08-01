// 事件中间件系统
import type { EventHandler, EventType } from './eventConfig'

// 中间件函数类型
export type MiddlewareFunction = (
  eventType: EventType,
  data: any,
  next: () => Promise<void>
) => Promise<void>

// 错误处理器类型
export type ErrorHandler = (error: Error, eventType: EventType, data: any) => void

// 事件中间件管理器
export class EventMiddleware {
  private middlewares: MiddlewareFunction[] = []
  private errorHandlers: ErrorHandler[] = []
  private performanceMonitor = new Map<EventType, { count: number, totalTime: number }>()

  // 添加中间件
  use(middleware: MiddlewareFunction) {
    this.middlewares.push(middleware)
  }

  // 添加错误处理器
  onError(handler: ErrorHandler) {
    this.errorHandlers.push(handler)
  }

  // 包装事件处理函数，添加中间件支持
  wrapHandler(eventType: EventType, originalHandler: EventHandler): EventHandler {
    return async (data: any) => {
      const startTime = performance.now()

      try {
        // 执行中间件链
        await this.executeMiddlewareChain(eventType, data, originalHandler)

        // 记录性能数据
        this.recordPerformance(eventType, startTime)
      }
      catch (error) {
        // 执行错误处理
        this.handleError(error as Error, eventType, data)
      }
    }
  }

  // 执行中间件链
  private async executeMiddlewareChain(
    eventType: EventType,
    data: any,
    originalHandler: EventHandler,
  ) {
    let index = 0

    const next = async (): Promise<void> => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++]
        await middleware(eventType, data, next)
      }
      else {
        // 执行原始处理函数
        await originalHandler(data)
      }
    }

    await next()
  }

  // 处理错误
  private handleError(error: Error, eventType: EventType, data: any) {
    console.error(`事件处理错误 [${eventType}]:`, error)

    // 执行所有错误处理器
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error, eventType, data)
      }
      catch (handlerError) {
        console.error('错误处理器执行失败:', handlerError)
      }
    })
  }

  // 记录性能数据
  private recordPerformance(eventType: EventType, startTime: number) {
    const duration = performance.now() - startTime
    const stats = this.performanceMonitor.get(eventType) || { count: 0, totalTime: 0 }

    stats.count++
    stats.totalTime += duration

    this.performanceMonitor.set(eventType, stats)

    // 如果处理时间超过阈值，记录警告
    if (duration > 100) { // 100ms
      console.warn(`事件处理耗时较长 [${eventType}]: ${duration.toFixed(2)}ms`)
    }
  }

  // 获取性能统计
  getPerformanceStats() {
    const stats: Record<string, { count: number, avgTime: number, totalTime: number }> = {}

    this.performanceMonitor.forEach((value, key) => {
      stats[key] = {
        count: value.count,
        totalTime: value.totalTime,
        avgTime: value.totalTime / value.count,
      }
    })

    return stats
  }

  // 清理性能统计
  clearPerformanceStats() {
    this.performanceMonitor.clear()
  }
}

// 默认中间件实例
export const eventMiddleware = new EventMiddleware()

// 内置中间件

// 日志中间件
export const loggingMiddleware: MiddlewareFunction = async (eventType, data, next) => {
  console.log(`[事件] ${eventType}`, data)
  await next()
}

// 数据验证中间件
export const validationMiddleware: MiddlewareFunction = async (eventType, data, next) => {
  // 基本数据验证
  if (data === undefined || data === null) {
    console.warn(`[验证警告] 事件 ${eventType} 接收到空数据`)
  }

  await next()
}

// 重试中间件
export function retryMiddleware(maxRetries = 3): MiddlewareFunction {
  return async (eventType, data, next) => {
    let attempts = 0

    while (attempts <= maxRetries) {
      try {
        await next()
        break
      }
      catch (error) {
        attempts++

        if (attempts > maxRetries) {
          throw error
        }

        console.warn(`[重试] 事件 ${eventType} 第 ${attempts} 次重试`)

        // 指数退避
        await new Promise(resolve => setTimeout(resolve, 2 ** attempts * 100))
      }
    }
  }
}

// 默认错误处理器
export const defaultErrorHandler: ErrorHandler = (error, eventType, data) => {
  // 这里可以集成错误监控服务
  console.error(`[默认错误处理] 事件: ${eventType}`, {
    error: error.message,
    stack: error.stack,
    data,
    timestamp: new Date().toISOString(),
  })
}

// 初始化默认中间件和错误处理
eventMiddleware.use(validationMiddleware)
eventMiddleware.use(loggingMiddleware)
eventMiddleware.onError(defaultErrorHandler)
