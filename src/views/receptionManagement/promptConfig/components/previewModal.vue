<template>
  <div>
    <!-- 提示类型配置 -->
    <XModal v-model="modelValue_" title="预览" width="446">
      <div class="flex mb-14px">
        <div class="text-title font-bold">提示标题：</div>
        <div>接待要点提示</div>
      </div>
      <div class="flex mb-14px">
        <div class="text-title font-bold">提示时间节点：</div>
        <div>接待要点提示</div>
      </div>
      <div class="flex mb-14px">
        <div class="text-title font-bold">适用品牌：</div>
        <div>接待要点提示</div>
      </div>
      <div class="flex mb-14px">
        <div class="text-title font-bold">适用门店：</div>
        <div>接待要点提示</div>
      </div>
      <div class="flex mb-14px">
        <div class="text-title font-bold">提示内容：</div>
        <div>接待要点提示</div>
      </div>
      <div class="flex mb-14px">
        <div class="text-title font-bold">状态：</div>
        <div>开启</div>
      </div>
    </XModal>
  </div>
</template>

<script setup lang="ts">
/* ---------------------------------- 弹窗初始化 --------------------------------- */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()
const modelValue_ = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>
