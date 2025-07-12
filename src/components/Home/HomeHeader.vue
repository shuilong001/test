<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { useUserStore } from '@/stores/modules/user'
import { routeWhiteList } from '@/config/routes'

const appStore = useAppStore()
const showSearch = ref(false)
const route = useRoute()
const userStore = useUserStore()
const router = useRouter()
const isLogin = computed(() => userStore.isLogin)

const show = computed(() => {
  return route.name && routeWhiteList.includes(route.name)
})
function toggleSidebar() {
  appStore.sidebarCollapsed = !appStore.sidebarCollapsed
  appStore.mobileMenuOpen = !appStore.mobileMenuOpen
}

function logout() {
  userStore.logout()
  showToast('已退出登录')
}
</script>

<template>
  <header
    class="px-16 border-b border-gray-200 bg-white h-60 w-full hidden transition-colors duration-300 items-center left-0 right-0 top-0 justify-between fixed z-50 dark:border-gray-700 dark:bg-gray-800 md:!flex"
    :class="[show ? '!flex' : 'hidden']"
  >
    <div class="flex gap-6 items-center">
      <!-- PC端汉堡菜单按钮 -->
      <div class="flex flex-col gap-4 w-16 cursor-pointer justify-center" @click="toggleSidebar">
        <div class="rounded bg-gray-600 h-2 w-full transition-all dark:bg-gray-300" />
        <div class="rounded bg-gray-600 h-2 w-full transition-all dark:bg-gray-300" />
        <div class="rounded bg-gray-600 h-2 w-full transition-all dark:bg-gray-300" />
      </div>

      <div class="flex gap-3 items-center">
        <span class="text-size-24 text-gray-900 tracking-wider font-bold md:text-size-20 dark:text-white">PK.GAME</span>
      </div>
    </div>

    <div class="flex gap-8 items-center">
      <!-- 搜索 -->
      <div class="text-gray-500 rounded-lg flex-center h-24 w-24 hidden cursor-pointer transition-colors dark:text-gray-400 md:flex dark:hover:text-white dark:hover:bg-gray-700" @click="showSearch = true">
        <van-icon name="search" />
      </div>
      <div v-if="isLogin" class="flex gap-8 items-center">
        <div class="text-size-14">
          {{ userStore.userInfo.full_name }}
        </div>
        <DefaultBtn text="退出" @click="logout" />
      </div>
      <div v-else class="flex gap-8 items-center">
        <DefaultBtn text="登录" @click="router.push('/login')" />
        <DefaultBtn text="注册" type="primary" @click="router.push('/login')" />
      </div>

      <!-- 多语言 -->
      <!-- <div
          class="text-size-12 text-gray-600 font-medium px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition-all md:text-size-14 dark:text-gray-300 hover:text-gray-800 md:px-3 md:py-1.5 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:text-white dark:hover:border-gray-500 dark:hover:bg-gray-700"
          @click="showLanguagePicker = true"
        >
          {{ currentLanguage }}
        </div> -->

      <!-- 深浅模式切换 -->
      <!-- <div class="flex items-center">
        <van-switch
          v-model="checked"
          size="22px"
          active-color="#22c55e"
          inactive-color="#d1d5db"
          class="md:scale-90"
        />
      </div> -->
    </div>
  </header>
  <div class="h-60 hidden md:flex" :class="[show ? '!flex' : 'hidden']" />
</template>
