// websocket 类
import { useSystemStore } from '@/stores/modules/system'
import { getFastestUrl } from '@/web-base/utils/useStoreMethods'
import { RingBuffer } from '@/web-base/net/RingBuffer'
import { MessageMap } from '@/web-base/net/MessageMap'
import { EncodeUtils } from '@/web-base/net/EncodeUtils'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { NetPacket } from '@/web-base/netBase/NetPacket'
import eventBus from './eventBus'
import { i18n } from '@/utils/i18n'
import { usePageStore } from '@/stores/modules/page'
import { NET_VERSION } from '@/constants'
import { showToast } from 'vant'

// NOTE: 由于此文件在 Pinia 完成 app.use(pinia) 之前就可能被导入，
// 直接调用 useSystemStore/useUserStore 等会导致 "getActivePinia() was called" 的报错。
// 因此改为 **延迟** 获取，等到真正使用时再初始化。

let systemStore: ReturnType<typeof useSystemStore>
let pageStore: ReturnType<typeof usePageStore>

function initStores() {
  if (!systemStore)
    systemStore = useSystemStore()

  if (!pageStore)
    pageStore = usePageStore()
}

const t = i18n.global.t

// 根据协议在什么状态能发送分为3种：1，只能登录前发送；2，只能登录后发送；3，任何状态可以发送
// 这里是不需要判断状态的协议
const freeRequests: any = [
  NetMsgType.msgType.msg_req_check_version,
  NetMsgType.msgType.msg_req_get_send_sms_check_code,
  NetMsgType.msgType.msg_req_check_sms_code,
  NetMsgType.msgType.msg_req_reset_password,
  NetMsgType.msgType.msg_req_add_guest,
  NetMsgType.msgType.msg_req_register_captcha,
  NetMsgType.msgType.msg_req_create_v2,
  NetMsgType.msgType.msg_req_get_mobile_sms_login_code,
  NetMsgType.msgType.msg_req_register_account,
  NetMsgType.msgType.msg_req_login,
  // NetMsgType.msgType['msg_req_role_single_link_login'],
  NetMsgType.msgType.msg_req_login_captcha,
  NetMsgType.msgType.msg_req_role_login,
  NetMsgType.msgType.msg_req_role_login_with_ip,
  NetMsgType.msgType.msg_req_create_role,
  NetMsgType.msgType.msg_req_init_connect,
  NetMsgType.msgType.msg_req_login_check,
]

// 请求池
const QueuePool: any = {
  connectList: [], // 未连接时的请求队列
  loginList: [], // 未登录时的请求队列
  sendingList: [], // 用于记录正在发送的请求
  add2list: (req: any) => { // 添加到队列
    if (req.needLogin) {
      // 使用 getMsgID() 作为唯一标识去重
      const target = QueuePool.loginList.find((item: any) =>
        item.obj.getMsgID() === req.obj.getMsgID(),
      )
      if (!target) {
        QueuePool.loginList.push(req)
      }
    }
    else {
      // 使用 getMsgID() 作为唯一标识去重
      const target = QueuePool.connectList.find((item: any) =>
        item.obj.getMsgID() === req.obj.getMsgID(),
      )
      if (!target) {
        QueuePool.connectList.push(req)
      }
    }
  },
  sendAll: (needLogin: boolean) => { // 发送队列
    const list = (needLogin ? QueuePool.loginList : QueuePool.connectList)
    console.log(`%c等待队列${needLogin}`, 'color: #f3b40b', list.length)
    list.forEach((req: any) => {
      WsClass.instance.send(req.obj, req.needLogin, req.config)
    })
    if (needLogin) {
      QueuePool.loginList = []
    }
    else {
      QueuePool.connectList = []
    }
  },
  add2SendingList: (req: any, needLogin: boolean, config: any) => { // 添加一个请求到发送记录
    // 获取请求唯一ID
    const msgID = req.getMsgID()
    // 使用 msgID 去重
    const target = QueuePool.sendingList.find((item: any) =>
      item.msgID === msgID,
    )
    if (!target) {
      QueuePool.sendingList.push({
        req,
        needLogin,
        config,
        msgID,
        callbackName: config?.callbackName, // 保留回调名用于响应匹配
      })
    }
    else {
      // 更新现有请求
      target.req = req
      target.config = config
      target.needLogin = needLogin
      target.callbackName = config?.callbackName
    }
  },
  removeFromSendingList: (msgID: any, message?: any) => { // 从发送记录里移除这个请求
    // 通过响应消息类型找到对应请求
    const callbackName = getMsgType(msgID)
    // 找到所有匹配回调名的请求
    const targets = QueuePool.sendingList.filter((item: any) =>
      item.callbackName === callbackName,
    )
    // 执行回调并移除
    targets.forEach((target: { config: { callback: (arg0: any) => void } }) => {
      if (target.config?.callback) {
        target.config.callback(message)
      }
    })
    QueuePool.sendingList = QueuePool.sendingList.filter((item: any) =>
      item.callbackName !== callbackName,
    )
    // console.error('---移除请求:' + callbackName, QueuePool.sendingList);
  },
  clearAll: () => { // 重连后要清空全部
    // console.error('---移除所有请求:')
    QueuePool.connectList = []
    QueuePool.loginList = []
    // QueuePool.sendingList = []
  },
}

