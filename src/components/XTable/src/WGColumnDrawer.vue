<script setup lang="ts">
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { getTableColumnConfig } from '@/utils/tableColumn'
import vuedraggable from "vuedraggable";
import {ColumnType, useTableColumnStoreWithOut } from '@/store/modules/tableColumn'

const attrs = useAttrs()

const tableColumnStore = useTableColumnStoreWithOut();

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
  obj['class'] = '';
  return obj
})

const getProps = computed(() => {
  let obj = getBindValue;
  delete obj['class'];
  return obj;
})

const state: any = reactive({
  columnSet: []
})

watch(() => props.columns, (data) => {
  if (state.columnSet.length === 0) {
    state.columnSet = data.filter(column => !column.fixed);
  }
}, {immediate: true})

watch(() => attrs.modelValue, (data) => {
  // 这里获取缓存进行比较
  if (data) {
    // 打开时的column配置，从缓存获取
    const columnConfig = getTableColumnConfig(props.tableKey, props.columns);
    if (columnConfig) state.columnSet = columnConfig;
  }
}, {immediate: true})

// 动态变更
// watch(() => state.columnSet, (data) => {
//   // console.log(JSON.parse(JSON.stringify(data)));
//   emits('columnChange', data)
// }, {immediate: true})

const drag = ref(false);

const reset = () => {
  state.columnSet = props.columns.filter(column => !column.fixed);
  tableColumnStore.setTableColumn({tableKey: props.tableKey, column: null})
  emits('reset');
}

const confirm = () => {
  tableColumnStore.setTableColumn({tableKey: props.tableKey, column: state.columnSet});
  emits('confirm', state.columnSet);
}

</script>

<template>
  <el-drawer class="columns-drawer" v-bind="getProps" direction="rtl" :lockScroll="false" size="240px">
    <template #header>
      <h4 class="text-18px font-black m-0">定制列</h4>
    </template>
    <template #default>
      <vuedraggable
        class="flex flex-col justify-center"
        v-model="state.columnSet"
        group="column"
        @start="drag=true"
        @end="drag=false"
        item-key="field">
        <template #item="{element, index}">
          <el-checkbox v-model="element.check" @click.native.stop>
            {{ element.title }}
            {{ element.check }}
          </el-checkbox>
        </template>
      </vuedraggable>
    </template>
    <template #footer>
      <div>
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
    border-bottom: 1px solid #EAEBEF;
  }
}


</style>
