<script setup lang="ts">
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { Footer } from '@/layout/components/Footer'
import { TagsView } from '@/layout/components/TagsView'
import { computed } from 'vue'

import EditUserInfo from '@/components/EditUerInfo/EditUserInfo.vue'

const appStore = useAppStore()

const layout = computed(() => appStore.getLayout)

const fixedHeader = computed(() => appStore.getFixedHeader)

const footer = computed(() => appStore.getFooter)

// const collapse = computed(() => appStore.getCollapse)
//
// const fixedMenu = computed(() => appStore.getFixedMenu)

const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})

const state = reactive({
  isShow: false
})
watch(
  () => appStore.getIsShowEditUserInfo,
  (val) => {
    nextTick(() => {
      state.isShow = val
    })
    console.log('val===>', val)
  }
)
</script>

<template>
  <section
    :class="[
      'p-[var(--app-content-padding)] w-[100%] bg-[var(--app-contnet-bg-color)] dark:bg-[var(--el-bg-color)] wg-section',
      {
        '!min-h-[calc(100%-var(--app-footer-height))]':
          fixedHeader && (layout === 'classic' || layout === 'topLeft') && footer,

        '!min-h-[calc(100%-var(--tags-view-height)-var(--top-tool-height)-var(--app-footer-height))]':
          ((!fixedHeader && layout === 'classic') || layout === 'top') && footer,

        '!min-h-[calc(100%-var(--tags-view-height)-var(--app-footer-height))]':
          !fixedHeader && layout === 'topLeft' && footer,

        '!min-h-[calc(100%-var(--top-tool-height))]': fixedHeader && layout === 'cutMenu' && footer,

        '!min-h-[calc(100%-var(--top-tool-height)-var(--tags-view-height))]':
          !fixedHeader && layout === 'cutMenu' && footer,
        '!h-[100%]': !footer
      }
    ]"
  >
    <TagsView
      v-if="layout === 'cutMenu'"
      :class="[
        '!w-[calc(100%+30px)] -mx-15px -mt-10px mb-10px border-bottom-1 border-top-1 border-solid border-[var(--tags-view-border-color)] dark:border-[var(--el-border-color)]'
      ]"
      :style="{ transition: 'width var(--transition-time-02), left var(--transition-time-02)' }"
    />
    <router-view>
      <template #default="{ Component, route }">
        <keep-alive :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </template>
    </router-view>
  </section>
  <Footer v-if="footer" />
  <EditUserInfo v-if="state.isShow" />
</template>

<style lang="scss" scoped>
.wg-section {
  > :deep(.#{$elNamespace}-card) {
    border: none;
    margin-bottom: 12px !important;
  }
}
</style>
