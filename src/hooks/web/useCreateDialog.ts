import { assign, invoke } from 'lodash-es'
import { Component, createApp, createVNode, mergeProps, reactive } from 'vue'
import { setupBoot } from '@/config/setupBoot'

export const useCreateDialog = () => {
  /**
   * 打开自定义弹窗
   * @param component 组件
   * @param dialogProps 弹窗组件Dialog参数
   * @param componentProps 组件参数
   * @returns
   */
  const openDialog = <P = Recordable>(component: Component, props?: P) => {
    const propsAssemble = reactive({ modelValue: true })
    if (props) {
      assign(propsAssemble, props)
    }

    const root = document.createElement('div')
    const parent = document.getElementById('app') ?? document.body
    parent.appendChild(root)
    const app = createApp({
      setup: () => {
        return () =>
          createVNode(
            component,
            mergeProps(propsAssemble, {
              'onUpdate:modelValue': (bool: boolean) => {
                propsAssemble.modelValue = bool
                /* 关闭时触发关闭回调 */
                if (!bool && props) {
                  invoke(props, 'onClose')
                }
              },
              onClose: () => {
                app.unmount()
                parent.removeChild(root)
              }
            })
          )
      }
    })

    setupBoot(app).then(() => {
      app.mount(root)
    })

    const close = () => {
      propsAssemble.modelValue = false
    }

    return {
      close
    }
  }

  return {
    openDialog
  }
}
