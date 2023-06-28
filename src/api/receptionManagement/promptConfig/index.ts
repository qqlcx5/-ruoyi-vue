import request from '@/config/axios'

// export interface ChannelExportReqVO {
//   code?: string
//   status?: number
//   remark?: string
//   feeRate?: number
//   merchantId?: number
//   appId?: number
//   config?: string
//   createTime?: Date[]
// }

export interface ReceptionHintTypeSaveOrUpdateApiParams {
  id?: number
  typeKey?: string
  typeName?: string
  status?: number
  remark?: string
  createTime?: Date[]
}
/* -------------------------------- // 通用提示配置 ------------------------------- */
// /admin-api/reception/mange/receptionHintConfig/saveOrUpdate
// 新增或修改通用提示配置
export const receptionHintConfigSaveOrUpdateApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintConfig/saveOrUpdate', data })
}
// /admin-api/reception/mange/receptionHintConfig/updateStatus
// 修改通用提示配置状态
export const receptionHintConfigUpdateStatusApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintConfig/updateStatus', data })
}
// /admin-api/reception/mange/receptionHintConfig/queryList
// 查询通用提示配置列表
export const receptionHintConfigQueryListApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintConfig/queryList', data })
}
// /admin-api/reception/mange/receptionHintConfig/page
// 分页查询通用提示配置
export const receptionHintConfigPageApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintConfig/page', data })
}
// /admin-api/reception/mange/receptionHintConfig/detail/{id}
// 查询通用提示配置详情
export const receptionHintConfigDetailApi = (data: any) => {
  return request.get({ url: '/reception/mange/receptionHintConfig/detail/{id}', data })
}
// /admin-api/reception/mange/receptionHintConfig/batchDelete
// 批量删除通用提示配置
export const receptionHintConfigBatchDeleteApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintConfig/batchDelete', data })
}

/* ------------------------------ // 查询所有因子等级配置 ----------------------------- */
// /admin-api/reception/mange/portraitFactorLevelConfig/allList
// 查询所有因子等级配置
export const portraitFactorLevelConfigAllListApi = (data: any) => {
  return request.post({ url: '/reception/mange/portraitFactorLevelConfig/allList', data })
}
// /admin-api/reception/mange/portraitFactorLevelConfig/batchDelete
// 批量删除因子等级配置
export const portraitFactorLevelConfigBatchDeleteApi = (data: any) => {
  return request.post({ url: '/reception/mange/portraitFactorLevelConfig/batchDelete', data })
}
// /admin-api/reception/mange/portraitFactorLevelConfig/saveOrUpdate
// 新增或修改因子等级配置
export const portraitFactorLevelConfigSaveOrUpdateApi = (data: any) => {
  return request.post({ url: '/reception/mange/portraitFactorLevelConfig/saveOrUpdate', data })
}

/* -------------------------------- 必讲提示列表 -------------------------------- */
// /reception/mange/receptionMustSayConfig/list
// 查询必讲提示列表
export const receptionMustSayConfigApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionMustSayConfig/list', data })
}
// /admin-api/reception/mange/receptionMustSayConfig/saveOrUpdate
// 新增或修改必讲提示
export const saveOrUpdateApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionMustSayConfig/saveOrUpdate', data })
}
// /admin-api/reception/mange/receptionMustSayConfig/updateStatus
// 修改必讲提示状态
export const updateStatusApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionMustSayConfig/updateStatus', data })
}

/* -------------------------------- 查询所有提示类型 -------------------------------- */
// 查询所有提示类型
// reception/mange/receptionHintType/allList
export const receptionHintTypeAllListApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintType/allList', data })
}
// 新增或修改提示类型
// admin-api/reception/mange/receptionHintType/saveOrUpdate
export const receptionHintTypeSaveOrUpdateApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintType/saveOrUpdate', data })
}

// 分页查询通用提示配置
// reception/mange/receptionHintConfig/page
export const receptionHintConfigApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintConfig/page', data })
}
// /admin-api/reception/mange/receptionHintType/page
// 分页查询提示类型
export const receptionHintTypePageApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintType/page', data })
}
// /admin-api/reception/mange/receptionHintType/batchDelete
// 批量删除提示类型
export const receptionHintTypeBatchDeleteApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintType/batchDelete', data })
}
