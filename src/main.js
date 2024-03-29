import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

import '@/styles/index.scss'

import store from './store'
import i18n from './locales/index'

import * as echarts from 'echarts'

import '@/icons/iconsvg'
import SvgIcon from '@/components/SvgIcon'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/icons/iconfont/iconfont.css'

import '@/permission'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
app.use(ElementPlus)
app.component('svg-icon', SvgIcon)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$echarts = echarts
app.mount('#app')
