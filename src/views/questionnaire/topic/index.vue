<template>
  <!-- 搜索 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="题目名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入题目名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!--      <el-form-item label="适用分类" prop="status">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.status"-->
      <!--          placeholder="请选择适用分类"-->
      <!--          clearable-->
      <!--          class="!w-240px"-->
      <!--        >-->
      <!--          <el-option-->
      <!--            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"-->
      <!--            :key="dict.value"-->
      <!--            :label="dict.label"-->
      <!--            :value="dict.value"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->

      <!--      <el-form-item label="题目类型" prop="status">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.status"-->
      <!--          placeholder="请选择题目类型"-->
      <!--          clearable-->
      <!--          class="!w-240px"-->
      <!--        >-->
      <!--          <el-option-->
      <!--            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"-->
      <!--            :key="dict.value"-->
      <!--            :label="dict.label"-->
      <!--            :value="dict.value"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->

      <!--      <el-form-item label="状态" prop="status">-->
      <!--        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">-->
      <!--          <el-option-->
      <!--            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"-->
      <!--            :key="dict.value"-->
      <!--            :label="dict.label"-->
      <!--            :value="dict.value"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <div class="card-wrap">
    <ContentWrap class="mr-5" style="width: 260px">
      <div class="tree-title-content">
        <div class="title">题目分组</div>
        <el-link type="primary" @click="dialogVisible = true">添加</el-link>
      </div>
      <div class="tree-select-content">
        <a-input-search style="margin: 10px 0" v-model:value="searchValue" placeholder="搜索分组" />
        <el-tree :data="dataSource" node-key="id" default-expand-all :expand-on-click-node="false">
          <template #default="{ node }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
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
                    <el-dropdown-item>编辑</el-dropdown-item>
                    <el-dropdown-item>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span>
          </template>
        </el-tree>
      </div>
    </ContentWrap>
    <ContentWrap style="flex: 1">
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="openForm('create')"
          ><Icon icon="ep:plus" class="mr-5px" /> 新增</el-button
        >
        <el-button>删除</el-button>
      </div>
      <el-table v-loading="loading" :data="list">
        <el-table-column label="题目ID" />
        <!--        <el-table-column label="题目类型">-->
        <!--          <template #default="scope">-->
        <!--            <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column label="题目" />-->
        <!--        <el-table-column label="所属分组" />-->
        <!--        <el-table-column label="状态">-->
        <!--          <template #default="scope">-->
        <!--            <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="匹配字段" />
        <el-table-column
          label="最后一次修改时间"
          align="center"
          prop="createTime"
          width="180"
          :formatter="dateFormatter"
        />

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" @click="openForm('update', scope.row.id)">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>
  </div>

  <Dialog v-model="dialogVisible" title="新增分组">
    <el-form :model="form" label-width="100px">
      <el-form-item label="分组名称">
        <el-input
          type="text"
          v-model="form.name"
          placeholder="请输入分组名称"
          maxlength="8"
          :show-word-limit="true"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
      </span>
    </template>
  </Dialog>

  <TopicForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import { dateFormatter } from '@/utils/formatTime'
import TopicForm from './TopicForm.vue'

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: null,
  status: null,
  remark: null,
  createTime: []
})
const queryFormRef = ref()

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleDelete = () => {}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // const data = await TenantPackageApi.getTenantPackagePage(queryParams.value)
    const data = { list: [], total: 10 }
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  getList()
}

const searchValue = ref('')
const dialogVisible = ref(false) // 题目分组添加弹窗

const form = reactive({
  name: '',
  status: false
})

const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: 'Level one 1'
  },
  {
    id: 2,
    label: 'Level one 2'
  },
  {
    id: 3,
    label: 'Level one 3'
  }
])
</script>

<style lang="scss" scoped>
.card-wrap {
  display: flex;
  .tree-title-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tree-select-content {
    .custom-tree-node {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
