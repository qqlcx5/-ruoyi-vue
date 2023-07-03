<template>
  <Dialog @confirm="handleConfirm">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="题目类型" prop="appraiseTopicType">
        <el-radio-group v-model="formData.appraiseTopicType" class="ml-4">
          <el-radio :label="1" size="large">单选题</el-radio>
          <el-radio :label="2" size="large">多选题</el-radio>
          <el-radio :label="3" size="large">输入题</el-radio>
          <el-radio :label="4" size="large">星选题</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="题目名称" prop="appraiseTopicTitle">
        <el-input
          v-model="formData.appraiseTopicTitle"
          placeholder="请输入题目名称"
          maxlength="100"
          :show-word-limit="true"
        />
      </el-form-item>

      <el-form-item label="所属分组" prop="appraiseTypeId">
        <el-select v-model="formData.appraiseTypeId" placeholder="请选择所属分组">
          <el-option
            v-for="(item, index) in groupList"
            :key="index"
            :label="item.appraiseTypeName"
            :value="item.appraiseTypeId"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="题目选项"
        v-if="formData.appraiseTopicType === 1 || formData.appraiseTopicType === 2"
      >
        <div style="display: flex; align-items: center">
          <el-tooltip placement="bottom" class="icon-tip">
            <template #content>
              <span> 为左上角显示的系统整体名称</span>
            </template>
            <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
          </el-tooltip>
          考虑到排版问题，选项最好不要超过3个</div
        >
        <el-table :data="formData.optionsList" style="width: 100%">
          <el-table-column prop="optionName" label="选项名称">
            <template #default="scope">
              <el-input
                v-model="scope.row.optionName"
                placeholder="请输入"
                maxlength="50"
                :show-word-limit="true"
              />
            </template>
          </el-table-column>
          <el-table-column prop="enableExplain" label="是否需要填写说明" width="150">
            <template #default="scope">
              <el-switch v-model="scope.row.enableExplain" :active-value="1" :inactive-value="0" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button link type="primary" @click="handleRowAdd()"> 新增 </el-button>
              <el-button link type="primary" @click="handleRowDel(scope.$index)"> 删除 </el-button>

              <el-button
                link
                type="primary"
                @click="handleRowGoTop(scope.$index)"
                v-if="scope.$index !== 0"
              >
                上移
              </el-button>
              <el-button
                link
                type="primary"
                @click="handleRowGoBottom(scope.$index)"
                v-if="formData.optionsList && scope.$index !== formData.optionsList.length - 1"
              >
                下移
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="最高星级" v-if="formData.appraiseTopicType === 4">
        <el-input v-model="formData.maxValue" style="width: 150px" />
        <span style="padding-left: 7px">最高可设置10级</span>
        <el-table :data="formData.optionsList" style="width: 100%">
          <el-table-column prop="optionRemark" label="选项星级">
            <template #default="scope">
              <el-rate v-model="scope.row.optionRemark" :max="10" disabled text-color="#ff9900" />
            </template>
          </el-table-column>
          <el-table-column prop="optionName" label="文本说明">
            <template #default="scope">
              <el-input
                v-model="scope.row.optionName"
                placeholder="请输入"
                maxlength="50"
                :show-word-limit="true"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        <el-tooltip placement="bottom" class="icon-tip">
          <template #content>
            <span> 为左上角显示的系统整体名称</span>
          </template>
          <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="是否匹配字段" prop="isTxt">
        <el-switch v-model="formData.matchStatus" :active-value="1" :inactive-value="0" />
        <el-tooltip placement="bottom" class="icon-tip">
          <template #content>
            <span> 为左上角显示的系统整体名称</span>
          </template>
          <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="匹配字段" prop="matchField">
        <el-select v-model="formData.matchField" placeholder="请选择">
          <el-option
            v-for="(item, index) in fieldList"
            :key="index"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </Dialog>
</template>
<script lang="ts" setup>
import { useGroup } from '../helpers'

const { t } = useI18n() // 国际化
// const message = useMessage() // 消息弹窗
const { getGroupData, groupList, getFieldData, fieldList } = useGroup()

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  appraiseTopicTitle: '',
  appraiseTopicType: 1,
  appraiseTypeId: null,
  optionsList: [
    {
      optionName: '',
      optionRemark: 0,
      enableExplain: false
    },
    {
      optionName: '',
      optionRemark: 0,
      enableExplain: false
    },
    {
      optionName: '',
      optionRemark: 0,
      enableExplain: false
    }
  ]
})
const formRules = reactive({
  appraiseTopicTitle: [{ required: true, message: '套餐名不能为空', trigger: 'blur' }],
  appraiseTypeId: [{ required: true, message: '所属分组不能为空', trigger: 'blur' }]
  // status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  // menuIds: [{ required: true, message: '关联的菜单编号不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const props = defineProps<{
  data: Recordable
}>()

const emits = defineEmits<{
  (e: 'commit', data: Recordable): void
}>()

/** 提交表单 */
// const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

/** 重置表单 */
const resetForm = () => {}

const handleRowAdd = () => {
  formData.value.optionsList.push({
    optionName: '',
    optionRemark: 0,
    enableExplain: false
  })
}
const handleRowDel = (index: number) => {
  formData.value.optionsList.splice(index, 1)
}
const swapArr = (arr, index1: number, index2: number) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}
const handleRowGoTop = (index: number) => {
  formData.value.optionsList = swapArr(formData.value.optionsList, index - 1, index)
}
const handleRowGoBottom = (index: number) => {
  formData.value.optionsList = swapArr(formData.value.optionsList, index, index + 1)
}

/** 确认 */
const handleConfirm = async () => {
  await formRef.value.validate()
  emits('commit', formData.value)
}

watch(
  () => formData.value.maxValue,
  (newVal) => {
    newVal = Number(newVal)

    if (typeof newVal === 'number' && newVal >= 0) {
      let result: any[] = []
      for (let i = 1; i <= newVal; i++) {
        result.push({ optionRemark: i, optionName: '' })
      }
      formData.value.optionsList = result
    }
  },
  { immediate: true }
)

watch(
  () => formData.value.appraiseTopicType,
  () => {
    if (formData.value.optionsList) {
      const len = formData.value.optionsList.length
      for (let i = 0; i < len; i++) {
        formData.value.optionsList[i].optionName = ''
      }
    }
  }
)

watch(formRef, (val) => {
  if (val) {
    formData.value = Object.assign(unref(formData), props.data)
  }
})

onMounted(async () => {
  await getGroupData()
  await getFieldData()
})
</script>
<style lang="scss" scoped></style>
