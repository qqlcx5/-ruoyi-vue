<template>
  <el-card class="mb-24px">
    <template #header>
      <div class="card-header">客服人员配置</div>
    </template>
    <div class="mb-16px danger-text"
      >说明：同一回访任务如果配置多个回访人员，则系统会进行平均分配</div
    >
    <form-table
      ref="tableRef"
      :form-options="{
        isSearch: false
      }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi: getLoginLogPageApi,
        actionButtons,
        showAdd: false,
        showTools: false
      }"
    />
  </el-card>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getLoginLogPageApi } from '@/api/system/loginLog'
// import {
//   getVisitTypeList,
//   queryVisitSettingCallRecord,
//   saveVisitSettingCallRecord,
//   queryVisitCheckTimeConfig,
//   saveVisitCheckTimeConfig
// } from '@/api/visit'

// const message = useMessage()

/** 客服人员配置 **/
const columns: TableColumn[] = [
  {
    label: '回访话术内容',
    field: 'id'
  },
  {
    label: '回访类型',
    field: 'nameOrNumber',
    width: 140
  },
  {
    label: '回访目的',
    field: 'username',
    width: 140
  },
  {
    label: '回访角色',
    field: 'organizationIds'
  },
  {
    label: '回访对象',
    field: 'organizationName',
    width: 140
  },
  {
    label: '参考时间',
    field: 'userIp',
    width: 140
  },
  {
    label: '计划回访时间T+N(天数)',
    field: 'userAddress'
  }
]
const actionButtons = [
  {
    name: '删除',
    click: (row) => {
      console.log(row)
    }
  }
]
const { allSchemas } = useCrudSchemas(columns)
</script>
