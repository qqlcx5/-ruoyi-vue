<template>
  <div class="portrait-factor">
    <form-table
      title="画像因子等级配置"
      ref="tableRef"
      @add="handleAdd"
      :form-options="{
        schema: allSchemas.searchSchema
      }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi: receptionList.receptionManagePageApi,
        showAdd: false,
        selection: true,
        actionButtons
      }"
    >
      <template #form-selectTime="{ model }">
        <el-input
          v-model="model.searchKey"
          placeholder="请输入按揭银行名称、联系人、最近操作人进行搜索"
          style="width: 344px"
        />
      </template>

      <template #tableAppend>
        <XButton type="primary" @click="handleDel"> 导出</XButton>
      </template>
    </form-table>
    <addedPortraitFactor ref="addRef" v-model="addTypeVisible" @refresh="handleRresh" />
  </div>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import * as receptionList from '@/api/receptionManagement/receptionList'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import addedPortraitFactor from './components/addedPortraitFactor.vue'

const message = useMessage()
const { t } = useI18n()
let tableRef = ref()
const selectedIds = ref<number[]>([])
const searchComp = (options) => {
  return {
    component: 'Select',
    componentProps: {
      filterable: true,
      clearable: true,
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 }
      ]
    }
  }
}
const columns: TableColumn[] = [
  { label: '时间', field: 'select-time', isSearch: true, isTable: false },
  { label: '接待', field: 'select-reception', isSearch: true, isTable: false },
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
    width: 200
  },
  {
    label: '意向车型',
    field: 'buyerIntentionModel',
    isSearch: true,
    width: 200,
    search: {
      component: 'Select',
      componentProps: {
        filterable: true,
        clearable: true,
        options: [
          { label: '开启', value: 1 },
          { label: '关闭', value: 0 }
        ]
      }
    }
  },
  {
    label: '下订车型$',
    field: 'receptionStatus',
    isSearch: true,
    width: 200,
    search: searchComp
  },
  { label: '到店类型', field: 'enterShopType', isSearch: true, isTable: false, search: searchComp },
  // --------------------------------------------------------------------
  {
    label: '门店筛选',
    field: 'storeScreening',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '接待成员',
    field: 'receivingMembers',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '是否有点评',
    field: 'doYouHaveAnyComments',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '是否有评论',
    field: 'doYouComments',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '是否自查自纠',
    field: 'whetherSelfCorrection',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '是否关联微信',
    field: 'isLinkWechat',
    isSearch: true,
    search: searchComp,
    width: 200
  },
  {
    label: '意向等级',
    field: 'intentionLevel',
    isSearch: true,
    search: searchComp,
    width: 200
  },
  {
    label: '接待时长',
    field: 'receptionDuration',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '录音时长',
    field: 'receptionAudioDuration',
    isSearch: true,
    search: searchComp,
    width: 200
  },
  {
    label: '画像因子评级',
    field: 'portraitFactorLevel',
    isSearch: true,
    search: searchComp,
    width: 200
  },
  {
    label: '是否下订',
    field: 'placeOrderStatus',
    isSearch: true,
    search: searchComp,
    width: 200
  },

  { label: '到店来源', field: 'arrivalSource', isSearch: true, isTable: false, search: searchComp },
  {
    label: '回访状态',
    field: 'returnVisitStatus',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '购车预算',
    field: 'carPurchaseBudget',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '是否下载万车利$',
    field: 'receptionStatus',
    isSearch: true,
    search: searchComp,
    width: 200
  },
  { label: '付款方式', field: 'paymentMethod', isSearch: true, isTable: false, search: searchComp },
  {
    label: '按揭产品等级',
    field: 'mortgageProductGrade',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '成交按揭产品',
    field: 'transactionMortgageProducts',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '购车类型',
    field: 'carPurchaseType',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '是否试乘试驾',
    field: 'testDriveOrNot',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '是否发生资料',
    field: 'hasAnyInformationOccurred',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  { label: '客户类型', field: 'customerType', isSearch: true, isTable: false, search: searchComp },
  {
    label: '是否老客户',
    field: 'isItARegularCustomer',
    isSearch: true,
    isTable: false,
    search: searchComp
  },
  {
    label: '客户性别',
    field: 'customerGender',
    isSearch: true,
    isTable: false,
    search: searchComp
  },

  {
    label: '成员所属门店',
    field: 'userDepartment',
    width: 200
  },
  {
    label: '接待成员',
    field: 'userName',
    width: 200
  },

  {
    label: '是否试乘试驾',
    field: 'testDrive',
    width: 200
  },
  {
    label: '接待状态',
    field: 'receptionStatus',
    width: 200
  },
  {
    label: '回访满意度$',
    field: 'portraitFactorStatus',
    width: 200
  }
]
const actionButtons = [
  {
    name: '详情',
    permission: true,
    click: (row) => {}
  },
  {
    name: '播放录音',
    permission: true,
    click: (row) => {}
  },
  {
    name: '查看日志',
    permission: true,
    click: (row) => {}
  },
  {
    name: '修改记录',
    permission: true,
    click: (row) => {}
  },
  {
    name: '删除',
    permission: true,
    click: (row) => {}
  }
]
let addTypeVisible = ref(false) // 新增类型弹窗
// 操作：新增
async function handleAdd() {
  addTypeVisible.value = true
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
