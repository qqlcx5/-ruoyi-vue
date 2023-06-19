<template>
  <form-table
    ref="table"
    :form-options="{ schema: allSchemas.searchSchema }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: getTable,
      showAdd: true,
      actionButtons,
      selection: true,
      spanMethod: objectSpanMethod
    }"
  />
</template>

<script setup lang="ts" name="dispatchMember">
import { TableColumn } from '@/types/table'
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getAllStoreList } from '@/api/system/organization'
import { listToTree } from '@/utils/tree'
import { computed, ref } from 'vue'

onMounted(() => {
  getShopList()
})

// 获取门店数据
const shopTreeList = ref<object[]>([])
const getShopList = async () => {
  const data = await getAllStoreList()
  shopTreeList.value = listToTree(data || [], { pid: 'parentId' })
}

let mergeItems = [
  {
    columnIndex: 1,
    spanArr: [],
    pos: 0,
    prop: 'branchName'
  },
  {
    columnIndex: 2,
    spanArr: [],
    pos: 0,
    prop: 'distributeShopName'
  }
]
const getTable = (params) => {
  return dispatchApi.clueDistributeUser(params).then((data) => {
    getSpanArr(data.list, mergeItems)
    return data
  })
}
const objectSpanMethod = ({ rowIndex, columnIndex }) => {
  if (columnIndex === 1 || columnIndex === 2) {
    // 判断第几列需要合并
    let item = mergeItems.find((item) => item.columnIndex === columnIndex)
    const _row = item?.spanArr[rowIndex] || 0
    const _col = _row > 0 ? 1 : 0
    return {
      rowspan: _row,
      colspan: _col
    }
  }
}

const getSpanArr = (data, array) => {
  for (let n = 0; n < array.length; n++) {
    array[n].spanArr = []
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        array[n].spanArr.push(1)
        array[n].pos = 0
      } else {
        // 判断当前元素与上个元素是否相同
        if (data[i][array[n].prop] === data[i - 1][array[n].prop]) {
          array[n].spanArr[array[n].pos] += 1
          array[n].spanArr.push(0)
        } else {
          array[n].spanArr.push(1)
          array[n].pos = i
        }
      }
    }
  }
}
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
    label: '销售品牌',
    field: 'brandId',
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

const actionButtons = [
  {
    name: '编辑',
    permission: true,
    click: () => {
      console.log('新增')
    }
  },
  {
    name: '删除',
    permission: true,
    click: () => {
      console.log('删除')
    }
  }
]

const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped></style>
