<template>
  <Dialog v-bind="$attrs" width="1300px" @confirm="handleConfirm">
    <div>
      <div class="mb-5.5 font-bold rule-name">规则名称：{{ currentNode?.ruleName }}</div>
      <div v-if="isEmpty(data)" class="flex items-center mb-5.5">
        <span>规则数据：</span>
        <div>
          <XButton type="primary" title="新增行" @click="handleAdd" />
          <XButton type="primary" title="一键新增单电子规则" @click="show = true" />
          <el-tooltip placement="top" class="icon-tip">
            <template #content>
              <span>
                说明：一键新增单店子规则后，每家门店会生成一条子规则，门店数据范围对应适用门店。
                生成后，可对单条子规则进行编辑</span
              >
            </template>
            <Icon class="ml-3" icon="ep:question-filled" color="rgb(176, 176, 176)" />
          </el-tooltip>
        </div>
      </div>
      <div>
        <Table :columns="allSchemas.tableColumns" :data="tableData" :max-height="400">
          <template #applicableShopId="{ row, $index }">
            <el-cascader
              v-model="row.applicableShopId"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              :options="allSuitableShopList[$index]"
              :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
              @change="handleSuitableShop"
            />
          </template>
          <template #dataRangShopId="{ row, $index }">
            <el-cascader
              v-model="row.dataRangShopId"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              :options="shopList"
              :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
              @change="handleShopChange(row, $index)"
            />
          </template>
          <template #dataRangPostId="{ row, $index }">
            <el-cascader
              v-model="row.dataRangPostId"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              :options="postList"
              :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
              @change="handleShopChange(row, $index)"
            />
          </template>
          <template #dataRangUserId="{ row, $index }">
            <el-cascader
              v-model="row.dataRangUserId"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              :options="allMemberList[$index]"
              :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
            />
          </template>
          <template #brandCondition="{ row }">
            <ButtonRadio v-model="row.brandCondition" :options="brandOptions" margin-right="10px" />
          </template>
          <template #areaCondition="{ row }">
            <ButtonRadio v-model="row.areaCondition" :options="areaOptions" margin-right="10px" />
          </template>
          <template #chooseType="{ row }">
            <ButtonRadio v-model="row.chooseType" :options="choiceOptions" margin-right="10px" />
          </template>
          <template #isEnable="{ row }">
            <el-switch v-model="row.isEnable" :active-value="1" :inactive-value="0" />
          </template>
          <template #action="{ row }">
            <XTextButton title="复制" @click="handleCopy(row)" />
            <XTextButton title="删除" @click="handleDel(row.ruleCode)" />
          </template>
          <template #brandCondition-header="{ column }">
            <div class="flex items-center justify-center">
              {{ column.label }}
              <el-tooltip placement="top" class="icon-tip">
                <template #content>
                  <span>
                    不限：不限制或不添加品牌条件
                    <br />
                    同品牌：选择成员时，需过滤与实际业务数据为同品牌的人员
                  </span>
                </template>
                <Icon class="ml-3px" icon="ep:question-filled" color="rgb(176, 176, 176)" />
              </el-tooltip>
            </div>
          </template>
          <template #areaCondition-header="{ column }">
            <div class="flex items-center justify-center">
              {{ column.label }}
              <el-tooltip placement="top" class="icon-tip">
                <template #content>
                  <span>
                    不限：不限制或不添加区域条件
                    <br />
                    同区域：选择成员时，需过滤与实际业务数据为同区域的人员
                  </span>
                </template>
                <Icon class="ml-3px" icon="ep:question-filled" color="rgb(176, 176, 176)" />
              </el-tooltip>
            </div>
          </template>
        </Table>
      </div>
    </div>
    <AddChildDialog v-if="show" v-model="show" @save="handleSave" :width="682" />
  </Dialog>
</template>

<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue'
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { cloneDeep, isEmpty, isArray } from 'lodash-es'
import AddChildDialog from './AddChildDialog.vue'
import { useColumnOptions, stringToArray, arrayToString } from '../helpers'
import { useCommonList } from '@/hooks/web/useCommonList'
import { autoSetMemberRule, getHasShopId } from '@/api/system/memberRule'
import { getUserMemberDataList } from '@/api/common'

type RuleItem = {
  applicableShopId: string
  areaCondition: number
  belongBusinessCode: string
  belongBusinessName: string
  brandCondition: number
  chooseType: number
  dataRangPostId: string
  dataRangShopId: string
  dataRangUserId: string
  isEnable: number
  ruleCode: string
}

const props = defineProps<{
  data?: Recordable[]
  currentNode?: Recordable
}>()

const emits = defineEmits<{
  (e: 'save', data: Recordable): void
}>()

const { getPostList, getSuitableShopList } = useCommonList()
const suitableShop = getSuitableShopList()
const shopList = ref<Recordable[]>([])
const suitableShopList = ref<Recordable[]>([])
const postList = ref(getPostList())
const allMemberList: Recordable[][] = reactive([])
const allSuitableShopList = ref<Recordable[][]>([])

watch(
  suitableShop,
  (val) => {
    shopList.value = cloneDeep(val)
    suitableShopList.value = cloneDeep(val)

    // 新增打开弹窗自动添加一行
    if (isEmpty(props.data)) {
      handleAdd()
    } else {
      resetShopId()
    }
  },
  { deep: true }
)

