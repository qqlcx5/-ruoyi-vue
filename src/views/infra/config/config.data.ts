import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'
const { t } = useI18n() // 国际化

// 表单校验
export const rules = reactive({
  category: [required],
  name: [required],
  key: [required],
  value: [required]
})

// CrudSchema
const crudSchemas = reactive<VxeCrudSchema>({
  primaryKey: 'id',
  primaryType: null,
  action: true,
  actionWidth: '160px',
  columns: [
    {
      title: '参数主键',
      field: 'id',
      isForm: false,
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '参数分类',
      field: 'category',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '参数名称',
      field: 'name',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '参数键名',
      field: 'key',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '参数键值',
      field: 'value',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '系统内置',
      field: 'type',
      dictType: DICT_TYPE.INFRA_CONFIG_TYPE,
      dictClass: 'number',
      isForm: false,
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '是否可见',
      field: 'visible',
      table: {
        slots: {
          default: 'visible_default'
        }
      },
      form: {
        value: true,
        component: 'Switch',
        componentProps: {
          options: [
            { label: '是', value: true },
            { label: '否', value: false }
          ]
        },
        colProps: {
          span: 24
        }
      }
    },
    {
      title: t('form.remark'),
      field: 'remark',
      form: {
        component: 'Input',
        componentProps: {
          type: 'textarea',
          rows: 4
        },
        colProps: {
          span: 24
        }
      }
    },
    {
      title: t('common.creater'),
      field: 'creator',
      isForm: false
    },
    {
      title: t('common.createTime'),
      field: 'createTime',
      formatter: 'formatDate',
      isForm: false
    },
    {
      title: t('common.operator'),
      field: 'updater',
      isForm: false
    },
    {
      title: t('common.operationTime'),
      field: 'updateTime',
      formatter: 'formatDate',
      isForm: false
    }
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)
