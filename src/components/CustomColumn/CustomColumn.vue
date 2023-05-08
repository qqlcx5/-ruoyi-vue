<template>
  <!--  定制列 v-if是为销毁 - -否则非第一次打开会带入过渡动画 - - -->
  <a-modal
    :visible="true"
    title="定制列"
    wrapClassName="custom-column"
    width="240px"
    @cancel="closeModal"
  >
    <div>
      <div class="groupTotalContent">
        <div class="select-all">
          <a-checkbox v-model:checked="state.checkAll" @change="onCheckAllChange">
            全选
          </a-checkbox>
        </div>

        <a-checkbox-group v-model:value="state.checkedList" class="checkbox-group">
          <!--拖拽插件-->
          <VueDraggableNext
            :list="state.columnsCheckList"
            @dragend="dragEnd(state.columnsCheckList)"
            v-if="state.columnsCheckList.length > 0"
          >
            <!--拖拽过渡 -->
            <transition-group type="transition" name="flip-list">
              <div v-for="item in state.columnsCheckList" :key="item.key" class="checkbox-content">
                <a-checkbox :value="item.key" style="width: 100%" :disabled="item?.disabled">
                  {{ item.title }}
                </a-checkbox>
                <img :src="dragImg" alt="" />
              </div>
            </transition-group>
          </VueDraggableNext>
        </a-checkbox-group>
      </div>
    </div>

    <!--  footer  -->
    <template #footer>
      <a-button type="primary" html-type="submit" @click="columnsSave">确认</a-button>
      <a-button @click="setDefaultColumns">还原</a-button>
    </template>
  </a-modal>
</template>

<script lang="tsx" setup>
import { VueDraggableNext } from 'vue-draggable-next'
import { cloneDeep } from 'lodash-es'
import dragImg from '@/assets/imgs/system/drag.png'

const props = defineProps({
  allColumns: {
    type: Array,
    default() {
      return []
    }
  },
  defaultKeys: {
    type: Array,
    default() {
      return []
    }
  }
})

const emit = defineEmits(['changeColumn'])

//ALL columns 用于定制列过滤 排序 直接拷贝了 懒得改代码了 - -
const allColumns = cloneDeep(props.allColumns)

const state = reactive({
  checkAll: false, //是否全选
  columns: [],
  defaultKeys: [...props.defaultKeys], //默认的keys
  checkedList: [], //定制列 选中的
  columnsCheckList: cloneDeep(allColumns) //定制列 复选框
})

//定制列
//全选checkbox onchange
const onCheckAllChange = (e) => {
  const tempArr = []
  if (e.target.checked === true) {
    state.columnsCheckList.map((item) => {
      tempArr.push(item.key)
    })
  } else {
    state.columnsCheckList.map((item) => {
      if (item.disabled) {
        tempArr.push(item.key)
      }
    })
    // state.checkAll = false
  }

  Object.assign(state, {
    // checkedList: e.target.checked ? tempArr : [],
    checkedList: tempArr,
    indeterminate: false
  })
}
//拖拽
const dragEnd = (list) => {
  //重写 sort
  list.map((item, index) => {
    item.sort = index + 1
  })
}
//定制列 确定
const columnsSave = () => {
  //过滤出 勾选的项
  const checkList = state.columnsCheckList.filter((item) => state.checkedList.includes(item?.key))
  state.columns = checkList.sort((a, b) => a.sort - b.sort)
  emit('changeColumn', state.columns)
}
//定制列还原
const setDefaultColumns = () => {
  //初始化 获取默认的 columns
  state.columns = getColumns()

  //复选框 选中keys 还原
  state.checkedList = cloneDeep(state.defaultKeys)

  //复选框list位置还原
  state.columnsCheckList = cloneDeep(allColumns)

  emit('changeColumn', state.columns)
}

//获取默认的columns
const getColumns = () => {
  state.checkedList = [...state.defaultKeys]
  const currentColumns = allColumns.filter((columnsItem) => {
    return state.defaultKeys.some((item) => columnsItem.key === item)
  })
  return currentColumns
}

const closeModal = () => {
  emit('changeColumn', [], true)
}
//初始化 获取默认的 columns
state.columns = getColumns()

//复选框 全选中 全选checkbox 勾选
watch(
  () => state.checkedList,
  (val) => {
    // state.indeterminate = !!val.length && val.length < state.columnsCheckList.length
    state.checkAll = val.length === state.columnsCheckList.length
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
//拖拽动画
.flip-list-move {
  transition: transform 0.5s;
}
//定制列 checkbox
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0;
}
.checkbox-content {
  width: 200px;
  display: flex;
  justify-content: space-around;
}
img {
  width: 14px;
  height: 10px;
}
</style>

<style lang="scss">
//修改 详细 modal位置
.custom-column {
  .ant-modal {
    max-width: 100%;
    position: absolute;
    top: 0;
    left: initial;
    right: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
