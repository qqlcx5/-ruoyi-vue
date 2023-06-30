import request from '@/config/axios'

// 通话记录列表
export const getCallRecordList = (data) => {
  return request.post({ url: '/message/callRecord/page', data })
}
// 通话记录详情
export const getCallRecordDetail = (callRecordId: string) => {
  return request.get({ url: `/message/callRecord/details/${callRecordId}` })
}
// 获取通话录音内容
export const queryAudioContent = (data: Recordable) => {
  return request.post({ url: '/message/callRecord/queryAudioContent', data })
}
