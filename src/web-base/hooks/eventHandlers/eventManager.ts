// 事件管理器 - 负责事件注册、清理和生命周期管理
import { onUnmounted } from 'vue'
import eventBus from '@/web-base/socket/eventBus'
import type { EventConfig, EventHandler, EventType } from './eventConfig'
import { getAllEvents } from './eventConfig'
import { eventMiddleware } from './eventMiddleware'
import type { EventCleanupFunction } from './types'

export class EventManager {
  private registeredEvents = new Map<EventType, EventHandler>()
  private cleanupFunctions: EventCleanupFunction[] = []

  // 注册单个事件
  registerEvent(eventType: EventType, config: EventConfig) {
    // 使用中间件包装处理函数
    const wrappedHandler = eventMiddleware.wrapHandler(eventType, config.handler)

    // 注册到事件总线
    eventBus.on(eventType, wrappedHandler)

    // 记录已注册的事件
    this.registeredEvents.set(eventType, wrappedHandler)

    console.log(`[事件注册] ${config.description} (${eventType})`)
  }

  // 批量注册事件
  registerEvents(events: EventConfig[]) {
    events.forEach((config) => {
      this.registerEvent(config.type, config)
    })
  }

  // 注册所有配置的事件
  registerAllEvents() {
    const allEvents = getAllEvents()
    this.registerEvents(allEvents)
  }

  // 按分类注册事件
  registerEventsByCategory(category: EventConfig['category']) {
    const events = getAllEvents().filter(config => config.category === category)
    this.registerEvents(events)
  }

  // 移除单个事件监听器
  removeEvent(eventType: EventType) {
    const handler = this.registeredEvents.get(eventType)
    if (handler) {
      eventBus.off(eventType, handler)
      this.registeredEvents.delete(eventType)
      console.log(`[事件移除] ${eventType}`)
    }
  }

  // 移除所有事件监听器
  removeAllEvents() {
    this.registeredEvents.forEach((handler, eventType) => {
      eventBus.off(eventType, handler)
    })
    this.registeredEvents.clear()
    console.log('[事件清理] 已移除所有事件监听器')
  }

  // 添加清理函数
  addCleanupFunction(fn: EventCleanupFunction) {
    this.cleanupFunctions.push(fn)
  }

  // 执行所有清理函数
  cleanup() {
    // 移除所有事件监听器
    this.removeAllEvents()

    // 执行额外的清理函数
    this.cleanupFunctions.forEach((fn) => {
      try {
        fn()
      }
      catch (error) {
        console.error('清理函数执行失败:', error)
      }
    })

    this.cleanupFunctions.length = 0

    // 清理性能统计
    eventMiddleware.clearPerformanceStats()
  }

  // 获取已注册的事件列表
  getRegisteredEvents(): EventType[] {
    return Array.from(this.registeredEvents.keys())
  }

  // 检查事件是否已注册
  isEventRegistered(eventType: EventType): boolean {
    return this.registeredEvents.has(eventType)
  }

  // 获取事件统计信息
  getEventStats() {
    return {
      registeredCount: this.registeredEvents.size,
      registeredEvents: this.getRegisteredEvents(),
      performanceStats: eventMiddleware.getPerformanceStats(),
    }
  }
}

// 创建全局事件管理器实例
export const globalEventManager = new EventManager()

// Vue Composition API 集成
export function useEventManager() {
  // 在组件卸载时自动清理
  onUnmounted(() => {
    globalEventManager.cleanup()
  })

  return {
    eventManager: globalEventManager,
    registerEvent: globalEventManager.registerEvent.bind(globalEventManager),
    registerEvents: globalEventManager.registerEvents.bind(globalEventManager),
    registerAllEvents: globalEventManager.registerAllEvents.bind(globalEventManager),
    registerEventsByCategory: globalEventManager.registerEventsByCategory.bind(globalEventManager),
    removeEvent: globalEventManager.removeEvent.bind(globalEventManager),
    removeAllEvents: globalEventManager.removeAllEvents.bind(globalEventManager),
    cleanup: globalEventManager.cleanup.bind(globalEventManager),
    getEventStats: globalEventManager.getEventStats.bind(globalEventManager),
  }
}
