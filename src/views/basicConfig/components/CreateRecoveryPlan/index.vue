<template>
  <div class="create-recovery-plan">
    <el-dialog
      class="custom-dialog"
      :model-value="props.modelValue"
      title="新增回收计划"
      width="550px"
      :before-close="handleClose"
    >
      <el-form ref="formRef" :rules="rules" :model="ruleForm" label-width="110px">
        <el-form-item label="线索所属成员">
          <el-select>
            <el-option label="1" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="手动回收原因">
          <el-select v-model="ruleForm.recycleReason">
            <el-option label="1" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="线索所属门店">
          <el-select v-model="ruleForm.shopId">
            <el-option label="1" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="线索品牌">
          <el-select v-model="ruleForm.brandIdList">
            <el-option label="1" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="线索派发时间">
          <el-radio-group v-model="ruleForm.radio">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">部分</el-radio>
            <el-form-item v-if="ruleForm.radio === 2" prop="timeRange" style="width: 100%">
              <el-date-picker
                v-model="ruleForm.timeRange"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="ruleForm.remark" type="textarea" :rows="4" style="width: 240px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="handleSearch">查询</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

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

const formRef = ref<FormInstance>()
const ruleForm = reactive({
  recycleReason: '',
  shopId: '',
  brandIdList: [],
  radio: 1,
  timeRange: [],
  remark: ''
})
const rules: FormRules = reactive({})
const handleClose = () => {
  emit('update:modelValue', false)
}
const handleSearch = () => {}
const handleConfirm = () => {
  handleClose()
}
</script>

<style lang="scss">
.create-recovery-plan {
  @import '../../style/index';
  .el-select {
    width: 240px;
  }
  .el-date-editor {
    width: 220px;
  }
}
</style>
