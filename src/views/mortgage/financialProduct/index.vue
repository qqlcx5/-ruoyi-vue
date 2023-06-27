<template>
  <form-table
    ref="tableRef"
    :form-options="{
      schema: allSchemas.searchSchema
    }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: mortgageFinancePage,
      showAdd: true,
      selection: true
    }"
  >
    <template #tableAppend>
      <XButton title="删除" />
    </template>
    <template #form-searchKey="{ model }">
      <el-input
        v-model="model.searchKey"
        placeholder="请输入按揭银行名称、联系人、最近操作人进行搜索"
        style="width: 360px"
      />
    </template>
    <template #action>
      <!-- 操作：修改 -->
      <XTextButton title="修改" />
      <!-- 操作：详情 -->
      <XTextButton title="删除" />
    </template>
    <template #financeStatus="{ row }">
      <el-switch v-model="row.financeStatus" :active-value="1" :inactive-value="0" />
    </template>
  </form-table>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { mortgageFinancePage } from '@/api/mortgage'
import { useCommonList } from '@/hooks/web/useCommonList'
const { getSuitableShopList } = useCommonList()
const shopList = ref(getSuitableShopList())
const columns: TableColumn[] = [
  {
    label: '所属资金方',
    field: 'mortgageFinanceIds',
    width: 150,
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        filterable: true,
        multiple: true,
        clearable: true
      }
    }
  },
  { label: '金融产品名称', field: 'provinceName', width: 110 },
  {
    label: '金融产品类别',
    field: 'productType',
    width: 110,
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        filterable: true,
        multiple: true,
        clearable: true
      }
    }
  },
  {
    label: '',
    field: 'searchKey',
    isTable: false,
    isSearch: true
  },
  { label: '金融产品明细', field: 'countyName', width: 110 },
  {
    label: '适用门店',
    field: 'shopIds',
    width: 110,
    isSearch: true,
    search: {
      component: 'Cascader',
      componentProps: {
        filterable: true,
        clearable: true,
        'collapse-tags': true,
        'collapse-tags-tooltip': true,
        options: computed(() => shopList.value),
        props: {
          label: 'name',
          value: 'id',
          multiple: true,
          emitPath: false
        }
      }
    }
  },
  {
    label: '使用门店',
    field: 'useShopIds',
    width: 110,
    isSearch: true,
    search: {
      component: 'Cascader',
      componentProps: {
        filterable: true,
        clearable: true,
        'collapse-tags': true,
        'collapse-tags-tooltip': true,
        options: computed(() => shopList.value),
        props: {
          label: 'name',
          value: 'id',
          multiple: true,
          emitPath: false
        }
      }
    }
  },

  {
    label: '开启状态',
    field: 'financeStatus',
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        filterable: true,
        clearable: true,
        options: [
          { label: '开启', value: 1 },
          { label: '关闭', value: 0 }
        ]
      }
    }
  },
  {
    label: '操作',
    field: 'action',
    width: 160,
    showOverflowTooltip: false
  }
]

const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped>
:deep(.el-cascader) {
  .el-cascader__search-input {
    min-width: 20px;
  }
  .el-tag {
    max-width: 40%;
  }
}
</style>
