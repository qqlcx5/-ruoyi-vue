<template>
  <BaseCascader :options="options" />
</template>

<script lang="ts" setup>
import BaseCascader from './BaseCascader.vue'
import { useCommonList } from '@/hooks/web/useCommonList'
import { propTypes } from '@/utils/propTypes'
import { UserMemberList } from '@/api/common'
import { watch } from 'vue'

const { getUserMemberList } = useCommonList()

const props = defineProps({
  params: propTypes.object.def({})
})
let options: Ref<Recordable[]>

watch(
  () => props.params,
  (val: UserMemberList) => {
    options = getUserMemberList(val)
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss" scoped></style>
