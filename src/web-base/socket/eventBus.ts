// eventBus
import mitt from 'mitt'
import type { WsEvents } from '@/types/ws-events'

// 创建一个事件总线实例
const eventBus = mitt<WsEvents>()

export default eventBus

// // 发送事件
// eventBus.emit('event-name', data);

// // 监听事件
// eventBus.on('event-name', callback);

// 停止监听事件 如果不传callback则移除所有，如果传了只移除传入的监听
// 所以组件里最好都手动移除一下指定函数，不移除会导致内存泄露
// eventBus.off('event-name', callback);
