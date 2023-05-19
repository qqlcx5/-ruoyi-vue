import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

export const DATA_ACCESS_MAP = {
  [1]: '看所有人',
  [2]: '指定部门',
  [3]: '仅看本部门',
  [4]: '仅看本部门及以下',
  [5]: '仅看自己',
  [6]: '指定人'
}

// 增删改查 CrudSchema 配置
const crudSchemas = reactive<VxeCrudSchema>({
  primaryKey: 'id',
  primaryType: 'checkbox',
  action: false,
  columns: [
    {
      title: '角色名称',
      field: 'name'
    },
    {
      title: '岗位编码',
      field: 'id'
    }
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)
