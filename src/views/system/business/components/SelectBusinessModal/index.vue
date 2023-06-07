<template>
  <!-- 弹窗 -->
  <XModal title="选择经销商" v-model="modelVisible" width="508px">
    <div class="h-full grid grid-cols-2">
      <el-tree
        class="px-6px py-10px max-h-560px"
        ref="treeRef"
        node-key="id"
        show-checkbox
        highlight-current
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
        :data="treeData"
        @check="onTreeCheck"
      />
      <div class="selected-info">
        <div class="info-title">已选择信息</div>
        <el-tree
          class="py-6px max-h-560px"
          ref="selectTreeRef"
          node-key="id"
          highlight-current
          default-expand-all
          :props="defaultProps"
          :data="selectedBusinessData"
        />
      </div>
    </div>

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
import { getListDealerStore } from '@/api/system/business'
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
  selectedBusinessData.value = handleTree(
    [...unref(list.checkedNodes), ...unref(list.halfCheckedNodes)],
    'id',
    'belongTenantId'
  )
  if (props.mode === 'single') {
    if (list.checkedKeys.length === 2) treeRef.value!.setCheckedKeys([node.id])
  }
}
const setSelectedData = () => {
  nextTick(() => {
    selectedBusinessData.value = treeRef.value!.getCheckedNodes(true, true)
  })
}

// ----------已选信息---------
const selectedBusinessData = ref()

const init = async () => {
  const result = await getListDealerStore()
  treeData.value = [...handleTree(result, 'id', 'belongTenantId')]
  setSelectedData()
}
// 打开弹窗
const openModal = async (ids?: string[] | number[]) => {
  if (ids && ids.length > 0) defaultCheckedKeys.value = ids
  modelVisible.value = true
  await init()
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
      checkedNodes.filter((item) => item.type),
      checkedNodes.filter((item) => !item.type)
    )
  }
  modelVisible.value = false
}
</script>
<style lang="scss" scoped>
.selected-info {
  padding-left: 16px;
  border-left: 1px solid $divider-color;

  .info-title {
    font-weight: bold;
  }
}

:deep(.vxe-modal--content .el-scrollbar__view) {
  height: 100% !important;
}
</style>
