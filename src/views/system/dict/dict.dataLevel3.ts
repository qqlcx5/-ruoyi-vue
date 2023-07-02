import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'
// 国际化
const { t } = useI18n()
// 表单校验
export const dictDataRules = reactive({
  label: [required],
  value: [required],
  sort: [required]
})
// crudSchemas
export const crudSchemas = reactive<VxeCrudSchema>({
  primaryKey: 'id',
  primaryType: null,
  action: true,
  actionWidth: '150px',
  searchSpan: 12,
  columns: [
    {
      title: '字典类型',
      field: 'dictType',
      isTable: false,
      isForm: false
    },
    {
      title: '子项标签',
      field: 'label',
      form: {
        colProps: {
          span: 24
        }
      },
      disabled: true
    },
    {
      title: '子项键值',
      field: 'value',
      form: {
        colProps: {
          span: 24
        }
      },
      disabled: true
    },
    {
      title: '子项排序',
      field: 'sort',
      isTable: false,
      form: {
        component: 'InputNumber',
        componentProps: {
          modelValue: 0,
          controlsPosition: 'right'
        },
        colProps: {
          span: 24
        }
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
          inactiveValue: 1
        },
        colProps: {
          span: 24
        }
      },
      table: {
        width: 70,
        slots: {
          default: 'status_default'
        }
      }
    },
    {
      title: t('common.creater'),
      field: 'creatorName',
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
      title: '底纹',
      field: 'dw',
      isTable: false,
      form: {
        component: 'ColorPicker',
        componentProps: {
          predefine: ['#ffffff', '#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#c71585']
        },
        colProps: {
          span: 24
        }
      }
    },
    {
      title: '颜色',
      field: 'cssClass',
      isTable: false,
      form: {
        component: 'ColorPicker',
        componentProps: {
          predefine: ['#ffffff', '#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#c71585']
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
      },
      isTable: false
    },
    {
      title: t('common.operator'),
      field: 'updaterName',
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
