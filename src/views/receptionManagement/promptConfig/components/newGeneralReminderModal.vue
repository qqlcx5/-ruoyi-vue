<template>
  <div class="new-general-reminder-modal">
    <!-- 新增-通用提示 -->
    <XModal v-model="modelValue_" title="新增-通用提示">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="状态" prop="status" required>
          <el-switch v-model="formData.status" :inactive-value="0" :active-value="1" />
        </el-form-item>
        <el-form-item label="提示标题" prop="title" required>
          <el-input
            v-model="formData.title"
            placeholder="请输入主体编码"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="提示类型" prop="hintTypeId" required>
          <el-select v-model="formData.hintTypeId" placeholder="请选择提示类型">
            <el-option
              v-for="item in promptTypeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 新增-必讲项提示 -->
        <el-form-item v-if="mode === 'needlessToSay'" label="提示有效期" prop="status" required>
          <el-radio-group v-model="formData.status">
            <el-radio :key="1" label="永久"></el-radio>
            <el-radio :key="2" label="自定义"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="mode === 'needlessToSay'" label="提示时间节点" prop="status" required>
          <div class="flxex">
            开始接待 录音后，<el-input placeholder="请输入" style="width: 180px" /> 分钟，弹出提示
          </div>
        </el-form-item>
        <el-form-item label="适用品牌" prop="applyBrandType" required>
          <el-radio-group v-model="formData.applyBrandType">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">部分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用门店" prop="applyShopType" required>
          <el-radio-group v-model="formData.applyShopType">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">部分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提示内容" prop="content" required>
          <Editor v-model="formData.content" class="mb-20px" :height="220" />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <template #footer>
        <!-- 按钮：保存 -->
        <XButton type="primary" title="确认" :loading="dialogLoading" @click="submitForm" />
        <!-- 按钮：关闭 -->
        <XButton title="取消" @click="modelValue_ = false" />
      </template>
    </XModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import * as promptConfig from '@/api/receptionManagement/promptConfig'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'currency'
  }
})

const emits = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()
const modelValue_ = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
/* -------------------------------- // 获取提示类型 ------------------------------- */
let promptTypeList = ref([])
async function getPromptType() {
  const data = await promptConfig.receptionHintTypeAllListApi({})
  promptTypeList.value = data
}
getPromptType()
/* -------------------------------- // 弹窗的表单 -------------------------------- */
let dialogLoading = ref(false) // 弹窗的加载中
let formRules = reactive({
  title: [{ required: true, message: '请输入提示标题', trigger: 'blur' }],
  hintTypeId: [{ required: true, message: '请选择提示类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择提示有效期', trigger: 'change' }],
  content: [{ required: true, message: '请输入提示内容', trigger: 'blur' }]
})
let formData = ref({
  title: '',
  hintTypeId: '',
  status: 1,
  applyBrandType: 1,
  applyShopType: 1,
  content: ''
})

// 提交按钮
import type { FormInstance, FormRules } from 'element-plus'
const formRef = ref<FormInstance>()
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const submitForm = async () => {
  const elForm = formRef.value
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (!valid) return
    try {
      dialogLoading.value = true
      const data = {
        ...formData.value
      }
      await promptConfig.receptionHintConfigSaveOrUpdateApi(data)
      message.success(t('common.createSuccess'))
    } finally {
      dialogLoading.value = false
      modelValue_.value = false
    }
  })
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
  --el-form-label-font-size: 12px;
}
</style>
