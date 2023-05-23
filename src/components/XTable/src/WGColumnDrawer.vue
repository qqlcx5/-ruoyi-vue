<script setup lang="ts">
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { getTableColumnConfig } from '@/utils/tableColumn'
import vuedraggable from 'vuedraggable'
import { useTableColumnStoreWithOut } from '@/store/modules/tableColumn'
import { cloneDeep } from 'lodash-es'

const attrs = useAttrs()
const firstColumnType = ['id', 'seq', 'radio', 'checkbox', 'expand', 'html', null]

const tableColumnStore = useTableColumnStoreWithOut()

const props = defineProps({
  title: propTypes.string.def(''),
  destroyOnClose: propTypes.bool.def(false),
  lockScroll: propTypes.bool.def(false),
  columns: propTypes.any.def([]),
  tableKey: propTypes.string.def(''),
  beforeClose: { type: Function as PropType<(...args) => any>, default: null }
})

const emits = defineEmits(['columnChange', 'confirm', 'reset'])

const getBindValue = computed(() => {
  let attrs = useAttrs()
  let obj = { ...attrs, ...props }
  obj['class'] = ''
  return obj
})

const getProps = computed(() => {
  let obj = getBindValue
  delete obj['class']
  return obj
})

const state: any = reactive({
  columnSet: []
})

watch(
  () => props.columns,
  (data) => {
    if (state.columnSet.length === 0) {
      console.log(data)
      state.columnSet = cloneDeep(data.filter((item) => !firstColumnType.includes(item.type)))
    }
  },
  { immediate: true }
)

watch(
  () => attrs.modelValue,
  (data) => {
    // 这里获取缓存进行比较
    if (data) {
      // 打开时的column配置，从缓存获取
      const columnConfig = getTableColumnConfig(props.tableKey, props.columns)
      if (columnConfig) {
        state.columnSet = columnConfig
      } else {
        state.columnSet = cloneDeep(
          props.columns.filter((item) => !firstColumnType.includes(item.type))
        )
      }
    }
  },
  { immediate: true }
)

// 动态变更
// watch(() => state.columnSet, (data) => {
//   // console.log(JSON.parse(JSON.stringify(data)));
//   emits('columnChange', data)
// }, {immediate: true})

const isIndeterminate = computed(() => {
  return state.columnSet.filter((column) => !column.disabled).every((item) => item.check)
})

const handleCheckAllChange = (val: boolean) => {
  state.columnSet
    .filter((column) => !column.disabled)
    .forEach((item) => {
      item.check = val
    })
}

const onMove = (e) => {
  if (e.relatedContext.element.disabled || e.relatedContext.element.fixed) return false
  return true
}

const reset = () => {
  tableColumnStore.setTableColumn({ tableKey: props.tableKey, column: null })
  emits('reset')
}

const confirm = () => {
  tableColumnStore.setTableColumn({ tableKey: props.tableKey, column: state.columnSet })
  emits('confirm', state.columnSet)
}
</script>

<template>
  <el-drawer
    class="columns-drawer"
    v-bind="getProps"
    direction="rtl"
    :lockScroll="false"
    size="240px"
  >
    <template #header>
      <h4 class="text-18px font-black m-0">定制列</h4>
    </template>
    <template #default>
      <el-checkbox :model-value="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <vuedraggable
        class="flex flex-col justify-center"
        v-model="state.columnSet"
        group="column"
        item-key="field"
        filter=".forbid"
        animation="300"
        :move="onMove"
      >
        <template #item="{ element }">
          <div
            class="flex justify-between items-center"
            :class="{ forbid: element?.disabled || element?.fixed }"
          >
            <el-checkbox
              class="mb-4px"
              v-model="element.check"
              @click.stop
              :disabled="element?.disabled"
            >
              {{ element.title }}
            </el-checkbox>
            <i class="iconfont icon-tuozhuai cursor-pointer"></i>
          </div>
        </template>
      </vuedraggable>
    </template>
    <template #footer>
      <div class="text-center mb-18px">
        <el-button type="primary" @click="confirm">确认</el-button>
        <el-button @click="reset">还原</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<style lang="scss">
.columns-drawer {
  .el-drawer__header {
    padding: 25px 20px;
    margin-bottom: 0;
    border-bottom: 1px solid #eaebef;
  }
  .el-drawer__body {
    padding: 20px 30px;
  }
}
</style>
