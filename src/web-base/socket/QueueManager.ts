import type { IQueueManager, IQueueRequest } from './types'

/**
 * 请求队列管理器
 * 负责管理 WebSocket 请求的队列化处理
 */
export class QueueManager implements IQueueManager {
  private connectList: IQueueRequest[] = [] // 未连接时的请求队列
  private loginList: IQueueRequest[] = [] // 未登录时的请求队列
  private sendingList: IQueueRequest[] = [] // 正在发送的请求列表
  private maxQueueSize = 100 // 队列最大长度限制
  private requestTimeout = 30000 // 请求超时时间（30秒）

  /**
   * 添加请求到对应队列
   */
  addToQueue(request: IQueueRequest, needLogin: boolean): void {
    const targetList = needLogin ? this.loginList : this.connectList

    // 检查队列大小限制
    if (targetList.length >= this.maxQueueSize) {
      console.warn('队列已满，移除最旧的请求')
      targetList.shift()
    }

    const msgId = request.obj.getMsgID()

    // 使用 getMsgID() 作为唯一标识去重
    const existingIndex = targetList.findIndex(item =>
      item.obj.getMsgID() === msgId,
    )

    if (existingIndex !== -1) {
      // 更新现有请求
      targetList[existingIndex] = {
        ...request,
        timestamp: Date.now(),
      }
      // console.log(`更新队列中的请求: ${msgId}`)
    }
    else {
      // 添加新请求
      targetList.push({
        ...request,
        timestamp: Date.now(),
      })
      // console.log(`添加新请求到${needLogin ? '登录' : '连接'}队列: ${msgId}`)
    }
  }

  /**
   * 发送队列中的所有请求
   */
  sendAll(needLogin: boolean): void {
    const list = needLogin ? this.loginList : this.connectList
    // console.log(`%c等待队列${needLogin ? '登录' : '连接'}`, 'color: #f3b40b', list.length)
    // console.log('队列详细内容:', list.map(item => ({ msgID: item.obj.getMsgID(), callbackName: item.callbackName })))

    // 清理过期请求
    this.cleanExpiredRequests(list)

    const pendingRequests = [...list] // 创建副本避免在遍历过程中修改原数组

    // 清空对应队列（在发送前清空，避免重复添加）
    if (needLogin) {
      this.loginList = []
    }
    else {
      this.connectList = []
    }

    // 发送所有待处理的请求
    pendingRequests.forEach((request) => {
      // console.log(`发送队列请求: ${request.obj.getMsgID()}`)
      const success = this.sendRequest(request)

      // 如果发送失败，重新添加到队列末尾
      if (!success) {
        console.warn(`队列请求发送失败，重新添加到队列: ${request.obj.getMsgID()}`)
        const targetList = needLogin ? this.loginList : this.connectList
        targetList.push(request)
      }
    })
  }

  /**
   * 添加请求到发送中列表
   */
  addToSendingList(request: IQueueRequest): void {
    const msgID = request.obj.getMsgID()

    // 使用 msgID 去重
    const existingIndex = this.sendingList.findIndex(item =>
      item.msgID === msgID,
    )

    if (existingIndex !== -1) {
      // 更新现有请求
      this.sendingList[existingIndex] = {
        ...request,
        timestamp: Date.now(),
      }
    }
    else {
      // 添加新请求
      this.sendingList.push({
        ...request,
        timestamp: Date.now(),
      })
    }
  }

  /**
   * 从发送中列表移除请求并执行回调
   */
  removeFromSendingList(msgID: number, message?: any): void {
    // 通过响应消息类型找到对应请求
    const callbackName = this.getMsgType(msgID)

    // 找到所有匹配回调名的请求
    const matchingRequests = this.sendingList.filter(item =>
      item.callbackName === callbackName,
    )

    // 执行回调并移除
    matchingRequests.forEach((request) => {
      if (request.config?.callback) {
        try {
          request.config.callback(message)
        }
        catch (error) {
          console.error('回调执行错误:', error)
        }
      }
    })

    // 从发送列表中移除
    this.sendingList = this.sendingList.filter(item =>
      item.callbackName !== callbackName,
    )
  }

  /**
   * 清空所有队列
   */
  clearAll(): void {
    this.connectList = []
    this.loginList = []
    // 注意：通常不清空 sendingList，因为可能有正在等待响应的请求
  }

  /**
   * 清空发送中列表（重连时使用）
   */
  clearSendingList(): void {
    this.sendingList = []
  }

  /**
   * 获取队列状态
   */
  getQueueStatus() {
    return {
      connectList: [...this.connectList],
      loginList: [...this.loginList],
      sendingList: [...this.sendingList],
    }
  }

  /**
   * 获取队列大小
   */
  getQueueSizes() {
    return {
      connect: this.connectList.length,
      login: this.loginList.length,
      sending: this.sendingList.length,
    }
  }

  /**
   * 设置队列最大大小
   */
  setMaxQueueSize(size: number): void {
    this.maxQueueSize = Math.max(1, size)
  }

  /**
   * 清理过期请求
   */
  private cleanExpiredRequests(list: IQueueRequest[]): void {
    const now = Date.now()
    const expiredIndices: number[] = []

    list.forEach((request, index) => {
      if (now - request.timestamp > this.requestTimeout) {
        expiredIndices.push(index)
      }
    })

    // 从后往前删除，避免索引错乱
    expiredIndices.reverse().forEach((index) => {
      list.splice(index, 1)
    })

    if (expiredIndices.length > 0) {
      console.warn(`清理了 ${expiredIndices.length} 个过期请求`)
    }
  }

  /**
   * 发送请求的具体实现（需要外部注入）
   */
  private sendRequest: (request: IQueueRequest) => boolean = () => {
    console.warn('sendRequest 方法未设置')
    return false
  }

  /**
   * 设置发送请求的方法
   */
  setSendRequestMethod(sendFn: (request: IQueueRequest) => boolean): void {
    this.sendRequest = sendFn
  }

  /**
   * 获取消息类型名称的方法
   */
  private getMsgTypeFn?: (msgID: number) => string

  /**
   * 设置获取消息类型的方法
   */
  setGetMsgTypeMethod(getMsgTypeFn: (msgID: number) => string): void {
    this.getMsgTypeFn = getMsgTypeFn
  }

  /**
   * 获取消息类型名称
   */
  private getMsgType(msgID: number): string {
    if (this.getMsgTypeFn) {
      return this.getMsgTypeFn(msgID)
    }
    return `unknown_${msgID}`
  }
}
