<template>
  <div class="dcc-edit-container">
    <div class="page-title">DCC考核设置</div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="DCC规则名称" label-width="100" prop="name">
        <el-input
          v-model="ruleForm.name"
          maxlength="20"
          show-word-limit
          placeholder="请输入DCC规则名称"
          style="width: 340px"
        />
      </el-form-item>
      <el-form-item label="适用门店" label-width="100" prop="shop">
        <el-select v-model="ruleForm.shop" clearable>
          <el-option label="132" value="333" />
        </el-select>
      </el-form-item>
      <el-table :data="[{}]" class="custom-table mb-30px">
        <el-table-column label="意向等级" />
        <el-table-column label="可选择性" min-width="220px">
          <template #default="{ row }">
            <span>派单时间后</span>
            <el-input class="input-w-90px" />
            <span>时</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进周期" min-width="650px">
          <template #default="{ row }">
            <span>派单时间后</span>
            <el-input class="input-w-90px" />
            <span>至</span>
            <el-input class="input-w-90px" />
            <span>小时内，每</span>
            <el-input class="input-w-90px" />
            <span>小时内必须跟进</span>
          </template>
        </el-table-column>
        <el-table-column label="是否可战败" min-width="100px">
          <template #default="{ row }">
            <el-switch v-model="ruleForm.bool" />
          </template>
        </el-table-column>
        <el-table-column label="可战败起始时间" min-width="220px">
          <span>派单时间后</span>
          <el-input class="input-w-90px" />
          <span>时</span>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-switch v-model="ruleForm.bool" />
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="" label-width="0">
        <span class="mr-8px">线索有效率</span><el-switch />
      </el-form-item>
      <el-form-item label="" label-width="0">
        <el-radio-group>
          <el-radio label="按天" value="1" />
          <el-radio label="按自然月" value="2" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" label-width="0">
        <span>每个成员的线索无效率不超过</span>
        <el-input-number :controls="false" class="input-w-90px" />
        <span>%</span>
      </el-form-item>
      <el-form-item label="" label-width="0">
        <span class="mr-8px">DCC规则说明</span><el-switch />
      </el-form-item>
      <Editor :height="220" style="width: 600px" />
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

const ruleForm = reactive({
  name: '',
  shop: ''
})
const rules = reactive<FormRules>({
  name: [{}]
})
</script>

<style scoped lang="scss">
@import '../style/index';
.dcc-edit-container {
  padding: 22px 30px;
  background-color: var(--page-bg-color);
  .page-title {
    line-height: 25px;
    font-size: 14px;
    font-weight: bold;
    color: $title-color;
    padding-bottom: 10px;
    border-bottom: 1px solid $border-color;
    margin-bottom: 25px;
  }
  .input-w-90px {
    width: 90px;
    margin: 0 8px;
  }
}
</style>
