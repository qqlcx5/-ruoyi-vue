import request from '@/config/axios'

// 派发策略门店成员列表
export const getDistributeShopUserList = (params) => {
  return request.post({ url: 'clue/v2.0/mange/clueDistribute/shop/user/list', params })
}
// 分页查询线索派发策略
export const getClueDistribute = (params) => {
  return request.post({ url: '/clue/v2.0/mange/clueDistribute/page', params })
}
// 删除派发策略
export const delStrategy = (params) => {
  return request.post({ url: '/clue/mange/clueDistribute/batchDelete', params })
}
// 派发策略详情
export const clueDistributeDetailV2 = (id: string) => {
  return request.get(`clue/v2.0/mange/clueDistribute/detail/${id}`)
}
// 编辑派发策略 新
export const clueDistributeUpdateV2 = (params) => {
  return request.post({ url: 'clue/v2.0/mange/clueDistribute/update', params })
}
// 新增派发策略 新
export const clueDistributeSaveV2 = (params) => {
  return request.post({ url: 'clue/v2.0/mange/clueDistribute/insert', params })
}
