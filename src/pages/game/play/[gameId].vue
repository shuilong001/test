<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTitle } from '@vueuse/core'
// import { NetMsgType } from '@/web-base/netBase/NetMsgType'
import { useGameStore } from '@/stores/modules/game'

defineOptions({
  name: 'GamePlay',
})
// const route = useRoute('GamePlay')
// const gameId = route.params.gameId
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
</script>

<template>
  <div class="min-h-screen">
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
