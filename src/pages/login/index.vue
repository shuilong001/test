<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RouteMap } from 'vue-router'
import { useUserStore } from '@/stores'

import logo from '~/images/logo.svg'
import logoDark from '~/images/logo-dark.svg'
import vw from '@/utils/inline-px-to-vw'
import { aaa, bbb, device_model, getDeviceId } from '@/web-base/net/Utils'
import { IP } from '@/web-base/utils/useStoreMethods'

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const route = useRoute()
const dark = ref<boolean>(isDark.value)
const SliderVerifyRef = ref()

watch(
  () => isDark.value,
  (newMode) => {
    dark.value = newMode
  },
)

const postData = reactive<{
  username: string
  password: string
}>({
  username: '',
  password: '',
})

const rules = reactive({
  username: [
    { required: true, message: t('login.pleaseEnterEmail') },
  ],
  password: [
    { required: true, message: t('login.pleaseEnterPassword') },
  ],
})

function handleSubmit() {
  console.log('handleSubmit--------')
  SliderVerifyRef.value.open()
}

async function login(captcha: string) {
    loading.value = true
    const device_id = await getDeviceId()
    const ip = await IP()
    userStore.getUserLoginInfo({
      login_type: 4,
      username: postData.username,
      password: postData.password,
      device_id,
      device_model,
      captcha,
      channel_id: Number(route.query.channel_id) || 123,
      aaa: aaa.toString(),
      bbb,
      ip,
    })
    
}
watch([() => userStore.isLogin, () => loading.value], ([isLogin, loadingVal]) => {
  if (isLogin && loadingVal) {
    const { redirect, ...othersQuery } = router.currentRoute.value.query
    router.push({
      name: (redirect as keyof RouteMap) || 'home',
      query: {
        ...othersQuery,
      },
    })
  }
})
</script>

<template>
  <div class="m-x-a text-center w-7xl">
    <div class="mb-32 mt-20">
      <van-image :src="dark ? logoDark : logo" class="h-120 w-120" alt="brand logo" />
    </div>
    <div class="i-custom:avatar" style="width: 100px; height: 100px;" />

    <van-form :model="postData" :rules="rules" validate-trigger="onSubmit" @submit="handleSubmit">
      <div class="rounded-3xl overflow-hidden">
        <van-field
          v-model="postData.username"
          :rules="rules.username"
          name="username"
          :placeholder="$t('login.username')"
        />
      </div>

      <div class="mt-16 rounded-3xl overflow-hidden">
        <van-field
          v-model="postData.password"
          type="password"
          :rules="rules.password"
          name="password"
          :placeholder="$t('login.password')"
        />
      </div>

      <div class="mt-16">
        <van-button
          :loading="loading"
          type="primary"
          native-type="submit"
          round block
        >
          {{ $t('login.login') }}
        </van-button>
      </div>
    </van-form>

    <GhostButton block to="register" :style="{ 'margin-top': vw(18) }">
      {{ $t('login.sign-up') }}
    </GhostButton>

    <GhostButton block to="forgot-password">
      {{ $t('login.forgot-password') }}
    </GhostButton>
    <!-- 拖动校验 -->
    <SliderVerify ref="SliderVerifyRef" type="login" @loading="loading = true" @loaded="loading = false" @success="login" />
  </div>
</template>

<route lang="json5">
{
  name: 'login',
  meta: {
    i18n: 'menus.login'
  },
}
</route>
