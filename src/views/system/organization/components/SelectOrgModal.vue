<template>
  <!-- 弹窗 -->
  <XModal title="选择机构" v-model="modelVisible" width="500px">
    <el-tree
      class="px-6px py-10px max-h-560px"
      ref="treeRef"
      node-key="id"
      show-checkbox
      highlight-current
      default-expand-all
      :check-strictly="props.mode === 'single'"
      :default-checked-keys="defaultCheckedKeys"
      :props="defaultProps"
      :data="treeData"
      empty-text="加载中，请稍后"
      @check="onTreeCheck"
    />

    <template #footer>
      <!-- 按钮：取消 -->
      <XButton :title="t('common.cancel')" @click="modelVisible = false" />
      <!-- 按钮：确认 -->
      <XButton type="primary" :title="t('common.confirmSelect')" @click="submitForm()" />
    </template>
  </XModal>
</template>
<script setup lang="ts">
import { handleTree, defaultProps } from '@/utils/tree'
import { ElTree } from 'element-plus'
import { getSimpleOrganizationList } from '@/api/system/organization'
import { CommonStatusEnum } from '@/utils/constants'
import { message } from 'ant-design-vue'

const { t } = useI18n() // 国际化
const props = defineProps({
  mode: {
    type: String,
    default: 'multipart' // multipart or single
  }
})

// 弹窗相关的变量
const modelVisible = ref(false) // 是否显示弹出层
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<any[]>([])
const defaultCheckedKeys = ref<string[] | number[]>([])

const onTreeCheck = (node, list) => {
  if (props.mode === 'single') {
    if (list.checkedKeys.length === 2) treeRef.value!.setCheckedKeys([node.id])
  }
}

const init = async () => {
  const result = await getSimpleOrganizationList({ status: CommonStatusEnum.ENABLE })
  treeData.value = handleTree(result)
}
// 打开弹窗
const openModal = async (data?: string[] | number[]) => {
  if (data && data.length > 0) defaultCheckedKeys.value = data
  await init()
  modelVisible.value = true
}
defineExpose({ openModal }) // 提供 openModal 方法，用于打开弹窗

// 提交新增/修改的表单
const emit = defineEmits(['confirm']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  const checkedNodes = treeRef.value!.getCheckedNodes()
  if (props.mode === 'single') {
    if (checkedNodes.length === 0) return message.warning('请勾选')
    emit('confirm', checkedNodes[0])
  } else {
    emit(
      'confirm',
      checkedNodes.filter((item) => item.parentId !== 0)
    )
  }
  modelVisible.value = false
}
</script>
<style lang="scss" scoped></style>
