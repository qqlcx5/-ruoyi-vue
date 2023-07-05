<template>
  <div class="flex">
    <!-- 左边栏目 品牌信息 -->
    <el-card>
      <div>
        <el-input
          v-model="queryBrand"
          placeholder="查询品牌"
          :suffix-icon="Search"
          class="mb-10px"
        />
        <el-button class="mb-14px" @click="handleTreeClick">
          <svg-icon icon-class="el-icon-arrow-down" />
          展开/折叠
        </el-button>
        <el-tree
          ref="treeRef"
          :data="data"
          :props="defaultProps"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </div>
    </el-card>
    <el-card class="ml-4">
      <template #header>
        <div class="text-title text-18px font-bold flex items-center">
          汽车之家-车型信息
          <el-button class="!h-28px ml-10px" type="primary" text bg> 清除 </el-button></div
        >
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
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ElTree } from 'element-plus'
import * as portraitFactor from '@/api/receptionManagement/portraitFactor'
// 展开/折叠
let treeRef = ref<InstanceType<typeof ElTree>>()
let treeNodeExpand = ref(true)

function handleTreeClick() {
  treeNodeExpand.value = !treeNodeExpand.value
  const nodes = treeRef.value?.store.nodesMap
  for (let node in nodes) {
    nodes[node].expanded = treeNodeExpand.value
  }
}
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

interface Tree {
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const data: Tree[] = [
  {
    label: '中埔哈弗红蓝标4S店（27）',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1'
          }
        ]
      }
    ]
  },
  {
    label: '中埔哈弗红蓝标4S店（22）',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1'
          }
        ]
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1'
          }
        ]
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1'
          }
        ]
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}
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

:deep(.el-tree-node__content) {
  .el-tree-node__label {
    font-size: 14px;
    font-weight: bold;
    color: rgb(51 51 51 / 100%);
  }
}
</style>
