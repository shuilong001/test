import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import { i18n } from '@/utils/i18n'
import { initApp } from '@/utils/init-app'
import { Lazyload } from 'vant'

initApp()
const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
app.use(pinia)
app.use(i18n)
// 注册时可以配置额外的选项
app.use(Lazyload, {
  lazyComponent: true,
  attempt: 1,
  observer: true,
})

// 在 Pinia 初始化后动态导入 set-event
import('@/web-base/utils/set-event')

app.mount('#app')
