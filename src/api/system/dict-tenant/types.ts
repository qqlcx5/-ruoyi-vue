export type DictTypePageReqVO = {
  pageNo: number
  pageSize: number
  name: string
  status: number
  type: string
  createTime: Date[]
}
export type DictTypeReqVO = {
  id: number
  label: string
  value: string
  remark: string
  sort: number
  status: number
  colorType: string
  cssClass: string
  type: string
}
export type DictTypeExportReqVO = {
  name: string
  status: number
  type: string
  createTime: Date[]
}

export type DictDataVO = {
  id: number
  parentId: number
  defaultLevel: number
  sort: number
  label: string
  value: string
  dictType: string
  status: number
  colorType: string
  cssClass: string
  remark: string
  createTime: Date
}
export type DictDataPageReqVO = {
  pageNo: number
  pageSize: number
  label: string
  dictType: string
  status: number
  id: number
}
export type DictDataExportReqVO = {
  label: string
  dictType: string
  status: number
}
