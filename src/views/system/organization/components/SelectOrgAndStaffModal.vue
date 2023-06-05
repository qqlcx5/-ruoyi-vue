<template>
  <!-- 弹窗 -->
  <XModal title="选择部门/人" v-model="modelVisible" width="900px">
    <div class="grid grid-cols-3">
      <div>
        <div>部门</div>
        <el-tree
          class="px-6px py-10px max-h-560px"
          ref="treeRef"
          node-key="id"
          show-checkbox
          highlight-current
          default-expand-all
          :check-strictly="props.mode === 'single'"
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps"
          :data="treeData"
          empty-text="加载中，请稍后"
          @check="onTreeCheck"
          @node-click="onTreeNodeClick"
        />
      </div>
      <div>
        <div>成员</div>
        <a-checkbox-group v-model:value="currentNode.userIds">
          <a-checkbox v-for="item in currentNode.userList" :value="item.id" :key="item.id">{{
            item.nickname
          }}</a-checkbox>
        </a-checkbox-group>
      </div>
      <div>
        <div>已选信息</div>
        <div>部门</div>
        <el-tree
          class="px-6px py-10px max-h-560px"
          ref="selectedTreeRef"
          node-key="id"
          highlight-current
          default-expand-all
          :props="defaultProps"
          :data="selectedTreeData"
          empty-text=""
        />
        <div>成员</div>
        <div class="pl-30px">
          <div v-for="item in selectedStaffData" :key="item.id">
            {{ item.nickname }}-{{ item.username }}
          </div>
        </div>
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
import { getSimpleOrganizationList } from '@/api/system/organization'
import { getUserListByOrg } from '@/api/system/member'
import { CommonStatusEnum } from '@/utils/constants'
import { message } from 'ant-design-vue'
import { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'

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

const onTreeCheck = (node, list) => {
  currentNode.value = node
  treeRef.value!.setCurrentKey(node.id, true)
  const nodeSelectStatus = list.checkedKeys.includes(node.id)
  setNodeUserInfo(node, nodeSelectStatus)
  selectedTreeData.value = treeData.value.filter((t) => list.checkedKeys.includes(t.id))
  if (props.mode === 'single') {
    if (list.checkedKeys.length === 2) treeRef.value!.setCheckedKeys([node.id])
  }
}
const onTreeNodeClick = async (node) => {
  currentNode.value = node
  setNodeUserInfo(node)
}
const setNodeUserInfo = async (node, allSelect?: boolean) => {
  if (!node.userList) {
    currentNode.value.userList = (await getUserListByOrg({ orgId: node.id })) || []
  }
}
// --------------- 成员 ---------------

// --------------- 已选信息 ---------------
const selectedTreeData = ref<any[]>([])
const selectedStaffData = ref()
watch(
  () => treeData.value,
  (data) => {
    selectedStaffData.value = data
      .filter((i) => i.userIds && i.userIds.length > 0)
      .map((item) => {
        return item.userList.filter((u) => item.userIds.includes(u.id))
      })
      .flat()
  },
  { deep: true }
)

const init = async (dataScopeUsers) => {
  const result = await getSimpleOrganizationList({ status: CommonStatusEnum.ENABLE })
  if (dataScopeUsers && dataScopeUsers.length > 0) {
    result.forEach((item) => {
      item['userList'] = dataScopeUsers.filter((u) => item.id === u.deptId)
      item['userIds'] = item['userList'].map((u) => u.id)
    })
  }
  treeData.value = handleTree(result)
  selectedTreeData.value = treeData.value.filter((t) => defaultCheckedKeys.value.includes(t.id))
}

// 打开弹窗
const openModal = async (deptIds?: any[], dataScopeUsers?) => {
  if (deptIds && deptIds.length > 0) defaultCheckedKeys.value = deptIds
  modelVisible.value = true
  await init(dataScopeUsers)
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
    emit('confirm', checkedNodes, selectedStaffData.value)
  }
  modelVisible.value = false
}
</script>
<style lang="scss" scoped></style>