let reconnectTimeout: any = null
// ws类
export class WsClass {
  // 单例
  private static _instance: WsClass
  public static get instance(): WsClass {
    if (!WsClass._instance) {
      WsClass._instance = new WsClass()
    }
    return WsClass._instance
  }

  private ip: string = '' // ws地址
  private ws?: WebSocket // ws实例
  private ringBuffer = new RingBuffer()
  private packageCount = 1 // 消息包编号
  private loading: boolean = false // ws连接中
  private fasterLoading: boolean = false // 获取最快地址的loading
  private pause: boolean = false // 主动断开时使用，再次发送请求会重新激活连接

  // 构造
  private constructor() {
    // 确保在实例化时已正确初始化 Pinia store
    initStores()
    this.reset()
  }

  // 重置状态
  private reset() {
    this.packageCount = 1
    if (this.ws) {
      this.ws.onopen = null
      this.ws.onmessage = null
      this.ws.onerror = null
      this.ws.onclose = null
    }
    systemStore.setWsConnected(false)
    systemStore.setLoggedIn(false)
    QueuePool.clearAll()
  }

  // 重新初始化
  reInit() {
    this.pauseWs()
    setTimeout(() => {
      this.pause = false
      this.loading = false
      this.fasterLoading = false
      showToast(t('reconnect'))
      this.init()
    }, 1000)
  }

  // 初始化
  init() {
    if (this.pause)
      return
    if (this.loading || this.fasterLoading)
      return
    this.loading = true
    this.fasterLoading = true
    return new Promise((resolve) => {
      // 重置连接和登录状态
      this.reset()
      const getUrl = () => {
        console.log('%c-- 检测最快地址中 --', 'color: #f3b40b')
        getFastestUrl().then((res) => {
          this.fasterLoading = false
          this.ip = res
          this.connect()
          resolve(res)
        }).catch(() => {
          setTimeout(() => {
            this.fasterLoading = false
            // 如果获取最速ip失败，就等一会重新再获取
            getUrl()
          }, 3000)
        })
      }
      getUrl()
    })
  }

