<template>
  <form-table
    ref="tableRef"
    :form-options="{ schema: allSchemas.searchSchema }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: dispatchApi.getClueDistributeRule,
      showAdd: hasPermission('dispatch-strategy-config:distribute-rule:add'),
      actionButtons
    }"
    @add="addRule"
  >
    <template #openRules="{ row }">
      <el-switch
        :disabled="!hasPermission('dispatch-strategy-config:distribute-rule:edit')"
        v-model="row.openRules"
        :active-value="1"
        :inactive-value="0"
        @click.stop
        @change="changeOpenRules(row)"
      />
    </template>
  </form-table>
  <Crud ref="crudRef" @refresh="refresh" />
</template>

<script setup lang="ts" name="dispatchRule">
import { computed } from 'vue'
import { TableColumn } from '@/types/table'
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import Crud from './components/crud.vue'
import { formatDate } from '@/utils/formatTime'
import { hasPermission } from '@/utils/utils'
import { useCommonList } from '@/hooks/web/useCommonList'

// onMounted(() => {
//   getShopList()
// })
const message = useMessage()
const refresh = () => {
  tableRef.value.tableMethods.getList()
}
const { getSuitableShopList } = useCommonList()

// 获取门店数据
const shopTreeList = ref(getSuitableShopList())

const tableRef = ref()

const columns: TableColumn[] = [
  {
    label: '考核规则名称',
    field: 'name',
    isSearch: true,
    isTable: false
  },
  {
    label: '门店',
    field: 'shopId',
    isSearch: true,
    isTable: false,
    search: {
      component: 'Cascader',
      componentProps: {
        filterable: true,
        clearable: true,
        options: computed(() => shopTreeList.value),
        props: {
          label: 'name',
          value: 'id',
          emitPath: false
        }
      }
    }
  },
  {
    label: '规则名称',
    field: 'distributeRuleName'
  },
  {
    label: '适用门店',
    field: 'applicableShopName'
  },
  {
    label: '状态',
    field: 'openRules'
  },
  {
    label: '创建人',
    field: 'creator'
  },
  {
    label: '创建时间',
    field: 'createTime',
    search: {
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD hh:mm:ss'
      }
    },
    formatter: (_, __, val: string) => {
      return formatDate(new Date(val))
    }
  }
]

const actionButtons = [
  {
    name: '编辑',
    permission: hasPermission('dispatch-strategy-config:distribute-rule:edit'),
    click: (row) => {
      crudRef.value.openDialog(row.id)
    }
  },
  {
    name: '删除',
    permission: hasPermission('dispatch-strategy-config:distribute-rule:delete'),
    click: (row) => {
      delClueDistributeRule(row.id)
    }
  }
]
const delClueDistributeRule = async (id: string) => {
  await dispatchApi.delClueDistributeRule(id)
  message.success('删除成功')
  refresh()
}
const crudRef = ref()
const addRule = async () => {
  crudRef.value.openDialog('')
}
const changeOpenRules = (row) => {
  if (!row.id) return
  dispatchApi.changeClueDistributeRule(row.id, row.openRules)
}
const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped></style>
