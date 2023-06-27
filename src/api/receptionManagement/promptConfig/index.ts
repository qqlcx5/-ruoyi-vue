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

// /reception/aegmn/portraitFactorLevelConfig/allList
// 查询所有因子等级配置
export const allListApi = (data: any) => {
  return request.post({ url: '/reception/mange/portraitFactorLevelConfig/allList', data })
}

// 分页查询通用提示配置
// reception/mange/receptionHintConfig/page
export const receptionHintConfigApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintConfig/page', data })
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
// reception/mange/receptionHintType/allList
// 查询所有提示类型
export const receptionHintTypeAllListApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintType/allList', data })
}
// /admin-api/reception/mange/receptionHintType/saveOrUpdate
// 新增或修改提示类型
export const receptionHintTypeSaveOrUpdateApi = (data: any) => {
  return request.post({ url: '/reception/mange/receptionHintType/saveOrUpdate', data })
}

// ReceptionHintTypeSaveOrUpdateApiParams
