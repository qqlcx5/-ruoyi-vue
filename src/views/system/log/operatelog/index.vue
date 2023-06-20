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
      <el-button @click="handleDelete" v-hasPermi="['system:operate-log:delete']">删除</el-button>
    </template>

    <template #form-organizationIds="{ model }">
      <OrgTreeSelect v-model="model.organizationIds" multiple />
    </template>

    <template #resultCode="{ row }">
      <el-tag :type="row.resultCode === 0 ? 'success' : 'danger'">{{
        row.resultCode === 0 ? '成功' : '失败'
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
    <template #resultData="{ row }">
      <el-popover
        :width="400"
        placement="right"
        trigger="click"
        :title="`日志内容(${getDictLabel(DICT_TYPE.SYSTEM_OPERATE_TYPE, row.type)})`"
      >
        <template #reference>
          <el-link ref="checkBtnRef" type="primary" :underline="false" @click="getLogDetail(row.id)"
            >查看</el-link
          >
        </template>
        <el-descriptions v-if="row.requestMethod !== 'PUT'" :column="1" border>
          <el-descriptions-item
            v-for="(item, index) in baseDescription"
            :key="index"
            :label="item.name"
            label-class-name="log-label"
          >
            {{ item.value }}
          </el-descriptions-item>
        </el-descriptions>
        <el-table v-else :data="logInfo" border header-cell-class-name="table-header">
          <el-table-column prop="field" label="字段名" />
          <el-table-column prop="beforeValue" label="修改前" />
          <el-table-column prop="afterValue" label="修改后" />
        </el-table>
      </el-popover>
    </template>
  </form-table>
  <!--  <el-popover-->
  <!--    ref="popoverRef"-->
  <!--    :virtual-ref="buttonRef"-->
  <!--    trigger="click"-->
  <!--    title="With title"-->
  <!--    virtual-triggering-->
  <!--  >-->
  <!--    <span> Some content </span>-->
  <!--  </el-popover>-->
  <DetailDrawer ref="detailDrawerRef" />
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import {
  getOperateLogPageApi,
  deleteOperateLogApi,
  exportOperateLogApi,
  getOperateLogDetailApi
} from '@/api/system/operatelog'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import DetailDrawer from './components/DetailDrawer.vue'
import OrgTreeSelect from '@/components/Business/Organization/TreeSelect.vue'

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
    isSearch: true,
    disabled: true
  },
  {
    label: '请求地址',
    field: 'requestUrl',
    width: 140
  },
  {
    label: '操作人员',
    field: 'nameOrNumber',
    width: 130,
    isSearch: true,
    isTable: false
  },
  {
    label: '操作人员',
    field: 'username',
    width: 130,
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
    label: '日志内容',
    field: 'resultData',
    width: 140,
    disabled: true
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
    click: (row) => {
      detailDrawerRef.value.openDrawer(row.id)
    }
  }
]
const { allSchemas } = useCrudSchemas(columns)

const checkBtnRef = ref()
const baseDescription = ref<any[]>()
const logInfo = ref<any[]>([])
const logPopoverLoading = ref<boolean>(false)
const getLogDetail = async (id) => {
  logPopoverLoading.value = true
  await getOperateLogDetailApi({ id })
    .then((res) => {
      if (!res.exts) return
      const { beforeExecuteData, afterExecuteJson } = res.exts
      if (!beforeExecuteData || Object.keys(beforeExecuteData).length === 0) {
        baseDescription.value = Object.keys(afterExecuteJson).map((key) => {
          return {
            name: key,
            value: afterExecuteJson[key]
          }
        })
      } else {
        logInfo.value =
          Object.keys(beforeExecuteData).map((item) => {
            return {
              field: item,
              beforeValue: beforeExecuteData[item] || '',
              afterValue: afterExecuteJson[item] || ''
            }
          }) || []
      }
      if (beforeExecuteData && afterExecuteJson) {
      } else if (Object.keys(beforeExecuteData).length === 0 && afterExecuteJson) {
      }
    })
    .finally(() => {
      logPopoverLoading.value = false
    })
}

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
