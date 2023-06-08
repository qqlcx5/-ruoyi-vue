interface InfoItem {
  textSpan: string
  text: string
  isSuperAdmin?: boolean
  imgUrl?: string
}

interface TreeItem {
  id: string
  name: string
}

interface DetailsInfoItem {
  baseTitle: string
  infoArr?: InfoItem[]
  treeArr?: TreeItem[]
}

interface FormState {
  majorIndividualType?: string
  belongTenantId?: null
  code?: string
  name?: string
  abbreviate?: string
  systemName?: string
  logoUrl?: string
  contactName?: string
  contactMobile?: string
  effectiveStartEndTime?: string[]
  accountCount?: number | undefined
  bindingDomainName?: string
  bindingDomainNameBefore?: string
  status?: boolean
  creditCode?: string
  legalRepresentative?: string
  legalMobile?: string
  legalIdentityUrl?: string
  establishDate?: string
  companyAddress?: string[]
  cascadeInfo?: string[]
  detailedAddress?: string
  businessLicenseUrl?: string
}

export interface State {
  isSuperAdmin?: boolean
  belongTenantId?: null
  record?: Record<string, unknown>
  messageContactMobile?: string
  messageText?: string
  canSendCode?: boolean
  codeCountdown?: number
  messageCode?: string
  messageBtnText?: string
  total?: number
  statusOptions?: { value: number; label: string }[]
  loading?: boolean
  rawData?: unknown[]
  tableDataList?: unknown[]
  tableDataArr?: unknown[]
  treeIconIndex?: number
  isExpandAll?: boolean
  refreshTable?: boolean
  isFullScreen?: boolean
  isShow?: boolean
  isShowStore?: boolean
  isShowStoreDetails?: boolean
  currentTabs?: string
  storeType?: string
  isShowPermission?: boolean
  isShowMessage?: boolean
  isShowStatus?: boolean
  isShowDateStatus?: boolean
  isShowParentMajorIndividual?: boolean
  dateTime?: Record<string, unknown>
  messageTitle?: string
  modalTitle?: string
  currentMenu?: string
  bindingDomainNameValidatorRules?: unknown[]
  routerRules?: unknown[]
  contactMobileRules?: unknown[]
  legalMobileRules?: unknown[]
  modalType?: string
  proMunAreaList?: unknown[]
  majorIndividualTypeOptions?: unknown[]
  majorIndividualTypeOptionsClone?: unknown[]
  formState?: FormState
  addSuccessId?: number
  activeKey?: string
  selectAll?: boolean
  isExpandAllTab?: boolean
  menuTreeList?: unknown[]
  fieldNames?: Record<string, string>
  selectedKeys?: unknown[]
  checkedKeys?: unknown[]
  parentCheckedKeys?: unknown[]
  defaultExpandAll?: boolean
  isShowTree?: boolean
  idArr?: unknown[]
  selectTree?: unknown[]
  isShowRightTree?: boolean
  permissionRecord?: Record<string, unknown>
  PermissionType?: string
  editPermissionID?: number
  isShowDetails?: boolean
  detailsInfo?: DetailsInfoItem[]
  isShowResetPassWord?: boolean
  resetPasswordTitle?: string
  resetPasswordSuccessInfo?: Record<string, unknown>
  closable?: boolean
  isResetPasswordSuccessMark?: boolean
  resetModalStyle?: Record<string, number>
  isShowCustomColumnModal?: boolean
  columns?: unknown[]
  optionalMenuList?: unknown[]
  optionalMenuTree?: unknown[]
  optionalMenuTreeChange?: unknown[]
  logoListUrl?: unknown[]
  logoUrlSuccess?: string
  legalPersonListUrl?: unknown[]
  legalPersonUrlSuccess?: string
  businessLicenseListUrl?: unknown[]
  businessLicenseSuccess?: string
  addEditLoading?: boolean
  tableStatusChangeInfo?: Record<string, unknown>
  tableStatusModalInfo?: Record<string, unknown>
  defaultKeys?: string[]
  changedColumnsObj?: Record<string, unknown>
}
