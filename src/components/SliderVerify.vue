<!--  拖动校验 -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { aaa, bbb, getDeviceId, getRandomSign } from '@/web-base/net/Utils'
import { NetPacket } from '@/web-base/netBase/NetPacket'
import { wsRequest } from '@/composables/useWsRequest'
import { NetMsgType } from '@/web-base/netBase/NetMsgType'

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['success', 'loading', 'loaded'])

const { t } = useI18n()
const baseViewportWidth = 375
const scaleFactor = window.innerWidth / baseViewportWidth
const show = ref(false)
const UN: any = ref('') // 账号
const agent_id: any = ref('') // 邀请码

// 图片加载状态
const loadingPics = ref(0)

function preventTouchmove(e: any) {
  e.preventDefault()
}

watch(() => show.value, (v: boolean) => {
  const app = document.querySelector('.app')
  console.log('app--------: ', show.value)
  if (v) {
    app?.addEventListener('touchmove', preventTouchmove)
  }
  else {
    app?.removeEventListener('touchmove', preventTouchmove)
  }
})

onBeforeUnmount(() => {
  const app = document.querySelector('.app')
  app?.removeEventListener('touchmove', preventTouchmove)
})

// 验证体
const sliderLeft = ref(0)
const captchaUrl = ref('')
const sliderUrl = ref('')
const sliderBgUrl = ref('')
const expectedY = ref(0)
const loading = ref(false)
const handLoading = ref(false)

async function loadCaptcha(init: boolean) {
  if (loading.value)
    return
  loading.value = true
  if (init) {
    loadingPics.value = 0
  }
  else {
    loadingPics.value = 2
  }
  let moving_check: any = null
  if (props.type === 'register') {
    moving_check = NetPacket.req_register_moving_check()
    moving_check.username = UN.value
    if (agent_id.value) {
      moving_check.agent_id = agent_id.value
    }
    else {
      moving_check.agent_id = '666888'
    }
  }
  if (props.type === 'login') {
    moving_check = NetPacket.req_login_moving_check()
  }

  setTimeout(() => {
    sliderLeft.value = 0
  }, 500)
  const id = await getDeviceId()
  console.log('id1111111: ', id)
  moving_check.sign = getRandomSign(id)
  moving_check.aaa = aaa.toString()
  moving_check.bbb = bbb
  const cbNameMap: any = {
    login: NetMsgType.msgType.msg_notify_login_moving_check,
    register: NetMsgType.msgType.msg_notify_register_moving_check,
  }
  // PKwebsocket.instance.send(moving_check, false, {
  //   callbackName: cbNameMap[props.type],
  //   callback: (res: any) => {
  //     loading.value = false
  //     setTimeout(() => {
  //       handLoading.value = false
  //     }, 1000)
  //     if (res.is_success == 1 || props.type == 'login') {
  //       captchaUrl.value = res.url
  //       sliderUrl.value = res.url.replace('_2.png', '_1.png')
  //       sliderBgUrl.value = res.url.replace('_2.png', '_3.png')
  //       expectedY.value = res.y_pos * scaleFactor
  //     }
  //     else {
  //       close()
  //     }
  //   },
  // })
  console.log('moving_check222222222222: ')
  const res = await wsRequest<any, {
    is_success: number
    url: string
    y_pos: number
  }>(moving_check, cbNameMap[props.type], false)
  loading.value = false
  setTimeout(() => {
    handLoading.value = false
  }, 1000)
  if (res.is_success === 1 || props.type === 'login') {
    captchaUrl.value = res.url
    sliderUrl.value = res.url.replace('_2.png', '_1.png')
    sliderBgUrl.value = res.url.replace('_2.png', '_3.png')
    expectedY.value = res.y_pos * scaleFactor
  }
  else {
    close()
  }
}

// 切换验证码的动画
const aniOut = ref(false)
const aniIn = ref(false)

// 状态
const tipText = ref('')
const tipStatus = ref('error')

// 失败状态
const errorStatus = ref(false)
function error(text: any) {
  errorStatus.value = true
  tipStatus.value = 'error'
  tipText.value = text
  aniOut.value = true
  setTimeout(() => {
    loadCaptcha(false)
  }, 1000)
  setTimeout(() => {
    errorStatus.value = false
  }, 1200)
  loading.value = false
}

// 成功状态
const successStatus = ref(false)
function success(text: any) {
  successStatus.value = true
  tipStatus.value = 'success'
  tipText.value = text
  loading.value = false
  setTimeout(() => {
    successStatus.value = false
    close()
  }, 1000)
}

