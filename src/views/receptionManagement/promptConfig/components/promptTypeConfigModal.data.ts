const { t } = useI18n() // 国际化
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const columns: TableColumn[] = [
  {
    title: '提示类型关键字',
    field: 'reason'
  },
  {
    title: '提示类型名称',
    field: 'reason'
  },
  {
    title: '提示类型描述',
    field: 'reason'
  },
  {
    title: t('common.startTimeText'),
    field: 'startTime',
    formatter: 'formatDay',
    table: {
      width: 180
    },
    detail: {
      dateFormat: 'YYYY-MM-DD'
    },
    form: {
      component: 'DatePicker'
    }
  }
]
export const { allSchemas } = useCrudSchemas(columns)
