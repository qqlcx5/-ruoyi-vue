<template>
  <div
    class="el-table-wrap"
    :class="{ 'is--maximize': isFullScreen }"
    style="display: flex; flex-direction: column"
  >
    <div class="mb-4px" style="display: flex; align-items: center; margin-top: -10px">
      <div style="flex: 1"><slot name="btns"></slot></div>
      <Icon icon="svg-icon:full-screen" :size="50" class="cursor-pointer" @click="fullScreen" />
      <Icon icon="svg-icon:refresh" :size="50" class="cursor-pointer" @click="refresh" />
      <Icon
        icon="svg-icon:custom-column"
        :size="50"
        class="cursor-pointer"
        @click="showColumnDialog"
      />
    </div>
    <slot name="tip"></slot>
    <el-table
      :data="data"
      @selection-change="handleSelectionChange"
      max-height="calc(100% + 54px)"
      class="wg-custom-table"
      v-loading="loading"
    >
      <template #empty>
        <div>
          <img src="@/assets/imgs/empty.png" alt="" style="width: 200px; margin: 30px auto 0" />
          <div>暂无数据</div>
        </div>
      </template>
      <el-table-column v-if="tableConfig.type === 'selection'" type="selection" />
      <template v-for="column in curColumns" :key="column.prop">
        <el-table-column
          :label="column.label"
          show-overflow-tooltip
          :prop="column.prop"
          :width="column.width"
          :min-width="column.minWidth || 120"
          :fixed="column.fixed"
        >
          <template v-if="column.render" #default="scope">
            <Expand
              :column="column"
              :row="scope.row"
              :render="column.render"
              :index="scope.$index"
            />
          </template>
          <template v-else #default="{ row }">{{ row[column.key] }}</template>
        </el-table-column>
      </template>
    </el-table>
    <div style="text-align: right; margin-bottom: -15px">
      <Pagination
        v-if="queryParams && queryParams.pageNo"
        :total="tableConfig.queryParams.total || 0"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="onPageChange"
      />
    </div>
    <!--  定制列  -->
    <TableColumnDrawer
      v-model="columnDialogShow"
      :columns="drawerColumns"
      @confirm="changeColumn"
      @reset="handleColumnReset"
    />
  </div>
</template>

<script setup lang="ts">
import Expand from './Expand'
import { cloneDeep } from 'lodash-es'

interface ITableConfig {
  pageKey: string
  columns?: any[]
  refresh?: () => void
  type?: 'string'
  total?: number
  queryParams: any
}
interface IProps {
  data: object[]
  tableConfig: ITableConfig
  loading: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  loading: false,
  data: () => [],
  tableConfig: () => ({ pageKey: '', queryParams: {} })
})
const { queryParams } = toRefs(props.tableConfig)
const columns = ref(
  props.tableConfig.columns?.map((item, index) => {
    return {
      sort: index + 1,
      check: true,
      ...item
    }
  }) || []
)
interface IEmit {
  (event: 'selectionChange', checkedList: object[]): void
  (event: 'refresh'): void
  (event: 'pageChange', params: object): void
}
const emit = defineEmits<IEmit>()

const onPageChange = (params) => {
  emit('pageChange', params)
}
const refresh = () => {
  props.tableConfig.refresh && props.tableConfig.refresh()
}
const isFullScreen = ref(false)
const fullScreen = () => {
  console.log(123)
  isFullScreen.value = !isFullScreen.value
}
const columnDialogShow = ref(false)
const showColumnDialog = () => {
  columnDialogShow.value = true
}

const handleSelectionChange = (value) => {
  emit('selectionChange', value)
}

const curColumns = ref(cloneDeep(columns.value))
const drawerColumns = ref(cloneDeep(columns.value))

const handleColumnReset = () => {
  curColumns.value = cloneDeep(columns.value)
  drawerColumns.value = cloneDeep(columns.value)
  columnDialogShow.value = false
}
const changeColumn = (list: any[]) => {
  curColumns.value = list.filter((item) => item.check)
  drawerColumns.value = list
  columnDialogShow.value = false
}
</script>

<style scoped lang="scss">
.wg-custom-table {
  --el-table-header-bg-color: var(--table-bg-color);
  --el-table-header-text-color: $title-color;
  border: 1px solid $border-color;
  :deep(.el-table__inner-wrapper)::before {
    content: none;
  }
  :deep(.el-table__row):last-child {
    td.el-table__cell {
      border-bottom: none;
    }
  }
  :deep(.el-table__cell) {
    padding: 12px 0;
    color: $title-color;
  }
}
.el-table-wrap {
  flex: 1;
  min-height: 1px;
  &.is--maximize {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100% !important;
    z-index: 1000;
    background-color: $page-bg-color;
  }
  .el-switch {
    height: 20px;
    vertical-align: bottom;
  }
}
</style>
