import request from '@/config/axios'

// 获取所有品牌
export const getAllBrand = async () => {
  return await request.get({ url: '/model/brand/get/all/brand' })
}
