<template>
  <form-table
    ref="tableRef"
    :form-options="{ schema: allSchemas.searchSchema }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: getTable,
      showAdd: true,
      actionButtons,
      selection: true,
      spanMethod: objectSpanMethod,
      cellClassName: tableRowClassName,
      border: true
    }"
    @add="addMember"
  >
    <template #tableAppend>
      <XButton type="danger" @click="handleDel">删除</XButton>
    </template>
  </form-table>
  <crud ref="crudRef" @refresh-list="refreshList" />
</template>

<script setup lang="ts" name="dispatchMember">
import { TableColumn } from '@/types/table'
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ref } from 'vue'
import { formatDate } from '@/utils/formatTime'
import crud from '@/views/dispatchStrategyConfig/dispatchStrategy/crud.vue'

import { useCommonList } from '@/hooks/web/useCommonList'
const { getSuitableShopList } = useCommonList()

const message = useMessage()
const { t } = useI18n() // 国际化

const tableRef = ref()
// 获取门店数据
const shopTreeList = ref(getSuitableShopList())

const refreshList = () => {
  console.log(tableRef.value.tableMethods)
  tableRef.value.tableMethods.getList()
}

const getTable = (params) => {
  return dispatchApi.getClueDistribute(params).then((data) => {
    // data = dispatch_strategy_res.data
    data.list = data.list || []
    let newArr: any[] = []
    data.list.forEach((item: any, index) => {
      item.index = index + 1
      item.distributeShopListCount = item.distributeShopList.length
      if (item.distributeShopList.length > 0) {
        item.distributeShopList.forEach((aItem, aIndex) => {
          item.isMergeTool = false
          if (aIndex == 0) {
            item.isMergeTool = true
          }
          item = {
            ...item,
            ...aItem
          }
          newArr.push(JSON.parse(JSON.stringify(item)))
        })
      } else {
        item.isMergeTool = false
        newArr.push(JSON.parse(JSON.stringify(item)))
      }
    })
    data.list = newArr

    return data
  })
}
const objectSpanMethod = ({ row, column }) => {
  let property: string = column.property || ''
  let isTool: boolean = [
    '',
    'id',
    'clueChannelName',
    'parentName',
    'filterUserName',
    'receivePattern',
    'createBy',
    'createTime',
    'shopName',
    'action'
  ].includes(property) //需要合并的字段
  // ----------皮卡丘------------
  let num = row.distributeShopList.length
  if (isTool && num > 0) {
    if (row.isMergeTool) {
      return {
        rowspan: num,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

const tableRowClassName = ({ row, column }): string => {
  let num = row.distributeShopList.length
  let property: string = column.property || ''
  let isTool: boolean = [
    'distributeShopName',
    'distributeUserNum',
    'status'
    // 'isExternalDistribute'
  ].includes(property) //需要合并的字段
  if (isTool && num > 1) {
    return 'hide-border-right'
  }
  return ''
}

// 获取线索渠道
let clueChannelTreeList = ref<any[]>([])
const getShopUserList = async () => {
  let data = await dispatchApi.getClueChannelTree()
  if (data && data.length > 0) {
    data = data.map((item) => {
      item.label = item.companyShopName
      item.value = ''
      item.children = item.list.map((lItem) => {
        lItem.label = lItem.sourceName
        lItem.value = lItem.clueChannelId
        return lItem
      })
      return item
    })
    clueChannelTreeList.value = data
  }
}
getShopUserList()
const columns: TableColumn[] = [
  {
    label: '线索平台来源',
    field: 'clueChannelId',
    isSearch: true,
    isTable: false,
    search: {
      component: 'Cascader',
      componentProps: {
        filterable: true,
        clearable: true,
        options: computed(() => clueChannelTreeList.value),
        props: {
          label: 'label',
          value: 'value',
          emitPath: false
        }
      }
    }
  },
  {
    label: '派发门店',
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
    label: '线索平台来源',
    field: 'clueChannelName',
    disabled: true
  },
  {
    label: '所属区域/门店',
    field: 'parentName',
    disabled: true,
    formatter: (_, __, val: string) => {
      console.log(_, __, val)

      return `${_.parentName} - ${_.shopName}`
    }
  },
  // {
  //   label: '开通门店',
  //   field: 'shopName'
  // },
  {
    label: '线索清洗员',
    field: 'filterUserName'
  },
  {
    label: '派发门店',
    field: 'distributeShopName',
    disabled: true
  },
  {
    label: '实际派发成员数',
    field: 'distributeUserNum'
  },
  {
    label: '是否派发',
    field: 'status'
  },
  {
    label: '是否外部派发',
    field: 'isExternalDistribute'
  },
  {
    label: '创建人',
    field: 'createBy'
  },
  {
    label: '创建时间',
    field: 'createTime',
    formatter: (_, __, val: string) => {
      return formatDate(new Date(val))
    }
  }
]

const actionButtons = [
  {
    name: '编辑',
    permission: true,
    click: (row) => {
      editMember(row)
    }
  },
  {
    name: '删除',
    permission: true,
    click: (row) => {
      selectedIds.value = [row.id]
      confirmDel()
    }
  }
]

const selectedIds = ref<number[]>([])

const crudRef = ref()
const addMember = () => {
  crudRef.value.openDialog('create')
}
const editMember = (row) => {
  crudRef.value.openDialog('update', row)
}
const handleDel = async () => {
  const res = await tableRef.value.tableMethods.getSelections()
  if (res) {
    selectedIds.value = res.map((item) => item.id)
  }
  if (selectedIds.value.length < 1) {
    return message.warning('未选择数据')
  }
  confirmDel()
}
const confirmDel = () => {
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
    ' 条派发策略吗？'
  ])
  message
    .wgConfirm('删除后，对应派发员将无法接受到线索派发', contentStr, buttonConfig)
    .then(() => {
      deleteFun()
    })
    .catch(() => {})
}
const deleteFun = async () => {
  let params = {
    ids: selectedIds.value.join(',')
  }
  console.log(params)
  const res = await dispatchApi.delStrategy(params)
  if (res) {
    message.success('删除成功')
    refreshList()
  } else {
    message.error('报错了')
  }
}
const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped>
:deep(.hide-border-right) {
  border-right: 0;
}
</style>
