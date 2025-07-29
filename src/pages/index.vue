<script setup lang="ts">
defineOptions({
  name: 'Home',
})

const { isDesktop } = useResize()

onActivated(() => {
  console.log('onActivated')
})
</script>

<template>
  <PageContainer :has-header="false">
    <div class="px-11 pt-24 flex w-full items-center top-0 justify-between absolute z-1 md:hidden">
      <img src="@/assets/images/home/mobile-logo.png" alt="logo" class="h-35">
      <div class="flex gap-15 items-center">
        <div class="text-size-16 text-#fff rounded-10 flex h-32 w-80 items-center justify-center from-[#2E323D] to-[#24272E] bg-linear-to-r">
          Log In
        </div>
        <div class="text-size-16 text-#000 rounded-10 bg-#FFFFFF flex h-32 w-80 items-center justify-center">
          Sign Up
        </div>
      </div>
    </div>
    <div class="flex flex-col md:px-52 md:pt-38">
      <div class="h-478 w-full overflow-hidden">
        <div v-if="isDesktop">
          <img src="@/assets/images/home/pc-banner.png" alt="" class="h-full w-full md:cursor-pointer">
        </div>
        <van-swipe v-else :autoplay="3000" lazy-render>
          <van-swipe-item>
            <img src="@/assets/images/home/mobile-header-bg.png" alt="" class="h-full w-full">
            <div class="flex flex-col gap-10 items-end right-57 top-157 absolute">
              <img src="@/assets/images/home/mobile-big-logo.png" alt="" class="h-171 w-159">
              <img src="@/assets/images/home/text.png" alt="" class="h-24 w-211">
              <div class="text-size-18 text-white font-extrabold rounded-full flex-center h-43 w-135 from-[#0B59DF] to-[#0241C3] bg-linear-to-r">
                Go to
              </div>
            </div>
          </van-swipe-item>
          <van-swipe-item>
            <img src="@/assets/images/home/mobile-header-bg.png" alt="" class="h-full w-full">
          </van-swipe-item>
          <van-swipe-item>
            <img src="@/assets/images/home/mobile-header-bg.png" alt="" class="h-full w-full">
          </van-swipe-item>
          <template #indicator="{ active, total }">
            <div class="flex gap-10 items-center bottom-30 left-1/2 justify-center absolute -translate-x-1/2">
              <div v-for="item in total" :key="item" class="rounded-full bg-#959593 flex h-10 w-10 items-center" :class="{ 'w-41 bg-#FFFFFD': active === item - 1 }" />
            </div>
          </template>
        </van-swipe>
      </div>
      <div class="mt-20 px-11 flex flex-col gap-10">
        <div v-for="item in 30" :key="item">
          滚动测试----滚动测试---滚动测试---滚动测试---滚动测试{{ item }}
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<route lang="json5">
{
  name: 'Home',
  meta: {
    title: '首页',
    i18n: 'menus.home',
    keepAlive: true,
  },
}
</route>

<style scoped lang="scss"></style>
