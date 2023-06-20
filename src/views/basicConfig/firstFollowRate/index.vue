<template>
  <div class="basic-config-page-container">
    <div class="top-search mb-12px">
      <div>
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
      :loading="loading"
      :data="list"
      :tableConfig="tableConfig"
      @page-change="pageChange"
    >
      <template #btns>
        <XButton type="primary" iconFont="icon-xinzeng" title="新增" @click="handleCreate" />
      </template>
    </WgTable>

    <!-- 首次跟进率新增/编辑弹框 -->
    <EditFirstFollowRate
      v-model="visible"
      :shopList="shopList"
      :curInfo="curInfo"
      @success="getList"
    />
  </div>
</template>

<script setup lang="tsx">
import useQueryPage from '@/hooks/web/useQueryPage'
import WgTable from '../components/WgTable/index.vue'
import EditFirstFollowRate from '../components/EditFirstFollowRate/index.vue'
import { getAllStoreList } from '@/api/system/organization'
import { cloneDeep } from 'lodash-es'
import { listToTree } from '@/utils/tree'
import {
  firstFollowRatePage,
  firstFollowRateUpdateStatus,
  firstFollowRateDelete
} from '@/api/clue/basicConfig'
import { dateFormat } from '@/utils/utils'

const message = useMessage()

let shopList = []
const shopTreeList = ref<object[]>([])
const getShopList = async () => {
  const data = await getAllStoreList()
  shopList = cloneDeep(data || [])
  shopTreeList.value = listToTree(data || [], { pid: 'parentId' })
}
getShopList()

const visible = ref<boolean>(false)
const tableConfig = reactive({
  pageKey: 'firstFollowRate',
  refresh: () => getList(),
  queryParams: { shopId: '', shopName: '', pageNo: 1, pageSize: 10, total: 0 },
  columns: [
    {
      sort: 1,
      title: '规则名称',
      key: 'ruleName',
      resizable: true,
      ellipsis: true,
      disabled: false
    },
    {
      sort: 2,
      title: '适用门店',
      key: 'applicableShopName',
      minWidth: 240,
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row }) => (row.applicableShopName ? row.applicableShopName.join(',') : '')
    },
    {
      sort: 3,
      title: '启用状态',
      key: 'status',
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row }) => {
        return (
          <el-switch
            v-model={row.status}
            active-value={1}
            inactive-value={0}
            onChange={(event) => statusChange(event, row)}
          />
        )
      }
    },
    {
      sort: 4,
      title: '最低跟进率',
      key: 'minFollowRate',
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row }) => row.minFollowRate + '%'
    },
    {
      sort: 5,
      title: '计算周期',
      key: 'cycle',
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row }) => row.cycle + '天'
    },
    {
      sort: 6,
      title: '参与岗位',
      minWidth: 240,
      key: 'limitPositionTypesName',
      resizable: true,
      ellipsis: true,
      disabled: false
    },
    { sort: 7, title: '创建人', key: 'creator', resizable: true, ellipsis: true, disabled: false },
    {
      sort: 8,
      title: '创建时间',
      key: 'createTime',
      minWidth: '190',
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row }) => dateFormat(row.createTime)
    },
    {
      sort: 9,
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
            <el-button type="primary" link onclick={() => handleEdit(row)}>
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

const { loading, list, getList, pageChange } = useQueryPage({
  path: firstFollowRatePage,
  params: tableConfig.queryParams
})

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
const curInfo = ref<object>({})

const handleCreate = () => {
  curInfo.value = {}
  visible.value = true
}
const handleEdit = (row) => {
  curInfo.value = row
  visible.value = true
}
const statusChange = async (val, row) => {
  try {
    await firstFollowRateUpdateStatus({ id: row.id, status: val })
  } catch (e) {
    message.error('修改失败')
    row.openRules = val === 1 ? 0 : 1
  }
}
const handleDelete = async ({ id }) => {
  await message.confirm('是否确认删除？')
  await firstFollowRateDelete({ id })
  getList()
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
