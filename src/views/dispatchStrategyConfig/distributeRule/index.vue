<template>
  <form-table
    ref="table"
    :form-options="{ schema: allSchemas.searchSchema }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: dispatchApi.getClueDistribute,
      showAdd: true
    }"
  >
    <template #action>
      <!--      编辑-->
      <XTextButton :title="t('action.edit')" />
      <!--      删除-->
      <XTextButton :title="t('action.del')" />
    </template>
    <template #status="{ row }">
      <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
    </template>
  </form-table>
</template>

<script setup lang="ts" name="dispatchRule">
import { TableColumn } from '@/types/table'
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const { t } = useI18n()

const columns: TableColumn[] = [
  {
    label: '规则名称',
    field: 'ruleName',
    isSearch: true
  },
  {
    label: '适用门店',
    field: 'shopNameList',
    isSearch: true,
    search: {
      component: 'Cascader',
      componentProps: {}
    }
  },
  {
    label: '状态',
    field: 'status'
  },
  {
    label: '创建人',
    field: 'createById'
  },
  {
    label: '创建时间',
    field: 'createByTime'
  },
  {
    label: '操作',
    field: 'action'
  }
]

const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped></style>
