import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

// const { t } = useI18n() // 国际化

// 表单校验
export const addRules = reactive({
  score: [{ required: true, message: '请输入画像因子得分区间', trigger: 'blur' }],
  level: [{ required: true, message: '请输入对应评级名称', trigger: 'blur' }]
})

// crudSchemas
const crudSchemas = reactive<VxeCrudSchema>({
  action: true,
  actionWidth: '130',
  columns: [
    {
      title: '画像因子得分区间',
      field: 'score',
      requried: true
    },
    {
      title: '对应评级名称',
      field: 'level',
      requried: true
    }
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)
