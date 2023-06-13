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
    { sort: 3, title: '最低跟进率', key: 'a3', resizable: true, ellipsis: true, disabled: false },
    { sort: 4, title: '计算周期', key: 'a3', resizable: true, ellipsis: true, disabled: false },
    { sort: 5, title: '参与岗位', key: 'a3', resizable: true, ellipsis: true, disabled: false },
    { sort: 6, title: '创建人', key: 'a4', resizable: true, ellipsis: true, disabled: false },
    { sort: 7, title: '创建时间', key: 'a5', resizable: true, ellipsis: true, disabled: false },
    {
      sort: 8,
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
    flex: 1;
    height: 1px;
    padding: 15px;
    background-color: var(--page-bg-color);
  }
}
</style>
