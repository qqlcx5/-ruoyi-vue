<template>
  <div class="edit-assess-rule-dialog" v-loading.fullscreen.lock="loading">
    <el-dialog
      class="custom-dialog"
      :model-value="props.modelValue"
      :title="props.curInfo['id'] ? '编辑' : '新增'"
      width="665px"
      :before-close="handleClose"
    >
      <el-form id="edit-form" ref="formRef" :rules="rules" :model="ruleForm" :disabled="loading">
        <el-form-item label="规则名称" label-width="80px" prop="checkRuleName">
          <el-input
            v-model.trim="ruleForm.checkRuleName"
            placeholder="请输入规则名称"
            maxlength="20"
            show-word-limit
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="适用门店" label-width="80px" prop="applicableShopId">
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
        <el-divider />
        <div class="form-title">考核规则设置</div>
        <div class="form-sub-title">考核时间设置</div>
        <div class="form-tip-text"
          >（在设置的时段内，才会计算线索的逾期时间，时间段以外不进行逾期时间计算）</div
        >
        <div class="mt-15px mb-15px">
          <el-button v-if="!editTimeFlag" type="primary" @click="timeEdit(true)">编辑</el-button>
          <template v-else>
            <el-button type="primary" @click="timeEdit(false)">保存</el-button>
            <el-button type="primary" @click="handleAddTime">增加时间段</el-button>
          </template>
        </div>
        <el-form ref="timeFormRef" class="mb-20px" :model="timeList" :disabled="!editTimeFlag">
          <div
            v-for="(item, index) in timeList"
            :key="item.timestamp"
            class="config-form-item mt-15px"
            style="display: flex; align-items: center"
          >
            <span class="mr-8px">时间段</span>
            <el-form-item
              :prop="`${index}.arr`"
              :rules="[{ required: true, message: '请选择时间段', trigger: 'change' }]"
              style="margin-bottom: 0"
            >
              <el-time-picker
                v-model="item.arr"
                is-range
                format="HH:mm"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="mr-8px"
                style="flex: unset; width: 240px"
              />
            </el-form-item>
            <Icon
              v-if="editTimeFlag"
              icon="ep:remove"
              class="toggle-icon"
              @click="handleDelTime(index)"
              color="#FF4141"
              style="cursor: pointer"
            />
          </div>
        </el-form>
        <el-form-item label="接单逾期设置" prop="receiveOpenRules">
          <el-switch v-model="ruleForm.receiveOpenRules" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item required label="线索接单判定“一般逾期”为派单后" prop="generalOverdue">
          <el-input-number
            v-model="ruleForm.generalOverdue"
            :controls="false"
            :min="0"
            step-strictly
            :step="1"
          /><span>分钟接单</span>
        </el-form-item>
        <el-form-item required label="线索接单判定“严重逾期”为派单后" prop="seriousOverdue">
          <el-input-number
            v-model="ruleForm.seriousOverdue"
            :controls="false"
            :min="0"
            step-strictly
            :step="1"
          /><span>分钟接单</span>
        </el-form-item>
        <el-form-item label="首次跟进逾期设置" prop="firstFollowOpenRules">
          <el-switch
            v-model="ruleForm.firstFollowOpenRules"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item
          required
          label="线索首次跟进判定“一般逾期”为派单后"
          prop="firstFollowGeneralOverdue"
        >
          <el-input-number
            v-model="ruleForm.firstFollowGeneralOverdue"
            :controls="false"
            :min="0"
            step-strictly
            :step="1"
          /><span>分钟跟进</span>
        </el-form-item>
        <el-form-item
          required
          label="线索首次跟进判定“严重逾期”为派单后"
          prop="firstFollowSeriousOverdue"
        >
          <el-input-number
            v-model="ruleForm.firstFollowSeriousOverdue"
            :controls="false"
            :min="0"
            step-strictly
            :step="1"
          /><span>分钟跟进</span>
        </el-form-item>
        <el-form-item label="常规跟进逾期设置" prop="followOpenRules">
          <el-switch v-model="ruleForm.followOpenRules" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item
          required
          label="线索常规跟进逾期界限时间配置：计划跟进时间当日"
          prop="overdueLimitDate"
        >
          <el-time-select
            v-model="ruleForm.overdueLimitDate"
            start="00:00"
            step="00:01"
            end="23:59"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item
          required
          label="线索常规跟进判定“一般逾期”为计划跟进时间当日22:00+"
          prop="followGeneralOverdue"
        >
          <el-input-number
            v-model="ruleForm.followGeneralOverdue"
            :controls="false"
            :min="0"
            step-strictly
            :step="1"
          /><span>分钟后跟进</span>
        </el-form-item>
        <el-form-item
          required
          label="线索常规跟进判定“严重逾期”为计划跟进时间当日22:00+"
          prop="followSeriousOverdue"
        >
          <el-input-number
            v-model="ruleForm.followSeriousOverdue"
            :controls="false"
            :min="0"
            step-strictly
            :step="1"
          /><span>分钟后跟进</span>
        </el-form-item>
        <el-form-item label="回收设置" prop="recycle">
          <el-switch v-model="ruleForm.recycle" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="" prop="recyclePostpone">
          <el-input-number
            v-model="ruleForm.recyclePostpone"
            :controls="false"
            :min="0"
            step-strictly
            :step="1"
            style="margin-left: 0px"
          />
          <span>分钟未进行跟进，则对线索进行回收重新派发</span>
        </el-form-item>
        <div class="form-sub-title mb-10px"><span>其他设置</span></div>
        <el-form-item
          label="已派发的线索，是否允许再次增加派发成员"
          style="margin-bottom: 0px"
          prop="augment"
        >
          <el-switch v-model="ruleForm.augment" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="成员已接单的有效线索，是否允许共享给其他成员进行跟进" prop="share">
          <el-switch v-model="ruleForm.share" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm(formRef)"
            >确定</el-button
          >
          <el-button @click="handleClose">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { judgeTimeList } from '@/utils/utils'
