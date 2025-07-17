<script setup>
const tabsData = [
  { name: '首页', id: 'home' },
  { name: '分类', id: 'category' },
  { name: '我的', id: 'profile' },
  { name: '我的2', id: 'profile2' },
  { name: '我的3', id: 'profile3' },
  { name: '我的4', id: 'profile4' },
  { name: '我的5', id: 'profile5' },
  { name: '我的6', id: 'profile6' },
  { name: '我的7', id: 'profile7' },
  { name: '我的8', id: 'profile8' },
  { name: '我的9', id: 'profile9' },
  { name: '我的10', id: 'profile10' },
]
</script>

<template>
  <PageContainer>
    <SwiperTabs
      :tabs="tabsData"
    >
      <template #tab="{ tab }">
        <div class="p-16 flex flex-col gap-16">
          {{ tab }}
          <LazyImage
            v-for="item in 20"
            :key="item"
            height="300px"
            width="300px"
            img-url="https://picsum.photos/200/300?random=1212"
            fit="cover"
          />
          <div class="text-center">
            {{ item }}
          </div>
        </div>
      </template>
    </SwiperTabs>
  </PageContainer>
</template>

<route lang="json5">
  {
    name: 'demo-swiper',
    meta: {
      title: 'swiper',
      i18n: 'menus.demoSwiper',
      keepAlive: true,
    },
  }
  </route>
