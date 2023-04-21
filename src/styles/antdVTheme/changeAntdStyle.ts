// 切换css
export const changeTheme = (theme: string) => {
  const head = document.head
  document.getElementById('theme')?.remove()
  const styleDom = document.createElement('style')
  styleDom.id = 'theme'
  styleDom.innerHTML = theme
  head.appendChild(styleDom)
}

// 改变css变量
export const changeCss = (css: string, value: string) => {
  const body = document.body.style
  body.setProperty(css, value)
}
