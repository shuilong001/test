<script setup lang="ts">
import { useRouteCacheStore } from '@/stores'

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

const keepAliveRouteNames = computed(() => {
  return routeCacheStore.routeCaches
})

const mode = computed(() => {
  return isDark.value ? 'dark' : 'light'
})
</script>

<template>
  <van-config-provider :theme="mode" class="h-full">
    <router-view v-slot="{ Component }">
      <keep-alive :include="keepAliveRouteNames">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <TabBar />
  </van-config-provider>
</template>

<style scoped>
.app-wrapper {
  width: 100%;
  position: relative;
  overflow-x: hidden;
}
</style>
