<script setup lang="ts">
import { useRouteCacheStore } from '@/stores'
import { useOverFlow } from '@/web-base/hooks/useOverFlow'
import { useAppSetting } from '@/web-base/hooks/useAppSetting'
import { useGlobalEvent } from '@/web-base/hooks/useGlobalEvent'
import { useAppData } from '@/web-base/hooks/useAppData'
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
const { cleanupEventBus } = useAppSetting()
const { initEventBus } = useGlobalEvent()
const { isDesktop } = useResize()
const { loadGameData } = useAppData()

onMounted(() => {
  if (!systemStore.isWebSocketReady) {
    systemStore.initWebSocket()
  }
  initEventBus()
  loadGameData()
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
      <Transition name="fadeInUp" mode="out-in">
        <keep-alive :include="keepAliveRouteNames">
          <component :is="Component" />
        </keep-alive>
      </Transition>
    </router-view>
    <TabBar v-if="!isDesktop" />
    <!-- <InstallPrompt /> -->
  </van-config-provider>
</template>

<style lang="scss" scoped>
.app-container {
  min-height: calc(var(--full-height) - env(safe-area-inset-top));
}
.fadeInUp-enter-active,
.fadeInUp-leave-active {
  transition: all 0.2s ease;
}

.fadeInUp-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fadeInUp-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
