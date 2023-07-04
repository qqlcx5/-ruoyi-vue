<template>
  <Dialog
    v-model="dialogVisible"
    :title="'回访计划规则'"
    width="860px"
    :close-on-click-modal="false"
    @confirm="confirm"
    @cancel="cancel"
    @close="cancel"
    :confirmLoading="formOptions.confirmLoading"
  >
    <div class="visit-rule-item">
      <el-form ref="formRef" :model="ruleObject" :rules="rules">
        <div class="item-header flex items-center justify-between">
          <div class="flex items-center">
            <el-form-item prop="visitSettingType" class="required">
              <el-select
                v-model="ruleObject.visitSettingType"
                placeholder="请选择回访类型"
                class="w-180px flex-shrink-0"
                :disabled="isEdit"
              >
                <el-option
                  v-for="item in formOptions.type"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="visitSettingPurpose" class="required ml-12px">
              <el-input
                v-model="ruleObject.visitSettingPurpose"
                placeholder="请填写回访目的"
                class="w-180px"
              />
            </el-form-item>
          </div>
          <div>
            <el-switch
              v-model="ruleObject.visitFlag"
              :active-value="1"
              :inactive-value="0"
              :disabled="isEdit"
            />
          </div>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center required">参考时间(T）</div>
            </template>
            <el-form-item prop="originTimeType" required>
              <el-select
                v-model="ruleObject.originTimeType"
                placeholder="请选择"
                class="w-200px"
                :disabled="isEdit"
              >
                <el-option
                  v-for="item in formOptions.originTimeType"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center required">一般逾期时间</div>
            </template>

            <el-form-item prop="extInfo.overdueGeneral">
              N+
              <el-input-number
                v-model.number="ruleObject.extInfo.overdueGeneral"
                :controls="false"
                :disabled="isEdit"
              />
              min
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center required">生成时间</div>
            </template>
            <el-form-item prop="extInfo.advanceDays">
              T+
              <el-input-number
                v-model="ruleObject.extInfo.advanceDays"
                :controls="false"
                :disabled="isEdit"
              />
              天
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center required">
                严重逾期时间
                <el-tooltip effect="dark" content="严重逾期时间＞一般逾期时间">
                  <el-icon class="ml-4px"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-form-item prop="extInfo.overdueSerious">
              N+
              <el-input-number
                v-model="ruleObject.extInfo.overdueSerious"
                :controls="false"
                :disabled="isEdit"
              />
              min
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center required">
                计划回访时间(N)
                <el-tooltip effect="dark" content="生成时间≤计划回访时间">
                  <el-icon class="ml-4px"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-form-item prop="visitLimitDay">
              T+
              <el-input-number
                v-model="ruleObject.visitLimitDay"
                :controls="false"
                :disabled="isEdit"
              />
              天
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center">
                00:00开始计算逾期
                <el-tooltip
                  effect="dark"
                  content="开启：00:00开始计算逾期，关闭：计划开始时间后立刻开始计算逾期"
                >
                  <el-icon class="ml-4px"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-switch
              v-model="ruleObject.overdueFlag"
              :active-value="1"
              :inactive-value="0"
              :disabled="isEdit"
            />
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center required">
                过期时间
                <el-tooltip effect="dark" content="过期时间＞计划回访时间">
                  <el-icon class="ml-4px"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-form-item prop="visitTimeoutDay">
              T+
              <el-input-number
                v-model="ruleObject.visitTimeoutDay"
                :controls="false"
                :disabled="isEdit"
              />
              天
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center">开启回收规则</div>
            </template>
            <el-switch
              v-model="ruleObject.recycleFlag"
              :active-value="1"
              :inactive-value="0"
              :disabled="isEdit"
            />
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center required">回访岗位</div>
            </template>
            <el-form-item prop="roleId"
              ><el-cascader
                v-model="ruleObject.roleId"
                :options="formOptions.postList"
                :props="{ label: 'name', value: 'id', emitPath: false }"
                filterable
                collapse-tags
                collapse-tags-tooltip
                clearable
                :disabled="isEdit"
            /></el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center required">
                回收时间
                <el-tooltip effect="dark" content="X＝计划回访时间/分配时间/转派时间">
                  <el-icon class="ml-4px"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-form-item prop="extInfo.overdueRecycle">
              X+
              <el-input-number
                v-model="ruleObject.extInfo.overdueRecycle"
                :controls="false"
                :disabled="isEdit"
              />
              min
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center required">分配岗位</div>
            </template>
            <el-form-item prop="distributeRoleIds"
              ><el-cascader
                ref="distributeRoleRef"
                v-model="ruleObject.distributeRoleIds"
                :options="formOptions.postList"
                :props="{
                  label: 'name',
                  value: 'id',
                  multiple: true,
                  emitPath: false
                }"
                filterable
                collapse-tags
                collapse-tags-tooltip
                clearable
                :disabled="isEdit"
                @change="onDistributeRoleChange('distributeRole')"
            /></el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center">不适用门店</div>
            </template>
            <el-form-item prop="shopDTOIds"
              ><el-cascader
                ref="shopDTORef"
                v-model="ruleObject.shopDTOIds"
                :options="formOptions.storeList"
                :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
                filterable
                collapse-tags
                collapse-tags-tooltip
                clearable
                @change="onDistributeRoleChange('shopDTO')"
            /></el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center required">回访对象</div>
            </template>
            <el-form-item prop="visitObject"
              ><el-select
                v-model="ruleObject.visitObject"
                placeholder="请选择"
                class="w-200px"
                :disabled="isEdit"
              >
                <el-option
                  v-for="item in formOptions.object"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                /> </el-select
            ></el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center">适用门店</div>
            </template>
            <el-form-item prop="applyShopDTOIds"
              ><el-cascader
                ref="applyShopDTORef"
                v-model="ruleObject.applyShopDTOIds"
                :options="formOptions.storeList"
                :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
                filterable
                collapse-tags
                collapse-tags-tooltip
                clearable
                @change="onDistributeRoleChange('applyShopDTO')"
            /></el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label-align="left">
            <template #label>
              <div class="flex items-center">回访人员列表</div>
            </template>
            <el-form-item prop="visitUserDTOIds"
              ><el-cascader
                ref="visitUserDTORef"
                v-model="ruleObject.visitUserDTOIds"
                :options="formOptions.userList"
                :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
                filterable
                collapse-tags
                collapse-tags-tooltip
                clearable
                class="w-200px"
                @change="onDistributeRoleChange('visitUserDTO')"
            /></el-form-item>
          </el-descriptions-item>
        </el-descriptions>
      </el-form>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { FormInstance } from 'element-plus'
