<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { useGameStore } from '@/stores/modules/game'
import { showToast } from 'vant'

defineOptions({
  name: 'GameDetail',
})
const router = useRouter()
const route = useRoute('GameDetail')
const gameStore = useGameStore()
const gameId = route.params.gameId
const query = route.query
const pageTitle = useTitle()

pageTitle.value = `游戏详情${gameId}`

const newInfo = ref<any>(null)

const gameInfo = computed(() => {
  const info = gameStore.getAllThreeGames.find(item => `${item.agentId}-${item.gameId}` === `${query.agentId}-${gameId}`)
  return {
    ...info,
    ...newInfo.value,
  }
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
async function getNewGameUrl() {
  const res = await wsRequest({
    data: {
      agentId: query.agentId,
      gameId,
      kindId: gameInfo.value.venueId,
      lang: 1,
      device_type: 2,
    },
    msgId: NetMsgType.msgType.msg_req_3rd_game_login,
    callbackId: NetMsgType.msgType.msg_notify_3rd_game_login_result,
    needLogin: true,
  })
  console.log('res----: ', res)
  if (res.code === 0) {
    router.push(`/game/play/${gameId}?agentId=${query.agentId}&venueId=${gameInfo.value.venueId}`)
    gameStore.setGameUrl(res.url)
  }
  else if (res.code === -1) {
    showToast(res.msg)
  }
}

onMounted(() => {
  getGameFullInfo()
})
</script>

<template>
  <PageContainer :nav-bar-props="{ title: pageTitle }">
    <div class="p-10 flex flex-col gap-10 items-center justify-center">
      <h1>Game {{ gameInfo.name['zh-CN'] || gameInfo.name['en-US'] }}</h1>
      <DefaultBtn text="进入游戏" type="primary" @click="getNewGameUrl" />
      <div class="flex flex-col gap-10">
        <div v-for="(value, key) of gameInfo" :key="key" class="flex gap-10 items-baseline">
          <div class="w-60">
            {{ key }}：
          </div>
          <div class="flex-1 break-all">
            {{ value }}
          </div>
        </div>
      </div>
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
