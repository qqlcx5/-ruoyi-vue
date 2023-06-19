<template>
  <div>
    <XModal v-model="dialogVisible" width="70%" :title="dialogTitle">
      <XButton class="add-row-btn" type="primary" title="添加行" @click="handleAdd()" />
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
        <template #clueSource="{ row }">
          <el-cascader
            v-model="row.clueSource"
            size="small"
            :options="options"
            :show-all-levels="false"
          />
        </template>
        <template #shopName="{ row }">
          <el-cascader
            v-model="row.shopName"
            size="small"
            :options="options"
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
          <el-select v-model="row.needFilter" placeholder="请选择" size="small">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #autoDistribute="{ row }">
          <el-select v-model="row.autoDistribute" size="small" placeholder="请选择">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #platformRule="{ row }">
          <el-select v-model="row.platformRule" placeholder="请选择" size="small">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <template #isShow="{ row }">
          <el-select v-model="row.isShow" placeholder="请选择" size="small">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
// import * as channelApi from '@/api/clue/channel'
import { ref } from 'vue'
defineProps({
  msg: String
})
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
// 弹出框
const dialogVisible = ref(false) // 是否显示弹出层
const dialogTitle = ref('新增') // 弹出层标题
const actionLoading = ref(false) // 遮罩层

const tableColumns = [
  {
    label: '编号',
    field: 'serialNumber',
    minWidth: '100px'
  },
  {
    label: '线索平台',
    field: 'clueSource',
    minWidth: '100px'
  },
  {
    label: '线索平台开通门店',
    field: 'shopName',
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
  },
  {
    label: '操作',
    field: 'action',
    fixed: 'right',
    width: '70px',
    showOverflowTooltip: false
  }
]
// 岗位类型table
const tableList = ref<ChannelVO[]>([])

const handleAdd = () => {
  let addItem = {
    serialNumber: '',
    clueSource: '',
    shopName: '',
    platformUsername: '',
    platformPassword: '',
    needFilter: '',
    autoDistribute: '',
    platformRule: '',
    isShow: ''
  }
  tableList.value.push(addItem)
}
const delPostTypeLine = (index: number): void => {
  if (tableList.value.length === 1) return message.warning(`至少要有一行信息！`)
  tableList.value.splice(index, 1)
}
const options = [
  {
    label: '垂直媒体',
    value: '垂直媒体',
    children: [
      {
        value: '懂车帝',
        label: '懂车帝'
      },
      {
        value: '汽车之家',
        label: '汽车之家'
      }
    ]
  },
  {
    label: '自媒体',
    value: '自媒体',
    children: [
      {
        label: '抖音',
        value: '抖音'
      },
      {
        label: '微信',
        value: '微信'
      },
      {
        label: '微博',
        value: '微博'
      }
    ]
  }
]
const selectOptions = [
  {
    value: '0',
    label: '否'
  },
  {
    value: '1',
    label: '是'
  }
]
// 保存按钮
const submitForm = async () => {
  console.log('======', tableList.value)
}
const openModal = () => {
  tableList.value = []
  handleAdd()
  dialogVisible.value = true
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
}
</style>
