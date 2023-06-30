import request from '@/config/axios'

const module = '/visit/visitSetting'

//回访目的 isAll是否查询全部 是：1 否：0
export const getVisitPurposeList = (visitType, isAll) => {
  return request.get({ url: `${module}/getVisitPurposeList/${visitType}/${isAll}` })
}
// 回访类型
export const getVisitTypeList = (params?) => {
  const url = module + '/getVisitTypeList'
  return request.get({ url, params })
}

// 参考时间
export const getOriginTimeTypeList = (params?) => {
  const url = module + '/getOriginTimeTypeList'
  return request.get({ url, params })
}
// 获取计划回访时间
export const getVisitLimitDay = (params?) => {
  const url = module + '/getVisitLimitDay'
  return request.get({ url, params })
}

// 批量保存回访计划表
export const visitBatchAdd = (data) => {
  const url = module + '/batch/add'
  return request.post({ url, data })
}
// 删除回访计划
export const visitDel = (data) => {
  const url = module + '/delete'
  return request.post({ url, data })
}
// 修改回访计划
export const visitUpdate = (data) => {
  const url = module + '/update'
  return request.post({ url, data })
}
// 修改回访计划 v2
export const updateVisitSetting = (data) => {
  const url = module + '/updateVisitSetting'
  return request.post({ url, data })
}
// 回访计划列表
export const visitList = (data) => {
  const url = module + '/queryPage'
  return request.post({ url, data })
}

// 回访计划详情
export const visitDetail = (visitSettingId) => {
  const url = module + `/queryConfigurationByPk/${visitSettingId}`
  return request.post({ url })
}

// 更新 逾期回收规则状态
export const updateOverDueRecycle = (data) => {
  const url = module + `/updateOverDueRecycle/${data.id}`
  return request.post({ url })
}
// 更新 开启逾期间隔时间状态
export const updateOverdueFlag = (data) => {
  const url = module + `/updateOverdueFlag/${data.id}`
  return request.post({ url })
}

// 更新 回访规则状态
export const updateVisit = (data) => {
  const url = module + `/updateVisit/${data.id}`
  return request.post({ url })
}
// 回访话术内容列表
export const visitContentList = (data) => {
  return request.post({ url: '/visit/visitSettingContent/queryPage', data })
}
// 保存话术内容
export const visitContentAdd = (data) => {
  return request.post({ url: '/visit/visitSettingContent/add', data })
}
// 删除话术内容记录
export const visitContentDelete = (data) => {
  return request.post({ url: '/visit/visitSettingContent/delete', data })
}
// 编辑话术内容
export const visitContentUpdate = (data) => {
  return request.post({ url: '/visit/visitSettingContent/update', data })
}
// 获取回访角色
export const getVisitRoleList = (params) => {
  return request.get({ url: module + '/getVisitRoleList', params })
}
// 获取回访未接通配置
export const getVisitMissCallConfig = () => {
  return request.get({ url: '/visit/config/queryVisitSetting' })
}
// 保存回访未接通配置
export const saveVisitMissCallConfig = (data) => {
  return request.post({ url: '/visit/config/saveVisitSetting', data })
}
// 获取回访关联通话记录配置 0-关闭 1-开启
export const queryVisitSettingCallRecord = () => {
  return request.get({ url: '/visit/config/queryVisitSettingCallRecordV2' })
}
// 保存回访关联通话记录配置 0-关闭 1-开启
export const saveVisitSettingCallRecord = (data) => {
  return request.post({ url: '/visit/config/saveVisitSettingCallRecordV2', data })
}

// 查询回访考核时间配置
export const queryVisitCheckTimeConfig = () => {
  return request.get({ url: '/visit/config/queryVisitCheckTimeConfig' })
}
// 保存回访考核时间配置
export const saveVisitCheckTimeConfig = (data) => {
  return request.post({ url: '/visit/config/saveVisitCheckTimeConfig', data })
}
