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
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <ContentWrap>
    <!--    列表-->
    <el-row :gutter="10">
      <el-col :span="8">
        <el-button type="primary" @click="addRule">新增</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <el-table
      class="mt10 dispatch-table"
      v-loading="loading"
      :data="tableData"
      @selection-change="selectedChange"
      :span-method="objectSpanMethod"
      :cell-class-name="tableRowClassName"
      border
    >
      <el-table-column type="selection" />
      <el-table-column label="线索id" prop="id" width="120" />
      <el-table-column label="线索平台来源" prop="clueChannelName" width="120" />
      <el-table-column label="所属区域" prop="parentName" width="120" />
      <el-table-column label="线索清洗员" prop="filterUserName" width="120" />

      <el-table-column label="派发门店" prop="distributeShopName" />
      <el-table-column label="实际派发成员数" prop="distributeUserNum">
        <template #default="shop">
          <el-button type="text">
            {{ shop.row.distributeUserNum }} {{ shop.row.isMergeTool }}
            {{ shop.row.distributeShopListCount }}
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
          />
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
          <el-button type="text" @click="editRule(row.id)"> 编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="searchForm.pageNo"
      v-model:limit="searchForm.pageSize"
      @pagination="getTableData"
    />
  </ContentWrap>
  <el-dialog title="提示" v-model:visible="delDialog" width="30%">
    <p class="mb10"
      ><i class="el-icon-warning Danger"></i>确认要删除这<span class="Danger">{{
        selectedIds.length
      }}</span
      >条派发策略吗？
    </p>
    <p>删除后，对应派发成员将无法接收到线索派发。</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </div>
    </template>
  </el-dialog>
  <staff-table ref="staffTableRef" />
  <crud ref="crudRef" @refresh="handleSearch" />
</template>

<script setup lang="ts" name="dispatchStrategy">
import StaffTable from '@/views/dispatchStrategyConfig/components/staffTable.vue'
import Crud from '@/views/dispatchStrategyConfig/dispatchStrategy/crud.vue'
import { treeShopData } from '@/api/common/index'
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import { dispatch_strategy_res } from './dispatchStrategy.data'
import { h } from 'vue'
const { t } = useI18n() // 国际化
onMounted(() => {
  getShopData()
  handleSearch()
})

const treeShopCascader = ref()
const message = useMessage() // 消息弹窗
const total = ref(0) // 列表的总页数
const loading = ref(true) // 列表的加载中
const searchForm = ref({
  shopId: '',
  searchClueName: '',
  pageNo: 1,
  pageSize: 10
})
// 搜索
const handleSearch = () => {
  searchForm.value.pageNo = 1
  getTableData(searchForm)
}
// 查询列表数据
const getTableData = async (searchForm) => {
  console.log(searchForm)

  loading.value = true
  try {
    // let res = await dispatchApi.getClueDistribute(searchForm)
    let res: any = dispatch_strategy_res
    if (res) {
      console.log('反反复复反反复复付')
      let list = res.data.list

      let newArr: any[] = []
      list.forEach((item: any, index) => {
        item.index = index + 1
        item.distributeShopListCount = item.distributeShopList.length
        if (item.distributeShopList.length > 0) {
          item.distributeShopList.forEach((aItem, aIndex) => {
            item.isMergeTool = false
            if (aIndex == 0) {
              item.isMergeTool = true
            }
            item = {
              ...item,
              ...aItem
            }

            newArr.push(JSON.parse(JSON.stringify(item)))
          })
        } else {
          item.isMergeTool = false
          newArr.push(JSON.parse(JSON.stringify(item)))
        }
      })

      console.log(newArr)

      tableData.value = newArr
      console.log(tableData)
      nextTick(() => {
        const replacementTable = document.querySelector('.replacement-table')
        const elTableBodyWrapper = replacementTable?.querySelector('.el-table__body-wrapper')
        if (elTableBodyWrapper) {
          replacementTable?.removeChild(elTableBodyWrapper)
        }
      })
    } else {
      message.error(res.message)
    }
  } finally {
    loading.value = false
  }
}

const objectSpanMethod = ({ row, column }) => {
  let property: string = column.property || ''
  let isTool: boolean = [
    '',
    'id',
    'clueChannelName',
    'parentName',
    'filterUserName',
    'receivePattern',
    'createBy',
    'createTime',
    'shopName'
  ].includes(property) //需要合并的字段
  // ----------皮卡丘------------
  let num = row.distributeShopList.length
  if (isTool && num > 0) {
    if (row.isMergeTool) {
      return {
        rowspan: num,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

const tableRowClassName = ({ row, column }) => {
  console.log(row)
  let num = row.distributeShopList.length
  let property: string = column.property || ''
  let isTool: boolean = [
    'distributeShopName',
    'distributeUserNum',
    'status'
    // 'isExternalDistribute'
  ].includes(property) //需要合并的字段

  if (isTool && num > 1) {
    console.log(num)

    return 'hide-border-right'
  }
}

const elFormRef = ref()
const handleReset = () => {
  elFormRef.value.resetField()
  handleSearch()
}

const tableData = ref<any[]>([])

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

// 新增派发策略
const crudRef = ref()
const addRule = () => {
  crudRef.value.openDialog()
}
// 编辑派发策略
const editRule = (id) => {
  crudRef.value.openDialog(id)
}

// 选中后批量操作
const delDialog = ref(false)
const selectedIds = ref<any[]>([])
const selectedChange = (val: string[]): void => {
  selectedIds.value = val.map((item: any) => item.id)
}
const handleDelete = () => {
  message
    .wgConfirm(
      '删除后，对应派发员将无法接受到线索派发',
      <any>h('span', ['确定要删除 ', h('span', {style: { color: 'red' }}, '10'), ' 条派发策略吗？']),
      {
        confirmButtonText: t('common.confirmDel'),
        cancelButtonText: t('common.cancel')
      }
    )
    .then(() => {
      console.log('=====999====')
    })
    .catch(() => {})
  if (selectedIds.value.length < 1) {
    return message.warning('未选择数据')
  } else {
    delDialog.value = true
  }
}
// 删除
const confirmDel = () => {
  dispatchApi.delStrategy({ ids: selectedIds.value }).then((res) => {
    if (res) {
      message.success('删除成功')
      delDialog.value = false
      handleSearch()
    } else {
      message.error(res.message)
    }
  })
}

// 派发成员数弹窗
const staffTableRef = ref()
// const showStaffTable = (distributeShopId, id) => {
//   staffTableRef.value.openDialog(distributeShopId, id)
// }

// 格式化级联选择器数据
type ShopDataObj = {
  departName: string
  departId: string
  children: ShopDataObj[]
}
const shopData = ref<ShopDataObj[]>([])
const formatTreeData = (data) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].children && data[i].children.length < 1) {
      data[i].children = undefined
    } else if (data[i].children) {
      formatTreeData(data[i].children)
    }
  }
  return data
}
const getShopData = () => {
  treeShopData().then((res) => {
    if (res) {
      shopData.value = formatTreeData(res.data)
    } else {
      message.error(res.message)
    }
  })
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
}
:deep(.hide-border-right) {
  border-right: 0;
}
</style>
