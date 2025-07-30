import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const activeMenu = ref('casino')
  const sidebarCollapsed = ref(false)
  return {
    activeMenu,
    sidebarCollapsed,
  }
}, {
  persist: {
    storage: localStorage,
    key: 'app',
  },
})
