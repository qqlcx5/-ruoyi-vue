<template>
  <XModal v-model="dialogVisible" width="534px" :title="dialogTitle">
    <!-- 对话框(添加 / 修改) -->
    <Form
      v-if="['create', 'update'].includes(actionType)"
      :schema="allSchemas.formSchema"
      :rules="rules"
      ref="formRef"
    >
      <template #code="form">
        <el-input v-model="form.code" placeholder="请输入线索来源名称" />
      </template>
      <template #status="form">
        <el-cascader :options="options" :props="props" v-model="form.status" clearable />
      </template>
    </Form>
    <!-- 操作按钮 -->
    <template #footer>
      <XButton
        v-if="['create', 'update'].includes(actionType)"
        type="primary"
        :title="t('action.save')"
        :loading="actionLoading"
        @click="submitForm()"
      />
      <XButton :loading="actionLoading" :title="t('dialog.close')" @click="dialogVisible = false" />
    </template>
  </XModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormExpose } from '@/components/Form'
import { rules, allSchemas, oa_source_res } from './source.form'

const formRef = ref<FormExpose>() // 表单 Ref
const { t } = useI18n() // 国际化
let dialogVisible = ref(false)
let dialogTitle = ref('新增')
const actionLoading = ref(false) // 遮罩层
const actionType = ref('create') // 操作按钮的类型

const props = {
  checkStrictly: true,
  label: 'clueName',
  value: 'clueSourceId'
}

let options = ref(oa_source_res.data)

const openModal = (data) => {
  console.log(data)

  dialogVisible.value = true
}
defineExpose({ openModal })
// 保存按钮
const submitForm = async () => {
  console.log('======')
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      actionLoading.value = true
      // 提交请求
      try {
        const data = unref(formRef)?.formModel
        console.log(data)

        // dialogVisible.value = false
      } finally {
        actionLoading.value = false
      }
    }
  })
}
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
