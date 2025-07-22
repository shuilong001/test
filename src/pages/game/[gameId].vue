<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { useGameStore } from '@/stores/modules/game'

defineOptions({
  name: 'GameDetail',
})

const route = useRoute('GameDetail')
const gameStore = useGameStore()
const gameId = route.params.gameId
const query = route.query
const pageTitle = useTitle()

pageTitle.value = `游戏详情${gameId}`

const newInfo = ref<any>(null)
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
const gameInfo = computed(() => {
  const { game } = gameStore.gameDatas || {}
  const info = game.find(item => item.gameId === gameId)
  return {
    ...info,
    ...newInfo.value,
  }
})

function handleEnterGame() {
  console.log('进入游戏')
}
onMounted(() => {
  getGameFullInfo()
})
</script>

<template>
  <PageContainer :nav-bar-props="{ title: pageTitle }">
    <div class="flex flex-col gap-10 items-center justify-center">
      <h1>Game {{ gameInfo.name['zh-CN'] || gameInfo.name['en-US'] }}</h1>
      <DefaultBtn text="进入游戏" type="primary" @click="handleEnterGame" />
      <div>{{ gameInfo }}</div>
    </div>
  </PageContainer>
</template>

<route lang="json5">
  {
    name: 'GameDetail',
    meta: {
      title: '游戏详情',
      auth: true,
    },
  }
  </route>
