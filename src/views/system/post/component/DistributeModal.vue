<template>
  <!-- 弹窗 -->
  <XModal :title="modelTitle" v-model="modelVisible" width="530px">
    <el-form
      class="query-form w-full px-48px py-38px"
      ref="elFormRef"
      label-width="80"
      label-position="right"
    >
      <el-form-item label="岗位" required>
        <div
          class="flex justify-between w-full min-h-32px leading-none border-1px rounded-4px p-10px cursor-pointer"
          @click="openSelectPostModal"
        >
          <div class="flex flex-wrap -mb-8px">
            <div
              v-for="item in post"
              :key="item.id"
              class="flex items-center px-8px py-5px mr-8px mb-8px border-1px rounded-4px"
            >
              {{ item.name }}
              <i
                v-if="operateMode === 'multi'"
                class="iconfont icon-guanbi !text-12px ml-8px cursor-pointer"
                @click.stop="delPostItem(item.id)"
              ></i>
            </div>
          </div>
          <div v-if="operateMode === 'multi'"><i class="iconfont icon-zhankai !text-12px"></i></div>
        </div>
      </el-form-item>
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
      <XButton type="primary" :title="t('action.save')" @click="submitForm()" />
      <!-- 按钮：取消 -->
      <XButton :title="t('common.cancel')" @click="modelVisible = false" />
    </template>
  </XModal>
  <SelectPostModal ref="selectPostModalRef" @confirm="onPostConfirm" />
  <SelectRoleModal ref="selectRoleModalRef" @confirm="onRoleConfirm" />
</template>
<script setup lang="ts">
import SelectPostModal from './SelectPostModal.vue'
import * as PostInfoApi from '@/api/system/post/info'
import SelectRoleModal from '@/views/system/role/component/SelectRoleModal.vue'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

interface Post {
  id?: number | string
  name: string
}
interface Role {
  roleId?: number | string
  roleName: string
}

// 弹窗相关的变量
const operateMode = ref()
const operateTypeCode = ref('')
const modelVisible = ref(false) // 是否显示弹出层
const modelTitle = ref('') // 是否显示弹出层
const post = ref<Post[]>([])
const role = ref<Role[]>([])

const delPostItem = (id: string) => {
  post.value = post.value.filter((item) => item.id !== id)
}
const delRoleItem = (id: string) => {
  role.value = role.value.filter((item) => item.roleId !== id)
}
const onPostConfirm = (data) => {
  post.value = data
}
const onRoleConfirm = (data) => {
  role.value = data.map((item) => {
    return {
      roleId: item.id,
      roleName: item.name
    }
  })
}

// 打开岗位弹窗
const selectPostModalRef = ref()
const openSelectPostModal = () => {
  if (operateMode.value === 'single') return
  selectPostModalRef.value.openModal(operateTypeCode.value)
}

// 打开岗位弹窗
const selectRoleModalRef = ref()
const openSelectRoleModal = () => {
  selectRoleModalRef.value.openModal()
}

// 打开弹窗
const openModal = async (row, mode: string, typeCode) => {
  operateTypeCode.value = typeCode
  operateMode.value = mode
  if (mode === 'single') {
    modelTitle.value = '分配角色'
    post.value = [{ name: row.name, id: row.id }]
    role.value = row.roleList || []
  } else if (mode === 'multi') {
    modelTitle.value = '批量分配角色'
    post.value = row.map((item) => {
      return { name: item.name, id: item.id }
    })
    role.value = []
  }
  modelVisible.value = true
}
defineExpose({ openModal }) // 提供 openModal 方法，用于打开弹窗

// 提交新增/修改的表单
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (post.value.length === 0 || role.value.length === 0)
    return message.warning('请完善分配角色内容')
  let params = {
    postIds: post.value.map((i) => i.id),
    roleIds: role.value.map((i) => i.roleId),
    status: 0
  }
  const result = await PostInfoApi.batchPostRoleApi(params)
  console.log(result)
  emit('success')
  modelVisible.value = false
}
</script>
<style lang="scss" scoped></style>
