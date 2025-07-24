<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTitle } from '@vueuse/core'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { useGameStore } from '@/stores/modules/game'

defineOptions({
  name: 'GamePlay',
})

defineProps({
  showDrag: {
    type: Boolean,
    default: true,
  },
})

const route = useRoute('GamePlay')
const query = route.query
const gameId = route.params.gameId
const gameStore = useGameStore()
const { gameUrl } = storeToRefs(gameStore)
const pageTitle = useTitle()

pageTitle.value = `游戏大厅`

// const gameInfo = computed(() => {
//   return gameStore.getAllThreeGames.find(item => `${item.agentId}-${item.gameId}` === `${query.agentId}-${gameId}`)
// })
const iframeRef = ref<HTMLIFrameElement>()
// function sendToIframe(data: any) {
//   if (!iframeRef.value)
//     return
//   const message = data
//   iframeRef.value?.contentWindow?.postMessage(message, '*')
// }

const draggableElementRef = ref(null)
const draggablePopRef = ref(null)
const showMore = ref(false)
const popOverRight = ref(false)
const popOverBottom = ref(false)
const myCollectedGames = ref<ResMyGames['collected']>([])
const menuTabs = ref([
  { name: '充值', key: 'recharge' },
  { name: '收藏', key: 'collect' },
  { name: '刷新', key: 'reload' },
  { name: '退出', key: 'back' },
])

const newInfo = ref<any>(null)

const gameInfo = computed<Game>(() => {
  const info = gameStore.getAllThreeGames.find(item => `${item.agentId}-${item.gameId}` === `${query.agentId}-${gameId}`)
  return {
    ...info,
    ...newInfo.value,
  }
})

const isNeedRoteBtn = computed(() => {
  // 只有当设置的是横屏游戏,并且是竖屏状态的时候才需要旋转
  const status = false
  // if (isPortrait.value && [1, 4].includes(direction.value)) {
  //   status = true
  // }
  document.body.className = status ? 'landscape-view' : 'portrait-view'
  return status
})
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
async function getMyGames() {
  const data = await wsRequest<ResMyGames>({
    msgId: NetMsgType.msgType.msg_req_my_games,
    callbackId: NetMsgType.msgType.msg_notify_req_my_games,
    needLogin: true,
  })
  myCollectedGames.value = data.collected
}
const gameCollected = computed(() => {
  let collected = false
  const collect = myCollectedGames.value.find(item => `${item.agent_id}-${item.game_id}` === `${gameInfo.value.agentId}-${gameInfo.value.gameId}`)
  if (collect) {
    collected = true
  }
  return collected
})

async function getGameFullInfo() {
  const data = await wsRequest({
    data: {
      key: {
        agent_id: query.agentId || query.venueId,
        game_id: gameId,
      },
    },
    msgId: NetMsgType.msgType.msg_req_get_game_full_info,
    callbackId: NetMsgType.msgType.msg_notify_game_full_info,
    needLogin: true,
  })
  newInfo.value = data
};

function actionBtnHandle(item: any) {
  console.log('item', item)
}

onMounted(() => {
  getMyGames()
  getGameFullInfo()
})
</script>

<template>
  <div class="min-h-screen">
    <DraggableElement
      v-if="showDrag" ref="draggableElementRef" :top-limit="0"
      :right-limit="0" :bottom-limit="0" :left-limit="0" :snap-threshold="0"
      :initial-position="{ x: 10, y: 10 }"
    >
      <div class="drag-btn" :class="[{ isNeedRoteBtn }, { active: showMore }]" @click.stop="toggleDrag">
        <div ref="draggablePopRef" class="pop-wrap" :class="[{ 'pop-over-right': popOverRight }, { 'pop-over-bottom': popOverBottom }, { 'pop-over-bottom-right': popOverBottom && popOverRight }]">
          <div v-for="item in menuTabs" :key="item.key" class="pop-action-item" @click="actionBtnHandle(item)">
            <div class="action-btn" :class="[item.key, { gameCollected }]" />
            <div class="title">
              {{ $t(item.name) }}
            </div>
          </div>
        </div>
      </div>
    </DraggableElement>

    <iframe
      id="iframeId"
      ref="iframeRef"
      :key="gameUrl"
      :src="gameUrl"
      class="h-full w-full"
      frameborder="0"
      scrolling="auto"
      allow="cookies; screen-wake-lock; fullscreen"
      sandbox="allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-forms"
    />
  </div>
