<template>
  <div class="portrait-factor">
    <form-table
      title="画像因子等级配置"
      ref="tableRef"
      @add="handleAdd"
      :form-options="{
        schema: allSchemas.searchSchema
      }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi: getConfigPageApi,
        showAdd: true,
        selection: true
      }"
    >
      <template #tableAppend>
        <XButton @click="handleDel"> 删除</XButton>
      </template>

      <template #action="{ row }">
        <!-- 操作：修改 -->
        <XTextButton :title="t('action.modify')" @click="handleModify(row)" />
      </template>
    </form-table>
  </div>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { getConfigPageApi } from '@/api/infra/config'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
const { t } = useI18n()
let tableRef = ref(null)
const columns: TableColumn[] = [
  {
    label: '画像因子得分区间',
    field: 'id',
    isSearch: true
  },
  {
    label: '对应评级名称',
    field: 'category'
  },
  {
    label: '创建人',
    field: 'prompt'
  },
  {
    label: '创建人',
    field: 'key'
  },

  {
    label: '创建时间',
    field: 'updater'
  },
  {
    label: '操作',
    field: 'action',
    showOverflowTooltip: false
  }
]

// 操作：新增
async function handleAdd() {
  const list = await tableRef.value?.tableMethods?.getSelections()
}

// 操作：删除
function handleDel() {
  console.log('del')
}

function handleModify(row) {
  console.log('handleModify', row)
}

const { allSchemas } = useCrudSchemas(columns)
</script>
