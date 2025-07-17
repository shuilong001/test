<script setup lang="tsx"  generic="T">
import type { NavBarPropsType } from './NavBar.vue'
import { useAppStore } from '@/stores/modules/app'

const props = withDefaults(defineProps<{
  hasHeader?: boolean
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
    paddingBottom: props.hasFooter ? `calc(var(--tabbar-height) + var(--sab))` : `calc(var(--sab))`,
  }
})

const mainContentClass = computed(() => {
  return `${props.contentClass} ${appStore.sidebarCollapsed ? 'md:pl-80' : 'md:pl-200'}`
})
</script>

<template>
  <main :style="contentStyle" class="flex flex-col wh-full">
    <slot name="header" class="">
      <div class="flex flex-col z-2">
        <NavBar v-if="props.hasHeader" v-bind="props.navBarProps" class="flex-shrink-0 flex-grow-0 md:hidden">
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
        <slot name="header-sticky">
          <HomeHeader />
        </slot>
      </div>
    </slot>
    <slot name="not-fixed-header" />
    <div class="flex-grow-1 w-full relative z-1 overflow-hidden">
      <transition-group name="fade">
        <HomeSideMenu />
        <div id="page-container-content" class="wh-full transition-all duration-300 relative overflow-y-auto" :class="mainContentClass">
          <slot />
        </div>
      </transition-group>
    </div>
  </main>
</template>

<style lang="scss" scoped>

</style>
