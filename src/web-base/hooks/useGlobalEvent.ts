// 全局事件管理 Hook - 重构版本
import { useEventManager } from './eventHandlers/eventManager'
import { eventMiddleware, loggingMiddleware, retryMiddleware } from './eventHandlers/eventMiddleware'
import type { EventCleanupFunction } from './eventHandlers/types'

/**
 * 全局事件管理 Hook
 *
 * 特性：
 * - 配置驱动的事件注册
 * - 自动错误处理和重试机制
 * - 性能监控和日志记录
 * - 自动内存清理
 * - 类型安全
 *
 * 使用方式：
 * ```ts
 * const { initEventBus, cleanup, getEventStats } = useGlobalEvent()
 * initEventBus() // 注册所有事件
 * ```
 */
export function useGlobalEvent() {
  const {
    registerAllEvents,
    registerEventsByCategory,
    cleanup,
    getEventStats,
    eventManager,
  } = useEventManager()

  /**
   * 初始化事件总线 - 重构版本
   * 使用配置驱动的方式注册所有事件，提供更好的可维护性
   */
  function initEventBus() {
    console.log('[事件系统] 开始初始化全局事件监听器')

    try {
      // 可以选择注册所有事件或按分类注册
      registerAllEvents()

      // 或者按需注册特定分类的事件：
      // registerEventsByCategory('notification')
      // registerEventsByCategory('user')
      // registerEventsByCategory('game')
      // registerEventsByCategory('system')

      const stats = getEventStats()
      console.log(`[事件系统] 初始化完成，已注册 ${stats.registeredCount} 个事件监听器`)

      // 在开发环境下显示详细信息
      if (import.meta.env.DEV) {
        console.log('[事件系统] 已注册的事件:', stats.registeredEvents)
      }
    }
    catch (error) {
      console.error('[事件系统] 初始化失败:', error)
      throw error
    }
  }

  /**
   * 配置事件中间件
   * 可以根据需要添加或移除中间件
   */
  function configureMiddleware() {
    // 在生产环境中可能想要禁用详细日志
    if (import.meta.env.DEV) {
      eventMiddleware.use(loggingMiddleware)
    }

    // 为关键事件添加重试机制
    eventMiddleware.use(retryMiddleware(2))
  }

  /**
   * 添加自定义清理函数
   */
  function addCleanupFunction(fn: EventCleanupFunction) {
    eventManager.addCleanupFunction(fn)
  }

  /**
   * 获取事件性能统计
   */
  function getPerformanceStats() {
    return getEventStats().performanceStats
  }

  // 初始化中间件配置
  configureMiddleware()

  return {
    initEventBus,
    cleanup,
    getEventStats,
    getPerformanceStats,
    addCleanupFunction,
    configureMiddleware,

    // 提供更细粒度的控制
    registerAllEvents,
    registerEventsByCategory,
    eventManager,
  }
}
