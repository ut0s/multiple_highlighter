import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '~pages'
import '../assets/base.scss'
import App from './app.vue'
import './index.scss'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.path === '/') return '/sidepanel'
})

createApp(App).use(router).use(FloatingVue, {
  themes: {
    'tooltip': {
      placement: 'bottom',
      auto_hide: true,
      delay: {
        show: 750,
        hide: 0
      },
    },
  },
}).mount('#app')
