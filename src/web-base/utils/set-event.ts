import { useSystemStore } from '@/stores/modules/system'
import { isRunningAsPWA } from '@/utils/helper'
import eventBus from '@/web-base/socket/eventBus'
import PKwebsocket from '@/web-base/socket/Ws'

// 判断是安卓
function isAndroid(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()
  return userAgent.includes('android')
}

let lastTouchEnd = 0 // 更新手指弹起的时间

document.addEventListener('touchstart', (event) => {
  // 多根手指同时按下屏幕，禁止默认行为
  if (event.touches.length > 1) {
    event.preventDefault()
  }
}, false)

document.addEventListener(
  'touchend',
  (event) => {
    const now = new Date().getTime()
    if (now - lastTouchEnd <= 300) {
      // 当两次手指弹起的时间小于300毫秒，认为双击屏幕行为
      event.preventDefault()
    }
    else {
      // 否则重新手指弹起的时间
      lastTouchEnd = now
    }
  },
  { passive: false },
)

// 阻止双指放大页面
document.addEventListener('gesturestart', (event) => {
  event.preventDefault()
})
document.oncontextmenu = function (e) {
  e.preventDefault()
}
let deferredPrompt: any
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  // 显示安装按钮
})
// 在用户点击安装按钮时调用
window.addEventListener('click', () => {
  const appinstall_popup = sessionStorage.getItem('appinstall_popup')
  if (appinstall_popup || !deferredPrompt)
    return
  deferredPrompt.prompt()
  deferredPrompt.userChoice.then((_choiceResult: any) => {
    sessionStorage.setItem('appinstall_popup', '1')
    deferredPrompt = null
  })
})

document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible') {
    console.log('进入前台')
    eventBus.emit('window_visible')
    setTimeout(() => {
      if (!useSystemStore().isWsConnected) {
        PKwebsocket.instance.init()
      }
    }, 1000)

    if (isAndroid()) {
      setTimeout(() => {
        setFullHeight()
      }, 300)
    }
  }
  if (document.visibilityState === 'hidden') {
    console.log('切换到后台')
  }
})

const supportsDvh = CSS.supports('height', '100dvh')

function setProperty(type: string = 'dvh') {
  if (!supportsDvh)
    return
  document.documentElement.style.setProperty('--each-height', `1${type}`)
  document.documentElement.style.setProperty('--full-height', `100${type}`)
}

if (isRunningAsPWA())
  setProperty('vh')

// 影响正常滚动和页面抖动
// document.addEventListener('scroll', stopMove);
// const vwo = window.innerWidth
let isFocus: any = false // 输入时 键盘弹起 不重新计算高度
export function setFullHeight() {
  if (supportsDvh)
    return
  if (isRunningAsPWA())
    return

  if (isFocus)
    return
  const vwn = window.innerWidth
  const vhn = window.innerHeight
  // let vh = window.visualViewport
  //   ? window.visualViewport.height * 0.01
  //   : window.innerHeight * 0.01;

  const vh = getSpecialValue(window?.visualViewport?.height ?? 0, window?.innerHeight ?? 0) * 0.01

  // 横屏的时候不做处理
  if (vwn > vhn) {
    return false
  }
  document.documentElement.style.setProperty('--full-height', `calc(${vh}px * 100)`)
  document.documentElement.style.setProperty('--each-height', `${vh}px`)
}

function getSpecialValue(a: number, b: number) {
  if (a > 0 && b > 0) {
    // 当a和b都大于0时，返回较小的值
    return Math.min(a, b)
  }
  else if (a > 0 || b > 0) {
    // 当其中一个大于0时，返回大于0的值
    return a > 0 ? a : b
  }
  else {
    // 如果两个都不大于0，返回 0
    return 0
  }
}

// 初始加载触发
window.addEventListener('load', () => {
  setFullHeight()
})
setFullHeight()

window.addEventListener('resize', () => {
  setFullHeight()
})
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    setFullHeight()
  })
}

let focusoutTimeout: any = null // 连续输入的时候不触发focusout
document.body.addEventListener('focusin', () => {
  isFocus = true
  if (focusoutTimeout)
    clearTimeout(focusoutTimeout)

  const s = setTimeout(() => {
    clearTimeout(s)
    if (!isRunningAsPWA())
      setProperty('lvh')
  }, 600)

  // 这里处理#app是为了解决部分手机focusout之后#app向上偏移的bug
  // const appDom: any = document.querySelector('#app')
  // if (appDom) {
  //   appDom.style.overflow = 'hidden'
  // }
})
document.body.addEventListener('focusout', () => {
  const s = setTimeout(() => {
    clearTimeout(s)
    if (!isRunningAsPWA())
      setProperty('dvh')
  }, 600)
  focusoutTimeout = setTimeout(() => {
    isFocus = false
    if (focusoutTimeout)
      clearTimeout(focusoutTimeout)
    // const appDom: any = document.querySelector('#app')
    // if (appDom) {
    //   appDom.style.overflow = 'auto'
    // }

    window.scrollTo({
      top: 1,
      behavior: 'smooth',
    })
  }, 500)
  setTimeout(() => {
    setFullHeight()
  }, 300)
})
