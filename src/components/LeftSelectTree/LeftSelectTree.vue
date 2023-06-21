<template>
  <el-card
    class="box-card"
    :body-style="{
      paddingTop: '5px'
    }"
  >
    <div class="switch-content" v-hasPermi="['system:tenant-area:visible-all']">
      <div>显示全部区划</div>
      <el-switch v-model="state.statusValue" @change="statusChange" class="switch-style" />
    </div>
    <el-input
      v-model="query"
      :suffix-icon="Search"
      placeholder="请输入关键词过滤"
      @input="onQueryChanged"
    />

    <el-tree-v2
      v-if="state.isShow"
      ref="treeRef"
      :data="state.treeData"
      :props="treeProps"
      :expand-on-click-node="false"
      :default-expanded-keys="state.defaultExpandedKeys"
      :current-node-key="state.currentNodeKey"
      :filter-method="filterMethod"
      @node-click="selectTree"
      :height="800"
      class="filter-tree"
      highlight-current
    />
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTreeV2 } from 'element-plus'
// import type { TreeNode } from 'element-plus/es/components/tree-v2/src/types'
import { Search } from '@element-plus/icons-vue'
import { getTreeAllCustomKeys } from '@/utils/utils'
import { handleTree } from '@/utils/tree'

interface TreeDataProps {
  treeData?: Array<any>
  statusValue?: boolean
}

const props = withDefaults(defineProps<TreeDataProps>(), {
  treeData: () => [],
  statusValue: false
})

const emit = defineEmits<{
  (e: 'sendCurrentSelect', key: any): void
  (e: 'statusChange', key: any): void
}>()

interface State {
  isShow: boolean
  defaultExpandedKeys: any[]
  currentNodeKey: string
  treeData: Array<any>
  isFirst: boolean
  statusValue: boolean
}

const state: State = reactive({
  isShow: false, //
  treeData: [],
  defaultExpandedKeys: [], //默认展开的节点
  currentNodeKey: '', //当前选中的节点
  isFirst: true, //第一次 进来 默认值 单独处理
  statusValue: false //显示全部区划
})

const query = ref('')
const treeRef = ref<InstanceType<typeof ElTreeV2>>()

// const data: Tree[] = reconstructedTreeData(provincesMunicipalitiesArea, needReplaceKey)
const treeProps = {
  value: 'code',
  label: 'name',
  children: 'children'
}

const onQueryChanged = (query: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  treeRef.value!.filter(query)
}
const filterMethod = (query: string, node: any) => {
  if (!query) {
    //当搜索为空串时 恢复初始状态即 选中第一项 且展开
    //默认选中第一个节点
    const tempFirstItem = state.treeData[0]
    state.currentNodeKey = tempFirstItem.code

    emit('sendCurrentSelect', {
      id: tempFirstItem.id,
      parentCode: tempFirstItem.parentCode,
      parentName: tempFirstItem.parentName,
      code: tempFirstItem.code,
      name: tempFirstItem.name,
      level: tempFirstItem.level,
      visible: tempFirstItem.visible,
      sort: tempFirstItem.sort,
      remark: tempFirstItem.remark
    })
    //  默认展开第一项省市区
    state.defaultExpandedKeys = getTreeAllCustomKeys(
      tempFirstItem.children[0].code,
      state.treeData,
      'code'
    )
    state.isShow = false
    nextTick(() => {
      state.isShow = true
    })
  }
  return node.name!.includes(query)
}

const selectTree = (data) => {
  //手动赋值 好像不支持 v-modal
  state.currentNodeKey = data.code
  emit('sendCurrentSelect', data)
}

//显示全部区划
const statusChange = () => {
  emit('statusChange', state.statusValue ? 0 : 1)
}

// onMounted(() => {
//   console.log('props.treeData', props.treeData)
//   //默认选中第一个节点
//   state.currentNodeKey = props.treeData[0]?.code
//   //  默认展开全部
//   state.defaultExpandedKeys = getAllIds(props.treeData)
//   state.isShow = true
//   // console.log('state.defaultExpandedKeys', state.defaultExpandedKeys)
// })

watch(
  () => props.treeData,
  (val) => {
    if (val.length === 0) {
      return
    }
    // state.treeData = val
    //   -1显示全部区划item
    const tempArr = val.filter((item) => item.code !== '-1')
    state.treeData = handleTree(tempArr, 'code', 'parentCode', 'children')

    if (state.isFirst) {
      //首次
      //默认选中第一个节点
      const tempFirstItem = state.treeData[0]
      state.currentNodeKey = tempFirstItem.code

      emit('sendCurrentSelect', {
        id: tempFirstItem.id,
        parentCode: tempFirstItem.parentCode,
        parentName: tempFirstItem.parentName,
        code: tempFirstItem.code,
        name: tempFirstItem.name,
        level: tempFirstItem.level,
        visible: tempFirstItem.visible,
        sort: tempFirstItem.sort,
        remark: tempFirstItem.remark
      })
      //  默认展开第一项省市区
      state.defaultExpandedKeys = getTreeAllCustomKeys(
        tempFirstItem.children[0].code,
        state.treeData,
        'code'
      )
      state.isFirst = false
      state.isShow = false
      // //  默认展开全部
      // state.defaultExpandedKeys = getAllCustomKeys(props.treeData, 'code')
      nextTick(() => {
        state.isShow = true
      })
    } else {
      //当前选中的节点
      const currentItem = val.find((item) => item.code === state.currentNodeKey)
      state.currentNodeKey = currentItem.code

      emit('sendCurrentSelect', {
        id: currentItem.id,
        parentCode: currentItem.parentCode,
        parentName: currentItem.parentName,
        code: currentItem.code,
        name: currentItem.name,
        level: currentItem.level,
        visible: currentItem.visible,
        sort: currentItem.sort,
        remark: currentItem.remark
      })
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.statusValue,
  (val) => {
    state.statusValue = val
  }
)
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 322px;
  height: 100%;
  //padding-bottom: 30px;
  //margin-right: 10px;
}
.filter-tree {
  margin-top: 15px;
}
.switch-content {
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.switch-style {
  margin-left: 9px;
}
</style>
