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

  <!--  表格  -->
  <ContentWrap>
    <!--    <a-button type="primary" @click="toggleExpandAll" v-hasPermi="['system:menu:create']">-->
    <!--      <Icon icon="ep:plus" class="mr-5px" color="#fff" /> 新增新增</a-button-->
    <!--    >-->
    <a-button type="primary" @click="toggleExpandAll">展开收起</a-button>

    <a-table
      :columns="columns"
      :data-source="list"
      :row-key="(record) => record.id"
      :expandable="{ defaultExpandAllRows: false, expandRowByClick: false }"
      :defaultExpandAllRows="state.isExpandAll"
      v-if="state.refreshTable"
    >
      <template #expandIcon="props">
        <span v-if="props.record.children && props.record.children.length > 0">
          <div
            v-if="props.expanded"
            style="display: inline-block; margin-right: 10px"
            @click="
              (e) => {
                props.onExpand(props.record, e)
              }
            "
          >
            <Icon icon="ep:caret-bottom" :size="15" />
          </div>
          <div
            v-else
            style="display: inline-block; margin-right: 10px"
            @click="
              (e) => {
                props.onExpand(props.record, e)
              }
            "
          >
            <Icon icon="ep:caret-right" :size="15" />
          </div>
        </span>
        <span v-else style="margin-right: 29px"></span>
      </template>
    </a-table>
  </ContentWrap>
</template>

<script lang="tsx" setup>
import * as MenuApi from '@/api/system/menu'
import { handleTree } from '@/utils/tree'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const queryParams = reactive({
  name: undefined,
  status: undefined,
  type: null
})

const queryFormRef = ref() // 搜索的表单
const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数据

const state = reactive({
  isExpandAll: false, //展开折叠
  refreshTable: true //v-if table
})

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 600
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '员工数',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation'
  }
]

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
  console.log('queryParams', queryParams)
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

getList()

//一键 展开 折叠 全部
const toggleExpandAll = () => {
  //由于antdV只提供了初始化时默认展开全部的 API 因此 此处利用v-if 来实现重新初始化
  state.refreshTable = false
  state.isExpandAll = !state.isExpandAll
  nextTick(() => {
    state.refreshTable = true
  })
}
</script>

<style lang="scss" scoped>
.content {
  width: 100px;
  height: 100px;
  background: skyblue;
}
</style>
