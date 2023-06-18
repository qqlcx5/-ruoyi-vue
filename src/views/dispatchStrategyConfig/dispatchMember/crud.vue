<template>
  <XModal :title="id ? '修改' : '新增'" v-model="visible" width="50%">
    <Form
      v-if="['create', 'update'].includes(actionType)"
      :schema="allSchemas.formSchema"
      :rules="rules"
      ref="formRef"
    >
      <template></template>
    </Form>
    <!-- 操作按钮 -->
    <template #footer>
      <!-- 按钮：保存 -->
      <XButton type="primary" :title="t('action.save')" :loading="loading" @click="confirm" />
      <!-- 按钮：关闭 -->
      <XButton :loading="loading" :title="t('common.cancel')" @click="hide" />
    </template>
  </XModal>
</template>

<script setup lang="ts" name="dipatchMemberCrud">
import { FormExpose } from '@/components/Form'

const formRef = ref<FormExpose>() // 表单 Ref

const loading = ref(false)
const hide = () => {}
</script>

<style lang="scss" scoped></style>
