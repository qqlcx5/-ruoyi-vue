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
    <WgTable class="table-wrap" :data="tableData" :tableConfig="tableConfig">
      <template #btns>
        <el-button type="primary" @click="handleCreate">新增</el-button>
      </template>
    </WgTable>
    <EditAssessRule v-model="visible" />
  </div>
</template>

<script setup lang="tsx">
import WgTable from '../components/WgTable/index.vue'
import EditAssessRule from '../components/EditAssessRule/index.vue'
const router = useRouter() // 路由

const tableConfig = reactive({
  pageKey: 'dcc',
  columns: [
    {
      sort: 1,
      title: '考核规则名称',
      key: 'assessName',
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
      key: 'status',
      resizable: true,
      ellipsis: true,
      disabled: false,
      render: ({ row }) => {
        return <el-switch v-model={row.status} active-value={1} inactive-value={0} />
      }
    },
    { sort: 4, title: '创建人', key: 'createBy', resizable: true, ellipsis: true, disabled: false },
    {
      sort: 5,
      title: '创建时间',
      key: 'createTime',
      resizable: true,
      ellipsis: true,
      disabled: false
    },
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
const tableData = ref([{ departName: 'zzz', status: 1 }])

const visible = ref<boolean>(false)
const handleCreate = () => {
  visible.value = true
}
const handleDccEdit = (row) => {
  visible.value = true
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