import type { FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'
import { listToTree } from '@/utils/tree'
import { cloneDeep, difference } from 'lodash-es'
import {
  existRuleShop,
  createAssessRule,
  detailAssessRule,
  editAssessRule,
  checkRuleName
} from '@/api/clue/basicConfig'
const message = useMessage()
interface IProps {
  modelValue: boolean
  curInfo: object
  shopList: object[]
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  curInfo: () => ({ id: '' }),
  shopList: () => []
})
interface IEmit {
  (event: 'update:modelValue', modelValue: boolean): void
  (event: 'success'): void
}
const emit = defineEmits<IEmit>()

const checkedList = ref<any[]>([])
const getExistRuleShop = async () => {
  const data = await existRuleShop()
  checkedList.value = data.map((d) => +d)
  console.log(data)
}
const shopTreeList = ref<object[]>([])
watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      const id = props.curInfo['id']
      Promise.all([getExistRuleShop(), id && getInfo(id)]).then(() => {
        const list = cloneDeep(props.shopList)
        const ids: string[] = ruleForm.applicableShopId
        console.log(checkedList.value, ids)
        checkedList.value = difference(checkedList.value, ids).map((d) => +d)
        list.forEach((item: object) => {
          item['disabled'] = checkedList.value.includes(item['id'])
        })
        console.log(list)
        shopTreeList.value = listToTree(list, { pid: 'parentId' })
        console.log(shopTreeList)
      })
    } else {
      formRef.value?.resetFields()
    }
  }
)
const loading = ref<boolean>(false)
const getInfo = async (id) => {
  try {
    loading.value = true
    const data = await detailAssessRule({ id })
    console.log(data)
    data.applicableShopId = data?.applicableShopId.split(',') || []
    data.applicableShopId = data.applicableShopId.map((d) => +d)
    ruleForm = reactive(data)
    dealTimeList(data.timeList || [])
  } finally {
    loading.value = false
  }
}

const rules: FormRules = reactive<FormRules>({
  checkRuleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  applicableShopId: [{ required: true, message: '请选择适用门店', trigger: 'change' }],
  generalOverdue: [{ required: true, message: '请输入', trigger: 'blur' }],
  seriousOverdue: [{ required: true, message: '请输入', trigger: 'blur' }],
  firstFollowGeneralOverdue: [{ required: true, message: '请输入', trigger: 'blur' }],
  firstFollowSeriousOverdue: [{ required: true, message: '请输入', trigger: 'blur' }],
  overdueLimitDate: [{ required: true, message: '请选择', trigger: 'change' }],
  followGeneralOverdue: [{ required: true, message: '请输入', trigger: 'blur' }],
  followSeriousOverdue: [{ required: true, message: '请输入', trigger: 'blur' }],
  recyclePostpone: [{ required: true, message: '请输入', trigger: 'blur' }]
})
const formRef = ref<FormInstance>()

