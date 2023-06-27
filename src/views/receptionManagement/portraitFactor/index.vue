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
        listApi: promptConfig.portraitFactorLevelConfigAllListApi,
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
    <addedPortraitFactor v-model="addTypeVisible" />
  </div>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import * as promptConfig from '@/api/receptionManagement/promptConfig'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import addedPortraitFactor from './components/addedPortraitFactor.vue'
const { t } = useI18n()
let tableRef = ref()
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
  const list = await tableRef.value?.tableMethods?.getSelections()
  addTypeVisible.value = true
  console.log('🚀 ~ file: index.vue:68 ~ handleAdd ~ list:', list)
}

// 操作：删除
function handleDel() {
  console.log('del')
}

function handleModify(row) {
  console.log('handleModify', row)
}

const { allSchemas } = useCrudSchemas(columns)
</script>
