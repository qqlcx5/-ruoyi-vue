<template>
  <form-table
    ref="tableRef"
    :form-options="{
      schema: allSchemas.searchSchema
    }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: getLoginLogPageApi,
      showAdd: false,
      selection: true,
      reserveSelection: true,
      rowKey: 'id'
    }"
  >
    <template #tableAppend>
      <el-button type="primary" plain @click="handleExport"
        ><Iconfont name="icon-daochu" class="mr-4px" />导出</el-button
      >
      <el-button @click="handleDelete" v-hasPermi="['system:login-log:delete']">删除</el-button>
    </template>

    <template #form-organizationIds="{ model }">
      <OrgTreeSelect v-model="model.organizationIds" multiple />
    </template>

    <template #result="{ row }">
      <el-tag :type="row.result === 0 ? 'success' : 'danger'">{{
        row.result === 0 ? '成功' : '失败'
      }}</el-tag>
    </template>
    <template #organizationName="{ row }">
      <el-tooltip
        :content="`${row.componentName ? row.componentName : ''}${
          row.organizationName ? '/' + row.organizationName : ''
        }${row.postName ? '/' + row.postName : ''}`"
        placement="top"
      >
        <div class="w-140px overflow-ellipsis whitespace-nowrap">
          <span v-if="row.organizationName">{{ row.organizationName }}</span>
          <span v-if="row.postName"> / {{ row.postName }}</span>
        </div>
      </el-tooltip>
    </template>
  </form-table>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { getLoginLogPageApi, deleteLoginLogApi, exportLoginLogApi } from '@/api/system/loginLog'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import download from '@/utils/download'
import OrgTreeSelect from '@/components/Business/Organization/TreeSelect.vue'

const message = useMessage()

const tableRef = ref()

const columns: TableColumn[] = [
  {
    label: '日志编码',
    field: 'id'
  },
  {
    label: '成员名称',
    field: 'nameOrNumber',
    width: 140,
    isSearch: true,
    isTable: false
  },
  {
    label: '成员名称',
    field: 'username',
    width: 140,
    disabled: true
  },
  {
    label: '部门',
    field: 'organizationIds',
    isSearch: true,
    isTable: false
  },
  {
    label: '部门/岗位',
    field: 'organizationName',
    width: 140,
    showOverflowTooltip: false
  },
  {
    label: 'IP地址',
    field: 'userIp',
    isSearch: true,
    width: 140
  },
  {
    label: '登录地点',
    field: 'userAddress'
  },
  {
    label: '登录端口',
    field: 'entrance',
    dictType: DICT_TYPE.ENTRANCE,
    isSearch: true
  },
  {
    label: '登录方式',
    field: 'logType',
    dictType: DICT_TYPE.LOGIN_LOG_TYPE,
    width: 120
  },
  {
    label: '浏览器',
    field: 'userAgent'
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
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '成功', value: 0 },
          { label: '失败', value: 1 }
        ]
      }
    },
    disabled: true
  },
  {
    label: '登录情况',
    field: 'resultInfo',
    dictType: DICT_TYPE.LOGIN_RESULT_INFO,
    disabled: true
  },
  {
    label: '执行时长',
    field: 'duration',
    formatter: (_, __, val: string) => {
      return val ? val + 'ms' : ''
    }
  },
  {
    label: '登录时间',
    field: 'createTime',
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
    },
    width: 160
  }
]

const { allSchemas } = useCrudSchemas(columns)

const handleDelete = async () => {
  const selectedData = await tableRef.value.tableMethods.getSelections()
  if (selectedData.length > 0) {
    message
      .wgOperateConfirm('是否确认删除登录日志？删除后无法恢复。', '提示')
      .then(async () => {
        const res = await deleteLoginLogApi(selectedData.map((item) => item.id).join(','))
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
  const res = await exportLoginLogApi(tableRef.value.tableObject)
  download.excel(res as unknown as Blob, '登录日志.xls')
}
</script>

<style lang="scss" scoped></style>
