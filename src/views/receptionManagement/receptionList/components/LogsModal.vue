<template>
  <div>
    <XModal v-model="modelValue_" title="提示">
      <form-table
        ref="tableRef"
        :form-options="{ schema: allSchemas.searchSchema }"
        :table-options="{
          columns: allSchemas.tableColumns,
          listParams: { id: rowData.id },
          listApi: receptionList.receptionManagePageOperateLogApi
        }"
      />
      <template #footer>
        <XButton title="取消" @click="modelValue_ = false" />
      </template>
    </XModal>
  </div>
</template>

<script setup lang="ts">
import * as receptionList from '@/api/receptionManagement/receptionList'
let rowData = ref<any>({})
function openModal(open: boolean, data?: any) {
  modelValue_.value = open
  rowData.value = data
}
defineExpose({ openModal })

import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
const { t } = useI18n()
const columns: TableColumn[] = [
  {
    label: '参数主键',
    field: 'id'
  },
  {
    label: '参数分类',
    field: 'category'
  },
  {
    label: '参数名称',
    field: 'name',
    isSearch: true
  },
  {
    label: '参数键名',
    field: 'key',
    isSearch: true
  },
  {
    label: '参数键值',
    field: 'value'
  },

  {
    label: '是否可见',
    field: 'visible'
  },
  {
    label: t('form.remark'),
    field: 'remark'
  },
  {
    label: t('common.creater'),
    field: 'creator'
  }
]
const { allSchemas } = useCrudSchemas(columns)

/* ---------------------------------- 弹窗初始化 --------------------------------- */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:modelValue', 'refresh'])
const modelValue_ = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>
