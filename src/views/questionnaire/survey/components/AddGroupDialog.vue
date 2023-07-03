<template>
  <Dialog @confirm="handleConfirm">
    <Form ref="formRef" :schema="formSchema" :is-col="false" />
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { FormSchema } from '@/types/form'

const props = defineProps<{
  data: Recordable
}>()

const emits = defineEmits<{
  (e: 'confirm', data: Recordable): void
}>()
const formSchema: FormSchema[] = [
  {
    field: 'appraiseTypeName',
    label: '分组名称',
    component: 'Input',
    formItemProps: {
      rules: {
        required: true,
        message: '请输入分组名称'
      }
    },
    componentProps: {
      maxlength: 8,
      showWordLimit: true
    }
  },
  {
    field: 'status',
    label: '状态',
    value: 1,
    component: 'Switch',
    componentProps: {
      activeValue: 1,
      inactiveValue: 0
    }
  }
]

const formRef = ref()
const handleConfirm = async () => {
  const elFormRef = formRef.value.getElFormRef()
  console.log(formRef.value)
  await elFormRef.validate()
  emits('confirm', formRef.value.formModel)
}

watch(formRef, (val) => {
  if (val) {
    formRef.value.setValues(props.data)
  }
})
</script>

<style lang="scss" scoped></style>
