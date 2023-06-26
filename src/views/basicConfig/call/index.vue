<template>
  <div class="basic-config-content call-settings-container">
    <div class="config-form-item">
      <span class="mr-8px">每个客户每天允许打通电话次数</span>
      <el-button
        type="primary"
        v-if="!editFlag"
        :loading="btnLoading"
        :disabled="loading"
        @click="toggleEdit(true)"
        >{{ btnLoading ? '保存中' : '编辑' }}</el-button
      >
      <template v-else>
        <el-button type="primary" @click="toggleEdit(false)">保存</el-button>
        <el-button type="primary" @click="handleAddRow">新增行</el-button>
      </template>
    </div>
    <el-form :disabled="!editFlag">
      <el-table
        ref="tableRef"
        :data="ruleForm.canGetThroughVOs"
        max-height="calc(100% + 54px)"
        class="custom-table mt-20px"
        v-loading="loading"
      >
        <el-table-column label="可打通次数" min-width="200">
          <template #default="{ row }">
            <el-input-number
              v-model="row.canGetThroughNum"
              :controls="false"
              :min="0"
              step-strictly
              :step="1"
            />
          </template>
        </el-table-column>
        <el-table-column label="参与计数门店" min-width="200">
          <template #default="{ row, $index }">
            <el-cascader
              v-model="row.joinCountShopIds"
              :options="shopTreeList"
              :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
              filterable
              collapse-tags
              collapse-tags-tooltip
              clearable
              @visible-change="visibleChange($event, row, $index)"
              style="min-width: 240px"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="60">
          <template #default="{ row }">
            <el-switch v-model="row.isEnable" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column v-if="editFlag" label="操作" width="80">
          <template #default="{ $index }">
            <el-button type="primary" link @click="handleDelRow($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { queryClueFollowConfig, saveClueFollowConfig } from '@/api/clue/basicConfig'
import { listToTree } from '@/utils/tree'
import { cloneDeep } from 'lodash-es'
import { ElTable } from 'element-plus'
import { useOption } from '@/store/modules/options'
const store = useOption()
const loading = ref<boolean>(false)
let ruleForm = reactive<{ canGetThroughVOs: any[] }>({ canGetThroughVOs: [] })
const getInfo = async () => {
  try {
    const data = await queryClueFollowConfig()
    data.canGetThroughVOs = data.canGetThroughVOs || []
    data.canGetThroughVOs.forEach((item) => {
      if (item.joinCountShopIds) {
        item.joinCountShopIds = item.joinCountShopIds.map((d) => +d)
      }
    })
    ruleForm = reactive(data)
    setTimeout(() => {}, 1000)
  } finally {
    loading.value = false
  }
}

const shopList = ref<object[]>([])
const shopTreeList = ref<object[]>([])
const getShopList = async () => {
  const res = await store.getShopList()
  shopList.value = res.shopList
  shopTreeList.value = res.shopTreeList
  shopList.value[0]['a'] = 1
  console.log(store)
}
const visibleChange = async (val, row, index) => {
  if (val) {
    shopTreeList.value = []
    await nextTick()
    const checkedList = ruleForm.canGetThroughVOs.reduce((arr, item, itemIndex) => {
      const ids = item.joinCountShopIds || []
      if (itemIndex !== index && ids.length) {
        arr.push(...ids)
      }
      return arr
    }, [])
    shopTreeList.value = store.dealShopList(unref(shopList), checkedList, [])
  }
}

loading.value = true
Promise.all([getInfo(), getShopList()]).finally(() => {
  loading.value = false
})

const editFlag = ref<boolean>(false)
const btnLoading = ref<boolean>(false)
const toggleEdit = async (bool) => {
  editFlag.value = bool
  if (bool === false) {
    try {
      btnLoading.value = true
      await saveClueFollowConfig(ruleForm)
    } finally {
      btnLoading.value = false
    }
  }
}
const tableRef = ref<InstanceType<typeof ElTable>>()
const handleAddRow = async () => {
  ruleForm.canGetThroughVOs.push({
    canGetThroughNum: null,
    joinCountShopIds: [],
    isEnable: 0
  })
  await nextTick()
  tableRef.value?.setScrollTop(ruleForm.canGetThroughVOs.length * 50)
}
const handleDelRow = (index) => {
  ruleForm.canGetThroughVOs.splice(index, 1)
}
</script>

<style scoped lang="scss">
@import '@/styles/custom.scss';

.call-settings-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px;
  .el-form {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 1px;
    :deep(.el-input__inner) {
      text-align: left;
    }
  }
}
</style>
