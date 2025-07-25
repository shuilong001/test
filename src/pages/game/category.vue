<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { useGameStore } from '@/stores/modules/game'
import { useGame } from '../game/hooks/useGame'

defineOptions({
  name: 'GameCategory',
})
const router = useRouter()
const gameStore = useGameStore()
const pageTitle = useTitle()

pageTitle.value = `游戏分类`

const { getMyGames, myCollectedGames } = useGame({
  agentId: '',
  gameId: '',
  venueId: '',
})

onMounted(() => {
  getMyGames()
})

const collectedGames = computed(() => {
  return gameStore.getAllThreeGames.filter(game => myCollectedGames.value.some(g => `${g.agent_id}-${g.game_id}` === `${game.agentId}-${game.gameId}`))
})

function handleEnterGame(game) {
  console.log('game: ', game)
  router.push(`/game/${game.gameId}?agentId=${game.agentId}&venueId=${game.venueId}`)
}
</script>

<template>
  <PageContainer :nav-bar-props="{ title: pageTitle }">
    <div class="p-10 py-16 flex flex-col justify-center">
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
