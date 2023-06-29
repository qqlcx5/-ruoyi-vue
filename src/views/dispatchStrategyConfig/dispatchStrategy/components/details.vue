<template>
  <XModal v-model="dialogVisible" width="65vw" :title="dialogTitle" :showFooter="false">
    <div class="header">
      <el-row :gutter="24">
        <el-col :span="8">
          <span class="label">线索平台来源：</span><span>{{ info.clueChannelName }}</span>
        </el-col>
        <el-col :span="8">
          <span class="label">开通门店：</span><span>{{ info.shopName }}</span>
        </el-col>
        <el-col :span="6">
          <span class="label">所属区域：</span><span>{{ info.parentName }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <span class="label">派发门店：</span><span>{{ info.distributeShopName }}</span>
        </el-col>
        <el-col :span="6">
          <span class="label">清洗员：</span><span>{{ info.filterUserName }}</span>
        </el-col>
      </el-row>
    </div>
    <Table
      :columns="tableColumns"
      :data="tableList"
      header-cell-class-name="table-header-style"
      max-height="40vh"
      headerAlign="left"
      :showOverflowTooltip="true"
      :tooltip-options="{ popperClass: 'dispatchStrategy-tooltip' }"
      align="left"
    />
  </XModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormExpose } from '@/components/Form'
import * as dispatchApi from '@/api/clue/dispatchStrategy'

const formRef = ref<FormExpose>() // 表单 Ref

let dialogVisible = ref(false)
let dialogTitle = ref('新增')

// 根据门店获取成员
const getDistributeShopUserList = async (ids) => {
  let params = {
    shopIdList: ids
  }
  let data = await dispatchApi.getDistributeShopUserList(params)
  if (data) {
    let userList = data.userList || []
    tableList.value = userList.map((item) => {
      let autoBrandNames = item.autoBrandNames
      item.autoBrandNames = formatBrandSeries(autoBrandNames)
      let autoSeriesNames = item.autoSeriesNames
      item.autoSeriesNames = formatBrandSeries(autoSeriesNames)
      return item
    })
  }
}

const formatBrandSeries = (names) => {
  let autoBrandNames = ''
  if (Object.prototype.toString.call(names) == '[object String]') {
    try {
      names = JSON.parse(names)
      if (Object.prototype.toString.call(names) == '[object Array]') {
        autoBrandNames = names.join(',')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return autoBrandNames
}

const info = ref<any>({})
const openDialog = (data) => {
  console.log(data)
  info.value = data
  dialogVisible.value = true
  if (data && data.distributeShopId) {
    setTimeout(() => {
      data.distributeShopIdList = [data.distributeShopId]
      if (formRef.value) {
        formRef.value.setValues(data)
      }
      if (data.distributeShopIdList.length > 0) {
        getDistributeShopUserList(data.distributeShopIdList)
      }
    }, 200)
  }
  tableList.value = []
}
defineExpose({ openDialog })

const tableColumns = [
  {
    label: '门店',
    field: 'distributeShopName',
    minWidth: '100px'
  },
  {
    label: '成员',
    field: 'distributeUserName',
    minWidth: '80px'
  },
  {
    label: '成员平台昵称',
    field: 'nickname',
    minWidth: '120px'
  },
  {
    label: '销售品牌',
    field: 'autoBrandNames',
    minWidth: '100px'
  },
  {
    label: '销售车系',
    field: 'autoSeriesNames',
    minWidth: '100px'
  },
  {
    label: '派单状态',
    field: 'status',
    minWidth: '80px',
    formatter: (_, __, val: string) => {
      let obj = {
        0: '禁用',
        1: '启用'
      }
      return obj[val] || ''
    }
  }
]
// 岗位类型table
const tableList = ref<any[]>([])
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
:deep(.table-header-style) {
  height: 50px;
  font-size: 14px;
  color: $header-text-color;
  background-color: $table-head-color !important;
}
.header {
  margin-bottom: 15px;
  overflow: hidden;
  .el-row {
    margin-bottom: 8px;
    .label {
      color: #333;
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss">
.dispatchStrategy-tooltip {
  max-width: 40vw;
}
</style>
