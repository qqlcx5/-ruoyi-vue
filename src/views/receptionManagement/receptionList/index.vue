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
      <template #form-receptionAudioDuration="{ model }">
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
const columns: TableColumn[] = [
  {
    label: '开始录音时间',
    field: 'recordBeginTime',
    isSearch: true,
    width: 200
  },
  {
    label: '录音时长',
    field: 'receptionAudioDuration',
    isSearch: true,
    width: 200
  },
  {
    label: '成员所属门店',
    field: 'userDepartment',
    isSearch: true,
    width: 200
  },
  {
    label: '接待成员',
    field: 'userName',
    isSearch: true,
    width: 200
  },
  {
    label: '到店类型',
    field: 'enterShopType',
    isSearch: true,
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
    width: 200
  },
  {
    label: '下订车型-',
    field: 'receptionStatus',
    isSearch: true,
    width: 200
  },
  {
    label: '意向等级',
    field: 'intentionLevel',
    isSearch: true,
    width: 200
  },
  {
    label: '是否试乘试驾',
    field: 'testDrive',
    isSearch: true,
    width: 200
  },
  {
    label: '是否下订',
    field: 'placeOrderStatus',
    isSearch: true,
    width: 200
  },
  {
    label: '是否关联微信',
    field: 'isLinkWechat',
    isSearch: true,
    width: 200
  },
  {
    label: '是否下载万车利-',
    field: 'receptionStatus',
    isSearch: true,
    width: 200
  },
  {
    label: '画像因子评级',
    field: 'portraitFactorLevel',
    isSearch: true,
    width: 200
  },
  {
    label: '接待状态',
    field: 'receptionStatus',
    isSearch: true,
    width: 200
  },
  {
    label: '回访满意度-',
    field: 'portraitFactorStatus',
    isSearch: true,
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
