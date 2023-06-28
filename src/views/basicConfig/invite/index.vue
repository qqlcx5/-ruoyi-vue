<template>
  <div class="basic-config-content" style="min-height: 100%" v-loading="loading">
    <el-form ref="formRef" :model="ruleForm" :rules="rules" v-if="!loading">
      <div class="part-wrap">
        <div class="part-title">
          <span class="main-text">接单逾期设置</span>
          <el-switch v-model="ruleForm.receiveOpenRules" :active-value="1" :inactive-value="0" />
        </div>
        <el-form-item
          label="邀约单接单判定“一般逾期”为派单后"
          :key="ruleForm.receiveOpenRules"
          :prop="ruleForm.receiveOpenRules === 1 ? 'generalOverdue' : ''"
        >
          <el-input-number
            v-model="ruleForm.generalOverdue"
            :controls="false"
            step-strictly
            :step="1"
            :min="0"
          />
          <span>分钟接单</span>
        </el-form-item>
        <el-form-item
          label="邀约单接单判定“严重逾期”为派单后"
          :key="ruleForm.receiveOpenRules"
          :prop="ruleForm.receiveOpenRules === 1 ? 'seriousOverdue' : ''"
          style="margin-bottom: 4px"
        >
          <el-input-number
            v-model="ruleForm.seriousOverdue"
            :controls="false"
            step-strictly
            :step="1"
            :min="0"
          />
          <span>分钟接单</span>
        </el-form-item>
      </div>
      <div class="part-wrap">
        <div class="part-title">
          <span class="main-text">沟通逾期设置</span>
          <el-switch
            v-model="ruleForm.communicationOpenRules"
            :active-value="1"
            :inactive-value="0"
          />
        </div>
        <el-form-item
          label="邀约单沟通判定“一般逾期”为接单后"
          :key="ruleForm.communicationOpenRules"
          :prop="ruleForm.communicationOpenRules === 1 ? 'communicationGeneralOverdue' : ''"
        >
          <el-input-number
            v-model="ruleForm.communicationGeneralOverdue"
            :controls="false"
            step-strictly
            :step="1"
            :min="0"
          />
          <span>分钟沟通</span>
        </el-form-item>
        <el-form-item
          label="邀约单沟通判定“严重逾期”为接单后"
          :key="ruleForm.communicationOpenRules"
          :prop="ruleForm.communicationOpenRules === 1 ? 'communicationSeriousOverdue' : ''"
          style="margin-bottom: 4px"
        >
          <el-input-number
            v-model="ruleForm.communicationSeriousOverdue"
            :controls="false"
            step-strictly
            :step="1"
            :min="0"
          />
          <span>分钟沟通</span>
        </el-form-item>
      </div>
      <div class="part-wrap">
        <div class="part-title">
          <span class="main-text">邀约单接单逾期回收设置</span>
          <el-switch
            v-model="ruleForm.receiveOverdueRecycle"
            :active-value="1"
            :inactive-value="0"
          />
        </div>
        <el-form-item
          label="派单后"
          :key="ruleForm.receiveOverdueRecycle"
          :prop="ruleForm.receiveOverdueRecycle === 1 ? 'receiveOverdueTime' : ''"
          style="margin-bottom: 4px"
        >
          <el-input-number
            v-model="ruleForm.receiveOverdueTime"
            :controls="false"
            step-strictly
            :step="1"
            :min="0"
          />
          <span>分钟未接单，则对邀约单进行回收</span>
        </el-form-item>
      </div>
      <div class="part-wrap">
        <div class="part-title">
          <span class="main-text">邀约单沟通逾期回收设置</span>
          <el-switch
            v-model="ruleForm.communicationOverdueRecycle"
            :active-value="1"
            :inactive-value="0"
          />
        </div>
        <el-form-item
          label="接单后"
          :key="ruleForm.communicationOverdueRecycle"
          :prop="ruleForm.communicationOverdueRecycle === 1 ? 'communicationOverdueTime' : ''"
          style="margin-bottom: 4px"
        >
          <el-input-number
            v-model="ruleForm.communicationOverdueTime"
            :controls="false"
            step-strictly
            :step="1"
            :min="0"
          />
          <span>分钟未沟通，则对邀约单进行回收</span>
        </el-form-item>
      </div>
    </el-form>
    <div class="bottom-btns" v-hasPermi="['clue:basic-config:invite:save']">
      <el-button type="primary" :loading="btnLoading" @click="handleSave">保存设置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { detailInvite, updateInvite } from '@/api/clue/basicConfig'

const message = useMessage()

let ruleForm = reactive({
  receiveOpenRules: 0, // 接单逾期设置
  generalOverdue: null, // 一般逾期分钟
  seriousOverdue: null, // 严重逾期分钟

  communicationOpenRules: 0, // 沟通逾期设置
  communicationGeneralOverdue: null, // 沟通一般逾期分钟
  communicationSeriousOverdue: null, // 沟通严重逾期分钟

  receiveOverdueRecycle: 0, // 邀约单接单逾期回收设置
  receiveOverdueTime: null, // 邀约单接单逾期回收时间

  communicationOverdueRecycle: 0, // 邀约单沟通逾期回收设置
  communicationOverdueTime: null // 邀约单沟通逾期回收时间
})
const formRef = ref<FormInstance>()
const rules: FormRules = reactive<FormRules>({
  generalOverdue: [{ required: true, message: '请输入', trigger: 'blur' }],
  seriousOverdue: [{ required: true, message: '请输入', trigger: 'blur' }],
  communicationGeneralOverdue: [{ required: true, message: '请输入', trigger: 'blur' }],
  communicationSeriousOverdue: [{ required: true, message: '请输入', trigger: 'blur' }],
  receiveOverdueTime: [{ required: true, message: '请输入', trigger: 'blur' }],
  communicationOverdueTime: [{ required: true, message: '请输入', trigger: 'blur' }]
})

const loading = ref<boolean>(false)
const getInfo = async () => {
  try {
    loading.value = true
    const data = await detailInvite()
    ruleForm = reactive(data)
  } finally {
    loading.value = false
  }
}
getInfo()

const btnLoading = ref<boolean>(false)
const handleSave = () => {
  unref(formRef)?.validate(async (vali) => {
    if (vali) {
      try {
        btnLoading.value = true
        await updateInvite(ruleForm)
        message.success('提交成功')
      } finally {
        btnLoading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/custom.scss';
.el-input-number {
  margin-right: 12px;
  width: 120px;
}
</style>