  // 连接ws
  connect() {
    console.log('%c--- 开始连接 ---', 'color: #f3b40b', this.ip)
    this.ws = new WebSocket(this.ip, [])
    this.ws.id = Date.now()
    // this.ws[id] = Date.now()
    this.ws.onopen = () => {
      this.loading = false
      console.log(`%c--- onopen --- ${this.ws.id}`, 'color: #f3b40b')
      systemStore.setWsConnected(true)
      eventBus.emit('wsopen')
      pageStore.setPageLoading(false)
      // 发送第一个请求-版本检测
      setTimeout(() => {
        const req = NetPacket.req_check_version()
        req.version = NET_VERSION
        this.send(req, false)
      }, 0)
      // 清空回调队列
      setTimeout(() => {
        console.log('正在发送中的请求队列', QueuePool.sendingList)
        if (QueuePool.sendingList.length) {
          QueuePool.sendingList.forEach((item: any) => {
            this.send(item.req, item.needLogin, item.config)
          })
        }
      }, 100)
      // 清空等待队列
      setTimeout(() => {
        if (this.loading)
          return
        QueuePool.sendAll(false)
      }, 300)
    }
    this.ws.onclose = (res) => {
      console.error('--- onclose ---', res)
      if (this.ws?.id !== res.target?.id)
        return console.error('历史ws断开')
      this.reset()
      // 主动断开不需要重连
      if (this.pause)
        return
      if (reconnectTimeout)
        clearTimeout(reconnectTimeout)
      reconnectTimeout = setTimeout(() => {
        this.loading = false
        pageStore.setReConnectWs(true)
        this.init()
      }, 2000)
    }
    this.ws.onmessage = (event) => {
      if (typeof event.data == 'string') {
        const array = []
        for (let i = 0; i < event.data.length; i++) {
          array.push(event.data.charCodeAt(i))
        }
        const buf = new Uint8Array(array)
        this.ReceiveMessage(buf, event)
        return
      }
      const reader = new FileReader()
      reader.readAsArrayBuffer(event.data)
      reader.onload = () => {
        const buf = new Uint8Array(reader.result as any)
        // 先存入队列中
        this.ReceiveMessage(buf, event)
      }
    }
    this.ws.onerror = (res) => {
      console.error('--- onerror ---', res)
      systemStore.setWsLoginStatus(false)
      if (this.ws?.id !== res.target?.id)
        return console.error('历史ws异常')
      this.reset()
      if (reconnectTimeout)
        clearTimeout(reconnectTimeout)
      reconnectTimeout = setTimeout(() => {
        this.loading = false
        this.init()
      }, 2000)
    }
  }

  // 主动断开的重连
  reConnectWs() {
    if (!this.pause)
      return
    pageStore.setReConnectWs(true)
    this.pause = false
    this.connect()
  }

  // 暂时断开，用于进入游戏
  pauseWs() {
    this.pause = true
    try {
      this.ws?.close()
      console.error('断开成功')
    }
    catch {
      console.error('断开失败')
    }
  }

  // 直接断开ws，触发自动重连
  closeWs() {
    try {
      this.ws?.close()
      console.error('断开成功')
    }
    catch {
      console.error('断开失败')
    }
  }

  // 接收到的二进制消息
  ReceiveMessage(buf: any, res: any) {
    const len = buf.byteLength
    if (buf === undefined || buf === null || len === 0) {
      return
    }
    for (let i = 0; i < len; ++i) {
      this.ringBuffer.Push(buf[i])
    }
    while (true) {
      const receivedlength = this.ringBuffer.DataLength()
      if (receivedlength < 4) {
        return
      }

      const bodyLen = this.ringBuffer.decode_msg_total_length()

      if (bodyLen < 1) {
        return
      }

      if (receivedlength < bodyLen + 4) {
        return
      }
      this.DecodeMessage(bodyLen, res)
    }
  }

  // 解码消息体
  DecodeMessage(bodyLen: number, res: any) {
    this.ringBuffer.addHead(4) // 先去掉4个字节的包长度，再开始解析msg_id
    const msgID = this.ringBuffer.decode_msg_id()

    const messageStruct = MessageMap.getMessage(msgID)
    if (messageStruct == null) {
      // 找不到对应的解码结构体时，循环消息ringbuffer的标识也要往后移，跳过这条消息的数据
      this.ringBuffer.addHead(bodyLen - 4)
      console.log('msgID not register', msgID)
      return
    }
    const message = this.ringBuffer.decode_msg_body(messageStruct, bodyLen - 4)
    if (message.code !== 1) {
      if (message.message) {
        const notShowMsg = ['account_type_error', 'withdraw_password_can_be_bound', 'get_withdraw_password_status_success', 'withdraw_password_open_success', 'withdraw_password_operate_failed', 'captcha_incorrect', 'account_or_password_incorrect']
        if (!notShowMsg.includes(message.message)) {
          const errorContent = message.message || `${t('home_all_internet_error')}: ${msgID}`
          showToast(t(errorContent))
        }
      }
    }
    if (![1004].includes(msgID)) { // 心跳消息不打印
      const msgObj = JSON.parse(JSON.stringify(message))
      // console.log(`返回 %c${msgID} `, 'color:#1dc51d')
      console.log(`返回 %c${getMsgType(msgID)}`, 'color:#1dc51d')
      console.log(msgObj)
      if (getMsgType(msgID) === 'msg_notify_repeat_login') {
        console.error('当前id:', this.ws?.id)
        console.error('历史id:', res.target?.id)
      }

      // todo 接口403是统一接口返回的,之前请求不会返回,请求中的会一直保存在那,暂时如果有403的话,清空全部发送中的请求队列
      if (msgObj.code === 403) {
        QueuePool.sendingList = []
      }
    }
    if (res.target?.id !== this.ws?.id) {
      return
    }
    // if (msgID == 5) { // 这个事件id监听不到  登录完成事件
    //     eventBus.emit('10086', message)
    // }
    // 从历史请求中移除
    QueuePool.removeFromSendingList(msgID, message)
    // 抛出事件
    eventBus.emit(getMsgType(msgID), message)
  }

