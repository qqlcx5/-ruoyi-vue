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

// 获取机构在职状态开启的员工
export const getActiveEmployeesNumber = (params) => {
  return request.get({ url: '/system/organization/active_users', params })
}

// 更改机构状态
export const updateOrganizationStatus = (data) => {
  return request.put({ url: '/system/organization/update-status', data })
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

// 删除机构
export const deleteOrganization = (id: number) => {
  return request.delete({ url: '/system/organization/delete?id=' + id })
}
