import request from '@/config/axios'

// 派发策略详情
export const getClueChannelTree = () => {
  return request.get({ url: '/clue/clueChannel/getTree' })
}

// 派发策略门店成员列表
export const getDistributeShopUserList = (data) => {
  return request.post({ url: 'clue/v2.0/mange/clueDistribute/shop/user/list', data })
}
// 分页查询线索派发策略
export const getClueDistribute = (data) => {
  return request.post({ url: '/clue/v2.0/mange/clueDistribute/page', data })
}
// 删除派发策略
export const delStrategy = (params) => {
  return request.get({ url: `/clue/v2.0/mange/clueDistribute/delete`, params })
}
// 派发策略详情
export const clueDistributeDetailV2 = (id: string) => {
  return request.get(`clue/v2.0/mange/clueDistribute/detail/${id}`)
}
// 编辑派发策略 新
export const clueDistributeUpdateV2 = (data) => {
  return request.post({ url: 'clue/v2.0/mange/clueDistribute/update', data })
}
// 新增派发策略 新
export const clueDistributeSaveV2 = (data) => {
  return request.post({ url: 'clue/v2.0/mange/clueDistribute/insert', data })
}
// 派发成员配置
export const clueDistributeUser = (data) => {
  return request.post({ url: '/clue/clueDistributeUser/page', data })
}
// 新增派发人员
export const addClueDistributeUser = (data) => {
  return request.post({ url: '/clue/clueDistributeUser/insert', data })
}
// 编辑派发人员
export const editClueDistributeUser = (data) => {
  return request.post({ url: '/clue/clueDistributeUser/update', data })
}
// 详情
export const getClueDistributeUserDetail = (shopId: string) => {
  return request.get({ url: `/clue/clueDistributeUser/detail/${shopId}` })
}
// 批量删除
export const batchDelClueDistributeUser = (data) => {
  return request.post({ url: '/clue/clueDistributeUser/batch/delete', data })
}
// 修改派单状态
export const updateClueDistributeUserStatus = (id: string) => {
  return request.post({ url: `/clue/clueDistributeUser/update/status/${id}` })
}
//开启-关闭请假功能
export const updateIsEnableLeaveFunc = (data) => {
  return request.post({ url: `/clue/clueDistributeUser/updateIsEnableLeaveFunc`, data })
}
//修改跟进是否回推厂家
export const updatePushBackFactoryStatus = (id: string) => {
  return request.post({ url: `/clue/clueDistributeUser/updatePushBackFactoryStatus/${id}` })
}
// 获取分页 线索规则设置
export const getClueDistributeRule = (data) => {
  return request.post({ url: '/clue/clueDistributeProductization/query-page', data })
}
// 新增 线索规则设置
export const addClueDistributeRule = (data) => {
  return request.post({ url: '/clue/clueDistributeProductization/create', data })
}
// 开启-关闭考核规则设置(产品化)
export const changeClueDistributeRule = (id: number, status: number) => {
  return request.get({
    url: `/clue/clueDistributeProductization/update/open-rule/${id}/${status}`
  })
}
//详情 线索考核规则设置(产品化)
export const getClueDistributeRuleDetail = (id: number) => {
  return request.get({
    url: `/clue/clueDistributeProductization/detail/${id}`
  })
}

//删除 线索规则设置
export const delClueDistributeRule = (id: string) => {
  return request.get(`/clue/clueDistributeProductization/delete/${id}`)
}

// 编辑
export const editClueDistributeRule = (data) => {
  return request.post({ url: '/clue/clueDistributeProductization/edit', data })
}

//校验规则名称是否已经存在
export const checkValidRuleName = (id: number, ruleName: string) => {
  return request.get({
    url: `/clue/clueDistributeProductization/valid/rule-name/${id}/${ruleName}`
  })
}

//
export const hehe = () => {
  return request.get({ url: '/clue/clueChannel/getTree' })
}
