<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { useGameStore } from '@/stores/modules/game'
import type { ResMyGames } from '@/types/net-packet'

defineOptions({
  name: 'GameCategory',
})
const router = useRouter()
const gameStore = useGameStore()
const pageTitle = useTitle()

pageTitle.value = `游戏分类`

// 最近访问
const myRecentGames = ref<ResMyGames['recently']>([])
const myCollectedGames = ref<ResMyGames['collected']>([])
async function getMyGames() {
  const data = await wsRequest<ResMyGames>({
    msgId: NetMsgType.msgType.msg_req_my_games,
    callbackId: NetMsgType.msgType.msg_notify_req_my_games,
    needLogin: true,
  })
  myRecentGames.value = data.recently
  myCollectedGames.value = data.collected
}

const allGames = computed(() => {
  // 全部游戏
  return gameStore.homeGameData
    .filter(plat => plat.id > 0 && plat.three_platform)
    .flatMap(plat =>
      plat.three_platform.flatMap((e) => {
        if (e.three_game_kind) {
          // 先把 e（但 three_game_kind 置空）加入
          const result = [{ ...e, three_game_kind: [] }]
          // 再把所有 kind 下的 game 扁平加入
          e.three_game_kind.forEach((kind) => {
            if (kind.three_game) {
              result.push(...kind.three_game as any[])
            }
          })
          return result
        }
        else {
          return [e]
        }
      }),
    )
})

onMounted(() => {
  getMyGames()
})

const collectedGames = computed(() => {
  return allGames.value.filter(game => myCollectedGames.value.some(g => `${g.agent_id}-${g.game_id}` === `${game.agentId}-${game.gameId}`))
})

function handleEnterGame(game) {
  console.log('game: ', game)
  router.push(`/game/${game.gameId}?agentId=${game.agentId}&venueId=${game.venueId}`)
}
</script>

<template>
  <PageContainer :nav-bar-props="{ title: pageTitle }">
    <div class="p-10 py-16 flex flex-col justify-center">
      <div>
        <van-cell-group>
          <van-cell v-for="game in collectedGames" :key="game.gameId" :title="game.name['zh-CN'] || game.name['en-US']" :label="game.gameId">
            <template #right-icon>
              <van-button type="primary" size="small" @click="handleEnterGame(game)">
                游戏详情
              </van-button>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
  </PageContainer>
</template>

<route lang="json5">
  {
    name: 'GameCategory',
    meta: {
      title: '游戏分类',
      auth: true,
    },
  }
  </route>
