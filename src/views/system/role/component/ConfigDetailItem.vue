<template>
  <div class="table-box card-gary-bg">
    <div class="mb-15px">
      {{ props.title }}<span>（{{ props.tableData?.length || 0 }}）</span>
    </div>
    <el-table class="config-table" :data="props.tableData" max-height="300">
      <template v-if="origin === 'detail'">
        <el-table-column fixed prop="pathName" label="菜单权限" />
      </template>
      <template v-else>
        <el-table-column fixed prop="name" label="菜单权限" />
      </template>
      <el-table-column label="操作权限">
        <template #default="{ row }">
          <!--          {{ operationAccess(row.operations) }}-->
          <el-tooltip placement="top">
            <template #content>
              <div class="max-w-300px">
                {{ operationAccess(row.operations) }}
              </div>
            </template>
            <div class="text-ellipsis">{{ operationAccess(row.operations) }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="数据权限">
        <template #default="{ row }">
          <el-tooltip placement="top">
            <template #content>
              <div v-if="row.dataScope === 2" class="max-w-300px">
                <div v-if="row.dataScopeDepts && row.dataScopeDepts.length > 0" class="flex">
                  <div class="flex-shrink-0">指定部门：</div>
                  <div>{{
                    row.dataScopeDepts
                      .map((item) => item.componentName || `${item.name}(${item.code})`)
                      .join('、')
                  }}</div>
                </div>
                <div v-if="row.dataScopeUsers && row.dataScopeUsers.length > 0" class="flex">
                  <div class="flex-shrink-0">指定成员：</div>
                  <div>{{
                    row.dataScopeUsers
                      .map((item) => `${item.nickname}(${item.username})`)
                      .join('、')
                  }}</div>
                </div>
              </div>
              <div v-else-if="row.dataScope === 6" class="max-w-300px">
                <div v-if="row.dataScopeDealers && row.dataScopeDealers.length > 0" class="flex">
                  <div class="flex-shrink-0">指定经销商：</div>
                  <div>{{ row.dataScopeDealers.map((item) => item.name).join('、') }}</div>
                </div>
                <div v-if="row.dataScopeStores && row.dataScopeStores.length > 0" class="flex">
                  <div class="flex-shrink-0">指定门店：</div>
                  <div>{{ row.dataScopeStores.map((item) => item.name).join('、') }}</div>
                </div>
              </div>
              <div v-else-if="showDetailsTooltip(row)" class="max-w-300px">
                <div v-if="row.dealers && row.dealers.length > 0" class="flex">
                  <div class="flex-shrink-0">指定经销商：</div>
                  <div>{{ row.dealers.join('、') }}</div>
                </div>
                <div v-if="row.dataScopeStore && row.dataScopeStore.length > 0" class="flex">
                  <div class="flex-shrink-0">指定门店：</div>
                  <div>{{ row.dataScopeStore.join('、') }}</div>
                </div>
                <div v-if="row.dataScopeDept && row.dataScopeDept.length > 0" class="flex">
                  <div class="flex-shrink-0">指定部门：</div>
                  <div>{{ row.dataScopeDept.join('、') }}</div>
                </div>
                <div v-if="row.dataScopeUser && row.dataScopeUser.length > 0" class="flex">
                  <div class="flex-shrink-0">指定成员：</div>
                  <div>{{
                    row.dataScopeUser.map((item) => `${item.nickname}(${item.username})`).join('、')
                  }}</div>
                </div>
              </div>
              <div v-else class="max-w-300px">
                {{ dataAccess(row) }}
              </div>
            </template>
            <div class="text-ellipsis">{{ dataAccess(row) }}</div>
          </el-tooltip>
        </template>
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
  tableData: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
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
  const {
    dataScopeDept,
    dataScopeUser,
    dataScopeStore,
    dealers,
    dataScope,
    dataScopeName,
    dataScopeDepts,
    dataScopeUsers,
    dataScopeStores,
    dataScopeDealers
  } = data
  if (props.origin === 'detail') {
    if (
      (dataScopeDept && dataScopeDept.length > 0) ||
      (dataScopeUser && dataScopeUser.length > 0)
    ) {
      return (
        (dataScopeDept ? dataScopeDept.join('、') + '、' : '') +
        (dataScopeUser
          ? dataScopeUser.map((item) => `${item.nickname}(${item.username})`).join('、')
          : '')
      )
    } else if ((dataScopeStore && dataScopeStore.length > 0) || (dealers && dealers.length > 0)) {
      return (
        (dataScopeStore ? dataScopeStore.join('、') + '、' : '') +
        (dealers ? dealers.join('、') : '')
      )
    } else {
      return dataScopeName || ''
    }
  } else {
    if (dataScope === 2) {
      // 指定部门
      return (
        (dataScopeDepts
          ? dataScopeDepts
              .map((item) => {
                return item.name
              })
              .join('、') + '、'
          : '') +
        dataScopeUsers
          .map((item) => {
            return item.name
          })
          .join('、')
      )
    } else if (dataScope === 6) {
      // 指定门店
      return (
        (dataScopeStores
          ? dataScopeStores
              .map((item) => {
                return item.name
              })
              .join('、') + '、'
          : '') +
        dataScopeDealers
          .map((item) => {
            return item.name
          })
          .join('、')
      )
    } else {
      return DATA_ACCESS_MAP[dataScope]
    }
  }
}
const brandAccess = (data) => {
  if (data.dataScopeBrandIds && data.dataScopeBrandIds.length > 0) {
    return data.dataScopeBrandIds
      .map((item) => {
        return getDictLabel('brand', item)
      })
      .join('、')
  } else {
    return '不限品牌'
  }
}
const showDetailsTooltip = (row) => {
  const { dataScopeDept, dataScopeUser, dataScopeStore, dealers } = row
  return (
    (dataScopeDept && dataScopeDept.length > 0) ||
    (dataScopeUser && dataScopeUser.length > 0) ||
    (dataScopeStore && dataScopeStore.length > 0) ||
    (dealers && dealers.length > 0)
  )
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
    border: 1px solid #eaebef;
    box-sizing: border-box;
  }
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
