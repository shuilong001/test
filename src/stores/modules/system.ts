import { defineStore } from 'pinia'
import { useAppSetting } from '@/web-base/hooks/useAppSetting'

export const useSystemStore = defineStore('system', {
  state: () => ({
    theme: document.documentElement.getAttribute('theme') || '', // 系统主题
    isWebSocketReady: false, // WebSocket 客户端是否已初始化完成
  }),
  actions: {

    setWebSocketReady(v: boolean) {
      this.isWebSocketReady = v
    },
    setTheme(v: string) {
      localStorage.setItem('theme', v)
      CHANGE_THEME(GET_THEME(v))
      // document.documentElement.setAttribute('theme', GET_THEME(v));
      this.theme = v
    },
    async initWebSocket() {
      if (!this.isWebSocketReady) {
        const { initPKwebsocket } = useAppSetting()
        await initPKwebsocket()
        this.isWebSocketReady = true
      }
    },
  },
  getters: {

  },
})

export default useSystemStore
