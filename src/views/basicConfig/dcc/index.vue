<template>
  <div class="basic-config-page-container">
    <div class="top-search mb-12px">
      <dive>
        <span class="mr-8px">门店</span>
        <el-select value="1">
          <el-option label="1" value="1" />
        </el-select>
        <el-button type="primary" class="ml-12px">确定</el-button>
        <el-button>重置</el-button>
      </dive>
    </div>
    <WgTable class="table-wrap" :tableConfig="tableConfig">
      <template #btns>
        <el-button type="primary" @click="handleCreate">新增</el-button>
      </template>
    </WgTable>
  </div>
</template>

<script setup lang="tsx">
import WgTable from '../components/WgTable/index.vue'
const router = useRouter() // 路由

const tableConfig = reactive({
  pageKey: 'dcc',
  columns: [
    {
      sort: 1,
      title: 'DCC规则名称',
      key: 'a1',
      resizable: true,
      ellipsis: true,
      disabled: false
    },
    {
      sort: 2,
      title: '适用门店',
      key: 'a2',
      minWidth: 400,
      resizable: true,
      ellipsis: true,
      disabled: false
    },
    { sort: 3, title: '启用状态', key: 'a3', resizable: true, ellipsis: true, disabled: false },
    { sort: 4, title: '创建人', key: 'a4', resizable: true, ellipsis: true, disabled: false },
    { sort: 5, title: '创建时间', key: 'a5', resizable: true, ellipsis: true, disabled: false },
    {
      sort: 6,
      title: '操作',
      key: 'operate',
      width: 120,
      fixed: null,
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

const handleCreate = () => {
  router.push('/clue/basic-config/edit-dcc')
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
    flex: 1;
    height: 1px;
    padding: 15px;
    background-color: var(--page-bg-color);
  }
}
</style>
