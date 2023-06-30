<template>
  <el-tabs
    class="visit-report-tabs"
    v-model="activeTab"
    tab-position="bottom"
    @tab-change="onTabChagne"
  >
    <el-tab-pane label="门店统计" name="store" />
    <el-tab-pane label="个人统计" name="personal" />
  </el-tabs>
  <form-table
    ref="tableRef"
    :form-options="{
      schema: allSchemas.searchSchema
    }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: getLoginLogPageApi,
      showAdd: false,
      selection: true,
      reserveSelection: true,
      rowKey: 'id'
    }"
  >
    <template #tableAppend>
      <XButton icon-font="icon-daochu" title="导出" @click="handleExport()" />
    </template>

    <template #form-time="{ model }">
      <el-radio-group v-model="model.time">
        <el-radio-button label="全部" />
        <el-radio-button label="今天" />
        <el-radio-button label="昨天" />
        <el-radio-button label="近3天" />
        <el-radio-button label="近7天" />
      </el-radio-group>
      <el-date-picker
        class="ml-16px"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
    </template>
  </form-table>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { getLoginLogPageApi } from '@/api/system/loginLog'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'

// const message = useMessage()

const tableRef = ref()
const activeTab = ref('store')

const columns: TableColumn[] = [
  { label: '时间', field: 'time', isSearch: true, isTable: false },
  { label: '序号', field: 'id' },
  { label: '分公司', field: 'companyName', isSearch: true },
  { label: '门店', field: 'shopName', isSearch: true },
  { label: '回访任务数', field: 'visitNum' },
  { label: '有效回访', field: 'validNum' },
  { label: '系统派发', field: 'visitSettingSystemType1' },
  { label: '自定义回访', field: 'visitSettingSystemType2' },
  { label: '已分配', field: 'distributionNum' },
  { label: '待分配', field: 'unDistributionNum' },
  { label: '离职回收已分配', field: 'recycleType2' },
  { label: '系统回收已分配', field: 'recycleType1' },
  { label: '逾期回收已分配', field: 'recycleType3' },
  { label: '离职回收待分配', field: 'unRecycleType2' },
  { label: '系统回收待分配', field: 'unRecycleType1' },
  { label: '逾期回收待分配', field: 'unRecycleType3' },
  { label: '待回访', field: 'visitStatus10' },
  { label: '继续回访', field: 'visitStatus23' },
  { label: '回访成功', field: 'visitStatus21' },
  { label: '回访不成功', field: 'visitStatus22' },
  { label: '已过期', field: 'visitStatus30' },
  { label: '已回收', field: 'visitStatus40' },
  { label: '转派数量', field: 'transfersNum' },
  { label: '正常回访', field: 'overdueStatus0' },
  { label: '一般逾期', field: 'overdueStatus1' },
  { label: '严重逾期', field: 'overdueStatus2' },
  { label: '主管已评论数', field: 'discussNum' },
  { label: '主管评论率', field: 'discussPercentage' },
  { label: '主管已点评数', field: 'commentNum' },
  { label: '主管点评率', field: 'commentPercentage' },
  { label: '评论总数', field: 'discussNumTotal' },
  { label: '点评总数', field: 'commentTotal' },
  { label: '点赞数', field: 'likeNum' },
  { label: '加油数', field: 'giveNum' }
]

const { allSchemas } = useCrudSchemas(columns)

const onTabChagne = (data) => {
  console.log(data)
}

const handleExport = async () => {
  // const res = await exportOperateLogApi(tableRef.value.tableObject)
  // download.excel(res as unknown as Blob, '操作日志.xls')
}
</script>

<style lang="scss" scoped>
.visit-report-tabs {
  margin-bottom: 1px;
  background-color: #f1f3f6;

  :deep(.el-tabs__item.is-active) {
    background-color: #fff;
  }

  :deep(.el-tabs__active-bar) {
    top: 0;
    left: -20px;
    width: calc(4em + 40px) !important;
  }

  :deep(.el-tabs__item) {
    padding: 0 20px !important;
    text-align: center;
  }

  :deep(.el-tabs__nav-wrap::after) {
    display: none !important;
  }
}
</style>
