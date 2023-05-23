<template>
  <!-- 弹窗 -->
  <XModal title="选择岗位" v-model="modelVisible" width="800px">
    <el-form
      class="query-form w-full"
      ref="elFormRef"
      :model="postInfoSearchForm"
      label-position="left"
    >
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="岗位名称">
            <el-input v-model="postInfoSearchForm.nameOrCode" placeholder="请输入岗位名称或编码" />
          </el-form-item>
        </el-col>
        <el-col v-if="!defaultPostType" :span="8">
          <el-form-item label="岗位类型">
            <el-select v-model="postInfoSearchForm.typeCode" placeholder="请选择岗位类型">
              <el-option
                v-for="item in postTypeOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
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
      <XButton type="primary" :title="t('common.confirmSelect')" @click="submitForm()" />
    </template>
  </XModal>
</template>
<script setup lang="ts">
import * as PostInfoApi from '@/api/system/post/info'
import { crudConfig } from './post.data'
import { listSimplePostsApi } from '@/api/system/post/type'
const { t } = useI18n() // 国际化
const props = defineProps({
  mode: {
    type: String,
    default: 'multipart' // multipart or single
  }
})

// 弹窗相关的变量
const modelVisible = ref(false) // 是否显示弹出层
const { allSchemas } = crudConfig(props.mode === 'single' ? 'radio' : 'checkbox')
const postTypeOptions = ref<any[]>([])
const defaultPostType = ref()

/* 岗位信息 */
const postInfoSearchForm = ref({
  nameOrCode: '',
  typeCode: ''
})
// 列表相关的变量
const [
  registerPostInfo,
  {
    reload: postInfoGet,
    getCheckboxRecords: getCheckboxRecords,
    getRadioRecord: getRadioRecord,
    setCheckboxRow,
    setRadioRow
  }
] = useXTable({
  allSchemas: allSchemas, // 列表配置
  params: postInfoSearchForm,
  getListApi: PostInfoApi.getPostPageApi, // 加载列表的 API
  deleteApi: PostInfoApi.deletePostApi, // 删除数据的 API
  exportListApi: PostInfoApi.exportPostApi, // 导出数据的 API
  checkboxConfig: { reserve: true, trigger: 'row' },
  radioConfig: { reserve: true, trigger: 'row' },
  border: true,
  height: 606,
  toolBar: false
})
// 查询重置
const onPostInfoSearchReset = () => {
  postInfoSearchForm.value = {
    nameOrCode: '',
    typeCode: defaultPostType.value ? postInfoSearchForm.value.typeCode : ''
  }
  postInfoGet()
}

// 打开弹窗
const openModal = async (defaultSelectRow?: any[], code?) => {
  if (code) {
    defaultPostType.value = code
    postInfoSearchForm.value.typeCode = code
  } else {
    postTypeOptions.value = await listSimplePostsApi()
  }
  modelVisible.value = true
  if (defaultSelectRow) {
    await nextTick()
    props.mode === 'single' ? setRadioRow(defaultSelectRow) : setCheckboxRow(defaultSelectRow)
  }
}
defineExpose({ openModal }) // 提供 openModal 方法，用于打开弹窗

// 提交新增/修改的表单
const emit = defineEmits(['confirm']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (props.mode === 'single') {
    emit('confirm', getRadioRecord())
  } else {
    emit('confirm', getCheckboxRecords())
  }
  modelVisible.value = false
}
</script>
<style lang="scss" scoped></style>
