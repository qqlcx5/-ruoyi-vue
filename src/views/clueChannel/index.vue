<template>
  <ContentWrap>
    <form-table
      ref="tableRef"
      :form-options="{ schema: allSchemas.searchSchema }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi: channelApi.getClueChannel,
        showAdd: true,
        actionButtons,
        selection: true
      }"
      @add="handleAdd"
    >
      <template #tableAppend>
        <div class="edit-btn">
          <el-button @click="handleDelete">删除</el-button>
          <el-button @click="handleSource">线索来源管理</el-button>
        </div>
      </template>
      <template #needFilter="{ row }">
        <el-switch
          v-model="row.needFilter"
          :active-value="1"
          :inactive-value="0"
          @change="handleNeedFilterChange(row, 'needFilter')"
        />
      </template>
    </form-table>
  </ContentWrap>
  <AddChannelModal ref="addChannelModalRef" @refresh-list="refreshList" />
</template>

<script setup lang="ts" name="ClueChannel">
import * as channelApi from '@/api/clue/channel'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'

import AddChannelModal from './components/AddChannelModal.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const columns: TableColumn[] = [
  {
    label: '编号',
    field: 'serialNumber'
  },
  {
    label: '线索平台所属门店',
    field: 'shopName',
    isSearch: true
  },
  {
    label: '线索平台',
    field: 'clueSource',
    isSearch: true
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
    click: (row) => {
      console.log(row)
      handleUpdate(row)
    }
  },
  {
    name: '删除',
    click: (row) => {
      handleDelete(row, 'single')
    }
  }
]

const refreshList = () => {
  tableRef.value.tableMethods.reload()
}

const { allSchemas } = useCrudSchemas(columns)

const addChannelModalRef = ref()
const { push } = useRouter() // 路由
const handleAdd = () => {
  // setDialogTitle('add')
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
  params = { ids: id }
  console.log(params)

  message
    .confirm('确认删除该数据吗？', t('common.reminder'))
    .then(async () => {
      let data = await channelApi.delClueChannel(params)
      if (data) {
        message.success('删除成功')
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
  await channelApi.updateChannelSwitch(row.id, row.needFilter)
}
</script>

<style lang="scss" scoped>
.edit-btn {
  margin-left: 12px;
}
</style>
