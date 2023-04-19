<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="菜单名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="status">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择菜单类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in state.typeArr"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择菜单状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary" v-hasPermi="['system:menu:query']"
          >查询</el-button
        >
        <!--  TODO:重置权限 - - -->
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <!-- 新增 折叠/展开-->
    <div class="button-content">
      <el-button type="primary" @click="openForm('create')" v-hasPermi="['system:menu:create']">
        <Icon icon="ep:plus" class="mr-5px" color="#fff" /> 新增
      </el-button>
      <el-button @click="toggleExpandAll">
        <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
      </el-button>
      <div> </div>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      row-key="id"
      v-if="refreshTable"
      :default-expand-all="isExpandAll"
      :border="true"
    >
      <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" width="250">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <Icon :icon="scope.row.icon" v-if="scope.row.icon" style="margin-right: 5px" />
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="type" label="类型" :show-overflow-tooltip="true" width="250">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span v-show="scope.row.type === 0">目录</span>
            <span v-show="scope.row.type === 1">菜单</span>
            <span v-show="scope.row.type === 2">按钮</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="员工数" :show-overflow-tooltip="true" width="250" />
      <!--      <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" width="250" />-->
      <!--      <el-table-column prop="icon" label="图标" align="center" width="100">-->
      <!--        <template #default="scope">-->
      <!--          <Icon :icon="scope.row.icon" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column prop="sort" label="排序" width="60" />
      <!--      <el-table-column prop="permission" label="权限标识" :show-overflow-tooltip="true" />-->
      <!--      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />-->
      <!--      <el-table-column prop="componentName" label="组件名称" :show-overflow-tooltip="true" />-->
      <el-table-column prop="status" label="状态" width="80">
        <!--        <template #default="scope">-->
        <!--          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />-->
        <!--        </template>-->

        <template #default="scope">
          <el-switch
            v-model="scope.row.statusHandled"
            size="large"
            @change="(switchValue) => statusChange(switchValue, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['system:menu:update']"
          >
            修改
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('create', undefined, scope.row.id)"
            v-hasPermi="['system:menu:create']"
          >
            新增子项
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('create', undefined, scope.row.id)"
            v-hasPermi="['system:menu:create']"
          >
            详情
          </el-button>
          <!--          <el-button-->
          <!--            link-->
          <!--            type="danger"-->
          <!--            @click="handleDelete(scope.row.id)"-->
          <!--            v-hasPermi="['system:menu:delete']"-->
          <!--          >-->
          <!--            删除-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <MenuForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts" name="SystemMenu">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { handleTree } from '@/utils/tree'
import * as MenuApi from '@/api/system/menu'
import MenuForm from './MenuForm.vue'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数据
const queryParams = reactive({
  name: undefined,
  status: undefined,
  type: null
})

const state = reactive({
  typeArr: [
    {
      label: '目录',
      value: 1
    },
    {
      label: '菜单',
      value: 2
    },
    {
      label: '按钮',
      value: 3
    }
  ]
})

const statusChange = (switchValue, rowObj) => {
  console.log('switchValue', switchValue)
  console.log('rowObj', rowObj)
}

const queryFormRef = ref() // 搜索的表单
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态
//递归处理status
const updateStatus = (node) => {
  if (node.children && node.children.length > 0) {
    // 如果当前节点有子节点，则递归处理子节点
    node.children.forEach((child) => updateStatus(child))
  }

  // 根据节点的 status 属性来添加节点的状态 不修改原值
  node.statusHandled = node.status === 0
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MenuApi.getMenuList(queryParams)
    list.value = handleTree(data)
    updateStatus(list.value)
    console.log('list====>', list.value)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, parentId?: number) => {
  formRef.value.open(type, id, parentId)
}

/** 展开/折叠操作 */
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MenuApi.deleteMenu(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
@import '@/styles/table.scss';
.button-content {
  display: flex;
  margin-bottom: 10px;
}
</style>
