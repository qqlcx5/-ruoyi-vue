<template>
  <div class="table-box card-gary-bg">
    <div class="mb-15px">
      前台<span>（{{ frontTableData.length || 0 }}）</span>
    </div>
    <el-table :data="frontTableData">
      <el-table-column fixed prop="name" label="菜单权限" />
      <el-table-column label="操作权限">
        <template #default="{ row }">{{ operationAccess(row.operations) }}</template>
      </el-table-column>
      <el-table-column label="数据权限">
        <template #default="{ row }">{{ dataAccess(row) }}</template>
      </el-table-column>
    </el-table>
  </div>
  <div class="table-box card-gary-bg">
    <div class="mb-15px">
      后台<span>（{{ backstageTableData.length || 0 }}）</span>
    </div>
    <el-table :data="backstageTableData" header-cell-class-name="tb-h-bg">
      <el-table-column fixed prop="name" label="菜单权限" />
      <el-table-column prop="operate" label="操作权限" />
      <el-table-column prop="data" label="数据权限" />
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { DATA_ACCESS_MAP } from './role.data'
defineProps({
  frontTableData: {
    type: Array,
    default: () => []
  },
  backstageTableData: {
    type: Array,
    default: () => []
  }
})
const operationAccess = (data): string => {
  if (data) return data.map((item) => item.name).join('、')
  return '-'
}
const dataAccess = (data): string => {
  if (data.dataScope === 2) {
    return '12312'
  } else {
    return DATA_ACCESS_MAP[data.dataScope]
  }
}
</script>
<style lang="scss" scoped>
.table-box {
  padding: 15px;
  margin-bottom: 10px;
}
.tb-h-bg {
  background-color: #0d84ff;
}
</style>
