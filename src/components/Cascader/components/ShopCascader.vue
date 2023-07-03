<template>
  <BaseCascader :options="options" />
</template>

<script lang="ts" setup>
import BaseCascader from './BaseCascader.vue'
import { useCommonList } from '@/hooks/web/useCommonList'

let options: Ref<Recordable[]>

const { getSuitableShopList } = useCommonList()

const getData = () => {
  options = getSuitableShopList()
}

getData()
</script>

<style lang="scss" scoped></style>
