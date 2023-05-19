import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

// 增删改查 CrudSchema 配置
export const crudConfig = (type?) => {
  const crudSchemas = reactive<VxeCrudSchema>({
    primaryKey: 'id',
    primaryType: type || 'checkbox',
    action: false,
    columns: [
      {
        title: '成员工号',
        field: 'username'
      },
      {
        title: '成员姓名',
        field: 'nickname'
      },
      {
        title: '部门/岗位',
        field: 'departmentPost',
        table: {
          slots: {
            default: 'department_post'
          }
        }
      },
      {
        title: '人员类型',
        dictType: DICT_TYPE.PERSON_TYPE,
        dictClass: 'string',
        field: 'userType'
      }
    ]
  })
  return useVxeCrudSchemas(crudSchemas)
}
