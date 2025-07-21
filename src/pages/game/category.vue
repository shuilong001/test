<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { useGameStore } from '@/stores/modules/game'

defineOptions({
  name: 'GameCategory',
})
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
  console.log('getMyGames------', data)
  myRecentGames.value = data.recently
  myCollectedGames.value = data.collected
};
const gameInfo = computed(() => {
  const [first] = myRecentGames.value
  if (!first) {
    return null
  }
  const data = gameStore.getGame({
    gameId: first.game_id,
    agentId: first.agent_id,
  })
  console.log('gameInfo-------data111: ', data)
  return data
})

onMounted(() => {
  getMyGames()
})
</script>

<template>
  <PageContainer :nav-bar-props="{ title: pageTitle }">
    <div class="flex flex-col gap-10 items-center justify-center">
      <h1>Game Category</h1>
      <div>{{ gameInfo?.game }}</div>
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
