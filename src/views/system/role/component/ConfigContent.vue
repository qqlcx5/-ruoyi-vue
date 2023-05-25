<template>
  <div class="role-config grid grid-cols-3 gap-x-16px">
    <div class="box">
      <div class="box-header"> 请选择菜单（可多选） </div>
      <div class="box-content">
        <div class="box-tool flex justify-between items-center px-14px border-b-1">
          <el-checkbox
            v-model="treeNodeAll"
            label="全选"
            size="large"
            @change="handleCheckedTreeNodeAll()"
          />
          <el-checkbox
            v-model="treeNodeExpand"
            label="展开/折叠"
            size="large"
            @change="handleCheckedTreeExpand()"
          />
        </div>
        <el-tree
          class="py-10px max-h-560px overflow-y-scroll"
          ref="treeRef"
          node-key="id"
          show-checkbox
          highlight-current
          :default-checked-keys="defaultCheckedKeys"
          :props="{ ...defaultProps, class: customNodeClass }"
          :data="treeOptions"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
        />
      </div>
    </div>
    <div class="box">
      <div class="box-header"> 请选择操作权限（可多选） </div>
      <div class="box-content">
        <div v-if="currentNode && currentNode.type === 2">
          <div v-if="getPermissions && getPermissions.length">
            <div class="box-tool flex justify-between items-center px-14px border-b-1">
              <el-checkbox
                v-model="btnPermissionAll"
                label="全选"
                size="large"
                @change="handleCheckAllChange"
              />
            </div>
            <div class="px-14px py-10px">
              <el-checkbox-group v-model="selectedPermissions">
                <el-checkbox v-for="item in getPermissions" :key="item.id" :label="item.id">
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div v-else class="flex justify-center text-tip mt-24px">未配置按钮</div>
        </div>
        <div v-else class="flex justify-center text-tip mt-24px">请选择菜单</div>
      </div>
    </div>
    <div class="box">
      <div class="box-header"> 请选择数据权限 </div>
      <div class="box-content px-14px py-10px">
        <el-radio-group
          v-if="currentNode && currentNode.type === 2"
          v-model="currentNode.dataScope"
        >
          <el-radio :label="5">仅看自己</el-radio>
          <el-radio :label="4">仅看本部门及以下</el-radio>
          <el-radio :label="3">仅看本部门</el-radio>
          <el-radio :label="2">
            指定部门
            <div
              v-if="currentNode.dataScope === 2"
              class="depart relative inline-block w-160px px-8px py-2px ml-6px border-1px rounded-4px text-[var(--el-radio-text-color)]"
              @click="openDepartModal"
              >{{
                currentNode.dataScopeDepts.length > 0
                  ? `已选${currentNode.dataScopeDepts.length}个部门`
                  : '请选择'
              }}
            </div>
          </el-radio>
          <el-radio :label="6">
            指定人
            <div
              v-if="currentNode.dataScope === 6"
              class="depart relative inline-block w-160px px-8px py-2px ml-6px border-1px rounded-4px text-[var(--el-radio-text-color)]"
              @click="openMemberModal"
              >{{
                currentNode.dataScopeUserIds.length > 0
                  ? `已选${currentNode.dataScopeUserIds.length}个成员`
                  : '请选择'
              }}
            </div>
          </el-radio>
          <el-radio :label="1">看所有人</el-radio>
        </el-radio-group>
        <div v-else class="flex justify-center text-tip mt-24px">请选择菜单</div>
      </div>
    </div>
    <SelectOrgModal ref="selectOrgModalRef" @confirm="onSelectOrgConfirm" />
    <SelectMemberModal ref="selectMemberModalRef" @confirm="onSelectMemberConfirm" />
  </div>
</template>

