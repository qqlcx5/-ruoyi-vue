<template>
  <div class="prompt-configuration">
    <!-- 成员端、管理端、客户端  memberSide、managementEnd、client -->
    <el-tabs type="border-card" v-model="tabsName">
      <el-tab-pane label="通用提示配置" name="currency"></el-tab-pane>
      <el-tab-pane label="必讲项提示配置" name="needlessToSay"></el-tab-pane>
    </el-tabs>
    <form-table
      ref="tableRef"
      @add="handleAdd"
      @selection-change="handleSelectionChange"
      :form-options="{
        schema: allSchemas.searchSchema
      }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi: getConfigPageApi,
        showAdd: true,
        selection: true
      }"
    >
      <template #tableAppend>
        <XButton @click="handleDel"> 删除</XButton>
        <!-- 提示类型配置 -->
        <XButton @click="handlePrompt"> 提示类型配置</XButton>
      </template>

      <template #action="{ row }">
        <!-- 操作：修改 -->
        <XTextButton :title="t('action.edit')" @click="handleEdit(row)" />
      </template>

      <template #visible="{ row }">
        <el-switch v-model="row.visible" :active-value="true" :inactive-value="false" />
      </template>
      <template #prompt="{ row }">
        <el-button type="primary" link @click="handlePreview(row)">预览</el-button>
      </template>
    </form-table>
    <!-- 新增-通用提示 -->
    <newGeneralReminderModal v-model="newGeneralVisible" />
    <promptTypeConfigModal v-model="promptTypeVisible" />
  </div>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { getConfigPageApi } from '@/api/infra/config'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import newGeneralReminderModal from './components/newGeneralReminderModal.vue'
import promptTypeConfigModal from './components/promptTypeConfigModal.vue'
import { ElTable } from 'element-plus'

const { t } = useI18n()
let tabsName = ref('currency')
const columns: TableColumn[] = [
  {
    label: '提示标题',
    field: 'id',
    isSearch: true
  },
  {
    label: '提示类型',
    field: 'category'
  },
  {
    label: '提示内容',
    field: 'prompt'
  },
  {
    label: '适用品牌',
    field: 'key'
  },
  {
    label: '适用车系车型',
    field: 'value'
  },
  {
    label: '适用门店',
    field: 'type'
  },
  {
    label: '状态',
    field: 'visible'
  },
  {
    label: '创建人',
    field: 'creator'
  },
  {
    label: '创建时间',
    field: 'updater'
  },
  {
    label: t('common.createTime'),
    field: 'createTime'
  },
  {
    label: '操作',
    field: 'action',
    showOverflowTooltip: false
  }
]
let newGeneralVisible = ref(false) // 新增通用提示
let promptTypeVisible = ref(false) // 提示类型配置
let tableRef = ref<InstanceType<typeof ElTable>>()
// 操作：新增
async function handleAdd() {
  const list = await tableRef.value?.tableMethods?.getSelections()
  console.log('add', list)
  newGeneralVisible.value = true
}

// 操作：删除
function handleDel() {
  console.log('del')
}

// 操作：提示类型配置
function handlePrompt() {
  console.log('prompt111')
  promptTypeVisible.value = true
}

// 操作：修改
function handleEdit(row) {
  console.log('edit', row)
}

// 操作：预览
function handlePreview(row) {
  console.log('preview', row)
}
function handleSelectionChange(row) {
  console.log('handleSelectionChange', row)
}

const { allSchemas } = useCrudSchemas(columns)
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
