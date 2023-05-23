<template>
  <!-- 弹窗 -->
  <XModal title="选择成员" v-model="modelVisible" width="1168px">
    <el-form class="query-form w-full" ref="elFormRef" label-position="left">
      <el-row :gutter="12">
        <el-col :span="5">
          <el-form-item label="成员">
            <el-input v-model="searchForm.nameOrNumber" placeholder="请输入员工姓名或工号" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="部门">
            <el-tree-select
              v-model="searchForm.component"
              :data="treeData"
              :props="{
                children: 'children',
                label: 'name',
                value: 'component'
              }"
              check-strictly
              placeholder="请选择部门"
              :render-after-expand="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="岗位类型">
            <el-select v-model="searchForm.postTypeCode" placeholder="请选择岗位类型">
              <el-option
                v-for="item in postOptions"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="岗位">
            <el-input v-model="searchForm.postName" placeholder="请输入岗位" />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="!flex flex-column justify-between">
          <div>
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button @click="onSearchReset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- 列表 -->
    <XTable @register="registerPostInfo">
      <template #toolbar_buttons></template>
      <template #department_post="{ row }">
        <div v-for="item in row.postVOList" :key="item.id">
          <div>
            {{ item.componentName }}/{{ item.postName }}
            <el-tag :type="item.type === 'main_post' ? 'success' : 'warning'">{{
              getDictLabel(DICT_TYPE.POST_TYPE, item.type)
            }}</el-tag>
          </div>
        </div>
      </template>
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
import { getMemberList } from '@/api/system/member'
import { crudConfig } from './member.data'
import { listSimplePostsApi } from '@/api/system/post/type'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { getSimpleOrganizationList } from '@/api/system/organization'
import { handleTree } from '@/utils/tree'
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
const postOptions = ref<any>([])
const treeData = ref<any[]>([])
/* 岗位信息 */
const searchForm = ref({
  nameOrNumber: '',
  component: '',
  postTypeCode: '',
  postName: ''
})

const [
  registerPostInfo,
  {
    reload: getList,
    getCheckboxRecords: getCheckboxRecords,
    getRadioRecord: getRadioRecord,
    setCheckboxRow
  }
] = useXTable({
  allSchemas: allSchemas, // 列表配置
  params: searchForm,
  getListApi: getMemberList, // 加载列表的 API
  checkboxConfig: { reserve: true, trigger: 'row' },
  // mouseConfig: { selected: true },
  border: true,
  height: 606,
  toolbarConfig: { slots: { buttons: 'toolbar_buttons' } }
})
// 查询重置
const onSearchReset = () => {
  searchForm.value = {
    nameOrNumber: '',
    component: '',
    postTypeCode: '',
    postName: ''
  }
  getList()
}

// 打开弹窗
const openModal = async (defaultRowKey) => {
  // console.log(defaultRowKey)
  await init()
  modelVisible.value = true
  await nextTick()
  if (defaultRowKey) {
    setCheckboxRow(defaultRowKey)
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

// 初始化
const init = async () => {
  const result = await getSimpleOrganizationList({})
  treeData.value = handleTree(result)
  postOptions.value = await listSimplePostsApi()
}

onMounted(() => {
  // init()
})
</script>
<style lang="scss" scoped></style>
