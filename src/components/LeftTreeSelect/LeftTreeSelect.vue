<!--  左侧树形选择  -->
<template>
  <a-card
    :bordered="false"
    style="min-width: 322px; height: 100%; padding-bottom: 30px; margin-right: 10px"
  >
    <div class="setting-content">
      部门
      <Icon icon="svg-icon:setting" :size="16" />
    </div>
    <div class="cross-line"></div>
    <div class="tree-select-content">
      <a-input-search
        v-model:value="searchValue"
        style="margin-bottom: 8px"
        placeholder="请输入部门名称搜索"
      />
      <a-tree
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="state.treeData"
        v-model:selectedKeys="state.selectedKeys"
        @expand="onExpand"
      >
        <template #title="{ title }">
          <span v-if="title.indexOf(searchValue) > -1">
            {{ title.substr(0, title.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ title }}</span>
        </template>
      </a-tree>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { TreeProps } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'

interface treeDataType {
  key: string | number
  title: string
  children?: treeDataType[]
}

interface TreeDataProps {
  treeData?: Array<treeDataType>
  selectedKeys?: Array<any>
  testArr?: Array<any>
}

const props = withDefaults(defineProps<TreeDataProps>(), {
  treeData: [],
  selectedKeys: [],
  isShow: false,
  testArr: []
})

const emit = defineEmits<{
  (e: 'sendCurrentSelect', key: string | number): void
}>()

const expandedKeys = ref<(string | number)[]>([])
const searchValue = ref<string>('')
const autoExpandParent = ref<boolean>(true)

const state = reactive({
  treeData: cloneDeep(props.treeData),
  selectedKeys: []
  // selectedKeys: [cloneDeep(props.treeData[0]?.key)]
})

const dataList: TreeProps['treeData'] = []
/**
 * 遍历树 获取 key title 数组
 * @param data 树
 * */
const generateList = (data: TreeProps['treeData']) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({ key, title: node.title })
    if (node.children) {
      generateList(node.children)
    }
  }
}
generateList(state.treeData)

/**
 * 遍历树 获取 上级(包括祖先节点)的所有树节点
 * @param key title
 * @param tree 树
 * */
const getParentKey = (
  key: string | number,
  tree: TreeProps['treeData']
): string | number | undefined => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item.title === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

const onExpand = (keys: string[]) => {
  expandedKeys.value = keys
  autoExpandParent.value = false
}

//
/**
 * 遍历树 获取需要展开的层级数的所有祖先节点key 当传入的depth大于等于当前树的max深度后取所有
 * @param treeData 树
 * @param depth number 需要展开的层级
 * */
const getKeysByDepth = (treeData: Array<treeDataType>, depth: number): Array<string | number> => {
  const keys: Array<string | number> = []

  const traverse = (node: treeDataType, currentDepth: number) => {
    if (currentDepth >= depth) {
      keys.push(node.key)
    } else {
      node.children?.forEach((child) => traverse(child, currentDepth + 1))
    }
  }

  treeData.forEach((root) => traverse(root, 0))

  const maxDepth = getMaxDepth(treeData)
  if (depth >= maxDepth) {
    console.log(`指定的深度 ${depth} 大于等于树的深度 ${maxDepth}，返回所有节点的 key 属性`)
    return getAllKeys(treeData)
  }

  return keys
}

//获取树的深度
const getMaxDepth = (treeData: Array<treeDataType>): number => {
  let maxDepth = 0

  const traverse = (node: treeDataType, currentDepth: number) => {
    maxDepth = Math.max(maxDepth, currentDepth)
    node.children?.forEach((child) => traverse(child, currentDepth + 1))
  }

  treeData.forEach((root) => traverse(root, 0))

  return maxDepth
}

//获取树的所有keys
const getAllKeys = (treeData: Array<treeDataType>): Array<string | number> => {
  const keys: Array<string | number> = []

  const traverse = (node: treeDataType) => {
    keys.push(node.key)
    node.children?.forEach((child) => traverse(child))
  }

  treeData.forEach((root) => traverse(root))

  return keys
}

//TODO:设置展开层级 有空再补充 方法写了已经 - -
// const keys = getKeysByDepth(state.treeData, 2)
// console.log(keys)
// setTimeout(() => {
//   expandedKeys.value = keys
// }, 1000)

watch(searchValue, (value) => {
  const expanded = dataList
    .map((item: TreeProps['treeData'][number]) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.title, state.treeData)
      }
      return null
    })
    .filter((item, i, self) => item && self.indexOf(item) === i)
  expandedKeys.value = expanded
  searchValue.value = value
  autoExpandParent.value = true
})

watch(
  () => state.selectedKeys,
  (val) => {
    if (val[0]) {
      //选中的值向上发送
      emit('sendCurrentSelect', val[0])
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.treeData,
  () => {
    state.treeData = cloneDeep(props.treeData)
    // state.selectedKeys = [cloneDeep(props.treeData[0]?.key)]
    // console.log('props.treeData[0]?.key',  props.treeData[0]?.key)
    // console.log('typeof props.treeData[0]?.key', typeof props.treeData[0]?.key)
  },
  {
    immediate: true
  }
)

watch(
  () => props.selectedKeys,
  () => {
    nextTick(() => {
      const tempArr = []
      props.selectedKeys?.map((item) => {
        tempArr.push(item)
      })
      state.selectedKeys = tempArr
      expandedKeys.value = tempArr
    })
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
//top
.setting-content {
  height: 49px;
  padding: 17px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
//横线
.cross-line {
  width: 100%;
  height: 1px;
  border: 1px solid rgba(234, 235, 239, 1);
}
.tree-select-content {
  padding: 18px 15px 0 15px;
}
</style>
