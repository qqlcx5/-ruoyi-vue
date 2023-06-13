import request from '@/config/axios'

// 派发策略门店成员列表
export const getDistributeShopUserList = (params) => {
  return request.post({ url: 'clue/v2.0/mange/clueDistribute/shop/user/list', params })
}
