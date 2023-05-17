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

// 查询成员管理列表
export const getMemberList = (params: MajorIndividual) => {
  return request.get({ url: '/system/user/extra/page', params })
}

// 获取岗位类型
export const getPostTypeList = () => {
  return request.get({ url: '/system/post-type/list-all-simple'})
}

// 获取岗位列表
export const getPostList = () => {
  return request.get({ url: '/system/post/list-all-simple'})
}

// 获取角色信息
export const getRolesList = () => {
  return request.get({ url: '/system/role/list-all-simple'})
}

// 新增成员
export const addMember = (data) => {
  return request.post({ url: '/system/user/create', data })
}

// 编辑成员
export const updateMember= (data) => {
  return request.put({ url: '/system/user/update', data })
}

// 查询成员详情
export const getMemberDetails = (params) => {
  return request.get({ url: '/system/user/get', params })
}

// 更改成员状态
export const updateMemberStatus = (data) => {
  return request.put({ url: '/system/user/update-status', data })
}

// 删除成员
export const deleteMember = (id: number) => {
  return request.delete({ url: '/system/user/delete?id=' + id })
}




// 重置密码
export const putResetPassWord = (data) => {
  return request.put({ url: '/system/tenant/update-password', data })
}
