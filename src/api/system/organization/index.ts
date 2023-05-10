import request from '@/config/axios'
import { TenantPackageVO } from '@/api/system/tenantPackage'

export interface MajorIndividual {
  pageNo?: number
  pageSize?: number
  keyword?: string
  systemName?: string
  status?: number
  effectiveStartDate?: Date
  expireTime?: Date
}

// 查询机构列表
export const getOrganizationList = (params: MajorIndividual) => {
  return request.get({ url: '/system/organization/list', params })
}

// 获取机构类型列表(获取字典列表ALL 如何自己通过type过滤...)
export const getOrganizationTypeList = () => {
  return request.get({ url: '/system/tenant-dict-data/list-all-simple' })
}

// 获取上级机构列表
export const getSimpleOrganizationList = () => {
  return request.get({ url: '/system/organization/list-all-simple' })
}

// 新增机构
export const addOrganization = (data) => {
  return request.post({ url: '/system/organization/create', data })
}

// 编辑机构
export const updateOrganization = (data) => {
  return request.put({ url: '/system/organization/update', data })
}

// 查询机构详情
export const getOrganizationDetails = (params) => {
  return request.get({ url: '/system/organization/get', params })
}

// 更改主体状态
export const updateEditMajorIndividualStatus = (data) => {
  return request.put({ url: '/system/tenant/update-status', data })
}

// 查询菜单（精简）列表(功能配置模板)
export const getSimpleTenantMenusList = () => {
  return request.get({ url: '/system/tenant/get-package' })
}

// 新增功能配置模板
export const addTenantPackage = (data) => {
  return request.post({ url: '/system/tenant/create-package', data })
}

// 获取功能配置模板详情
export const getTenantPackage = (params) => {
  return request.get({ url: '/system/tenant/get-package', params })
}

// 修改功能配置模板
export const editTenantPackage = (data) => {
  return request.put({ url: '/system/tenant/update-package', data })
}

// 重置密码
export const putResetPassWord = (data) => {
  return request.put({ url: '/system/tenant/update-password', data })
}

// // 查询主体列表
// export const getMajorIndividualList = (params: MajorIndividual) => {
//   return request.get({ url: '/system/tenant/page', params })
// }

// // 查询菜单列表
// export const getMenuList = (params) => {
//   return request.get({ url: '/system/menu/list', params })
// }
//
// // 获取菜单详情
// export const getMenu = (id: number) => {
//   return request.get({ url: '/system/menu/get?id=' + id })
// }
//
// // 新增菜单
// export const createMenu = (data: MenuVO) => {
//   return request.post({ url: '/system/menu/create', data })
// }
//
// // 修改菜单
// export const updateMenu = (data: MenuVO) => {
//   return request.put({ url: '/system/menu/update', data })
// }
//
// // 删除菜单
// export const deleteMenu = (id: number) => {
//   return request.delete({ url: '/system/menu/delete?id=' + id })
// }
