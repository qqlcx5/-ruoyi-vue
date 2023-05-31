<!--  TODO:等他们定完  -->
<template>
  <div class="major-individual-select-content">
    <!--  @mouseleave="mouseLeave"  -->
    <a-tree-select
      v-model:value="state.majorIndividual"
      @blur="mouseLeave"
      style="width: 100%"
      show-search
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="请选择"
      :tree-data="state.majorIndividualOptions"
      treeNodeFilterProp="label"
      :getPopupContainer="getPopupContainer"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

interface Props {
  userInfo?: Array<any>
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  userInfo: () => []
})

const emit = defineEmits<{
  (e: 'mouseLeave', key: boolean): void
}>()

const state = reactive({
  majorIndividual: null,
  majorIndividualOptions: [
    {
      title: 'parent 1',
      value: 'parent 1',
      color: 'pink',
      children: [
        {
          title: 'parent 1-033333333',
          value: 'parent 1-0',
          color: 'orange',
          children: [
            {
              title: 'my leaf22222222222',
              value: 'leaf1',
              color: 'green'
            },
            {
              title: 'your leaf11111111111',
              value: 'leaf2',
              color: 'cyan'
            }
          ]
        },
        {
          title: 'parent 1-1',
          value: 'parent 1-1',
          color: 'blue'
        }
      ]
    }
  ]
})

const getPopupContainer = () => {
  return document.body
}

const mouseLeave = () => {
  console.log('失去')
  emit('mouseLeave', true)
}
</script>

<style lang="scss" scoped>
.major-individual-select-content {
  min-width: 200px;
}
</style>
