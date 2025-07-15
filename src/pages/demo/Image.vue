<template>
  <PageContainer :has-header="false" content-class="pt-16">
    <div class="flex flex-col gap-16">
      <LazyImage
        v-for="item in 20"
        :key="item"
        height="400px"
        width="400px"
        :img-url="`https://picsum.photos/200/300?random=${item}`"
        fit="cover"
      />
    </div>
  </PageContainer>
</template>

<route lang="json5">
  {
    name: 'lazy-image',
    meta: {
      title: '图片懒加载',
      i18n: 'menus.lazyImage'
    },
  }
  </route>
