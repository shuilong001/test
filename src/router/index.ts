import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { EnhancedRouteLocation } from './types'
import { useRouteCacheStore, useUserStore } from '@/stores'

import setPageTitle from '@/utils/set-page-title'

NProgress.configure({ showSpinner: false, parent: '#app' })

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
  scrollBehavior() {
    return { left: 0, top: 1 }
  },
})

// This will update routes at runtime without reloading the page
if (import.meta.hot)
  handleHotUpdate(router)

router.beforeEach(async (to: EnhancedRouteLocation) => {
  NProgress.start()

  const routeCacheStore = useRouteCacheStore()
  const userStore = useUserStore()

  // Route cache
  routeCacheStore.addRoute(to)

  // Set page title
  setPageTitle(to.meta.title)
  if (to.meta.requireAuth) {
    if (!userStore.isLogin) {
      return {
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
