import { useGameStore } from '@/stores/modules/game'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'

export function useGame(query: { agentId: string, gameId: string, venueId: string }) {
  const myRecentGames = ref<ResMyGames['recently']>([])
  const myCollectedGames = ref<ResMyGames['collected']>([])
  const gameStore = useGameStore()
  const newInfo = ref<ResGamesFullInfo>()
  // 包含收藏数点赞数的信息
  const gameInfo = computed<(GamePlatform | Game) & ResGamesFullInfo>(() => {
    const info = gameStore.getAllThreeGames.find(item => `${item.agentId}-${item.gameId}` === `${query.agentId}-${query.gameId}`)
    return {
      ...info,
      ...newInfo.value,
    }
  })
  // 获取收藏和最近访问都游戏
  async function getMyGames() {
    const data = await wsRequest<ResMyGames>({
      msgId: NetMsgType.msgType.msg_req_my_games,
      callbackId: NetMsgType.msgType.msg_notify_req_my_games,
      needLogin: true,
    })
    myCollectedGames.value = data.collected
    myRecentGames.value = data.recently
  }
  // 获取游戏详情,包含收藏数点赞数的信息
  async function getGameFullInfo() {
    const data = await wsRequest<ResGamesFullInfo>({
      data: {
        key: {
          agent_id: query.agentId || query.venueId,
          game_id: query.gameId,
        },
      },
      msgId: NetMsgType.msgType.msg_req_get_game_full_info,
      callbackId: NetMsgType.msgType.msg_notify_game_full_info,
      needLogin: true,
    })
    newInfo.value = data
  };

  return {
    myCollectedGames,
    myRecentGames,
    gameInfo,
    getMyGames,
    getGameFullInfo,
  }
}

export function useGameAction(myCollectedGames) {
  const draggableElementRef = ref(null)
  const draggablePopRef = ref(null)
  const showMore = ref(false)
  const popOverRight = ref(false)
  const popOverBottom = ref(false)
  const menuTabs = ref([
    { name: '充值', key: 'recharge' },
    { name: '收藏', key: 'collect' },
    { name: '刷新', key: 'reload' },
    { name: '退出', key: 'back' },
  ])
  const isNeedRoteBtn = computed(() => {
    // 只有当设置的是横屏游戏,并且是竖屏状态的时候才需要旋转
    const status = false
    // if (isPortrait.value && [1, 4].includes(direction.value)) {
    //   status = true
    // }
    document.body.className = status ? 'landscape-view' : 'portrait-view'
    return status
  })
  const gameCollected = computed(() => {
    let collected = false
    const collect = myCollectedGames.value.find(item => `${item.agent_id}-${item.game_id}` === `${gameInfo.value.agentId}-${gameInfo.value.gameId}`)
    if (collect) {
      collected = true
    }
    return collected
  })
  function actionBtnHandle(item: any) {
    console.log('item', item)
  }
  function toggleDrag() {
    showMore.value = !showMore.value
    if (showMore.value) {
      nextTick(() => {
        const currentPos = draggableElementRef.value?.getCurrentPos()
        const popDom = draggablePopRef.value
        popOverRight.value = window.innerWidth - currentPos.x < popDom.clientWidth
        popOverBottom.value = window.innerHeight - currentPos.y < popDom.clientHeight
      })
    }
  }
  return {
    menuTabs,
    isNeedRoteBtn,
    gameCollected,
    showMore,
    popOverRight,
    popOverBottom,
    draggableElementRef,
    draggablePopRef,
    actionBtnHandle,
    toggleDrag,

  }
}
