<script setup lang="ts">
interface VanNavBarProps {
  title?: string
  zIndex?: number | string
  border?: boolean
  rightText?: string
  leftDisabled?: boolean
  rightDisabled?: boolean
  leftArrow?: boolean
  placeholder?: boolean
  safeAreaInsetTop?: boolean
  clickable?: boolean
}
export interface NavBarPropsType extends VanNavBarProps {
  onClickRight?: () => void
  /* 左键返回 */
  onBack?: () => void
  /* 背景 */
  bg?: string
  /**/
  mode?: 'dark' | 'light' | 'transparent'
  /* 显示标题 */
  showTitle?: boolean
}
const props = withDefaults(defineProps<NavBarPropsType>(), {
  clickable: true,
  border: false,
  safeAreaInsetTop: true,
  leftArrow: true,
  mode: 'light',
  showTitle: true,
})

const route = useRoute()

const innerTitle = computed(() => {
  return props.showTitle ? (props.title !== undefined ? props.title : route?.meta?.title) : ''
})

const vanNavBarProps = computed(() => {
  const { onBack, onClickRight, rightText, title, leftArrow, bg, mode, showTitle, ...reset } = props
  return reset
})

function onClickRight() {
  props.onClickRight?.()
}

function onBack() {
  if (props.onBack) {
    props.onBack()
  }
  else {
    historyBack()
  }
}
</script>

<template>
  <VanNavBar
    safe-area-inset-top
    v-bind="vanNavBarProps"
    class="back-nav"
    @click-left="onBack"
    @click-right="onClickRight"
  >
    <template #left>
      <slot name="left">
        <div v-if="props.leftArrow " :class="{ 'w-26 h-26 flex items-center justify-center  rounded-full': props.mode === 'dark' }">
          <span
            class="i-custom:new-nav-arrow pl-8 h-20 w-12 inline-block"
            :class="{ '!text-#fff !w-10 !h-16': props.mode === 'dark' }"
          />
        </div>
      </slot>
    </template>
    <template #title>
      <div class="text-size-20 font-bold">
        <slot name="title">
          {{ innerTitle }}
        </slot>
      </div>
    </template>
    <template #right>
      <div class="text-size-14 font-medium">
        <slot name="right">
          {{ rightText }}
        </slot>
      </div>
    </template>
  </VanNavBar>
</template>

<style lang="scss" scoped>

</style>
