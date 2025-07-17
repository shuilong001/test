<script setup lang="ts">
const count = ref(0)
const loading = ref(false)
function onRefresh() {
  setTimeout(() => {
    showToast('刷新成功')
    loading.value = false
    count.value++
  }, 1000)
}
</script>

<template>
  <PageContainer>
    <van-pull-refresh v-model="loading" :head-height="80" @refresh="onRefresh">
      <div class="flex flex-center flex-col gap-16 h-safe:44px">
        试试下拉刷新，刷新次数: {{ count }}
      </div>
    </van-pull-refresh>
  </PageContainer>
</template>

<route lang="json5">
  {
    name: 'pull',
    meta: {
      title: '下拉刷新',
      i18n: 'menus.pull',
      keepAlive: true,
    },
  }
  </route>

<style scoped>
.doge {
  width: 140px;
  height: 72px;
  margin-top: 8px;
  border-radius: 4px;
}
</style>
