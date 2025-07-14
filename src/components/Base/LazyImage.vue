<script setup lang="ts">
import { usePageStore } from '@/stores/modules/page'
import Loading from '@/assets/images/loading.png'

defineOptions({
  name: 'LazyImage',
})

const props = withDefaults(defineProps<DecryptImgProps>(), {
  width: '100%',
  height: '100%',
  fit: 'cover',
  isTransparentBg: false,
  rounded: 0,
})

export interface DecryptImgProps {
  fit?: import('csstype').Property.ObjectFit | undefined
  width?: string | number
  height?: string | number
  imgUrl: string | undefined
  isTransparentBg?: boolean
  rounded?: number
}

const pageStore = usePageStore()

const animation = ref('bounceFade')
const realUrl = ref('')
const isShow = ref(false)
const isImageLoaded = ref(false)

const roundedStyle = computed(() => {
  return {
    borderRadius: props.rounded ? `${props.rounded}px` : undefined,
  }
})
const containerStyle = computed(() => {
  return {
    width: props.width,
    height: props.height,
    background: props.isTransparentBg && realUrl.value ? 'transparent' : '#BBBBBB',
    ...roundedStyle.value,
  }
})

const imgStyle = computed(() => {
  return {
    'object-fit': props.fit,
    ...roundedStyle.value,
  }
})

const url = computed(() => {
  if (realUrl.value)
    return realUrl.value
  return Loading
})

const showLoading = computed(() => {
  return !isImageLoaded.value || !realUrl.value
})

async function formatUrl() {
  const settings = pageStore.settings || {}
  if (!props.imgUrl || realUrl.value || !settings.media_url)
    return
  const url = settings.media_url + props.imgUrl

  realUrl.value = url
  // 重置图片加载状态
  isImageLoaded.value = false
}

watch([isShow, props.imgUrl], () => {
  if (isShow.value && props.imgUrl) {
    formatUrl()
  }
}, {
  immediate: true,
})

function onShow() {
  isShow.value = true
}

function onImageLoad() {
  isImageLoaded.value = true
}
</script>

<template>
  <LazyComponent
    v-if="props.imgUrl"
    class="bg-#BBBBBB relative"
    :style="containerStyle"
    @show="onShow"
  >
    <div
      v-if="showLoading"
      class="loading"
      :style="roundedStyle"
    />
    <transition :name="animation">
      <img
        v-show="realUrl && isImageLoaded"
        class="wh-full"
        :style="imgStyle"
        :src="url"
        alt="加载失败"
        @load="onImageLoad"
      >
    </transition>
  </LazyComponent>
</template>

<style scoped lang="scss">
.bounceFade-enter-active,
.bounceFade-leave-active {
  animation: bounceFade-in 0.4s;
}

.loading {
  width: 100%;
  height: 100%;
  background: #5c5c5c url('@/assets/images/loading.png') center center / 50% auto no-repeat;
  position: absolute;
  top: 0;
  left: 0;
}

@keyframes bounceFade-in {
  0% {
    opacity: 0;
  }

  60% {
    opacity: 0.5;
  }

  to {
    opacity: 1;
  }
}
</style>
