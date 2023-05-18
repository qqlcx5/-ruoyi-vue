<template>
  <!-- 弹窗 -->
  <XModal :title="modelTitle" v-model="modelVisible" width="530px">
    <el-form
      class="query-form w-full px-48px py-38px"
      ref="elFormRef"
      label-width="80"
      label-position="right"
    >
      <el-form-item label="分配角色" required>
        <div
          class="flex justify-between w-full min-h-32px leading-none border-1px rounded-4px p-10px cursor-pointer"
          @click="openSelectRoleModal"
        >
          <div class="flex flex-wrap -mb-8px">
            <div
              v-for="item in role"
              :key="item.roleId"
              class="flex items-center px-8px py-5px mr-8px mb-8px border-1px rounded-4px"
            >
              {{ item.roleName }}
              <i
                class="iconfont icon-guanbi !text-12px ml-8px cursor-pointer"
                @click.stop="delRoleItem(item.roleId)"
              ></i>
            </div>
          </div>
          <div><i class="iconfont icon-zhankai !text-12px"></i></div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <!-- 按钮：确认 -->
      <XButton type="primary" :title="t('action.save')" :loading="loading" @click="submitForm()" />
      <!-- 按钮：取消 -->
      <XButton :title="t('common.cancel')" @click="modelVisible = false" />
    </template>
  </XModal>
  <SelectRoleModal ref="selectRoleModalRef" @confirm="onRoleConfirm" />
</template>
<script setup lang="ts">
import { batchAssignUserRole } from '@/api/system/member'
import SelectRoleModal from '@/views/system/role/component/SelectRoleModal.vue'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

interface Role {
  roleId?: number | string
  roleName: string
}

// 弹窗相关的变量
const modelVisible = ref(false) // 是否显示弹出层
const loading = ref(false)
const modelTitle = ref('')
const memberList = ref<any[]>([])
const role = ref<Role[]>([])

const delRoleItem = (id: string) => {
  role.value = role.value.filter((item) => item.roleId !== id)
}
const onRoleConfirm = (data) => {
  role.value = data.map((item) => {
    return {
      roleId: item.id,
      roleName: item.name
    }
  })
}
// 打开角色弹窗
const selectRoleModalRef = ref()
const openSelectRoleModal = () => {
  selectRoleModalRef.value.openModal()
}

// 打开弹窗
const openModal = async (member) => {
  memberList.value = member
  modelTitle.value = '批量设角色'
  role.value = []
  modelVisible.value = true
}
defineExpose({ openModal }) // 提供 openModal 方法，用于打开弹窗

// 提交新增/修改的表单
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (role.value.length === 0) return message.warning('请完善分配角色内容')
  loading.value = true
  let params = {
    roleIds: role.value.map((i) => i.roleId),
    userIds: memberList.value
  }
  const result = await batchAssignUserRole(params).finally(() => (loading.value = false))
  if (result) {
    emit('success')
    message.success('设置角色成功')
    modelVisible.value = false
  }
}
</script>
<style lang="scss" scoped></style>
