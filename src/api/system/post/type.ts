import request from '@/config/axios'

export interface PostVO {
  id?: number
  name: string
  code: string
  status?: number
  remark?: string
  sort?: number
  createTime?: Date
}

export interface batchPostVO {
  postTypelist: PostVO[]
}

export interface PostPageReqVO extends PageParam {
  code?: string
  name?: string
  status?: number
}

export interface PostExportReqVO {
  code?: string
  name?: string
  status?: number
}

// 查询岗位列表
export const getPostPageApi = async (params: PostPageReqVO) => {
  return await request.get({ url: '/system/post-type/page', params })
}

// 获取岗位精简信息列表
export const listSimplePostsApi = async () => {
  return await request.get({ url: '/system/post-type/list-all-simple' })
}

// 查询岗位详情
export const getPostApi = async (id: number | string) => {
  return await request.get({ url: '/system/post-type/get?id=' + id })
}

// 新增岗位
export const createPostApi = async (data: PostVO[]) => {
  return await request.post({ url: '/system/post-type/create', data })
}

// 批量新增岗位
export const batchCreatePostApi = async (data: batchPostVO) => {
  return await request.post({ url: '/system/post-type/create/batch', data })
}

// 修改岗位
export const updatePostApi = async (data: PostVO) => {
  return await request.put({ url: '/system/post-type/update', data })
}

// 删除岗位
export const deletePostApi = async (id: number) => {
  return await request.delete({ url: '/system/post-type/delete?id=' + id })
}

// 导出岗位
export const exportPostApi = async (params: PostExportReqVO) => {
  return await request.download({ url: '/system/post-type/export', params })
}

// 岗位类型下的岗位数量
export const postTypePostCount = async (id: number) => {
  return await request.get({ url: '/system/post-type/get/post-count?id=' + id })
}
