<script setup lang="tsx"  generic="T">
import type { NavBarPropsType } from './NavBar.vue'
import { useAppStore } from '@/stores/modules/app'

const props = withDefaults(defineProps<{
  hasHeader?: boolean
  hasFixedHeader?: boolean
  hasFooter?: boolean
  contentClass?: string
  navBarProps?: NavBarPropsType
  /** 是否是页面组件 */
  isPage?: boolean
}>(), {
  hasHeader: true,
  isPage: true,
})
const appStore = useAppStore()
props.isPage && useTabBar(() => props.hasFooter)

const contentStyle = computed(() => {
  return {
    height: '100%',
    paddingBottom: props.hasFooter ? `calc(var(--van-tabbar-height) + var(--sab))` : `calc(var(--sab))`,
  }
})

const mainContentClass = computed(() => {
  return `${props.contentClass} ${appStore.sidebarCollapsed ? 'md:ml-100' : 'md:ml-200'}`
})
</script>

<template>
  <main :style="contentStyle" class="flex flex-col wh-full left-0 top-0 absolute">
    <slot name="header" class="z-1">
      <div class="flex flex-col">
        <NavBar v-if="props.hasHeader || props.hasFixedHeader" v-bind="props.navBarProps" :fixed="props.hasFixedHeader" class="flex-shrink-0 flex-grow-0">
          <template #left>
            <slot v-if="$slots.left" name="left" />
          </template>
          <template #title>
            <slot v-if="$slots.title" name="title" />
          </template>
          <template #right>
            <slot v-if="$slots.right" name="right" />
          </template>
        </NavBar>
        <slot name="header-sticky" />
      </div>
    </slot>
    <slot name="not-fixed-header" />
    <div class="flex-grow-1 w-full relative z-1 overflow-hidden">
      <transition-group name="fade">
        <div key="main" class="wh-full top-0 absolute overflow-hidden">
          <SavePosition>
            <HomeSideMenu class="hidden md:block" />
            <div id="page-container-content" class="wh-full transition-all duration-300 overflow-y-auto" :class="mainContentClass">
              <slot />
            </div>
          </SavePosition>
        </div>
      </transition-group>
    </div>
  </main>
</template>

<style lang="scss" scoped>

</style>
