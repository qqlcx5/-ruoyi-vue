<template>
  <div class="portrait-factor">
    <form-table
      title="画像因子等级配置"
      ref="tableRef"
      @add="handleAdd"
      @search="receptionManageStatisticsApi"
      @reset="handleReset"
      :form-options="{
        schema: allSchemas.searchSchema
      }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi: receptionList.receptionManagePageApi,
        showAdd: false,
        actionButtons,
        listParams: tableParams
      }"
    >
      <template #form-selectReception>
        <el-radio-group radio-group v-model="receptionStatus">
          <el-radio-button :label="undefined">全部{{ statisticsOpt.statusAll }}</el-radio-button>
          <el-radio-button :label="2">接待完成{{ statisticsOpt.statusCompleted }}</el-radio-button>
          <el-radio-button :label="1">接待暂停{{ statisticsOpt.statusSuspended }}</el-radio-button>
          <el-radio-button :label="0">接待中{{ statisticsOpt.statusReception }}</el-radio-button>
          <el-radio-button :label="3">取消接待{{ statisticsOpt.statusCancel }}</el-radio-button>
        </el-radio-group>
      </template>
      <template #form-selectTime>
        <el-radio-group v-model="selectTime">
          <el-radio-button label="今天" />
          <el-radio-button label="昨天" />
          <el-radio-button label="近7天" />
          <el-radio-button label="本月" />
          <el-radio-button label="本年" />
        </el-radio-group>
        <el-date-picker
          v-model="selectTimeRange"
          class="ml-16px"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="handleDateRange"
        />
      </template>

      <template #form-carPurchaseBudget="{ model }">
        <el-input v-model="model.buyCarBudgetBegin" placeholder="最低预算" style="width: 94px" />
        <span class="ml-4px mr-4px">-</span>
        <el-input v-model="model.buyCarBudgetEnd" placeholder="最高预算" style="width: 94px" />
      </template>

      <template #tableAppend>
        <XButton type="primary" @click="handleDel"> 导出</XButton>
      </template>
    </form-table>
    <detailsDrawer ref="detailsRef" v-model="detailsVisible" @refresh="handleRresh" />
  </div>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import * as receptionList from '@/api/receptionManagement/receptionList'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import detailsDrawer from './components/detailsDrawer.vue'

const message = useMessage()
const { t } = useI18n()
/* -------------------------------- dayjs -------------------------------- */
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
let tableRef = ref()
let detailsRef = ref()
const selectedIds = ref<number[]>([])
const searchComp = (options = [{}]) => ({
  component: 'Select',
  componentProps: {
    filterable: true,
    clearable: true,
    options
  }
})

