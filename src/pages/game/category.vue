<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'

defineOptions({
  name: 'GameCategory',
})

const pageTitle = useTitle()

pageTitle.value = `游戏分类`
async function getMyGames() {
  console.log(2222222)
  const data = await wsRequest({
    msgId: NetMsgType.msgType.msg_req_my_games,
    callbackId: NetMsgType.msgType.msg_notify_req_my_games,
    needLogin: true,
  })
  console.log('getMyGames------', data)
  // msg_notify_req_my_games
};

onMounted(() => {
  getMyGames()
})
</script>

<template>
  <PageContainer :nav-bar-props="{ title: pageTitle }">
    <div class="flex flex-col gap-10 items-center justify-center">
      <h1>Game Category</h1>
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
