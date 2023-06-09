import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

const { t } = useI18n() // 国际化

// 表单校验
export const rules = reactive({
  name: [required],
  code: [required],
  sort: [required]
})

// 增删改查 CrudSchema 配置
const crudSchemas = reactive<VxeCrudSchema>({
  actionWidth: '100px',
  action: true,
  columns: [
    {
      title: '岗位类型编码',
      field: 'code',
      disabled: true
    },
    {
      title: '岗位类型',
      field: 'name',
      disabled: true
    },
    {
      title: '岗位数',
      field: 'postCount'
    },
    {
      title: '在职成员',
      field: 'userCount',
      table: {
        slots: {
          default: 'user_count'
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
