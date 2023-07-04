<template>
  <XModal title="添加标签" v-model="visible">
    <el-table class="custom-table" :data="list" max-height="300px">
      <template #empty>
        <el-button @click="addRow">添加行</el-button>
      </template>
      <el-table-column label="标签名称">
        <template #default="{ row }">
          <el-input v-model="row.tagName" maxlength="200" />
        </template>
      </el-table-column>
      <el-table-column label="启用状态">
        <template #default="{ row }">
          <el-switch v-model="row.tagStatus" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ $index }">
          <el-button link type="primary" @click="addRow($index)">添加行</el-button>
          <el-button link type="primary" @click="deleteRow($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 操作按钮 -->
    <template #footer>
      <XButton type="primary" title="确定" @click="handleConfirm" />
      <XButton title="取消" @click="handleClose" />
    </template>
  </XModal>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
interface IProps {
  modelValue: boolean
  tagList: object[]
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  tagList: () => []
})
interface IEmit {
  (event: 'update:modelValue', modelValue: boolean): void
  (event: 'confirm', list: object[]): void
}
const emit = defineEmits<IEmit>()
const visible = ref<boolean>(false)
const list = ref<object[]>([])
const tagItem = {
  tagName: '',
  tagStatus: 1
}
const addRow = (index) => {
  list.value.splice(index + 1, 0, cloneDeep(tagItem))
}
const deleteRow = (index) => {
  list.value.splice(index, 1)
}
const handleClose = () => {
  visible.value = false
}
const handleConfirm = () => {
  list.value = unref(list).filter((d) => d['tagName'].trim())
  emit('confirm', list.value)
  handleClose()
}
watch([() => props.modelValue, () => visible.value], (res, res1) => {
  if (res[0] && !res1[0]) {
    visible.value = true
    list.value = props.tagList.length ? cloneDeep(props.tagList) : [cloneDeep(tagItem)]
    return
  }
  if (!res[1] && res1[1]) {
    emit('update:modelValue', false)
    return
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/custom';
</style>
