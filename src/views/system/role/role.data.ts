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
      },
      disabled: true
    },
    {
      title: '角色名称',
      field: 'name',
      form: {
        colProps: {
          span: 24
        }
      },
      disabled: true
    },
    {
      title: '在职成员',
      field: 'staffCount',
      isForm: false,
      table: {
        slots: {
          default: 'staff_count'
        }
      }
    },
    {
      title: t('common.status'),
      field: 'status',
      dictType: DICT_TYPE.COMMON_STATUS,
      dictClass: 'number',
      form: {
        // value: 0,
        // component: 'Switch',
        // componentProps: {
        //   activeValue: 0,
        //   inactiveValue: 1
        // },
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
    },
    {
      title: t('common.creater'),
      field: 'creator',
      isForm: false,
      defaultShow: false
    },
    {
      title: t('common.createTime'),
      field: 'createTime',
      formatter: 'formatDate',
      isForm: false,
      defaultShow: false
    },
    {
      title: t('common.operator'),
      field: 'updater',
      isForm: false,
      defaultShow: false
    },
    {
      title: t('common.operationTime'),
      field: 'updateTime',
      formatter: 'formatDate',
      isForm: false,
      defaultShow: false
    }
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)
