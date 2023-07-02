<template>
  <div class="flex h-full">
    <ContentWrap class="mr-3 tree-left" title="规则名称" style="width: 222px">
      <el-tree
        :data="treeData"
        :props="{
          children: 'childs',
          label: 'ruleName'
        }"
        highlight-current
        default-expand-all
        @node-click="handleNodeClick"
      >
        <template #default="{ data }">
          <div class="overflow-ellipsis overflow-hidden whitespace-nowrap">
            {{ `${data.ruleName}(${data.totalRuleNum})` }}
          </div>
        </template>
      </el-tree>
    </ContentWrap>
    <ContentWrap
      :title="`${selectNode.ruleName ? selectNode.ruleName + '- ' : ''}规则数据`"
      class="flex-1 rule-data"
    >
      <FormTable
        ref="tableRef"
        :form-options="{
          schema: allSchemas.searchSchema
        }"
        :table-options="{
          selection: true,
          columns: allSchemas.tableColumns,
          listApi: tableApi,
          showTools: false,
          showAdd: hasPermission('system:member-rule:rule-list'),
          actionButtons
        }"
        @add="handleAdd"
      >
        <template #tableAppend>
          <XButton
            v-hasPermi="['system:member-rule:delete']"
            title="批量删除"
            @click="handleListDel()"
          />
          <XButton
            v-hasPermi="['system:member-rule:edit']"
            title="批量编辑"
            @click="handleListEdit()"
          />
          <div :class="`${tipsStatus ? 'tip-status-true' : ''} tip-status ml-3`">{{ tips }}</div>
        </template>
        <template #isEnable="{ row }">
          <el-switch
            v-model="row.isEnable"
            :active-value="1"
            :inactive-value="0"
            @change="handleChangStatus(row)"
          />
        </template>
      </FormTable>
    </ContentWrap>
  </div>
  <ActionDialog
    v-if="showDialog"
    v-model="showDialog"
    :title="title"
    :data="dialogData"
    :current-node="selectNode"
    @save="handleSave"
  />
  <TreeViewDialog
    v-if="showTreeDialog"
    v-model="showTreeDialog"
    :title="dialogTreeTitle"
    :tree-data="dialogTreeData"
  />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useFormTable, useRuleTree, TreeNode, arrayToString } from './helpers'
import ActionDialog from './components/ActionDialog.vue'
import TreeViewDialog from './components/TreeViewDialog.vue'
import {
  delMemberRule,
  addMemberRule,
  getTipsData,
  setMemberRule,
  setSwitchStatus
} from '@/api/system/memberRule'
import { isEmpty } from 'lodash-es'
import { hasPermission } from '@/utils/utils'

const message = useMessage()
const { t } = useI18n()

const {
  allSchemas,
  showDialog,
  title,
  dialogTreeData,
  showTreeDialog,
  dialogTreeTitle,
  isEdit,
  tableApi
} = useFormTable()

const { treeData, getTree, selectNode } = useRuleTree()

const tableRef = ref()
const tips = ref('')
const tipsStatus = ref(0)

const actionButtons = [
  {
    name: '编辑',
    permission: 'system:member-rule:edit',
    click: (row) => {
      handleListEdit([row])
    }
  }
  // {
  //   name: '删除',
  //   click: (row) => {
  //     handleListDel([row.id])
  //   }
  // }
]
/** 选择规则名称节点 */
const handleNodeClick = async (node: TreeNode) => {
  selectNode.value = node
  const { tableMethods } = tableRef.value
  tableMethods.setSearchParams({ childRuleValue: node.ruleValue })
  const data = await getTipsData(node.ruleValue, node.ruleName)
  tips.value = data.text
  tipsStatus.value = data.status
}

/** 添加 */
const handleAdd = () => {
  if (isEmpty(selectNode.value)) {
    message.warning('请选择规则名称')
    return
  }
  isEdit.value = false
  showDialog.value = true
  dialogData.value = []
  title.value = '新增子规则'
}

/** 批量删除 */
const handleListDel = async (ids?: number[]) => {
  const { tableMethods } = tableRef.value
  let selections = await tableMethods.getSelections()
  selections = !isEmpty(ids) ? ids : selections?.map((item) => item.id)

  if (isEmpty(selections)) {
    message.warning('请选择成员规则')
    return
  }

  message
    .wgOperateConfirm('是否确认删除成员规则？删除后无法恢复。', '提示')
    .then(async () => {
      const res = await delMemberRule({ ids: selections.join(',') })
      if (res) {
        message.success('删除成功')
        await tableMethods.getList()
      } else {
        message.error('删除失败')
      }
    })
    .catch(() => {})
}

/** 批量修改 */
const dialogData = ref<Recordable[]>([])
const handleListEdit = async (row?: Recordable) => {
  const { tableMethods } = tableRef.value
  dialogData.value = !isEmpty(row) ? row : await tableMethods.getSelections()

  if (isEmpty(dialogData.value)) {
    message.warning('请选择成员规则')
    return
  }
  isEdit.value = true
  showDialog.value = true
  title.value = '编辑成员规则'
}

/** 确认保存 */
const handleSave = async (data: Recordable) => {
  const saveApi = isEdit.value ? setMemberRule : addMemberRule
  const params = data.map((item) => ({
    ...item,
    applicableShopId: arrayToString(item.applicableShopId),
    dataRangShopId: arrayToString(item.dataRangShopId),
    dataRangPostId: arrayToString(item.dataRangPostId),
    dataRangUserId: arrayToString(item.dataRangUserId),
    belongBusinessCode: selectNode.value.ruleValue,
    belongBusinessName: selectNode.value.ruleName
  }))
  await saveApi(params)
  showDialog.value = false
  message.success(isEdit.value ? '编辑成功' : t('common.createSuccess'))
  const { tableMethods } = tableRef.value
  tableMethods.getList()
}

/** 改变状态 */
const handleChangStatus = async (row: Recordable) => {
  await setSwitchStatus(row.id, row.isEnable)
  const { tableMethods } = tableRef.value
  tableMethods.getList()
}

onMounted(() => {
  getTree()
})
</script>

<style lang="scss" scoped>
.rule-data {
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    padding-bottom: 0;

    & > div {
      height: 100%;
    }
  }

  .tip-status {
    color: #faad14;
  }

  .tip-status-true {
    color: $error-color;
  }
}

.tree-left {
  :deep(.is-current) {
    color: var(--el-color-primary);
  }
}
</style>
