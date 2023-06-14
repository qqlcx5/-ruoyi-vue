<template>
  <div
    class="el-table-wrap"
    :class="{ 'is--maximize': isFullScreen }"
    style="display: flex; flex-direction: column"
  >
    <div class="mb-4px" style="display: flex; align-items: center; margin-top: -10px">
      <div style="flex: 1"><slot name="btns"></slot></div>
      <Icon icon="svg-icon:full-screen" :size="50" class="cursor-pointer" @click="fullScreen" />
      <Icon icon="svg-icon:refresh" :size="50" class="cursor-pointer" @click="getList" />
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
      class="custom-table"
    >
      <el-table-column v-if="tableConfig.type === 'selection'" type="selection" />
      <template v-for="column in curColumns" :key="column.prop">
        <el-table-column
          :label="column.title"
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
    <!--  定制列  -->
    <CustomColumn
      id="card-content"
      v-if="columnDialogShow"
      @change-column="changeColumn"
      :allColumns="columns"
      :defaultKeys="defaultKeys"
      :changedColumnsObj="changedColumnsObj"
      :pageKey="tableConfig.pageKey"
    />
  </div>
</template>

<script setup lang="ts">
import Expand from './Expand'
import CustomColumn from '@/components/CustomColumn/CustomColumn.vue'
import { cloneDeep } from 'lodash-es'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

interface ITableConfig {
  pageKey: string
  columns?: any[]
  type?: 'string'
}
interface IProps {
  data: object[]
  tableConfig: ITableConfig
}
const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
  tableConfig: () => ({ pageKey: '' })
})
const columns = ref(props.tableConfig.columns || [])
interface IEmit {
  (event: 'selectionChange', checkedList: object[]): void
  (event: 'refresh'): void
}
const emit = defineEmits<IEmit>()

const { wsCache } = useCache()
const isFullScreen = ref(false)
const fullScreen = () => {
  console.log(123)
  isFullScreen.value = !isFullScreen.value
}
const getList = () => {
  emit('refresh')
}
const columnDialogShow = ref(false)
const showColumnDialog = () => {
  columnDialogShow.value = true
}

const handleSelectionChange = (value) => {
  emit('selectionChange', value)
}

let defaultKeys = ref<any[]>(
  columns.value.reduce((arr: string[], item: { key: string }) => {
    if (item.key) arr.push(item.key)
    return arr
  }, [])
)
const curColumns = ref(columns.value)
interface IColumnObj {
  currentColumns: object[]
  currentCheckedList: string[]
}
const changedColumnsObj = ref<IColumnObj>()
const columnsObj = wsCache.get(CACHE_KEY.TABLE_COLUMNS_OBJ) || {}
console.log(props.tableConfig.pageKey, columnsObj)
if (columnsObj[props.tableConfig.pageKey]) {
  let curKeys = columnsObj[props.tableConfig.pageKey].currentColumns.map((d) => d.key)
  console.log(curKeys)
  if (!curKeys.length) {
    curKeys = defaultKeys.value
  }
  changedColumnsObj.value = columnsObj[props.tableConfig.pageKey]
  curColumns.value = curKeys.reduce((arr, key) => {
    const obj = columns.value.find((d) => d.key === key)
    if (obj) arr.push(obj)
    return arr
  }, [])
  columns.value.filter((d) => curKeys.includes(d.key))
} else {
  curColumns.value = columns.value.filter((columnsItem) => {
    return defaultKeys.value.some((item) => columnsItem.key === item)
  })
}

const changeColumn = (columnsObj, isCloseModal = false) => {
  if (isCloseModal) {
    columnDialogShow.value = false
    return
  }
  changedColumnsObj.value = cloneDeep(columnsObj)
  console.log(changedColumnsObj.value)
  let curKeys = changedColumnsObj.value?.currentColumns.map((d) => d['key']) || []
  if (!curKeys.length) {
    curKeys = defaultKeys.value
  }
  curColumns.value = curKeys.reduce((arr, key) => {
    const obj = columns.value.find((d) => d.key === key)
    if (obj) arr.push(obj)
    return arr
  }, [])
  columnDialogShow.value = false
}
</script>

<style scoped lang="scss">
@import '../../style/index';
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
}
</style>
