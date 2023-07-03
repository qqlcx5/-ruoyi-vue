<template>
  <form-table
    ref="tableRef"
    :form-options="{ schema: allSchemas.searchSchema }"
    :table-options="{
      columns: allSchemas.tableColumns,
      showAdd: false,
      listApi: callApi.getCallRecordList,
      actionButtons
    }"
  />
  <el-drawer v-model="detailVisible" title="详情" :size="763" :lock-scroll="false">
    <template #header>
      <div class="text-20px font-700 !mb-0">详情</div>
    </template>
    <template #default>
      <div class="sub-title">
        <span class="blue-icon"></span>
        基本信息</div
      >
      <Descriptions :schema="allSchemas.detailSchema" :data="detailData" />
      <!--      <div class="basic-info"> </div>-->
      <div class="sub-title">
        <span class="blue-icon"></span>
        语音文件</div
      >
      <template v-if="voiceAddressArr.length > 0">
        <div v-for="(item, index) in voiceAddressArr" :key="index">
          <call-record ref="callRecordRef" :voiceAdressObj="item" />
        </div>
      </template>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="call">
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import * as callApi from '@/api/system/call/index'
import { formatDate } from '@/utils/formatTime'
import CallRecord from './components/callRecord/index.vue'
import { DICT_TYPE } from '@/utils/dict'
import { getCallRecordDetail } from '@/api/system/call/index'
// const tableRef = ref()
const detailVisible = ref(false)

const columns: TableColumn[] = [
  {
    label: '成员姓名',
    field: 'sysUsername',
    isSearch: true,
    disabled: true
  },
  {
    label: '客户姓名',
    field: 'customerRealName',
    isSearch: true,
    disabled: true
  },
  {
    label: '接通状态',
    field: 'successfullyType',
    isSearch: true,
    disabled: true,
    dictType: DICT_TYPE.SYSTEM_SUCCESSFULLY_TYPE,
    dictClass: 'number'
  },
  {
    label: '通话类型',
    field: 'serviceType',
    isSearch: true,
    disabled: true,
    dictType: DICT_TYPE.SYSTEM_SERVICE_TYPE,
    dictClass: 'string'
  },
  {
    label: '客户号码',
    field: 'customerMobile',
    isSearch: true
  },
  {
    label: '成员号码',
    field: 'workerMobile',
    isSearch: true
  },
  {
    label: '云录音类型',
    field: 'cloudRecordType',
    isSearch: true,
    dictType: DICT_TYPE.SYSTEM_CLOUD_RECORD_TYPE,
    dictClass: 'number'
  },
  {
    label: '创建时间',
    field: 'createTime',
    width: 180,
    isSearch: true,
    search: {
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD hh:mm:ss'
      }
    },
    formatter: (_, __, val: string) => {
      return formatDate(new Date(val))
    }
  },
  // {
  //   label: '客户',
  //   field: 'department'
  // },
  // {
  //   label: '成员',
  //   field: 'department'
  // },
  {
    label: '所属部门',
    field: 'departName'
  },
  // {
  //   label: '接通状态',
  //   field: 'department'
  // },
  {
    label: '通话时长',
    field: 'duration'
  },
  // {
  //   label: '通话类型',
  //   field: 'serviceType'
  // },
  {
    label: '开始时间',
    field: 'startTime'
  },
  {
    label: '接通时间',
    field: 'dialTime'
  },
  {
    label: '结束时间',
    field: 'endTime'
  }
  // {
  //   label: '云录音类型',
  //   field: 'department'
  // }
]
const detailData = ref() // 详情
const callRecordRef = ref()
const actionButtons = [
  {
    name: '详情',
    click: async (row) => {
      detailData.value = row
      await queryCallRecordDetails(row.callRecordId)
      detailVisible.value = true
    }
  }
]
const voiceAddressArr = ref<object[]>([])

const queryCallRecordDetails = async (callRecordId) => {
  const data = await getCallRecordDetail(callRecordId)
  if (data.disposition === 'ANSWERED') {
    // 接通情况下
    voiceAddressArr.value = [
      {
        title: '混合语音',
        voiceAddress: data.voiceAddress,
        businessType: 11,
        callRecordId: callRecordId
      },
      {
        title: '员工语音',
        voiceAddress: data.voiceAddressIn,
        businessType: 12,
        callRecordId: callRecordId
      },
      {
        title: '客户语音',
        voiceAddress: data.voiceAddressOut,
        businessType: 13,
        callRecordId: callRecordId
      }
    ]
  }
}
const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped>
.sub-title {
  display: flex;
  margin-top: 20px;
  margin-bottom: 19px;
  font-size: 16px;
  font-weight: bold;
  justify-content: flex-start;
  align-items: center;

  &:first-child {
    margin-top: 0;
  }

  .blue-icon {
    width: 3px;
    height: 14px;
    margin-right: 3px;
    background-color: rgb(0 129 255 / 100%);
  }
}
</style>
