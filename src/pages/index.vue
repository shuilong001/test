<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee'

defineOptions({
  name: 'Home',
})

const { isDesktop } = useResize()
// const router = useRouter()

onActivated(() => {
  console.log('onActivated')
})
</script>

<template>
  <PageContainer>
    <div class="pb-100 flex flex-col md:px-16 md:pt-38">
      <div class="h-408 w-full overflow-hidden">
        <div v-if="isDesktop">
          <img src="@/assets/images/home/pc-banner.png" alt="" class="h-full w-full md:cursor-pointer">
        </div>
        <van-swipe v-else :autoplay="3000" lazy-render>
          <van-swipe-item>
            <img src="@/assets/images/home/mobile-header-bg.png" alt="" class="h-full w-full">
            <div class="flex flex-col items-center bottom-94 right-28 absolute">
              <div class="mb-16 flex flex-col items-end">
                <img src="@/assets/images/home/mobile-big-logo.png" alt="" class="mb-5 h-145 w-135">
                <img src="@/assets/images/home/text.png" alt="" class="w-176">
              </div>
              <div class="primary-btn text-size-15 font-extrabold rounded-22 flex-center h-36 w-120">
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
            <div class="flex gap-10 items-center bottom-29 left-1/2 justify-center absolute -translate-x-1/2">
              <div v-for="item in total" :key="item" class="rounded-full bg-#959593 flex h-8 w-8 items-center" :class="{ '!w-40 bg-#FFFFFD': active === item - 1 }" />
            </div>
          </template>
        </van-swipe>
      </div>
      <div class="mt-16 px-10 flex flex-col gap-12">
        <div class="flex-x-slide gap-11">
          <div class="flex-x-slide-item h-124 w-111">
            <img src="@/assets/images/demo/Frame 2087327677.png" alt="" class="h-full w-full">
          </div>
          <div class="flex-x-slide-item h-124 w-111">
            <img src="@/assets/images/demo/Frame 2087327535.png" alt="" class="h-full w-full">
          </div>
          <div class="flex-x-slide-item h-124 w-111">
            <img src="@/assets/images/demo/Frame 2087327536.png" alt="" class="h-full w-full">
          </div>
          <div class="flex-x-slide-item h-124 w-111">
            <img src="@/assets/images/demo/Frame 2087327677.png" alt="" class="h-full w-full">
          </div>
          <div class="flex-x-slide-item h-124 w-111">
            <img src="@/assets/images/demo/Frame 2087327536.png" alt="" class="h-full w-full">
          </div>
          <div class="flex-x-slide-item h-124 w-111">
            <img src="@/assets/images/demo/Frame 2087327535.png" alt="" class="h-full w-full">
          </div>
        </div>
        <div class="flex flex-col gap-7">
          <div class="text-size-14 lh-19">
            Recent Wins
          </div>
          <Vue3Marquee :duration="10">
            <div class="flex flex-col gap-5">
              <img src="@/assets/images/demo/Hot Chilli.png" class="h-91 w-68">
              <div class="flex items-center">
                <div>@User2314</div>
              </div>
              <div class="flex items-center">
                <div>10,45,569</div>
              </div>
            </div>
            <div class="flex flex-col gap-5">
              <img src="@/assets/images/demo/Hot Chilli (1).png" class="h-91 w-68">
              <div class="flex items-center">
                <div>@User2314</div>
              </div>
              <div class="flex items-center">
                <div>10,45,569</div>
              </div>
            </div>
            <div class="flex flex-col gap-5">
              <img src="@/assets/images/demo/Hot Chilli (2).png" class="h-91 w-68">
              <div class="flex items-center">
                <div>@User2314</div>
              </div>
              <div class="flex items-center">
                <div>10,45,569</div>
              </div>
            </div>
            <div class="flex flex-col gap-5">
              <img src="@/assets/images/demo/Hot Chilli (3).png" class="h-91 w-68">
              <div class="flex items-center">
                <div>@User2314</div>
              </div>
              <div class="flex items-center">
                <div>10,45,569</div>
              </div>
            </div>
            <div class="flex flex-col gap-5">
              <img src="@/assets/images/demo/Hot Chilli (2).png" class="h-91 w-68">
              <div class="flex items-center">
                <div>@User2314</div>
              </div>
              <div class="flex items-center">
                <div>10,45,569</div>
              </div>
            </div>
          </Vue3Marquee>
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
