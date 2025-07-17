<script setup lang="ts">
import { useRouteCacheStore } from '@/stores'
import { useOverFlow } from '@/web-base/hooks/useOverFlow'
import { useAppSetting } from '@/web-base/hooks/useAppSetting'
import InstallPrompt from '@/components/PWA/InstallPrompt.vue'

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
const { initPKwebsocket, initEventBus, cleanupEventBus } = useAppSetting()
initPKwebsocket()
initEventBus()
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
  <van-config-provider :theme="mode" class="app-container wh-full">
    <!-- <div class="wh-full overflow-hidden"> -->
    <router-view v-slot="{ Component }">
      <keep-alive :include="keepAliveRouteNames">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <TabBar />
    <InstallPrompt />
  <!-- </div> -->
  </van-config-provider>
</template>

<style scoped>
.app-wrapper {
  width: 100%;
  position: relative;
  overflow-x: hidden;
}
</style>
