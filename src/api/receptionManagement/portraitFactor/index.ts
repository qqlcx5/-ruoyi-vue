import request from '@/config/axios'

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
