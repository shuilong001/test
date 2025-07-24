<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  topLimit: {
    type: Number,
    default: 0,
  },
  rightLimit: {
    type: Number,
    default: 0,
  },
  bottomLimit: {
    type: Number,
    default: 0,
  },
  leftLimit: {
    type: Number,
    default: 0,
  },
  snapThreshold: {
    type: Number,
    default: 20,
  },
  initialPosition: {
    type: Object,
    default: () => ({ x: 0, y: 0 }),
  },
})

const emit = defineEmits(['dragStart', 'dragEnd', 'positionChange'])

const draggableElement = ref(null)
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })
const currentPos = ref({ x: props.initialPosition.x, y: props.initialPosition.y })
const elementSize = ref({ width: 0, height: 0 })
const windowSize = ref({ width: 0, height: 0 })
const safeAreaInsets = ref({ top: 0, right: 0, bottom: 0, left: 0 })

const elementStyle = computed(() => {
  return {
    transform: `translate(${currentPos.value.x}px, ${currentPos.value.y}px)`,
    cursor: isDragging.value ? 'grabbing' : 'grab',
    position: 'fixed',
    zIndex: 999,
  }
})

onMounted(() => {
  updateElementSize()
  updateWindowSize()
  updateSafeAreaInsets()
  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', handleOrientationChange)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('orientationchange', handleOrientationChange)
})

function updateElementSize() {
  if (draggableElement.value) {
    elementSize.value = {
      width: draggableElement.value.offsetWidth,
      height: draggableElement.value.offsetHeight,
    }
    constrainPosition()
  }
}

function updateWindowSize() {
  windowSize.value = {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  }
}

function unpdatePosition(v) {
  currentPos.value = v
}

function updateSafeAreaInsets() {
  safeAreaInsets.value = {
    top: getSafeAreaInset('top'),
    right: getSafeAreaInset('right'),
    bottom: getSafeAreaInset('bottom'),
    left: getSafeAreaInset('left'),
  }
  constrainPosition()
}

function getSafeAreaInset(side) {
  if (!CSS.supports(`padding-${side}: env(safe-area-inset-${side})`)) {
    return 0
  }

  const div = document.createElement('div')
  div.style[`padding${side.charAt(0).toUpperCase() + side.slice(1)}`] = `env(safe-area-inset-${side})`
  document.body.appendChild(div)
  const value = Number.parseInt(window.getComputedStyle(div)[`padding${side.charAt(0).toUpperCase() + side.slice(1)}`], 10) || 0
  document.body.removeChild(div)

  return value
}

function handleResize() {
  updateWindowSize()
  // 延迟检查确保浏览器UI完全稳定
  setTimeout(() => {
    updateWindowSize()
    updateSafeAreaInsets()
    constrainPosition()
  }, 300)
}

function handleOrientationChange() {
  // 方向变化需要更多时间让浏览器调整
  setTimeout(() => {
    updateWindowSize()
    updateSafeAreaInsets()
    constrainPosition()
  }, 500)
}

function startDrag(e) {
  isDragging.value = true

  const clientX = e.clientX || e.touches[0].clientX
  const clientY = e.clientY || e.touches[0].clientY

  startPos.value = {
    x: clientX - currentPos.value.x,
    y: clientY - currentPos.value.y,
  }

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('touchmove', handleDrag, { passive: false })
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchend', stopDrag)

  emit('dragStart', currentPos.value)
}

function handleDrag(e) {
  if (!isDragging.value)
    return
  e.preventDefault()

  const clientX = e.clientX || e.touches[0].clientX
  const clientY = e.clientY || e.touches[0].clientY

  let newX = clientX - startPos.value.x
  let newY = clientY - startPos.value.y

  // 计算有效边界，考虑安全区域
  const effectiveTopLimit = Math.max(props.topLimit, safeAreaInsets.value.top)
  const effectiveBottomLimit = Math.max(props.bottomLimit, safeAreaInsets.value.bottom)
  const effectiveLeftLimit = Math.max(props.leftLimit, safeAreaInsets.value.left)
  const effectiveRightLimit = Math.max(props.rightLimit, safeAreaInsets.value.right)

  const maxX = windowSize.value.width - elementSize.value.width - effectiveRightLimit
  const maxY = windowSize.value.height - elementSize.value.height - effectiveBottomLimit

  newX = Math.max(effectiveLeftLimit, Math.min(newX, maxX))
  newY = Math.max(effectiveTopLimit, Math.min(newY, maxY))

  currentPos.value = { x: newX, y: newY }
  emit('positionChange', currentPos.value)
}

function stopDrag() {
  if (!isDragging.value)
    return
  isDragging.value = false

  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)

  checkSnapToEdge()
  emit('dragEnd', currentPos.value)
}

function checkSnapToEdge() {
  const effectiveTopLimit = Math.max(props.topLimit, safeAreaInsets.value.top)
  const effectiveBottomLimit = Math.max(props.bottomLimit, safeAreaInsets.value.bottom)
  const effectiveLeftLimit = Math.max(props.leftLimit, safeAreaInsets.value.left)
  const effectiveRightLimit = Math.max(props.rightLimit, safeAreaInsets.value.right)

  const maxX = windowSize.value.width - elementSize.value.width - effectiveRightLimit
  const maxY = windowSize.value.height - elementSize.value.height - effectiveBottomLimit

  let newX = currentPos.value.x
  let newY = currentPos.value.y
  let snapped = false

  if (newX - effectiveLeftLimit < props.snapThreshold) {
    newX = effectiveLeftLimit
    snapped = true
  }
  else if (maxX - newX < props.snapThreshold) {
    newX = maxX
    snapped = true
  }

  if (newY - effectiveTopLimit < props.snapThreshold) {
    newY = effectiveTopLimit
    snapped = true
  }
  else if (maxY - newY < props.snapThreshold) {
    newY = maxY
    snapped = true
  }

  if (snapped) {
    currentPos.value = { x: newX, y: newY }
    emit('positionChange', currentPos.value)
  }
}

function constrainPosition() {
  const effectiveTopLimit = Math.max(props.topLimit, safeAreaInsets.value.top)
  const effectiveBottomLimit = Math.max(props.bottomLimit, safeAreaInsets.value.bottom)
  const effectiveLeftLimit = Math.max(props.leftLimit, safeAreaInsets.value.left)
  const effectiveRightLimit = Math.max(props.rightLimit, safeAreaInsets.value.right)

  const maxX = windowSize.value.width - elementSize.value.width - effectiveRightLimit
  const maxY = windowSize.value.height - elementSize.value.height - effectiveBottomLimit

  const newX = Math.max(effectiveLeftLimit, Math.min(currentPos.value.x, maxX))
  const newY = Math.max(effectiveTopLimit, Math.min(currentPos.value.y, maxY))

  if (newX !== currentPos.value.x || newY !== currentPos.value.y) {
    currentPos.value = { x: newX + props.initialPosition.x, y: newY + props.initialPosition.y }
    emit('positionChange', currentPos.value)
  }
}

function getCurrentPos() {
  return currentPos.value
}

defineExpose({
  unpdatePosition,
  getCurrentPos,
})
</script>

<template>
  <div
    ref="draggableElement"
    class="draggable-element"
    :style="elementStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <slot />
  </div>
</template>

<style scoped>
.draggable-element {
  touch-action: none;
  user-select: none;
}

.draggable-element:active {
  cursor: grabbing;
}
</style>
