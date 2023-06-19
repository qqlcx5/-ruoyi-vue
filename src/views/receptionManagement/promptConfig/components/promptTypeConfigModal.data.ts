import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

const { t } = useI18n() // 国际化

// 表单校验
export const rules = reactive({
  name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
  type: [{ required: true, message: '请输入类型关键字', trigger: 'blur' }]
})

// crudSchemas
const crudSchemas = reactive<VxeCrudSchema>({
  action: true,
  actionWidth: '130',
  columns: [
    {
      title: '提示类型关键字',
      field: 'reason'
    },
    {
      title: '提示类型名称',
      field: 'reason'
    },
    {
      title: '提示类型描述',
      field: 'reason'
    },
    {
      title: t('common.startTimeText'),
      field: 'startTime',
      formatter: 'formatDay',
      table: {
        width: 180
      },
      detail: {
        dateFormat: 'YYYY-MM-DD'
      },
      form: {
        component: 'DatePicker'
      }
    }
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)
