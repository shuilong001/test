<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DemoDialog, DemoModal } from '@/components/Modal'

const router = useRouter()

function handleClick(key: string) {
  if (key === 'modal') {
    console.log('DemoModal: ', DemoModal)
    DemoModal.show({
      title: 'modal',
      content: 'modal content',
    })
  }
  else if (key === 'dialog') {
    console.log('DemoDialog: ', DemoDialog)
    DemoDialog.show({
      title: 'dialog',
      content: 'dialog content',
    })
  }
  else {
    router.push({ path: `/demo/${key}` })
  }
}
</script>

<template>
  <PageContainer :has-header="false" content-class="pt-16">
    <van-cell-group inset>
      <van-cell title="图片懒加载" is-link @click="handleClick('image')" />
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="swiper" is-link @click="handleClick('swiper')" />
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="modal" is-link @click="handleClick('modal')" />
      <van-cell title="dialog" is-link @click="handleClick('dialog')" />
    </van-cell-group>
  </PageContainer>
</template>

<route lang="json5">
{
  name: 'home',
  meta: {
    title: '首页',
    i18n: 'menus.home',
  },
}
</route>

<style scoped lang="scss"></style>
