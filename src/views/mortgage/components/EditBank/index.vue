<template>
  <XModal title="新增按揭银行" width="758" height="80%" v-model="visible">
    <el-form :model="ruleForm" :rules="rules" label-width="130" style="padding-right: 50px">
      <el-form-item label="金融机构名称">
        <el-input placeholder="请输入金融机构名称" />
      </el-form-item>
    </el-form>
    <el-form :model="ruleForm" :rules="rules" label-width="130" style="padding-right: 50px">
      <el-form-item label="单位地址">
        <AreaSelect
          v-model:province="ruleForm.province"
          v-model:city="ruleForm.city"
          v-model:county="ruleForm.county"
        />
        <el-input
          placeholder="请输入详细的公司地址，具体门牌号"
          style="flex: 1; margin-left: 10px"
        />
      </el-form-item>
      <el-form-item label="税号">
        <el-input placeholder="请输入税号" />
      </el-form-item>
      <el-form-item label="联系人">
        <el-input placeholder="请输入联系人名称" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input placeholder="请输入电话" />
      </el-form-item>
      <el-form-item label="职位">
        <el-input placeholder="请输入职位" />
      </el-form-item>
      <el-form-item label="新增说明">
        <el-input
          type="textarea"
          :rows="3"
          maxlength="500"
          show-word-limit
          placeholder="请输入新增说明"
        />
      </el-form-item>
      <el-form-item label="上级领导联系人">
        <div class="mb-15px">
          <XButton type="primary" iconFont="icon-xinzeng" title="添加联系人" />
          <span style="margin-left: 10px; color: #999">最多添加8位联系人</span>
        </div>
        <div class="superior-leader">
          <div class="item-title">上级领导联系人1</div>
          <Icon class="item-delete" icon="ep:delete" />
          <el-form-item label="姓名" label-width="65">
            <el-input placeholder="请输入联系人名称" />
          </el-form-item>
          <el-form-item label="电话" label-width="65">
            <el-input placeholder="请输入联系人电话" />
          </el-form-item>
          <el-form-item label="职位" label-width="65">
            <el-input placeholder="请输入联系人职位" />
          </el-form-item>
          <el-form-item label="喜好" label-width="65">
            <el-input placeholder="请输入联系人喜好" maxlength="100" show-word-limit />
          </el-form-item>
          <el-form-item label="备注" label-width="65">
            <el-input placeholder="请输入备注" maxlength="100" show-word-limit />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="开启状态">
        <el-switch :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <template #footer>
      <XButton type="primary" title="确定" @click="handleConfirm" />
      <XButton title="取消" @click="handleClose" />
    </template>
  </XModal>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import AreaSelect from '@/components/AreaSelect/index.vue'
interface IProps {
  modelValue: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false
})
interface IEmit {
  (event: 'update:modelValue', modelValue: boolean): void
  (event: 'confirm', list: object[]): void
}
const emit = defineEmits<IEmit>()
const visible = ref<boolean>(false)

const ruleForm = reactive({})

const rules: FormRules = reactive({})

const handleClose = () => {
  visible.value = false
}
const handleConfirm = () => {
  handleClose()
}
watch([() => props.modelValue, () => visible.value], (res, res1) => {
  if (res[0] && !res1[0]) {
    visible.value = true
    return
  }
  if (!res[1] && res1[1]) {
    emit('update:modelValue', false)
    return
  }
})
</script>

<style lang="scss" scoped>
.superior-leader {
  position: relative;
  border: 1px dashed $border-color;
  width: 100%;
  padding-right: 50px;
  .item-title {
    padding: 10px 20px;
  }
  .item-delete {
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 20px;
    color: $text-color;
    &:hover {
      color: $error-color;
    }
  }
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
