import { TableColumn } from '@/types/table'
import { formatDate } from '@/utils/formatTime'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useCommonList } from '@/hooks/web/useCommonList'
import { getMemberRuleTree, getMemberRuleList } from '@/api/system/memberRule'
import { ref, createVNode, reactive } from 'vue'
import { XTextButton } from '@/components/XButton'
import { isEmpty } from 'lodash-es'

export type TreeNode = {
  totalRuleNum: number
  ruleName: string
  ruleValue: string
}

const { t } = useI18n()

export const stringToArray = (str = '') => {
  return str?.split(',').map((val) => Number(val))
}

export const arrayToString = (array: number[] = []) => {
  return array?.join(',')
}

export const useColumnOptions = () => {
  const brandOptions = [
    {
      label: '不限',
      value: 0
    },
    {
      label: '同品牌',
      value: 1
    }
  ]

  const areaOptions = [
    {
      label: '不限',
      value: 0
    },
    {
      label: '同区域',
      value: 1
    }
  ]

  const choiceOptions = [
    {
      label: '多选',
      value: 0
    },
    {
      label: '单选',
      value: 1
    }
  ]

  return {
    brandOptions,
    areaOptions,
    choiceOptions
  }
}

export const useFormTable = () => {
  const { brandOptions, areaOptions, choiceOptions } = useColumnOptions()
  const { getSuitableShopList } = useCommonList()
  const dialogTreeData = ref<Recordable[]>([])
  const showTreeDialog = ref(false)
  const dialogTreeTitle = ref('')
  const columns: TableColumn[] = reactive([
    {
      field: 'applicableShopIds',
      label: '门店名称',
      isSearch: true,
      isTable: false,
      search: {
        component: 'Cascader',
        componentProps: {
          options: getSuitableShopList(),
          collapseTags: true,
          collapseTagsTooltip: true,
          filterable: true,
          props: {
            label: 'name',
            value: 'id',
            emitPath: false,
            multiple: true
          }
        }
      }
    },
    {
      field: 'dataRangShopId',
      label: '门店数据范围',
      isSearch: true,
      isTable: false,
      search: {
        component: 'Cascader',
        collapseTags: true,
        collapseTagsTooltip: true,
        filterable: true,
        componentProps: {
          options: getSuitableShopList(),
          props: {
            label: 'name',
            value: 'id',
            emitPath: false,
            multiple: true
          }
        }
      }
    },
    {
      field: 'applicableShopInfoList',
      label: '适用门店',
      formatter: (row, __, value) => {
        if (isEmpty(value)) {
          return '不限'
        }
        return createVNode(XTextButton, {
          onClick: () => {
            dialogTreeData.value = value
            showTreeDialog.value = true
            dialogTreeTitle.value = '适用门店'
          },
          title: `共${row.applicableShopId.split(',')?.length}家门店`
        })
      }
    },
    {
      field: 'dataRangShopIdInfoList',
      label: '门店数据范围',
      formatter: (row, __, value) => {
        if (isEmpty(value)) {
          return '不限'
        }
        return createVNode(XTextButton, {
          onClick: () => {
            dialogTreeData.value = value
            showTreeDialog.value = true
            dialogTreeTitle.value = '门店数据范围'
          },
          title: `共${row.dataRangShopId.split(',')?.length}家门店`
        })
      }
    },
    {
      label: '岗位数据范围',
      field: 'dataRangPostNameList',
      formatter: (row, __, value) => {
        if (isEmpty(value)) {
          return '不限'
        }
        return createVNode(XTextButton, {
          onClick: () => {
            dialogTreeData.value = value.map((item) => ({ name: item }))
            showTreeDialog.value = true
            dialogTreeTitle.value = '岗位数据范围'
          },
          title: `共${row.dataRangPostId.split(',')?.length}个岗位`
        })
      }
    },
    {
      label: '成员数据范围',
      field: 'dataRangUserInfoList',
      formatter: (row, __, value) => {
        if (isEmpty(value)) {
          return '不限'
        }
        return createVNode(XTextButton, {
          onClick: () => {
            dialogTreeData.value = value
            showTreeDialog.value = true
            dialogTreeTitle.value = '成员数据范围'
          },
          title: `共${row.dataRangUserId.split(',')?.length}人`
        })
      }
    },
    {
      label: '品牌条件',
      field: 'brandCondition',
      formatter: (_, __, value) => {
        return brandOptions.find((item) => item.value === value)?.label
      }
    },
    {
      label: '区域条件',
      field: 'areaCondition',
      formatter: (_, __, value) => {
        return areaOptions.find((item) => item.value === value)?.label
      }
    },
    {
      label: '选项类型',
      field: 'chooseType',
      formatter: (_, __, value) => {
        return choiceOptions.find((item) => item.value === value)?.label
      }
    },
    {
      label: t('common.status'),
      field: 'isEnable'
    },
    {
      label: t('common.creater'),
      field: 'creator'
    },
    {
      label: t('common.createTime'),
      field: 'createTime',
      width: 180,
      formatter: (_, __, val: string) => {
        return formatDate(new Date(val))
      }
    }
  ])
  const { allSchemas } = useCrudSchemas(columns)

  const showDialog = ref(false)
  const title = ref('')
  const isEdit = ref(false)

  return {
    allSchemas,
    showDialog,
    dialogTreeData,
    showTreeDialog,
    dialogTreeTitle,
    isEdit,
    title,
    tableApi: getMemberRuleList
  }
}

export const useRuleTree = () => {
  const treeData = ref<Recordable[]>([])
  const dictType = 'clue_choose_user_rule,clue_choose_user_reception,clue_choose_user_visit'
  const selectNode = ref<Partial<TreeNode>>({})

  const getTree = async () => {
    const data = await getMemberRuleTree(dictType)
    treeData.value = data
  }

  return {
    treeData,
    selectNode,
    getTree
  }
}