import {
  getVisitTypeList,
  getOriginTimeTypeList,
  updateVisitSetting,
  visitBatchAdd
} from '@/api/visit'
import { QuestionFilled } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
import { getIntDictOptions } from '@/utils/dict'
import { useCommonList } from '@/hooks/web/useCommonList'

const message = useMessage()
const { getPostList, getSuitableShopList, getUserMemberList } = useCommonList()

const emits = defineEmits(['success'])
const dialogVisible = ref<boolean>(false)
const ruleEmptyObject = ref()
const distributeRoleRef = ref()
const shopDTORef = ref()
const applyShopDTORef = ref()
const visitUserDTORef = ref()
const ruleObject = ref<any>({
  visitSettingType: '',
  visitSettingPurpose: '',
  roleId: '',
  roleName: '',
  visitLimitDay: '',
  visitPurposeReasons: '',
  originTimeType: '',
  visitObject: '',
  overdueFlag: 0,
  visitFlag: 0,
  recycleFlag: 0,
  extInfo: {
    advanceDays: '',
    overdueGeneral: '',
    overdueSerious: '',
    overdueRecycle: ''
  },
  visitTimeoutDay: '',
  distributeRoleIds: [], // 分配岗位
  distributeRoleList: [],
  shopDTOIds: [],
  shopDTOList: [],
  applyShopDTOIds: [],
  applyShopDTOList: [],
  visitUserDTOIds: [],
  visitUserDTOList: []
})
const formOptions = reactive({
  confirmLoading: false,
  type: [], // 类型
  object: getIntDictOptions('visit_object'), // 对象
  originTimeType: [], // 参考时间
  postList: getPostList(),
  storeList: getSuitableShopList(),
  userList: getUserMemberList()
})
const formRef = ref<FormInstance>()
const rules = reactive({
  visitSettingType: [{ required: true, message: '', trigger: 'blur' }],
  visitSettingPurpose: [{ required: true, message: '', trigger: 'blur' }],
  originTimeType: [{ required: true, message: '', trigger: 'blur' }],
  'extInfo.overdueGeneral': [{ required: true, message: '', trigger: 'blur' }],
  'extInfo.advanceDays': [{ required: true, message: '', trigger: 'blur' }],
  'extInfo.overdueSerious': [{ required: true, message: '', trigger: 'blur' }],
  visitLimitDay: [{ required: true, message: '', trigger: 'blur' }],
  visitTimeoutDay: [{ required: true, message: '', trigger: 'blur' }],
  roleId: [{ required: true, message: '', trigger: 'blur' }],
  'extInfo.overdueRecycle': [{ required: true, message: '', trigger: 'blur' }],
  distributeRoleIds: [{ required: true, message: '', trigger: 'blur' }],
  visitObject: [{ required: true, message: '', trigger: 'blur' }]
  // visitUserDTOIds: [{ required: true, message: '', trigger: 'blur' }]
})