const dragging = ref(false)
const startX = ref(0)
const sliderRef = ref()
const sliadeBallRef = ref()
function onStart(event: any) {
  if (loading.value)
    return
  let target = event
  try {
    target = event.touches[0]
  }
  catch { }
  dragging.value = true
  sliderLeft.value = 0
  if (target) {
    startX.value = target.clientX
  }
}
function onMove(event: any) {
  event.preventDefault()
  if (loading.value)
    return
  let target = event
  try {
    target = event.touches[0]
  }
  catch { }
  if (dragging.value && target) {
    sliderLeft.value = target.clientX - startX.value
    if (sliderLeft.value <= 0) {
      sliderLeft.value = 0
    }
    if (sliderRef.value && sliderLeft.value >= (sliderRef.value.clientWidth - (sliadeBallRef.value.clientWidth * 1.25))) {
      sliderLeft.value = (sliderRef.value.clientWidth - (sliadeBallRef.value.clientWidth * 1.25))
    }
  }
}
function handLoadingCaptcha() {
  aniOut.value = true
  handLoading.value = true
  loadCaptcha(false)
}
function onEnd() {
  dragging.value = false
  setTimeout(() => {
    if (sliderLeft.value === 0) {
      return
    }
    loading.value = true
    emits('success', Math.floor(sliderLeft.value / scaleFactor))
    // close()
  }, 0)
}
function open(username: any, agentId: any) {
  UN.value = username || ''
  agent_id.value = agentId || ''
  emits('loading')
  sliderLeft.value = 0
  captchaUrl.value = ''
  sliderUrl.value = ''
  sliderBgUrl.value = ''
  expectedY.value = 0
  aniOut.value = false
  aniIn.value = false
  loadCaptcha(true)
  show.value = true
}
function close() {
  UN.value = ''
  show.value = false
  emits('loaded')
  sliderLeft.value = 0
  captchaUrl.value = ''
  sliderUrl.value = ''
  sliderBgUrl.value = ''
  expectedY.value = 0
  loading.value = false
  loadingPics.value = 0
}
function loadFinish() {
  loadingPics.value++
  console.error(loadingPics.value)
  if (loadingPics.value >= 2) {
    emits('loaded')

    // 4的时候表示刷新了，执行一下进入动画
    if (loadingPics.value === 4) {
      aniOut.value = false
      aniIn.value = true
      setTimeout(() => {
        aniIn.value = false
      }, 1000)
    }
  }
}

defineExpose({
  open,
  close,
  error,
  success,
})
</script>

<template>
  <div v-if="show" class="slider-verify" :class="{ loadingverify: loadingPics >= 2 }">
    <div class="verify-con" :class="[errorStatus ? 'shake' : '']">
      <div class="title">
        <div class="i-custom:dark-refresh refresh" :class="{ loading }" @click="handLoadingCaptcha" />
        <span style="flex: 1;text-align: center;font-weight: 600;">{{ t('login_page_verify') }}</span>
        <div class="i-custom:dark-close close" @click="close" />
      </div>

      <div class="pic" :class="{ aniOut, aniIn }">
        <div
          :style="{ top: `${expectedY}px`, left: `${sliderLeft}px`, transform: `scale(${handLoading ? 0 : 1})` }"
          class="sliderUrl"
        >
          <img
            :src="sliderUrl"
            style="width: 90%;height: 90%;position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);z-index: 9;" alt="" @load="loadFinish"
          >
        </div>

        <img
          v-if="captchaUrl" key="captchaUrl" :src="captchaUrl" class="captchaUrl" alt=""
          @load="loadFinish"
        >

        <div v-show="errorStatus || successStatus" class="tip-box" :class="[`tip-${tipStatus}`]">
          {{ tipText }}
        </div>
      </div>

      <div ref="sliderRef" class="slider" :class="{ aniOut, aniIn }">
        <div
          v-show="sliderLeft" class="left-box"
          :class="[errorStatus ? 'left-error-box' : '', successStatus ? 'left-success-box' : '']"
          :style="{ width: `${sliderLeft + 12}px` }" @touchmove.prevent
        />
        <div
          ref="sliadeBallRef" class="slider-box" :class="[sliderLeft ? 'move-box' : '', errorStatus ? 'error-box' : '', successStatus ? 'success-box' : '']" :style="{ left: `${sliderLeft}px`, transform: `translateX(${sliderLeft ? 8 : 0}px)` }"
          @mousedown.stop="onStart" @touchstart.stop="onStart" @touchmove.stop="onMove" @mousemove.stop="onMove"
          @touchend.stop="onEnd"
          @mouseup.stop="onEnd"
        >
          <div class="i-custom:dark-right right" />
        </div>
        <div v-show="!sliderLeft" class="slider-tip" @touchmove.prevent>
          {{ t('login_page_verify_tip') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes shake {
  0% {
    transform: translate(0, 0);
  }

  5% {
    transform: translate(-4px, 0);
  }

  10% {
    transform: translate(4px, 0);
  }

  15% {
    transform: translate(-4px, 0);
  }

  20% {
    transform: translate(4px, 0);
  }

  25% {
    transform: translate(-4px, 0);
  }

  30% {
    transform: translate(4px, 0);
  }

  35% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(0, 0);
  }
}

@keyframes out {
  0% {
    transform: scale(1) translateX(0);
  }

  75% {
    transform: scale(0.9) translateX(0);
  }

  100% {
    transform: scale(0.9) translateX(-375px);
  }
}

@keyframes in {
  0% {
    transform: scale(0.9) translateX(375px);
  }

  80% {
    transform: scale(0.9) translateX(0);
  }

  100% {
    transform: scale(1) translateX(0);
  }
}

@keyframes roll {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(3600deg);
  }
}

