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
    class="px-10 pb-7 pt-[calc(var(--sat)+7px)] bg-#242425 flex w-full items-center left-0 right-0 top-0 justify-between fixed z-50 md:px-32 md:py-12"
  >
    <div class="flex gap-6 items-center">
      <img src="@/assets/images/home/mobile-logo.png" alt="logo" class="h-30 md:h-35.5">
    </div>
    <div class="flex items-center md:gap-26">
      <div class="i-custom:search wh-30 hidden md:block md:cursor-pointer" />
      <div class="text-size-14 flex gap-8 items-center md:text-size-16 md:gap-15">
        <div class="rounded-64 flex-center h-30 w-68 primary-shadow md:h-40 md:w-88 md:cursor-pointer" @click="router.push('/login')">
          Log In
        </div>
        <div class="rounded-64 flex-center h-30 w-68 secondary-shadow md:h-40 md:w-88 md:cursor-pointer" @click="router.push('/login')">
          Sign Up
        </div>
      </div>
    </div>
  </header>
</template>
