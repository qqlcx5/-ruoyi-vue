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
  componentName?: string
  status: number
  visible: boolean
  keepAlive: boolean
  alwaysShow?: boolean
  createTime: Date
}

// 查询菜单（精简）列表
export const getSimpleMenusList = (params) => {
  return request.get({ url: '/system/menu/list-all-simple', params })
}

// 查询菜单列表
export const getMenuList = (params) => {
  return request.get({ url: '/system/tenant-menu/list-all-simple', params })
}

// 获取菜单详情
export const getMenu = (id: number) => {
  return request.get({ url: '/system/menu/get?id=' + id })
}

// 新增菜单
export const createMenu = (data: MenuVO) => {
  return request.post({ url: '/system/tenant-menu/create', data })
}

// 修改菜单
export const updateMenu = (data: MenuVO) => {
  return request.put({ url: '/system/menu/update', data })
}

// 修改菜单状态
export const updateMenuStatus = (data) => {
  return request.put({ url: '/system/tenant-menu/update/status', data })
}

// 修改菜单状态
export const updateMenuVisibleStatus = (data) => {
  return request.put({ url: '/system/tenant-menu/update/visible', data })
}

// 删除菜单
export const deleteMenu = (id: number) => {
  return request.delete({ url: '/system/menu/delete?id=' + id })
}

// 权限配置菜单
export const getAuthMenuList = () => {
  return request.get({ url: '/system/tenant-menu/list-for-auth' })
}
