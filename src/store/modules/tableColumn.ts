import { defineStore } from 'pinia'
import { store } from '../index'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()

export interface ColumnType {
  field: string
  check: boolean
  title?: string
}
export interface TableColumnType {
  tableKey: string
  column: ColumnType[] | null
}

export interface TableColumnState {
  columns: TableColumnType[]
}

export const useTableColumn = defineStore('tableColumn', {
  state: (): TableColumnState => ({
    columns: [],
  }),
  getters: {
  },
  actions: {
    setTableColumn(obj: TableColumnType) {
      const tableColumnMap = wsCache.get(CACHE_KEY.TABLE_COLUMN) || {};
      tableColumnMap[obj.tableKey] = obj.column;
      wsCache.set(CACHE_KEY.TABLE_COLUMN, tableColumnMap)
    },
    getTableColumn(tableKey: string) {
      const tableColumnMap = wsCache.get(CACHE_KEY.TABLE_COLUMN)
      if (tableColumnMap) return tableColumnMap[tableKey];
      return null
    },
  }
})

export const useTableColumnStoreWithOut = () => {
  return useTableColumn(store)
}
