import request from '@/config/axios'
import { getTenantId } from '@/utils/auth'
const regVersion = import.meta.env.VITE_REG_VERSION

export type MemberListParams = {
  /**  查询用户所属门店 */
  belongShopid: number[]
  /** 业务所属品牌id */
  businessBrandValue?: number
  /** 业务所属市编码 */
  businessCityCode?: string
  /** 业务所属区编码 */
  businessCountyCode?: string
  /** 业务所属省编码	 */
  businessProvinceCode?: string
  /** 选择成员规则编码 */
  childRuleValue?: string
}

export type UserMemberList = {
  /** 门店id */
  storeIds: number[]
  /** 岗位id */
  postIds: number[]
}

/** 文件上传 */
export const uploadFile = async (data) => {
  return await request.upload({
    url: '/infra/file/upload',
    headers: {
      'tenant-id': getTenantId(),
      'Reg-Version': regVersion
    },
    data
  })
}

// 获取树形门店数据
export const treeShopData = async () => {
  return await request.get({ url: '/system/department/get/shop/tree' })
}

/** 获取成员列表 */
export const getMemberDataList = async (data: MemberListParams) => {
  return await request.post({ url: '/system/user-rules/query-user', data })
}

/** 获取成员列表（树形） */
export const getMemberTreeDataList = async (data: MemberListParams) => {
  return await request.post({ url: '/system/user-rules/query-user-tree', data })
}

/** 获取岗位列表 */
export const getPostDataList = () => {
  return request.get({ url: '/system/post/list-all-simple' })
}

/** 获取适用门店列表 */
export const getShopDataList = () => {
  return request.get({ url: '/system/organization/area-store-list' })
}

/** 获取用户精简信息列表 */
export const getUserMemberDataList = (params?: Partial<UserMemberList>) => {
  return request.get({ url: '/system/user/list-all-simple', params })
}
