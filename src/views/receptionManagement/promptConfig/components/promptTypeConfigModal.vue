<template>
  <div>
    <!-- 新增-通用提示 -->
    <XModal v-model="modelValue_" title="新增-通用提示">
      <el-form ref="formRef" :model="formValues" :rules="formRules" label-width="80px">
        <el-form-item label="提示标题" prop="name" required>
          <el-input
            v-model="formValues.name"
            placeholder="请输入主体编码"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="提示类型" prop="region" required>
          <el-select v-model="formValues.region" placeholder="请选择上级主体">
            <el-option label="提示类型1" value="shanghai" />
            <el-option label="提示类型2" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="适用品牌" prop="status" required>
          <el-radio-group v-model="formValues.status">
            <el-radio :key="1" label="全部"></el-radio>
            <el-radio :key="2" label="部分"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用门店" prop="status" required>
          <el-radio-group v-model="formValues.status">
            <el-radio :key="1" label="全部"></el-radio>
            <el-radio :key="2" label="部分"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提示内容" prop="remark" required>
          <!-- 编辑器 -->
          <Editor
            v-model="formValues.dccExplain"
            class="mb-20px"
            :height="220"
            style="width: 600px"
          />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <template #footer>
        <!-- 按钮：保存 -->
        <XButton type="primary" title="确认" :loading="dialogLoading" />
        <!-- 按钮：关闭 -->
        <XButton title="取消" @click="modelValue_ = false" />
      </template>
    </XModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
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

/* -------------------------------- // 弹窗的表单 -------------------------------- */
let dialogLoading = ref(false) // 弹窗的加载中
let valueHtml = ref('')
let formRules = reactive({
  name: [
    {
      required: true,
      message: '请输入提示标题',
      trigger: 'blur'
    }
  ],
  status: [
    {
      required: true,
      message: '请选择提示类型',
      trigger: 'blur'
    }
  ],
  remark: [
    {
      required: true,
      message: '请输入提示内容',
      trigger: 'blur'
    }
  ],
  region: [
    {
      required: true,
      message: '请选择适用品牌',
      trigger: 'blur'
    }
  ]
})
let formValues = ref({
  name: '',
  status: 1,
  remark: '',
  region: '',
  dccExplain: ''
})
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped></style>
