<template>
  <div>
    <XModal v-model="dialogVisible" width="70%" :title="dialogTitle">
      <XButton
        class="add-row-btn"
        type="primary"
        title="添加行"
        @click="handleAdd()"
        v-if="dialogTitle == '新增'"
      />
      <Table
        :columns="tableColumns"
        :data="tableList"
        header-cell-class-name="table-header-style required-row"
        height="40vh"
        class="add-channel-table"
        headerAlign="left"
        align="left"
        @update:page-size="() => {}"
      >
        <template #serialNumber="{ row }">
          <el-input v-model="row.serialNumber" size="small" placeholder="请输入" />
        </template>
        <template #clueSourceId="{ row }">
          <el-cascader
            ref="cascaderRef"
            v-model="row.clueSourceId"
            size="small"
            :options="sourceList"
            :props="clueSourceProps"
            :show-all-levels="false"
            @change="handleChange"
          />
        </template>
        <template #shopId="{ row }">
          <el-cascader
            v-model="row.shopId"
            size="small"
            :options="shopOptions"
            :props="shopProps"
            :show-all-levels="false"
          />
        </template>
        <template #platformUsername="{ row }">
          <el-input v-model="row.platformUsername" size="small" placeholder="请输入" />
        </template>
        <template #platformPassword="{ row }">
          <el-input v-model="row.platformPassword" size="small" placeholder="请输入" />
        </template>
        <template #needFilter="{ row }">
          <el-switch
            v-model="row.needFilter"
            inline-prompt
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
          />
        </template>
        <template #autoDistribute="{ row }">
          <el-switch
            v-model="row.autoDistribute"
            inline-prompt
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
          />
        </template>
        <template #platformRule="{ row }">
          <el-switch
            v-model="row.platformRule"
            inline-prompt
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
          />
        </template>
        <template #isShow="{ row }">
          <el-switch
            v-model="row.isShow"
            inline-prompt
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
          />
          <!-- <el-select v-model="row.isShow" placeholder="请选择" size="small">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
        </template>
        <template #action="scope">
          <XTextButton :title="t('action.del')" @click="delPostTypeLine(scope.$index)" />
        </template>
      </Table>
      <template #footer>
        <XButton
          type="primary"
          :title="t('action.save')"
          :loading="actionLoading"
          @click="submitForm"
        />
        <XButton :title="t('dialog.close')" @click="dialogVisible = false" />
      </template>
    </XModal>
  </div>
</template>
<script setup lang="ts">
import { ChannelVO } from '@/api/clue/channel'
import { ref } from 'vue'
import * as channelApi from '@/api/clue/channel'

import { useCommonList } from '@/hooks/web/useCommonList'
const { getSuitableShopList } = useCommonList()

defineProps({
  msg: String
})
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
// 弹出框
const dialogVisible = ref(false) // 是否显示弹出层
const dialogTitle = ref('新增') // 弹出层标题
const actionLoading = ref(false) // 遮罩层
const emit = defineEmits(['refreshList'])
interface tableColumnsType {
  label: string
  field: string
  minWidth?: string
  fixed?: string
  width?: string
  showOverflowTooltip?: boolean
}
const initTableColumns: tableColumnsType[] = [
  {
    label: '编号',
    field: 'serialNumber',
    minWidth: '100px'
  },
  {
    label: '线索平台',
    field: 'clueSourceId',
    minWidth: '100px'
  },
  {
    label: '线索平台开通门店',
    field: 'shopId',
    minWidth: '100px'
  },
  {
    label: '平台账号',
    field: 'platformUsername',
    minWidth: '100px'
  },
  {
    label: '平台密码',
    field: 'platformPassword',
    minWidth: '100px'
  },
  {
    label: '是否清洗',
    field: 'needFilter',
    minWidth: '100px'
  },
  {
    label: '是否自动派发',
    field: 'autoDistribute',
    minWidth: '120px'
  },
  {
    label: '是否线索平台规则派发',
    field: 'platformRule',
    minWidth: '100px'
  },
  {
    label: '手动创建线索是否可选',
    field: 'isShow',
    minWidth: '100px'
  }
]
// 岗位类型table
const tableList = ref<ChannelVO[]>([])

const handleAdd = () => {
  let addItem = {
    serialNumber: '',
    clueSourceId: '',
    shopId: '',
    platformUsername: '',
    platformPassword: '',
    needFilter: 0,
    autoDistribute: 0,
    platformRule: 0,
    isShow: 0
  }
  tableList.value.push(addItem)
}
const delPostTypeLine = (index: number): void => {
  if (tableList.value.length === 1) return message.warning(`至少要有一行信息！`)
  tableList.value.splice(index, 1)
}

