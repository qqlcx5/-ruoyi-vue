<template>
  <div class="basic-config-page-container">
    <div class="top-search mb-12px">
      <div>
        <span class="mr-8px">考核规则名称</span>
        <el-input placeholder="请输入" style="width: 180px; margin-right: 22px" />
        <span class="mr-8px">门店</span>
        <el-select value="1" style="width: 180px">
          <el-option label="1" value="1" />
        </el-select>
        <el-button type="primary" class="ml-12px">确定</el-button>
        <el-button>重置</el-button>
      </div>
    </div>
    <WgTable
      class="table-wrap"
      :data="tableData"
      :tableConfig="tableConfig"
      @page-change="pageChange"
    >
      <template #btns>
        <el-button type="primary" @click="handleCreate">新增</el-button>
      </template>
    </WgTable>
    <EditAssessRule v-model="visible" :curInfo="curInfo" @success="getList" />
  </div>
</template>

<script setup lang="tsx">
import WgTable from '../components/WgTable/index.vue'
import EditAssessRule from '@/views/basicConfig/components/EditAssessRule/index.vue'
import { queryAssessRulePage, deleteAssessRule } from '@/api/clue/basicConfig'
import dayjs from 'dayjs'
import { getAllStoreList } from '@/api/common'

const message = useMessage()

const tableConfig = reactive({
  pageKey: 'dcc',
  total: 0,
  queryParams: { pageNo: 1, pageSize: 10 },
  columns: [
    {
      sort: 1,
      title: '考核规则名称',
      key: 'checkRuleName',
      resizable: true,
      ellipsis: true,
      disabled: false
    },
    {
      sort: 2,
      title: '适用门店',
      key: 'departName',
      minWidth: 400,
      resizable: true,
      ellipsis: true,
      disabled: false
    },
    {
      sort: 3,
      title: '状态',
      key: 'openRules',
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row }) => {
        return <el-switch v-model={row.openRules} active-value={1} inactive-value={0} />
      }
    },
    { sort: 4, title: '创建人', key: 'creator', resizable: true, ellipsis: true, disabled: false },
    {
      sort: 5,
      title: '创建时间',
      key: 'createTime',
      minWidth: '180px',
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row }) => {
        return row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
      }
    },
    {
      sort: 6,
      title: '操作',
      key: 'operate',
      width: 120,
      fixed: 'right',
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row, index }) => {
        return (
          <div>
            <el-button type="primary" link onclick={() => handleDccEdit(row)}>
              编辑
            </el-button>
            <el-button type="primary" link onclick={() => handleDelete(row, index)}>
              删除
            </el-button>
          </div>
        )
      }
    }
  ]
})
const tableData = ref([])

const visible = ref<boolean>(false)

const pageChange = () => {
  console.log(tableConfig)
  getList()
}

const searchParams = unref(tableConfig.queryParams)
const getList = async () => {
  const data = await queryAssessRulePage(searchParams)
  tableConfig.total = data.total || 0
  tableData.value = data.list
  console.log(data)
}
getList()
const getShopList = () => {
  getAllStoreList()
}
getShopList()
const handleCreate = () => {
  curInfo.value = {}
  visible.value = true
}
const curInfo = ref<object>({})
const handleDccEdit = (row) => {
  curInfo.value = row
  visible.value = true
}
const handleDelete = (row, index) => {
  message.wgOperateConfirm('确认删除当前数据？', '提示').then(async (res) => {
    if (res === 'confirm') {
      await deleteAssessRule({ id: row.id })
      getList()
      // tableData.value.splice(index, 1)
    }
    console.log(res)
  })
}
</script>

<style scoped lang="scss">
.basic-config-page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .top-search {
    padding: 15px;
    background-color: var(--page-bg-color);
  }
  .table-wrap {
    padding: 15px;
    background-color: var(--page-bg-color);
  }
}
</style>
