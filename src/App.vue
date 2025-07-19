<script setup lang="ts">
import { useRouteCacheStore } from '@/stores'
import { useOverFlow } from '@/web-base/hooks/useOverFlow'
import { useAppSetting } from '@/web-base/hooks/useAppSetting'
import InstallPrompt from '@/components/PWA/InstallPrompt.vue'
import { useSystemStore } from '@/stores/modules/system'

useHead({
  title: 'PKBET',
  meta: [
    {
      name: 'description',
      content: 'PKBET',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
})

const routeCacheStore = useRouteCacheStore()
const systemStore = useSystemStore()
const { initEventBus, cleanupEventBus } = useAppSetting()
initEventBus()
onMounted(() => {
  if (!systemStore.isWebSocketReady) {
    systemStore.initWebSocket()
  }
})
const keepAliveRouteNames = computed(() => {
  return routeCacheStore.routeCaches
})
const mode = computed(() => {
  return isDark.value ? 'dark' : 'light'
})
useOverFlow()
onBeforeUnmount(() => {
  cleanupEventBus()
})
</script>

<template>
  <van-config-provider :theme="mode" class="app-container flex flex-col wh-full">
    <router-view v-slot="{ Component }">
      <keep-alive :include="keepAliveRouteNames">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <TabBar />
    <InstallPrompt />
  </van-config-provider>
</template>

<style lang="scss" scoped>
.app-container {
  min-height: calc(var(--full-height) - env(safe-area-inset-top));
}
</style>
