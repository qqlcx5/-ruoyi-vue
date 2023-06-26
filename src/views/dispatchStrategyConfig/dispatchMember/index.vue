<template>
  <form-table
    ref="tableRef"
    :form-options="{ schema: allSchemas.searchSchema }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: getTable,
      showAdd: hasPermission('dispatch-strategy-config:dispatch-member:add'),
      actionButtons,
      selection: true,
      spanMethod: objectSpanMethod,
      border: true
    }"
    @add="addMember"
  >
    <template #status="{ row }">
      <el-switch
        :disabled="!hasPermission('dispatch-strategy-config:dispatch-member:edit')"
        v-model="row.status"
        :active-value="1"
        :inactive-value="0"
        @click.stop
        @change="changeStatus(row)"
      />
    </template>
    <template #pushBackFactoryStatus="{ row }">
      <el-switch
        :disabled="!hasPermission('dispatch-strategy-config:dispatch-member:edit')"
        v-model="row.pushBackFactoryStatus"
        :active-value="1"
        :inactive-value="0"
        @click.stop
        @change="changePushBackFactoryStatus(row)"
      />
    </template>
    <template #autoBrandNames="{ row }">
      <span>{{ arrToStrFunc(row.autoBrandNames) }}</span>
    </template>
    <template #autoSeriesNames="{ row }">
      <span>{{ arrToStrFunc(row.autoSeriesNames) }}</span>
    </template>
    <template #tableAppend>
      <XButton @click="handleDel">删除</XButton>
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
  <Crud ref="crudRef" @refresh="refresh" />
</template>

<script setup lang="ts" name="dispatchMember">
import { TableColumn } from '@/types/table'
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getAllStoreList } from '@/api/system/organization'
import { listToTree } from '@/utils/tree'
import { computed, ref } from 'vue'
import Crud from './components/crud.vue'
import { getAllBrand } from '@/api/model/brand'
import { formatDate } from '@/utils/formatTime'
import { hasPermission } from '@/utils/utils'

const message = useMessage()

onMounted(() => {
  getShopList()
  getBrandInfo()
})

const refresh = () => {
  tableRef.value.tableMethods.getList()
}
const tableRef = ref()
// 获取门店数据
const shopTreeList = ref<object[]>([])
const getShopList = async () => {
  const data = await getAllStoreList()
  shopTreeList.value = listToTree(data || [], { pid: 'parentId' })
}

const brandList = ref<object[]>([])
const getBrandInfo = async () => {
  const allBrand = await getAllBrand()
  brandList.value = allBrand
}
const getTable = (params) => {
  return dispatchApi.clueDistributeUser(params).then((data) => {
    getSpanArr(data.list, mergeItems)
    return data
  })
}
// 需要合并的列号和列名
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

// 合并行
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

const arrToStrFunc = (arr) => {
  return arr && JSON.parse(arr).join(',')
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
        options: computed(() => brandList.value),
        props: {
          label: 'brandName',
          value: 'brandId',
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
    permission: hasPermission('dispatch-strategy-config:dispatch-member:edit'),
    click: (row) => {
      editMember(row.distributeShopId)
    }
  },
  {
    name: '删除',
    permission: hasPermission('dispatch-strategy-config:dispatch-member:delete'),
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
  await dispatchApi.batchDelClueDistributeUser({ ids: selectedIds.value })
  message.success('删除成功')
  delDialog.value = false
  tableRef.value.tableMethods.getList()
}

const changeStatus = (row) => {
  if (!row.id) return
  dispatchApi.updateClueDistributeUserStatus(row.id)
}
const changePushBackFactoryStatus = (row) => {
  if (!row.id) return
  dispatchApi.updatePushBackFactoryStatus(row.id)
}

const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped></style>
