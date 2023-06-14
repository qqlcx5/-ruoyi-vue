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

// 修改主体 系统名称 - - 系统logo
export const putUserNameLogo = (data) => {
  return request.put({ url: '/system/tenant/update-system', data })
}

// 查询主体列表
export const getMajorIndividualList = (params: MajorIndividual) => {
  return request.get({ url: '/system/tenant/list', params })
}

// 查询门店顶层的手机号
export const getTopPhone = (params) => {
  return request.get({ url: '/system/tenant/get-top-phone', params })
}

// 查询门店子机构数
export const getChildStoreNum = (params) => {
  return request.get({ url: '/system/tenant/tenant-child-store-count', params })
}

// 获取上级主体列表
export const getSimpleTenantList = () => {
  return request.get({ url: '/system/tenant/list-all-simple' })
}

// 新增主体
export const addMajorIndividual = (data) => {
  return request.post({ url: '/system/tenant/create', data })
}

// 查询主体详情
export const getMajorIndividualDetails = (params) => {
  return request.get({ url: '/system/tenant/get', params })
}

// 编辑主体
export const updateEditMajorIndividual = (data) => {
  return request.put({ url: '/system/tenant/update', data })
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

// 新增机构 门店 主体管理页面
export const addStore = (data) => {
  return request.post({ url: '/system/tenant/create-tenant-store', data })
}

// 新增机构 子门店 主体管理页面
export const addChildStore = (data) => {
  return request.post({ url: '/system/tenant/create-tenant-child-store', data })
}

// 编辑机构 门店 主体管理页面
export const updateStore = (data) => {
  return request.put({ url: '/system/tenant/tenant-update-store', data })
}

// 更改机构状态 门店 主体管理页面
export const updateStoreStatus = (data) => {
  return request.put({ url: '/system/tenant/update-store-status', data })
}

// 查询 门店 修改上级主体 是否能迁移
export const getCheckMajorIndividual = (params: MajorIndividual) => {
  return request.get({ url: '/system/tenant/check-migrate', params })
}

// 门店 修改上级主体 迁移
export const updateParentMajorIndividual = (data) => {
  return request.put({ url: '/system/tenant/migrate', data })
}

// 查询机构详情 门店 主体管理页面
export const getStoreDetails = (params) => {
  return request.get({ url: '/system/tenant/get-tenant-store', params })
}

// 获取经销商门店精简信息列表
export const getListDealerStore = () => {
  return request.get({ url: '/system/tenant/list-dealer-store' })
}
