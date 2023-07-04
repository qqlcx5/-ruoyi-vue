import request from '@/config/axios'

// // /admin-api/reception/mange/portraitFactorLevelConfig/allList
// /* ------------------------------ // 查询所有因子等级配置 ----------------------------- */
// export const portraitFactorLevelConfigAllListApi = (data: any) => {
//   return request.post({ url: '/reception/mange/portraitFactorLevelConfig/allList', data })
// }
// // /admin-api/reception/mange/portraitFactorLevelConfig/batchDelete
// // 批量删除因子等级配置
// export const portraitFactorLevelConfigBatchDeleteApi = (data: any) => {
//   return request.post({ url: '/reception/mange/portraitFactorLevelConfig/batchDelete', data })
// }
// // /admin-api/reception/mange/portraitFactorLevelConfig/saveOrUpdate
// // 新增或修改因子等级配置
// export const portraitFactorLevelConfigSaveOrUpdateApi = (data: any) => {
//   return request.post({ url: '/reception/mange/portraitFactorLevelConfig/saveOrUpdate', data })
// }

// reception/mange/receptionManage/page
// 分页查询接待管理列表
export const receptionManagePageApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionManage/page', data })
}
// /admin-api/reception/mange/receptionManage/detail/{id}
// 查询接待管理详情
export const receptionManageDetailApi = (params: any) => {
  return request.get({ url: '/reception/mange/receptionManage/detail/' + params })
}
// reception/mange/receptionManage/statistics
// 查询接待管理统计
export const receptionManageStatisticsApi = (data) => {
  return request.post({ url: '/reception/mange/receptionManage/statistics', data })
}
//admin-api/reception/mange/receptionManage/cancelReception
// 取消接待
export const receptionManageCancelReceptionApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionManage/cancelReception', data })
}
// /reception/mange/receptionManage/pageOperateLog
// 分页查询操作日志
export const receptionManagePageOperateLogApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionManage/pageOperateLog', data })
}
