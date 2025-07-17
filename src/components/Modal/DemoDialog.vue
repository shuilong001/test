<script setup lang="ts">
import type { INiceModalHandlers } from 'vue-nice-modal'

interface IProps extends INiceModalHandlers {
  visible: boolean
  title?: string
  content?: string
  showCancel?: boolean
  cancelText?: string
  displayConfirmText?: string
  confirmClass?: string
  isConfirmDisabled?: boolean
}

interface IEmits {
  (e: 'update:visible', visible: boolean): void
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  content: '',
  cancelText: '取消',
  displayConfirmText: '确定',
  showCancel: true,
  dialogClass: '',
  confirmClass: '',
  countdown: 0,
})
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
  <van-dialog
    :show="visible"
    :title="title"
    :show-confirm-button="showCancel"
    :show-cancel-button="showCancel"
    @close="props.hide()"
    @update:show="emit('update:visible', false)"
  >
    <img src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg">
    <div class="mb-20 mt-50 p-x-15 flex-center gap-x-16 w-full">
      <DefaultBtn type="default" :text="cancelText" @click="handleCancel" />

      <DefaultBtn
        type="primary"
        :text="displayConfirmText"
        :class="confirmClass"
        :disabled="isConfirmDisabled"
        @click="handleConfirm"
      />
    </div>
  </van-dialog>
</template>

<style lang="scss" scoped>

</style>
