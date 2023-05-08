import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'
const { t } = useI18n() // 国际化

// 表单校验
export const dictTypeRules = reactive({
  name: [required],
  type: [required]
})
// 新增 + 修改
const crudSchemas = reactive<VxeCrudSchema>({
  primaryKey: 'id',
  primaryType: null,
  action: true,
  actionWidth: '60px',
  searchSpan: 12,
  columns: [
    {
      title: '字典名称',
      field: 'name',
      // isSearch: true,
      form: {
        colProps: {
          span: 24
        },
      },
      table: {
        width: 140,
      }
    },
    {
      title: '字典类型',
      field: 'type',
      // isSearch: true,
      form: {
        colProps: {
          span: 24
        }
      },
      table: {
        width: 140,
      }
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
          inactiveValue: 1,
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
      },
    },
    {
      title: '子项数量',
      field: 'childCount',
      isForm: false
    },
    {
      title: t('common.creater'),
      field: 'creatorName',
      isForm: false
    },
    {
      title: t('common.createTime'),
      field: 'createTime',
      formatter: 'formatDate',
      isForm: false,
    },
    {
      title: t('form.remark'),
      field: 'remark',
      isTable: false,
      form: {
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
      title: t('common.operator'),
      field: 'updaterName',
      isForm: false
    },
    {
      title: t('common.operationTime'),
      field: 'updateTime',
      formatter: 'formatDate',
      isForm: false
    },
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)
