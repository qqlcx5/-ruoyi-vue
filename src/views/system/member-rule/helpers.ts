import { TableColumn } from '@/types/table'
import { formatDate } from '@/utils/formatTime'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useCommonList } from '@/hooks/web/useCommonList'
import { getMemberRuleTree, getMemberRuleList } from '@/api/system/memberRule'
import { ref, createVNode, reactive, computed } from 'vue'
import { XTextButton } from '@/components/XButton'
import { isEmpty } from 'lodash-es'

export type TreeNode = {
  totalRuleNum: number
  ruleName: string
  ruleValue: string
}

const { t } = useI18n()

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
  const { getSuitableShopList, getShopList } = useCommonList()
  const shopList = ref(getShopList())
  const dialogTreeData = ref<Recordable[]>([])
  const showTreeDialog = ref(false)
  const dialogTreeTitle = ref('')
  const columns: TableColumn[] = reactive([
    {
      label: '编码',
      field: 'ruleCode'
    },
    {
      field: 'applicableShopIds',
      label: '门店名称',
      isSearch: true,
      isTable: false,
      search: {
        component: 'Cascader',
        componentProps: {
          options: getSuitableShopList().value,
          props: {
            label: 'name',
            value: 'id',
            multiple: true,
            expandTrigger: 'hover',
            emitPath: false
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
        component: 'Select',
        componentProps: {
          options: computed(() =>
            shopList.value.map((item) => ({ label: item.name, value: item.id }))
          ),
          multiple: true
        }
      }
    },
    {
      field: 'applicableShopInfoList',
      label: '适用门店',
      formatter: (_, __, value) => {
        if (isEmpty(value)) {
          return '不限'
        }
        return createVNode(XTextButton, {
          onClick: () => {
            dialogTreeData.value = value
            showTreeDialog.value = true
            dialogTreeTitle.value = '适用门店'
          },
          title: `共${value?.length}家门店`
        })
      }
    },
    {
      field: 'dataRangShopIdInfoList',
      label: '门店数据范围',
      formatter: (_, __, value) => {
        if (isEmpty(value)) {
          return '不限'
        }
        return createVNode(XTextButton, {
          onClick: () => {
            dialogTreeData.value = value
            showTreeDialog.value = true
            dialogTreeTitle.value = '门店数据范围'
          },
          title: `共${value?.length}家门店`
        })
      }
    },
    {
      label: '岗位数据范围',
      field: 'dataRangPostNameList',
      formatter: (_, __, value) => {
        if (isEmpty(value)) {
          return '不限'
        }
        return createVNode(XTextButton, {
          onClick: () => {
            dialogTreeData.value = value.map((item) => ({ name: item }))
            showTreeDialog.value = true
            dialogTreeTitle.value = '岗位数据范围'
          },
          title: `共${value?.length}家岗位`
        })
      }
    },
    {
      label: '成员数据范围',
      field: 'dataRangUserInfoList',
      formatter: (_, __, value) => {
        if (isEmpty(value)) {
          return '不限'
        }
        return createVNode(XTextButton, {
          onClick: () => {
            dialogTreeData.value = value
            showTreeDialog.value = true
            dialogTreeTitle.value = '成员数据范围'
          },
          title: `共${value?.length}人`
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
      formatter: (_, __, val: string) => {
        return formatDate(new Date(val))
      }
    }
  ])
  const { allSchemas } = useCrudSchemas(columns)

  const showDialog = ref(false)
  const title = ref('')

  /** 添加 */
  const handleAdd = () => {
    showDialog.value = true
    title.value = '新增子规则'
  }

  return {
    allSchemas,
    showDialog,
    dialogTreeData,
    showTreeDialog,
    dialogTreeTitle,
    title,
    tableApi: getMemberRuleList,
    handleAdd
  }
}

export const useRuleTree = () => {
  const treeData = ref<Recordable[]>([])
  const dictType = 'clue_choose_user_rule'
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
