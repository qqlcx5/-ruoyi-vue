import type { App } from 'vue'
import { createPopper } from '@popperjs/core'

let popperInstance: Nullable<Recordable> = null
let content: Nullable<HTMLElement>
let parent: Nullable<Element> = null

export function showTips(app: App<Element>) {
  app.directive('showTips', (el) => {
    el.addEventListener('mouseenter', () => {
      if (!parent) {
        parent = document.querySelector('.tree-left')
      }

      const elWidth = el.offsetWidth
      const elText = el.innerText
      const span = document.createElement('span')
      span.innerText = elText
      document.body.appendChild(span)
      const spanWidth = span.offsetWidth

      if (spanWidth > elWidth) {
        const arrow = renderArrow()
        content = renderContent(el)
        content.appendChild(arrow)
        parent?.appendChild(content)
        document.body.removeChild(span)

        popperInstance = createPopper(el, content, {
          placement: 'top'
        })
      }
    })

    el.addEventListener('mouseleave', () => {
      popperInstance && popperInstance.destroy()
      if (content) {
        parent?.removeChild(content)
        content = null
      }
    })
  })
}

/** 提示的箭头图标 */
const renderArrow = () => {
  const arrow = document.createElement('div')
  arrow.style.left = '50%'
  arrow.style.transform = 'translate(-50%)'
  arrow.className = 'el-popper__arrow'
  return arrow
}

/** 内容标签 */
const renderContent = (el) => {
  const content = document.createElement('div')
  content.innerHTML = el.innerText
  content.className = 'el-popper is-dark'
  return content
}
