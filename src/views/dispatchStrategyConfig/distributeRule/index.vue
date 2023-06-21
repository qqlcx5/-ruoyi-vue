<template>
  <form-table
    ref="tableRef"
    :form-options="{ schema: allSchemas.searchSchema }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: dispatchApi.getClueDistributeRule,
      delApi: dispatchApi.delClueDistributeRule,
      showAdd: true,
      actionButtons
    }"
    @add="addRule"
  >
    <template #openRules="{ row }">
      <el-switch
        v-model="row.openRules"
        :active-value="1"
        :inactive-value="0"
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
import { getAllStoreList } from '@/api/system/organization'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { listToTree } from '@/utils/tree'
import Crud from './components/crud.vue'

onMounted(() => {
  getShopList()
})

const refresh = () => {
  tableRef.value.tableMethods.reload()
}
// 获取门店数据
const shopTreeList = ref<object[]>([])
const getShopList = async () => {
  const data = await getAllStoreList()
  shopTreeList.value = listToTree(data || [], { pid: 'parentId' })
}

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
    field: 'createTime'
  }
]

// const columns = ref<TableColumn[]>()

const actionButtons = [
  {
    name: '编辑',
    click: (row) => {
      crudRef.value.openDialog(row.id, shopTreeList.value)
    }
  },
  {
    name: '删除',
    click: () => {
      console.log('删除')
    }
  }
]

const crudRef = ref()
const addRule = async () => {
  crudRef.value.openDialog('', shopTreeList.value)
}
const changeOpenRules = (row) => {
  console.log(11, row)
  dispatchApi.changeClueDistributeRule(row.id, row.openRules).then((res) => {
    console.log(res)
  })
}
const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped></style>
