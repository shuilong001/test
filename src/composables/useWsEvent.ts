import { onBeforeUnmount } from 'vue'
import eventBus from '@/web-base/socket/eventBus'
import type { WsEvents } from '@/types/ws-events'

// 通用订阅函数：在组件卸载时自动 off，保持类型安全
export function useWsEvent<K extends keyof WsEvents>(
  event: K,
  handler: (payload: WsEvents[K]) => void,
) {
  eventBus.on(event, handler)
  onBeforeUnmount(() => {
    eventBus.off(event, handler)
  })
}
