<template>
  <el-dialog
    class="custom-dialog"
    :model-value="props.modelValue"
    title="新增"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      :model="ruleForm"
      label-width="140px"
      style="height: 120px"
    >
      <el-form-item label="线索重复判断维度" prop="ruleType">
        <el-radio-group v-model="ruleForm.ruleType">
          <el-radio :label="0">不限</el-radio>
          <el-radio :label="1">门店</el-radio>
          <el-radio :label="2">分店</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="线索重复判断维度">
        <el-radio-group v-model="isLimit" @change="limitChange">
          <el-radio label="noLimit">不限时间</el-radio>
          <el-radio label="hasLimit">限制时间</el-radio>
        </el-radio-group>
        <el-form-item label="" prop="repetitionPeriod" v-if="isLimit === 'hasLimit'">
          <el-input-number
            v-model="ruleForm.repetitionPeriod"
            :controls="false"
            step-strictly
            :step="1"
            :min="1"
            style="width: 100px"
          />
          <span class="ml-8px">天内不可重复</span>
        </el-form-item>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm(ruleFormRef)">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { addRepetitionPeriod } from '@/api/clue/basicConfig'
import type { FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
interface IProps {
  modelValue: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false
})
interface IEmit {
  (event: 'update:modelValue', modelValue: boolean): void
}
const emit = defineEmits<IEmit>()

const ruleFormRef = ref<FormInstance>()

const isLimit = ref<string>('noLimit')
const limitChange = () => {
  ruleForm.repetitionPeriod = null
  ruleFormRef.value && ruleFormRef.value.clearValidate('repetitionPeriod')
}

let ruleForm = reactive<any>({
  ruleType: 0,
  repetitionPeriod: null
})
const _form = toRaw(ruleForm)
const rules: FormRules = reactive({
  repetitionPeriod: [{ required: true, type: 'number', message: '请输入数字', trigger: 'blur' }]
})

const handleClose = () => {
  ruleForm = reactive(_form)
  isLimit.value = 'noLimit'
  ruleFormRef.value?.resetFields()
  emit('update:modelValue', false)
}
const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = cloneDeep(ruleForm)
      if (!params.repetitionPeriod) {
        params.repetitionPeriod = '-1'
      }
      await addRepetitionPeriod(params)
      handleClose()
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss">
@import '../../style/index';
</style>
