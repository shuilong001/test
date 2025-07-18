<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores'
import defaultAvatar from '@/assets/images/default-avatar.svg'

defineOptions({
  name: 'Profile',
})

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const isLogin = computed(() => !!userInfo.value?.full_name)

function login() {
  if (isLogin.value)
    return

  router.push({ name: 'login', query: { redirect: 'profile' } })
}
</script>

<template>
  <PageContainer content-class="pt-16" :has-header="false">
    <VanCellGroup :inset="true">
      <van-cell center :is-link="!isLogin" @click="login">
        <template #title>
          <van-image :src="userInfo?.real_name || defaultAvatar" round class="h-56 w-56" />
        </template>
        <template #value>
          <span v-if="isLogin">{{ userInfo?.full_name }}</span>
          <span v-else>{{ $t('profile.login') }}</span>
        </template>
      </van-cell>
    </VanCellGroup>

    <VanCellGroup :inset="true" class="!mt-16">
      <van-cell :title="$t('profile.settings')" icon="setting-o" is-link to="/settings">
        <template #icon>
          <div class="md i-carbon:settings text-gray-400 mr-5 self-center" />
        </template>
      </van-cell>
    </VanCellGroup>
  </PageContainer>
</template>

<route lang="json5">
{
  name: 'Profile',
  meta: {
    title: '个人中心',
    i18n: 'menus.profile',
    keepAlive: true,
  },
}
</route>
