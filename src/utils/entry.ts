import 'virtual:uno.css'
import '@/styles/app.scss'
import '@/styles/var.scss'
// Vant 桌面端适配
import '@vant/touch-emulator'
/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

import { MessageMapRegister } from '@/web-base/netBase/MessageMapRegister'
import router from '@/router'
import { createHead } from '@unhead/vue/client'
import pinia from '@/stores'
import { i18n } from '@/utils/i18n'
import { Lazyload } from 'vant'
import { VueNiceModalPluginForVue3 } from 'vue-nice-modal'
import { EventManager } from '@/web-base/utils/set-event'
import Fastclick from 'fastclick'

export function initApp(app) {
  MessageMapRegister.register()
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
  app.use(VueNiceModalPluginForVue3)
  // 初始化事件管理器
  const eventManager = new EventManager()
  eventManager.init()

  Fastclick(document.body, {
    excludeNode: 'input, textarea, select',
  })
}
