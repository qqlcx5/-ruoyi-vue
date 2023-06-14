<template>
  <el-dialog
    class="custom-dialog"
    :model-value="props.modelValue"
    title="新增"
    width="665px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :rules="rules" :model="ruleForm" label-width="110px">
      <el-form-item label="规则名称">
        <el-input
          placeholder="请输入规则名称"
          maxlength="20"
          show-word-limit
          style="width: 340px"
        />
      </el-form-item>
      <el-form-item label="适用门店">
        <el-select style="width: 240px">
          <el-option label="1" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="最低跟进率">
        <el-input-number :controls="false" style="width: 180px" />
        <span class="ml-8px">%</span>
      </el-form-item>
      <el-form-item label="计算周期">
        <el-input-number :controls="false" style="width: 180px" />
        <span class="ml-8px">天</span>
      </el-form-item>
      <el-form-item label="参与规则岗位">
        <el-select style="width: 180px">
          <el-option label="1" value="2" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
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
const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  handleClose()
}
</script>

<style lang="scss">
@import '../../style/index';
</style>
