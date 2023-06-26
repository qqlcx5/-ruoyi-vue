<template>
  <div class="basic-config-page-container">
    <WgTable
      class="table-wrap"
      :data="list"
      :tableConfig="tableConfig"
      @selectionChange="getCheckedList"
      @page-change="pageChange"
      :loading="loading"
    >
      <template #btns>
        <XButton type="primary" iconFont="icon-xinzeng" title="新增" @click="handleCreate" />
        <el-button :disabled="!checkedList.length" @click="handleDelete">删除</el-button>
      </template>
      <template #tip>
        <div class="mb-12px" style="line-height: 20px; font-size: 14px; color: #ff4141"
          >注：线索周期只可启用一条</div
        >
      </template>
    </WgTable>
    <EditRepetitionPeriod v-model="visible" :curInfo="curItem" @success="getList" />
  </div>
</template>

<script setup lang="tsx">
import useQueryPage from '@/hooks/web/useQueryPage'
import WgTable from '@/components/WTable/index.vue'
import EditRepetitionPeriod from '../components/EditRepetitionPeriod/index.vue'
import {
  pageRepetitionPeriod,
  deleteBatchRepetitionPeriod,
  updateEnableRepetitionPeriod
} from '@/api/clue/basicConfig'
import { dateFormat } from '@/utils/utils'

const message = useMessage()

const typeObj = { 0: '不限', 1: '门店', 2: '分公司' }
const tableConfig = reactive({
  pageKey: 'repetitionPeriod',
  type: 'selection',
  refresh: () => getList(),
  queryParams: { pageNo: 1, pageSize: 10 },
  columns: [
    {
      label: '线索重复判断维度',
      key: 'ruleType',
      minWidth: 150,
      render: ({ row }) => typeObj[row.ruleType]
    },
    {
      label: '周期',
      key: 'repetitionPeriod',
      minWidth: 180,
      render: ({ row }) => {
        return row.repetitionPeriod > 0 ? (
          <span>线索{row.repetitionPeriod}天内不可重复</span>
        ) : (
          <span>线索不限时间重复</span>
        )
      }
    },
    {
      label: '状态',
      key: 'isEnable',
      render: ({ row }) => {
        return (
          <el-switch
            v-model={row.isEnable}
            active-value={1}
            inactive-value={0}
            onChange={(event) => statusChange(event, row)}
          />
        )
      }
    },
    { label: '创建人', key: 'creator' },
    {
      label: '创建时间',
      minWidth: '190',
      key: 'createTime',
      render: ({ row }) => dateFormat(row.createTime)
    },
    { label: '最近操作人', key: 'updater' },
    {
      label: '最近操作时间',
      minWidth: '190',
      key: 'updateTime',
      render: ({ row }) => dateFormat(row.updateTime)
    },
    {
      label: '操作',
      key: 'operate',
      width: 75,
      fixed: 'right',
      render: ({ row }) => {
        return (
          <div>
            <el-button type="primary" link onclick={() => handleEdit(row)}>
              编辑
            </el-button>
          </div>
        )
      }
    }
  ]
})
const statusChange = async (val, row) => {
  try {
    await updateEnableRepetitionPeriod({ id: row.id, isEnable: val })
    getList()
  } catch (e) {
    message.error('修改失败')
    row.isEnable = val === 1 ? 0 : 1
  }
}
const { loading, list, getList, pageChange } = useQueryPage({
  path: pageRepetitionPeriod,
  params: tableConfig.queryParams
})
const curItem = ref<object>({})
const visible = ref<boolean>(false)
const handleCreate = () => {
  curItem.value = {}
  visible.value = true
}

const handleEdit = (row) => {
  curItem.value = row
  visible.value = true
}
const checkedList = ref<object[]>([])
const getCheckedList = (value) => {
  checkedList.value = value
  console.log(checkedList)
}
const handleDelete = async () => {
  try {
    if (unref(checkedList).find((d) => d['isEnable'])) {
      message.warning('启用的线索周期不可删除')
      return
    }
    await message.confirm('是否确认删除？')
    loading.value = true
    const ids = unref(checkedList).map((d) => d['id'])
    await deleteBatchRepetitionPeriod({ ids })
    message.success('删除成功')
    getList()
  } catch (e) {
    loading.value = false
  }
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
