<template>
  <form-table
    ref="table"
    :form-options="{
      schema: allSchemas.searchSchema
    }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: getConfigPageApi,
      showAdd: false
    }"
  >
    <template #action>
      <!-- 操作：修改 -->
      <XTextButton :title="t('action.edit')" v-hasPermi="['system:tenant:config:update']" />
      <!-- 操作：详情 -->
      <XTextButton :title="t('action.detail')" />
    </template>
    <template #visible="{ row }">
      <el-switch v-model="row.visible" :active-value="true" :inactive-value="false" />
    </template>
  </form-table>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { getConfigPageApi } from '@/api/infra/config'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'

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
    label: '系统内置',
    field: 'type',
    dictType: DICT_TYPE.INFRA_CONFIG_TYPE,
    isSearch: true
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
  },
  {
    label: t('common.createTime'),
    field: 'createTime',
    width: 170,
    isSearch: true,
    search: {
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD hh:mm:ss'
      }
    },
    formatter: (_, __, val: string) => {
      return formatDate(new Date(val))
    }
  },
  {
    label: t('common.operator'),
    field: 'updater'
  },
  {
    label: t('common.operationTime'),
    field: 'updateTime',
    width: 170,
    formatter: (_, __, val: string) => {
      return formatDate(new Date(val))
    }
  },
  {
    label: '操作',
    field: 'action',
    showOverflowTooltip: false
  }
]

const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped></style>