let sourceList = ref<any[]>([])
let initSourceList = ref<any[]>([])
// 获取线索来源列表
const getSourceList = async () => {
  let data = await channelApi.getClueSourceManageList()
  if (data) {
    sourceList.value = data
    initSourceList.value = data
    console.log(data)
  }
}

const cascaderRef = ref()
const handleChange = () => {
  let sourceArr: any = cloneDeep(initSourceList.value)
  let list: any = cloneDeep(tableList.value)
  console.log(list, sourceArr)
  list.forEach((lItem) => {
    sourceArr = disabledSourceList(lItem.clueSourceId, sourceArr)
  })
  sourceList.value = sourceArr
}
const disabledSourceList = (clueSourceId, sourceArr) => {
  try {
    sourceArr.map((sItem) => {
      if (sItem.id == clueSourceId) {
        sItem.disabled = true
      }
      let children = sItem.children
      if (children.length > 0) {
        sItem.children = disabledSourceList(clueSourceId, children)
      }
      return sItem
    })
    return sourceArr
  } catch (error) {
    console.log(error)
  }
}

const clueSourceProps = {
  label: 'name',
  value: 'id',
  emitPath: false
}

const shopProps = {
  // checkStrictly: true,
  label: 'name',
  value: 'id'
}

// 获取门店数据
const shopOptions = ref(getSuitableShopList())
// let shopOptions = []
// const getShopList = async () => {
//   const data = await getAllStoreList()
//   shopOptions = listToTree(data || [], { pid: 'parentId' })
//   console.log(shopOptions)
// }
// getShopList()

import { cloneDeep } from 'lodash-es'
// 保存按钮
const submitForm = async () => {
  let list = cloneDeep(tableList.value)
  let isSerialNumberEmptyTool = false
  let isClueSourceIdEmptyTool = false
  let isClueShopIdEmptyTool = false
  let paramsList = list.map((item: any) => {
    if (
      item.clueSourceId &&
      Object.prototype.toString.call(item.clueSourceId) == '[object Array]'
    ) {
      let len = item.clueSourceId.length - 1 || 0
      item.clueSourceId = item.clueSourceId[len]
    }
    if (item.shopId && Object.prototype.toString.call(item.shopId) == '[object Array]') {
      let len = item.shopId.length - 1 || 0
      item.shopId = item.shopId[len]
    }
    if (!item.serialNumber) {
      isSerialNumberEmptyTool = true
    }
    if (!item.clueSourceId) {
      isClueSourceIdEmptyTool = true
    }
    if (!item.shopId) {
      isClueShopIdEmptyTool = true
    }
    return item
  })
  console.log(paramsList)

  if (isSerialNumberEmptyTool) {
    message.error('编号不能为空')
    return
  }
  if (isClueSourceIdEmptyTool) {
    message.error('线索平台不能为空')
    return
  }
  if (isClueShopIdEmptyTool) {
    message.error('线索平台开通门店不能为空')
    return
  }
  let data = null
  if (dialogTitle.value == '编辑') {
    data = await channelApi.updateClueChannel(paramsList[0])
  } else {
    data = await channelApi.addClueChannel(paramsList)
  }
  if (data) {
    dialogVisible.value = false
  }
  emit('refreshList')
}
let tableColumns: tableColumnsType[] = []
const openModal = (row) => {
  dialogVisible.value = true
  tableList.value = []
  dialogTitle.value = '新增'
  tableColumns = cloneDeep(initTableColumns)
  if (row) {
    dialogTitle.value = '编辑'
    tableList.value = [row]
    return
  }
  tableColumns.push({
    label: '操作',
    field: 'action',
    fixed: 'right',
    width: '70px',
    showOverflowTooltip: false
  })
  getSourceList()
  handleAdd()
}
defineExpose({ openModal })
</script>
<style scoped lang="scss">
:deep(.table-header-style) {
  height: 50px;
  font-size: 14px;
  color: $header-text-color;
  background-color: $table-head-color !important;
}
.add-row-btn {
  margin-top: 10px;
  margin-bottom: 20px;
}
.add-channel-table {
  margin-bottom: 20px;
}
:deep(.is-link) {
  padding: 8px 0 !important;
}
:deep(.required-row) {
  &:nth-child(1) {
    .cell {
      position: relative;
      &::before {
        content: '*';
        display: inline-block;
        color: red;
      }
    }
  }
  &:nth-child(2) {
    .cell {
      position: relative;
      &::before {
        content: '*';
        display: inline-block;
        color: red;
      }
    }
  }
  &:nth-child(3) {
    .cell {
      position: relative;
      &::before {
        content: '*';
        display: inline-block;
        color: red;
      }
    }
  }
}
</style>
