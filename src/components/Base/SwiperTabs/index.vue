<script setup>
import { SwiperSlide } from 'swiper/vue'
import BaseSwiper from './BaseSwiper.vue'

defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
})

const activeTab = ref(0)
const baseSwiperRef = ref(null)

function onCategoryChange(index) {
  baseSwiperRef.value?.slideToIndex(index)
}

function onSwiperChange(swiper) {
  activeTab.value = swiper.activeIndex
  const el = document.querySelector('.app-container')
  el.scrollTo(0, 1)
}
</script>

<template>
  <div class="swiper-tabs">
    <div class="pb-8 bg-white top-0 sticky z-10 md:p-16 md:top-60">
      <van-tabs v-model:active="activeTab" :sticky="true" @change="onCategoryChange">
        <van-tab v-for="item in tabs" :key="item.id" :title="item.name" />
      </van-tabs>
    </div>
    <BaseSwiper
      ref="baseSwiperRef"
      :slides-per-view="1"
      :centered-slides="true"
      :space-between="0"
      :options="{
        noSwiping: true,
        noSwipingClass: 'swiper-no-swiping',
        noSwipingSelector: '.scroll-content',
      }"
      @slide-change="onSwiperChange"
    >
      <SwiperSlide
        v-for="(item, index) in tabs"
        :key="item.id"
      >
        <slot name="tab" :tab="item" :index="index" />
      </SwiperSlide>
      <div class="bar-disabled-left" />
    </BaseSwiper>
  </div>
</template>

<style lang="scss" scoped>
.bar-disabled-left {
  position: absolute;
  left: 0;
  top: 0;
  width: 15px;
  height: 100%;
  z-index: 999;
  touch-action: pan-x;
}
</style>
