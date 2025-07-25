<script setup lang="ts">
import { showConfirmDialog } from 'vant'
// import router from '@/router'
import { useUserStore } from '@/stores'
import { version } from '~root/package.json'

const { t } = useI18n()
const userStore = useUserStore()

const isLogin = computed(() => userStore.isLogin)

function Logout() {
  showConfirmDialog({
    title: t('settings.comfirmTitle'),
  })
    .then(() => {
      userStore.logout()
      // router.push({ name: 'home' })
    })
    .catch(() => {})
}
</script>

<template>
  <PageContainer>
    <div class="mt-10">
      <van-cell v-if="isLogin" :title="$t('settings.logout')" clickable class="van-text-color" @click="Logout" />
      {{ $t("settings.currentVersion") }}: v{{ version }}
    </div>
  </PageContainer>
</template>

<style scoped>
.van-text-color {
  --van-cell-text-color: var(--van-red);
}
</style>

<route lang="json5">
{
  name: 'settings',
  meta: {
    title: '我的设置',
    i18n: 'menus.settings'
  },
}
</route>
