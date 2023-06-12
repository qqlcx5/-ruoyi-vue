<template>
  <div class="basic-config-page-container">
    <WgTable class="table-wrap" :columns="tableConfig.columns" @selectionChange="getCheckedList">
      <template #btns>
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button @click="handleDelete">删除</el-button>
      </template>
      <template #tip>
        <div class="mb-12px" style="line-height: 20px; font-size: 14px; color: #ff4141"
          >注：线索周期只可启用一条</div
        >
      </template>
    </WgTable>
    <EditRepetitionPeriod v-model="visible" />
  </div>
</template>

<script setup lang="tsx">
import WgTable from '../components/WgTable/index.vue'
import EditRepetitionPeriod from '../components/EditRepetitionPeriod/index.vue'

const tableConfig = reactive({
  columns: [
    {
      sort: 0,
      title: '',
      key: 'a1',
      type: 'selection',
      width: 50,
      resizable: false,
      ellipsis: false,
      disabled: true
    },
    {
      sort: 1,
      title: '线索重复判断维度',
      key: 'a1',
      minWidth: 150,
      resizable: true,
      ellipsis: true,
      disabled: false
    },
    {
      sort: 2,
      title: '周期',
      key: 'a2',
      minWidth: 400,
      resizable: true,
      ellipsis: true,
      disabled: false
    },
    { sort: 3, title: '状态', key: 'a3', resizable: true, ellipsis: true, disabled: false },
    { sort: 4, title: '创建人', key: 'a4', resizable: true, ellipsis: true, disabled: false },
    { sort: 5, title: '创建时间', key: 'a5', resizable: true, ellipsis: true, disabled: false },
    { sort: 6, title: '最近操作人', key: 'a5', resizable: true, ellipsis: true, disabled: false },
    { sort: 7, title: '最近操作时间', key: 'a5', resizable: true, ellipsis: true, disabled: false },
    {
      sort: 8,
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
            <el-button type="primary" link onclick={() => handleEdit(row)}>
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

const visible = ref<boolean>(false)
const handleCreate = () => {
  visible.value = true
}
const handleEdit = () => {}
const checkedList = ref<object[]>([])
const getCheckedList = (value) => {
  checkedList.value = value
  console.log(checkedList)
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
