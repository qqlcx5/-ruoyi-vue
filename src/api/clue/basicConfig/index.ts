import request from '@/config/axios'
// 查询下订后线索派发配置
export const queryClueDistributeConfig = () => {
  return request.post({ url: '/clue/config/queryClueDistributeConfig' })
}
// 保存下订后线索派发配置
export const saveClueDistributeConfig = (data) => {
  return request.post({ url: '/clue/config/saveClueDistributeConfig', data })
}

// 查询线索抢单(接单)配置
export const queryClueGrabConfig = () => {
  return request.get({ url: '/clue/config/queryClueGrabConfig' })
}
export const saveClueGrabConfig = (data) => {
  return request.post({ url: '/clue/config/saveClueGrabConfig', data })
}
