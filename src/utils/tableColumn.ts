import { ColumnType, useTableColumnStoreWithOut } from '@/store/modules/tableColumn'

const tableColumnStore = useTableColumnStoreWithOut()

export interface TableColumnStorage {
  title?: string
  width?: number | string
  dataIndex?: string
  key?: string
  field?: string
  resizable?: boolean
  ellipsis?: boolean
  disabled?: boolean
  check?: boolean
  sort?: number | string
}

export const getTableColumnConfig = (tableKey: any, Column: TableColumnStorage[]) => {
  if (!tableKey) return false
  const columnConfig = tableColumnStore.getTableColumn(tableKey)
  if (columnConfig) {
    const newColumnConfig: ColumnType[] = []
    columnConfig.map((item) => {
      const index = Column.findIndex((col) => col.field === item.field)
      if (index !== -1) {
        newColumnConfig.push(item)
      }
    })
    return newColumnConfig
  } else {
    return false
  }
}