let ruleForm = reactive({
  checkRuleName: '', // 考核规则名称
  applicableShopId: [], // 适用门店id 提交时 join(',')
  applicableShopName: [], // 适用门店名称

  timeList: [], // 时间段

  openRules: 1, // 开启规则 列表状态，默认开启

  receiveOpenRules: 0, // 接单逾期开启规则
  generalOverdue: null, // 一般逾期分钟
  seriousOverdue: null, // 严重逾期分钟

  firstFollowOpenRules: 0, // 首次跟进逾期开启规则
  firstFollowGeneralOverdue: null, // 首次跟进一般逾期分钟
  firstFollowSeriousOverdue: null, // 首次跟进严重逾期分钟

  followOpenRules: 0, // 常规跟进逾期开启规则
  overdueLimitDate: null, // 常规跟进逾期界限时间
  followGeneralOverdue: null, // 常规跟进一般逾期分钟
  followSeriousOverdue: null, // 常规跟进严重逾期分钟

  recycle: 0, // 是否开启回收
  recyclePostpone: null, // 回收分钟数

  augment: 0, // 是否允许增派
  share: 0 // 是否允许共享
})
const _form = cloneDeep(ruleForm)
const restForm = () => (ruleForm = reactive(_form))
// 处理时间段数据
const timeList = ref<object[]>([])
const dealTimeList = (list) => {
  const nowDate = dayjs().format('YYYY-MM-DD ')
  timeList.value = list.map((d) => {
    return {
      timestamp: new Date().getTime(),
      arr: [nowDate + d.startTime, nowDate + d.endTime]
    }
  })
}
// 时间段编辑
const editTimeFlag = ref<boolean>(false)
const timeFormRef = ref<FormInstance>()
const timeEdit = async (bool) => {
  if (bool === false) {
    try {
      await timeFormRef.value?.validate()
    } catch (e) {
      const dom = document.querySelector('#time-range .el-form-item__error')
      dom && dom.scrollIntoView({ behavior: 'smooth' })
      return false
    }
    const arr = timeList.value.map((d) => {
      return {
        startTime: dayjs(d['arr'][0]).format('HH:mm'),
        endTime: dayjs(d['arr'][1]).format('HH:mm')
      }
    })
    const vali = judgeTimeList(arr)
    if (!vali) {
      const dom = document.querySelector('#time-range')
      dom && dom.scrollIntoView({ behavior: 'smooth' })
      message.error('时间段不能重叠!')
      return false
    }
    ruleForm.timeList = arr as any
    editTimeFlag.value = bool
    return true
  } else {
    editTimeFlag.value = bool
  }
}
// 添加时间段
const handleAddTime = async () => {
  timeList.value.push({
    timestamp: new Date().getTime(),
    arr: []
  })
  await nextTick()
  const dom = document.querySelector('#time-range')
  dom && dom.scrollIntoView({ behavior: 'smooth' })
}
const handleDelTime = (index) => {
  timeList.value.splice(index, 1)
}
const handleClose = () => {
  const dom = document.querySelector('.edit-assess-rule-dialog .el-dialog__body')
  dom && (dom.scrollTop = 0)
  restForm()
  formRef.value?.resetFields()
  editTimeFlag.value = false
  timeList.value = []
  emit('update:modelValue', false)
}
const btnLoading = ref<boolean>(false)
const handleConfirm = async (formEl: FormInstance | undefined) => {
  Promise.all([editTimeFlag && timeEdit(false), formEl && formEl.validate()]).then(async () => {
    try {
      btnLoading.value = true
      const params = cloneDeep(ruleForm)
      params['applicableShopId'] = params.applicableShopId.join(',') as any
      if (params['id']) {
        await checkRuleName({ id: params['id'], ruleName: params.checkRuleName })
        await editAssessRule(params)
      } else {
        await createAssessRule(params)
      }
      message.success('提交成功')
      emit('success')
      handleClose()
    } finally {
      btnLoading.value = false
    }
  })
}
</script>

<style lang="scss">
.edit-assess-rule-dialog {
  @import '../../style/index';
  .el-form {
    padding: 0 20px;
  }
  .el-dialog__body {
    height: 550px;
    overflow: auto;
    padding-left: 0 !important;
    padding-right: 0 !important;
    .el-divider {
      width: calc(100% + 40px);
      margin-left: -20px;
    }
    .form-title {
      position: relative;
      line-height: 22px;
      font-size: 16px;
      font-weight: bold;
      color: $title-color;
      margin-bottom: 20px;
      &::before {
        content: '';
        position: absolute;
        left: -6px;
        top: calc(50% - 7px);
        display: block;
        width: 3px;
        height: 14px;
        background-color: $wg-primary-color;
      }
    }
    .form-sub-title {
      line-height: 20px;
      font-size: 14px;
      font-weight: bold;
      color: $title-color;
    }
    .form-tip-text {
      line-height: 20px;
      font-size: 14px;
      color: $tip-color;
      margin-top: 8px;
    }
    .el-switch {
      height: 20px;
    }
    .el-input-number {
      width: 120px;
      margin-right: 12px;
    }
  }
}
</style>
