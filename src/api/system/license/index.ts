import request from '@/config/axios'

export const uploadLicenseFile = (data) => {
  console.log('uploadData', data)
  return request.upload({ url: '/system/license/reload', data: data })
}
