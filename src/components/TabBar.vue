<script setup lang="ts">
import { useRouter } from 'vue-router'

import { routeWhiteList } from '@/config/routes'

const router = useRouter()
const active = ref('MenuPage')
const route = useRoute()

const show = computed(() => {
  return route.name && routeWhiteList.includes(route.name)
})
const tabBarList = [
  {
    name: 'MenuPage',
    icon: 'i-custom:tabbar-menu',
    to: '/menu',
  },
  {
    name: 'Home',
    icon: 'i-custom:tabbar-home',
    to: '/',
  },
  {
    name: 'Profile',
    icon: 'i-custom:tabbar-card',
    to: '/profile',
  },
  {
    name: 'Activity',
    icon: 'i-custom:tabbar-activity',
    to: '/activity',
  },
]

function handleClick(item: any) {
  active.value = item.name
  router.push(item.to)
}
watch(() => route.name, (name) => {
  active.value = name || 'MenuPage'
})
</script>

<template>
  <div v-show="show" class="px-20 pb-8 flex items-center bottom-[var(--sab)] left-0 right-0 justify-center fixed z-999">
    <div class="flex gap-4 wh-full items-center">
      <div class="glass px-6 rounded-full flex flex-1 h-full items-center justify-around">
        <div
          v-for="item in tabBarList"
          :key="item.name"
          :class="[{ active: active === item.name }, { 'text-#0BA1FF rounded-[296px] !pt-3 !pb-4': active === item.name }]"
          class="group px-20 pb-12 pt-10 flex flex-col items-center"
          @click="handleClick(item)"
        >
          <div class="h-38 w-38" :class="[item.icon, { 'text-#0BA1FF h-42 w-42': active === item.name }]" />
          <div class="text-size-11">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 47px;
}
.active {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  // border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
</style>
