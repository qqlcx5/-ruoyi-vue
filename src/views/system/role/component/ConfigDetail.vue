<template>
  <div class="table-box card-gary-bg">
    <div class="mb-15px">
      前台<span>（{{ props.frontTableData?.length || 0 }}）</span>
    </div>
    <el-table class="config-table" :data="props.frontTableData" max-height="300">
      <template v-if="origin === 'detail'">
        <el-table-column fixed prop="pathName" label="菜单权限" />
      </template>
      <template v-else>
        <el-table-column fixed prop="name" label="菜单权限" />
      </template>
      <el-table-column label="操作权限" show-overflow-tooltip>
        <template #default="{ row }">{{ operationAccess(row.operations) }}</template>
      </el-table-column>
      <el-table-column label="数据权限" show-overflow-tooltip>
        <template #default="{ row }">{{ dataAccess(row) }}</template>
      </el-table-column>
      <el-table-column label="品牌权限" show-overflow-tooltip>
        <template #default="{ row }">{{ brandAccess(row) }}</template>
      </el-table-column>
    </el-table>
  </div>
  <div class="table-box card-gary-bg">
    <div class="mb-15px">
      后台<span>（{{ props.backstageTableData?.length || 0 }}）</span>
    </div>
    <el-table class="config-table" :data="props.backstageTableData" max-height="300">
      <template v-if="origin === 'detail'">
        <el-table-column fixed prop="pathName" label="菜单权限" />
      </template>
      <template v-else>
        <el-table-column fixed prop="name" label="菜单权限" />
      </template>
      <el-table-column label="操作权限" show-overflow-tooltip>
        <template #default="{ row }">{{ operationAccess(row.operations) }}</template>
      </el-table-column>
      <el-table-column label="数据权限" show-overflow-tooltip>
        <template #default="{ row }">{{ dataAccess(row) }}</template>
      </el-table-column>
      <el-table-column label="品牌权限" show-overflow-tooltip>
        <template #default="{ row }">{{ brandAccess(row) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { DATA_ACCESS_MAP } from './role.data'
import { getDictLabel } from '@/utils/dict'

const props = defineProps({
  frontTableData: {
    type: Array,
    default: () => []
  },
  backstageTableData: {
    type: Array,
    default: () => []
  },
  origin: {
    type: String,
    default: ''
  }
})
const operationAccess = (data): string => {
  if (data) {
    if (props.origin === 'detail') {
      return data.join('、')
    } else {
      return data
        .filter((item) => item)
        .map((item) => item.name)
        .join('、')
    }
  }
  return '-'
}
const dataAccess = (data): string => {
  if (props.origin === 'detail') {
    if (data.dataScopeDept && data.dataScopeDept.length > 0) {
      return data.dataScopeDept.join('、')
    } else if (data.dataScopeUser && data.dataScopeUser.length > 0) {
      return data.dataScopeUser.join('、')
    } else if (data.dataScopeStore && data.dataScopeStore.length > 0) {
      return data.dataScopeStore.join('、')
    } else {
      return data.dataScopeName
    }
  } else {
    if (data.dataScope === 2) {
      // 指定部门
      return data.dataScopeDepts
        .map((item) => {
          return item.name
        })
        .join('、')
    } else if (data.dataScope === 6) {
      // 指定门店
      return data.dataScopeStores
        .map((item) => {
          return item.name
        })
        .join('、')
    } else {
      return DATA_ACCESS_MAP[data.dataScope]
    }
  }
}
const brandAccess = (data) => {
  return data.dataScopeBrandIds
    ? data.dataScopeBrandIds
        .map((item) => {
          return getDictLabel('brand', item)
        })
        .join('、')
    : ''
}
</script>
<style lang="scss" scoped>
.table-box {
  padding: 15px;
  margin-bottom: 10px;
  :deep(.el-table th.el-table__cell) {
    background-color: #f3f8ff !important;
  }
  .config-table {
    box-sizing: border-box;
    border: 1px solid #eaebef;
  }
}
</style>
