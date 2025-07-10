<script setup lang="ts">
import { routeWhiteList } from '@/config/routes'

const active = ref(0)
const route = useRoute()

const show = computed(() => {
  console.log('route.name: ', route.name)
  return route.name && routeWhiteList.includes(route.name)
})
</script>

<template>
  <van-tabbar v-if="show" v-model="active" class="md:hidden" route placeholder active-color="#24ee89">
    <van-tabbar-item replace to="/">
      选单
      <template #icon>
        <div class="i-carbon:home" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/demo1">
      探索
      <template #icon>
        <div class="i-carbon:search" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/charts">
      赌场
      <template #icon>
        <div class="i-carbon:chart-line" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/menu-demo">
      体育
      <template #icon>
        <div class="i-carbon:menu" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/profile">
      聊天
      <template #icon>
        <div class="i-carbon:user" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
