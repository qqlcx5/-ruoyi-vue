import { Table } from '@/components/Table'
import { Form } from '@/components/Form'
import { ElTable } from 'element-plus'
import { TableColumn } from '@/types/table'
import { cloneDeep } from 'lodash-es'

export type ElTableProps = InstanceType<typeof ElTable>['$props']
export type TableProps = InstanceType<typeof Table>['$props'] & ElTableProps
export type FormProps = InstanceType<typeof Form>['$props']

export const useDarwerColumn = (columns: TableColumn[]) => {
  let columnsClone = cloneDeep(columns)
  columnsClone = columnsClone.map((item) => {
    return {
      ...item,
      check: true,
      disabled: false
    }
  })
  console.log(columnsClone)

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
