<script setup lang="ts">
import type { INiceModalHandlers } from 'vue-nice-modal'

interface IProps extends INiceModalHandlers {
  visible: boolean
  title: string
  content: string
}

interface IEmits {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

async function handleConfirm() {
  props.callback('confirm', {})
  props.hide()
}
function handleCancel() {
  props.callback('cancel')
  props.hide()
}
</script>

<template>
  <VanPopup
    :show="visible"
    position="bottom"
    @close="props.hide()"
    @update:show="emit('update:visible', false)"
    @closed="remove"
  >
    <!-- 取消 标题 确定 -->
    <div class="p-y-14 flex items-end justify-between">
      <div class="text-12 p-x-18" @click="handleCancel">
        取消
      </div>
      <div class="text-16">
        {{ title }}
      </div>
      <div class="text-12 p-x-18" @click="handleConfirm">
        确定
      </div>
    </div>
    <div class="p-x-18 p-y-14 h-200">
      {{ content }}
    </div>
  </VanPopup>
</template>

<style lang="scss" scoped>

</style>
