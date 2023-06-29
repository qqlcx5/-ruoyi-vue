<template>
  <div>
    <!-- 提示类型配置 -->
    <XModal v-model="modelValue_" title="预览" width="446">
      <div class="flex mb-14px">
        <div class="text-title font-bold">提示标题：</div>
        <div>{{ info.title }}</div>
      </div>
      <div class="flex mb-14px">
        <div class="text-title font-bold">提示有效期：</div>
        <div>{{ info.validityDateType === 1 ? '永久' : '部分' }}</div>
      </div>
      <div v-if="mode === 'needlessToSay'" class="flex mb-14px">
        <div class="text-title font-bold">提示时间节点：</div>
        <div>{{ info.minute }} 分钟</div>
      </div>
      <div class="flex mb-14px">
        <div class="text-title font-bold">适用品牌：</div>
        <div>{{ info.applyBrandType === 1 ? '全部' : '部分' }}</div>
      </div>
      <div class="flex mb-14px">
        <div class="text-title font-bold">状态：</div>
        <div>{{ info.status ? '开启' : '关闭' }}</div>
      </div>
      <div class="flex mb-14px">
        <div class="text-title font-bold">适用门店：</div>
        <div>{{ info.applyShopType === 1 ? '全部' : '部分' }}</div>
      </div>
      <div class="flex mb-14px">
        <div class="text-title font-bold">提示内容：</div>
        <div v-html="info.content"></div>
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
  },
  mode: {
    type: String,
    default: ''
  },
  info: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emits = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()
const modelValue_ = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>
