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
  <el-dialog title="提示" v-model="delDialog" width="30%">
    <p class="mb10"
      ><i class="el-icon-warning Danger"></i>确认要删除这<span class="Danger">{{
        selectedIds.length
      }}</span
      >条派发策略吗？
    </p>
    <p>删除后，对应派发成员将无法接收到线索派发。</p>
    <template #footer>
      <el-button @click="delDialog = false">取 消</el-button>
      <el-button type="primary" @click="confirmDel">确 定</el-button>
    </template>
  </el-dialog>
  <crud ref="crudRef" @refresh="() => {}" />
</template>

<script setup lang="ts" name="dispatchMember">
import { TableColumn } from '@/types/table'
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getAllStoreList } from '@/api/system/organization'
import { listToTree } from '@/utils/tree'
import { ref } from 'vue'
import Crud from '@/views/dispatchStrategyConfig/dispatchStrategy/crud.vue'
import { dispatch_strategy_res } from './dispatchStrategy.data'

const message = useMessage()

onMounted(() => {
  getShopList()
})
const tableRef = ref()
// 获取门店数据
const shopTreeList = ref<object[]>([])
const getShopList = async () => {
  const data = await getAllStoreList()
  shopTreeList.value = listToTree(data || [], { pid: 'parentId' })
}

const getTable = (params) => {
  return dispatchApi.clueDistributeUser(params).then((data) => {
    data = dispatch_strategy_res.data
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
    'shopName'
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
const columns: TableColumn[] = [
  {
    label: '线索ID',
    field: 'id'
  },
  {
    label: '线索平台来源',
    field: 'clueChannelName',
    isSearch: true
  },
  {
    label: '所属区域',
    field: 'parentName'
  },
  {
    label: '线索清洗员',
    field: 'filterUserName'
  },
  {
    label: '派发门店',
    field: 'distributeShopName',
    isSearch: true,
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
    label: '接单模式',
    field: 'receivePattern'
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
    label: '开通门店',
    field: 'shopName'
  }
]

const actionButtons = [
  {
    name: '编辑',
    permission: true,
    click: (row) => {
      console.log(row)
      editMember(row.id)
    }
  },
  {
    name: '删除',
    permission: true,
    click: (row) => {
      selectedIds.value = [row.id]
      deleteFun()
    }
  }
]

const selectedIds = ref<number[]>([])

const crudRef = ref()
const addMember = () => {
  crudRef.value.openDialog('', shopTreeList.value)
}
const editMember = (id) => {
  crudRef.value.openDialog(id, shopTreeList.value)
}
const delDialog = ref(false)
const handleDel = async () => {
  const res = await tableRef.value.tableMethods.getSelections()
  if (res) {
    selectedIds.value = res.map((item) => item.id)
  }
  if (selectedIds.value.length < 1) {
    return message.warning('未选择数据')
  }
  delDialog.value = true
}
const confirmDel = () => {
  deleteFun()
}
const deleteFun = async () => {
  const res = await dispatchApi.batchDelClueDistributeUser({ ids: selectedIds.value })
  if (res) {
    message.success('删除成功')
    delDialog.value = false
    tableRef.value.tableMethods.getList()
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
