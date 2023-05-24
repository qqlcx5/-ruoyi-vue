<script setup lang="ts">
import { defineProps } from 'vue'
import { listSimplePostsApi } from '@/api/system/post/type'

const emit = defineEmits(['change', 'update:modelValue'])
const props = defineProps({
  modelValue: { type: [Array, String, Number] },
  multiple: { type: Boolean, default: false }
})
const postOptions = ref()
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

const onChange = (val) => {
  emit('change', val)
}

// 初始化
const init = async () => {
  postOptions.value = await listSimplePostsApi()
}

onMounted(() => {
  init()
})
</script>

<template>
  <el-select
    v-model="localValue"
    clearable
    filterable
    placeholder="请选择岗位类型"
    @change="onChange"
    :multiple="multiple"
    collapse-tags
    collapse-tags-tooltip
  >
    <el-option v-for="item in postOptions" :key="item.code" :label="item.name" :value="item.code" />
  </el-select>
</template>
