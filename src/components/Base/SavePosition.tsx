import type { SetupContext, SlotsType, VNode } from 'vue'

export interface ISlots {
  default: () => VNode[]
}

export interface IProps {
  enable?: boolean
}

export default defineComponent((props: IProps, { slots }: SetupContext<null, SlotsType<ISlots>>) => {
  let childList: VNode[] = []
  const position = reactive({
    scrollTop: 0,
    scrollLeft: 0,
  })

  onActivated(() => {
    if (childList.length) {
      const child = childList[0]
      if (child.el) {
        child.el.scrollTop = position.scrollTop
        child.el.scrollLeft = position.scrollLeft
      }
    }
  })

  onBeforeRouteLeave(() => {
    if (props.enable) {
      if (childList.length) {
        const child = childList[0]
        position.scrollTop = child.el?.scrollTop
        position.scrollLeft = child.el?.scrollLeft
      }
    }
  })
  return () => {
    childList = slots.default ? slots.default() : []
    return (
      <>
        {childList}
      </>
    )
  }
}, {
  slots: Object as SlotsType<ISlots>,
  props: {
    enable: {
      type: Boolean,
      default: true,
    },
  },
})
