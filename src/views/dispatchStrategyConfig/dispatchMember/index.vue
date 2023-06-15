<template>
  <form-table
    ref="table"
    :form-options="{ schema: allSchemas.searchSchema }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: dispatchApi.clueDistributeUser,
      showAdd: true
    }"
  >
    <template #tableAppend>
      <XButton type="danger" :title="t('action.delete')" @click="addMember" />
    </template>
    <template #action>
      <!--      编辑-->
      <XTextButton :title="t('action.edit')" />
      <!--      删除-->
      <XTextButton :title="t('action.del')" />
    </template>
  </form-table>
</template>

<script setup lang="ts" name="dispatchMember">
import { TableColumn } from '@/types/table'
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const { t } = useI18n()

const columns: TableColumn[] = [
  {
    label: '分公司',
    field: 'branchName'
  },
  {
    label: '门店',
    field: 'distributeShopName'
  },
  {
    label: '派发成员',
    field: 'distributeUserName'
  },
  {
    label: '成员平台昵称',
    field: 'nickname'
  },
  {
    label: '派单状态',
    field: 'status'
  },
  {
    label: '跟进是否回推厂家',
    field: 'pushBackFactoryStatus'
  },
  {
    label: '是否开启请假功能',
    field: 'isEnableLeaveFunc'
  },
  {
    label: '成员姓名',
    field: 'username',
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
      componentProps: {}
    }
  },
  {
    label: '销售品牌',
    field: 'brandId',
    isSearch: true,
    isTable: false,
    search: {
      component: 'Cascader',
      componentProps: {}
    }
  },
  {
    label: '销售品牌',
    field: 'autoBrandNames'
  },
  {
    label: '销售车系',
    field: 'autoSeriesNames'
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
    field: 'action'
  }
]

const addMember = () => {}

const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped></style>
