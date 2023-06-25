<template>
  <Dialog v-model="dialogVisible" title="添加题目" style="min-width: 682px">
    <template #footer>
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
const dialogVisible = ref(false) // 弹窗的是否展示

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
// const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submit = async () => {}
</script>
<style lang="scss" scoped></style>
