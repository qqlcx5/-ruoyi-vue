<template>
  <form-table
    ref="tableRef"
    :form-options="{
      schema: allSchemas.searchSchema
    }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: getOperateLogPageApi,
      showAdd: false,
      actionButtons,
      selection: true,
      reserveSelection: true,
      rowKey: 'id'
    }"
  >
    <template #tableAppend>
      <el-button type="primary" plain @click="handleExport">
        <Iconfont name="icon-daochu" class="mr-4px" />
        导出
      </el-button>
      <el-button @click="handleDelete">删除</el-button>
    </template>
    <template #resultCode="{ row }">
      <el-tag :type="row.resultCode === 0 ? 'success' : 'danger'">{{
        row.resultCode === 0 ? '成功' : '失败'
      }}</el-tag>
    </template>
    <template #organizationName="{ row }">
      <el-tooltip :content="`${row.organizationName}/${row.postName}`" placement="top">
        <div>{{ row.organizationName }} / {{ row.postName }}</div>
      </el-tooltip>
    </template>
    <!--    <template #form-username="data">-->
    <!--      &lt;!&ndash;      {{ data }}&ndash;&gt;-->
    <!--      <el-input v-model="data.person" placeholder="123" />-->
    <!--    </template>-->

    <template #form-organizationName>
      <OrgTreeSelect multiple />
    </template>
  </form-table>
  <DetailDrawer ref="detailDrawerRef" />
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import {
  getOperateLogPageApi,
  deleteOperateLogApi,
  exportOperateLogApi
} from '@/api/system/operatelog'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import DetailDrawer from './components/DetailDrawer.vue'
import OrgTreeSelect from '@/components/Business/Organization/TreeSelect.vue'
import { DICT_TYPE } from '@/utils/dict'

const message = useMessage()

const tableRef = ref()
const detailDrawerRef = ref()

const columns: TableColumn[] = [
  {
    label: '日志编号',
    field: 'id'
  },
  {
    label: '操作模块',
    field: 'module',
    width: 140,
    isSearch: true
  },
  {
    label: '请求地址',
    field: 'requestUrl',
    width: 140
  },
  {
    label: '操作人员',
    field: 'username',
    width: 130,
    isSearch: true
  },
  {
    label: '部门/门店',
    field: 'organizationName',
    isSearch: true,
    width: 140,
    showOverflowTooltip: false
  },
  {
    label: 'IP地址',
    field: 'userIp',
    width: 120
  },
  {
    label: '操作地点',
    field: 'userAddress'
  },
  {
    label: '请求方式',
    field: 'requestMethod'
  },
  {
    label: '操作类型',
    field: 'type',
    isSearch: true,
    dictType: DICT_TYPE.SYSTEM_OPERATE_TYPE
  },
  {
    label: '操作端口',
    field: 'entrance',
    dictType: DICT_TYPE.ENTRANCE,
    isSearch: true
  },
  {
    label: '操作按钮',
    field: 'name',
    width: 140,
    isSearch: true
  },
  {
    label: '操作结果',
    field: 'resultCode',
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '成功', value: 0 },
          { label: '失败', value: 1 }
        ]
      }
    }
  },
  {
    label: '操作时间',
    field: 'startTime',
    width: 160,
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
    label: '执行时长',
    field: 'duration',
    formatter: (_, __, val: string) => {
      return val ? val + 'ms' : ''
    }
  }
]

const actionButtons = [
  {
    name: '详情',
    permission: 'system:tenant:config:update',
    click: (row) => {
      detailDrawerRef.value.openDrawer(row.id)
    }
  }
]

const { allSchemas } = useCrudSchemas(columns)

const handleDelete = async () => {
  const selectedData = await tableRef.value.tableMethods.getSelections()
  if (selectedData.length > 0) {
    message
      .wgOperateConfirm('是否确认删除操作日志？删除后无法恢复。', '提示')
      .then(async () => {
        const res = await deleteOperateLogApi(selectedData.map((item) => item.id).join(','))
        if (res) {
          message.success('删除成功')
          await tableRef.value.tableMethods.getList()
        } else {
          message.error('删除失败')
        }
      })
      .catch(() => {})
  } else {
    message.warning('请选择删除日志')
  }
}

const handleExport = async () => {
  const res = await exportOperateLogApi(tableRef.value.tableObject)
  download.excel(res as unknown as Blob, '操作日志.xls')
}
</script>

<style lang="scss" scoped></style>
