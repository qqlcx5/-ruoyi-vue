<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { ElementPlusSize } from '@/types/elementPlus'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('size-dropdown')

defineProps({
  color: propTypes.string.def('')
})

const { t } = useI18n()

const appStore = useAppStore()

const sizeMap = computed(() => appStore.sizeMap)

const setCurrentSize = (size: ElementPlusSize) => {
  appStore.setCurrentSize(size)
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click" @command="setCurrentSize">
    <!--    <Icon :size="18" icon="mdi:format-size" :color="color" class="cursor-pointer" />-->
    <div class="flex items-center justify-center w-60px h-60px">
      <Icon icon="svg-icon:format-size" :size="16" class="cursor-pointer" :color="color" />
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in sizeMap" :key="item" :command="item">
          {{ t(`size.${item}`) }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
