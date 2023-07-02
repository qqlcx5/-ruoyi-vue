<template>
  <form-table
    ref="tableRef"
    :form-options="{
      schema: allSchemas.searchSchema
    }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: getList,
      actionButtons,
      showAdd: false,
      selection: true,
      reserveSelection: true,
      rowKey: 'id',
      headerAlign: 'center'
    }"
  >
    <template #tableAppend>
      <XButton type="primary" iconFont="icon-xinzeng" title="新增" @click="handleCreate()" />
      <XButton title="删除" @click="handleDelete()" />
    </template>
    <template #visitSettingType="{ row }">
      <div class="table-block">
        <div v-for="item in row.visitSetting" :key="item.id">
          {{ formatSheet(item.visitSettingType, 'visitSettingType') }}
        </div>
      </div>
    </template>
    <template #visitSettingPurposeStr="{ row }">
      <div class="table-block">
        <div v-for="item in row.visitSetting" :key="item.id">
          {{ item.visitPurposeContent }}
        </div>
      </div>
    </template>
    <template #roleName="{ row }">
      <div class="table-block">
        <div v-for="item in row.visitSetting" :key="item.id">
          {{ item.roleName }}
        </div>
      </div>
    </template>
    <template #originTimeTypeStr="{ row }">
      <div class="table-block">
        <div v-for="item in row.visitSetting" :key="item.id">
          {{ formatSheet(item.originTimeType, 'originTimeType') }}
        </div>
      </div>
    </template>
    <template #visitLimitDay="{ row }">
      <div class="table-block">
        <div v-for="item in row.visitSetting" :key="item.id"> T + {{ item.visitLimitDay }} </div>
      </div>
    </template>
    <template #status="{ row }">
      <el-switch
        v-model="row.status"
        :active-value="1"
        :inactive-value="0"
        @change="onStatusSwitchChange($event, row.id)"
      />
    </template>
  </form-table>
  <ReceptionConfigDialog ref="receptionConfigDialogRef" @success="reload" />
</template>

<script lang="ts" setup>
import {
  getEnterShopTypelList,
  getList,
  deleteApi,
  updateStatus,
  getReceptionStatuslList
} from '@/api/visit/receptionConfig'
import { getDictLabel } from '@/utils/dict'
import { getVisitTypeList, getOriginTimeTypeList } from '@/api/visit'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import ReceptionConfigDialog from './components/ReceptionConfigDialog/index.vue'

const message = useMessage()

const tableRef = ref()
const receptionConfigDialogRef = ref()
const tableConfig = reactive({
  options: {
    enterShopType: [],
    visitType: [],
    originTimeType: [],
    receptionStatus: []
  }
})

const columns = reactive<any>([
  {
    label: '接待录音关联条件',
    field: 'reception',
    children: [
      {
        label: '意向等级',
        field: 'intentionLevelList',
        width: '90px',
        formatter: (_, __, val) => {
          return val.join(',') || ''
        }
      },
      {
        label: '到店类型',
        field: 'enterShopTypeList',
        width: '120px',
        isSearch: true,
        search: {
          component: 'Select',
          componentProps: {
            options: computed(() => tableConfig.options.enterShopType)
          }
        },
        formatter: (_, __, val) => {
          return val.join(',') || ''
        }
      },
      {
        label: '接待状态',
        field: 'receptionStatusList',
        width: '100px',
        formatter: (_, __, val) => {
          return val.join(',') || ''
        }
      },
      {
        label: '是否试乘试驾',
        field: 'isDrive',
        width: '120px',
        formatter: (_, __, val) => {
          if (val === -2) {
            return '无'
          } else if (val === -1) {
            return '全部'
          }
          return getDictLabel('drive_status', val) || ''
        }
      },
      {
        label: '是否下订',
        field: 'isBook',
        width: '100px',
        formatter: (_, __, val) => {
          return val
            .split(',')
            .map((i) => {
              if (i === '-2') {
                return '无'
              } else {
                return getDictLabel('place_order_status', i) || ''
              }
            })
            .join(',')
        }
      },
      {
        label: '车辆品牌',
        field: 'brandNameList',
        width: '180px',
        formatter: (_, __, val) => {
          return val ? val.join(',') : ''
        }
      },
      { label: '意向车型', field: 'modelList', width: '100px' }
    ]
  },
  {
    label: '回访计划规则',
    field: 'visitRule',
    children: [
      {
        label: '回访类型',
        field: 'visitSettingType',
        width: '120px',
        isSearch: true,
        search: {
          component: 'Select',
          componentProps: {
            options: computed(() => tableConfig.options.visitType)
          }
        }
      },
      { label: '回访目的', field: 'visitSettingPurposeStr', width: '100px', isSearch: true },
      { label: '回访角色', field: 'roleName', width: '100px' },
      { label: '参考时间', field: 'originTimeTypeStr', width: '100px' },
      { label: '计划回访时间T+N(天数)', field: 'visitLimitDay', width: '180px' }
    ]
  },
  {
    label: '状态',
    field: 'status',
    fixed: 'right'
  }
])
const actionButtons = [
  {
    name: '编辑',
    click: (row) => {
      receptionConfigDialogRef.value.openDialog(formatEditData(row))
    }
  },
  {
    name: '删除',
    click: (row) => {
      handleDelete(row.id)
    }
  }
]
const { allSchemas } = useCrudSchemas(columns)

