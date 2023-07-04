<template>
  <div>
    <!--  画像因子新增 类型 -->
    <XModal v-model="modelValue_" title="新建厂家">
      <!-- 表单 -->
      <Form ref="formRef" :schema="allSchemas.formSchema" :rules="rules" :isCol="false">
        <template #cancelReason="form">
          <el-select v-model="form.cancelReason" placeholder="请选择取消原因">
            <el-option label="测试" value="测试" />
            <el-option label="点错了" value="点错了" />
            <el-option label="客户进店后就马上走了" value="客户进店后就马上走了" />
            <el-option label="其他" value="其他" />
          </el-select>
        </template>
        <template #cancelExplain="form">
          <el-input v-model="form.cancelExplain" type="textarea" clearable />
        </template>
      </Form>
      <!-- 操作按钮 -->
      <template #footer>
        <!-- 按钮：保存 -->
        <XButton type="primary" title="确认" :loading="actionLoading" @click="submitForm" />
        <!-- 按钮：关闭 -->
        <XButton title="取消" @click="modelValue_ = false" />
      </template>
    </XModal>
  </div>
</template>

<script setup lang="ts">
import * as receptionList from '@/api/receptionManagement/receptionList'
const { t } = useI18n() // 国际化
// let dialogLoading = ref(false) // 弹窗加载状态
// const [registerTable, { reload }] = useXTable({
//   allSchemas: allSchemas,
//   getListApi: promptConfig.portraitFactorLevelConfigSaveOrUpdateApi
// })

import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

// const { t } = useI18n() // 国际化

// 表单校验
const rules = reactive({
  cancelReason: [{ required: true, message: '请输入画像因子得分区间', trigger: 'blur' }],
  cancelExplain: [{ required: true, message: '请输入对应评级名称', trigger: 'blur' }]
})

// crudSchemas
const crudSchemas = reactive<VxeCrudSchema>({
  action: true,
  actionWidth: '130',
  columns: [
    {
      title: '厂家名称',
      field: 'manufacturerName',
      requried: true,
      form: {
        component: 'Input'
      }
    },
    {
      title: '厂家编号',
      field: 'manufacturerNumber',
      requried: true,
      form: {
        component: 'Input'
      }
    },
    {
      title: '系统厂家编号',
      field: 'systemManufacturerNumber',
      requried: true,
      form: {
        component: 'Input',
        componentProps: {
          disabled: true
        }
      }
    },
    {
      title: '自定义厂家编号',
      field: 'customNumbering',
      requried: true,
      form: {
        component: 'Input'
      }
    },
    {
      title: '状态',
      field: 'state',
      requried: true,
      form: {
        component: 'Switch'
      }
    }
  ]
})
const { allSchemas } = useVxeCrudSchemas(crudSchemas)

/* --------------------------------- // 新增类型 -------------------------------- */
import { FormExpose } from '@/components/Form'

// 表单参数
const actionLoading = ref(false) // 按钮 Loading
const formRef = ref<FormExpose>() // 表单 Ref
const message = useMessage() // 消息弹窗
let rowData = ref<any>({}) // 行数据
function openModal(open: boolean, data?: any) {
  modelValue_.value = open
  rowData.value = data
}
defineExpose({ openModal })

// 提交按钮
const submitForm = async () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (!valid) return
    try {
      actionLoading.value = true
      const data = unref(formRef)?.formModel as any
      data.receptionId = rowData.value.id
      await receptionList.receptionManageCancelReceptionApi(data)

      modelValue_.value = false
      emits('refresh', true)
      message.success(t('common.createSuccess'))
    } finally {
      actionLoading.value = false
    }
  })
}

/* ---------------------------------- 弹窗初始化 --------------------------------- */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:modelValue', 'refresh'])
const modelValue_ = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>
