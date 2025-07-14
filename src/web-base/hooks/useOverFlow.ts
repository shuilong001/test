import router from '@/router'
/** 允许html滚动的页面路由 name */
export const whiteList = ['home', 'activity', 'categoryPage', 'demo1']

const isFullScreen = ref(false)

function useFooterBox() {
  const footerBox = document.createElement('div')
  footerBox.style.height = '1px'
  footerBox.style.width = '100%'

  function addFooterBox() {
    if (document.body.contains(footerBox as unknown as Node))
      return
    document.body.appendChild(footerBox as unknown as Node)
    window.scrollTo(0, 1)
  }

  function removeFooterBox() {
    document.body.contains(footerBox as unknown as Node) && document.body.removeChild(footerBox as unknown as Node)
    window.scrollTo(0, 0)
  }

  return {
    addFooterBox,
    removeFooterBox,
  }
}

function isHtmlOverflow(routeName: string) {
  // if (window.matchMedia("(display-mode: standalone)").matches) {
  //     return
  // }

  const { addFooterBox, removeFooterBox } = useFooterBox()

  const appEl = document.getElementById('app')
  if (whiteList.includes(routeName)) {
    document.documentElement.style.setProperty('--body-overflow', `auto`)
    appEl && (appEl.style.height = 'auto')
    appEl && (appEl.className = '')
  }
  else {
    document.documentElement.style.setProperty('--body-overflow', `hidden`)
    appEl && (appEl.style.height = 'calc(var(--full-height) - env(safe-area-inset-top))')
    appEl && (appEl.className = 'overflow-app')
  }

  if (!whiteList.includes(routeName)) {
    if (isFullScreen.value) {
      document.documentElement.style.setProperty('--body-overflow', `auto`)
      addFooterBox()
    }
    else {
      document.documentElement.style.setProperty('--body-overflow', `hidden`)
      removeFooterBox()
    }
  }
}

export function useOverFlow() {
  window.addEventListener('resize', () => {
    if (document.documentElement.clientHeight < window.innerHeight) {
      isFullScreen.value = true
    }
    else {
      isFullScreen.value = false
    }
  })

  watch(
    () => router.currentRoute.value.name,
    (name: string) => {
      isHtmlOverflow(name)
    },
    {
      immediate: true,
    },
  )
  onUnmounted(() => {
    window.removeEventListener('resize', () => {})
  })
}
