<script setup lang="ts">
import { historyBack } from '@/utils/helper'
import router from '@/router'

const route = useRoute('index')

onMounted(() => {
  if (route.query.redirect) {
    if (typeof route.query.redirect === 'string')
      router.replace(route.query.redirect)
  }
  else {
    setTimeout(() => {
      historyBack()
    }, 1000)
  }
})
</script>

<template>
  <div class="flex-center wh-full">
    <van-loading vertical size="36">
      <span class="text-16">加载中...</span>
    </van-loading>
  </div>
</template>

<route lang="json5">
{
  name: 'index',
  meta: {
    title: '首页',
    i18n: 'menus.index'
  },
}
</route>
