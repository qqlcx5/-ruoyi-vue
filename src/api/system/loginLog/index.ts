import request from '@/config/axios'

export interface LoginLogVO {
  id: number
  logType: number
  traceId: number
  userId: number
  userType: number
  username: string
  status: number
  userIp: string
  userAgent: string
  createTime: Date
}

export interface LoginLogReqVO extends PageParam {
  userIp?: string
  username?: string
  status?: boolean
  createTime?: Date[]
}

// 查询登录日志列表
export const getLoginLogPageApi = (params: LoginLogReqVO) => {
  return request.get({ url: '/system/login-log/page', params })
}
// 导出登录日志
export const exportLoginLogApi = (params: LoginLogReqVO) => {
  return request.download({ url: '/system/login-log/export', params })
}
// 删除登录日志
export const deleteLoginLogApi = (ids) => {
  return request.delete({ url: `/system/login-log/delete?ids=${ids}` })
}
