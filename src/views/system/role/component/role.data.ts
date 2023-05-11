import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

// 增删改查 CrudSchema 配置
const crudSchemas = reactive<VxeCrudSchema>({
  primaryKey: 'id',
  primaryType: 'checkbox',
  action: false,
  columns: [
    {
      title: '角色名称',
      field: 'name',
    },
    {
      title: '岗位编码',
      field: 'id',
    },
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)
