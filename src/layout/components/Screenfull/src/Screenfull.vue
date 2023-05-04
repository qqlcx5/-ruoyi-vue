<script setup lang="ts">
import { Icon } from '@/components/Icon'
import { useFullscreen } from '@vueuse/core'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('screenfull')

defineProps({
  color: propTypes.string.def('')
})

const { toggle, isFullscreen } = useFullscreen()

const toggleFullscreen = () => {
  toggle()
}
</script>

<template>
  <div :class="prefixCls" class="flex items-center justify-center w-60px h-60px" @click="toggleFullscreen">
    <!--    <Icon-->
    <!--      :size="18"-->
    <!--      :icon="isFullscreen ? 'zmdi:fullscreen-exit' : 'zmdi:fullscreen'"-->
    <!--      :color="color"-->
    <!--    />-->
    <Icon
      :size="16"
      :icon="isFullscreen ? 'svg-icon:fullscreen-exit' : 'svg-icon:fullscreen'"
      :color="color"
    />
  </div>
</template>
