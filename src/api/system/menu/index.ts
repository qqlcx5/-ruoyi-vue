import request from '@/config/axios'

export interface MenuVO {
  id: number
  name: string
  permission: string
  type: number
  sort: number
  parentId: number
  path: string
  icon: string
  component: string
  tenantType?: string
  componentName?: string
  status: number
  visible: boolean
  keepAlive: boolean
  alwaysShow?: boolean
  createTime: Date
}

// 查询菜单（精简）列表
export const getSimpleMenusList = () => {
  return request.get({ url: '/system/menu/list-all-simple' })
}

// 查询主体配置权限获取菜单（精简）列表
export const getMajorIndividualSimpleMenusList = (params) => {
  return request.get({ url: '/system/menu/list-for-tenant',params })
}

// 查询菜单列表
export const getMenuList = (params) => {
  return request.get({ url: '/system/menu/list', params })
}

// 通过菜单查询员工数量
export const getMemberNumList = (params) => {
  return request.get({ url: '/system/tenant-menu/get/user/extra/post', params })
}

// 通过菜单查询员工数量 角色
export const getMemberNumRoleList = (params) => {
  return request.get({ url: '/system/tenant-menu/get/user/extra/role', params })
}

// 获取菜单详情
export const getMenu = (id: number) => {
  return request.get({ url: '/system/menu/get?id=' + id })
}

// 新增菜单
export const createMenu = (data: MenuVO) => {
  return request.post({ url: '/system/menu/create', data })
}

// 修改菜单
export const updateMenu = (data: MenuVO) => {
  return request.put({ url: '/system/menu/update', data })
}

// 修改菜单状态
export const updateMenuStatus = (data) => {
  return request.put({ url: '/system/menu/update/status', data })
}

// 删除菜单
export const deleteMenu = (id: number) => {
  return request.delete({ url: '/system/menu/delete?id=' + id })
}
