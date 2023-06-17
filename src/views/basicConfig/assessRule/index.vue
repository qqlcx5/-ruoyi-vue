<template>
  <div class="basic-config-page-container">
    <div class="top-search mb-12px">
      <div>
        <span class="mr-8px">考核规则名称</span>
        <el-input
          v-model="tableConfig.queryParams.name"
          placeholder="请输入"
          style="width: 180px; margin-right: 22px"
        />
        <span class="mr-8px">门店</span>
        <el-cascader
          v-model="tableConfig.queryParams.shopId"
          :options="shopTreeList"
          :props="{ label: 'name', value: 'id', emitPath: false }"
          filterable
          clearable
          style="min-width: 180px"
        />
        <el-button type="primary" class="ml-12px" @click="handleSearch">确定</el-button>
        <el-button @click="handleRest">重置</el-button>
      </div>
    </div>
    <WgTable
      class="table-wrap"
      :data="list"
      :tableConfig="tableConfig"
      @page-change="pageChange"
      :loading="loading"
    >
      <template #btns>
        <el-button type="primary" @click="handleCreate">新增</el-button>
      </template>
    </WgTable>
    <EditAssessRule v-model="visible" :shopList="shopList" :curInfo="curInfo" @success="getList" />
  </div>
</template>

<script setup lang="tsx">
import useQueryPage from '@/hooks/web/useQueryPage'
import WgTable from '../components/WgTable/index.vue'
import EditAssessRule from '@/views/basicConfig/components/EditAssessRule/index.vue'
import { queryAssessRulePage, updateRuleStatus, deleteAssessRule } from '@/api/clue/basicConfig'
import dayjs from 'dayjs'
import { getAllStoreList } from '@/api/common'
import { listToTree } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
const message = useMessage()

const tableConfig = reactive({
  pageKey: 'assessRule',
  refresh: () => getList(),
  // name: '',
  queryParams: { shopId: '', shopName: '', pageNo: 1, pageSize: 10 },
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
        return (
          <el-switch
            v-model={row.openRules}
            active-value={1}
            inactive-value={0}
            onChange={(event) => statusChange(event, row)}
          />
        )
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
      render: ({ row }) => {
        return (
          <div>
            <el-button type="primary" link onclick={() => handleDccEdit(row)}>
              编辑
            </el-button>
            <el-button type="primary" link onclick={() => handleDelete(row)}>
              删除
            </el-button>
          </div>
        )
      }
    }
  ]
})
const visible = ref<boolean>(false)
const { loading, list, getList, pageChange } = useQueryPage({
  path: queryAssessRulePage,
  params: tableConfig.queryParams
})
const statusChange = async (val, row) => {
  try {
    await updateRuleStatus({ id: row.id, status: val })
  } catch (e) {
    message.error('修改失败')
    row.openRules = val === 1 ? 0 : 1
  }
}

// const treeChange = (val) => {
//   tableConfig.queryParams.shopName = val ? shopList.find((d) => d['id'] === val)!['name'] : ''
// }

const handleRest = () => {
  tableConfig.queryParams.shopId = ''
  tableConfig.queryParams.shopName = ''
  handleSearch()
}
const handleSearch = () => {
  const obj = shopList.find((d) => tableConfig.queryParams.shopId === d['id']) || {}
  tableConfig.queryParams.shopName = obj['name'] || null
  tableConfig.queryParams.pageNo = 1
  getList(tableConfig.queryParams)
}
let shopList = []
const shopTreeList = ref<object[]>([])
const getShopList = async () => {
  const data = await getAllStoreList()
  shopList = cloneDeep(data || [])
  shopTreeList.value = listToTree(data || [], { pid: 'parentId' })
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
const handleDelete = (row) => {
  message.wgOperateConfirm('确认删除当前数据？', '提示').then(async (res) => {
    if (res === 'confirm') {
      await deleteAssessRule({ id: row.id })
      getList()
      // list.value.splice(index, 1)
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
