<template>
  <!-- 弹窗 -->
  <XModal title="选择部门/人" v-model="modelVisible" width="858px">
    <div class="grid grid-cols-3">
      <div class="grid-item">
        <div class="info-title">部门</div>
        <el-scrollbar height="480">
          <el-tree
            ref="treeRef"
            node-key="id"
            show-checkbox
            highlight-current
            default-expand-all
            :check-strictly="props.mode === 'single'"
            :default-checked-keys="defaultCheckedKeys"
            :props="{ ...defaultProps, class: customNodeClass }"
            :data="treeData"
            @check="onTreeCheck"
            @node-click="onTreeNodeClick"
          />
        </el-scrollbar>
      </div>
      <div class="grid-item">
        <div class="info-title">成员</div>
        <el-scrollbar height="480">
          <el-checkbox-group v-model="currentNode.userIds" class="!flex !flex-col">
            <el-checkbox
              class="!h-26px !block"
              v-for="item in currentNodeUsers"
              :value="item.id"
              :label="item.id"
              :key="item.id"
              @change="onCheckboxChange($event, item)"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-scrollbar>
      </div>
      <div class="grid-item">
        <div class="info-title">已选信息</div>
        <el-scrollbar height="480">
          <el-tree
            ref="selectedTreeRef"
            node-key="id"
            highlight-current
            default-expand-all
            :props="defaultProps"
            :data="selectedTreeData"
          />
        </el-scrollbar>
      </div>
    </div>

    <template #footer>
      <!-- 按钮：取消 -->
      <XButton :title="t('common.cancel')" @click="close()" />
      <!-- 按钮：确认 -->
      <XButton type="primary" :title="t('common.confirmSelect')" @click="submitForm()" />
    </template>
  </XModal>
</template>
<script setup lang="ts">
import { handleTree, defaultProps } from '@/utils/tree'
import { ElTree } from 'element-plus'
import { message } from 'ant-design-vue'
import { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import { cloneDeep } from 'lodash-es'
import { getListDeptUser } from '@/api/system/role'

const { t } = useI18n() // 国际化
const props = defineProps({
  mode: {
    type: String,
    default: 'multipart' // multipart or single
  }
})
const modelVisible = ref(false) // 是否显示弹出层

// --------------- 部门 ---------------
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<any[]>([])
const defaultCheckedKeys = ref<any[]>([])
const currentNode = ref<TreeNodeData>({})
const currentNodeUsers = computed(() => {
  if (!currentNode.value.children) return []
  return currentNode.value?.children.filter((i) => i.type === 'user') || []
})

const onTreeCheck = (node) => {
  currentNode.value = node
  treeRef.value!.setCurrentKey(node.id, true)
  setCurrentNodeStatus(node.id)
  getSelectedTreeData()
}
const onTreeNodeClick = async (node) => {
  currentNode.value = node
  setCurrentNodeStatus(node.id)
}
const customNodeClass = (data) => {
  if (data.type === 'user') {
    return 'hidden'
  }
  return null
}

// --------------- 成员 ---------------
const setCurrentNodeStatus = (key) => {
  const node = treeRef.value!.getNode(key)
  if (node.checked) {
    currentNode.value.userIds = currentNodeUsers.value.map((item) => item.id)
  } else if (node.indeterminate) {
    currentNode.value.userIds = treeRef.value!.getCheckedKeys(true)
  } else {
    currentNode.value.userIds = []
  }
  // const status = treeRef.value!.getCheckedNodes().find((item) => item.id === currentNode.value.id)
  // currentNode.value.userIds = status ? currentNodeUsers.value.map((item) => item.id) : []
}
const onCheckboxChange = (value, data) => {
  treeRef.value!.setChecked(data.id, value, true)
  getSelectedTreeData()
}

// --------------- 已选信息 ---------------
const selectedTreeData = ref<any[]>([])
// 获取已选信息
const getSelectedTreeData = () => {
  // selectedTreeData.value = handleTree(cloneDeep(treeRef.value!.getCheckedNodes(false, true)))
  // console.log(
  //   cloneDeep(treeRef.value!.getCheckedNodes(false, true)).sort((a, b) => {
  //     if (typeof a.id === 'string' && typeof b.id === 'number') {
  //       return -1 // 字符串在数字前面
  //     } else {
  //       return 0
  //     }
  //   })
  // )
  const checkNodes = handleTree(cloneDeep(treeRef.value!.getCheckedNodes(false, true)))
  checkNodes.forEach((i) => {
    recursiveFn(i)
  })
  function recursiveFn(item) {
    if (item['children']) {
      item['children'].sort((a, b) => {
        if (typeof a.id === 'string' && typeof b.id === 'number') {
          return -1 // 字符串在数字前面
        } else {
          return 0
        }
      })
      for (const c of item['children']) {
        recursiveFn(c)
      }
    }
  }
  selectedTreeData.value = checkNodes
  // console.log(checkNodes)
}

const init = async () => {
  const { orgList, userList } = await getListDeptUser()
  const users = userList.map((item) => {
    return {
      id: 'user-' + item.userId,
      name: item.nickname,
      account: item.username,
      parentId: item.deptId,
      type: item.type
    }
  })
  treeData.value = handleTree([...cloneDeep(orgList), ...cloneDeep(users)])
}

// 打开弹窗
const openModal = async (deptIds?: any[], dataScopeUsers = []) => {
  const userIds = dataScopeUsers.map((uId) => `user-${uId}`)
  if (deptIds && deptIds.length > 0) defaultCheckedKeys.value = [...userIds, ...deptIds]
  await init()
  modelVisible.value = true
  await nextTick()
  getSelectedTreeData()
}
defineExpose({ openModal }) // 提供 openModal 方法，用于打开弹窗

// 提交新增/修改的表单
const emit = defineEmits(['confirm']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  const checkedNodes = treeRef.value!.getCheckedNodes()
  if (props.mode === 'single') {
    if (checkedNodes.length === 0) return message.warning('请勾选')
    emit('confirm', checkedNodes[0])
  } else {
    const selectedData = checkedNodes.filter((i) => i.type !== 'user')
    const selectedStaffData = cloneDeep(checkedNodes)
      .filter((i) => i.type === 'user')
      .map((i) => {
        i.id = i.id.slice(5)
        return i
      })
    emit('confirm', selectedData, selectedStaffData)
  }
  close()
}
const close = () => {
  defaultCheckedKeys.value = []
  currentNode.value = {}
  modelVisible.value = false
}
</script>
<style lang="scss" scoped>
.grid-item {
  padding-left: 16px;
  //overflow: hidden;

  &:not(:last-child) {
    border-right: 1px solid $border-color;
  }
}

.info-title {
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: bold;
  color: $title-color;
}

.staff-item {
  padding-left: 24px;
  line-height: 26px;
  cursor: pointer;

  &:hover {
    background-color: var(--el-fill-color-light);
  }
}
</style>
