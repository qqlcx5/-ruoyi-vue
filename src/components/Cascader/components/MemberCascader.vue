<template>
  <BaseCascader :options="options" />
</template>

<script lang="ts" setup>
import BaseCascader from './BaseCascader.vue'
import { useCommonList } from '@/hooks/web/useCommonList'
import { propTypes } from '@/utils/propTypes'
import { UserMemberList } from '@/api/common'
import { computed } from 'vue'

const props = defineProps({
  params: propTypes.object.def({})
})

const { getUserMemberList } = useCommonList()

const options = computed(() => {
  return getUserMemberList(props.params as UserMemberList).value
})
</script>

<style lang="scss" scoped></style>