.shake {
  animation: shake 1s linear forwards;
}

.aniOut {
  animation: out 1200ms ease forwards;
}

.aniIn {
  animation: in 600ms ease forwards;
}

.slider-verify {
  background-color: rgba(0, 0, 0, 0.9);
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0);
  overscroll-behavior: none;
  pointer-events: visible;
  touch-action: pan-x;

  .verify-con {
    width: 335px;
    height: 242px;
    background: var(--bg-color-2);
    box-shadow: 0.5px 0.5px 1px 0px #2e296b inset;
    padding: 0 10px;
    overflow: hidden;

    .title {
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--txt-color-4);
      font-size: 14px;

      .refresh {
        width: 20px;
        height: 20px;
        overscroll-behavior: none;
        pointer-events: auto;
      }

      .loading {
        animation: roll 10s linear infinite;
        transform-origin: center center;
      }

      .close {
        width: 20px;
        height: 20px;
        overscroll-behavior: none;
        pointer-events: auto;
      }
    }

    .pic {
      width: 100%;
      height: 140px;
      position: relative;
      box-shadow: 0.5px 0.5px 1px 0px #2e296b inset;
      transform: scale(1) translateX(0);

      .tip-box {
        width: 100%;
        height: 24px;
        padding: 0 10px;
        line-height: 24px;
        color: var(--txt-color-b);
        font-size: 12px;
        font-weight: 400;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 9;
      }

      .tip-success {
        background-color: #1db98a;
      }

      .tip-error {
        background-color: #fe4a5e;
      }

      .captchaUrl {
        width: 100%;
        height: 100%;
      }

      .sliderUrl {
        position: absolute;
        top: 50%;
        width: 50px;
        height: 50px;
        transition: transform ease 0.3s;
        // transform: translateY(0.5px) translateX(-0.5px);
      }
    }

    .slider {
      width: 100%;
      height: 36px;
      margin-top: 10px;
      background: var(--bg-color-3);
      box-shadow: 0.5px 0.5px 1px 0px var(--border-color) inset;
      position: relative;
      transform: scale(1) translateX(0);

      .left-box {
        height: 36px;
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid #423f6d;
        border-right: none;
        background: var(--input-bg-color);
        box-shadow: 0.5px 0.5px 1px 0px var(--border-color) inset;
      }

      .left-error-box {
        border: 1px solid #fe4a5e;
      }

      .left-success-box {
        border: 1px solid #1db98a;
      }

      .slider-tip {
        position: absolute;
        white-space: nowrap;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        letter-spacing: 0px;
        color: var(--txt-color-14);
        text-align: center;
      }

      .slider-box {
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        background: var(---, #131232);
        top: -3px;
        border: 1px solid #2e296b;
        overscroll-behavior: none;
        pointer-events: auto;
        touch-action: pan-x;

        .right {
          width: 16px;
          height: 16px;
        }
      }

      .move-box {
        // background: #2A6CFE;
      }

      .error-box {
        background: red;
        border: 1px solid red;
      }

      .success-box {
        background: green;
        border: 1px solid green;
      }
    }
  }
}

.loadingverify {
  transform: scale(1);
}

:root[theme='light'] {
  .slider-verify {
    .verify-con {
      .slider {
        box-shadow: 0.5px 0.5px 1px 0px #e8e8ff inset;

        .left-box {
          border: 1px solid var(---, #ddddff);
        }

        .slider-box {
          background: var(---, #b8b8cd);
          border: 1px solid #e8e8ff;
        }
      }
    }
  }
}
</style>
