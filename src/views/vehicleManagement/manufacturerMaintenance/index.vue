<template>
  <div class="portrait-factor">
    <form-table
      title="厂家名称维护"
      ref="tableRef"
      @add="handleAdd"
      :form-options="{
        schema: allSchemas.searchSchema
      }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi: portraitFactor.portraitFactorLevelConfigAllListApi,
        showAdd: true,
        selection: true
      }"
    >
      <template #tableAppend>
        <XButton @click="handleDel"> 导出</XButton>
        <XButton @click="handleDel"> 导入</XButton>
      </template>
      <template #score="{ row }"> {{ row.lowestScore }} - {{ row.topScore }} </template>

      <template #action="{ row }">
        <!-- 操作：修改 -->
        <XTextButton :title="t('action.modify')" @click="handleModify(row)" />
        <XTextButton :title="t('action.del')" @click="handleDel(row)" />
      </template>
    </form-table>
    <newManufacturerForm ref="newManufacturerRef" v-model="newManufacturer" />
  </div>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import * as portraitFactor from '@/api/receptionManagement/portraitFactor'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import newManufacturerForm from './components/newManufacturerForm.vue'

const message = useMessage()
const { t } = useI18n()
let tableRef = ref()
const selectedIds = ref<number[]>([])

const columns: TableColumn[] = [
  {
    label: '厂家名称',
    field: 'score',
    isSearch: true
  },
  {
    label: '厂家编号',
    field: 'level',
    isSearch: true
  },
  {
    label: '系统厂家编号',
    field: 'creator'
  },
  {
    label: '自定义厂家编号',
    field: 'createTime'
  },
  {
    label: '状态',
    field: 'createTime',
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        filterable: true,
        clearable: true,
        options: [
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 0
          }
        ]
      }
    }
  },
  {
    label: '创建人',
    field: 'createTime'
  },
  {
    label: '创建时间',
    field: 'createTime'
  },
  {
    label: '最近操作人',
    field: 'createTime'
  },
  {
    label: '最近操作时间',
    field: 'createTime'
  },
  {
    label: '操作',
    field: 'action',
    showOverflowTooltip: false
  }
]
let newManufacturer = ref(false) // 新增类型弹窗
// 操作：新增
async function handleAdd() {
  newManufacturer.value = true
}
// 操作：刷新
// function handleRresh() {
//   tableRef.value.tableMethods.getList()
// }

// 操作：删除
async function handleDel(row) {
  console.log('🚀 ~ file: index.vue:119 ~ handleDel ~ row:', row)
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
// 操作：修改
let addRef = ref()
function handleModify(row) {
  addRef.value.openModal(true, row)
}

const { allSchemas } = useCrudSchemas(columns)
</script>
