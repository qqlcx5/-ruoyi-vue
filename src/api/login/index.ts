import request from '@/config/axios'
import { getRefreshToken } from '@/utils/auth'
import type { UserLoginVO } from './types'

export interface CodeImgResult {
  captchaOnOff: boolean
  img: string
  uuid: string
}
export interface SmsCodeVO {
  mobile: string
  scene: number
}
export interface SmsLoginVO {
  phone: string
  code: string
}

// 登录
export const loginApi = (data: UserLoginVO) => {
  return request.post({ url: '/system/auth/login', data })
}

// 刷新访问令牌
export const refreshToken = () => {
  return request.post({ url: '/system/auth/refresh-token?refreshToken=' + getRefreshToken() })
}

// 使用租户名，获得租户编号
export const getTenantIdByNameApi = (name: string) => {
  return request.get({ url: '/system/tenant/get-id-by-name?name=' + name })
}

// 登出
export const loginOutApi = () => {
  return request.post({ url: '/system/auth/logout' })
}

// 获取用户权限信息
export const getInfoApi = () => {
  return request.get({ url: '/system/auth/get-permission-info' })
}

// 路由
export const getAsyncRoutesApi = () => {
  return request.get({ url: '/system/auth/list-menus' })
}

//获取登录验证码
export const sendSmsCodeApi = (data: SmsCodeVO) => {
  return request.post({ url: '/system/auth/send-sms-code', data })
}

// 短信验证码登录
export const smsLoginApi = (data: SmsLoginVO) => {
  return request.post({ url: '/system/auth/sms-login', data })
}

// 社交授权的跳转
export const socialAuthRedirectApi = (type: number, redirectUri: string) => {
  return request.get({
    url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
  })
}
// 获取验证图片  以及token
export const getCodeApi = (data) => {
  return request.postOriginal({ url: 'system/captcha/get', data })
}

// 滑动或者点选验证
export const reqCheckApi = (data) => {
  return request.postOriginal({ url: 'system/captcha/check', data })
}

// 根据账号密码获取用户的主体信息
export const getTenantUser = (data) => {
  return request.post({ url: '/system/auth/get-tenant/user', data })
}

// 根据手机号获取用户的主体信息
export const getTenantPhone = (data) => {
  return request.post({ url: '/system/auth/get-tenant/phone', data })
}

// 根据当前用户获取用户的主体信息
export const getTenantById = (data) => {
  return request.post({ url: '/system/auth/get-tenant', data })
}

// 切换主体后，主体token信息
export const handoffTenant = (data) => {
  return request.post({ url: '/system/auth/handoff-tenant', data })
}

// 设置默认主体（未登录）
export const updateDefaultTenant = (data) => {
  return request.put({ url: '/system/auth/default-tenant/update', data })
}

// 设置默认主体
export const updateDefaultTenantByUserName = (data) => {
  return request.put({ url: '/system/auth/default-tenant/update-username', data })
}
