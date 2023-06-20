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
  </div>
</template>

<script setup lang="tsx">
import useQueryPage from '@/hooks/web/useQueryPage'
import WgTable from '../components/WgTable/index.vue'
import { queryDccPage, dccOpenRule, deleteDcc } from '@/api/clue/basicConfig'
import { dateFormat } from '@/utils/utils'
import { useOption } from '@/store/modules/options'
const store = useOption()
const router = useRouter() // 路由
const message = useMessage()

const tableConfig = reactive({
  pageKey: 'dcc',
  refresh: () => getList(),
  queryParams: { shopId: '', shopName: '', pageNo: 1, pageSize: 10 },
  columns: [
    { title: 'DCC规则名称', key: 'dccRuleName' },
    {
      title: '适用门店',
      key: 'departName',
      minWidth: 250,
      render: ({ row }) => row.applicableShopName.join('，')
    },
    {
      title: '启用状态',
      key: 'openRules',
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
    { title: '创建人', key: 'creator' },
    {
      title: '创建时间',
      key: 'createTime',
      minWidth: 190,
      render: ({ row }) => dateFormat(row.createTime)
    },
    {
      title: '操作',
      key: 'operate',
      width: 120,
      fixed: null,
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
onMounted(async () => {
  const res = await store.getShopList()
  shopList = res.shopList
  shopTreeList.value = res.shopTreeList
})

const { loading, list, getList, pageChange } = useQueryPage({
  path: queryDccPage,
  params: tableConfig.queryParams
})
const handleCreate = () => {
  router.push('/clue/basic-config/create-dcc')
}
const handleDccEdit = (row) => {
  router.push(`/clue/basic-config/edit-dcc/${row.id}`)
  console.log(row)
}
const statusChange = async (val, row) => {
  try {
    await dccOpenRule({ id: row.id, status: val })
  } catch (e) {
    message.error('修改失败')
    row.openRules = val === 1 ? 0 : 1
  }
}
const handleDelete = async (row) => {
  await message.confirm('是否确认删除？', '提示')
  await deleteDcc({ id: row.id })
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
