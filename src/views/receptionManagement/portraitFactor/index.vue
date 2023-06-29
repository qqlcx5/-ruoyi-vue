<template>
  <div class="portrait-factor">
    <form-table
      title="画像因子等级配置"
      ref="tableRef"
      @add="handleAdd"
      :form-options="{
        isSearch: false
      }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi: portraitFactor.portraitFactorLevelConfigAllListApi,
        showAdd: true,
        selection: true
      }"
    >
      <template #tableAppend>
        <XButton @click="handleDel"> 删除</XButton>
      </template>
      <!-- 画像因子得分区间 -->
      <template #score="{ row }"> {{ row.lowestScore }} - {{ row.topScore }} </template>

      <template #action="{ row }">
        <!-- 操作：修改 -->
        <XTextButton :title="t('action.modify')" @click="handleModify(row)" />
      </template>
    </form-table>
    <addedPortraitFactor v-model="addTypeVisible" @refresh="handleRresh" />
  </div>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import * as portraitFactor from '@/api/receptionManagement/portraitFactor'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import addedPortraitFactor from './components/addedPortraitFactor.vue'
const message = useMessage()
const { t } = useI18n()
let tableRef = ref()
const selectedIds = ref<number[]>([])

const columns: TableColumn[] = [
  {
    label: '画像因子得分区间',
    field: 'score'
  },
  {
    label: '对应评级名称',
    field: 'level'
  },
  {
    label: '创建人',
    field: 'createBy'
  },
  {
    label: '创建时间',
    field: 'createTime'
  },
  {
    label: '操作',
    field: 'action',
    showOverflowTooltip: false
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
  let res = await portraitFactor.portraitFactorLevelConfigBatchDeleteApi(params)
  if (res) {
    message.success('删除成功')
    tableRef.value.tableMethods.getList()
  } else {
    message.error('报错了')
  }
}

function handleModify(row) {
  console.log('handleModify', row)
}

const { allSchemas } = useCrudSchemas(columns)
</script>
