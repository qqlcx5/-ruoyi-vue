export type TeamObj = {
  id: number
  teamName: string
  permitEnjoyNum: number
  positionSunTypeList: string[]
  // positionSunNameList: string[]
  // selectedRoleObj: string[]
}
export type RuleObj = {
  distributeRuleName: string
  shopIdList: number[]
  applicableShopId: string
  distributeType: number
  augment: number
  distributeNum: number
  receivePattern: number
  teamEnjoyScope: number
  teams: TeamObj[]
  receiveNum: number
}
