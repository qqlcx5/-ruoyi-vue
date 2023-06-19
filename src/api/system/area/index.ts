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

// 查询行政区划列表
export const getAreaList = () => {
  return request.get({ url: '/system/tenant-area/list' })
}

// 新增子项
export const addChildArea = (data) => {
  return request.post({ url: '/system/tenant-area/create', data })
}

// 编辑行政区划
export const updateArea = (data) => {
  return request.put({ url: '/system/tenant-area/update', data })
}

// 删除行政区划
export const deleteArea = (id: number) => {
  return request.delete({ url: '/system/tenant-area/delete?id=' + id })
}

// 导入模板 行政区划列表
export const getImportAreaList = () => {
  return request.get({ url: '/system/tenant-area/get-import-template' })
}

// 导出 行政区划列表
export const getExportAreaList = () => {
  return request.get({ url: '/system/tenant-area/export-excel' })
}
