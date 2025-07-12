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
const TabBarList = [
  {
    name: '选单',
    icon: 'i-carbon:home',
    to: '/home',
  },
  {
    name: '探索',
    icon: 'i-carbon:search',
    to: '/demo1',
  },
  {
    name: '赌场',
    icon: 'i-carbon:chart-line',
    to: '/demo1',
  },
  {
    name: '聊天',
    icon: 'i-carbon:user',
    to: '/profile',
  },
]
</script>

<template>
  <van-tabbar v-if="show" v-model="active" class="md:hidden" route placeholder active-color="#24ee89" @change="handleTabClick">
    <van-tabbar-item v-for="item in TabBarList" :key="item.name" :replace="true" :to="item.to">
      {{ item.name }}
      <template #icon>
        <div :class="item.icon" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
