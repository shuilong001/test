import { createApp } from 'vue'
import App from '@/App.vue'
import { initApp } from '@/utils/init-app'

const app = createApp(App)

initApp(app)

// 在 Pinia 初始化后动态导入 set-event
import('@/web-base/utils/set-event')

app.mount('#app')
