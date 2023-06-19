<template>
  <div>
    <!-- 提示类型配置 -->
    <XModal v-model="modelValue_" title="提示类型配置">
      <!-- 表单 -->
      <XTable @register="registerTable">
        <template #toolbar_buttons>
          <!-- 操作：发起请假 -->
          <XButton type="primary" preIcon="ep:plus" title="新增" />
        </template>
        <template #actionbtns_default="{ row }">
          <!-- 操作: 编辑 -->
          <XTextButton :title="t('action.update')" @click="handleEdit(row)" />
          <!-- 操作: 删除 -->
          <XTextButton :title="t('action.del')" @click="handleDel(row)" />
        </template>
      </XTable>
      <!-- 操作按钮 -->
      <template #footer>
        <!-- 按钮：保存 -->
        <XButton type="primary" title="确认" :loading="dialogLoading" />
        <!-- 按钮：关闭 -->
        <XButton title="取消" @click="modelValue_ = false" />
      </template>
    </XModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

import { getConfigPageApi } from '@/api/infra/config'
import { allSchemas } from './promptTypeConfigModal.data'

const { t } = useI18n() // 国际化
let dialogLoading = ref(false) // 弹窗加载状态
const [registerTable, { reload }] = useXTable({
  allSchemas: allSchemas,
  getListApi: getConfigPageApi
})

/* ---------------------------------- 弹窗的表单 --------------------------------- */
function handleEdit(row: any) {
  // 编辑
  console.log(row)
}
function handleDel(row: any) {
  // 删除
  console.log(row)
}

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
