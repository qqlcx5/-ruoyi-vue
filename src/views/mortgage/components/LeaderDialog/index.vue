<template>
  <el-drawer
    :model-value="modelValue"
    size="762px"
    :with-header="false"
    :before-close="handleClose"
  >
    <div class="drawer-header">
      <div class="header-title">上级领导人</div>
      <Icon class="header-close" icon="ep:close" @click="handleClose" />
    </div>
    <el-table :data="[{ name: 1 }, {}]" class="custom-table" style="margin-top: 20px">
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="姓名" prop="name" width="100px" />
      <el-table-column label="电话" width="120" />
      <el-table-column label="职位" />
      <el-table-column label="喜好" />
      <el-table-column label="备注" width="200" />
    </el-table>
  </el-drawer>
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
</script>

<style lang="scss" scoped>
@import '@/styles/custom';
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 20px;
  border-bottom: 1px solid $border-color;
  margin: 0 -20px;
  .header-title {
    font-weight: bold;
    color: $title-color;
  }
  .header-close {
    cursor: pointer;
    color: $title-color;
  }
}
</style>
