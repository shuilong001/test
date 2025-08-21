import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Blog1 from '../views/Blog1.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blog1',
    name: 'Blog1',
    component: Blog1
  },
  // 为后续blog路由预留位置
  // {
  //   path: '/blog2',
  //   name: 'Blog2',
  //   component: () => import('../views/Blog2.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
