<template>
  <el-dialog
    class="custom-dialog"
    :model-value="props.modelValue"
    title="新增"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :rules="rules"
      :model="ruleForm"
      label-width="140px"
      style="height: 120px"
    >
      <el-form-item label="线索重复判断维度">
        <el-radio-group>
          <el-radio label="不限" value="1" />
          <el-radio label="门店" value="2" />
          <el-radio label="分店" value="3" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="线索重复判断维度">
        <el-radio-group>
          <el-radio label="不限时间" value="1" />
          <el-radio label="限制时间" value="2" />
        </el-radio-group>
        <div>
          <el-input-number :controls="false" style="width: 100px" />
          <span class="ml-8px">天内不可重复</span>
        </div>
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
