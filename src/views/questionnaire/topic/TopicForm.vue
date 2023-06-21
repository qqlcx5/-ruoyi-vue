<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" style="min-width: 682px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="题目类型" prop="type">
        <el-radio-group v-model="formData.type" class="ml-4">
          <el-radio label="1" size="large">单选题</el-radio>
          <el-radio label="2" size="large">多选题</el-radio>
          <el-radio label="3" size="large">输入题</el-radio>
          <el-radio label="4" size="large">星选题</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="题目名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入题目名称"
          maxlength="100"
          :show-word-limit="true"
        />
      </el-form-item>

      <el-form-item label="所属分组" prop="fenzu">
        <el-select v-model="formData.fenzu" placeholder="请选择所属分组">
          <el-option :label="1" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="题目选项" v-if="formData.type === '1' || formData.type === '2'">
        <div style="display: flex; align-items: center">
          <el-tooltip placement="bottom" class="icon-tip">
            <template #content>
              <span> 为左上角显示的系统整体名称</span>
            </template>
            <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
          </el-tooltip>
          考虑到排版问题，选项最好不要超过3个</div
        >
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="选项名称">
            <template #default="scope">
              <el-input
                v-model="scope.row.name"
                placeholder="请输入"
                maxlength="50"
                :show-word-limit="true"
              />
            </template>
          </el-table-column>
          <el-table-column prop="is" label="是否需要填写说明" width="150">
            <template #default="scope">
              <el-switch v-model="scope.row.is" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button link type="primary" @click="handleRowAdd(scope.row)"> 新增 </el-button>
              <el-button link type="primary" @click="handleRowDel(scope.row)"> 删除 </el-button>

              <el-button
                link
                type="primary"
                @click="handleRowGoTop(scope.row)"
                v-if="scope.$index !== 0"
              >
                上移
              </el-button>
              <el-button
                link
                type="primary"
                @click="handleRowGoBottom(scope.row)"
                v-if="scope.$index !== tableData.length - 1"
              >
                下移
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="最高星级" v-if="formData.type === '4'">
        <el-input v-model="formData.star" style="width: 150px" />
        <span style="padding-left: 7px">最高可设置10级</span>
        <el-table :data="tableDataStar" style="width: 100%">
          <el-table-column label="选项星级">
            <template #default="scope">
              <el-rate v-model="scope.row.star" :max="10" disabled text-color="#ff9900" />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="文本说明">
            <template #default="scope">
              <el-input
                v-model="scope.row.remark"
                placeholder="请输入"
                maxlength="50"
                :show-word-limit="true"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="formData.status" /><el-tooltip placement="bottom" class="icon-tip">
          <template #content>
            <span> 为左上角显示的系统整体名称</span>
          </template>
          <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="是否匹配字段" prop="isTxt">
        <el-switch v-model="formData.is" /><el-tooltip placement="bottom" class="icon-tip">
          <template #content>
            <span> 为左上角显示的系统整体名称</span>
          </template>
          <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="匹配字段" prop="ziduan">
        <el-select v-model="formData.ziduan" placeholder="请选择">
          <el-option :label="1" :value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
const { t } = useI18n() // 国际化
// const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: null,
  type: '1',
  star: 3
})
const formRules = reactive({
  name: [{ required: true, message: '套餐名不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  menuIds: [{ required: true, message: '关联的菜单编号不能为空', trigger: 'blur' }]
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

/** 提交表单 */
// const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {}

/** 重置表单 */
const resetForm = () => {}

const tableData = ref([
  {
    name: '',
    is: false
  },
  {
    name: '',
    is: false
  },
  {
    name: '',
    is: false
  }
])
const handleRowAdd = () => {}
const handleRowDel = () => {}
const handleRowGoTop = () => {}
const handleRowGoBottom = () => {}

const tableDataStar = ref([{}])
watch(
  () => formData.value.star,
  (newVal) => {
    newVal = Number(newVal)
    if (typeof newVal === 'number' && newVal >= 0) {
      let result: any[] = []
      for (let i = 1; i < newVal; i++) {
        result.push({ star: i, remark: '' })
      }
      tableDataStar.value = [...result]
    }
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped></style>
