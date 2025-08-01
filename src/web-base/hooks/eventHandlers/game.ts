// 游戏相关事件处理函数
import { computed } from 'vue'
import { Local } from '@/web-base/utils/storage'
import type {
  CollectResultData,
  GameUrlResultData,
} from './types'

/* 打开游戏 */
export async function gameUrlResult(message: GameUrlResultData) {
  // 在游戏页面不需要做回调处理
  //   if (route.name == "openGame") {
  //     return false;
  //   }
  if (message.code !== 0) { // 打开失败
    // showToast.fail(message.msg);
    // Page(pinia).setThirdGameIsRequest(false)
    return
  }
  if (message.url.includes('<!doctype html>')) { // 获取gameUrl
    message.url = `data:text/html;charset=utf-8,${encodeURIComponent(
      String(message.url),
    )}`
  }
  Local.set('gameUrl', message.url)
  // 打开游戏

  // 自研游戏 如果当前还在游戏页面 主动断开ws
  //   if (["openGame", "game"].includes(route.name) && item.agentId === ZiYanGame) {
  //     PKwebsocket.instance.pauseWs()
  //   }
}

/* 获取到的所有收藏的游戏id集合 */
export async function resAllCollect(data: CollectResultData) {
  console.error('获取到的收藏的游戏id集合', data)
  // await User(pinia).getCollected(data.collected);
}

/* 收藏/取消收藏游戏操作的反馈 */
const allCollected = computed(() => []) // 所有已收藏的数据
export async function resCollect(data: CollectResultData) {
  if (data.rlt === 0) {
    // 这里原来是根据 本地缓存的id 来判断是否收藏成功还是取消收藏 可以看看是否有更合理的方式
    console.error('收藏/取消收藏游戏操作的反馈', data, allCollected.value)
  }
  else if (data.rlt === 1) {
    // 收藏达到上限
  }
  else {
    // 未知错误
  }
}
