import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const activeMenu = ref('casino')
  const mobileMenuOpen = ref(false)
  const sidebarCollapsed = ref(false)
  return {
    activeMenu,
    sidebarCollapsed,
    mobileMenuOpen,
  }
}, {
  persist: {
    storage: localStorage,
    key: 'app',
  },
})
