<script setup lang="ts">
import { Swiper } from 'swiper/vue'
import type { NavigationOptions, Swiper as SwiperClass } from 'swiper/types'

import type { PropType } from 'vue'

import 'swiper/css/bundle'

defineProps({
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
  },
  spaceBetween: {
    type: [Number, String],
  },
  slidesPerView: {
    type: [String, Number] as PropType<number | 'auto'>,
  },
  centeredSlides: {
    type: Boolean,
    default: false,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  navigation: {
    type: Object as PropType<NavigationOptions | boolean>,
  },
  watchSlidesProgress: {
    type: Boolean,
    default: false,
  },
  allowTouchMove: {
    type: Boolean,
    default: true,
  },
  onSlideChange: {
    type: Function as PropType<(swiper: SwiperClass) => void>,
  },
  onTouchEnd: {
    type: Function as PropType<(swiper: SwiperClass) => void>,
  },
  longSwipesRatio: {
    type: Number,
    default: 0.5,
  },
  initialSlide: {
    type: Number,
    default: 0,
  },

})
const swiperRef = ref<SwiperClass>()

function onSwiper(swiper: SwiperClass) {
  swiperRef.value = swiper
}

defineExpose({
  slideToIndex: (index: number) => {
    if (swiperRef.value)
      swiperRef.value.slideTo(index, 500, false)
  },
})
</script>

<template>
  <Swiper
    v-bind="$attrs"
    :loop="loop"
    :direction="direction"
    :slides-per-view="slidesPerView"
    :space-between="spaceBetween"
    :centered-slides="centeredSlides"
    :resistance="true"
    :allow-touch-move="allowTouchMove"
    :long-swipes-ratio="longSwipesRatio"
    :watch-slides-progress="watchSlidesProgress"
    :initial-slide="initialSlide"
    style="height:100%"
    @slide-change="onSlideChange"
    @touch-end="onTouchEnd"
    @swiper="onSwiper"
  >
    <slot />
  </Swiper>
</template>

<style scoped lang="scss">

</style>
