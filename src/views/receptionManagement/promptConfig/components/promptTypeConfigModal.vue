<template>
  <div>
    <!-- 提示类型配置 -->
    <XModal v-model="modelValue_" width="60%" height="90%" title="提示类型配置">
      <form-table
        ref="tableRef"
        :form-options="{ schema: allSchemas.searchSchema }"
        :table-options="{
          columns: allSchemas.tableColumns,
          listApi: promptConfig.receptionHintTypePageApi,
          showAdd: true,
          actionButtons
        }"
        @add="addTypeVisible = true"
      >
        <template #toolbar_buttons>
          <XButton type="primary" preIcon="ep:plus" title="新增" @click="handleAddTypeVisible" />
        </template>
      </form-table>
      <!-- 操作按钮 -->
      <template #footer>
        <!-- 按钮：保存 -->
        <XButton type="primary" title="确认" :loading="dialogLoading" />
        <!-- 按钮：关闭 -->
        <XButton title="取消" @click="modelValue_ = false" />
      </template>
    </XModal>

    <!-- 新增类型 -->
    <XModal v-model="addTypeVisible" title="提示类型配置">
      <Form :schema="addAllSchemas.formSchema" :rules="addRules" ref="formRef" :isCol="false">
      </Form>
      <!-- 操作按钮 -->
      <template #footer>
        <!-- 按钮：保存 -->
        <XButton type="primary" title="确认" :loading="actionLoading" @click="submitForm" />
        <!-- 按钮：关闭 -->
        <XButton title="取消" @click="addTypeVisible = false" />
      </template>
    </XModal>
  </div>
</template>

<script setup lang="ts">
import * as promptConfig from '@/api/receptionManagement/promptConfig'
import { allSchemas } from './promptTypeConfigModal.data'
import { addRules, addAllSchemas } from './promptTypeConfigModal.add.data'

const { t } = useI18n() // 国际化
let dialogLoading = ref(false) // 弹窗加载状态
const selectedIds = ref<number[]>([])
const tableRef = ref()
const actionButtons = [
  {
    name: '编辑',
    permission: true,
    click: (row) => {
      editMember(row)
    }
  },
  {
    name: '删除',
    permission: true,
    click: (row) => {
      selectedIds.value = [row.id]
      confirmDel()
    }
  }
]

/* --------------------------------- 新增类型 -------------------------------- */
let addTypeVisible = ref(false) // 新增类型弹窗
function handleAddTypeVisible() {
  addTypeVisible.value = true
}

/* --------------------------------- // 新增类型 -------------------------------- */
import { FormExpose } from '@/components/Form'

// 表单参数
const actionLoading = ref(false) // 按钮 Loading
const formRef = ref<FormExpose>() // 表单 Ref
const message = useMessage() // 消息弹窗

// 提交按钮
const submitForm = async () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (!valid) return
    try {
      actionLoading.value = true
      const data = unref(formRef)?.formModel as promptConfig.ReceptionHintTypeSaveOrUpdateApiParams
      await promptConfig.receptionHintTypeSaveOrUpdateApi(data)
      message.success(t('common.createSuccess'))
    } finally {
      actionLoading.value = false
      addTypeVisible.value = false
      refreshList()
    }
  })
}

const editMember = (row) => {
  addTypeVisible.value = true
  nextTick(() => {
    unref(formRef)?.setValues(row)
  })
}
//
// const handleDel = async () => {
//   const res = await tableRef.value.tableMethods.getSelections()
//   if (res) {
//     selectedIds.value = res.map((item) => item.id)
//   }
//   if (selectedIds.value.length < 1) {
//     return message.warning('未选择数据')
//   }
//   handleDel()
// }
const confirmDel = () => {
  if (selectedIds.value.length < 1) {
    return message.warning('未选择数据')
  }
  const buttonConfig = {
    confirmButtonText: t('common.confirmDel'),
    cancelButtonText: t('common.cancel')
  }
  const contentStr: any = h('span', [
    '确定要删除 ',
    h(
      'span',
      {
        style: { color: 'red' }
      },
      selectedIds.value.length
    ),
    ' 条提示类型吗？'
  ])
  message
    .wgConfirm('', contentStr, buttonConfig)
    .then(() => {
      deleteFun()
    })
    .catch(() => {})
}
const deleteFun = async () => {
  let params = {
    ids: selectedIds.value
  }
  console.log(params)
  const res = await promptConfig.receptionHintTypeBatchDeleteApi(params)
  if (res) {
    message.success('删除成功')
    refreshList()
  } else {
    message.error('报错了')
  }
}
const refreshList = () => {
  console.log(tableRef.value.tableMethods)
  tableRef.value.tableMethods.getList()
}
/* ---------------------------------- 弹窗初始化 --------------------------------- */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()
const modelValue_ = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>
