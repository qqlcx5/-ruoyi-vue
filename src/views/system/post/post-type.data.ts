import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

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
    },
    {
      title: '岗位类型',
      field: 'name',
    },
    {
      title: '岗位数',
      field: 'postCount',
    },
    {
      title: '成员',
      field: 'memberCount',
    },
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)
