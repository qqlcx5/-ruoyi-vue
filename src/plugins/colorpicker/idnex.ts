import type { App } from 'vue'
import ColorPicker from 'colorpicker-v3' // 注册组件
import 'colorpicker-v3/style.css'

export const setupColorPicker = async (app: App<Element>) => {
  app.use(ColorPicker)
}
