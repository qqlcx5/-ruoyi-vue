<script setup lang="ts">
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import vuedraggable from "vuedraggable";

const props = defineProps({
  title: propTypes.string.def(''),
  destroyOnClose: propTypes.bool.def(false),
  lockScroll: propTypes.bool.def(false),
  columns: propTypes.any.def([]),
  beforeClose: { type: Function as PropType<(...args) => any>, default: null }
})

const emits = defineEmits(['columnChange'])

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
  console.log(data);
  if (state.columnSet.length === 0) {
    state.columnSet = data.filter(column => !column.fixed);
  }
}, {immediate: true})

watch(() => state.columnSet, (data) => {
  console.log(JSON.parse(JSON.stringify(data)));
  emits('columnChange', data)
}, {immediate: true})

const checkboxGroup = ref([])

const list = ref([1,2,3,4,5,6,7,8,9])

const drag = ref(false);

</script>

<template>
  <el-drawer class="columns-drawer" v-bind="getProps" direction="rtl" :lockScroll="false" size="240px">
    <template #header>
      <h4 class="text-18px font-black m-0">定制列</h4>
    </template>
    <template #default>
      <el-checkbox-group v-model="checkboxGroup">
        <vuedraggable
          class="flex flex-col justify-center"
          v-model="state.columnSet"
          group="column"
          @start="drag=true"
          @end="drag=false"
          item-key="field">
          <template #item="{element, index}">
            <el-checkbox @click.native.stop>
              {{ element.title }}
            </el-checkbox>
          </template>
        </vuedraggable>
<!--        <vuedraggable v-model="props.columns" draggable=".item">-->
<!--&lt;!&ndash;          <transition-group>&ndash;&gt;-->
<!--            -->
<!--&lt;!&ndash;          </transition-group>&ndash;&gt;-->
<!--        </vuedraggable>-->
      </el-checkbox-group>

    </template>
    <!--        <template #footer>-->
    <!--          <div style="flex: auto">-->
    <!--            <el-button @click="cancelClick">cancel</el-button>-->
    <!--            <el-button type="primary" @click="confirmClick">confirm</el-button>-->
    <!--          </div>-->
    <!--        </template>-->

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
