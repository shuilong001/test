import { defineStore } from 'pinia'
/**
 * 页面信息
 * @methods setUserInfos 设置用户信息
 */
interface PageState {
  homePath: Ref<string> // 首页路径
  settings: Ref<any> // 设置
  setSettings: (value: any) => void
}

export const usePageStore = defineStore('page-store', (): PageState => {
  const homePath = ref('/')
  const settings = ref(null)

  const setSettings = (value: any) => {
    settings.value = value
  }

  return {
    homePath,
    settings,
    setSettings,
  }
}, {
  persist: {
    storage: sessionStorage,
    key: 'page-store',
    pick: ['settings'],
  },
})
export default usePageStore
