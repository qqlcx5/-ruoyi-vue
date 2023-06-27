import request from '@/config/axios'

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
export const getOrganizationTypeList = (params) => {
  return request.get({ url: '/system/tenant-dict-data/list-all-simple', params })
}

// 获取上级机构列表
export const getSimpleOrganizationList = (params) => {
  return request.get({ url: '/system/organization/list-all-simple', params })
}

// 获取上级机构列表 子门店 获取上级门店
export const getStoreList = (params) => {
  return request.get({ url: '/system/organization/store-list', params })
}

// 获取上级机构列表() 成员管理 左侧 部门
export const getDeptList = (params) => {
  return request.get({ url: '/system/user/extra/list-org', params })
}

// 新增机构
export const addOrganization = (data) => {
  return request.post({ url: '/system/organization/create', data })
}

// 新增机构 门店 主体管理页面
export const addOrganizationStore = (data) => {
  return request.post({ url: '/system/organization/create-tenant-store', data })
}

// 编辑机构
export const updateOrganization = (data) => {
  return request.put({ url: '/system/organization/update', data })
}

// 编辑机构 门店 主体管理页面
export const updateOrganizationStore = (data) => {
  return request.put({ url: '/system/organization/tenant-update-store', data })
}

// // 查询机构列表
// export const getMemberNum = (params) => {
//   return request.get({ url: '/system/organization/tenant-child-store-count', params })
// }

// 获取机构在职状态开启的员工
export const getActiveEmployeesNumber = (params) => {
  return request.get({ url: '/system/organization/active_users', params })
}

// 更改机构状态
export const updateOrganizationStatus = (data) => {
  return request.put({ url: '/system/organization/update-status', data })
}

// 更改机构状态 门店 主体管理页面
export const updateOrganizationStoreStatus = (data) => {
  return request.put({ url: '/system/organization/update-store-status', data })
}

// 设置(新增)属性
export const addAttribute = (data) => {
  return request.post({ url: '/system/organization/create_rel', data })
}

// 修改属性
export const updateAttribute = (data) => {
  return request.put({ url: '/system/organization/update_rel', data })
}

// 查询机构详情
export const getOrganizationDetails = (params) => {
  return request.get({ url: '/system/organization/get', params })
}

// 查询机构详情 门店 主体管理页面
export const getOrganizationStoreDetails = (params) => {
  return request.get({ url: '/system/organization/get-tenant-store', params })
}

// 删除机构
export const deleteOrganization = (id: number) => {
  return request.delete({ url: '/system/organization/delete?id=' + id })
}
// 获取当前主体的门店信息列表
export const getAllStoreList = async () => {
  return await request.get({ url: '/system/organization/all-store-list' })
}

// 获取当前主题的门店信息列表   新
export const getAreaStoreList = async () => {
  return await request.get({ url: '/system/organization/area-store-list' })
}
