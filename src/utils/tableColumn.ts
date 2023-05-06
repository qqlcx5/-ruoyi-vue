import {ColumnType, useTableColumnStoreWithOut} from "@/store/modules/tableColumn";

const tableColumnStore = useTableColumnStoreWithOut();


export const getTableColumnConfig = (tableKey: any, Column: any[]) => {
  if (!tableKey) return false;
  const columnConfig = tableColumnStore.getTableColumn(tableKey);
  if (columnConfig) {
    let newColumnConfig: ColumnType[] = [];
    columnConfig.map(item => {
      let index = Column.findIndex(col => col.field === item.field);
      if (index !== -1) {
        newColumnConfig.push(item);
      }
    })
    return newColumnConfig;
  } else {
    return false;
  }
}
