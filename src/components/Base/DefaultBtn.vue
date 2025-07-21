<script setup lang="ts">
const props = withDefaults(defineProps<{
  text?: string // 是否必传
  type?: 'primary' | 'default'
  isFixed?: boolean
  size?: 'large' | 'normal'
  disabled?: boolean // 新增 disabled 属性
}>(), {
  text: '确定',
  type: 'default',
  isFixed: false,
  size: 'normal',
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  if (!props.disabled)
    emit('click')
}
</script>

<template>
  <div
    class="text-size-14 lh-23 font-bold px-16 py-6 border-rd-100 flex items-center justify-center"
    :class="[
      { 'fixed-btn': isFixed },
      { 'bg-[linear-gradient(90deg,#24ee89,#9fe871)]  text-#000': type === 'primary' },
      { ' !bg-gray-500 !text-#fff': type === 'default' },
      { '!px-20 !py-10 !text-size-16': size === 'large' },
      { '!opacity-50 !cursor-not-allowed': disabled },
    ]"
    @click="handleClick"
  >
    {{ text }}
  </div>
</template>

<style lang="scss" scoped>
.fixed-btn {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