/** 改变门店数据范围 */
const handleShopChange = async (row: Recordable, index: number) => {
  const list = await getUserMemberDataList({
    storeIds: isArray(row.dataRangShopId) ? arrayToString(row.dataRangShopId) : row.dataRangShopId,
    postIds: isArray(row.dataRangPostId) ? arrayToString(row.dataRangPostId) : row.dataRangPostId
  })
  allMemberList[index] = list
}

/** 改变适用门店 */
const handleSuitableShop = () => {
  resetShopId()
}

const { brandOptions, areaOptions, choiceOptions } = useColumnOptions()

const show = ref(false)

const tableData: Recordable[] = reactive([])

const columns: TableColumn[] = [
  {
    field: 'applicableShopId',
    label: '适用门店',
    width: 150
  },
  {
    field: 'dataRangShopId',
    label: '门店数据范围',
    width: 150
  },
  {
    field: 'dataRangPostId',
    label: '岗位数据范围',
    width: 150
  },
  {
    field: 'dataRangUserId',
    label: '成员数据范围',
    width: 150
  },
  {
    field: 'brandCondition',
    label: '品牌条件',
    width: 150
  },
  {
    field: 'areaCondition',
    label: '区域条件',
    width: 150
  },
  {
    field: 'chooseType',
    label: '选项类型',
    width: 150
  },
  {
    field: 'isEnable',
    label: '状态'
  },
  {
    field: 'action',
    label: '操作',
    showOverflowTooltip: false
  }
]
const { allSchemas } = useCrudSchemas(columns)

watch(
  () => props.data,
  (val) => {
    if (!isEmpty(val)) {
      val?.map((item) =>
        tableData.push({
          ...item,
          applicableShopId: stringToArray(item.applicableShopId),
          dataRangPostId: stringToArray(item.dataRangPostId),
          dataRangShopId: stringToArray(item.dataRangShopId),
          dataRangUserId: stringToArray(item.dataRangUserId)
        })
      )
      // 请求成员列表
      tableData.forEach((item, index) => {
        handleShopChange(item, index)
      })
    }
  },
  { immediate: true }
)

/** 重新设置适用门店数据(已选的不可重复) */
const resetShopId = () => {
  const selectedId = [
    ...new Set([...hasShopId.value, ...tableData.map((item) => item.applicableShopId).flat()])
  ]

  /** 循环判断是否门店已被选，则添加disabled禁用 */
  const setDisabled = (list: Recordable[], selectedIds: number[], type?: number) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].hasOwnProperty('children') && list[i].children.length > 0) {
        delete list[i].disabled
        setDisabled(list[i].children, selectedIds, type)
      } else {
        if (selectedIds.includes(list[i].id)) {
          list[i].disabled = true
        } else {
          delete list[i].disabled
        }
      }
    }
  }
  setDisabled(suitableShopList.value, selectedId)

  const allList = tableData.map(() => cloneDeep(suitableShopList.value))
  allSuitableShopList.value = tableData.map((item, index) => {
    const selected = selectedId.filter((id) => !item.applicableShopId.includes(id))
    setDisabled(allList[index], selected, 1)

    return allList[index]
  })
}

/** 新增 */
const handleAdd = () => {
  tableData.push({
    applicableShopId: [],
    areaCondition: 0,
    belongBusinessCode: '',
    belongBusinessName: '',
    brandCondition: 0,
    chooseType: 0,
    dataRangPostId: [],
    dataRangShopId: [],
    dataRangUserId: [],
    isEnable: 0,
    ruleCode: null
  })
  resetShopId()
}

/** 删除 */
const message = useMessage()
const handleDel = (id: string) => {
  message
    .wgOperateConfirm('是否确认删除？删除后无法恢复。', '提示')
    .then(async () => {
      const index = tableData.findIndex((item) => item.ruleCode === id)
      tableData.splice(index, 1)
      message.success('删除成功')
      resetShopId()
    })
    .catch(() => {})
}

/** 复制 */
const handleCopy = (row: RuleItem) => {
  const data = cloneDeep(row)
  data.applicableShopId = ''
  data.dataRangShopId = ''
  tableData.push(data)
  resetShopId()
}

/** 确认 */
const handleConfirm = () => {
  if (isEmpty(tableData)) {
    message.warning('请添加子规则')
    return
  }
  emits('save', tableData)
}

// 已选的适用门店id
const hasShopId = ref<number[]>([])
onMounted(async () => {
  const data = await getHasShopId(props.currentNode?.ruleValue)
  hasShopId.value = data
})

/** 一键生成子规则确认回调 */
const handleSave = async (params: Recordable) => {
  const data = await autoSetMemberRule({
    ...params,
    belongBusinessCode: props.currentNode?.ruleValue,
    belongBusinessName: props.currentNode?.ruleName,
    dataRangPostId: params.dataRangPostId.join(',')
  })
  message.success('新增成功')
  show.value = false
  tableData.splice(0, tableData.length)
  data?.map((item) =>
    tableData.push({
      ...item,
      applicableShopId: stringToArray(item.applicableShopId),
      dataRangPostId: stringToArray(item.dataRangPostId),
      dataRangShopId: stringToArray(item.dataRangShopId),
      dataRangUserId: stringToArray(item.dataRangUserId)
    })
  )
  resetShopId()
  tableData.forEach((item, index) => {
    handleShopChange(item, index)
  })
}
</script>

<style lang="scss" scoped>
.rule-name {
  font-size: 16px;
}
</style>
