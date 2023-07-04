import request from '@/config/axios'

// 分页获取 按揭-金融产品
export const mortgageFinanceProductPage = (data) => {
  return request.post({ url: '/mortgage/manage/mortgageFinanceProduct/page', data })
}

// 分页查询金融机构列表
export const mortgageFinancePage = (data) => {
  return request.post({ url: '/mortgage/manage/mortgageFinance/page', data })
}
