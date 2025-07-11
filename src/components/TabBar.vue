<script setup lang="ts">
import { routeWhiteList } from '@/config/routes'

const active = ref(0)
const route = useRoute()

const show = computed(() => {
  return route.name && routeWhiteList.includes(route.name)
})

// TabBar 点击处理函数
function handleTabClick() {
  // 延迟重置滚动位置
  setTimeout(() => {
    window.scrollTo({
      top: 1,
      behavior: 'smooth',
    })
    document.documentElement.scrollTop = 1
    document.body.scrollTop = 1

    const appElement = document.getElementById('app')
    if (appElement) {
      appElement.scrollTop = 1
    }
  }, 100)
}
</script>

<template>
  <van-tabbar v-if="show" v-model="active" class="md:hidden" route placeholder active-color="#24ee89" @change="handleTabClick">
    <van-tabbar-item replace to="/home">
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
    <van-tabbar-item replace to="/demo1">
      赌场
      <template #icon>
        <div class="i-carbon:chart-line" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/demo1">
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
