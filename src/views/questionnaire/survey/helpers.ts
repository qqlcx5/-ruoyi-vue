import { useCrudSchemas, CrudSchema } from '@/hooks/web/useCrudSchemas'
import { DICT_TYPE } from '@/utils/dict'
import { getField, getGroupList } from '@/api/questionnaire/topic'
import { ref } from 'vue'

const { t } = useI18n()

export const useOptions = () => {
  const StyleOptions = [
    {
      label: '无分类',
      value: 0
    },
    {
      label: '有分类',
      value: 1
    }
  ]
  const StatusOptions = [
    {
      label: '禁用',
      value: 0
    },
    {
      label: '启用',
      value: 1
    }
  ]
  const YesNoOptions = [
    {
      label: '否',
      value: 0
    },
    {
      label: '是',
      value: 1
    }
  ]
  return {
    StyleOptions,
    StatusOptions,
    YesNoOptions
  }
}

export const useTable = () => {
  const { StyleOptions, StatusOptions, YesNoOptions } = useOptions()
  const columns: CrudSchema[] = [
    {
      label: '问卷编码',
      field: 'appraiseCode'
    },

    {
      label: '问卷名称',
      field: 'appraiseName',
      isSearch: true
    },
    {
      label: '所属分组',
      field: 'appraiseTypeNameList'
      // formatter: (_, __, value) => {
      //   return value?.join(';')
      // }
    },
    {
      label: '适用门店',
      field: 'shopNameList',
      isSearch: true,
      search: {
        component: 'ShopCascader'
      }
      // formatter: (_, __, value) => {
      //   return value?.join(';')
      // }
    },
    {
      label: '适用车型',
      field: 'modelNameList',
      isSearch: true,
      search: {
        component: 'Select'
        // componentProps: {
        //   options: ModelLimitOptions
        // }
      }
      // formatter: (_, __, value) => {
      //   return value?.join(';')
      // }
    },
    {
      label: '题目数量',
      field: 'appraiseTopicNum'
    },
    {
      label: '答卷数',
      field: 'answerNumber'
    },
    {
      label: '是否分值卷',
      field: 'isScore',
      isSearch: true,
      search: {
        component: 'Select',
        componentProps: {
          options: YesNoOptions
        }
      },
      formatter: (_, __, value) => {
        return YesNoOptions.find((item) => item.value === value)?.label
      }
    },
    {
      label: '状态',
      field: 'status',
      isSearch: true,
      dictType: DICT_TYPE.COMMON_STATUS,
      search: {
        component: 'Select',
        componentProps: {
          options: StatusOptions
        }
      }
    },
    {
      label: '创建人',
      field: 'creator',
      isSearch: true,
      isTable: false,
      search: {
        component: 'Select'
        // componentProps: {
        //   options: StyleOptions
        // }
      }
      // formatter: (_, __, value) => {
      //   return value?.join(';')
      // }
    },

    {
      label: '是否前端展示',
      field: 'isFrontShow',
      isSearch: true,
      isTable: false,
      search: {
        component: 'Select',
        componentProps: {
          options: YesNoOptions
        }
      }
    },
    {
      label: '问卷样式',
      field: 'appraiseStyle',
      isSearch: true,
      isTable: false,
      search: {
        component: 'Select',
        componentProps: {
          options: StyleOptions
        }
      }
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
  const fieldList = ref<Questionnaire.FieldList[]>([])
  const getGroupData = async () => {
    const data = await getGroupList()
    groupList.value = data
  }
  const getFieldData = async () => {
    const data = await getField()
    fieldList.value = data
  }

  return {
    getGroupData,
    groupList,
    getFieldData,
    fieldList
  }
}
