<template>
  <div class="prompt-configuration">
    <!-- 成员端、管理端、客户端  memberSide、managementEnd、client -->
    <el-tabs type="border-card" v-model="tabsName" @tab-change="handleTabChange">
      <el-tab-pane label="通用提示配置" name="currency"></el-tab-pane>
      <el-tab-pane label="必讲项提示配置" name="needlessToSay"></el-tab-pane>
    </el-tabs>
    <form-table
      ref="tableRef"
      @add="handleAdd"
      :form-options="{
        schema: allSchemas.searchSchema
      }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi,
        showAdd: true,
        selection: true
      }"
    >
      <!-- listApi: tabsName === 'currency' ? receptionHintConfigApi : receptionMustSayConfigApi, -->
      <template #tableAppend>
        <XButton @click="handleDel"> 删除</XButton>
        <!-- <XButton @click="handlePrompt"> 提示类型配置</XButton> -->
      </template>

      <!-- 操作：修改 -->
      <template #action="{ row }">
        <XTextButton :title="t('action.edit')" @click="handleEdit(row)" />
        <XTextButton :title="t('action.del')" @click="confirmDel(row)" />
      </template>

      <template #status="{ row }">
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
      </template>
      <!-- <template #content="{ row }">
        <span v-html="row.content"></span>
      </template> -->

      <template #content="{ row }">
        <el-button type="primary" link @click="handleEdit(row, 'preview')">预览</el-button>
      </template>
    </form-table>
    <!-- 新增-通用提示 新增-必讲项提示 -->
    <newGeneralReminderModal
      ref="newGeneralRef"
      v-model="newGeneralVisible"
      :mode="tabsName"
      @refresh="handleTabChange"
    />
    <!-- 提示类型配置 -->
    <promptTypeConfigModal v-model="promptTypeVisible" :mode="tabsName" />
    <!-- 预览 -->
    <previewModal v-model="previewVisible" :mode="tabsName" :info="infoRow" />
  </div>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import newGeneralReminderModal from './components/newGeneralReminderModal.vue'
import promptTypeConfigModal from './components/promptTypeConfigModal.vue'
import previewModal from './components/previewModal.vue'
import * as promptConfig from '@/api/receptionManagement/promptConfig'
const message = useMessage()
const { t } = useI18n()
let tabsName = ref('currency')
const columns: TableColumn[] = [
  {
    label: '提示标题',
    field: 'title',
    isSearch: true
  },
  {
    label: '提示类型',
    field: 'hintTypeName'
  },
  {
    label: '提示内容',
    field: 'content'
  },
  {
    label: '适用品牌',
    field: 'applyBrandName'
  },
  {
    label: '适用车系车型',
    field: 'applyModelName'
  },
  {
    label: '适用门店',
    field: 'applyShopName'
  },
  {
    label: '状态',
    field: 'status'
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
const { allSchemas } = useCrudSchemas(columns)

let newGeneralVisible = ref(false) // 新增通用提示
let promptTypeVisible = ref(false) // 提示类型配置
let previewVisible = ref(false) // 预览
const selectedIds = ref<number[]>([])
let tableRef = ref()
// 操作：新增
async function handleAdd() {
  newGeneralRef.value?.openModal(true)
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
  let res = null
  if (tabsName.value === 'currency') {
    res = await promptConfig.receptionHintConfigBatchDeleteApi(params)
  } else {
    res = await promptConfig.receptionMustSayConfigBatchDeleteApi(params)
  }

  if (res) {
    message.success('删除成功')
    tableRef.value.tableMethods.getList()
  } else {
    message.error('报错了')
  }
}

// 操作：提示类型配置
// function handlePrompt() {
//   promptTypeVisible.value = true
// }

// 操作：修改
const newGeneralRef = ref() // 表单 Ref
let infoRow = ref() // 详情
async function handleEdit(row, type = 'edit') {
  let res = null
  if (tabsName.value === 'currency') {
    res = await promptConfig.receptionHintConfigDetailApi(row.id)
  } else {
    res = await promptConfig.receptionMustSayConfigDetailApi(row.id)
  }
  infoRow.value = res
  type === 'edit' ? newGeneralRef.value?.openModal(true, res) : (previewVisible.value = true)
}

function listApi(params) {
  return tabsName.value === 'currency'
    ? promptConfig.receptionHintConfigApi(params)
    : promptConfig.receptionMustSayConfigPageApi(params)
}
// 切换tab
async function handleTabChange() {
  await tableRef.value?.tableMethods.getList()
}
</script>

<style lang="scss" scoped>
.prompt-configuration {
  // 影响到表单的样式
  :deep(.el-card) {
    border: none;
    border-radius: 0;
  }

  :deep(.el-tabs--border-card) {
    border: none;
  }
  :deep(.el-tabs__content) {
    display: none;
  }
  // 选中的样式
  :deep(.el-tabs--border-card > .el-tabs__header) {
    border-bottom: none;
    background-color: #f1f3f6;
  }

  :deep(.el-tabs__item) {
    position: relative;
    height: 50px;
    line-height: 50px;
    padding-left: 34px !important;
    padding-right: 34px !important;

    &.is-active {
      background-color: #fff;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #409eff;
      }
    }
  }
}
</style>
