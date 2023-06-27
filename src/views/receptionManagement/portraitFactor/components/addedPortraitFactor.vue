<template>
  <div>
    <!--  画像因子新增 类型 -->
    <XModal v-model="modelValue_" title="新增">
      <!-- 表单 -->
      <Form :schema="allSchemas.formSchema" :rules="addRules" ref="formRef">
        <template #score="form">
          <div class="flex">
            <el-input v-model="form.lowestScore" /> —— <el-input v-model="form.topScore" />
          </div>
        </template>
      </Form>
      <!-- 操作按钮 -->
      <template #footer>
        <!-- 按钮：保存 -->
        <XButton type="primary" title="确认" :loading="actionLoading" @click="submitForm" />
        <!-- 按钮：关闭 -->
        <XButton title="取消" @click="modelValue_ = false" />
      </template>
    </XModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

import * as promptConfig from '@/api/receptionManagement/promptConfig'
import { allSchemas, addRules } from './addedPortraitFactor.data.js'

const { t } = useI18n() // 国际化
let dialogLoading = ref(false) // 弹窗加载状态
const [registerTable, { reload }] = useXTable({
  allSchemas: allSchemas,
  getListApi: promptConfig.receptionHintTypeAllListApi
})

/* ---------------------------------- 提示类型配置表单 --------------------------------- */
function handleEdit(row: any) {
  // 编辑
  console.log(row)
}
function handleDel(row: any) {
  // 删除
  console.log(row)
}

/* --------------------------------- 新增类型 -------------------------------- */
let addTypeVisible = ref(false) // 新增类型弹窗
let formData = reactive({
  name: '',
  type: ''
})
function handleAddTypeVisible() {
  console.log('新增类型')
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
    }
  })
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
