import request from '@/config/axios'
import { getTenantId } from '@/utils/auth'
const regVersion = import.meta.env.VITE_REG_VERSION

/** 文件上传 */
export const uploadFile = async (data) => {
  return await request.upload({
    url: '/infra/file/upload',
    headers: {
      'tenant-id': getTenantId(),
      'Reg-Version': regVersion
    },
    data
  })
}

// 获取树形门店数据
export const treeShopData = async () => {
  return await request.get({ url: '/system/department/get/shop/tree' })
}
