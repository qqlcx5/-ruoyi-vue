<template>
  <div class="flex">
    <el-card>
      <template #header>
        <div class="text-title text-18px font-bold"> 品牌信息</div>
      </template>
      <div>
        <el-input
          v-model="queryBrand"
          placeholder="查询品牌"
          :suffix-icon="Search"
          class="mb-10px"
        />
        <div
          v-for="item in 10"
          :key="item"
          class="pl-16px pr-16px pt-10px pb-10px"
          :class="{
            'bg-blue-100 rounded text-14px text-blue': item % 3 == 0
          }"
        >
          哈弗(36)
        </div>
      </div>
    </el-card>
    <el-card class="ml-4">
      <template #header>
        <div class="text-title text-18px font-bold flex items-center">
          哈弗-车系信息
          <el-button class="!h-28px ml-10px" type="primary" text bg> 清除 </el-button>
        </div>
      </template>
      <div class="flex">
        <form-table
          ref="tableRef"
          :form-options="{ schema: allSchemas.searchSchema }"
          :table-options="{
            columns: allSchemas.tableColumns,
            listApi: portraitFactor.portraitFactorLevelConfigAllListApi,
            showAdd: true,
            actionButtons
          }"
        >
          <template #applicableShopName="{ row }"> {{ row.id }} </template>
          <template #openRules="{ row }">
            <el-switch
              v-model="row.openRules"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
              inline-prompt
              @click.stop
            />
          </template>
        </form-table>
        <!-- 子车系信息 -->
        <el-card class="ml-4">
          <template #header>
            <div class="text-title text-18px font-bold flex items-center"> 子车系信息 </div>
          </template>
          <form-table
            ref="tableRef"
            :form-options="{ schema: allSchemas.searchSchema }"
            :table-options="{
              columns: allSchemas.tableColumns,
              listApi: portraitFactor.portraitFactorLevelConfigAllListApi,
              showAdd: true,
              actionButtons
            }"
          >
            <template #applicableShopName="{ row }"> {{ row.id }} </template>
            <template #openRules="{ row }">
              <el-switch
                v-model="row.openRules"
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
                inline-prompt
                @click.stop
              />
            </template>
          </form-table>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import * as portraitFactor from '@/api/receptionManagement/portraitFactor'

let queryBrand = ref('')

const actionButtons = [
  {
    name: '编辑',
    click: (row) => {
      console.log(row)
    }
  },
  {
    name: '删除',
    click: (row) => {
      console.log(row)
    }
  }
]

/* -------------------------------------------------------------------------- */
import { TableColumn } from '@/types/table'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const columns: TableColumn[] = [
  {
    label: '考核规则名称',
    field: 'name',
    isSearch: true,
    isTable: false
  },
  {
    label: '规则名称',
    field: 'distributeRuleName',
    disabled: true
  },
  {
    label: '适用门店',
    field: 'applicableShopName',
    disabled: true
  },
  {
    label: '状态',
    field: 'openRules'
  },
  {
    label: '创建人',
    field: 'creator'
  }
]
const { allSchemas } = useCrudSchemas(columns)
</script>

<style lang="scss" scoped>
.text-blue {
  color: #0081ff;
}
</style>
