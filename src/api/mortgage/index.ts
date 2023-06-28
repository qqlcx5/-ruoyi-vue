import request from '@/config/axios'
// 查询下订后线索派发配置
export const mortgageFinancePage = (data) => {
  return request.post({ url: '/mortgage/manage/mortgageFinance/page', data })
}
