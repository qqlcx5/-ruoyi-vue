import request from '@/config/axios'
// 查询下订后线索派发配置
export const queryClueDistributeConfig = () => {
  return request.post({ url: '/clue/config/queryClueDistributeConfig' })
}
// 保存下订后线索派发配置
export const saveClueDistributeConfig = (data) => {
  return request.post({ url: '/clue/config/saveClueDistributeConfig', data })
}

// 查询线索抢单(接单)配置
export const queryClueGrabConfig = () => {
  return request.get({ url: '/clue/config/queryClueGrabConfig' })
}
// 保存线索抢单(接单)配置
export const saveClueGrabConfig = (data) => {
  return request.post({ url: '/clue/config/saveClueGrabConfig', data })
}

// 查询线索跟进配置
export const queryClueFollowConfig = () => {
  return request.post({ url: '/clue/config/queryClueFollowConfig' })
}
// 保存线索跟进配置
export const saveClueFollowConfig = (data) => {
  return request.post({ url: '/clue/config/saveClueFollowConfig', data })
}

// 创建 线索考核规则设置(产品化)
export const createAssessRule = (data) => {
  return request.post({ url: '/clue/clueDistributeCheckProductization/create', data })
}
// 校验规则名称是否已经存在
export const checkRuleName = (params) => {
  return request.get({
    url: `/clue/clueDistributeCheckProductization/valid/check-rule-name/${params.id}/${params.ruleName}`
  })
}
// 获取分页 线索考核规则设置(产品化)
export const queryAssessRulePage = (data) => {
  return request.post({ url: '/clue/clueDistributeCheckProductization/query-page', data })
}
// 开启-关闭考核规则设置(产品化)
export const updateRuleStatus = ({ id, status }) => {
  return request.get({
    url: `/clue/clueDistributeCheckProductization/update/open-rule/${id}/${status}`
  })
}
// 删除 线索考核规则设置(产品化)
export const deleteAssessRule = (params) => {
  return request.get({ url: `/clue/clueDistributeCheckProductization/delete/${params.id}` })
}
// 详情 线索考核规则设置(产品化)
export const detailAssessRule = (params) => {
  return request.get({ url: `/clue/clueDistributeCheckProductization/detail/${params.id}` })
}
// 获取存在的规则门店
export const existRuleShop = async () => {
  return await request.get({ url: '/clue/clueDistributeCheckProductization/valid/exist-rule-shop' })
}
// 编辑 线索考核规则设置(产品化)
export const editAssessRule = (data) => {
  return request.post({ url: '/clue/clueDistributeCheckProductization/edit', data })
}

// 创建 线索重复周期
export const addRepetitionPeriod = (data) => {
  return request.post({ url: '/clue/clueRepetitionPeriod/add', data })
}
// 删除 线索重复周期
export const deleteBatchRepetitionPeriod = (data) => {
  return request.post({ url: '/clue/clueRepetitionPeriod/deleteBatch', data })
}
// 分页获取 线索重复周期
export const pageRepetitionPeriod = (data) => {
  return request.post({ url: '/clue/clueRepetitionPeriod/page', data })
}
// 根据ID获取 线索重复周期
export const detailRepetitionPeriod = (params) => {
  return request.get({ url: `/clue/clueRepetitionPeriod/queryById`, params })
}
// 修改 线索重复周期
export const updateRepetitionPeriod = (data) => {
  return request.post({ url: '/clue/clueRepetitionPeriod/update', data })
}
// 更新状态 线索重复周期
export const updateEnableRepetitionPeriod = (data) => {
  return request.post({ url: '/clue/clueRepetitionPeriod/updateEnable', data })
}
