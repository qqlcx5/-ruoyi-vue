import request from '@/config/axios'
import type {DictTypeExportReqVO, DictTypeReqVO, DictTypePageReqVO} from "./types";

// 查询字典（精简)列表
export const listSimpleDictTypeApi = () => {
  return request.get({ url: '/system/tenant-dict-type/list-all-simple' })
}

// 查询字典列表
export const getDictTypePageApi = (params: DictTypePageReqVO) => {
  return request.get({ url: '/system/tenant-dict-type/page', params })
}

// 查询字典详情
export const getDictTypeApi = (id: number) => {
  return request.get({ url: '/system/tenant-dict-type/get?id=' + id })
}

// 新增字典
export const createDictTypeApi = (data: DictTypeReqVO) => {
  return request.post({ url: '/system/tenant-dict-type/create', data })
}

// 修改字典
export const updateDictTypeApi = (data: DictTypeReqVO) => {
  return request.put({ url: '/system/tenant-dict-type/update', data })
}

// 删除字典
export const deleteDictTypeApi = (id: number) => {
  return request.delete({ url: '/system/tenant-dict-type/delete?id=' + id })
}
// 导出字典类型
export const exportDictTypeApi = (params: DictTypeExportReqVO) => {
  return request.get({ url: '/system/tenant-dict-type/export', params })
}

