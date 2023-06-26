<template>
  <Dialog v-bind="$attrs" width="1300px" @confirm="handleConfirm">
    <div>
      <div class="mb-5.5 font-bold rule-name">规则名称：线索增派转派规则</div>
      <div class="flex items-center mb-5.5">
        <span>规则数据：</span>
        <div>
          <XButton type="primary" title="新增行" @click="handleAdd" />
          <XButton type="primary" title="一键新增单电子规则" @click="show = true" />
          <el-tooltip placement="bottom" class="icon-tip">
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
        <Table :columns="allSchemas.tableColumns" :data="tableData">
          <template #applicableShopId="{ row }">
            <el-cascader
              v-model="row.applicableShopId"
              clearable
              :options="suitableShopList"
              :props="{ label: 'name', value: 'id', multiple: true }"
              @change="handleShopChange(row)"
            />
          </template>
          <template #dataRangShopId="{ row }">
            <el-select v-model="row.dataRangShopId" multiple clearable>
              <el-option
                v-for="item in shopList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </template>
          <template #dataRangPostId="{ row }">
            <el-select v-model="row.dataRangPostId" multiple clearable>
              <el-option
                v-for="item in postList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </template>
          <template #dataRangUserId="{ row }">
            <el-select v-model="row.dataRangUserId" multiple clearable>
              <el-option
                v-for="item in memberList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
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
        </Table>
      </div>
    </div>
    <AddChildDialog v-if="show" v-model="show" @save="handleSave" :width="682" />
  </Dialog>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { cloneDeep, isEmpty } from 'lodash-es'
import AddChildDialog from './AddChildDialog.vue'
import { useColumnOptions } from '../helpers'
import { useCommonList } from '@/hooks/web/useCommonList'
import { autoSetMemberRule } from '@/api/system/memberRule'

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

watch(
  () => props.data,
  (val) => {
    if (!isEmpty(val)) {
      val?.map((item) => tableData.push(item))
    }
  }
)

const { getShopList, getPostList, getMemberList, getSuitableShopList } = useCommonList()
const shopList = ref(getShopList())
const postList = ref(getPostList())
const memberList = ref<Recordable[]>([])
const suitableShopList = ref(getSuitableShopList())

const handleShopChange = (row: Recordable) => {
  memberList.value = getMemberList({
    belongShopid: row.applicableShopId,
    childRuleValue: props.currentNode?.ruleValue
  }).value
}

const { brandOptions, areaOptions, choiceOptions } = useColumnOptions()

const show = ref(false)

const tableData: Recordable[] = reactive([])

const columns: TableColumn[] = [
  {
    field: 'ruleCode',
    label: '编码'
  },
  {
    field: 'applicableShopId',
    label: '适用门店'
  },
  {
    field: 'dataRangShopId',
    label: '门店数据范围'
  },
  {
    field: 'dataRangPostId',
    label: '岗位数据范围'
  },
  {
    field: 'dataRangUserId',
    label: '成员数据范围'
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
    })
    .catch(() => {})
}

/** 复制 */
const handleCopy = (row: RuleItem) => {
  const data = cloneDeep(row)
  data.applicableShopId = ''
  data.dataRangShopId = ''
  tableData.push(data)
}

/** 确认 */
const handleConfirm = () => {
  if (isEmpty(tableData)) {
    message.warning('请添加子规则')
    return
  }
  emits('save', tableData)
}

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
  data?.map((item) =>
    tableData.push({
      ...item,
      dataRangPostId: item.dataRangPostId.split(',').map((item) => Number(item))
    })
  )
}
</script>

<style lang="scss" scoped>
.rule-name {
  font-size: 16px;
}
</style>
