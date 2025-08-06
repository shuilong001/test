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
    <div class="pb-70 flex flex-col 2xl:px-0 md:px-32 md:pt-32">
      <div class="h-408 w-full overflow-hidden">
        <img v-if="isDesktop" src="@/assets/images/home/pc-banner.png" alt="" class="rounded-24 h-full w-full object-cover md:cursor-pointer">
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
      <div class="mt-16 flex flex-col gap-12 md:mt-20 md:gap-24">
        <div class="hide-scrollbar px-10 flex-x-slide gap-11 md:px-0">
          <div class="flex-x-slide-item h-124 w-111 md:h-124 md:w-363 md:cursor-pointer">
            <img v-if="isDesktop" src="@/assets/images/demo/Frame 2087327736.png" alt="" class="h-full w-full">
            <img v-else src="@/assets/images/demo/Frame 2087327677.png" alt="" class="h-full w-full">
          </div>
          <div class="flex-x-slide-item h-124 w-111 md:h-124 md:w-363 md:cursor-pointer">
            <img v-if="isDesktop" src="@/assets/images/demo/Frame 2087327739.png" alt="" class="h-full w-full">
            <img v-else src="@/assets/images/demo/Frame 2087327535.png" alt="" class="h-full w-full">
          </div>
          <div class="flex-x-slide-item h-124 w-111 md:h-124 md:w-363 md:cursor-pointer">
            <img v-if="isDesktop" src="@/assets/images/demo/Frame 2087327740.png" alt="" class="h-full w-full">
            <img v-else src="@/assets/images/demo/Frame 2087327536.png" alt="" class="h-full w-full">
          </div>
          <div class="flex-x-slide-item h-124 w-111 md:h-124 md:w-363 md:cursor-pointer">
            <img v-if="isDesktop" src="@/assets/images/demo/Frame 2087327736.png" alt="" class="h-full w-full">
            <img v-else src="@/assets/images/demo/Frame 2087327677.png" alt="" class="h-full w-full">
          </div>
          <div class="flex-x-slide-item h-124 w-111 md:h-124 md:w-363 md:cursor-pointer">
            <img v-if="isDesktop" src="@/assets/images/demo/Frame 2087327739.png" alt="" class="h-full w-full">
            <img v-else src="@/assets/images/demo/Frame 2087327535.png" alt="" class="h-full w-full">
          </div>
          <div class="flex-x-slide-item h-124 w-111 md:h-124 md:w-363 md:cursor-pointer">
            <img v-if="isDesktop" src="@/assets/images/demo/Frame 2087327740.png" alt="" class="h-full w-full">
            <img v-else src="@/assets/images/demo/Frame 2087327536.png" alt="" class="h-full w-full">
          </div>
        </div>
        <div class="flex flex-col gap-8 md:gap-12">
          <div class="px-10 flex items-center justify-between md:px-0">
            <div class="text-size-14 lh-19 md:text-size-32 md:lh-40">
              Recent Wins
            </div>
            <div class="text-size-11 px-8 py-4 rounded-20 flex-center gap-2 bg-radial-gray md:text-size-16 md:text-size-16 md:lh-16 md:px-12 md:py-8 md:cursor-pointer">
              30
              <div class="i-custom:arrow-right h-8.52 w-8.52 md:h-16 md:w-16" />
            </div>
          </div>
          <Vue3Marquee :duration="20" pause-on-hover class="hide-scrollbar">
            <div class="mr-10 flex flex-col gap-5 cursor-pointer md:mr-16">
              <img src="@/assets/images/demo/Hot Chilli.png" class="h-91 w-68 md:h-166 md:w-125">
              <div class="flex flex-col gap-3 items-center">
                <div class="flex gap-4 items-center">
                  <div class="i-custom:account-circle h-13 w-13 md:h-24 md:w-24" />
                  <div class="text-size-10 lh-14 md:text-size-16 md:lh-20">
                    @User2314
                  </div>
                </div>
                <div class="flex gap-4 items-center">
                  <div class="rounded-full bg-#074BD4 flex-center wh-10 md:wh-14">
                    <div class="i-custom:score h-6.3 w-7 md:h-7.4 md:w-8" />
                  </div>
                  <div class="text-size-8 lh-11 md:text-size-14 md:lh-17">
                    10,45,569
                  </div>
                </div>
              </div>
            </div>
            <div class="mr-10 flex flex-col gap-5 cursor-pointer md:mr-16">
              <img src="@/assets/images/demo/Hot Chilli (1).png" class="h-91 w-68 md:h-166 md:w-125">
              <div class="flex flex-col gap-3 items-center">
                <div class="flex gap-4 items-center">
                  <div class="i-custom:account-circle h-13 w-13 md:h-24 md:w-24" />
                  <div class="text-size-10 lh-14 md:text-size-16 md:lh-20">
                    @User2314
                  </div>
                </div>
                <div class="flex gap-4 items-center">
                  <div class="rounded-full bg-#074BD4 flex-center wh-10 md:wh-14">
                    <div class="i-custom:score h-6.3 w-7 md:h-7.4 md:w-8" />
                  </div>
                  <div class="text-size-8 lh-11 md:text-size-14 md:lh-17">
                    10,45,569
                  </div>
                </div>
              </div>
            </div>
            <div v-for="item in 10" :key="item" class="mr-10 flex flex-col gap-5 cursor-pointer md:mr-16">
              <img src="@/assets/images/demo/Hot Chilli (2).png" class="h-91 w-68 md:h-166 md:w-125">
              <div class="flex flex-col gap-3 items-center">
                <div class="flex gap-4 items-center">
                  <div class="i-custom:account-circle h-13 w-13 md:h-24 md:w-24" />
                  <div class="text-size-10 lh-14 md:text-size-16 md:lh-20">
                    @User2314
                  </div>
                </div>
                <div class="flex gap-4 items-center">
                  <div class="rounded-full bg-#074BD4 flex-center wh-10 md:wh-14">
                    <div class="i-custom:score h-6.3 w-7 md:h-7.4 md:w-8" />
                  </div>
                  <div class="text-size-8 lh-11 md:text-size-14 md:lh-17">
                    10,45,569
                  </div>
                </div>
              </div>
            </div>
            <div class="mr-10 flex flex-col gap-5 cursor-pointer md:mr-16">
              <img src="@/assets/images/demo/Hot Chilli (3).png" class="h-91 w-68 md:h-166 md:w-125">
              <div class="flex flex-col gap-3 items-center">
                <div class="flex gap-4 items-center">
                  <div class="i-custom:account-circle h-13 w-13 md:h-24 md:w-24" />
                  <div class="text-size-10 lh-14 md:text-size-16 md:lh-20">
                    @User2314
                  </div>
                </div>
                <div class="flex gap-4 items-center">
                  <div class="rounded-full bg-#074BD4 flex-center wh-10 md:wh-14">
                    <div class="i-custom:score h-6.3 w-7 md:h-7.4 md:w-8" />
                  </div>
                  <div class="text-size-8 lh-11 md:text-size-14 md:lh-17">
                    10,45,569
                  </div>
                </div>
              </div>
            </div>
            <div class="mr-10 flex flex-col gap-5 cursor-pointer md:mr-16">
              <img src="@/assets/images/demo/Hot Chilli (2).png" class="h-91 w-68 md:h-166 md:w-125">
              <div class="flex flex-col gap-3 items-center">
                <div class="flex gap-4 items-center">
                  <div class="i-custom:account-circle h-13 w-13 md:h-24 md:w-24" />
                  <div class="text-size-10 lh-14 md:text-size-16 md:lh-20">
                    @User2314
                  </div>
                </div>
                <div class="flex gap-4 items-center">
                  <div class="rounded-full bg-#074BD4 flex-center wh-10 md:wh-14">
                    <div class="i-custom:score h-6.3 w-7 md:h-7.4 md:w-8" />
                  </div>
                  <div class="text-size-8 lh-11 md:text-size-14 md:lh-17">
                    10,45,569
                  </div>
                </div>
              </div>
            </div>
          </Vue3Marquee>
        </div>
        <div class="flex flex-col gap-8 md:gap-12">
          <div class="px-10 flex items-center justify-between md:px-0">
            <div class="text-size-14 lh-19 md:text-size-32 md:lh-40">
              Promotions
            </div>
            <div class="text-size-11 px-8 py-4 rounded-20 flex-center gap-2 bg-radial-gray md:text-size-16 md:text-size-16 md:lh-16 md:px-12 md:py-8 md:cursor-pointer">
              30
              <div class="i-custom:arrow-right h-8.52 w-8.52 md:h-16 md:w-16" />
            </div>
          </div>
          <div class="hide-scrollbar px-10 flex-x-slide gap-12 md:px-0 md:gap-20">
            <div class="flex-x-slide-item h-153 w-110 md:h-293 md:w-211 md:cursor-pointer">
              <img src="@/assets/images/demo/Frame 20873277362.png" alt="" class="h-full w-full">
            </div>
            <div class="flex-x-slide-item h-153 w-110 md:h-293 md:w-211 md:cursor-pointer">
              <img src="@/assets/images/demo/Frame 2087327737.png" alt="" class="h-full w-full">
            </div>
            <div v-for="i in 10" :key="i" class="flex-x-slide-item h-153 w-110 md:h-293 md:w-211 md:cursor-pointer">
              <img src="@/assets/images/demo/Frame 2087327738.png" alt="" class="h-full w-full">
            </div>
          </div>
        </div>
        <div v-for="item in 3" :key="item" class="flex flex-col gap-8 md:gap-12">
          <div class="px-10 flex items-center justify-between md:px-0">
            <div class="text-size-14 lh-19 md:text-size-32 md:lh-40">
              Exclusive games
            </div>
            <div class="text-size-11 px-8 py-4 rounded-20 flex-center gap-2 bg-radial-gray md:text-size-16 md:text-size-16 md:lh-16 md:px-12 md:py-8 md:cursor-pointer">
              30
              <div class="i-custom:arrow-right h-8.52 w-8.52 md:h-16 md:w-16" />
            </div>
          </div>
          <div class="hide-scrollbar px-10 flex-x-slide gap-11 md:px-0 md:gap-16">
            <div class="flex-x-slide-item h-148 w-111 md:h-235 md:w-176 md:cursor-pointer">
              <img src="@/assets/images/demo/Go Rush.png" alt="" class="h-full w-full">
            </div>
            <div v-for="i in 10" :key="i" class="flex-x-slide-item h-148 w-111 md:h-235 md:w-176 md:cursor-pointer">
              <img src="@/assets/images/demo/God Of Martial.png" alt="" class="h-full w-full">
            </div>
            <div class="flex-x-slide-item h-148 w-111 md:h-235 md:w-176 md:cursor-pointer">
              <img src="@/assets/images/demo/Gold Rush.png" alt="" class="h-full w-full">
            </div>
          </div>
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
