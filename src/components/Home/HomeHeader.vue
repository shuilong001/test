<script setup lang="ts">
// import { useAppStore } from '@/stores/modules/app'
// import { useUserStore } from '@/stores/modules/user'
// import { routeWhiteList } from '@/config/routes'

// const appStore = useAppStore()
// const showSearch = ref(false)
// const route = useRoute()
// const userStore = useUserStore()
const router = useRouter()
// const isLogin = computed(() => userStore.isLogin)
// const checked = computed({
//   get: () => isDark.value,
//   set: () => toggleDark(),
// })

// const show = computed(() => {
//   return route.name && routeWhiteList.includes(route.name)
// })

// function logout() {
//   userStore.logout()
//   showToast('已退出登录')
// }
</script>

<template>
  <header
    class="px-16 pb-12 pt-[calc(var(--sat)+12px)] border-b border-gray-200 bg-white flex w-full items-center left-0 right-0 top-0 justify-between fixed z-50 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="flex gap-6 items-center">
      <img src="@/assets/images/home/mobile-logo.png" alt="logo" class="h-35">
    </div>
    <div class="flex gap-15 items-center">
      <div class="text-size-16 text-#fff rounded-10 flex h-32 w-80 items-center justify-center from-[#2E323D] to-[#24272E] bg-linear-to-r" @click="router.push('/login')">
        Log In
      </div>
      <div class="text-size-16 text-#000 rounded-10 bg-#FFFFFF flex h-32 w-80 items-center justify-center" @click="router.push('/login')">
        Sign Up
      </div>
    </div>
  </header>
</template>
