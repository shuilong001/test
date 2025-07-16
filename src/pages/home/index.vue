<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handleClick(key: string) {
  router.push({ path: `/demo/${key}` })
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
