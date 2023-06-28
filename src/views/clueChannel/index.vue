<template>
  <form-table
    ref="tableRef"
    :form-options="{ schema: allSchemas.searchSchema }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: channelApi.getClueChannel,
      showAdd: hasPermission('clue-channel:add'),
      actionButtons,
      selection: true
    }"
    @add="handleAdd"
  >
    <template #tableAppend>
      <div class="edit-btn">
        <el-button @click="handleDelete">删除</el-button>
        <el-button v-hasPermi="['clue-channel:source-manage']" @click="handleSource"
          >线索来源管理</el-button
        >
      </div>
    </template>
    <template #needFilter="{ row }">
      <el-switch
        :disabled="!hasPermission('clue-channel:edit')"
        v-model="row.needFilter"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
        @change="handleNeedFilterChange(row, 'needFilter')"
      />
    </template>
    <template #autoDistribute="{ row }">
      <div>{{ FilterFun(row.autoDistribute) }}</div>
    </template>
    <template #platformRule="{ row }">
      <div>{{ FilterFun(row.platformRule) }}</div>
    </template>
    <template #isShow="{ row }">
      <el-switch
        :disabled="!hasPermission('clue-channel:edit')"
        v-model="row.isShow"
        inline-prompt
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
        @change="handleNeedFilterChange(row, 'isShow')"
      />
    </template>
  </form-table>
  <AddChannelModal ref="addChannelModalRef" @refresh-list="refreshList" />
</template>

<script setup lang="ts" name="clueChannel">
import * as channelApi from '@/api/clue/channel'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import AddChannelModal from './components/AddChannelModal.vue'
import { hasPermission } from '@/utils/utils'

import { useCommonList } from '@/hooks/web/useCommonList'
const { getSuitableShopList } = useCommonList()

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const FilterFun = (val) => {
  let obj = {
    0: '否',
    1: '是'
  }
  return obj[val]
}

// 获取门店数据
const shopTreeList = ref(getSuitableShopList())

// 获取门店数据
// const shopTreeList = ref(getShopList())
// console.log(getShopList())

let sourceList = ref<any[]>([])
// 获取线索来源列表
const getSourceList = async () => {
  let data = await channelApi.getClueSourceManageList()
  if (data) {
    sourceList.value = data
    console.log(data)
  }
}
getSourceList()

const columns: TableColumn[] = [
  {
    label: '线索平台所属门店',
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
    label: '线索平台',
    field: 'sourceName',
    isSearch: true,
    isTable: false,
    search: {
      component: 'Cascader',
      componentProps: {
        filterable: true,
        clearable: true,
        options: computed(() => sourceList.value),
        props: {
          label: 'name',
          value: 'name',
          emitPath: false
        }
      }
    }
  },
  {
    label: '编号',
    field: 'serialNumber',
    disabled: true
  },
  {
    label: '线索平台所属门店',
    field: 'shopName',
    disabled: true
  },
  {
    label: '线索平台',
    field: 'clueSource',
    disabled: true
  },
  {
    label: '平台账号',
    field: 'platformUsername'
  },
  {
    label: '平台密码',
    field: 'platformPassword'
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
    label: '是否需要清洗',
    field: 'needFilter'
  },
  {
    label: '是否自动派发',
    field: 'autoDistribute'
  },
  {
    label: '是否线索平台规则派发',
    field: 'platformRule'
  },
  {
    label: '手动创建线索是否可选',
    field: 'isShow'
  }
]
const actionButtons = [
  {
    name: '编辑',
    permission: hasPermission('clue-channel:edit'),
    click: (row) => {
      console.log(row)
      handleUpdate(row)
    }
  },
  {
    name: '删除',
    permission: hasPermission('clue-channel:delete'),
    click: (row) => {
      handleDelete(row, 'single')
    }
  }
]

const refreshList = () => {
  console.log(tableRef.value.tableMethods)
  tableRef.value.tableMethods.getList()
}

const { allSchemas } = useCrudSchemas(columns)

const addChannelModalRef = ref()
const { push } = useRouter() // 路由
const handleAdd = () => {
  addChannelModalRef.value.openModal()
}
const tableRef = ref()
const handleDelete = async (row, type?: any) => {
  let params: { ids: any[] } = { ids: [] }
  let id: any[] = []

  if (type == 'single') {
    id = [row.id]
  } else {
    const selectedData = await tableRef.value.tableMethods.getSelections()
    id = selectedData.map((item) => item.id)
  }
  if (id.length == 0) {
    return message.warning('未选择数据')
  }
  let msgContent = '确认删除该数据吗？'
  if (id.length > 1) {
    msgContent = `确认删除 ${id.length} 条数据吗？`
  }
  params = { ids: id }
  message
    .confirm(msgContent, t('common.reminder'))
    .then(async () => {
      let data = await channelApi.delClueChannel(params)
      if (data) {
        message.success('删除成功')
        refreshList()
      }
    })
    .catch(() => {})
}

const handleSource = () => {
  push({
    path: '/clueChannel/source'
  })
}
const handleUpdate = async (row: any) => {
  addChannelModalRef.value.openModal(row)
}

// 更改是否需要清洗
const handleNeedFilterChange = async (row, type) => {
  if (!row.id) return
  if (type == 'needFilter') {
    await channelApi.updateChannelSwitch(row.id, row.needFilter)
  } else {
    await channelApi.updateIsShowSwitch(row.id, row.isShow)
  }
  refreshList()
}
</script>

<style lang="scss" scoped>
.edit-btn {
  margin-left: 12px;
}
</style>
