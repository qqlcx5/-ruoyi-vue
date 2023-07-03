<template>
  <el-cascader clearable filterable collapse-tags collapse-tags-tooltip v-bind="getBindValue" />
</template>

<script lang="ts" setup>
import { useAttrs, computed } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { isEmpty } from 'lodash'

const props = defineProps({
  props: propTypes.object,
  allChecked: propTypes.bool.def(true),
  options: propTypes.array
})

const defaultProps = {
  label: 'name',
  value: 'id',
  multiple: true,
  emitPath: false
}

const getBindValue = computed(() => {
  const attrs = useAttrs()

  const options =
    props.allChecked && !isEmpty(props.options)
      ? [{ name: '全部', value: 0, children: props.options }]
      : (props.options as Recordable[])

  return {
    ...attrs,
    options,
    props: {
      ...defaultProps,
      ...props.props
    }
  }
})
</script>

<style lang="scss" scoped></style>
