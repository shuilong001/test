import type { IDecodedMessage, IMessageHandler, IMessagePacket } from './types'
import { WS_CONFIG } from './config'
import { RingBuffer } from '@/web-base/net/RingBuffer'
import { MessageMap } from '@/web-base/net/MessageMap'
import { EncodeUtils } from '@/web-base/net/EncodeUtils'
import { i18n } from '@/utils/i18n'
import { showToast } from 'vant'
import eventBus from './eventBus'

/**
 * WebSocket 消息处理器
 * 负责消息的编码、解码和分发
 */
export class MessageHandler implements IMessageHandler {
  private ringBuffer = new RingBuffer()
  private packageCount = 1
  private getMsgTypeFn?: (msgID: number) => string
  private onMessageDecodedFn?: (msgID: number, message: any) => void

  constructor(
    getMsgType: (msgID: number) => string,
    onMessageDecoded?: (msgID: number, message: any) => void,
  ) {
    this.getMsgTypeFn = getMsgType
    this.onMessageDecodedFn = onMessageDecoded
  }

  /**
   * 接收 WebSocket 消息
   */
  receiveMessage(buf: Uint8Array): void {
    const len = buf.byteLength
    if (!buf || len === 0) {
      console.warn('收到空消息')
      return
    }

    // 将数据写入环形缓冲区
    for (let i = 0; i < len; i++) {
      this.ringBuffer.Push(buf[i] as any)
    }

    // 处理缓冲区中的所有完整消息
    this.processBufferedMessages()
  }

  /**
   * 处理缓冲区中的消息
   */
  private processBufferedMessages(): void {
    while (true) {
      const receivedLength = this.ringBuffer.DataLength()

      // 检查是否有足够的数据读取消息长度
      if (receivedLength < WS_CONFIG.MESSAGE.MIN_BUFFER_LENGTH) {
        break
      }

      // 读取消息体长度
      const bodyLen = this.ringBuffer.decode_msg_total_length()
      if (bodyLen < 1) {
        console.warn('消息体长度无效:', bodyLen)
        break
      }

      // 检查是否有完整的消息
      if (receivedLength < bodyLen + WS_CONFIG.MESSAGE.HEADER_LENGTH) {
        break
      }

      // 解码消息
      this.decodeMessage(bodyLen)
    }
  }

  /**
   * 解码单个消息
   */
  decodeMessage(bodyLen: number): void {
    try {
      // 跳过消息长度字段
      this.ringBuffer.addHead(WS_CONFIG.MESSAGE.HEADER_LENGTH)

      // 读取消息ID
      const msgID = this.ringBuffer.decode_msg_id()

      // 获取消息结构
      const messageStruct = MessageMap.getMessage(msgID)
      if (!messageStruct) {
        console.warn('未注册的消息ID:', msgID)
        // 跳过这条消息的数据
        this.ringBuffer.addHead(bodyLen - WS_CONFIG.MESSAGE.HEADER_LENGTH)
        return
      }

      // 解码消息体
      const message = this.ringBuffer.decode_msg_body(
        messageStruct,
        bodyLen - WS_CONFIG.MESSAGE.HEADER_LENGTH,
      ) as IDecodedMessage

      // 处理解码后的消息
      this.handleDecodedMessage(msgID, message)
    }
    catch (error) {
      console.error('消息解码失败:', error)
      // 尝试跳过当前消息
      this.ringBuffer.addHead(bodyLen - WS_CONFIG.MESSAGE.HEADER_LENGTH)
    }
  }

  /**
   * 处理解码后的消息
   */
  private handleDecodedMessage(
    msgID: number,
    message: IDecodedMessage,
  ): void {
    // 处理错误消息
    this.handleErrorMessage(message, msgID)

    // 日志输出（排除心跳消息）
    if (msgID !== WS_CONFIG.CONNECTION.HEARTBEAT_MSG_ID) {
      this.logMessage(msgID, message)
    }

    // 特殊消息处理
    this.handleSpecialMessages(msgID, message)

    // 通知外部处理器
    if (this.onMessageDecodedFn) {
      this.onMessageDecodedFn(msgID, message)
    }

    // 发送事件
    const msgType = this.getMsgType(msgID)
    eventBus.emit(msgType, message)
  }

