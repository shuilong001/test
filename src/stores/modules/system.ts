import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', {
  state: () => ({
    isWsConnected: false, // ws是否连接
    isLoggedIn: false, // 是否已登录
    theme: document.documentElement.getAttribute('theme') || '', // 系统主题
    wsLoginStatus: false, // ws已连接且已登录
  }),
  actions: {
    setWsConnected(v: boolean) {
      this.isWsConnected = v
    },
    setLoggedIn(v: boolean) {
      this.isLoggedIn = v
      this.setWsLoginStatus(v)
    },
    setWsLoginStatus(v: boolean) {
      this.wsLoginStatus = v
    },
    setTheme(v: string) {
      localStorage.setItem('theme', v)
      CHANGE_THEME(GET_THEME(v))
      // document.documentElement.setAttribute('theme', GET_THEME(v));
      this.theme = v
    },
  },
  getters: {
    isServerLoggedIn(state) {
      // 是否已经同步服务器登录状态
      return state.isLoggedIn
    },
    isWsLogin(state) {
      return state.wsLoginStatus
    },
    getTheme(state) {
      return GET_THEME(state.theme)
    },
  },
})

export default useSystemStore