const isEdit = computed(() => {
  return !!ruleObject.value.visitSettingId
})

const onDistributeRoleChange = (type: string) => {
  if (type === 'distributeRole') {
    const checkNodes = distributeRoleRef.value.getCheckedNodes(true)
    ruleObject.value.distributeRoleList = checkNodes.map((i) => {
      return { key: i.value, value: i.text, keyword: i.value }
    })
    ruleObject.value.distributeRoleIds = checkNodes.map((i) => i.value)
  } else if (type === 'shopDTO') {
    const checkNodes = shopDTORef.value.getCheckedNodes(true)
    ruleObject.value.shopDTOList = checkNodes.map((i) => {
      return { shopId: i.value, shopName: i.label }
    })
  } else if (type === 'applyShopDTO') {
    const checkNodes = applyShopDTORef.value.getCheckedNodes(true)
    ruleObject.value.applyShopDTOList = checkNodes.map((i) => {
      return { shopId: i.value, shopName: i.label }
    })
  } else if (type === 'visitUserDTO') {
    const checkNodes = visitUserDTORef.value.getCheckedNodes(true)
    ruleObject.value.visitUserDTOList = checkNodes.map((i) => {
      return { jobNumber: i.value, userId: i.value, userName: i.label }
    })
  }
}

const setDefaultValue = (data) => {
  data.extInfo = data.extInfoVo || {}
  const fieldArr = ['distributeRole', 'shopDTO', 'applyShopDTO', 'visitUserDTO']
  fieldArr.forEach((item) => {
    data[item + 'Ids'] = data[item + 'List']
      ? data[item + 'List'].map((i) => i.key || i.shopId || i.userId)
      : []
  })
  ruleObject.value = data
}

const openDialog = (data?) => {
  ruleEmptyObject.value = cloneDeep(ruleObject.value)
  if (data) setDefaultValue(data)
  dialogVisible.value = true
}

const confirm = async () => {
  const valid = await formRef.value!.validate().catch(() => {})
  if (!valid) return
  formOptions.confirmLoading = true
  let res
  if (isEdit.value) {
    let params = {
      visitSettingId: ruleObject.value.visitSettingId,
      visitSettingPurpose: ruleObject.value.visitSettingPurpose,
      shopDTOList: ruleObject.value.shopDTOList,
      applyShopDTOList: ruleObject.value.applyShopDTOList,
      visitUserDTOList: ruleObject.value.visitUserDTOList
    }
    res = await updateVisitSetting(params).finally(() => (formOptions.confirmLoading = false))
  } else {
    res = await visitBatchAdd([ruleObject.value]).finally(
      () => (formOptions.confirmLoading = false)
    )
  }
  if (res) {
    emits('success')
    cancel()
    message.success('保存成功')
  } else {
    message.error('操作失败')
  }
}
const cancel = () => {
  ruleObject.value = ruleEmptyObject.value
  dialogVisible.value = false
}

defineExpose({ openDialog })

onMounted(async () => {
  await Promise.all([getVisitTypeList(), getOriginTimeTypeList()]).then((res) => {
    formOptions.type = res[0]
    formOptions.originTimeType = res[1]
  })
})
</script>

<style lang="scss" scoped>
.visit-rule-item {
  margin-bottom: 16px;

  .item-header {
    padding: 10px 14px;
    border: 1px solid var(--el-border-color-lighter);
    border-bottom: none;
  }

  :deep(.el-form-item--default) {
    margin-bottom: 0;
  }

  .required::before {
    margin-right: 2px;
    color: $error-color;
    content: '*';
  }
}
</style>
