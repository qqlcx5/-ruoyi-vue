import request from '@/config/axios'

// 查询部门（精简)列表
export const listSimpleDeptApi = async () => {
  return await request.get({ url: '/system/dept/list-all-simple' })
}
