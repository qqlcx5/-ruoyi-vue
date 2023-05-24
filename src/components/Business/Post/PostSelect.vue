<script setup lang="ts">
import { defineProps } from 'vue'
import { listSimplePostsByTypeCodeApi } from '@/api/system/post/info'

const emit = defineEmits(['change', 'update:modelValue'])
const props = defineProps({
  modelValue: { type: [Array, String, Number] },
  multiple: { type: Boolean, default: false },
  defaultParams: { type: Object, default: () => {} }
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
  () => props.defaultParams,
  () => {
    init()
  },
  {
    deep: true
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
  postOptions.value = await listSimplePostsByTypeCodeApi(props.defaultParams)
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
    placeholder="请选择岗位"
    @change="onChange"
    :multiple="multiple"
    collapse-tags
    collapse-tags-tooltip
  >
    <el-option v-for="item in postOptions" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
</template>
