import request from '@/config/axios'

export interface ChannelPageReqVO extends PageParam {
  shopName?: string
  sourceName?: string
}

export interface ChannelVO {
  serialNumber: string
  sourceName: string
  shopName: string
  platformUsername: string
  platformPassword: string
  needFilter: string
  autoDistribute: string
  platformRule: string
  isShow: string
}

export const getClueChannel = (params: ChannelPageReqVO) => {
  return request.post({ url: '/clue/clueChannel/page', params })
}

export const delClueChannel = (ids: string[]) => {
  return request.post({ url: '/clue/clueChannel/deleteBath', ids })
}

// 获取线索渠道管理详情
export const getClueChannelById = (id: string) => {
  return request.get({ url: '/clue/clueChannel/detail?id=' + id })
}
// 修改线索渠道
export const updateClueChannel = (params: ChannelVO) => {
  return request.post({ url: '/clue/clueChannel/update', params })
}
// 新增线索渠道
export const addClueChannel = (params: ChannelVO) => {
  return request.post({ url: '/clue/clueChannel/batchInsert', params })
}
// 更新是否清洗状态 线索渠道管理
export const updateChannelSwitch = (id: string, needFilter: string) => {
  return request.post({ url: `/clue/clueChannel/updateNeedFilter/${id}/${needFilter}` })
}
