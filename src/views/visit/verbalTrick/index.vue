<template>
  <form-table
    ref="tableRef"
    :form-options="{
      schema: allSchemas.searchSchema
    }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: visitContentList,
      actionButtons,
      showAdd: false,
      selection: true,
      reserveSelection: true,
      rowKey: 'id'
    }"
  >
    <template #tableAppend>
      <XButton type="primary" icon-font="icon-xinzeng" title="新增" @click="handleCreate()" />
      <el-button @click="handleDelete()">删除</el-button>
    </template>

    <!--    <template #form-organizationIds="{ model }"> </template>-->

    <template #visitContent="{ row }">
      <el-tooltip placement="right">
        <template #content>
          <div v-html="row.visitContent"></div>
        </template>
        <el-link type="primary" :underline="false">预览</el-link>
      </el-tooltip>
    </template>
    <template #visitSettingType="{ row }">
      <div class="table-block">
        <div v-for="item in row.visitSettingContentRelate" :key="item.id">
          {{ formatSheet(item.visitSettingType, 'visitSettingType') }}
        </div>
      </div>
    </template>
    <template #visitSettingPurpose="{ row }">
      <div class="table-block">
        <div v-for="item in row.visitSettingContentRelate" :key="item.id">
          {{ item.visitPurposeContent }}
        </div>
      </div>
    </template>
    <template #roleName="{ row }"
      ><div class="table-block">
        <div v-for="item in row.visitSettingContentRelate" :key="item.id">
          {{ item.roleName }}
        </div>
      </div></template
    >
    <template #distributeRoleList="{ row }"
      ><div class="table-block">
        <div v-for="item in row.visitSettingContentRelate" :key="item.id">
          {{ formatSheet(item.distributeRole, 'distributeRoleList') }}
        </div>
      </div></template
    >
    <template #visitObject="{ row }">
      <div class="table-block">
        <div v-for="item in row.visitSettingContentRelate" :key="item.id">
          {{ getDictLabel('visit_object', item.visitObject) || '' }}
        </div>
      </div>
    </template>
    <template #originTimeTypeStr="{ row }">
      <div class="table-block">
        <div v-for="item in row.visitSettingContentRelate" :key="item.id">
          {{ formatSheet(item.originTimeType, 'originTimeType') }}
        </div>
      </div>
    </template>
    <template #visitLimitDay="{ row }">
      <div class="table-block">
        <div v-for="item in row.visitSettingContentRelate" :key="item.id">
          {{ item.visitLimitDay }}
        </div>
      </div>
    </template>
  </form-table>
  <VerbalTrickDialog ref="verbalTrickDialogRef" @success="reload" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getDictLabel } from '@/utils/dict'
import { TableColumn } from '@/types/table'
import {
  visitContentList,
  visitContentDelete,
  getVisitTypeList,
  getVisitPurposeList,
  getVisitLimitDay,
  getOriginTimeTypeList
} from '@/api/visit'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import VerbalTrickDialog from './components/VerbalTrickDialog/index.vue'

const message = useMessage()

const tableRef = ref()
const verbalTrickDialogRef = ref()
const visitConfig = reactive({
  options: {
    type: [],
    purpose: [],
    limitDay: [],
    originTimeType: []
  }
})

const columns = reactive<TableColumn[]>([
  {
    label: '计划回访时间',
    field: 'visitLimitDay',
    isTable: false,
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        filterable: true,
        clearable: true,
        options: computed(() => visitConfig.options.limitDay)
      }
    }
  },
  {
    label: '回访话术内容',
    field: 'visitContent',
    width: 120
  },
  {
    label: '回访类型',
    field: 'visitSettingType',
    width: 140,
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        filterable: true,
        clearable: true,
        options: computed(() => visitConfig.options.type),
        props: {
          label: 'value',
          value: 'key',
          emitPath: false
        }
      }
    }
  },
  {
    label: '回访目的',
    field: 'visitSettingPurpose',
    width: 140,
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        filterable: true,
        clearable: true,
        options: computed(() => visitConfig.options.purpose),
        props: {
          label: 'value',
          value: 'key',
          emitPath: false
        }
      }
    }
  },
  {
    label: '回访岗位',
    field: 'roleName',
    isSearch: true
  },
  {
    label: '分配岗位',
    field: 'distributeRoleList'
  },
  {
    label: '回访对象',
    field: 'visitObject',
    width: 140
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
])
const actionButtons = [
  {
    name: '编辑',
    click: (row) => {
      verbalTrickDialogRef.value.openDialog(formatEditData(row))
    }
  },
  {
    name: '删除',
    click: (row) => {
      handleDelete(row.id)
    }
  }
]
let { allSchemas } = useCrudSchemas(columns)

const formatSheet = (val, key) => {
  if (key === 'visitSettingType') {
    const res = visitConfig.options.type.find((i) => i['key'] == val)
    return res ? res['value'] : ''
  } else if (key === 'originTimeType') {
    const res = visitConfig.options.originTimeType.find((i) => i['key'] == val)
    return res ? res['value'] : ''
  } else if (key === 'distributeRoleList') {
    try {
      return val
        ? JSON.parse(val)
            .map((item) => item.value)
            .join('，')
        : ''
    } catch (e) {
      return ''
    }
  }
}

const formatEditData = (record) => {
  let originTimeTypeMap = {}
  let visitTypeMap = {}
  for (const originTimeTypeItem of visitConfig.options.originTimeType) {
    originTimeTypeMap[originTimeTypeItem['key']] = originTimeTypeItem['value']
  }
  for (const visitTypeItem of visitConfig.options.type) {
    visitTypeMap[visitTypeItem['key']] = visitTypeItem['value']
  }
  record.visitSettingContentRelate.map((item) => {
    item['distributeRoleList'] = item.distributeRole ? JSON.parse(item.distributeRole) : []
    item['visitSettingPurposeStr'] = item.visitPurposeContent
    item['originTimeTypeStr'] = originTimeTypeMap[item.visitObject]
    item['visitSettingTypeStr'] = visitTypeMap[item.visitSettingType]
    return item
  })
  return record
}

const reload = () => {
  tableRef.value.tableMethods.getList()
}

const handleCreate = () => {
  verbalTrickDialogRef.value.openDialog()
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
        visitSettingContentIdList: id
          ? [id]
          : await tableRef.value.tableMethods.getSelections().map((i) => i.id)
      }
      const res = await visitContentDelete(params)
      if (res) {
        message.success('删除成功')
        await tableRef.value.tableMethods.getList()
      } else {
        message.error('删除失败')
      }
    })
    .catch(() => {})
}
onMounted(async () => {
  await Promise.all([
    getVisitTypeList(),
    getVisitPurposeList(0, 1),
    getVisitLimitDay(),
    getOriginTimeTypeList()
  ]).then((res) => {
    visitConfig.options.type = res[0]
    visitConfig.options.purpose = res[1]
    visitConfig.options.limitDay = res[2].map((i) => {
      return { label: `T+${i.visitLimitDay}`, value: i.visitLimitDay }
    })
    visitConfig.options.originTimeType = res[3]
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