</template>

<route lang="json5">
  {
    name: 'GamePlay',
    meta: {
      title: '游戏大厅',
      auth: true,
    },
  }
  </route>

<style lang="scss" scoped>
.drag-btn {
  --vw-unit: 1vw;
}

/* 竖屏时修改变量值 */
@media screen and (orientation: portrait) {
  .drag-btn {
    --vw-unit: 1vw;
  }
}

/* 横屏时修改变量值 */
@media screen and (orientation: landscape) {
  .drag-btn {
    --vw-unit: 1vh;
  }
}
.drag-btn {
  width: calc(10.6666666667 * var(--vw-unit));
  height: calc(10.6666666667 * var(--vw-unit));
  border-radius: 50%;
  background: url(@/assets/images/game-play/btn_close.png) center no-repeat;
  background-size: 100% 100%;
  position: relative;
  &.active {
    background: url(@/assets/images/game-play/btn_open.png) center no-repeat;
    background-size: 100% 100%;
    .pop-wrap {
      display: flex;
      &.pop-over-right {
        transform: translateX(-68%);
        background: url(@/assets/images/game-play/bg_right.png) center no-repeat;
        background-size: 100% 100%;
      }
      &.pop-over-bottom {
        transform: translateY(-125%);
        background: url(@/assets/images/game-play/bg_bottom.png) center no-repeat;
        background-size: 100% 100%;
      }
      &.pop-over-bottom-right {
        transform: translateY(-126%) translateX(-68%);
        background: url(@/assets/images/game-play/bg_bottom_right.png) center no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  &.isNeedRoteBtn {
    transform: rotate(90deg);
  }
  .pop-wrap {
    width: calc(32.2666666667 * var(--vw-unit));
    height: calc(43.2 * var(--vw-unit));
    background: url(@/assets/images/game-play/bg.png) center no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: calc(10.6666666667 * var(--vw-unit));
    left: 1px;
    display: none;
    padding: calc(6.1333333333 * var(--vw-unit)) calc(2.6666666667 * var(--vw-unit)) calc(2.6666666667 * var(--vw-unit));
    flex-wrap: wrap;
    gap: calc(1.3333333333 * var(--vw-unit));
    color: var(--btn-txt-color-3);
    font-size: calc(3.2 * var(--vw-unit));
    text-align: center;
    .pop-action-item {
      width: calc(12.8 * var(--vw-unit));
      //border: 1px solid #f00;
      .action-btn {
        width: 35px;
        height: 35px;
        margin: 0 auto 4px;
        width: calc(9.3333333333 * var(--vw-unit));
        height: calc(9.3333333333 * var(--vw-unit));
        margin: 0 auto calc(1.0666666667 * var(--vw-unit));
        display: block;
        &.recharge {
          background: url(@/assets/images/game-play/icon_recharge.png) center no-repeat;
          background-size: 100% 100%;
        }
        &.reload {
          background: url(@/assets/images/game-play/icon_reload.png) center no-repeat;
          background-size: 100% 100%;
        }
        &.collect {
          background: url(@/assets/images/game-play/icon_collect.png) center no-repeat;
          background-size: 100% 100%;
          &.gameCollected {
            background: url(@/assets/images/game-play/icon_collected.png) center no-repeat;
            background-size: 100% 100%;
          }
        }
        &.back {
          background: url(@/assets/images/game-play/icon_back.png) center no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
}
.dark {
  .drag-btn {
    // background: red;
  }
}
</style>
