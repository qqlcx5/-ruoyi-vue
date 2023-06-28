<template>
  <!-- 搜索 -->
  <div class="flex flex-col h-full">
    <ContentWrap>
      <Search :schema="allSchemas.searchSchema" @reset="handleSearch" @search="handleSearch" />
    </ContentWrap>

    <div class="card-wrap flex flex-1">
      <ContentWrap class="mr-5 group-wrap" style="width: 260px">
        <div class="tree-title-content">
          <div class="title">题目分组</div>
          <XTextButton title="添加" @click="handleAddGroup()" />
        </div>
        <div class="tree-select-content flex flex-col">
          <el-input
            v-model="searchValue"
            style="margin: 10px 0"
            placeholder="搜索分组"
            :suffix-icon="searchIcon"
          />
          <div class="flex-1 overflow-auto">
            <el-tree
              :data="groupList"
              :expand-on-click-node="false"
              highlight-current
              :props="{ label: 'appraiseTypeName' }"
              @node-click="handleSelect"
            >
              <template #default="{ data }">
                <span class="custom-tree-node">
                  <span>{{ `${data.appraiseTypeName}(${data.topicNum})` }}</span>
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      <Icon
                        icon="svg-icon:ellipsis"
                        class="btn-icon"
                        style="transform: rotate(90deg)"
                      />
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="handleAddGroup(data)">编辑</el-dropdown-item>
                        <el-dropdown-item @click="handleGroupDelete(data)">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </span>
              </template>
            </el-tree>
          </div>
        </div>
      </ContentWrap>

      <FormTable
        class="flex-1"
        ref="tableRef"
        :form-options="{ isSearch: false }"
        :table-options="{
          columns: allSchemas.tableColumns,
          selection: true,
          listApi: getTenant,
          listParams
        }"
        @add="handleAdd"
      >
        <template #tableAppend>
          <XButton title="删除" @click="handleDelete" />
        </template>
        <template #status="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleChangeStatus(row)"
          />
        </template>
      </FormTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import AddTopicDialog from './components/AddTopicDialog.vue'
import AddGroupDialog from './components/AddGroupDialog.vue'
import { getTenant } from '@/api/system/tenant'
import { Search as searchIcon } from '@element-plus/icons-vue'
import { useCreateDialog } from '@/hooks/web/useCreateDialog'
import { useTable, useGroup } from './helpers'
import { addGroup, delTopic, delGroup, setTopicStatus } from '@/api/questionnaire/topic'
import { onMounted } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import { isEmpty } from 'lodash-es'

const searchValue = ref('')

const { openDialog } = useCreateDialog()
const { allSchemas, tableRef, listParams } = useTable()
const { getGroupData, groupList } = useGroup()
const message = useMessage()

onMounted(async () => {
  await getGroupData()
})

/** 查询/重置 */
const handleSearch = (model: Recordable) => {
  const { tableMethods, elTableRef } = tableRef.value
  listParams.value = model
  tableMethods.getList()
  elTableRef.value?.clearSelection()
}

/** 选中分组 */
const handleSelect = (node) => {
  const { tableMethods } = tableRef.value
  listParams.value = { appraiseTopicId: node.appraiseTopicId }
  setTimeout(() => {
    tableMethods.getList()
  }, 0)
}

/** 改变列表状态 */
const handleChangeStatus = async (row) => {
  await setTopicStatus({ id: row.appraiseTopicId, status: row.status })
  message.success('修改状态成功')
}

/** 新增 */
const handleAdd = () => {
  openDialog(AddTopicDialog, {
    title: '123'
  })
}

/** 新增/编辑分组 */
const handleAddGroup = (params?: Recordable) => {
  const id = params?.appraiseTypeId
  const { close } = openDialog(AddGroupDialog, {
    title: `${id ? '编辑' : '新增'}分组`,
    width: 498,
    data: params,
    onConfirm: async (data) => {
      await addGroup({
        ...data,
        ...(id ? { appraiseTypeId: id } : {})
      })
      message.success('添加成功')
      close()
      getGroupData()
    }
  })
}

/** 题目分组删除 */
const handleGroupDelete = async (data) => {
  message
    .wgOperateConfirm('是否确认删除题目？删除后无法恢复。', '提示')
    .then(async () => {
      await delGroup({ ids: [data.appraiseTypeId] })
      message.success('删除成功')
      getGroupData()
    })
    .catch(() => {})
}

/** 批量删除题目 */
const handleDelete = async () => {
  const { tableMethods } = tableRef.value
  let selections = await tableMethods.getSelections()
  selections = selections?.map((item) => item.appraiseTypeId)

  if (isEmpty(selections)) {
    message.warning('请选择题目')
    return
  }

  message
    .wgOperateConfirm('是否确认删除题目？删除后无法恢复。', '提示')
    .then(async () => {
      const res = await delTopic({ ids: selections })
      if (res) {
        message.success('删除成功')
        await tableMethods.getList()
      } else {
        message.error('删除失败')
      }
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
.card-wrap {
  display: flex;

  .group-wrap {
    :deep(.el-card__body) {
      height: 100%;

      & > div {
        display: flex;
        height: 100%;
        flex-direction: column;
      }
    }
  }

  .tree-title-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tree-select-content {
    flex: 1;

    .custom-tree-node {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
