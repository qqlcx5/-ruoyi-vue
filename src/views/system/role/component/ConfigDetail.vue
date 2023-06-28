<template>
  <ConfigDetailItem title="成员端" :tableData="props.frontTableData" :origin="props.origin" />
  <ConfigDetailItem title="管理端" :tableData="props.backstageTableData" :origin="props.origin" />
</template>
<script setup lang="ts">
import ConfigDetailItem from './ConfigDetailItem.vue'

const props = defineProps({
  frontTableData: {
    type: Array,
    default: () => []
  },
  backstageTableData: {
    type: Array,
    default: () => []
  },
  origin: {
    type: String,
    default: ''
  }
})
</script>
<style lang="scss" scoped></style>
