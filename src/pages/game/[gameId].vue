<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'

defineOptions({
  name: 'GameDetail',
})

const route = useRoute('GameDetail')
const gameId = route.params.gameId
const pageTitle = useTitle()

pageTitle.value = `游戏详情${gameId}`
async function getGameFullInfo() {
  // const req_NetPacket = NetPacket.req_get_game_full_info();
  // req_NetPacket.key =  await getThreeGameId();
  // PKwebsocket.instance.send(req_NetPacket, true, {
  //   callbackName: 'msg_notify_game_full_info',
  //   callback: handleGameInfo
  // })
  console.log(2222222)
  const data = await wsRequest({
    data: {
      key: {
        agent_id: gameId,
        game_id: gameId,
      },
    },
    msgId: NetMsgType.msgType.msg_req_get_game_full_info,
    callbackId: NetMsgType.msgType.msg_notify_game_full_info,
    needLogin: true,
  })
  console.log('getGameFullInfo------', data)
};
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
      <h1>Game {{ gameId }}</h1>
      <DefaultBtn text="进入游戏" type="primary" @click="handleEnterGame" />
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
