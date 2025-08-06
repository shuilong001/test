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

const { isDesktop } = useResize()
const contentStyle = computed(() => {
  return {
    marginBottom: props.hasFooter ? (isDesktop.value ? `var(--pc-header)` : `var(--safe-footer)`) : `var(--sab)`,
    marginTop: props.hasHeader ? (isDesktop.value ? `var(--pc-safe-header)` : `var(--safe-header)`) : `var(--sat)`,
  }
})

const mainContentClass = computed(() => {
  return `${props.contentClass} transition-all duration-300 ease-in-out ${appStore.sidebarCollapsed ? `md:pl-[var(--sidebar-width-collapsed)]` : `md:pl-[var(--sidebar-width)]`}`
})
</script>

<template>
  <main class="flex flex-1 flex-col wh-full md:mb-60" :class="mainContentClass">
    <!-- <slot name="header">
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
        <slot name="header-sticky" />
      </div>
    </slot> -->
    <div class="flex-grow-1 wh-full overflow-y-auto md:mx-auto md:max-w-[1248px]" :style="contentStyle">
      <slot />
    </div>
  </main>
</template>

<style lang="scss" scoped>

</style>
