<!--  左侧树形选择 主体 -->
<template>
  <a-card style="max-width: 350px; height: 100%; padding-bottom: 30px; margin-right: 10px">
    <div class="setting-content">
      主体信息
      <div class="expand-narrow" @click="expandMaj">
        <Icon icon="svg-icon:narrow" :size="15" />
        <span class="expand-narrow-text"> 展开 </span>
      </div>
    </div>
    <div class="cross-line"></div>
    <div class="tree-select-content">
      <a-input-search
        v-model:value="searchValue"
        style="margin-bottom: 8px"
        placeholder="请输入区域搜索"
      />
      <a-button
        type="primary"
        @click="addMaj"
        v-hasPermi="['system:tenant:create']"
        class="add-style"
      >
        <template #icon><Icon icon="svg-icon:add" class="btn-icon" :size="10" /></template>
        新增主体
      </a-button>
      <a-tree
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="state.treeData"
        v-model:selectedKeys="state.selectedKeys"
        :height="610"
        blockNode
        @select="selectTree"
        @expand="onExpand"
      >
        <template #title="{ title, storeCount, type, id }">
          <div class="tree-node">
            <div>
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length)
                }}{{ storeCount ? `(${storeCount})` : '' }}
              </span>
              <span v-else>{{ title }}{{ storeCount ? `(${storeCount})` : '' }}</span>
            </div>
            <div>
              <a-popover placement="bottom" class="margin-left-14">
                <template #content>
                  <!--  TODO 换成数组遍历吧  -->
                  <div>
                    <XTextButton
                      title="修改"
                      v-hasPermi="['system:tenant:update']"
                      @click="clickOperation('edit', id)"
                    />
                  </div>
                  <div>
                    <XTextButton
                      title="新增门店"
                      v-if="type === majorIndividualType.dealer"
                      v-hasPermi="['system:tenant:create-store']"
                      @click="clickOperation('addStore', id)"
                    />
                  </div>
                  <div>
                    <XTextButton
                      title="新增子项"
                      v-if="type === majorIndividualType.manufacturer"
                      v-hasPermi="['system:tenant:create-child']"
                      @click="clickOperation('addChild', id)"
                    />
                  </div>
                  <div>
                    <XTextButton
                      title="配置菜单"
                      v-hasPermi="['system:tenant:auth']"
                      @click="clickOperation('editMenu', id)"
                    />
                  </div>
                  <div>
                    <XTextButton
                      title="详情"
                      v-hasPermi="['system:tenant:detail']"
                      @click="clickOperation('detail', id)"
                    />
                  </div>
                  <div>
                    <XTextButton
                      title="企业文化"
                      v-hasPermi="['system:tenant:update-culture']"
                      @click="clickOperation('culture', id)"
                    />
                  </div>
                  <div>
                    <XTextButton
                      title="绑定域名"
                      v-hasPermi="['system:tenant:bind-domain']"
                      @click="clickOperation('domain', id)"
                    />
                  </div>
                </template>
                <Icon icon="svg-icon:lengthways-ellipsis" class="btn-icon" :size="18" />
              </a-popover>
            </div>
          </div>
        </template>
      </a-tree>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { TreeProps } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { getAllCustomKeys } from '@/utils/utils'
import { majorIndividualType } from '@/utils/constants'

// interface treeDataType {
//   key: string | number
//   title: string
//   tagText?: string
//   children?: treeDataType[]
// }

interface TreeDataProps {
  treeData?: Array<any>
  selectedKeys?: Array<any>
  isShow?: boolean
  needTag?: boolean
  testArr?: Array<any>
  proAreaList?: Array<any>
  currentSelectRecord?: any
}

const props = withDefaults(defineProps<TreeDataProps>(), {
  treeData: () => [],
  selectedKeys: () => [],
  isShow: false,
  testArr: () => [],
  proAreaList: () => [],
  currentSelectRecord: () => {}
})

const emit = defineEmits<{
  (e: 'sendCurrentSelect', key: any, select: any): void
  (e: 'clickOperation', key: any): void
  (e: 'expandMaj'): void
  (e: 'addMaj'): void
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
// generateList(state.treeData)

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
  // dataList 丢失 直接在这里补一次吧 没空排查原因
  generateList(state.treeData)
  const expanded = dataList
    .map((item: TreeProps['treeData'][number]) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.title, state.treeData)
      }
      return null
    })
    .filter((item, i, self) => item && self.indexOf(item) === i)
  expandedKeys.value = expanded
  if (!value) {
    //搜索为空 时 收起整颗树
    expandedKeys.value = []
  }
  searchValue.value = value
  autoExpandParent.value = true
})

const selectTree = (selectedKeys, e) => {
  console.log('selectedKeys', selectedKeys)
  emit('sendCurrentSelect', e.node, selectedKeys)
}

//展开 table
const expandMaj = () => {
  emit('expandMaj')
}
//新增主体
const addMaj = () => {
  emit('addMaj')
}

//操作
const clickOperation = (operationType, id) => {
  console.log('id', id)
  emit('clickOperation', {
    operationType,
    id
  })
}

watch(
  () => props.treeData,
  () => {
    state.treeData = cloneDeep(props.treeData)
    //展开全部
    expandedKeys.value = getAllCustomKeys(state.treeData, 'id')

    const tempArr: any = []
    tempArr.push(props.currentSelectRecord.id)
    state.selectedKeys = tempArr
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.add-style {
  margin: 8px 0 13px 0;
}
//top
.setting-content {
  height: 63px;
  padding: 23px 0 17px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(51, 51, 51, 1);
  font-size: 18px;
  font-weight: bold;
  font-family: PingFangSC-Medium;
}
//横线
.cross-line {
  width: 100%;
  height: 1px;
  border-top: 1px solid rgba(234, 235, 239, 1);
}
.tree-select-content {
  padding: 18px 15px 0 15px;
}
.tree-node {
  display: flex;
  justify-content: space-between;
}
.has-transferred {
  margin-left: 10px;
  width: 52px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: rgba(255, 65, 65, 0.05);
  color: rgba(255, 65, 65, 1);
  font-size: 12px;
  text-align: right;
  font-family: PingFangSC-Regular;
}
.expand-narrow-text {
  margin-left: 6px;
  color: rgba(0, 129, 255, 1);
  font-size: 14px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
.expand-narrow {
  height: 100%;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
