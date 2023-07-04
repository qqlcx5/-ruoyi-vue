<script setup lang="ts">
import { PropType, onMounted, computed } from 'vue'
import { propTypes } from '@/utils/propTypes'

import { useForm } from '@/hooks/web/useForm'
import { findIndex } from '@/utils'
import { cloneDeep } from 'lodash-es'
import { FormSchema } from '@/types/form'

const { t } = useI18n()

const slots = useSlots()

const props = defineProps({
  // 生成Form的布局结构数组
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  // 是否需要栅格布局
  isCol: propTypes.bool.def(false),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
  // 操作按钮风格位置
  layout: propTypes.string.validate((v: string) => ['inline', 'bottom'].includes(v)).def('inline'),
  // 底部按钮的对齐方式
  buttomPosition: propTypes.string
    .validate((v: string) => ['left', 'center', 'right'].includes(v))
    .def('center'),
  showSearch: propTypes.bool.def(true),
  showReset: propTypes.bool.def(true),
  // 是否显示伸缩
  expand: propTypes.bool.def(true),
  // 伸缩的界限字段
  expandField: propTypes.string.def(''),
  inline: propTypes.bool.def(true),
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  }
})

const emit = defineEmits(['search', 'reset'])

const visible = ref(false)
const formBoxRef = ref()
const defaultExpanField = ref('')

const getExpanField = computed(() => props.expandField || defaultExpanField.value)
const showExpandBtn = computed(() => getExpanField.value && props.expand)

onMounted(() => {
  setDefaultShowOneLint()
})

/** 设置默认值显示一行，其他收起 */
const setDefaultShowOneLint = () => {
  const formItems = formBoxRef.value.querySelector('form')?.querySelectorAll('.el-form-item')
  const form = formBoxRef.value.querySelector('form')
  const lastFormItemIndex = formItems.length - 1
  const lastFormItemWidth =
    formItems[lastFormItemIndex].offsetWidth +
    Number(window.getComputedStyle(formItems[lastFormItemIndex]).marginRight?.replaceAll('px', ''))
  let itemsWidth = 0
  const getItemWidth = (item) => {
    const styles = window.getComputedStyle(item).marginRight
    const itemMargin = Number(styles.replaceAll('px', '')) || 0
    const itemWidth = item.offsetWidth
    return itemMargin + itemWidth
  }
  for (let i = 0; i < formItems.length; i++) {
    const item = formItems[i]
    const index = i
    const formWidth = form.offsetWidth
    const itemWidth = getItemWidth(item)
    itemsWidth += itemWidth
    if (lastFormItemIndex !== index) {
      // 判断一行是否还能放下下一个查询组件
      if (formWidth - itemsWidth < getItemWidth(formItems[index + 1]) + 5) {
        // 判断一行是否还能放下查询重置按钮，不能就把当前及之后的选项收起
        if (
          props.layout === 'inline' &&
          formWidth - itemsWidth < lastFormItemWidth + 90 &&
          index !== 0
        ) {
          defaultExpanField.value = props.schema[index - 1].field
          break
        }
        defaultExpanField.value = props.schema[index].field
        break
      }
    }
  }
}

const newSchema = computed(() => {
  let schema: FormSchema[] = cloneDeep(props.schema)

  if (props.expand && getExpanField.value && !unref(visible)) {
    const index = findIndex(schema, (v: FormSchema) => v.field === getExpanField.value)
    if (index > -1) {
      const length = schema.length
      schema.splice(index + 1, length)
    }
  }
  if (props.layout === 'inline') {
    schema = schema.concat([
      {
        field: 'operate',
        formItemProps: {
          labelWidth: '0px'
        }
      }
    ])
  }

  return schema
})

const { register, elFormRef, methods } = useForm({
  model: props.model || {}
})

const search = async () => {
  await unref(elFormRef)?.validate(async (isValid) => {
    if (isValid) {
      const { getFormData } = methods
      const model = await getFormData()
      emit('search', model)
    }
  })
}

const reset = async () => {
  unref(elFormRef)?.resetFields()
  const { getFormData } = methods
  const model = await getFormData()
  emit('reset', model)
}

const bottonButtonStyle = computed(() => {
  return {
    textAlign: props.buttomPosition as unknown as 'left' | 'center' | 'right'
  }
})

const setVisible = () => {
  unref(elFormRef)?.resetFields()
  visible.value = !unref(visible)
}
</script>

<template>
  <div ref="formBoxRef">
    <Form
      :is-custom="false"
      :label-width="labelWidth"
      hide-required-asterisk
      :inline="inline"
      :is-col="isCol"
      :schema="newSchema"
      @register="register"
    >
      <template #operate>
        <div v-if="layout === 'inline'">
          <ElButton v-if="showSearch" type="primary" @click="search">
            {{ t('common.query') }}
          </ElButton>
          <ElButton v-if="showReset" @click="reset">
            {{ t('common.reset') }}
          </ElButton>
          <ElButton v-if="showExpandBtn" text @click="setVisible">
            {{ t(visible ? 'common.shrink' : 'common.expand') }}
            <Icon :icon="visible ? 'ep:arrow-up' : 'ep:arrow-down'" />
          </ElButton>
        </div>
      </template>
      <template v-for="(_slot, name) in slots" #[name]="data"
        ><slot :name="name" v-bind="data" :model="data"></slot
      ></template>
    </Form>

    <template v-if="layout === 'bottom'">
      <div :style="bottonButtonStyle">
        <ElButton v-if="showSearch" type="primary" @click="search">
          {{ t('common.query') }}
        </ElButton>
        <ElButton v-if="showReset" @click="reset">
          <Icon icon="ep:refresh-right" class="mr-5px" />
          {{ t('common.reset') }}
        </ElButton>
        <ElButton v-if="showExpandBtn" text @click="setVisible">
          {{ t(visible ? 'common.shrink' : 'common.expand') }}
          <Icon :icon="visible ? 'ep:arrow-up' : 'ep:arrow-down'" />
        </ElButton>
      </div>
    </template>
  </div>
</template>
