<script setup lang="ts">
defineOptions({
  name: 'Activity',
})
</script>

<template>
  <PageContainer :has-header="false">
    <h1>Activity</h1>
  </PageContainer>
</template>

<style scoped lang="scss"></style>

<route lang="json5">
  {
    name: 'Activity',
    meta: {
      title: 'Activity',
      i18n: 'menus.activity',
      keepAlive: true,
    },
  }
  </route>
