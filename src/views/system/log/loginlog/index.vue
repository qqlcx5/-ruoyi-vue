<template>
  <form-table
    ref="table"
    :form-options="{
      schema: allSchemas.searchSchema
    }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: getLoginLogPageApi,
      showAdd: false
    }"
  />
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { getLoginLogPageApi } from '@/api/system/loginLog'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const columns: TableColumn[] = [
  {
    label: '日志编码',
    field: 'id'
  },
  {
    label: '用户名称',
    field: 'username'
  },
  {
    label: '所属部门/门店',
    field: 'organizationName', // postName
    isSearch: true
  },
  {
    label: 'ip地址',
    field: 'userIp',
    isSearch: true
  },
  {
    label: '登录地点',
    field: 'userAddress'
  },
  {
    label: '登录端口',
    field: 'loginEntrance'
  },
  {
    label: '登录方式',
    field: 'logType'
  },
  {
    label: '浏览器',
    field: 'browser'
  },
  {
    label: '操作系统',
    field: 'operatingSystem'
  },
  {
    label: '机型',
    field: 'phoneModel'
  },
  {
    label: '登录结果',
    field: 'result',
    dictType: DICT_TYPE.SYSTEM_LOGIN_RESULT
  },
  {
    label: '登录情况',
    field: 'xxx'
  },
  {
    label: '执行时长',
    field: 'xx'
  },
  {
    label: '登录时间',
    field: 'createTime',
    isSearch: true,
    formatter: (_, __, val: string) => {
      return formatDate(new Date(val))
    }
  }
]

const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped></style>
