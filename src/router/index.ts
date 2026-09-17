import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MangaPage from '@/views/MangaPage.vue'
import ReadingPage from '@/views/ReadingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/manga/:id',
      name: 'manga',
      component: MangaPage,
    },

    {
      path: '/manga/:id/chapter/:chapter',
      name: 'reading',
      component: ReadingPage,
    },
  ],
})

export default router