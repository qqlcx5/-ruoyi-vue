<template>
  <el-dialog
    class="wg-custom-dialog"
    :model-value="props.modelValue"
    :title="editFlag ? '编辑' : '新增'"
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
          <el-radio :label="2">分公司</el-radio>
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
        <el-button type="primary" :loading="btnLoading" @click="handleConfirm(ruleFormRef)"
          >确定</el-button
        >
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { addRepetitionPeriod, updateRepetitionPeriod } from '@/api/clue/basicConfig'
import type { FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'

const message = useMessage()

interface IProps {
  modelValue: boolean
  curInfo: {
    id?: number
  }
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  curInfo: () => ({})
})
interface IEmit {
  (event: 'update:modelValue', modelValue: boolean): void
  (event: 'success'): void
}
const emit = defineEmits<IEmit>()

const editFlag = ref<boolean>(false)
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      editFlag.value = !!props.curInfo.id
      if (unref(editFlag)) {
        ruleForm = reactive(cloneDeep(props.curInfo))
        if (ruleForm.repetitionPeriod > 0) {
          isLimit.value = 'hasLimit'
        }
      }
    }
  }
)

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
const _form = cloneDeep(ruleForm)
const rules: FormRules = reactive({
  repetitionPeriod: [{ required: true, type: 'number', message: '请输入数字', trigger: 'blur' }]
})

const handleClose = () => {
  ruleForm = reactive(_form)
  isLimit.value = 'noLimit'
  ruleFormRef.value?.resetFields()
  emit('update:modelValue', false)
}
const btnLoading = ref<boolean>(false)
const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        btnLoading.value = true
        const params = {
          id: ruleForm.id || null,
          ruleType: ruleForm.ruleType,
          repetitionPeriod: ruleForm.repetitionPeriod || ''
        }
        unref(editFlag) ? await updateRepetitionPeriod(params) : await addRepetitionPeriod(params)
        emit('success')
        message.success('提交成功')
        handleClose()
      } finally {
        btnLoading.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss">
@import '@/styles/custom.scss';
</style>
