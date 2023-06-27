import request from '@/config/axios'

/** 获取选择成员规则树 */
export const getMemberRuleTree = (type: string) => {
  return request.get({ url: `/system/user-rules/query-rule-tree/${type}` })
}

/** 获取选择成员规则列表 */
export const getMemberRuleList = (data) => {
  return request.post({ url: '/system/user-rules/query-page', data })
}

/** 新增选择成员规则 */
export const addMemberRule = (data) => {
  return request.post({ url: '/system/user-rules/create', data })
}

/** 删除选择成员规则 */
export const delMemberRule = (params: { ids: number[] }) => {
  return request.get({ url: '/system/user-rules/delete', params })
}

/** 修改选择成员规则 */
export const setMemberRule = (data) => {
  return request.post({ url: '/system/user-rules/edit', data })
}

/** 一键生成选择成员规则 */
export const autoSetMemberRule = (data) => {
  return request.post({ url: '/system/user-rules/quick-operation', data })
}

/** 获取提示内容 */
export const getTipsData = (ruleValue, ruleName) => {
  return request.get({
    url: `/system/user-rules/get-tip-string/${ruleValue}/${ruleName}`
  })
}

/** 查询指定规则下已分配门店id */
export const getHasShopId = (ruleValue) => {
  return request.get({
    url: `/system/user-rules/query-assigned-shop/${ruleValue}`
  })
}
