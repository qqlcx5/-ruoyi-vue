<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('collapse')

defineProps({
  color: propTypes.string.def('')
})

const appStore = useAppStore()

const collapse = computed(() => appStore.getCollapse)

const toggleCollapse = () => {
  const collapsed = unref(collapse)
  appStore.setCollapse(!collapsed)
}
</script>

<template>
  <div :class="prefixCls" class="items-center flex items-center">
    <i
      class="iconfont cursor-pointer !text-18px"
      :class="[collapse ? 'icon-shouqicaidan' : 'icon-zhankaicaidan']"
      :style="{
        color: appStore.isDark ? color : '#8291A9'
      }"
      @click="toggleCollapse"
    ></i>
  </div>
</template>
