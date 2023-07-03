<template>
  <Dialog title="一键新增单店子规则" @confirm="handleConfirm">
    <div class="directions">
      说明：一键新增单店子规则后，每家门店会生成一条子规则，门店数据范围对应适用门店。
      生成后，可对单条子规则进行编辑
    </div>
    <Form ref="formRef" :schema="columns" class="pl-9" />
  </Dialog>
</template>

<script lang="ts" setup>
import { FormSchema } from '@/types/form'
import { useColumnOptions } from '../helpers'
import { useCommonList } from '@/hooks/web/useCommonList'

const { brandOptions, areaOptions, choiceOptions } = useColumnOptions()

const emits = defineEmits<{
  (e: 'save', data: Recordable[])
}>()

const { getPostList } = useCommonList()

const columns: FormSchema[] = reactive([
  {
    field: 'dataRangPostId',
    label: '岗位数据范围',
    component: 'Cascader',
    componentProps: {
      options: getPostList(),
      collapseTags: true,
      collapseTagsTooltip: true,
      props: {
        label: 'name',
        value: 'id',
        emitPath: false,
        multiple: true
      }
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'dataRangUserId',
    label: '成员数据范围',
    component: 'Select',
    value: '',
    componentProps: {
      options: [
        {
          label: '不限',
          value: ''
        }
      ],
      disabled: true
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'brandCondition',
    label: '品牌条件',
    component: 'ButtonRadio',
    componentProps: {
      options: brandOptions,
      marginRight: '20px'
    },
    value: 0,
    colProps: {
      span: 24
    }
  },
  {
    field: 'areaCondition',
    label: '区域条件',
    component: 'ButtonRadio',
    componentProps: {
      options: areaOptions,
      marginRight: '20px'
    },
    value: 0,
    colProps: {
      span: 24
    }
  },
  {
    field: 'chooseType',
    label: '选择类型',
    component: 'ButtonRadio',
    componentProps: {
      options: choiceOptions,
      marginRight: '20px'
    },
    value: 0,
    colProps: {
      span: 24
    }
  },
  {
    field: 'isEnable',
    label: '状态',
    component: 'Switch',
    componentProps: {
      activeValue: 1,
      inactiveValue: 0
    }
  }
])

/** 确认 */
const formRef = ref()
const handleConfirm = () => {
  emits('save', formRef.value.formModel)
}
</script>

<style lang="scss" scoped>
.directions {
  margin-bottom: 32px;
}
</style>
