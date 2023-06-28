// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'
// 引入状态管理
import { setupStore } from '@/store'
// 全局组件
import { setupGlobCom } from '@/components'
// 引入 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'
// 引入 form-create
import { setupFormCreate } from '@/plugins/formCreate'
// 路由
import router, { setupRouter } from '@/router'
// 权限
import { setupAuth } from '@/directives'
import { setupColorPicker } from '@/plugins/colorpicker/idnex'
import hljs from 'highlight.js' //导入代码高亮文件
import { MyPD } from '@/components/bpmnProcessDesigner/package/index.js'
import { App } from 'vue'
//先全局引入吧有空再改 antdV

export const setupBoot = async (app: App<Element>) => {
  //自定义一个代码高亮指令
  app.directive('highlight', function (el) {
    const blocks = el.querySelectorAll('code')
    blocks.forEach((block: any) => {
      hljs.highlightElement(block)
    })
  })

  await setupI18n(app)

  MyPD(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupFormCreate(app)

  setupRouter(app)

  setupAuth(app)

  await setupColorPicker(app)

  await router.isReady()
}
