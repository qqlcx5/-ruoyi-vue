<template>
  <div class="basic-config-page-container">
    <div class="top-search mb-12px">
      <div>
        <span class="mr-8px">门店</span>
        <el-select value="1">
          <el-option label="1" value="1" />
        </el-select>
        <el-button type="primary" class="ml-12px">确定</el-button>
        <el-button>重置</el-button>
      </div>
    </div>
    <WgTable class="table-wrap" :data="tableData" :tableConfig="tableConfig">
      <template #btns>
        <el-button type="primary" @click="handleCreate">新增</el-button>
      </template>
    </WgTable>

    <!-- 首次跟进率新增/编辑弹框 -->
    <EditFirstFollowRate v-model="visible" @success="" />
  </div>
</template>

<script setup lang="tsx">
import WgTable from '../components/WgTable/index.vue'
import EditFirstFollowRate from '../components/EditFirstFollowRate/index.vue'

const visible = ref<boolean>(false)
const tableConfig = reactive({
  pageKey: 'firstFollowRate',
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
      key: 'shopName',
      minWidth: 400,
      resizable: true,
      ellipsis: true,
      disabled: false
    },
    {
      sort: 3,
      title: '启用状态',
      key: 'status',
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row }) => {
        return <el-switch v-model={row.status} active-value={1} inactive-value={0} />
      }
    },
    {
      sort: 4,
      title: '最低跟进率',
      key: 'minFollowRate',
      resizable: true,
      ellipsis: true,
      disabled: false
    },
    { sort: 5, title: '计算周期', key: 'cycle', resizable: true, ellipsis: true, disabled: false },
    { sort: 6, title: '参与岗位', key: 'a3', resizable: true, ellipsis: true, disabled: false },
    { sort: 7, title: '创建人', key: 'createBy', resizable: true, ellipsis: true, disabled: false },
    {
      sort: 8,
      title: '创建时间',
      key: 'createTime',
      resizable: true,
      ellipsis: true,
      disabled: false
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
            <el-button type="primary" link onclick={() => handleDccEdit(row)}>
              编辑
            </el-button>
            <el-button type="primary" link>
              删除
            </el-button>
          </div>
        )
      }
    }
  ]
})
const tableData = ref([{ status: 1 }])
const handleCreate = () => {
  visible.value = true
}
const handleDccEdit = (row) => {
  console.log(row)
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
