// const { t } = useI18n() // 国际化
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { formatDate } from '@/utils/formatTime'

const columns: TableColumn[] = [
  {
    label: '提示类型关键字',
    field: 'typeKey',
    isSearch: true
  },
  {
    label: '提示类型名称',
    field: 'typeName',
    isSearch: true
  },
  {
    label: '创建人',
    field: 'createBy'
  },
  {
    label: '创建时间',
    field: 'createTime',
    formatter: (_, __, val: string) => {
      return formatDate(new Date(val))
    }
  }
]
export const { allSchemas } = useCrudSchemas(columns)
