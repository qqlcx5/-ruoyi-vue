import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'
import { getStrDictOptions, getDictLabel } from '@/utils/dict'
const { t } = useI18n() // 国际化

const serviceModuleOptions = getStrDictOptions('service_module')

// 表单校验
export const dictTypeRules = reactive({
  name: [required],
  type: [required],
  serviceModules: [{ required: true, message: '该项为必填项', trigger: 'blur' }]
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
        }
      },
      table: {
        width: 140
      },
      disabled: true
    },
    {
      title: '字典编码',
      field: 'type',
      // isSearch: true,
      form: {
        colProps: {
          span: 24
        }
      },
      table: {
        width: 140
      },
      disabled: true
    },
    {
      title: '业务模块',
      field: 'serviceModules',
      form: {
        component: 'Select',
        componentProps: {
          options: serviceModuleOptions,
          multiple: true
        },
        colProps: {
          span: 24
        }
      },
      table: {
        width: 140
      },
      formatter: ({ cellValue }) => {
        return cellValue ? cellValue.map((i) => getDictLabel('service_module', i)) : ''
      },
      disabled: true
    },
    // {
    //   title: t('common.status'),
    //   field: 'status',
    //   dictType: DICT_TYPE.COMMON_STATUS,
    //   dictClass: 'number',
    //   form: {
    //     value: 0,
    //     component: 'Switch',
    //     componentProps: {
    //       activeValue: 0,
    //       inactiveValue: 1
    //     },
    //     colProps: {
    //       span: 24
    //     }
    //   },
    //   isForm: false,
    //   isTable: false
    // },
    {
      title: '子项数量',
      field: 'childCount',
      isForm: false
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
