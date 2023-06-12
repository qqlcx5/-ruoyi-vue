<template>
  <div id="wg-el-table" style="display: flex; flex-direction: column">
    <div class="mb-4px" style="display: flex; align-items: center; margin-top: -10px">
      <div style="flex: 1"><slot name="btns"></slot></div>
      <Icon icon="svg-icon:full-screen" :size="50" class="cursor-pointer" @click="fullScreen" />
      <Icon icon="svg-icon:refresh" :size="50" class="cursor-pointer" @click="getList(true)" />
      <Icon
        icon="svg-icon:custom-column"
        :size="50"
        class="cursor-pointer"
        @click="showColumnDialog"
      />
    </div>
    <slot name="tip"></slot>
    <el-table
      :data="[
        { a1: 3, a2: 4 },
        { a1: 3, a2: 4 }
      ]"
      @selection-change="handleSelectionChange"
      max-height="calc(100% + 40px)"
      class="custom-table"
    >
      <template v-for="column in curColumns" :key="column.prop">
        <el-table-column v-if="column.type === 'selection'" type="selection" />
        <el-table-column
          v-else
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
      v-if="columnDialogShow"
      @change-column="changeColumn"
      :allColumns="columns"
      :defaultKeys="defaultKeys"
      :changedColumnsObj="changedColumnsObj"
      :pageKey="PageKeyObj.dcc"
    />
  </div>
</template>

<script setup lang="ts">
import Expand from './Expand'
import CustomColumn from '@/components/CustomColumn/CustomColumn.vue'
import { PageKeyObj } from '@/utils/constants'
import { cloneDeep } from 'lodash-es'

const isFullScreen = ref(false)
const fullScreen = () => {
  const elem = document.getElementById('wg-el-table')

  if (isFullScreen.value === false) {
    if (elem?.requestFullscreen) {
      elem?.requestFullscreen()
      isFullScreen.value = !isFullScreen.value
    }
  } else {
    document.exitFullscreen()
    isFullScreen.value = !isFullScreen.value
  }
}
const columnDialogShow = ref(false)
const showColumnDialog = () => (columnDialogShow.value = true)
interface IProps {
  data: object[]
  columns: object[]
}
const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
  columns: () => []
})

interface IEmit {
  (event: 'selectionChange', checkedList: object[]): void
}
const emit = defineEmits<IEmit>()

const handleSelectionChange = (value) => {
  emit('selectionChange', value)
}

let defaultKeys = ref(
  props.columns.reduce((arr: string[], item: { key: string }) => {
    if (item.key) arr.push(item.key)
    return arr
  }, [])
)
const curColumns = ref(props.columns)
interface IColumnObj {
  currentColumns: object
}
const changedColumnsObj = ref<IColumnObj>()
const changeColumn = (columnsObj, isCloseModal = false) => {
  if (isCloseModal) {
    columnDialogShow.value = false
    return
  }
  changedColumnsObj.value = cloneDeep(columnsObj)
  curColumns.value = changedColumnsObj!.value?.currentColumns as any[]
  columnDialogShow.value = false
}
</script>

<style scoped lang="scss">
@import '../../style/index';
</style>