<script lang="ts" setup>
import { handleTree, defaultProps } from '@/utils/tree'
import { getSimpleMenusList } from '@/api/system/menu'
import { getRoleMenuDataScope } from '@/api/system/role'
import { ElTree } from 'element-plus'
import { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import SelectOrgModal from '../../organization/components/SelectOrgModal.vue'
import SelectMemberModal from '../../member/components/SelectMemberModal/index.vue'
import { cloneDeep } from 'lodash-es'

const { query } = useRoute()

const props = defineProps({
  stage: {
    required: true,
    type: String
  }
})
const emit = defineEmits(['change'])
const roleConfig = ref<any[]>([])
// ================= 菜单 ====================
const defaultCheckedKeys = ref()
const treeOptions = ref<any[]>([]) // 菜单树形结构
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeNodeAll = ref(false)
const treeNodeExpand = ref(true)
const checkedNodes = ref()
watch(
  () => checkedNodes.value,
  (data) => {
    emit('change', {
      data,
      stage: props.stage
    })
  },
  { immediate: true, deep: true }
)
// 全选/全不选
const handleCheckedTreeNodeAll = () => {
  treeRef.value!.setCheckedNodes(treeNodeAll.value ? treeOptions.value : [])
}
// 展开/折叠
/** 展开/折叠全部 */
const handleCheckedTreeExpand = () => {
  const nodes = treeRef.value?.store.nodesMap
  for (let node in nodes) {
    if (nodes[node].expanded === treeNodeExpand.value) {
      continue
    }
    nodes[node].expanded = treeNodeExpand.value
  }
}

// ================= 操作权限 ====================
const btnPermissionsOptions = ref<any[]>([]) // 按钮权限
const btnPermissionAll = computed(() => {
  return currentNode.value.operations.length === getPermissions.value.length
})
const currentNode = ref<TreeNodeData>({})
const getPermissions = computed(() => {
  return currentNode.value.type === 2
    ? btnPermissionsOptions.value.filter((item) => item.parentId === currentNode.value.id)
    : []
}) // 操作权限选项
watch(
  () => currentNode.value,
  (data, oldData) => {
    if (data.id === oldData.id) {
      if (data.dataScope || (data.operations && data.operations.length)) {
        treeRef.value!.setCheckedKeys([...treeRef.value!.getCheckedKeys(), data.id])
      } else {
        treeRef.value!.setChecked(data.id, false, true)
      }
    }
  },
  { deep: true }
)
const selectedPermissions = computed({
  get() {
    return currentNode.value.type === 2 ? currentNode.value.operations.map((item) => item.id) : []
  },
  set(val) {
    currentNode.value.operations = getPermissions.value.filter((item) => val.includes(item.id))
  }
}) // 选中select

const customNodeClass = (data) => {
  if (data.dataScope || (data.operations && data.operations.length)) {
    return 'custom-highlight'
  }
  return null
}

const handleCheckAllChange = (val: boolean) => {
  currentNode.value.operations = val ? getPermissions.value : []
}
const handleNodeClick = (node) => {
  currentNode.value = node
}
const handleCheckChange = (node) => {
  currentNode.value = node
  treeRef.value!.setCurrentKey(node.id, true)
  checkedNodes.value = treeRef.value!.getCheckedNodes()
}

// ================= 数据权限 ====================
const selectOrgModalRef = ref()
const selectMemberModalRef = ref()
const openDepartModal = () => {
  selectOrgModalRef.value.openModal(currentNode.value.dataScopeDepts.map((item) => item.id))
}
const onSelectOrgConfirm = (data) => {
  currentNode.value.dataScopeDeptIds = data.map((item) => item.id)
  currentNode.value.dataScopeDepts = data.map((item) => {
    return {
      id: item.id,
      name: item.name
    }
  })
}
const openMemberModal = () => {
  selectMemberModalRef.value.openModal(currentNode.value.dataScopeUsers)
}
const onSelectMemberConfirm = (data) => {
  currentNode.value.dataScopeUserIds = data.map((item) => item.id)
  currentNode.value.dataScopeUsers = data.map((item) => {
    return {
      id: item.id,
      nickname: item.nickname
    }
  })
}

// ================= 初始化 ====================
const init = async () => {
  const menuRes = await getSimpleMenusList()
  btnPermissionsOptions.value = menuRes.filter((menu) => menu.type === 3)
  let result = { menuDataScopeItemList: [] }
  if (props.stage === 'front') {
    // result = await getRoleMenuDataScope({ roleId: query.id })
  } else if (props.stage === 'backstage') {
    result = await getRoleMenuDataScope({ roleId: query.id })
    if (result) roleConfig.value = result.menuDataScopeItemList || []
    defaultCheckedKeys.value = roleConfig.value
      .filter((item) => item.type === 2)
      .map((item) => item.menuId)
    treeOptions.value = handleTree(
      menuRes.filter((menu) => {
        if (menu.type === 2) {
          const roleData = roleConfig.value.find((item) => item.menuId === menu.id)
          menu.operations = roleData?.operations || []
          menu.dataScope = roleData?.dataScope || ''
          menu.dataScopeDeptIds = roleData?.dataScopeDeptIds || []
          menu.dataScopeDepts = roleData?.dataScopeDepts || []
          menu.dataScopeUserIds = roleData?.dataScopeUserIds || []
          menu.dataScopeUsers = roleData?.dataScopeUsers || []
        }
        return menu.type !== 3
      })
    )
    nextTick(() => {
      checkedNodes.value = treeRef.value!.getCheckedNodes()
      handleCheckedTreeExpand()
    })
  }
}
watch(
  () => props.stage,
  () => {
    init()
  },
  { immediate: true }
)

const getParams = () => {
  const menuDataScopeItemList = cloneDeep(treeRef.value!.getCheckedNodes())
  return menuDataScopeItemList.map((item) => {
    item['menuId'] = item.id
    item['menuParentId'] = item.parentId
    delete item.children
    if (item.dataScope === 2) {
      // 部门清空指定人
      item.dataScopeUserIds = []
      item.dataScopeUsers = []
    } else if (item.dataScope === 6) {
      // 指定人清空部门
      item.dataScopeDeptIds = []
      item.dataScopeDepts = []
    }
    return item
  })
}

defineExpose({ getParams }) // 提供 openModal 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.role-config {
  .box {
    border: 1px solid #eaebef;
    border-radius: 2px;
  }
  .box-header {
    padding: 10px 14px;
    background-color: var(--table-bg-color);
  }
  .box-tool {
    border-bottom: 1px solid #eaebef;
  }
  .box-content .el-radio-group {
    align-items: normal;
    flex-direction: column;
    flex-wrap: nowrap;
  }
  .depart {
    border-color: #eaebef;
    &:after {
      content: '\e68f';
      font-family: iconfont;
      font-size: 12px;
      color: var(--el-color-info);
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
    }
  }
  :deep(.el-tree .el-tree-node.custom-highlight > .el-tree-node__content) {
    color: var(--el-color-primary);
    background-color: #ebf5ff;
  }
  :deep(.el-tree .el-tree-node.is-current > .el-tree-node__content) {
    background-color: #c1e0ff;
  }
}
</style>