// 统计选项
const statisticsOpt = reactive({
  statusAll: 0,
  statusCancel: 0,
  statusCompleted: 0,
  statusReception: 0,
  statusSuspended: 0
})
async function receptionManageStatisticsApi(params) {
  let data = await receptionList.receptionManageStatisticsApi(params)
  if (data) {
    statisticsOpt.statusAll = data.statusAll
    statisticsOpt.statusCancel = data.statusCancel
    statisticsOpt.statusCompleted = data.statusCompleted
    statisticsOpt.statusReception = data.statusReception
    statisticsOpt.statusSuspended = data.statusSuspended
  }
}
// 表格列
const columns: TableColumn[] = [
  { label: '接待', field: 'selectReception', isSearch: true, isTable: false },
  { label: '时间', field: 'selectTime', isSearch: true, isTable: false },
  {
    label: '开始录音时间',
    field: 'recordBeginTime',
    width: 200
  },
  {
    label: '客户姓名',
    field: 'customerName',
    isSearch: true,
    width: 200
  },
  {
    label: '客户手机',
    field: 'customerMobile',
    isSearch: true,
    width: 200,
    formatter: (_, __, val) => {
      return val ? val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
    }
  },
  {
    label: '意向车型xxx',
    field: 'buyerIntentionModel',
    isSearch: true,
    width: 200,
    search: searchComp([])
  },
  {
    label: '下订车型xxx',
    field: 'receptionStatus',
    isSearch: true,
    width: 200,
    search: searchComp([])
  },
  {
    label: '到店类型',
    field: 'enterShopType',
    isSearch: true,
    width: 200,
    search: searchComp([
      { value: 1, label: '首次进店看车' },
      { value: 2, label: '再次到店洽谈' },
      { value: 3, label: '提车' },
      { value: 4, label: '办理手续' },
      { value: 5, label: '交余款' },
      { value: 7, label: '维保顺便看车' },
      { value: 6, label: '其他' }
    ]),
    formatter: (_, __, val) => {
      let list = [
        { value: 1, label: '首次进店看车' },
        { value: 2, label: '再次到店洽谈' },
        { value: 3, label: '提车' },
        { value: 4, label: '办理手续' },
        { value: 5, label: '交余款' },
        { value: 7, label: '维保顺便看车' },
        { value: 6, label: '其他' }
      ]
      return list.find((item) => item.value === val)?.label || '未知'
    }
  },
  {
    label: '门店筛选xxx',
    field: 'storeScreening',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '接待成员xxx',
    field: 'receivingMembers',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '是否有点评xxx',
    field: 'doYouHaveAnyComments',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '是否有评论xxx',
    field: 'doYouComments',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '是否自查自纠xxx',
    field: 'whetherSelfCorrection',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '是否关联微信',
    field: 'isLinkWechat',
    isSearch: true,
    search: searchComp([
      { value: 1, label: '是' },
      { value: 2, label: '否' }
    ]),
    width: 200,
    formatter: (_, __, val) => {
      return val === 1 ? '是' : '否'
    }
  },
  {
    label: '意向等级',
    field: 'intentionLevel',
    isSearch: true,
    search: searchComp([
      { value: 1, label: 'H' },
      { value: 2, label: 'A' },
      { value: 3, label: 'B' },
      { value: 4, label: 'C' },
      { value: 5, label: 'N' },
      { value: 0, label: '其他' }
    ]),
    width: 200,
    formatter: (_, __, val) => {
      let list = [
        { value: 1, label: 'H' },
        { value: 2, label: 'A' },
        { value: 3, label: 'B' },
        { value: 4, label: 'C' },
        { value: 5, label: 'N' },
        { value: 0, label: '其他' }
      ]
      return list.find((item) => item.value === val)?.label || ''
    }
  },
  {
    label: '接待时长',
    field: 'receptionDuration',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '录音时长',
    field: 'receptionAudioDuration',
    isSearch: true,
    search: searchComp([]),
    width: 200,
    formatter: (_, __, val) => {
      return dayjs.duration(val, 'seconds').format('HH:mm:ss')
    }
  },
  {
    label: '画像因子评级',
    field: 'portraitFactorLevel',
    isSearch: true,
    search: searchComp([
      { label: '未评分', value: 0 },
      { label: '已评分', value: 1 }
    ]),
    width: 200
  },
  {
    label: '是否下订',
    field: 'placeOrderStatus',
    isSearch: true,
    width: 200,
    search: searchComp([
      { value: 0, label: '否' },
      { value: 1, label: '是' },
      { value: 2, label: '考虑中' }
    ]),

    formatter: (_, __, val) => {
      let list = [
        { value: 0, label: '否' },
        { value: 1, label: '是' },
        { value: 2, label: '考虑中' }
      ]
      return list.find((item) => item.value === val)?.label || ''
    }
  },

  {
    label: '到店来源',
    field: 'arrivalSource',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '回访状态',
    field: 'returnVisitStatus',
    isSearch: true,
    isTable: false,
    search: searchComp([
      { value: 1, label: '已回访' },
      { value: 0, label: '未回访' }
    ]),
    formatter: (_, __, val) => {
      return val === 1 ? '已回访' : '未回访'
    }
  },
  {
    label: '购车预算',
    field: 'carPurchaseBudget',
    isSearch: true,
    isTable: false
  },
  {
    label: '是否下载万车利xxx',
    field: 'receptionStatus',
    isSearch: true,
    search: searchComp([]),
    width: 200,
    formatter: (_, __, val) => {
      return val === 1 ? '是' : '否'
    }
  },
  {
    label: '付款方式',
    field: 'paymentMethod',
    isSearch: true,
    isTable: false,
    search: searchComp([
      { value: 1, label: '全款' },
      { value: 2, label: '贷款' }
    ])
  },
  {
    label: '按揭产品等级xxx',
    field: 'mortgageProductGrade',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '成交按揭产品xxx',
    field: 'transactionMortgageProducts',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '购车类型',
    field: 'carPurchaseType',
    isSearch: true,
    isTable: false,
    search: searchComp([
      { value: 1, label: '新购' },
      { value: 2, label: '再购' },
      { value: 3, label: '置换' }
    ])
  },
  {
    label: '是否试乘试驾',
    field: 'testDriveOrNot',
    isSearch: true,
    isTable: false,
    search: searchComp([
      { value: 0, label: '否' },
      { value: 1, label: '是' }
    ]),
    formatter: (_, __, val) => {
      return val === 1 ? '是' : '否'
    }
  },
  {
    label: '是否发生资料xxx',
    field: 'hasAnyInformationOccurred',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '客户类型xxx',
    field: 'customerType',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '是否老客户xxx',
    field: 'isItARegularCustomer',
    isSearch: true,
    isTable: false,
    search: searchComp([])
  },
  {
    label: '客户性别',
    field: 'customerGender',
    isSearch: true,
    isTable: false,
    search: searchComp([
      { value: 0, label: '未知' },
      { value: 1, label: '男' },
      { value: 2, label: '女' }
    ])
  },

  {
    label: '成员所属门店xxx',
    field: 'userDepartment',
    width: 200
  },
  {
    label: '接待成员xxx',
    field: 'userName',
    width: 200
  },

  {
    label: '是否试乘试驾',
    field: 'testDrive',
    width: 200,
    search: searchComp([
      { value: 0, label: '否' },
      { value: 1, label: '是' }
    ])
  },
  {
    label: '接待状态',
    field: 'receptionStatus',
    width: 200,
    formatter: (_, __, val) => {
      let list = [
        { value: 0, label: '接待中' },
        { value: 1, label: '暂停接待' },
        { value: 2, label: '接待完成' },
        { value: 3, label: '取消接待' }
      ]
      return list.find((item) => item.value === val)?.label || ''
    }
  },
  {
    label: '画像因子评分状态',
    field: 'portraitFactorStatus',
    width: 200,
    formatter: (_, __, val) => {
      let list = [
        { value: 0, label: '未评分' },
        { value: 1, label: '已评分' }
      ]
      return list.find((item) => item.value === val)?.label || ''
    }
  },
  {
    label: '回访满意度xxx',
    field: 'satisFollowUpVisits',
    width: 200
  }
]
const actionButtons = [
  {
    name: '详情',
    permission: true,
    click: (row) => {
      detailsRef.value?.openDrawer(row)
    }
  },
  {
    name: '播放录音',
    permission: true,
    click: () => {}
  },
  {
    name: '查看日志',
    permission: true,
    click: () => {}
  },
  {
    name: '修改记录',
    permission: true,
    click: () => {}
  },
  {
    name: '删除',
    permission: true,
    click: () => {}
  }
]
/* ---------------------------------- 时间选择 ---------------------------------- */
let selectTime = ref('今天')
let receptionStatus = ref()
let selectTimeRange = ref()
let tableParams = reactive({
  dateBegin: '',
  dateEnd: '',
  receptionStatus: ''
})
watch(
  receptionStatus,
  (val) => {
    tableParams.receptionStatus = val
  },
  { immediate: true }
)
watch(
  selectTime,
  (val) => {
    switch (val) {
      case '今天':
        tableParams.dateBegin = dayjs().format('YYYY-MM-DD 00:00:00')
        tableParams.dateEnd = dayjs().format('YYYY-MM-DD 23:59:59')
        break
      case '昨天':
        tableParams.dateBegin = dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00')
        tableParams.dateEnd = dayjs().subtract(1, 'day').format('YYYY-MM-DD 23:59:59')
        break
      case '近7天':
        tableParams.dateBegin = dayjs().subtract(7, 'day').format('YYYY-MM-DD 00:00:00')
        tableParams.dateEnd = dayjs().format('YYYY-MM-DD 23:59:59')
        break
      case '本月':
        tableParams.dateBegin = dayjs().startOf('month').format('YYYY-MM-DD 00:00:00')
        tableParams.dateEnd = dayjs().format('YYYY-MM-DD 23:59:59')
        break
      case '本年':
        tableParams.dateBegin = dayjs().startOf('year').format('YYYY-MM-DD 00:00:00')
        tableParams.dateEnd = dayjs().format('YYYY-MM-DD 23:59:59')
        break
    }
    console.log('🚀 ~ file: index.vue:545 ~ selectTime-------------', tableParams)
    selectTimeRange.value = [tableParams.dateBegin, tableParams.dateEnd]
  },
  { immediate: true }
)

