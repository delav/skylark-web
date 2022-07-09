import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

import '@/styles/index.scss'

import store from './store'

import '@/icons'
import SvgIcon from '@/components/SvgIcon'

import '@/permission'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.component('svg-icon', SvgIcon)
app.mount('#app')
