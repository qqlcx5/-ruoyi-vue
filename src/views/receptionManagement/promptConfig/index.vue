<template>
  <div class="prompt-configuration">
    <!-- 成员端、管理端、客户端  memberSide、managementEnd、client -->
    <el-tabs type="border-card" v-model="tabsName">
      <el-tab-pane label="通用提示配置" name="currency"></el-tab-pane>
      <el-tab-pane label="必讲项提示配置" name="needlessToSay"></el-tab-pane>
    </el-tabs>
    <form-table
      ref="table"
      @add="handleAdd"
      @selection-change="handleSelectionChange"
      :form-options="{
        schema: allSchemas.searchSchema
      }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi: getConfigPageApi,
        delApi: deleteConfigApi,
        showAdd: true,
        selection: true
      }"
    >
      <template #tableAppend>
        <XButton @click="handleDel"> 删除</XButton>
        <!-- 提示类型配置 -->
        <XButton @click="handlePrompt"> 提示类型配置</XButton>
      </template>

      <template #action="{ row }">
        <!-- 操作：修改 -->
        <XTextButton :title="t('action.edit')" @click="handleEdit(row)" />
      </template>

      <template #visible="{ row }">
        <el-switch v-model="row.visible" :active-value="true" :inactive-value="false" />
      </template>
      <template #prompt="{ row }">
        <el-button type="primary" link @click="handlePreview(row)">预览</el-button>
      </template>
    </form-table>
    <!-- 新增-通用提示 -->
    <XModal v-model="dialogVisible" title="新增-通用提示">
      <el-form ref="formRef" :model="formValues" :rules="formRules" label-width="80px">
        <el-form-item label="提示标题" prop="name" required>
          <el-input
            v-model="formValues.name"
            placeholder="请输入主体编码"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="提示类型" prop="region" required>
          <el-select v-model="formValues.region" placeholder="请选择上级主体">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="适用品牌" prop="status" required>
          <el-radio-group v-model="formValues.status">
            <el-radio :key="1" label="全部"></el-radio>
            <el-radio :key="2" label="部分"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用门店" prop="status" required>
          <el-radio-group v-model="formValues.status">
            <el-radio :key="1" label="全部"></el-radio>
            <el-radio :key="2" label="部分"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提示内容" prop="remark" required>
          <el-input v-model="formValues.remark" type="textarea" placeholder="请输入提示内容" />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <template #footer>
        <!-- 按钮：保存 -->
        <XButton type="primary" title="确认" :loading="dialogLoading" />
        <!-- 按钮：关闭 -->
        <XButton title="取消" @click="dialogVisible = false" />
      </template>
    </XModal>
  </div>
</template>

<script lang="ts" setup>
import { TableColumn } from '@/types/table'
import { getConfigPageApi, deleteConfigApi } from '@/api/infra/config'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const { t } = useI18n()
let tabsName = ref('currency')
const columns: TableColumn[] = [
  {
    label: '提示标题',
    field: 'id',
    isSearch: true
  },
  {
    label: '提示类型',
    field: 'category'
  },
  {
    label: '提示内容',
    field: 'prompt'
  },
  {
    label: '适用品牌',
    field: 'key'
  },
  {
    label: '适用车系车型',
    field: 'value'
  },
  {
    label: '适用门店',
    field: 'type'
  },
  {
    label: '状态',
    field: 'visible'
  },
  {
    label: '创建人',
    field: 'creator'
  },
  {
    label: '创建时间',
    field: 'updater'
  },
  {
    label: t('common.createTime'),
    field: 'createTime'
  },
  {
    label: '操作',
    field: 'action',
    showOverflowTooltip: false
  }
]

// 操作：新增
function handleAdd() {
  console.log('add')
  dialogVisible.value = true
}

// 操作：删除
function handleDel() {
  console.log('del')
}

// 操作：提示类型配置
function handlePrompt() {
  console.log('prompt')
}

// 操作：修改
function handleEdit(row) {
  console.log('edit', row)
}

// 操作：预览
function handlePreview(row) {
  console.log('preview', row)
}
function handleSelectionChange(row) {
  console.log('handleSelectionChange', row)
}

/* -------------------------------- // 弹窗的表单 -------------------------------- */
let dialogVisible = ref(false) // 弹窗是否展示
let dialogLoading = ref(false) // 弹窗的加载中
let formRef = ref()
let formRules = reactive({
  name: [
    {
      required: true,
      message: '请输入提示标题',
      trigger: 'blur'
    }
  ],
  status: [
    {
      required: true,
      message: '请选择提示类型',
      trigger: 'blur'
    }
  ],
  remark: [
    {
      required: true,
      message: '请输入提示内容',
      trigger: 'blur'
    }
  ],
  region: [
    {
      required: true,
      message: '请选择适用品牌',
      trigger: 'blur'
    }
  ]
})
let formValues = ref({
  name: '',
  status: 1,
  remark: '',
  region: ''
})

const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped>
.prompt-configuration {
  // 影响到表单的样式
  :deep(.el-card) {
    border: none;
    border-radius: 0;
  }

  :deep(.el-tabs--border-card) {
    border: none;
  }
  :deep(.el-tabs__content) {
    display: none;
  }
  // 选中的样式
  :deep(.el-tabs--border-card > .el-tabs__header) {
    border-bottom: none;
    background-color: #f1f3f6;
  }

  :deep(.el-tabs__item) {
    position: relative;
    height: 50px;
    line-height: 50px;
    padding-left: 34px !important;
    padding-right: 34px !important;

    &.is-active {
      background-color: #fff;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #409eff;
      }
    }
  }
}
</style>
