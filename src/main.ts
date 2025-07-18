import { createApp } from 'vue'
import App from '@/App.vue'
import { initApp } from '@/utils/entry'

const app = createApp(App)

initApp(app)

app.mount('#app')
