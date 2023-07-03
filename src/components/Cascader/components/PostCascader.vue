<template>
  <BaseCascader :options="options" />
</template>

<script lang="ts" setup>
import BaseCascader from './BaseCascader.vue'
import { useCommonList } from '@/hooks/web/useCommonList'
let options: Ref<Recordable[]>

const { getPostList } = useCommonList()

const getData = () => {
  options = getPostList()
}
getData()
</script>

<style lang="scss" scoped></style>
