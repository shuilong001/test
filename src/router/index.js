import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/blog1',
    name: 'Blog1',
    component: () => import('../views/Blog1.vue')
  },
  {
    path: '/blog2',
    name: 'Blog2',
    component: () => import('../views/Blog2.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
