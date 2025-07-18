<script setup lang="ts">
import { routeWhiteList } from '@/config/routes'

const active = ref(0)
const route = useRoute()

const show = computed(() => {
  return route.name && routeWhiteList.includes(route.name)
})

const TabBarList = [
  {
    name: '选单',
    icon: 'i-carbon:home',
    to: '/home',
  },
  {
    name: '探索',
    icon: 'i-carbon:search',
    to: '/scroll-cache',
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

// function handleChange() {
//   window.scrollTo(0, 1)
// }
</script>

<template>
  <van-tabbar v-if="show" v-model="active" class="md:hidden" active-color="#24ee89">
    <van-tabbar-item v-for="item in TabBarList" :key="item.name" :replace="true" :to="item.to">
      {{ item.name }}
      <template #icon>
        <div :class="item.icon" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
