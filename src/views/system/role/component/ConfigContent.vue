<template>
  <div class="grid grid-cols-3 gap-x-16px pb-80px">
    <div class="box">
      <div class="box-header"> 请选择菜单（可多选） </div>
      <div class="box-content">
        <div class="flex justify-between items-center px-14px border-b-1">
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
          class="px-6px py-10px max-h-560px overflow-y-scroll"
          ref="treeRef"
          node-key="id"
          show-checkbox
          highlight-current
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps"
          :data="treeOptions"
          empty-text="加载中，请稍后"
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
            <div class="flex justify-between items-center px-14px border-b-1">
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
          <el-radio :label="1">仅看自己</el-radio>
          <el-radio :label="2">仅看本部门及以下</el-radio>
          <el-radio :label="3">仅看本部门</el-radio>
          <el-radio :label="4">
            指定部门
            <div
              v-if="currentNode.dataScope === 4"
              class="depart relative inline-block w-160px px-8px py-2px ml-6px border-1px rounded-4px text-[var(--el-radio-text-color)]"
              @click="openDepartModal"
              >{{
                currentNode.dataScopeDeptIds
                  ? `已选${currentNode.dataScopeDeptIds.split(',').length}个部门`
                  : '请选择'
              }}
            </div>
          </el-radio>
          <el-radio :label="5">看所有人</el-radio>
        </el-radio-group>
        <div v-else class="flex justify-center text-tip mt-24px">请选择菜单</div>
      </div>
    </div>
    <SelectOrgModal ref="selectOrgModalRef" @confirm="onSelectOrgConfirm" />
  </div>
</template>

<script lang="ts" setup>
import { handleTree, defaultProps } from '@/utils/tree'
import { getSimpleMenusList } from '@/api/system/menu'
import { getRoleMenuDataScope } from '@/api/system/role'
import { ElTree } from 'element-plus'
import { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import SelectOrgModal from '../../organization/components/SelectOrgModal.vue'

const { query } = useRoute()

const props = defineProps({
  stage: {
    required: true,
    type: String
  }
})
const emit = defineEmits(['frontChange', 'backstageChange'])
const roleConfig = ref<any[]>([])
// ================= 菜单 ====================
const defaultCheckedKeys = ref()
const treeOptions = ref<any[]>([]) // 菜单树形结构
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeNodeAll = ref(false)
const treeNodeExpand = ref(false)
const checkedNodes = ref()
watch(
  () => checkedNodes.value,
  (data) => {
    emit(props.stage === 'backstage' ? 'backstageChange' : 'frontChange', data)
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
const btnPermissionAll = ref(false)
const currentNode = ref<TreeNodeData>({})
const getPermissions = computed(() => {
  return currentNode.value.type === 2
    ? btnPermissionsOptions.value.filter((item) => item.parentId === currentNode.value.id)
    : []
}) // 操作权限选项
const selectedPermissions = computed({
  get() {
    return currentNode.value.type === 2 ? currentNode.value.operations.map((item) => item.id) : []
  },
  set(val) {
    currentNode.value.operations = getPermissions.value.filter((item) => val.includes(item.id))
  }
}) // 选中select

const handleCheckAllChange = (val: boolean) => {
  btnPermissionAll.value = val
  currentNode.value.operations = val ? getPermissions.value : []
}
const handleNodeClick = (node) => {
  currentNode.value = node
}
const handleCheckChange = (node) => {
  currentNode.value = node
  treeRef.value!.setCurrentKey(node.id, true)
  checkedNodes.value = getParams()
}

// ================= 数据权限 ====================
const selectOrgModalRef = ref()
const openDepartModal = () => {
  selectOrgModalRef.value.openModal(currentNode.value.dataScopeDeptIds.split(','))
}
const onSelectOrgConfirm = (data) => {
  currentNode.value.dataScopeDeptIds = data.map((item) => item.id).join(',')
}

// ================= 初始化 ====================
const init = async () => {
  const menuRes = await getSimpleMenusList()
  btnPermissionsOptions.value = menuRes.filter((menu) => menu.type === 3)
  // roleConfig.value = [
  //   {
  //     dataScope: 1,
  //     dataScopeDeptIds: '',
  //     menuId: 2131,
  //     menuParentId: 2130,
  //     operations: [
  //       {
  //         id: 2132,
  //         name: '账号查询',
  //         parentId: 2131,
  //         type: 3
  //       },
  //       {
  //         id: 2135,
  //         name: '账号查询',
  //         parentId: 2131,
  //         type: 3
  //       }
  //     ],
  //     type: 2
  //   }
  // ]
  let result = { menuDataScopeItemList: [] }
  if (props.stage === 'front') {
    result = await getRoleMenuDataScope({ roleId: query.id })
  } else if (props.stage === 'backstage') {
    result = await getRoleMenuDataScope({ roleId: query.id })
  }
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
        menu.dataScopeDeptIds = roleData?.dataScopeDeptIds || ''
      }
      return menu.type !== 3
    })
  )
  nextTick(() => {
    checkedNodes.value = getParams()
  })
}
watch(
  () => props.stage,
  () => {
    init()
  },
  { immediate: true }
)

const getParams = () => {
  return treeRef.value!.getCheckedNodes()
}

defineExpose({ getParams }) // 提供 openModal 方法，用于打开弹窗
// onMounted(() => {
//   init()
// })
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
  .box-content .el-radio-group {
    align-items: normal;
    flex-direction: column;
    flex-wrap: nowrap;
  }
  .depart {
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
}
</style>
