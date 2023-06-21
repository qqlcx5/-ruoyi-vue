<script setup lang="ts">
import { getSimpleOrganizationList } from '@/api/system/organization'
import { defaultProps, handleTree } from '@/utils/tree'
import { defineProps } from 'vue'

const emit = defineEmits(['change', 'update:modelValue'])
const props = defineProps({
  modelValue: { type: Array },
  multiple: { type: Boolean, default: false }
})
const treeRef = ref()
const treeData = ref<any[]>([])
const sourceData = ref()
const localValue = ref()

watch(
  () => props.modelValue,
  (val) => {
    if (val === unref(localValue)) return
    localValue.value = val
  },
  {
    immediate: true
  }
)

watch(
  () => localValue.value,
  (val) => {
    emit('update:modelValue', val)
  }
)

const filterNodeMethod = (value, data) => data.name.includes(value)

const onChange = (val) => {
  emit('change', val)
}

// 初始化
const init = async () => {
  const result = await getSimpleOrganizationList({})
  treeData.value = handleTree(result)
  sourceData.value = treeData.value
}

onMounted(() => {
  init()
})
</script>

<template>
  <el-tree-select
    v-model="localValue"
    ref="treeRef"
    class="tree-select"
    :data="treeData"
    :props="defaultProps"
    check-strictly
    filterable
    :multiple="multiple"
    collapse-tags
    collapse-tags-tooltip
    placeholder="请选择部门"
    :render-after-expand="false"
    :filter-node-method="filterNodeMethod"
    @change="onChange"
  />
</template>
<style lang="scss" scoped>
.tree-select {
  :deep(.el-select__tags) {
    flex-wrap: nowrap;
  }

  :deep(.el-select-tags-wrapper) {
    display: flex;
  }
}
</style>
