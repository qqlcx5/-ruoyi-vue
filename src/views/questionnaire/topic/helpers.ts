import { formatDate } from '@/utils/formatTime'
import { useCrudSchemas, CrudSchema } from '@/hooks/web/useCrudSchemas'
import { DICT_TYPE } from '@/utils/dict'
import { getGroupList } from '@/api/questionnaire/topic'
import { ref } from 'vue'

const { t } = useI18n()

export const useOptions = () => {
  const topicTypeOptions = [
    {
      label: '单选题',
      value: 1
    },
    {
      label: '多选题',
      value: 2
    },
    {
      label: '输入题',
      value: 3
    },
    {
      label: '星选题',
      value: 4
    }
  ]

  return {
    topicTypeOptions
  }
}

export const useTable = () => {
  const { topicTypeOptions } = useOptions()
  const columns: CrudSchema[] = [
    {
      label: '题目ID',
      field: 'appraiseTopicId'
    },
    {
      label: '题目类型',
      field: 'appraiseTopicType',
      isSearch: true,
      search: {
        component: 'Select',
        componentProps: {
          options: topicTypeOptions
        }
      },
      formatter: (_, __, value) => {
        return topicTypeOptions.find((item) => item.value === value)?.label
      }
    },
    {
      label: '题目名称',
      field: 'appraiseTopicTitle',
      isSearch: true
    },
    {
      label: '所属分组',
      field: 'appraiseTypeNameList',
      formatter: (_, __, value) => {
        return value?.join(';')
      }
    },
    {
      label: '状态',
      field: 'status',
      isSearch: true,
      dictType: DICT_TYPE.COMMON_STATUS
    },
    {
      label: t('common.createTime'),
      field: 'createTime',
      width: 170,
      isTable: false,
      isSearch: true,
      search: {
        component: 'DatePicker',
        componentProps: {
          type: 'datetimerange',
          valueFormat: 'YYYY-MM-DD hh:mm:ss'
        }
      }
    },
    {
      label: '匹配字段',
      field: 'matchField'
    },
    {
      label: '最后一次修改人',
      field: 'updater'
    },
    {
      label: '最后一次修改时间',
      field: 'updateTime',
      width: 170,
      formatter: (_, __, val: string) => {
        return formatDate(new Date(val))
      }
    }
  ]

  const { allSchemas } = useCrudSchemas(columns)

  const tableRef = ref()
  const listParams = ref<Recordable>()

  return {
    allSchemas,
    tableRef,
    listParams
  }
}

export const useGroup = () => {
  const groupList = ref<Questionnaire.GroupList[]>([])
  const getGroupData = async () => {
    const data = await getGroupList()
    groupList.value = data
  }

  return {
    getGroupData,
    groupList
  }
}