function handleDateRange(val) {
  tableParams.dateBegin = val[0]
  tableParams.dateEnd = val[1]
  selectTime.value = ''
}
/* ---------------------------------- 重置 ---------------------------------- */
function handleReset() {
  selectTime.value = '今天'
  receptionStatus.value = ''
  nextTick(() => {
    receptionManageStatisticsApi(tableParams)
  })
}
/* -------------------------------- 操作事件 ------------------------------- */
let detailsVisible = ref(false)
// 操作：新增
async function handleAdd() {
  detailsVisible.value = true
}
// 操作：刷新
function handleRresh() {
  tableRef.value.tableMethods.getList()
}

// 操作：删除
async function handleDel() {
  const list = await tableRef.value?.tableMethods?.getSelections()
  if (list) {
    selectedIds.value = list.map((item) => item.id)
  }
  if (selectedIds.value.length < 1) {
    return message.warning('未选择数据')
  }
  confirmDel(null)
}
const confirmDel = (row) => {
  row && selectedIds.value.push(row.id)
  if (selectedIds.value.length < 1) {
    return message.warning('未选择数据')
  }
  const buttonConfig = {
    confirmButtonText: t('common.confirmDel'),
    cancelButtonText: t('common.cancel')
  }
  const contentStr: any = h('span', [
    '确定要删除 ',
    h(
      'span',
      {
        style: { color: 'red' }
      },
      selectedIds.value.length
    ),
    ' 条记录？'
  ])
  message
    .wgConfirm('', contentStr, buttonConfig)
    .then(() => {
      deleteFun()
    })
    .catch(() => {})
}
const deleteFun = async () => {
  let params = {
    ids: selectedIds.value
  }
  let res = await receptionList.receptionManageCancelReceptionApi(params)
  if (res) {
    message.success('删除成功')
    tableRef.value.tableMethods.getList()
  } else {
    message.error('报错了')
  }
}

const { allSchemas } = useCrudSchemas(columns)
</script>
