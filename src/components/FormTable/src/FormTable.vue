<template>
  <div class="form-table flex flex-col h-full">
    <ContentWrap>
      <Search v-bind="formProps" @search="handleSearch" @reset="handleSearch">
        <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </Search>
    </ContentWrap>
    <ContentWrap ref="tableWrapRef" :class="{ 'fullscreen-open': fullscreen }" class="flex-1">
      <div class="flex flex-col h-full">
        <div ref="tableToolRef" class="flex justify-between items-center mb-5">
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
          v-bind="tableProps"
          :columns="tableColumns"
          class="flex-1"
          @update:page-size="handlePageSizeChange"
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
import { TableProps, FormProps } from './helper'

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
    type: Object as PropType<FormProps>,
    default: () => ({})
  }
})

// const props = withDefaults(
//   defineProps<
//     Partial<{
//       // ======= 表单相关 =======
//       /** 表单项 */
//       schema: FormSchema[]
//       /** 表单数据对象 */
//       model: Recordable
//       /** 表单label宽度 */
//       labelWidth: string | number
//       showSearch: boolean
//       showReset: boolean
//       /** 是否显示伸缩 */
//       expand: boolean
//       /** 伸缩的界限字段 */
//       expandField: string
//       inline: boolean

//       // ======= 表格相关 =======
//       showAdd: boolean
//       showExpandAll: boolean
//       /** 列表接口 */
//       listApi: (options: any) => Promise<any>
//       /** 删除接口 */
//       delApi: (options: any) => Promise<any>
//       pageSize: number
//       currentPage: number
//       /** 是否多选 */
//       selection: boolean
//       /** 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip */
//       showOverflowTooltip: boolean
//       /** 表头 */
//       columns: TableColumn[]
//       /** 展开行 */
//       expandRow: boolean
//       /** 是否展示分页 */
//       pagination: Pagination
//       /** 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key） */
//       reserveSelection: boolean
//       /** 加载状态 */
//       loading: boolean
//       /** 是否叠加索引 */
//       reserveIndex: boolean
//       /** 对齐方式 */
//       align: string
//       /** 列表额外请求参数 */
//       listParams: Recordable
//       /** 表头对齐方式 */
//       headerAlign: string
//       /** 表格数据 */
//       data: Recordable[]
//     }>
//   >(),
//   {
//     autoPlaceholder: true,
//     showSearch: true,
//     showReset: true,
//     inline: true,
//     isCustom: false,
//     labelWidth: 'auto',
//     showAdd: true,
//     showExpandAll: false,
//     align: 'left',
//     headerAlign: 'left'
//   }
// )
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

// const formProps = computed(() => {
//   const form: Recordable = {}
//   const schema = props.schema?.map((item) => {
//     if (item.component === 'Input') {
//       return {
//         ...item,
//         componentProps: {
//           ...item.componentProps,
//           style: {
//             ...item.componentProps?.style,
//             width: '200px'
//           }
//         }
//       }
//     }
//     return item
//   })
//   for (const key in props) {
//     if (formPropsKeyList.includes(key)) {
//       if (key === 'schema') {
//         form[key] = schema
//       } else {
//         form[key] = props[key]
//       }
//     }
//   }
//   return form
// })

// const tableProps = computed(() => {
//   const table: Recordable = {}
//   for (const key in props) {
//     if (!formPropsKeyList.includes(key)) {
//       table[key] = props[key]
//     }
//   }
//   return table
// })

// 表单处理
// const getSchema = computed(() =>
// props.schema?.map((item) => {
//   if (item.component === 'Input') {
//     return {
//       ...item,
//       componentProps: {
//         ...item.componentProps,
//         style: {
//           ...item.componentProps?.style,
//           width: '200px'
//         }
//       }
//     }
//   }
//   return item
// })
// )
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

const { tableObject, tableMethods } = useTable({
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

const tableWrapRef = ref()
const tableToolRef = ref()

onMounted(() => {
  console.log(tableToolRef.value.offsetHeight)
  console.log(tableWrapRef.value)

  tableMethods.getList()
})

defineExpose({
  tableMethods,
  tableObject
})
</script>

<style lang="scss">
.table-header-style {
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
</style>
