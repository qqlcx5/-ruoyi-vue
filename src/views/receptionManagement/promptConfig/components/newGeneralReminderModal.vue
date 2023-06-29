<template>
  <div class="new-general-reminder-modal">
    <!-- 新增-通用提示 -->
    <XModal v-model="modelValue_" width="80%" height="90%" title="新增-通用提示">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="状态" prop="status" required>
          <el-switch v-model="formData.status" :inactive-value="0" :active-value="1" />
        </el-form-item>
        <el-form-item label="提示标题" prop="title" required>
          <div class="w-116">
            <el-input
              v-model="formData.title"
              placeholder="请输入主体编码"
              maxlength="30"
              show-word-limit
            />
          </div>
        </el-form-item>
        <el-form-item v-if="mode === 'currency'" label="提示类型" prop="hintTypeId" required>
          <div class="w-116">
            <el-select v-model="formData.hintTypeId" placeholder="请选择提示类型">
              <el-option
                v-for="item in promptTypeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-form-item>
        <!-- 新增-必讲项提示 -->
        <el-form-item v-if="mode === 'needlessToSay'" label="提示有效期" prop="status" required>
          <el-radio-group v-model="formData.validityDateType">
            <el-radio :label="1">永久</el-radio>
            <el-radio :label="2">自定义</el-radio>
          </el-radio-group>
          <div v-if="formData.validityDateType === 2" class="w-10 ml-4">
            <el-date-picker v-model="formData.validityDate" type="daterange" />
          </div>
        </el-form-item>
        <el-form-item v-if="mode === 'needlessToSay'" label="提示时间节点" prop="minute" required>
          <div class="flex align-center">
            开始接待 录音后<el-input
              class="ml-2 mr-2"
              v-model="formData.minute"
              placeholder="请输入"
              style="width: 180px"
            />
            分钟，弹出提示
          </div>
        </el-form-item>
        <el-form-item label="适用品牌" prop="applyBrandType" required>
          <el-radio-group v-model="formData.applyBrandType">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">部分</el-radio>
          </el-radio-group>
          <el-cascader
            v-if="formData.applyBrandType === 2"
            class="ml-4"
            v-model="formData.applyBrandList"
            :options="modelByList"
            :props="{ label: 'name', value: 'id', emitPath: false, multiple: true }"
            filterable
            collapse-tags
            collapse-tags-tooltip
            clearable
            style="min-width: 180px"
          />
        </el-form-item>
        <el-form-item label="适用门店" prop="applyShopType" required>
          <el-radio-group v-model="formData.applyShopType">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">部分</el-radio>
          </el-radio-group>
          <el-cascader
            class="ml-4"
            v-if="formData.applyShopType === 2"
            v-model="formData.applyShopList"
            :options="storeList"
            :props="{ label: 'name', value: 'id', emitPath: false, multiple: true }"
            filterable
            collapse-tags
            collapse-tags-tooltip
            clearable
            style="min-width: 180px"
          />
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
import dayjs from 'dayjs'
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

const emits = defineEmits(['update:modelValue', 'refresh'])
const modelValue_ = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
watch(
  () => modelValue_.value,
  (newValue) => {
    newValue && getPromptType()
    newValue && queryModelByNameApi()
    newValue && allStoreListApi()
  }
)
function openModal(open: boolean, data?: any) {
  modelValue_.value = open
  formData = data
}
defineExpose({ openModal })

/* -------------------------------- // 获取提示类型 ------------------------------- */
const promptTypeList = ref<any[]>([])
async function getPromptType() {
  const data = await promptConfig.receptionHintTypeAllListApi({})
  promptTypeList.value = data
}
/* ------------------------ queryModelByNameApi ----------------------- */
const modelByList = ref<any[]>([])
async function queryModelByNameApi() {
  const data = await promptConfig.queryModelByNameApi({})
  modelByList.value = data
}
/* --------------------------- allStoreListApi --------------------------- */
const storeList = ref<any[]>([])
async function allStoreListApi() {
  const data = await promptConfig.allStoreListApi()
  storeList.value = data
}
/* -------------------------------- // 弹窗的表单 -------------------------------- */
let dialogLoading = ref(false) // 弹窗的加载中
let formRules = reactive({
  title: [{ required: true, message: '请输入提示标题', trigger: 'blur' }],
  hintTypeId: [{ required: true, message: '请选择提示类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择提示有效期', trigger: 'change' }],
  content: [{ required: true, message: '请输入提示内容', trigger: 'blur' }],
  applyBrandType: [{ required: true, message: '请选择适用品牌', trigger: 'change' }],
  applyShopType: [{ required: true, message: '请选择适用门店', trigger: 'change' }],
  minute: [{ required: true, message: '请输入提示时间节点', trigger: 'blur' }]
})
let formData = reactive({
  title: '',
  hintTypeId: '',
  status: 1,
  validityDateType: 1,
  applyBrandType: 1,
  applyShopType: 1,
  content: '',
  minute: '',
  validityDate: '',
  applyShopList: [],
  applyBrandList: [],
  validityDateBegin: '',
  validityDateEnd: ''
})

// 提交按钮
import type { FormInstance } from 'element-plus'
const formRef = ref<FormInstance>()
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const submitForm = async () => {
  const elForm = formRef.value
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (!valid) return
    if (!formData.validityDate && formData.validityDateType === 2)
      return message.error('请选择提示有效期')
    try {
      dialogLoading.value = true
      const data = {
        ...formData
      }
      // 必讲 有效期
      data.validityDateBegin =
        formData.validityDateType === 2 ? dayjs(formData.validityDate[0]).format('YYYY-MM-DD') : ''
      data.validityDateEnd =
        formData.validityDateType === 2 ? dayjs(formData.validityDate[1]).format('YYYY-MM-DD') : ''
      console.log(data, 'datadatadata')

      props.mode === 'currency'
        ? await promptConfig.receptionHintConfigSaveOrUpdateApi(data)
        : await promptConfig.receptionMustSayConfigSaveOrUpdateApi(data)
      message.success(t('common.createSuccess'))
    } finally {
      dialogLoading.value = false
      modelValue_.value = false
      emits('refresh', true)
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
