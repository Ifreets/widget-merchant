import { waterfall } from 'async'
import { createApp } from 'vue'
import App from '@/App.vue'
import FloatingVue from 'floating-vue'
import { loadEnv, loadApp, loadRouter } from '@/service/core'
import type { CbError } from '@/service/interface'
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import './assets/css/index.scss'
import '@/assets/css/tailwind.css'
import 'floating-vue/dist/style.css'

// [optional] kích hoạt chế độ debug
WIDGET.debugOn()

const APP = createApp(App)

// * Sử dụng vue tootltip
APP.use(FloatingVue)

waterfall(
  [
    (cb: CbError) => loadEnv(cb),
    // nạp secret_key của widget
    (cb: CbError) => {
      WIDGET.load($env.secret_key)
      cb()
    },
    (cb: CbError) => loadRouter(APP, cb),
    (cb: CbError) => loadApp(APP, cb),
  ],
  () => APP.mount('#app')
)
