<template>
  <!-- 弹窗 -->
  <XModal title="选择部门/人" v-model="modelVisible" width="858px">
    <div class="grid grid-cols-3">
      <div class="grid-item">
        <div class="info-title">部门</div>
        <el-tree
          class="max-h-560px"
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
      </div>
      <div class="grid-item">
        <div class="info-title">成员</div>
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
      </div>
      <div class="grid-item">
        <div class="info-title">已选信息</div>
        <el-tree
          class="max-h-560px"
          ref="selectedTreeRef"
          node-key="id"
          highlight-current
          default-expand-all
          :props="defaultProps"
          :data="selectedTreeData"
        />
      </div>
    </div>

    <template #footer>
      <!-- 按钮：取消 -->
      <XButton :title="t('common.cancel')" @click="modelVisible = false" />
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
  selectedTreeData.value = handleTree(cloneDeep(treeRef.value!.getCheckedNodes(false, true)))
}

const init = async () => {
  const { orgList, userList } = await getListDeptUser()
  const users = userList.map((item) => {
    return {
      id: item.id,
      name: item.nickname,
      account: item.username,
      parentId: item.deptId,
      type: 'user'
    }
  })
  treeData.value = handleTree([...cloneDeep(orgList), ...cloneDeep(users)])
}

// 打开弹窗
const openModal = async (deptIds?: any[], dataScopeUsers?) => {
  if (deptIds && deptIds.length > 0) defaultCheckedKeys.value = [...deptIds, ...dataScopeUsers]
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
    const selectedStaffData = checkedNodes.filter((i) => i.type === 'user')
    emit('confirm', selectedData, selectedStaffData)
  }
  modelVisible.value = false
}
</script>
<style lang="scss" scoped>
.grid-item {
  padding-left: 16px;
  overflow: hidden;

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
