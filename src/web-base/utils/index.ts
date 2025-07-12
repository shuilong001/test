import router from '@/router'
import { usePageStore } from '@/stores/modules/page'

export function historyBack() {
  const pageStore = usePageStore()
  if (window.history.state.back) {
    router.back()
  }
  else {
    router.replace(pageStore.homePath)
  }
}