  /**
   * 处理错误消息
   */
  private handleErrorMessage(message: IDecodedMessage, msgID: number): void {
    if (message.code !== WS_CONFIG.ERROR.SUCCESS_CODE && message.message) {
      // 检查是否是静默错误
      if (WS_CONFIG.SILENT_ERROR_MESSAGES.includes(message.message as any)) {
        return
      }

      const t = i18n.global.t
      const errorContent = message.message || `${t('home_all_internet_error')}: ${msgID}`
      showToast(t(errorContent))
    }
  }

  /**
   * 记录消息日志
   */
  private logMessage(msgID: number, message: IDecodedMessage): void {
    const msgType = this.getMsgType(msgID)
    console.log(`返回 %c${msgType}`, 'color:#1dc51d')

    // 深拷贝消息对象用于日志输出
    const logMessage = JSON.parse(JSON.stringify(message))
    console.log(logMessage)
  }

  /**
   * 处理特殊消息
   */
  private handleSpecialMessages(
    msgID: number,
    message: IDecodedMessage,
  ): void {
    const msgType = this.getMsgType(msgID)

    // 处理重复登录消息
    if (msgType === WS_CONFIG.SPECIAL_MSG_IDS.REPEAT_LOGIN) {
      console.error('检测到重复登录')
    }

    // 处理 403 错误 - 清空发送队列
    if (message.code === WS_CONFIG.ERROR.FORBIDDEN_CODE) {
      console.warn('收到 403 错误，需要清空发送队列')
      eventBus.emit('clear-sending-queue')
    }
  }

  /**
   * 发送消息
   */
  sendMessage(packet: IMessagePacket): void {
    try {
      const msgType = this.getMsgType(packet.getMsgID())
      console.log(`发送 %c${msgType}`, 'color:red')

      // 创建消息副本用于日志
      const logData = JSON.parse(JSON.stringify(packet))
      delete logData.build
      delete logData.decode
      delete logData.encode
      delete logData.getMsgID
      console.log(logData)

      // 编码消息
      const encodedData = this.encodeMessage(packet)

      // 这里需要外部传入发送函数
      this.sendEncodedData(encodedData)
    }
    catch (error) {
      console.error('发送消息失败:', error)
      throw error
    }
  }

  /**
   * 编码消息
   */
  private encodeMessage(packet: IMessagePacket): ArrayBuffer {
    const buf: number[] = []

    // 添加消息包编号
    const count = this.getNextPacketCount()
    EncodeUtils.uInt8ToByte(count, buf)

    // 编码消息体
    packet.build(buf)

    // 编码整个包头（不包括自身的4个字节）
    const bodyLen = EncodeUtils.swab32_msg_total_length(buf.length)
    const bodyLenBuf: number[] = []
    EncodeUtils.encode_msg_total_length(bodyLen, bodyLenBuf)

    // 将包长度放到最前面
    for (let i = 3; i >= 0; i--) {
      buf.unshift(bodyLenBuf[i])
    }

    return new Uint8Array(buf).buffer
  }

  /**
   * 获取下一个包计数
   */
  private getNextPacketCount(): number {
    const count = this.packageCount++
    if (this.packageCount > WS_CONFIG.MESSAGE.MAX_PACKAGE_COUNT) {
      this.packageCount = 1
    }
    return count
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

  /**
   * 发送编码后的数据（需要外部注入）
   */
  private sendEncodedData: (data: ArrayBuffer) => void = () => {
    console.warn('sendEncodedData 方法未设置')
  }

  /**
   * 设置发送数据的方法
   */
  setSendDataMethod(sendFn: (data: ArrayBuffer) => void): void {
    this.sendEncodedData = sendFn
  }

  /**
   * 重置状态（重连时使用）
   */
  reset(): void {
    this.packageCount = 1
    // 注意：不重置 ringBuffer，因为可能还有未处理的数据
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.reset()
    // 可以在这里清理其他资源
  }
}
