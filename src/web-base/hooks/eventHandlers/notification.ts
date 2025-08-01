// 通知相关事件处理函数
import { Local } from '@/web-base/utils/storage'
import type {
  DiffOfflineData,
  EmailInfoData,
  SystemMsgData,
  SystemNoticeData,
} from './types'

/* 异地登录回调 */
export async function diffOfflineFunc(res: DiffOfflineData) {
  // 您的账号上次在2024-05-28 19:20:02于xx的xx设备登录，如非本人操作，则密码可能泄露，建议您修改密码
  console.error('异地登录', res)
  res.ip && (await getIPAddress([res]))
  //   diffOfflineObj.value.show = true;
  //   diffOfflineObj.value.content = t("home_page_diffOfflineContent", {
  //     time: convertObjectToDateString(res.login_time),
  //     device: res.device_id ? getDeviceType(res.device_id) : "",
  //     ip: res.location,
  //   });
}

/* 公告消息 */
export async function onHander_system_notice(message: SystemNoticeData) {
  if (Local.get('show_notice') === 0) { // 不展示公告，只有手动登录时才展示
    return
  }
  Local.set('show_notice', 0)
  if (message.notice_list?.length) {
    const dialogList: any = message.notice_list.filter((item: any) => item.position === 1)
    const paomaList: any = message.notice_list.filter((item: any) => item.position === 0)
    // 弹窗公告
    let localIds = [] // 本地记录的不再显示
    try {
      localIds = JSON.parse(localStorage.getItem('readed_notice_ids') || '[]')
    }
    catch {
      localIds = []
    }
    const list: any = dialogList
      .filter((item: any) => !localIds.includes(item.title))
      .sort((a: any, b: any) => {
        return b.priority - a.priority
      })
    if (list.length) {
      // await getLocale(settings.value);
      // await user.setNoticeList(list);
      // user.setNotice(true);
      // noticeRef.value && noticeRef.value.open();
    }
    // 轮播公告
    paomaList.forEach((item: any) => {
      console.error('轮播公告', item)
      // page.setTextAnnouncementMore(t(item.title) + " - " + t(item.content));
    })
  }
}

/* 系统消息通知 */
export async function onHandler_system_msg(m: SystemMsgData) {
  if (m.code === 903) {
    if (m.Params[0] === 1) {
      // 弹窗公告
      try {
        // const list: any = [
        //   {
        //     content: `${m.Params[3]}`,
        //     title: `${m.Params[2]}`,
        //     position: 1,
        //     priority: m.priority,
        //     type: m.Params[1],
        //   },
        // ];
        // await getLocale(settings.value);
        // await user.setNoticeList(list);
        // user.setNotice(true);
        // noticeRef.value && noticeRef.value.open();
      }
      catch { }
    }
  }
  else {
    if (m.Params && m.Params.length === 6) {
      // 跑马灯
      // ***[0]*** 在 [3] 获得 [4] 金币奖励！
      // const str = t("home_notice_mixtext", {
      //   user: `${m.Params[0]?.substr(0, 4)}***`,
      //   game: m.Params[3] ? t(m.Params[3]) : "",
      //   money: m.Params[4] ? Number(m.Params[4]).toLocaleString() : 0,
      // });
      // page.setTextAnnouncementMore(str);
    }
  }
}

/* 邮件列表 */
export async function handleEmailInfo(rs: EmailInfoData) {
  console.error('返回的邮件列表', rs)
  /*
    list: 消息中心数据
    rewardList: 奖励邮箱数据
    email_readed: 已读
    email_unget: 未领取
    hasNoRead: 是否有未读邮件
    hasNoReceive: 是否有未领取奖励
  */
}

/* 新邮件 */
export async function handleNewEmail(rs: EmailInfoData) {
  console.error('新邮件', rs)
}

// 临时的 getIPAddress 函数声明，需要从原始位置导入
declare function getIPAddress(ips: any[]): Promise<void>
