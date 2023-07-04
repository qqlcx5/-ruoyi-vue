<template>
  <Dialog title="添加题目" :width="978" @confirm="handleConfirm">
    <FormTable
      ref="tableRef"
      layout="internal"
      :form-options="{
        schema: allSchemas.searchSchema,
        expand: false
      }"
      :table-options="{
        columns: allSchemas.tableColumns,
        selection: true,
        showAdd: false,
        showTools: false,
        listApi: getTopicList
      }"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import { useCrudSchemas, CrudSchema } from '@/hooks/web/useCrudSchemas'
import { getTopicList } from '@/api/questionnaire/topic'
import { useOptions } from '../../topic/helpers'

const emits = defineEmits<{
  (e: 'save', params: Recordable)
}>()

const { topicTypeOptions } = useOptions()

const columns: CrudSchema[] = [
  {
    field: 'appraiseTopicId',
    label: '题目ID'
  },
  {
    field: 'appraiseTopicTitle',
    label: '题目名称',
    isSearch: true
  },
  {
    field: 'appraiseTopicType',
    label: '题目类型',
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        options: topicTypeOptions
      }
    },
    formatter: (_, __, value) => {
      return topicTypeOptions.find((item) => item.value === value)?.label
    }
  },
  {
    field: 'appraiseTypeNameList',
    label: '题目分类',
    isSearch: true,
    search: {
      component: 'Select'
    },
    formatter: (_, __, value) => {
      return value?.join(';')
    }
  },
  {
    field: 'updateTime',
    label: '最后一次修改时间'
  }
]

const { allSchemas } = useCrudSchemas(columns)

const tableRef = ref()
const handleConfirm = async () => {
  const { tableMethods } = tableRef.value
  const selects = await tableMethods.getSelections()
  emits('save', selects)
}
</script>

<style lang="scss" scoped></style>
