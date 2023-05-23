<template>
  <!-- 弹窗 -->
  <XModal title="批量转岗" v-model="modelVisible" width="500px">
    <div class="p-20px">
      <div>请选择已勾选的{{ memberList.length }}个成员的主岗信息：</div>
      <el-form
        class="query-form w-full pt-20px"
        ref="elFormRef"
        label-width="120"
        label-position="left"
      >
        <el-form-item label="主岗所属部门" required>
          <el-input
            v-model="organization.name"
            placeholder="请选择部门，单选"
            readonly
            @focus="openOrgModal"
          />
        </el-form-item>
        <el-form-item label="主岗位" required>
          <el-input
            v-model="post.name"
            placeholder="请选择岗位，单选"
            readonly
            @focus="openPostModal"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <!-- 按钮：确认 -->
      <XButton type="primary" :title="t('common.ok')" :loading="loading" @click="submitForm()" />
      <!-- 按钮：取消 -->
      <XButton :title="t('common.cancel')" @click="modelVisible = false" />
    </template>
  </XModal>
  <SelectOrgModal ref="selectOrgModalRef" mode="single" @confirm="onSelectOrgConfirm" />
  <SelectPostModal ref="selectPostModalRef" mode="single" @confirm="onSelectPostConfirm" />
</template>
<script setup lang="ts">
import { batchPostAdjustment } from '@/api/system/member'
import SelectOrgModal from '../../organization/components/SelectOrgModal.vue'
import SelectPostModal from '../../post/component/SelectPostModal.vue'

const { t } = useI18n() // 国际化
const message = useMessage()

// 弹窗相关的变量
const modelVisible = ref(false) // 是否显示弹出层
const loading = ref(false)
const memberList = ref<any[]>([])
const organization = ref({ id: '' })
const post = ref({ id: '' })
const selectOrgModalRef = ref()
const selectPostModalRef = ref()

// 打开弹窗
const openModal = async (member: any[]) => {
  memberList.value = member
  modelVisible.value = true
}
defineExpose({ openModal }) // 提供 openModal 方法，用于打开弹窗

const openOrgModal = () => {
  selectOrgModalRef.value.openModal([organization.value.id])
}
const onSelectOrgConfirm = (data) => {
  organization.value = data
}
const openPostModal = () => {
  selectPostModalRef.value.openModal({ id: post.value.id })
}
const onSelectPostConfirm = (data) => {
  post.value = data
}

// 提交新增/修改的表单
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (!organization.value.id || !post.value.id) return message.warning('请填写完整内容')
  loading.value = true
  let params = {
    organizationId: organization.value.id,
    postId: post.value.id,
    userIdList: memberList.value
  }
  const result = await batchPostAdjustment(params).finally(() => (loading.value = false))
  if (result) {
    emit('success')
    message.success('转岗成功')
    modelVisible.value = false
  }
}
</script>
<style lang="scss" scoped>
.input-box {
  border-color: $divider-color;
}
</style>
