/**
 * WebSocket 配置常量
 */
export const WS_CONFIG = {
  // 连接配置
  CONNECTION: {
    RECONNECT_DELAY: 2000, // 重连延迟
    FASTER_URL_RETRY_DELAY: 3000, // 获取最快地址失败重试延迟
    HEARTBEAT_MSG_ID: 1004, // 心跳消息ID
    VERSION_CHECK_DELAY: 0, // 版本检查延迟
    QUEUE_SEND_DELAY: 100, // 队列发送延迟
    CONNECT_QUEUE_DELAY: 300, // 连接队列发送延迟
  },

  // 消息相关
  MESSAGE: {
    MAX_PACKAGE_COUNT: 255, // 最大包计数
    MIN_BUFFER_LENGTH: 4, // 最小缓冲区长度
    HEADER_LENGTH: 4, // 消息头长度
  },

  // 错误处理
  ERROR: {
    FORBIDDEN_CODE: 403, // 禁止访问错误码
    SUCCESS_CODE: 1, // 成功状态码
  },

  // 不显示错误消息的列表
  SILENT_ERROR_MESSAGES: [
    'account_type_error',
    'withdraw_password_can_be_bound',
    'get_withdraw_password_status_success',
    'withdraw_password_open_success',
    'withdraw_password_operate_failed',
    'captcha_incorrect',
    'account_or_password_incorrect',
  ],

  // 特殊消息ID
  SPECIAL_MSG_IDS: {
    REPEAT_LOGIN: 'msg_notify_repeat_login',
  },
} as const

/**
 * WebSocket 连接状态枚举
 */
export enum WsConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  PAUSED = 'paused',
}

/**
 * WebSocket 事件类型
 */
export enum WsEventType {
  OPEN = 'wsopen',
  CLOSE = 'wsclose',
  ERROR = 'wserror',
  MESSAGE = 'wsmessage',
  RECONNECT = 'wsreconnect',
}
