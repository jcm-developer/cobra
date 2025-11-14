import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import EditorVuelo from '@/views/EditorVuelo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/crear',
      name: 'crear',
      component: EditorVuelo,
    },
  ],
})

export default router
