<template>
  <XModal :title="title" v-model="show" width="950px">
    <div class="dialog-box">
      <iframe class="dialog-iframe" :src="previewUrl" frameborder="0"></iframe>
    </div>
    <template #footer>
      <XButton :title="t('dialog.close')" @click="show = false" />
    </template>
  </XModal>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { encode } from 'js-base64'

const { t } = useI18n() // 国际化
const show = ref(false)
const props = defineProps<{
  modelValue: boolean
  title: string
  url: string
}>()
const emits = defineEmits<{ (e: 'update:modelValue', show: boolean): void }>()

const previewBaseUrl = import.meta.env.VITE_PREVIEW_URL
const previewUrl = computed(() => `${previewBaseUrl}?url=${encodeURIComponent(encode(props.url))}`)

watch(
  () => props.modelValue,
  (val) => {
    show.value = val
  }
)

watch(show, (val) => {
  emits('update:modelValue', val)
})
</script>

<style lang="scss" scoped>
.dialog-box {
  position: relative;
  min-height: 80vh;
}

.dialog-iframe {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
