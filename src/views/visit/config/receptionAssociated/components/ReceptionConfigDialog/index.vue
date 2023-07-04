<template>
  <Dialog
    class="wg-dialog"
    v-model="dialogVisible"
    title="接待关联配置"
    width="1000px"
    :close-on-click-modal="false"
    @confirm="confirm"
    @cancel="cancel"
  >
    <div class="title !pt-0">接待录音关联条件</div>
    <Form ref="formRef" :rules="rules" :schema="schema" :labelWidth="120" label-position="left">
      <template #intentionModelIds="form">
        <el-cascader
          ref="modelCascader"
          v-model="form.intentionModelIds"
          :options="formOptions.modelByList"
          :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
          filterable
          collapse-tags
          collapse-tags-tooltip
          clearable
          @change="onModelChange"
        />
      </template>
    </Form>
    <div class="title">
      关联回访计划规则
      <XButton type="primary" title="添加" @click="onAddRule()" />
    </div>
    <el-table :data="formOptions.tableData" border row-key="visitSettingId">
      <el-table-column prop="visitSettingTypeStr" label="回访类型" width="90" />
      <el-table-column prop="visitSettingPurposeStr" label="回访目的" />
      <el-table-column prop="roleName" label="回访岗位" />
      <el-table-column prop="distributeRoleList" label="分配岗位">
        <template #default="{ row }">
          <el-tooltip>
            <template #content>
              <div class="max-w-400px">
                {{ row.distributeRoleList.map((i) => i.value).join('、') }}
              </div>
            </template>
            <div class="w-140px overflow-ellipsis whitespace-nowrap">
              {{ row.distributeRoleList.map((i) => i.value).join('、') }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="visitObject" label="回访对象" width="100">
        <template #default="{ row }">{{
          getDictLabel('visit_object', row.visitObject) || ''
        }}</template>
      </el-table-column>
      <el-table-column prop="originTimeTypeStr" label="参考时间(T)" width="100" />
      <el-table-column prop="visitLimitDay" label="计划回访时间T+N(天数)" width="180" />
      <el-table-column fixed="right" label="操作" width="60">
        <template #default="{ row }">
          <el-link type="primary" @click="onDeleteRule(row.visitSettingId)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </Dialog>
  <VisitRuleDialog
    ref="visitRuleDialogRef"
    business-type="receptionRecord"
    @confirm="onVisitRuleConfirm"
  />
</template>

<script lang="ts" setup>
import { cloneDeep, uniqWith } from 'lodash-es'
import { FormExpose } from '@/components/Form'
import { getStrDictOptions, getDictLabel, getDictOptions } from '@/utils/dict'
import VisitRuleDialog from '../../../../verbalTrick/components/VisitRuleDialog/index.vue'
import {
  getEnterShopTypelList,
  getIntentionLevelList,
  getReceptionStatuslList,
  updateApi,
  addApi
} from '@/api/visit/receptionConfig'
import { queryModelByNameApi } from '@/api/receptionManagement/promptConfig'

const emit = defineEmits(['success'])
const message = useMessage()

const arrayField = [
  'intentionLevel',
  'enterShopType',
  'brandName',
  'intentionModel',
  'intentionSeries',
  'isBook',
  'isDrive',
  'receptionStatus'
]
const dialogVisible = ref<boolean>(false)
const visitRuleDialogRef = ref()
const formOptions = reactive({
  loading: false,
  formData: {},
  tableData: [],
  intentionLevel: [],
  enterShopType: [],
  receptionStatus: [],
  modelByList: [],
  isDrive: getStrDictOptions('drive_status') || [],
  isBook: getDictOptions('place_order_status') || []
})

// 表单校验
const rules = reactive({
  intentionLevel: [{ required: true, message: '请选择意向登记', trigger: 'blur' }],
  enterShopType: [{ required: true, message: '请选择到店类型', trigger: 'blur' }],
  receptionStatus: [{ required: true, message: '请选择接待状态', trigger: 'blur' }],
  isDrive: [{ required: true, message: '请选择是否试乘试驾', trigger: 'blur' }],
  isBook: [{ required: true, message: '请选择是否下订', trigger: 'blur' }]
})
const schema = reactive([
  {
    field: 'intentionLevel',
    label: '意向等级',
    component: 'Select',
    componentProps: {
      options: computed(() => formOptions.intentionLevel),
      multiple: true
    }
  },
  {
    field: 'enterShopType',
    label: '到店类型',
    component: 'Select',
    componentProps: {
      options: computed(() => formOptions.enterShopType),
      multiple: true,
      valueField: 'key'
    }
  },
  {
    field: 'receptionStatus',
    label: '接待状态',
    component: 'Select',
    componentProps: {
      options: computed(() => formOptions.receptionStatus)
    }
  },
  {
    field: 'isDrive',
    label: '是否试乘试驾',
    component: 'Select',
    componentProps: {
      options: [
        { label: '无', value: '-2' },
        { label: '全部', value: '-1' },
        ...formOptions.isDrive
      ]
    }
  },
  {
    field: 'isBook',
    label: '是否下订',
    component: 'Select',
    componentProps: {
      options: [{ label: '无', value: '-2' }, ...formOptions.isBook],
      multiple: true
    }
  },
  {
    field: 'intentionModelIds',
    label: '意向车型'
  }
])
const formRef = ref<FormExpose>() // 表单 Ref

