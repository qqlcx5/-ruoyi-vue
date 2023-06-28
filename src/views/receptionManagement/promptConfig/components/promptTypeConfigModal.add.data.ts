import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

// const { t } = useI18n() // 国际化

// 表单校验
export const addRules = reactive({
  typeKey: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
  typeName: [{ required: true, message: '请输入类型关键字', trigger: 'blur' }]
})

// crudSchemas
const crudSchemas = reactive<VxeCrudSchema>({
  action: true,
  actionWidth: '130',
  columns: [
    {
      title: '提示类型关键字',
      field: 'typeKey',
      requried: true
    },
    {
      title: '提示类型名称',
      field: 'typeName',
      requried: true
    }
  ]
})
const { allSchemas } = useVxeCrudSchemas(crudSchemas)
export const addAllSchemas = allSchemas
