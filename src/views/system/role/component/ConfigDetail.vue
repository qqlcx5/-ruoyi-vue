<template>
  <div class="table-box card-gary-bg">
    <div class="mb-15px">
      前台<span>（{{ props.frontTableData?.length || 0 }}）</span>
    </div>
    <el-table :data="props.frontTableData" max-height="300">
      <template v-if="origin === 'detail'">
        <el-table-column fixed prop="pathName" label="菜单权限" />
        <el-table-column prop="operations" label="操作权限" show-overflow-tooltip>
          <template #default="{ row }">{{ operationAccess(row.operations) }}</template>
        </el-table-column>
        <el-table-column label="数据权限" show-overflow-tooltip>
          <template #default="{ row }">{{ dataAccess(row) }}</template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column fixed prop="name" label="菜单权限" />
        <el-table-column label="操作权限" show-overflow-tooltip>
          <template #default="{ row }">{{ operationAccess(row.operations) }}</template>
        </el-table-column>
        <el-table-column label="数据权限" show-overflow-tooltip>
          <template #default="{ row }">{{ dataAccess(row) }}</template>
        </el-table-column>
      </template>
    </el-table>
  </div>
  <div class="table-box card-gary-bg">
    <div class="mb-15px">
      后台<span>（{{ props.backstageTableData?.length || 0 }}）</span>
    </div>
    <el-table :data="props.backstageTableData" max-height="300">
      <el-table-column fixed prop="name" label="菜单权限" />
      <el-table-column prop="operate" label="操作权限" />
      <el-table-column prop="data" label="数据权限" />
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { DATA_ACCESS_MAP } from './role.data'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { useDepartmentStoreWithOut } from '@/store/modules/department'

const { wsCache } = useCache('sessionStorage')
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
  const departmentStore = useDepartmentStoreWithOut()
  if (props.origin === 'detail') {
    if (data.dataScopeDept && data.dataScopeDept.length > 0) {
      return data.dataScopeDept.join('、')
    } else {
      return data.dataScopeName
    }
  } else {
    if (data.dataScope === 2) {
      let departmentMap = wsCache.get(CACHE_KEY.DEPARTMENT)
      if (!departmentMap) {
        departmentStore.setDepartment()
      }
      return data.dataScopeDeptIds
        .map((item) => {
          return departmentMap[item]
        })
        .join('、')
    } else {
      return DATA_ACCESS_MAP[data.dataScope]
    }
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