/** 回访话术关联的回访计划规则 */
const onVisitRuleConfirm = (data) => {
  formOptions.tableData = cloneDeep(
    uniqWith(data, (arrVal, othVal) => {
      return Number(arrVal['visitSettingId']) === Number(othVal['visitSettingId'])
    })
  )
}

const onAddRule = () => {
  visitRuleDialogRef.value.openDialog()
}

const onDeleteRule = (id) => {
  message.wgOperateConfirm('确认删除关联回访规则？', '提示').then(async (res) => {
    if (res === 'confirm') {
      formOptions.tableData = formOptions.tableData.filter((i) => i['visitSettingId'] !== id)
    }
  })
}

const modelCascader = ref()
const onModelChange = () => {
  const data = modelCascader.value.getCheckedNodes(true) || []
  let brand: any[] = []
  let model: any[] = []
  let series: any[] = []
  data.forEach((item) => {
    item.pathValues[0] && brand.push(item.pathValues[0])
    item.pathValues[1] && series.push(item.pathValues[1])
    item.pathValues[2] && model.push(item.pathValues[2])
  })
  formRef.value!.setValues({
    brandName: [...new Set(brand)]?.join(',') || '',
    intentionSeries: [...new Set(series)]?.join(',') || '',
    intentionModel: [...new Set(model)]?.join(',') || ''
  })
}

const setDefaultValue = (data) => {
  const numberFieldArr = ['intentionLevel', 'enterShopType']
  const stringFieldArr = ['isBook']
  const numberFields = ['receptionStatus']
  const stringFields = ['isDrive']
  formOptions.tableData = cloneDeep(data.visitSetting)
  formOptions.formData = cloneDeep(data)
  numberFieldArr.forEach((item) => {
    formOptions.formData[item] = formOptions.formData[item]
      ? formOptions.formData[item].split(',').map((i) => Number(i))
      : []
  })
  stringFieldArr.forEach((item) => {
    formOptions.formData[item] = formOptions.formData[item]
      ? formOptions.formData[item].split(',').map((i) => String(i))
      : []
  })
  numberFields.forEach((item) => {
    formOptions.formData[item] = Number(formOptions.formData[item])
  })
  stringFields.forEach((item) => {
    formOptions.formData[item] = String(formOptions.formData[item])
  })
  console.log(formOptions.formData['intentionModelIds'])
  formRef.value!.setValues(formOptions.formData)
}

const openDialog = async (data?) => {
  dialogVisible.value = true
  await nextTick()
  if (data) setDefaultValue(data)
}

const requestParamFormat = async () => {
  const data = unref(formRef)!.formModel
  const requestParamsFields = [
    'intentionLevel',
    'enterShopType',
    'receptionStatus',
    'isDrive',
    'isBook',
    'brandName',
    'intentionModel',
    'intentionSeries'
  ]
  let params = {}
  requestParamsFields.forEach((field) => {
    params[field] = data![field]
  })
  for (const key of arrayField) {
    if (Array.isArray(params[key])) {
      params[key] = params[key].join(',')
    }
  }
  if (formOptions.formData['id']) {
    params['id'] = formOptions.formData['id']
    params['visitSettingId'] = formOptions.tableData.map(
      (item) => item['visitSettingId'] || item['id']
    )
  } else {
    params['visitSettingIds'] = formOptions.tableData.map(
      (item) => item['visitSettingId'] || item['id']
    )
  }
  return params
}

const confirm = () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      console.log(unref(formRef)?.formModel)
      if (formOptions.tableData.length === 0) return message.error('请选择关联回访计划规则')
      formOptions.loading = true
      let res
      let params = await requestParamFormat()
      if (formOptions.formData['id']) {
        res = await updateApi(params).finally(() => (formOptions.loading = false))
      } else {
        res = await addApi(params).finally(() => (formOptions.loading = false))
      }
      if (!res) {
        message.error('操作失败')
      } else {
        message.success('保存成功')
        cancel()
        emit('success')
      }
    }
  })
}
const cancel = () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.resetFields()
  formOptions.tableData = []
  formOptions.formData = []
  dialogVisible.value = false
}

defineExpose({ openDialog }) // 提供 openModal 方法，用

onMounted(() => {
  Promise.all([
    getIntentionLevelList(),
    getEnterShopTypelList(),
    getReceptionStatuslList(),
    queryModelByNameApi({})
  ]).then((res) => {
    formOptions.intentionLevel = res[0].map((item) => {
      return { value: item.key, label: item.value }
    })
    formOptions.enterShopType = res[1].map((item) => {
      return { value: item.key, label: item.value }
    })
    formOptions.receptionStatus = res[2].map((item) => {
      return { value: item.key, label: item.value }
    })
    formOptions.modelByList = res[3]
  })
})
</script>

<style lang="scss" scoped>
.title {
  padding: 16px 0;
  font-size: 14px;
  font-weight: bold;
  color: $title-color;
}
</style>
