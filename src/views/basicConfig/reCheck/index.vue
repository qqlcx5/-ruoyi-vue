<template>
  <div class="basic-config-content re-check-container">
    <div class="part-title">
      <span class="main-text">门店复核</span>
      <el-switch />
    </div>
    <div class="config-form-item">
      <span>参与复核的门店：</span>
      <el-button type="primary">编辑</el-button>
    </div>
    <div class="part-title mt-30px">
      <span class="main-text">总部复核</span>
      <el-switch />
    </div>
    <div class="config-form-item">
      <span>参与复核的门店：</span>
      <el-button type="primary">编辑</el-button>
    </div>
    <el-button class="mt-54px" type="primary">保存设置</el-button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import '../style/index';
.re-check-container {
  min-height: 100%;
}
</style>
