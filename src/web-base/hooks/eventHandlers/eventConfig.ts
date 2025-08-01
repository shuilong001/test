// 事件配置管理
import {
  diffOfflineFunc,
  gameUrlResult,
  handleDepositSuc,
  handleEmailInfo,
  handleLoginNotify,
  handleLoginResult,
  handleNewEmail,
  handleRoleInfo,
  handleUnknownType,
  handleUpdateMoney1,
  handleUpdateMoney2,
  handleUserInfo,
  handleVersionCheck,
  handleVipInfo,
  onHander_system_notice,
  onHandler_system_msg,
  resAllCollect,
  resCollect,
} from '.'

// 事件类型枚举
export enum EventType {
  // 通知相关
  DIFF_OFFLINE = 'msg_notify_diff_loc_login_notification',
  SYSTEM_NOTICE = 'msg_notify_send_system_notice',
  SYSTEM_MSG = 'msg_notify_sys_msg',
  EMAIL_LIST = 'msg_notify_email_list',
  NEW_EMAIL = 'msg_notify_new_email',

  // 用户相关
  MONEY_UPDATE_1 = 'msg_notify_roleinfo_with_id',
  MONEY_UPDATE_2 = 'msg_notify_money_update2',
  ROLE_INFO = 'msg_notify_roleinfo_msg',
  USER_INFO = 'msg_notify_user_info',
  VIP_INFO = 'msg_notify_vip_info',
  DEPOSIT_SUCCESS = 'msg_notify_recharge_success_from_third',

  // 游戏相关
  GAME_URL_RESULT = 'msg_notify_3rd_game_login_result',
  ALL_COLLECTED = 'msg_notify_all_collected',
  MODIFY_COLLECT = 'msg_notify_modify_collect',

  // 系统级事件
  VERSION_CHECK = 'msg_notify_check_version',
  LOGIN_NOTIFY = 'msg_nodify_login',
  LOGIN_RESULT = 'msg_notify_login_result',
  UNKNOWN_TYPE = 'unknownType',
}

// 事件处理函数类型
export type EventHandler = (data?: any) => void | Promise<void>

// 事件配置接口
export interface EventConfig {
  type: EventType
  handler: EventHandler
  category: 'notification' | 'user' | 'game' | 'system'
  description: string
}

// 事件配置映射
export const EVENT_CONFIG_MAP: Record<EventType, EventConfig> = {
  // 通知相关事件
  [EventType.DIFF_OFFLINE]: {
    type: EventType.DIFF_OFFLINE,
    handler: diffOfflineFunc,
    category: 'notification',
    description: '异地登录提醒',
  },
  [EventType.SYSTEM_NOTICE]: {
    type: EventType.SYSTEM_NOTICE,
    handler: onHander_system_notice,
    category: 'notification',
    description: '公告信息',
  },
  [EventType.SYSTEM_MSG]: {
    type: EventType.SYSTEM_MSG,
    handler: onHandler_system_msg,
    category: 'notification',
    description: '系统消息',
  },
  [EventType.EMAIL_LIST]: {
    type: EventType.EMAIL_LIST,
    handler: handleEmailInfo,
    category: 'notification',
    description: '返回的邮件列表',
  },
  [EventType.NEW_EMAIL]: {
    type: EventType.NEW_EMAIL,
    handler: handleNewEmail,
    category: 'notification',
    description: '监听新邮件',
  },

  // 用户相关事件
  [EventType.MONEY_UPDATE_1]: {
    type: EventType.MONEY_UPDATE_1,
    handler: handleUpdateMoney1,
    category: 'user',
    description: '余额变化1',
  },
  [EventType.MONEY_UPDATE_2]: {
    type: EventType.MONEY_UPDATE_2,
    handler: handleUpdateMoney2,
    category: 'user',
    description: '余额变化2',
  },
  [EventType.ROLE_INFO]: {
    type: EventType.ROLE_INFO,
    handler: handleRoleInfo,
    category: 'user',
    description: '返回的用户角色信息',
  },
  [EventType.USER_INFO]: {
    type: EventType.USER_INFO,
    handler: handleUserInfo,
    category: 'user',
    description: '返回的用户基础信息',
  },
  [EventType.VIP_INFO]: {
    type: EventType.VIP_INFO,
    handler: handleVipInfo,
    category: 'user',
    description: '返回的用户会员信息',
  },
  [EventType.DEPOSIT_SUCCESS]: {
    type: EventType.DEPOSIT_SUCCESS,
    handler: handleDepositSuc,
    category: 'user',
    description: '充值成功',
  },

  // 游戏相关事件
  [EventType.GAME_URL_RESULT]: {
    type: EventType.GAME_URL_RESULT,
    handler: gameUrlResult,
    category: 'game',
    description: '获取到的第三方游戏返回url（打开游戏）',
  },
  [EventType.ALL_COLLECTED]: {
    type: EventType.ALL_COLLECTED,
    handler: resAllCollect,
    category: 'game',
    description: '获取到的收藏的游戏id集合',
  },
  [EventType.MODIFY_COLLECT]: {
    type: EventType.MODIFY_COLLECT,
    handler: resCollect,
    category: 'game',
    description: '添加到收藏的反馈',
  },

  // 系统级事件
  [EventType.VERSION_CHECK]: {
    type: EventType.VERSION_CHECK,
    handler: handleVersionCheck,
    category: 'system',
    description: '版本检测',
  },
  [EventType.LOGIN_NOTIFY]: {
    type: EventType.LOGIN_NOTIFY,
    handler: handleLoginNotify,
    category: 'system',
    description: '登录成功，需要同步服务器登录状态',
  },
  [EventType.LOGIN_RESULT]: {
    type: EventType.LOGIN_RESULT,
    handler: handleLoginResult,
    category: 'system',
    description: '监听登录成功，然后释放登录等待池',
  },
  [EventType.UNKNOWN_TYPE]: {
    type: EventType.UNKNOWN_TYPE,
    handler: handleUnknownType,
    category: 'system',
    description: '未知消息类型',
  },
}

// 按分类获取事件配置
export function getEventsByCategory(category: EventConfig['category']): EventConfig[] {
  return Object.values(EVENT_CONFIG_MAP).filter(config => config.category === category)
}

// 获取所有事件配置
export function getAllEvents(): EventConfig[] {
  return Object.values(EVENT_CONFIG_MAP)
}
