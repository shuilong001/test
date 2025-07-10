import { isFunction } from 'lodash-es'
import type { MaybeRefOrGetter } from 'vue'

/**
 * @description 底部tabBar显示控制
 */

export const useShareTabBarState = createSharedComposable(useToggle)

export function useTabBar(value: MaybeRefOrGetter<boolean>) {
  const [_, toggle] = useShareTabBarState()
  const getValue = () => isFunction(value) ? value() : unref(value)
  watch(getValue, (v) => {
    toggle(v)
  }, {
    immediate: true,
  })

  onMounted(() => {
    toggle(getValue())
  })
  onActivated(() => {
    toggle(getValue())
  })
  return [getValue(), toggle]
}
