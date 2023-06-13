import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

// 表单校验
export const rules = reactive({
  serialNumber: [required],
  sourceName: [required],
  shopName: [required]
})

// CrudSchema
const crudSchemas = reactive<VxeCrudSchema>({
  primaryKey: 'id',
  primaryType: null,
  action: true,
  actionWidth: '160px',
  columns: [
    {
      title: '编号',
      field: 'serialNumber',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '线索平台所属门店',
      field: 'shopName',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '线索平台',
      field: 'clueSource',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '平台账号',
      field: 'platformUsername',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '平台密码',
      field: 'platformPassword',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '创建人',
      field: 'createBy',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '创建时间',
      field: 'createTime',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '是否需要清洗',
      field: 'needFilter',
      form: {
        value: 0,
        component: 'Switch',
        componentProps: {
          activeValue: 0,
          inactiveValue: 1,
          disabled: false
        },

        colProps: {
          span: 24
        }
      },
      table: {
        width: 70,
        slots: {
          default: 'need_filter_default'
        }
      }
    },
    {
      title: '是否自动派发',
      field: 'autoDistribute',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '是否线索平台规则派发',
      field: 'platformRule',
      form: {
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '手动创建线索是否可选',
      field: 'isShow',
      form: {
        colProps: {
          span: 24
        }
      }
    }
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)
