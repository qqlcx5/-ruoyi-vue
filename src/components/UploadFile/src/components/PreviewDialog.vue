<template>
  <XModal :title="title" v-model="show" width="500px">
    <span>test </span>
  </XModal>
</template>

<script lang="ts" setup>
import { ref, watch, withDefaults } from 'vue'
const show = ref(false)
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
  }>(),
  {
    title: '测试'
  }
)
const emits = defineEmits<{ (e: 'update:modelValue', show: boolean): void }>()

watch(
  () => props.modelValue,
  (val) => {
    show.value = val
  }
)

watch(show, (val) => {
  emits('update:modelValue', val)
})
</script>

<style lang="scss" scoped></style>
