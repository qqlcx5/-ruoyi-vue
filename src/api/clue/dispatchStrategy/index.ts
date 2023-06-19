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
// 派发成员配置
export const clueDistributeUser = (params) => {
  return request.post({ url: '/clue/clueDistributeUser/page', params })
}
// 获取分页 线索规则设置
export const getClueDistributeRule = (data) => {
  return request.post({ url: '/clue/clueDistributeProductization/query-page', data })
}
// 新增 线索规则设置
export const addClueDistributeRule = (data) => {
  return request.post({ url: '/clue/clueDistributeProductization/create', data })
}
//删除 线索规则设置
export const delClueDistributeRule = (id: string) => {
  return request.get(`/clue/clueDistributeProductization/delete/${id}`)
}
// 详情
export const detailClueDistributeRule = (id: string) => {
  return request.get(`/clue/clueDistributeProductization/detail/${id}`)
}
// 编辑
export const editClueDistributeRule = (data) => {
  return request.post({ url: '/clue/clueDistributeProductization/edit', data })
}
// 获取存在规则门店
export const getExitRuleShop = (id: string) => {
  return request.get({ url: `/clue/clueDistributeProductization/valid/exist-rule-shop`, id })
}
//校验规则名称是否已经存在
export const checkValidRuleName = (id: number, ruleName: string) => {
  return request.get(`/clue/clueDistributeProductization/valid/rule-name/${id}/${ruleName}`)
}
