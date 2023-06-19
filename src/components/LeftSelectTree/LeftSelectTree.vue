<template>
  <el-card class="box-card">
    <!--    <el-input v-model="filterText" :suffix-icon="Search" placeholder="Filter keyword" />-->
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
import type { TreeNode } from 'element-plus/es/components/tree-v2/src/types'
import { Search } from '@element-plus/icons-vue'
import { getAllCustomKeys, getAllIds, reconstructedTreeData } from '@/utils/utils'
import { provincesMunicipalitiesArea } from '@/constant/pr'

interface TreeDataProps {
  treeData?: Array<any>
}

const props = withDefaults(defineProps<TreeDataProps>(), {
  treeData: () => []
})

const emit = defineEmits<{
  (e: 'sendCurrentSelect', key: any): void
}>()

interface State {
  isShow: boolean
  defaultExpandedKeys: any[]
  currentNodeKey: string
  treeData: Array<any>
  isFirst: boolean
}

const state: State = reactive({
  isShow: false, //
  treeData: [],
  defaultExpandedKeys: [], //默认展开的节点
  currentNodeKey: '', //当前选中的节点
  isFirst: true //第一次 进来 默认值 单独处理
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
const filterMethod = (query: string, node: TreeNode) => {
  console.log('node', node)
  return node.label!.includes(query)
}

const selectTree = (data, node) => {
  console.log('data', data)
  console.log('node', node)
  emit('sendCurrentSelect', node)
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
    console.log('val', val)
    if (val.length === 0) {
      return
    }
    state.treeData = val
    //默认选中第一个节点
    state.currentNodeKey = props.treeData[0]?.children[0]?.children[0]?.code
    console.log('props.treeData[0]?.children[0]?.children[0]', props.treeData[0])
    if (state.isFirst) {
      //首次
      emit('sendCurrentSelect', {
        data: {
          id: props.treeData[0].children[0].children[0].id,
          parentCode: props.treeData[0].children[0].children[0].parentCode,
          parentName: props.treeData[0].children[0].children[0].parentName,
          code: props.treeData[0].children[0].children[0].code,
          name: props.treeData[0].children[0].children[0].name,
          level: props.treeData[0].children[0].children[0].level,
          visible: props.treeData[0].children[0].children[0].visible,
          sort: props.treeData[0].children[0].children[0].sort,
          remark: props.treeData[0].children[0].children[0].remark
        }
      })
      state.isFirst = false
    }
    state.isShow = false
    //  默认展开全部
    state.defaultExpandedKeys = getAllCustomKeys(props.treeData, 'code')
    console.log('state.defaultExpandedKeys', state.defaultExpandedKeys)
    nextTick(() => {
      state.isShow = true
    })
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 322px;
  height: 100%;
  padding-bottom: 30px;
  margin-right: 10px;
}
.filter-tree {
  margin-top: 15px;
}
</style>
