<template>
  <!-- 弹窗 -->
  <XModal :title="modelTitle" :loading="modelLoading" v-model="modelVisible" width="624px">
    <!-- 表单：添加/修改 -->
    <el-table v-if="postTableType === 'type'" class="form-table" :data="postTypeTableData" border>
      <el-table-column label="岗位类型编码">
        <template #default="{ row }">
          <el-input v-model="row.code" />
        </template>
      </el-table-column>
      <el-table-column label="岗位类型">
        <template #default="{ row }">
          <el-input v-model="row.name" />
        </template>
      </el-table-column>
      <el-table-column v-if="actionType !== 'update'" label="操作" width="180">
        <template #default="scope">
          <XTextButton :title="t('action.create')" @click="addPostTypeLine" />
          <XTextButton :title="t('action.del')" @click="delPostTypeLine(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 表单：添加/修改 -->
    <el-table
      v-else-if="postTableType === 'info'"
      class="form-table"
      :data="postTypeTableData"
      border
    >
      <el-table-column label="岗位名称">
        <template #default="{ row }">
          <el-input v-model="row.name" />
        </template>
      </el-table-column>
      <el-table-column label="岗位编码">
        <template #default="{ row }">
          <el-input v-model="row.code" />
        </template>
      </el-table-column>
      <el-table-column label="岗位类型">
        <template #default="{ row }">
          <el-select v-model="row.typeCode">
            <el-option
              v-for="item in postTypeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-switch v-model="row.status" :active-value="0" :inactive-value="1" />
        </template>
      </el-table-column>
      <el-table-column v-if="actionType !== 'update'" label="操作">
        <template #default="scope">
          <XTextButton :title="t('action.create')" @click="addPostTypeLine" />
          <XTextButton :title="t('action.del')" @click="delPostTypeLine(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <!-- 按钮：保存 -->
      <XButton
        v-if="['create', 'update'].includes(actionType)"
        type="primary"
        :title="t('action.save')"
        :loading="actionLoading"
        @click="submitForm()"
      />
      <!-- 按钮：关闭 -->
      <XButton :loading="actionLoading" :title="t('dialog.close')" @click="modelVisible = false" />
    </template>
  </XModal>
</template>
<script setup lang="ts">
import * as PostApi from '@/api/system/post/type'
import * as PostInfoApi from '@/api/system/post/info'
import { PostInfoVO } from '@/api/system/post/info'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

// 弹窗相关的变量
const modelVisible = ref(false) // 是否显示弹出层
const modelTitle = ref('') // 弹出层标题
const modelLoading = ref(false) // 弹出层loading
const actionType = ref('') // 操作按钮的类型
const actionLoading = ref(false) // 按钮 Loading
const postTableType = ref('') // 表格类型
const postTypeOptions = ref([]) // 岗位类型列表

// 打开弹窗
const openModal = async (type: string, tableType: string, id?: number) => {
  modelVisible.value = true
  modelLoading.value = true
  modelTitle.value = t('action.' + type)
  actionType.value = type
  postTableType.value = tableType

  if (postTableType.value === 'type') {
    // 设置数据
    if (id) {
      const res = await PostApi.getPostApi(id)
      if (!res) {
        message.warning('信息查询异常！')
        modelLoading.value = false
        return
      }
      if (type === 'update') {
        const { id, code, name, status } = res
        postTypeTableData.value = [{ id, code, name, status }]
      }
    } else {
      postTypeTableData.value = [{ code: '', name: '', status: 0 }]
    }
  } else if (postTableType.value === 'info') {
    getPostTypeOptions()
    if (id) {
      const res = await PostInfoApi.getPostApi(id)
      if (!res) {
        message.warning('信息查询异常！')
        modelLoading.value = false
        return
      }
      if (type === 'update') {
        const { id, code, name, status, typeCode } = res
        postTypeTableData.value = [{ id, code, name, status, typeCode }]
      }
    } else {
      postTypeTableData.value = [{ code: '', name: '', status: 0, typeCode: '' }]
    }
  }
  modelLoading.value = false
}
defineExpose({ openModal }) // 提供 openModal 方法，用于打开弹窗

// 获取岗位类型列表
const getPostTypeOptions = async () => {
  const res = await PostApi.listSimplePostsApi()
  postTypeOptions.value = res
}

// 岗位类型table
const postTypeTableData = ref<PostApi.PostVO[] | PostInfoVO[]>([
  { code: '', name: '', status: 0, typeCode: '' }
])
const addPostTypeLine = (): void => {
  postTypeTableData.value.push({ code: '', name: '', status: 0, typeCode: '' })
}
const delPostTypeLine = (index: number): void => {
  if (postTypeTableData.value.length === 1)
    return message.warning(
      `至少要有一行新增岗位${postTableType.value === 'type' ? '类型' : '信息'}！`
    )
  postTypeTableData.value.splice(index, 1)
}

// 提交新增/修改的表单
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!tableFormValidate()) return message.warning('内容填写不完整！')
  // 提交请求
  actionLoading.value = true
  try {
    if (postTableType.value === 'type') {
      if (actionType.value === 'create') {
        await PostApi.batchCreatePostApi({ postTypelist: postTypeTableData.value })
        message.success(t('common.createSuccess'))
      } else if (actionType.value === 'update') {
        await PostApi.updatePostApi(postTypeTableData.value[0])
        message.success(t('common.updateSuccess'))
      }
    } else if (postTableType.value === 'info') {
      if (actionType.value === 'create') {
        await PostInfoApi.batchCreatePostApi({ postCreateList: postTypeTableData.value })
        message.success(t('common.createSuccess'))
      } else if (actionType.value === 'update') {
        await PostInfoApi.updatePostApi(postTypeTableData.value[0])
        message.success(t('common.updateSuccess'))
      }
    }
    modelVisible.value = false
    emit('success', postTableType.value)
  } finally {
    actionLoading.value = false
  }
}
const tableFormValidate = (): boolean => {
  if (postTableType.value === 'type') {
    return !postTypeTableData.value.some((i) => i.code === '' || i.name === '')
  } else {
    return !postTypeTableData.value.some((i) => i.code === '' || i.name === '' || i.typeCode === '')
  }
}
</script>
<style lang="scss" scoped>
.form-table {
  &:deep(th.el-table__cell) {
    background-color: var(--table-bg-color);
  }
}
</style>
