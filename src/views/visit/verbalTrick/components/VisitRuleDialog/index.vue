<template>
  <Dialog
    class="wg-dialog"
    v-model="dialogVisible"
    title="选择回访规则"
    width="1000px"
    :close-on-click-modal="false"
    @confirm="confirm"
    @cancel="cancel"
  >
    <div class="pb-50px">
      <form-table
        ref="tableRef"
        :form-options="{
          isSearch: false
        }"
        :table-options="{
          columns: allSchemas.tableColumns,
          listApi: visitList,
          showAdd: false,
          showTools: false,
          rowKey: 'id'
        }"
      >
        <template #canChoose="{ row }">
          <el-tag class="ml-2" :type="!row.canChoose ? 'success' : 'danger'">
            {{ !row.canChoose ? '已关联' : '未关联' }}
          </el-tag>
        </template>
        <template #isBinded="{ row }">
          <el-tag class="ml-2" :type="row.isBinded ? 'success' : 'danger'">
            {{ row.isBinded ? '已关联' : '未关联' }}
          </el-tag>
        </template>
      </form-table>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { visitList } from '@/api/visit'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getDictLabel } from '@/utils/dict'

const emit = defineEmits(['confirm'])
const props = defineProps({
  businessType: { type: String }
})
const dialogVisible = ref<boolean>(false)
const tableRef = ref()
const columns: TableColumn[] = [
  {
    label: '',
    field: 's',
    type: 'selection',
    reserveSelection: true,
    selectable: (row) => {
      return selectable(row)
    }
  },
  {
    label: props.businessType === 'receptionRecord' ? '关联通话录音' : '关联话术',
    field: props.businessType === 'receptionRecord' ? 'isBinded' : 'canChoose'
  },
  {
    label: '回访类型',
    field: 'visitSettingTypeStr',
    width: 140
  },
  {
    label: '回访目的',
    field: 'visitSettingPurposeStr',
    width: 140
  },
  {
    label: '回访岗位',
    field: 'roleName'
  },
  {
    label: '分配岗位',
    field: 'distributeRoleList',
    width: 140,
    formatter: (_, __, val) => {
      return val.map((i) => i.value) || []
    }
  },
  {
    label: '回访对象',
    field: 'visitObject',
    width: 140,
    formatter: (_, __, val) => {
      return getDictLabel('visit_object', val) || ''
    }
  },
  {
    label: '参考时间',
    field: 'originTimeTypeStr',
    width: 140
  },
  {
    label: '计划回访时间T+N(天数)',
    field: 'visitLimitDay',
    width: 180
  }
]
const { allSchemas } = useCrudSchemas(columns)

const selectable = (row) => {
  if (props.businessType === 'receptionRecord') {
    return !row.isBinded
  } else {
    return row.canChoose
  }
}

const openDialog = async (data?) => {
  if (data) console.log(data)
  dialogVisible.value = true
}

const confirm = async () => {
  const selectedData = await tableRef.value.tableMethods.getSelections()
  if (selectedData.length > 0) {
  }
  emit('confirm', selectedData)
  dialogVisible.value = false
}
const cancel = () => {
  dialogVisible.value = false
}

defineExpose({ openDialog }) // 提供 openModal 方法，用
</script>

<style lang="scss" scoped></style>
