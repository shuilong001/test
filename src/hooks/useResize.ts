/**
 * 计算真实vh
 */
export function useResize() {
  const isDesktop = ref(false)
  const calculateIsDesktop = () => {
    isDesktop.value = window.innerWidth > 768
  }

  const throttleCalculate = useThrottleFn(calculateIsDesktop, 300, true, false)

  onMounted(() => {
    // 初始计算
    calculateIsDesktop()
    // 调整大小时重新计算
    window.addEventListener('resize', throttleCalculate)

    // 在设备方向改变时重新计算
    window.addEventListener('orientationchange', throttleCalculate)
  })

  onBeforeUnmount(() => {
    // 调整大小时重新计算
    window.removeEventListener('resize', throttleCalculate)

    // 在设备方向改变时重新计算
    window.removeEventListener('orientationchange', throttleCalculate)
  })
  return { isDesktop }
}
