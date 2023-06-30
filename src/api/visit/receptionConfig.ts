import request from '@/config/axios'

const module = '/reception/mange/receptionVisitSetting'

// 接待录音关联回访规则
export const getList = (data) => {
  return request.post({ url: module + '/page', data })
}
// 新增
export const addApi = (data) => {
  return request.post({ url: module + '/add', data })
}
// 删除
export const deleteApi = (data) => {
  return request.post({ url: module + '/delete', data })
}
// 修改
export const updateApi = (data) => {
  return request.post({ url: module + '/update', data })
}
// 修改状态
export const updateStatus = (data) => {
  return request.post({ url: module + '/updateStatus', data })
}
// 获取接待状态类型
export const getReceptionStatuslList = (params?) => {
  return request.get({ url: module + '/getReceptionStatuslList', params })
}
// 获取意向等级类型
export const getIntentionLevelList = (params?) => {
  return request.get({ url: module + '/getIntentionLevelList', params })
}
// 获取到店类型
export const getEnterShopTypelList = (params?) => {
  return request.get({ url: module + '/getEnterShopTypelList', params })
}
