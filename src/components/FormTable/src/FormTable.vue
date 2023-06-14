<template>
  <div class="form-table flex flex-col h-full">
    <ContentWrap>
      <Search v-bind="formProps" @search="handleSearch" @reset="handleSearch">
        <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </Search>
    </ContentWrap>
    <ContentWrap :class="{ 'fullscreen-open': fullscreen }" class="flex-1 table-wrap">
      <div class="flex flex-col h-full">
        <div class="flex justify-between items-center mb-5">
          <div class="flex items-center">
            <XButton
              v-if="tableProps.showAdd"
              type="primary"
              iconFont="icon-xinzeng"
              :title="t('action.add')"
              @click="handleAdd"
            />
            <XButton
              v-if="tableProps.showExpandAll"
              plain
              :preIcon="isExpandAll ? 'svg-icon:expansion' : 'svg-icon:expandFold'"
              :title="isExpandAll ? '收起全部' : '展开全部'"
              :icon-size="10"
              @click="handleExpandAll"
            />
            <slot name="tableAppend"></slot>
          </div>
          <div>
            <TableTools @tool-click="handleToolClick" />
          </div>
        </div>
        <Table
          :pagination="{
            total: tableObject.total
          }"
          :data="tableObject.tableList"
          :loading="tableObject.loading"
          header-cell-class-name="table-header-style"
          height="100%"
          v-bind="tableProps"
          :columns="tableColumns"
          class="flex flex-col flex-1 overflow-hidden"
          @update:page-size="handlePageSizeChange"
          @register="register"
        >
          <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </Table>
      </div>
    </ContentWrap>
    <TableColumnDrawer
      v-model="drawerVisible"
      :columns="drawerColumns"
      @confirm="handleColumnChange"
      @reset="handleColumnReset"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch, computed, PropType } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { TableColumn } from '@/types/table'
import { TableProps, SearchProps } from './helper'

const props = defineProps({
  tableOptions: {
    type: Object as PropType<
      TableProps &
        Partial<{
          showAdd: boolean
          showExpandAll: boolean
          listParams: Recordable
          /** 列表接口 */
          listApi: (options: any) => Promise<any>
          /** 删除接口 */
          delApi: (options: any) => Promise<any>
        }>
    >,
    default: () => ({})
  },
  formOptions: {
    type: Object as PropType<SearchProps>,
    default: () => ({})
  }
})

const emits = defineEmits<{
  (e: 'expandAll', isExpandAll: boolean): void
  (e: 'add'): void
}>()

const { t } = useI18n() // 国际化

const tableColumns = ref<TableColumn[]>([])

// 是否全屏
const fullscreen = ref(false)

// 是否展开全部
const isExpandAll = ref(false)

const drawerColumns = ref<TableColumn[]>([])

const tableProps = computed(() => {
  return {
    showAdd: true,
    align: 'left',
    headerAlign: 'left',
    ...props.tableOptions
  }
})
const formProps = computed(() => {
  return {
    ...props.formOptions,
    schema: props.formOptions.schema?.map((item) => {
      if (item.component === 'Input') {
        return {
          ...item,
          componentProps: {
            ...item.componentProps,
            style: {
              ...item.componentProps?.style,
              width: '200px'
            }
          }
        }
      }
      return item
    })
  }
})

watch(
  () => tableProps.value.columns,
  (val: TableColumn[]) => {
    tableColumns.value = val
    drawerColumns.value = val
  },
  {
    immediate: true
  }
)

watch(
  () => tableProps.value.listParams,
  (params: Recordable) => {
    tableObject.params = {
      ...tableObject.params,
      ...params
    }
  },
  {
    deep: true
  }
)

/** 展开全部 */
const handleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value
  emits('expandAll', isExpandAll.value)
}

const { tableObject, tableMethods, register } = useTable({
  getListApi: tableProps.value.listApi!,
  delListApi: tableProps.value.delApi!,
  defaultParams: {
    ...formProps.value.model,
    ...tableProps.value.listParams
  }
})

/** 更改每页显示条数 */
const handlePageSizeChange = (size: number) => {
  tableObject.pageSize = size
}

/** 新增 */
const handleAdd = () => {
  emits('add')
}

// 定制列显示隐藏
const drawerVisible = ref(false)
/** 点击右侧三个操作按钮 */
const handleToolClick = (key): void => {
  switch (key) {
    case 'refresh':
      tableMethods.reload()
      break
    case 'fullScreen':
      fullscreen.value = !fullscreen.value
      break
    case 'custom':
      drawerVisible.value = true
      break
  }
}

/** 查询/重置 */
const handleSearch = (model: Recordable) => {
  tableObject.params = model
  tableMethods.getList()
}

/** 改变列的排序 */
const handleColumnChange = (columns: TableColumn[]) => {
  tableColumns.value = columns.filter((item) => item.check)
  drawerColumns.value = columns
  drawerVisible.value = false
}
/** 还原列的数据 */
const handleColumnReset = () => {
  tableColumns.value = tableProps.value.columns!
  drawerColumns.value = tableProps.value.columns!
  drawerVisible.value = false
}

onMounted(() => {
  tableMethods.getList()
})

defineExpose({
  tableMethods,
  tableObject
})
</script>

<style lang="scss" scoped>
:deep(.table-header-style) {
  height: 50px;
  font-size: 14px;
  color: $header-text-color;
  background-color: $table-head-color !important;
}

.fullscreen-open {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1011;
  width: 100%;
  height: 100%;
}

:deep(.table-wrap) {
  .el-card__body {
    height: 100%;

    & > div {
      height: 100%;
    }
  }

  .table-box {
    flex: 1;
    overflow: hidden;
  }

  .el-pagination {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