const formatSheet = (val, key) => {
  if (key === 'visitSettingType') {
    const res = tableConfig.options.visitType.find((i) => i['key'] === val)
    return res ? res['value'] : ''
  } else if (key === 'originTimeType') {
    const res = tableConfig.options.originTimeType.find((i) => i['key'] === val)
    return res ? res['value'] : ''
  }
}

const reload = () => {
  tableRef.value.tableMethods.getList()
}

const handleCreate = async () => {
  receptionConfigDialogRef.value.openDialog()
}
const handleDelete = async (id) => {
  const selectedData = await tableRef.value.tableMethods.getSelections()
  if (!id && selectedData.length === 0) {
    return message.warning('请选择删除的话术')
  }
  message
    .wgOperateConfirm(
      id
        ? '是否确认删除该条回访话术？删除后无法恢复。'
        : `是否确认删除选中的${selectedData.length}条回访话术？删除后无法恢复。`,
      '提示'
    )
    .then(async () => {
      const params = {
        receptionVisitSettingIdList: id
          ? [id]
          : await tableRef.value.tableMethods.getSelections().map((i) => i.id)
      }
      const res = await deleteApi(params)
      if (res) {
        message.success('删除成功')
        await tableRef.value.tableMethods.getList()
      } else {
        message.error('删除失败')
      }
    })
    .catch(() => {})
}

const onStatusSwitchChange = (e, id) => {
  if (!id) return
  updateStatus({ id, status: e }).then((res) => {
    if (!res) return message.error('状态修改失败')
    message.success('状态修改成功')
  })
}

const formatEditData = (record) => {
  let originTimeTypeMap = {}
  let visitTypeMap = {}
  for (const originTimeTypeItem of tableConfig.options.originTimeType) {
    originTimeTypeMap[originTimeTypeItem['key']] = originTimeTypeItem['value']
  }
  for (const visitTypeItem of tableConfig.options.visitType) {
    visitTypeMap[visitTypeItem['key']] = visitTypeItem['value']
  }
  record.visitSetting.map((item) => {
    item['distributeRoleList'] = item.distributeRole ? JSON.parse(item.distributeRole) : []
    item['visitSettingPurposeStr'] = item.visitPurposeContent
    item['originTimeTypeStr'] = originTimeTypeMap[item.visitObject]
    item['visitSettingTypeStr'] = visitTypeMap[item.visitSettingType]
    return item
  })
  record['intentionModelIds'] = record.intentionModel.split(',').map((i) => parseInt(i))
  return record
}

onMounted(() => {
  Promise.all([
    getEnterShopTypelList(),
    getVisitTypeList(),
    getOriginTimeTypeList(),
    getReceptionStatuslList()
  ]).then((res) => {
    tableConfig.options.enterShopType = res[0]
    tableConfig.options.visitType = res[1]
    tableConfig.options.originTimeType = res[2]
    tableConfig.options.receptionStatus = res[3]
  })
})
</script>

<style lang="scss" scoped>
.table-block {
  div {
    height: 30px;
    line-height: 30px;
  }

  div:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
}
</style>
