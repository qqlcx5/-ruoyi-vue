<template>
  <!-- 弹窗 -->
  <XModal title="选择岗位" v-model="modelVisible" width="800px">
    <el-form class="query-form w-full" ref="elFormRef" :model="postInfoSearchForm" label-position="left">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="岗位类型">
            <el-input v-model="postInfoSearchForm.name" placeholder="请输入岗位名称"  />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="岗位名称">
            <el-input v-model="postInfoSearchForm.name" placeholder="请输入岗位名称"  />
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
      <XButton
        type="primary"
        :title="t('common.ok')"
        @click="submitForm()"
      />
    </template>
  </XModal>
</template>
<script setup lang="ts">
import * as PostInfoApi from '@/api/system/post/info'
import {allSchemas as infoAllSchemas} from "./post.data";
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

// 弹窗相关的变量
const modelVisible = ref(false) // 是否显示弹出层

/* 岗位信息 */
const postInfoSearchForm = ref({
  name: '',
  status: '',
  typeCode: '',
})
// 列表相关的变量
const [registerPostInfo, { reload: postInfoGet, getCheckboxRecords: getCheckboxRecords }] = useXTable({
  allSchemas: infoAllSchemas, // 列表配置
  params: postInfoSearchForm,
  getListApi: PostInfoApi.getPostPageApi, // 加载列表的 API
  deleteApi: PostInfoApi.deletePostApi, // 删除数据的 API
  exportListApi: PostInfoApi.exportPostApi, // 导出数据的 API
  border: true,
  height: 606,
  toolBar: false
})
// 查询重置
const onPostInfoSearchReset = () => {
  postInfoSearchForm.value = {
    name: '',
    status: '',
    typeCode: '',
  };
  postInfoGet();
}

// 打开弹窗
const openModal = async (code) => {
  postInfoSearchForm.value.typeCode = code
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
