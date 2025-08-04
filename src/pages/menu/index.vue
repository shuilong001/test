<script setup lang="ts">
defineOptions({
  name: 'MenuPage',
})
</script>

<template>
  <PageContainer>
    <h1>Menu</h1>
  </PageContainer>
</template>

<style scoped lang="scss"></style>

<route lang="json5">
  {
    name: 'MenuPage',
    meta: {
      title: 'Menu',
      i18n: 'menus.menu',
      keepAlive: true,
    },
  }
  </route>
