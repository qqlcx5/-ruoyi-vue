import type { App } from 'vue'
import { hasRole } from './permission/hasRole'
import { hasPermi } from './permission/hasPermi'
import { showTips } from './showTips'

/**
 * 导出指令：v-xxx
 * @methods hasRole 用户权限，用法: v-hasRole
 * @methods hasPermi 按钮权限，用法: v-hasPermi
 * @methods showTips 溢出悬浮显示，用法: v-showTips
 */
export const setupDirectives = (app: App<Element>) => {
  hasRole(app)
  hasPermi(app)
  showTips(app)
}
