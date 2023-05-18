<template>
  <!-- 弹窗 -->
  <XModal title="选择角色" v-model="modelVisible" width="800px">
    <el-form
      class="query-form w-full"
      ref="elFormRef"
      :model="postInfoSearchForm"
      label-position="left"
    >
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="角色名称">
            <el-input v-model="postInfoSearchForm.name" placeholder="请输入岗位名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8" class="!flex flex-column justify-between">
          <div>
            <el-button type="primary" @click="postInfoGet">查询</el-button>
            <el-button @click="onPostInfoSearchReset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- 列表 -->
    <XTable @register="registerPostInfo">
      <template #toolbar_buttons></template>
      <!--      <template #actionbtns_default></template>-->
    </XTable>

    <template #footer>
      <!-- 按钮：取消 -->
      <XButton :title="t('common.cancel')" @click="modelVisible = false" />
      <!-- 按钮：确认 -->
      <XButton type="primary" :title="t('common.ok')" @click="submitForm()" />
    </template>
  </XModal>
</template>
<script setup lang="ts">
import * as RoleApi from '@/api/system/role'
import { allSchemas } from './role.data'
const { t } = useI18n() // 国际化

// 弹窗相关的变量
const modelVisible = ref(false) // 是否显示弹出层

/* 岗位信息 */
const postInfoSearchForm = ref({
  name: ''
})
// 列表相关的变量
const [registerPostInfo, { reload: postInfoGet, getCheckboxRecords: getCheckboxRecords }] =
  useXTable({
    allSchemas: allSchemas, // 列表配置
    params: postInfoSearchForm,
    getListApi: RoleApi.getRolePageApi, // 加载列表的 API
    border: true,
    height: 606
  })
// 查询重置
const onPostInfoSearchReset = () => {
  postInfoSearchForm.value = {
    name: ''
  }
  postInfoGet()
}

// 打开弹窗
const openModal = async () => {
  modelVisible.value = true
}
defineExpose({ openModal }) // 提供 openModal 方法，用于打开弹窗

// 提交新增/修改的表单
const emit = defineEmits(['confirm']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  emit('confirm', getCheckboxRecords())
  modelVisible.value = false
}
</script>
<style lang="scss" scoped></style>
