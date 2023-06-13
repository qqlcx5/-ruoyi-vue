<template>
  <div class="basic-config-content call-settings-container">
    <div class="config-form-item">
      <span class="mr-8px">每个客户每天允许打通电话次数</span>
      <el-button type="primary" v-if="!editFlag" @click="toggleEdit(true)">编辑</el-button>
      <template v-else>
        <el-button type="primary" @click="toggleEdit(false)">保存</el-button>
        <el-button type="primary" @click="handleAddRow">新增行</el-button>
      </template>
    </div>
    <el-form :disabled="!editFlag">
      <el-table
        :data="canGetThroughVOs"
        max-height="calc(100% + 54px)"
        class="custom-table mt-20px"
      >
        <el-table-column label="可打通次数" min-width="200">
          <el-input-number :controls="false" />
        </el-table-column>
        <el-table-column label="参与计数门店" min-width="200">
          <el-select>
            <el-option label="1" value="1" />
          </el-select>
        </el-table-column>
        <el-table-column label="状态" min-width="60">
          <template #default="{ row }">
            <el-switch v-model="row.isEnable" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column v-if="editFlag" label="操作" width="80">
          <template #default="{ $index }">
            <el-button type="primary" link @click="handleDelRow($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script setup lang="ts">
const canGetThroughVOs = ref<object[]>([{ isEnable: 1 }])
const editFlag = ref<boolean>(false)
const toggleEdit = (bool) => {
  editFlag.value = bool
}
const handleAddRow = () => {
  canGetThroughVOs.value.push({
    canGetThroughNum: null,
    joinCountShopIds: [],
    isEnable: 0
  })
}
const handleDelRow = (index) => {
  canGetThroughVOs.value.splice(index, 1)
}
</script>

<style scoped lang="scss">
@import '../style/index';
.call-settings-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px;
  .el-form {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 1px;
    :deep(.el-input__inner) {
      text-align: left;
    }
  }
}
</style>
