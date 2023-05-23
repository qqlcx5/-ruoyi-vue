<script setup lang="ts">
import { PropType } from 'vue'
import { WGVxeTools } from '@/components/XTable/src/type'

const props = defineProps({
  tools: {
    type: Array as PropType<WGVxeTools[]>,
    default: () => []
  },
  tableKey: {
    type: String
  }
})

// console.log(props.tools);

const emit = defineEmits(['toolClick'])

const defaultTools = ref<WGVxeTools[]>([
  // { key: 'export', show: true, disable: false },
  { key: 'fullScreen', show: true, disable: false },
  // { key: 'print', show: true, disable: false },
  { key: 'refresh', show: true, disable: false },
  { key: 'custom', show: true, disable: false }
])

const toolOptions = {
  fullScreen: { icon: 'iconfont icon-quanping' },
  print: { icon: 'iconfont icon-dayin' },
  refresh: { icon: 'iconfont icon-shuaxin' },
  custom: { icon: 'iconfont icon-dingzhilie' }
}

const onToolClick = (key) => {
  emit('toolClick', key)
}

onMounted(() => {
  if (!props.tableKey) {
    defaultTools.value = defaultTools.value.filter((i) => i.key !== 'custom')
  }
})
</script>

<template>
  <div class="flex items-center text-blue">
    <template v-for="t in tools.length > 0 ? tools : defaultTools">
      <div
        v-if="toolOptions[t.key]"
        :key="t.key"
        class="wg-tool p-8px mr-12px cursor-pointer"
        @click="onToolClick(t.key)"
      >
        <i :class="toolOptions[t.key].icon"></i>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.wg-tool {
  color: $text-color;

  i {
    font-size: 14px;
  }
}
</style>
