<template>
  <div class="edit-first-follow-rate-dialog">
    <el-dialog
      class="custom-dialog"
      :model-value="props.modelValue"
      title="新增"
      width="665px"
      :before-close="handleClose"
    >
      <el-form ref="formRef" :rules="rules" :model="ruleForm" label-width="110px">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input
            v-model.trim="ruleForm.ruleName"
            placeholder="请输入规则名称"
            maxlength="20"
            show-word-limit
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="适用门店" prop="applicableShopId">
          <el-cascader
            v-model="ruleForm.applicableShopId"
            :options="shopTreeList"
            :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
            filterable
            collapse-tags
            collapse-tags-tooltip
            clearable
            style="min-width: 240px"
          />
        </el-form-item>
        <el-form-item label="最低跟进率" prop="minFollowRate">
          <el-input-number
            v-model="ruleForm.minFollowRate"
            :controls="false"
            step-strictly
            :min="0"
            :max="100"
            :step="1"
            style="width: 180px"
          />
          <span class="ml-8px">%</span>
        </el-form-item>
        <el-form-item label="计算周期" prop="cycle">
          <el-input-number
            v-model="ruleForm.cycle"
            :controls="false"
            step-strictly
            :min="0"
            :step="1"
            style="width: 180px"
          />
          <span class="ml-8px">天</span>
        </el-form-item>
        <el-form-item label="参与规则岗位" prop="limitPositionTypeList" style="margin-bottom: 12px">
          <el-select
            v-model="ruleForm.limitPositionTypeList"
            multiple
            filterable
            clearable
            collapse-tags
            style="width: 180px"
          >
            <el-option
              v-for="item in postList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="checked-post">{{ checkedPostNames }}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  detailAssessRule,
  existFirstFollowRuleShop,
  firstFollowRateSave,
  firstFollowRateEdit
} from '@/api/clue/basicConfig'
import { listSimplePostsApi } from '@/api/system/post/info'
import { cloneDeep, difference } from 'lodash-es'
import { listToTree } from '@/utils/tree'
import type { FormInstance, FormRules } from 'element-plus'

const message = useMessage()

interface IProps {
  modelValue: boolean
  shopList: object[]
  curInfo: object
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  curInfo: () => ({})
})
interface IEmit {
  (event: 'update:modelValue', modelValue: boolean): void
  (event: 'success'): void
}
const emit = defineEmits<IEmit>()

const checkedList = ref<any[]>([])
const getExistRuleShop = async () => {
  const data = await existFirstFollowRuleShop()
  checkedList.value = data.map((d) => +d)
}

const postList = ref<object[]>([])
const getPostList = async () => {
  const data = await listSimplePostsApi()
  postList.value = data
}

const editFlag = ref<boolean>(false)
const shopTreeList = ref<object[]>([])
watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      console.log(ruleForm)
      const id = props.curInfo['id']
      editFlag.value = !!id
      getPostList()
      Promise.all([getExistRuleShop(), id && getInfo(id)]).then(() => {
        const list = cloneDeep(props.shopList)
        const ids: string[] = ruleForm.applicableShopId
        checkedList.value = difference(checkedList.value, ids).map((d) => +d)
        list.forEach((item: object) => {
          item['disabled'] = checkedList.value.includes(item['id'])
        })
        shopTreeList.value = listToTree(list, { pid: 'parentId' })
      })
    } else {
      ruleForm = reactive(_form)
      formRef.value?.resetFields()
    }
  }
)

const formRef = ref<FormInstance>()
let ruleForm = reactive<any>({
  ruleName: '', // 规则名称
  applicableShopId: [], // 适用门店
  minFollowRate: null, // 最低跟进率
  cycle: null, // 周期
  limitPositionTypeList: [] // 参与规则岗位
})
const _form = cloneDeep(ruleForm)
const rules: FormRules = reactive<FormRules>({
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  applicableShopId: [{ required: true, message: '请选择适用门店', trigger: 'change' }],
  minFollowRate: [{ required: true, message: '请输入最低跟进率', trigger: 'blur' }],
  cycle: [{ required: true, message: '请输入计算周期', trigger: 'blur' }],
  limitPositionTypeList: [{ required: true, message: '请选择参与规则岗位', trigger: 'change' }]
})

const checkedPostNames = computed(() => {
  const list = ruleForm.limitPositionTypeList.reduce((arr, id) => {
    const obj = unref(postList).find((d) => d['id'] === id)
    obj && arr.push(obj['name'])
    return arr
  }, [])
  return list.join('；')
})

const loading = ref<boolean>(false)
const getInfo = async (id) => {
  try {
    loading.value = true
    const data = await detailAssessRule({ id })
    data.applicableShopId = data?.applicableShopId.split(',') || []
    data.applicableShopId = data.applicableShopId.map((d) => +d)
    ruleForm = reactive(data)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  formRef.value?.validate(async (vali) => {
    if (vali) {
      const params = cloneDeep(ruleForm)
      params.applicableShopId = params.applicableShopId.join(',')
      unref(editFlag) ? await firstFollowRateEdit(params) : await firstFollowRateSave(params)
      message.success('提交成功')
      emit('success')
      handleClose()
    }
  })
}
</script>

<style lang="scss">
.edit-first-follow-rate-dialog {
  @import '../../style/index';
  .checked-post {
    line-height: 20px;
    font-size: 14px;
    color: #1989fa;
  }
}
</style>
