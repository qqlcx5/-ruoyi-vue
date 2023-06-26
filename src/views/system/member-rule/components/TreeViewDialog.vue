<template>
  <Dialog
    v-bind="$attrs"
    :width="498"
    :max-height="447"
    scroll
    :confirm-config="{ show: false }"
    :cancel-config="{ name: '关闭' }"
  >
    <el-tree
      ref="tree"
      default-expand-all
      :data="treeData"
      :props="{ children: 'childs', label: 'name' }"
    />
  </Dialog>
</template>

<script lang="ts" setup>
defineProps<{
  treeData: Recordable[]
}>()
</script>

<style lang="scss" scoped></style>
