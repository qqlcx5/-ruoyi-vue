import request from '@/config/axios'

/** 添加分组 */
export const addGroup = (data: {
  appraiseTypeName: string
  appraiseTypeId?: number
  status?: number
}) => {
  return request.post({ url: '/appraise/type/create', data })
}

/** 删除分组 */
export const delGroup = (data: { ids: number[] }) => {
  return request.post({ url: '/appraise/type/batch/delete', data })
}

/** 题目分组列表 */
export const getGroupList = () => {
  return request.get<Questionnaire.GroupList[]>({ url: '/appraise/type/query/all' })
}

/** 批量删除题目 */
export const delTopic = (data: { ids: number[] }) => {
  return request.post({ url: '/appraise/topic/batch/delete', data })
}

/** 修改列表状态 */
export const setTopicStatus = (data: { id: number; status: number }) => {
  return request.post({ url: '/appraise/topic/update/status', data })
}
