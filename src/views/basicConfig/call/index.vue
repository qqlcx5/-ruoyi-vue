<template>
  <div class="basic-config-content call-settings-container">
    <div class="config-form-item">
      <span class="mr-8px">每个客户每天允许打通电话次数</span>
      <el-button type="primary">编辑</el-button>
    </div>
    <el-table :data="[{}]" class="custom-table mt-20px">
      <el-table-column label="可打通次数" min-width="200">
        <el-input-number :controls="false" />
      </el-table-column>
      <el-table-column label="参与计数门店" min-width="200">
        <el-select>
          <el-option label="1" value="1" />
        </el-select>
      </el-table-column>
      <el-table-column label="状态" min-width="60">
        <el-switch />
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import '../style/index';
.call-settings-container {
  min-height: 100%;
  padding: 15px;
}
</style>