  // 发送消息
  // obj-NetPacket获取的请求体   needLogin-是否需要登录  config-其他请求选项
  /*
    * config 的字段如下：
    *
    *   callbackName: string, // 是否开启请求的回调协议监听，开启后如果发送请求未成功返回，会放入历史列表，下次ws连接时会自动重新请求，用于一些必须要自动获取到的数据。传入该请求返回时监听的协议名字。比如发起协议 msg_req_check_version 这里 callbackName的值就是 msg_notify_check_version
    *   callback: func, // 回调函数，单独传无效，必须与 callbackName 同时传，返回的协议匹配到 callbackName 时执行
    *
    * */
  send(obj: any, needLogin: boolean, config?: any) {
    // 暂停状态的话,暂停发送消息,不然会触发下面重新激活ws
    if (this.pause) {
      return false
    }
    const reqId = obj.getMsgID() // 请求id
    if (needLogin && !freeRequests.includes(reqId)) { // 检测登录状态
      if (!systemStore.isWsLogin) { // 未登录，放到 未登录请求池
        console.log('未登录，放到 未登录请求池', obj)
        QueuePool.add2list({ obj, needLogin, config })
        return
      }
    }
    else { // 检测连接状态
      if (!systemStore.isWsConnected) { // 未连接，放到 未连接请求池
        QueuePool.add2list({ obj, needLogin, config })
        return
      }
      if (this.pause) { // 暂停状态，主动去连接
        this.pause = false
        setTimeout(() => {
          console.error('重新激活WS')
          this.init()
        }, 0)
      }
    }

    // 发送请求
    if (config && config.callbackName) { // 存入请求历史
      QueuePool.add2SendingList(obj, needLogin, config)
    }
    // 检测是否已经连接
    if (this.ws?.readyState === WebSocket.CONNECTING) {
      return false
    }
    this.sendRequest(obj)
  }

  sendRequest(data: any) {
    const msg = JSON.parse(JSON.stringify(data))
    delete msg.build
    delete msg.decode
    delete msg.encode
    delete msg.getMsgID
    console.log(`发送 %c${getMsgType(data.getMsgID())}`, 'color:red')
    console.log(msg)

    // 消息包编号，服务器需要用到
    const buf: any = []
    const count = this.calcPacketCount()
    EncodeUtils.uInt8ToByte(count, buf)

    // 编码消息体
    data.build(buf)

    // 编码整个包头，不包括自身的4个字节
    const bodylen = EncodeUtils.swab32_msg_total_length(buf.length)
    const bodyLenBuf: any[] = []
    EncodeUtils.encode_msg_total_length(bodylen, bodyLenBuf)

    // 把bodylen放到buf最前面
    for (let i = 3; i >= 0; --i) {
      buf.unshift(bodyLenBuf[i])
    }

    const sendbuffer = new Uint8Array(buf).buffer
    this.ws?.send(sendbuffer)
  }

  sendAll(needLogin: boolean) {
    QueuePool.sendAll(needLogin)
  }

  calcPacketCount() {
    const count = this.packageCount++
    if (this.packageCount > 255) {
      this.packageCount = 1
    }

    return count
  }
}

export default WsClass

// 通过id获取消息的key
export function getMsgType(msgID: number) {
  const msgType: any = NetMsgType.msgType
  for (const key in msgType) {
    if (msgType[key] === msgID) {
      return key
    }
  }
  return 'unknownType'
}
