<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${props.name}`" />
  </svg>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  name: propTypes.string.def('')
})
</script>

<style lang="scss" scoped>
.icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;
}
</style>
