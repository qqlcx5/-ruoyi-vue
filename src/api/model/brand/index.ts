import request from '@/config/axios'

// 获取所有品牌
export const getAllBrand = async () => {
  return await request.get({ url: '/model/brand/get/all/brand' })
}
// 根据多个品牌查询车系列表(带上级品牌)
export const querySeriesDetailsBelowBrand = async (data) => {
  return await request.post({ url: '/model/series/details/querySeriesDetailsBelowBrand', data })
}
