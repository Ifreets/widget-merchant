import Home from '@/views/Home.vue'
import Order from '@/views/Order.vue'
import Oauth from '@/views/Oauth.vue'
export const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Order },
  { path: '/oauth', component: Oauth },
]
