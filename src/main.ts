import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import { i18n } from '@/utils/i18n'
import { initApp } from '@/utils/init-app'

initApp()
const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
app.use(pinia)
app.use(i18n)

// 在 Pinia 初始化后动态导入 set-event
// import('@/web-base/utils/set-event')

app.mount('#app')
