import request from '@/config/axios'

export interface MajorIndividual {
  pageNo: number
  pageSize: number
  keyword?: string
  systemName?: string
  status?: number
  effectiveStartDate?: Date
  expireTime?: Date
}

// 查询主体列表
export const getMajorIndividualList = (params: MajorIndividual) => {
  return request.get({ url: '/system/tenant/page', params })
}

// 新增主体
export const addMajorIndividual = (data) => {
  return request.post({ url: '/system/tenant/create', data })
}

// 查询主体详情
export const editMajorIndividual = (params) => {
  return request.get({ url: '/system/tenant/get', params })
}

// 编辑主体
export const updateEditMajorIndividual = (data) => {
  return request.put({ url: '/system/tenant/update', data })
}

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
