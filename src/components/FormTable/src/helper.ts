import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { ElTable } from 'element-plus'
import { TableColumn } from '@/types/table'
import { cloneDeep } from 'lodash-es'

export type ElTableProps = InstanceType<typeof ElTable>['$props']
export type TableProps = InstanceType<typeof Table>['$props'] & ElTableProps
export type SearchProps = InstanceType<typeof Search>['$props']

export type ActionButton = {
  /** 按钮名称 */
  name: string
  /** 权限名称 */
  permission?: string | boolean
  /** 点击事件 */
  click: Function
  /** 是否禁用 */
  disabled?: boolean
}

export const useDarwerColumn = (columns: TableColumn[]) => {
  let columnsClone = cloneDeep(columns)
  columnsClone = columnsClone.map((item) => {
    return {
      ...item,
      check: true,
      disabled: false
    }
  })

  return {
    columns: columnsClone
  }
}

export const formPropsKeyList = [
  'schema',
  'model',
  'labelWidth',
  'showSearch',
  'showReset',
  'expand',
  'expandField',
  'inline'
]
