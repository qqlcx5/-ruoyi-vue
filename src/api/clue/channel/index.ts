import request from '@/config/axios'

export interface ChannelPageReqVO extends PageParam {
  shopId?: string
  clueSourceId?: string
}

export interface ChannelVO {
  serialNumber: string
  clueSourceId: string
  shopId: string
  platformUsername: string
  platformPassword: string
  needFilter: string
  autoDistribute: string
  platformRule: string
  isShow: string
}

// 渠道管理列表
export const getClueChannel = (params: ChannelPageReqVO) => {
  return request.post({ url: '/clue/clueChannel/page', data: params })
}

export const delClueChannel = (ids) => {
  return request.post({ url: '/clue/clueChannel/deleteBath', data: ids })
}

// 获取线索渠道管理详情
export const getClueChannelById = (id: string) => {
  return request.get({ url: '/clue/clueChannel/detail?id=' + id })
}
// 修改线索渠道
export const updateClueChannel = (params: ChannelVO) => {
  return request.post({ url: '/clue/clueChannel/update', data: params })
}
// 新增线索渠道
export const addClueChannel = (params: any) => {
  return request.post({ url: '/clue/clueChannel/batchInsert', data: params })
}
// 更新是否清洗状态 线索渠道管理
export const updateChannelSwitch = (id: string, needFilter: string) => {
  return request.post({ url: `/clue/clueChannel/updateNeedFilter/${id}/${needFilter}` })
}

// 获取 线索来源管理
export const getClueSourceManageList = () => {
  return request.post({ url: '/clue/clueSourceManage/list' })
}

// 保存 线索来源管理
export const clueSourceManageAdd = (params) => {
  return request.post({ url: '/clue/clueSourceManage/add', data: params })
}

// 删除 线索来源管理
export const clueSourceManageDelete = (params) => {
  return request.post({ url: `/clue/clueSourceManage/delete/${params.id}`, data: params })
}

// 修改 线索来源管理
export const clueSourceManageUpdate = (params) => {
  return request.post({ url: '/clue/clueSourceManage/update', data: params })
}
