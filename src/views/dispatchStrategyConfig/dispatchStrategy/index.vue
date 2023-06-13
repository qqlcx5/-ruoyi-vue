<template>
  <el-card class="dispatch-strategy-container" :gutter="12" shadow="never">
    <el-form :model="searchForm" class="wg-query-form w-full" ref="elFormRef" label-position="left">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="门店">
            <el-cascader
              ref="treeShopCascader"
              v-model="searchForm.shopId"
              placeholder="请选择分公司门店"
              :options="shopData"
              :props="{
                label: 'departName',
                value: 'departId',
                expandTrigger: 'hover',
                emitPath: false
              }"
              :show-all-levels="false"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="线索来源">
            <el-input v-model="searchForm.searchClueName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6" class="!flex flex-column justify-between">
          <div>
            <el-button type="primary">查询</el-button>
            <el-button>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <ContentWrap>
    <!--    列表-->
    <el-row>
      <el-col :span="3">
        <el-button type="primary">新增</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="danger">删除</el-button>
      </el-col>
    </el-row>
    <el-table
      class="mt10 dispatch-table"
      :data="tableData"
      @selection-change="selectedChange"
      border
    >
      <el-table-column type="selection" />
      <el-table-column label="线索id" prop="id" width="120" />
      <el-table-column label="线索平台来源" prop="clueChannelName" width="120" />
      <el-table-column label="所属区域" prop="parentName" width="120" />
      <el-table-column label="线索清洗员" prop="filterUserName" width="120" />
      <el-table-column label="派发人员配置" align="center" class="staff-config-column">
        <template #header>
          <el-table ref="replacement-table">
            <el-table-column label="派发门店" />
            <el-table-column label="实际派发成员数" />
            <el-table-column label="是否派发" />
            <el-table-column label="是否外部派发" />
          </el-table>
        </template>
        <template #default="{ row }">
          <el-table :data="row.distributeShopList" :show-header="false">
            <el-table-column label="派发门店" prop="distributeShopName" />
            <el-table-column label="实际派发成员数" prop="distributeUserNum">
              <template #default="shop">
                <el-button type="text" @click="showStaffTable(shop.row.distributeShopId, row.id)">
                  {{ shop.row.distributeUserNum }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="是否派发" prop="status">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  :active-value="1"
                  :inactive-value="0"
                  @change="onUpdateStatus(scope, row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="是否外部派发" prop="isExternalDistribute">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.isExternalDistribute"
                  active-color="#13ce66"
                  :active-value="1"
                  :inactive-value="0"
                  @change="onUpdateExternalDistribute(scope, row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="接单模式" prop="receivePattern" width="120">
        <template #default="{ row }">
          {{ cptReceivePattern(row.receivePattern) }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createBy" width="120" />
      <el-table-column label="创建时间" prop="createTime" width="120" />
      <el-table-column label="开通门店" prop="shopName" width="120" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="text" @click="editRule(row.id)"> 编辑 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
  <staff-table ref="staffTableRef" />
</template>

<script setup lang="ts" name="dispatchStrategy">
import StaffTable from '@/views/dispatchStrategyConfig/components/staffTable.vue'

const treeShopCascader = ref()
const searchForm = ref({ shopId: '', searchClueName: '' })
const tableData = ref({
  clueChannelName: '',
  parentName: '',
  filterUserName: '',
  distributeShopList: [],
  receivePattern: '',
  createBy: '',
  createTime: '',
  shopName: ''
})
const selectedIds = ref(['0'])
const cptReceivePattern = computed(() => {
  const map = {
    1: '配置模式',
    2: '混合模式',
    3: '团队独享模式'
  }
  return function (val) {
    return map[val] || ''
  }
})
const selectedChange = (val: string[]): void => {
  selectedIds.value = val.map((item: any) => item.id)
}

// 派发成员数弹窗
const staffTableRef = ref()
const showStaffTable = (distributeShopId, id) => {
  staffTableRef.value.openDialog(distributeShopId, id)
}

// 格式化级联选择器数据
type ShopDataObj = {
  departName: string
  departId: string
  children: ShopDataObj[]
}
const shopData = ref<ShopDataObj[]>([])
// const formatTreeData = (data) => {
//   for (let i = 0; i < data.length; i++) {
//     if (data[i].children && data[i].children.length < 1) {
//       data[i].children = undefined
//     } else if (data[i].children) {
//       formatTreeData(data[i].children)
//     }
//   }
//   return data
// }
</script>

<style lang="scss" scoped></style>
