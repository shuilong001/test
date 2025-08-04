<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

import { aaa, bbb, device_model, getDeviceId } from '@/web-base/network/Utils'
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
  const res = await userStore.getUserLoginInfo({
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
  console.log('login----res: ', res)
  if (res.code === 1) {
    showToast('登录成功')
  }
  else {
    SliderVerifyRef.value.error(res.message)
    if (res.message === 'account_or_password_incorrect') { // 密码错误自动关闭
      setTimeout(() => {
        SliderVerifyRef.value.close()
      }, 1000)
    }
  }
}
watch([() => userStore.isLogin, () => loading.value], ([isLogin, loadingVal]) => {
  if (isLogin && loadingVal) {
    const { redirect, ...othersQuery } = router.currentRoute.value.query
    router.push({
      path: (redirect as string) || '/',
      query: {
        ...othersQuery,
      },
    })
  }
})
</script>

<template>
  <PageContainer content-class="flex flex-col items-center justify-center" :nav-bar-props="{ title: '登录' }">
    <div class="my-32 flex-center">
      <div class="i-custom:avatar h-120 w-120" />
    </div>
    <div class="flex-center w-full">
      <div class="w-2/3 md:w-1/3">
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
      </div>
    </div>
    <!-- 拖动校验 -->
    <SliderVerify ref="SliderVerifyRef" type="login" @loading="loading = true" @loaded="loading = false" @success="login" />
  </PageContainer>
</template>

<route lang="json5">
{
  name: 'login',
  meta: {
    i18n: 'menus.login'
  },
}
</route>
