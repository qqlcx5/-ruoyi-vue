// 引入windi css
import '@/plugins/windi.css'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// iconfont
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'

// 引入 vxe-table
import { setupVxeTable } from '@/plugins/vxeTable'

// 引入全局样式
import '@/styles/index.scss'

// 引入动画
import '@/plugins/animate.css'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'

import { isDevMode } from '@/utils/env'

import '@/components/bpmnProcessDesigner/package/theme/index.scss'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

import 'highlight.js/styles/github.css' //导入代码高亮样式  新版

import Logger from '@/utils/Logger'
import { setupBoot } from '@/config/setupBoot'

//先全局引入吧有空再改 antdV
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.variable.min.css'

const progressEl = document.getElementById('progress')
if (progressEl) progressEl.setAttribute('value', '100')
const appLoadingLogoEl = document.querySelector('.app-loading-logo') as HTMLElement
if (appLoadingLogoEl) appLoadingLogoEl.style.left = '448px'

// 本地开发模式 全局引入 element-plus 样式，加快第一次进入速度
if (isDevMode() == true) {
  import('element-plus/dist/index.css')
}

// 字符串去除空格
String.prototype['trimAll'] = function () {
  return this.replace(/\s+/g, '')
}

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  setupVxeTable(app)

  await setupBoot(app)

  app.use(Antd).mount('#app')
}

setupAll()

Logger.prettyPrimary(`欢迎使用`, import.meta.env.VITE_APP_TITLE)
