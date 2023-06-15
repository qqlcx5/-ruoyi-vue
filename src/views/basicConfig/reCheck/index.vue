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
    <el-table class="custom-table mt-15px" :data="[{}]" style="width: 600px">
      <el-table-column label="参与复核门店" prop="a1" />
      <el-table-column label="参与时间" prop="a2" />
      <el-table-column label="创建人" prop="createBy" />
      <el-table-column label="操作" width="60px">
        <template #default="{ row }">
          <Icon icon="ep:delete" color="#FE3B30" style="cursor: pointer" />
        </template>
      </el-table-column>
    </el-table>
    <div class="part-title mt-30px">
      <span class="main-text">总部复核</span>
      <el-switch />
    </div>
    <div class="config-form-item">
      <span>参与复核的门店：</span>
      <el-button type="primary">编辑</el-button>
    </div>
    <el-table class="custom-table mt-15px" :data="[{}]" style="width: 600px">
      <el-table-column label="参与复核门店" prop="a1" />
      <el-table-column label="参与时间" prop="a2" />
      <el-table-column label="创建人" prop="createBy" />
      <el-table-column label="操作" width="60px">
        <template #default="{ row }">
          <Icon icon="ep:delete" color="#FE3B30" style="cursor: pointer" />
        </template>
      </el-table-column>
    </el-table>
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
