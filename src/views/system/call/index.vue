<template>
  <form-table
    ref="tableRef"
    :form-options="{ schema: allSchemas.searchSchema }"
    :table-options="{
      columns: allSchemas.tableColumns,
      showAdd: false,
      listApi: callApi.listSimpleDeptApi(),
      actionButtons
    }"
  />
</template>

<script setup lang="ts" name="call">
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import * as callApi from '@/api/system/call/index'
import { formatDate } from '@/utils/formatTime'
const columns: TableColumn[] = [
  {
    label: '成员姓名',
    field: 'username',
    isSearch: true
  },
  {
    label: '客户姓名',
    field: 'cusname',
    isSearch: true
  },
  {
    label: '接通状态',
    field: 'cusname',
    isSearch: true
  },
  {
    label: '通话类型',
    field: 'cusname',
    isSearch: true
  },
  {
    label: '客户号码',
    field: 'cusname',
    isSearch: true
  },
  {
    label: '成员号码',
    field: 'cusname',
    isSearch: true
  },
  {
    label: '云录音类型',
    field: 'cusname',
    isSearch: true
  },
  {
    label: '创建时间',
    field: 'createTime',
    width: 180,
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
    label: '客户',
    field: 'department'
  },
  {
    label: '成员',
    field: 'department'
  },
  {
    label: '所属部门',
    field: 'department'
  },
  {
    label: '接通状态',
    field: 'department'
  },
  {
    label: '通话时长',
    field: 'department'
  },
  {
    label: '通话类型',
    field: 'department'
  },
  {
    label: '开始时间',
    field: 'department'
  },
  {
    label: '接通时间',
    field: 'department'
  },
  {
    label: '结束时间',
    field: 'department'
  },
  {
    label: '云录音类型',
    field: 'department'
  }
]
const actionButtons = [
  {
    name: '详情',
    click: () => {
      console.log('详情')
    }
  }
]
const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped></style>
