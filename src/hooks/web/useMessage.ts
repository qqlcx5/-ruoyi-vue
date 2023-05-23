import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useI18n } from './useI18n'
import { h } from 'vue'
import { ElMessageBoxOptions } from 'element-plus/es/components/message-box/src/message-box.type'
export const useMessage = () => {
  const { t } = useI18n()
  return {
    // 消息提示
    info(content: string, options?) {
      ElMessage({
        type: 'info',
        message: content,
        customClass: `wg-message-plain`,
        ...options
      })
    },
    // 错误消息
    error(content: string, options?) {
      ElMessage({
        type: 'error',
        message: content,
        customClass: `wg-message-plain`,
        ...options
      })
    },
    // 成功消息
    success(content: string, options?) {
      ElMessage({
        type: 'success',
        message: content,
        customClass: `wg-message-plain`,
        ...options
      })
    },
    // 警告消息
    warning(content: string, options?) {
      ElMessage({
        type: 'warning',
        message: content,
        customClass: `wg-message-plain`,
        ...options
      })
    },
    // 消息提示
    infoSolid(content: string, options?) {
      ElMessage({
        type: 'info',
        message: content,
        customClass: `wg-message`,
        ...options
      })
    },
    // 错误消息
    errorSolid(content: string, options?) {
      ElMessage({
        type: 'error',
        message: content,
        customClass: `wg-message`,
        ...options
      })
    },
    // 成功消息
    successSolid(content: string, options?) {
      ElMessage({
        type: 'success',
        message: content,
        customClass: `wg-message`,
        ...options
      })
    },
    // 警告消息
    warningSolid(content: string, options?) {
      ElMessage({
        type: 'warning',
        message: content,
        customClass: `wg-message`,
        ...options
      })
    },
    // 弹出提示
    alert(content: string) {
      ElMessageBox.alert(content, t('common.confirmTitle'))
    },
    // 错误提示
    alertError(content: string) {
      ElMessageBox.alert(content, t('common.confirmTitle'), { type: 'error' })
    },
    // 成功提示
    alertSuccess(content: string) {
      ElMessageBox.alert(content, t('common.confirmTitle'), { type: 'success' })
    },
    // 警告提示
    alertWarning(content: string) {
      ElMessageBox.alert(content, t('common.confirmTitle'), { type: 'warning' })
    },
    // 通知提示
    notify(content: string) {
      ElNotification.info(content)
    },
    // 错误通知
    notifyError(content: string) {
      ElNotification.error(content)
    },
    // 成功通知
    notifySuccess(content: string) {
      ElNotification.success(content)
    },
    // 警告通知
    notifyWarning(content: string) {
      ElNotification.warning(content)
    },
    // 确认窗体
    confirm(content: string | VNode | (() => VNode), tip?: string) {
      return ElMessageBox.confirm(content, tip ? tip : t('common.confirmTitle'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
        lockScroll: false,
        autofocus: false
      })
    },
    // 自定义确认窗体
    wgConfirm(
      content: string | VNode | (() => VNode),
      tip?: string,
      options?: ElMessageBoxOptions
    ) {
      return ElMessageBox.confirm(
        h('div', { class: 'flex' }, [
          tip
            ? h('i', {
                class: 'iconfont icon-Warning',
                style: { marginRight: '16px', color: '#FAAD14', fontSize: '24px', lineHeight: 1 }
              })
            : '',
          h('div', [
            tip
              ? h(
                  'div',
                  { class: 'font-bold', style: { marginBottom: '14px', fontSize: '16px' } },
                  tip
                )
              : '',
            h('div', { class: 'text-confirm-gray' }, h('span', content))
          ])
        ]),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          lockScroll: false,
          showClose: false,
          customClass: 'wg-message-confirm',
          autofocus: false,
          ...options
        }
      )
    },
    // 自定义去操作窗体
    wgOperateConfirm(
      content: string | VNode | (() => VNode),
      tip?: string,
      options?: ElMessageBoxOptions
    ) {
      return ElMessageBox.confirm(
        h('div', { class: '' }, [
          tip
            ? h(
                'div',
                { class: 'font-bold', style: { marginBottom: '14px', fontSize: '16px' } },
                tip
              )
            : '',
          h('div', { class: 'flex' }, [
            h('i', {
              class: 'iconfont icon-Warning',
              style: { marginRight: '16px', color: '#FAAD14', fontSize: '24px', lineHeight: 1 }
            }),
            h('span', { class: 'font-bold', style: { fontSize: '14px' } }, content)
          ])
        ]),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          lockScroll: false,
          showClose: false,
          customClass: 'wg-message-operate-confirm',
          autofocus: false,
          ...options
        }
      )
    },
    // 删除窗体
    delConfirm(content?: string | VNode | (() => VNode), tip?: string) {
      return ElMessageBox.confirm(
        content ? content : t('common.delMessage'),
        tip ? tip : t('common.confirmTitle'),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
          lockScroll: false,
          autofocus: false
        }
      )
    },
    // 导出窗体
    exportConfirm(content?: string, tip?: string) {
      return ElMessageBox.confirm(
        content ? content : t('common.exportMessage'),
        tip ? tip : t('common.confirmTitle'),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
          lockScroll: false,
          autofocus: false
        }
      )
    },
    // 提交内容
    prompt(content: string, tip: string) {
      return ElMessageBox.prompt(content, tip, {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
        lockScroll: false,
        autofocus: false
      })
    }
  }
}
