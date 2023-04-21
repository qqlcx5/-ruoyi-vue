//引入ant design vue的css 白色和黑色的less文件都要引入
import light from './light.css?inline'
import dark from './dark.css?inline'
import { changeTheme, changeCss } from './changeAntdStyle'

// 切换黑暗模式或者白天模式
export const DarkMode = (isDark: boolean) => {
  if (isDark) {
    changeTheme(dark)
    changeCss('--page-bg-color', '#141414')
    changeCss('--head-bg-color', 'rgba(0, 0, 0, 0.5)')
    changeCss('--line-color', '#2e2e2e')
    changeCss('--content-bg-color', 'rgb(255 255 255 / 4%)')
    changeCss('--text-color', 'rgba(255, 255, 255, 0.85)')
  } else {
    changeTheme(light)
    changeCss('--page-bg-color', 'white')
    changeCss('--head-bg-color', 'rgba(255, 255, 255, 0.7)')
    changeCss('--line-color', '#e8e8e8')
    changeCss('--content-bg-color', '#f0f2f5')
    changeCss('--text-color', 'rgba(0, 0, 0, 0.85)')
  }
}
