import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'
// 国际化
const { t } = useI18n()
// 表单校验
export const rules = reactive({
  name: [required],
  code: [required],
  status: [required]
})
// CrudSchema
const crudSchemas = reactive<VxeCrudSchema>({
  action: true,
  actionWidth: '300px',
  columns: [
    {
      title: '角色编码',
      field: 'code',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '角色名称',
      field: 'name',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '成员数',
      field: 'staffCount',
      isForm: false
    },
    {
      title: t('common.status'),
      field: 'status',
      dictType: DICT_TYPE.COMMON_STATUS,
      dictClass: 'number',
      form: {
        value: 0,
        component: 'Switch',
        componentProps: {
          activeValue: 0,
          inactiveValue: 1
        },
        colProps: {
          span: 24
        }
      },
      table: {
        width: 80,
        slots: {
          default: 'status_default'
        }
      }
    }
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)
