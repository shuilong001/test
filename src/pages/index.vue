<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DemoDialog, DemoModal } from '@/components/Modal'

defineOptions({
  name: 'Home',
})

onActivated(() => {
  console.log('onActivated')
})
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
  else if (key === 'category') {
    router.push({ path: `/game/category` })
  }
  else {
    router.push({ path: `/demo/${key}` })
  }
}
</script>

<template>
  <PageContainer :has-header="false" content-class="pt-16">
    <div class="px-16">
      <van-cell title="swiper" is-link @click="handleClick('swiper')" />
      <van-cell title="图片懒加载" is-link @click="handleClick('image')" />
      <van-cell title="modal" is-link @click="handleClick('modal')" />
      <van-cell title="dialog" is-link @click="handleClick('dialog')" />
      <van-cell title="下拉刷新" is-link @click="handleClick('pull')" />
      <van-cell title="游戏分类页" is-link @click="handleClick('category')" />
      <div class="py-16">
        测试滚动
      </div>
      <div v-for="i in 100" :key="i" class="p-10">
        {{ i }}
      </div>
    </div>
  </PageContainer>
</template>

<route lang="json5">
{
  name: 'Home',
  meta: {
    title: '首页',
    i18n: 'menus.home',
    keepAlive: true,
  },
}
</route>

<style scoped lang="scss"></style>
