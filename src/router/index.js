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
  {
    path: '/blog3',
    name: 'Blog3',
    component: () => import('../views/Blog3.vue')
  },
  
  {
    path: '/blog4',
    name: 'Blog4',
    component: () => import('../views/Blog4.vue')
  },
  
  {
    path: '/blog5',
    name: 'Blog5',
    component: () => import('../views/Blog5.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
