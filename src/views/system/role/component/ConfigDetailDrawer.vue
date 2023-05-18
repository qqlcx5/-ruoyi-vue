<template>
  <el-drawer
    v-model="drawerVisible"
    class="columns-drawer"
    direction="rtl"
    :lockScroll="false"
    size="764px"
    @close="tabsActive = 'permission'"
  >
    <template #header>
      <h4 class="text-18px font-black m-0">详情</h4>
    </template>
    <template #default>
      <el-descriptions :column="2">
        <el-descriptions-item label="角色名称：">{{ roleInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="角色编码：">{{ roleInfo.code }}</el-descriptions-item>
        <el-descriptions-item label="状态：">{{
          getDictLabel(DICT_TYPE.COMMON_STATUS, roleInfo.status)
        }}</el-descriptions-item>
      </el-descriptions>
      <el-tabs v-model="tabsActive" @tab-change="onTabChange">
        <el-tab-pane label="配置权限" name="permission">
          <ConfigDetail
            origin="detail"
            :frontTableData="roleInfo.permissions"
            :backstageTableData="[]"
          />
        </el-tab-pane>
        <el-tab-pane label="配置人员" name="staff">
          <el-form class="wg-query-form w-full" ref="elFormRef" label-position="left">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label-width="70px" label="岗位">
                  <el-input v-model="searchForm.postName" placeholder="请输入岗位名称" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="70px" label="员工">
                  <el-input v-model="searchForm.nickname" placeholder="请输入员工姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="8" class="!flex flex-column justify-between">
                <div>
                  <el-button type="primary" @click="getPersons">查询</el-button>
                  <el-button @click="searchReset">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <div class="card-gary-bg mt-16px p-16px">
            <div v-if="staff && staff.length > 0">
              <div class="flex flex-row-reverse text-title">共{{ personnelCount }}人</div>
              <div v-for="(item, index) in staff" :key="index">
                <div class="text-title">
                  <span v-html="hightLightText(item.postName)"></span>
                  <span class="text-tip"> ({{ item.personsInfos.length }})</span>
                </div>
                <div class="flex items-center">
                  <div
                    v-for="user in item.personsInfos"
                    :key="user.userId"
                    class="text-12px leading-normal py-4px px-8px mt-10px mr-10px border-1px rounded-4px bg-[var(--el-color-white)] dark:(bg-[var(--el-bg-color)]"
                    :class="{ 'height-light': user.nickname === searchForm.nickname }"
                  >
                    {{ `${user.nickname}` }}
                    <span v-if="user.status === 1">(停用)</span>
                    <span v-if="user.userStatus === 1">(离职)</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-tip">暂无配置人员</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import ConfigDetail from './ConfigDetail.vue'
import { getPersonsByRole } from '@/api/system/role'

// 弹窗相关的变量
const roleInfo = ref()
const drawerVisible = ref(false) // 是否显示弹出层
const personnelCount = computed(() => {
  let count = 0
  staff.value.forEach((item) => {
    const len: any[] = item['personsInfos'] || []
    count += len.length
  })
  return count
})
const onTabChange = async (tab) => {
  if (tab === 'staff') {
    await getPersons()
  }
}

// ========== 配置权限 ==========
const tabsActive = ref('permission')

// ========== 配置人员 ==========
const staff = ref([])
const searchForm = ref({ postName: '', nickname: '' })
const getPersons = async () => {
  let params = {
    roleId: roleInfo.value.id,
    ...searchForm.value
  }
  staff.value = await getPersonsByRole(params)
}
const searchReset = () => {
  searchForm.value = { postName: '', nickname: '' }
  getPersons()
}
const hightLightText = (text) => {
  console.log(text)
  if (text) {
    const reg = new RegExp(searchForm.value.postName, 'gi') // 动态正则表达式
    return text.replace(reg, `<span class="text-error">${searchForm.value.postName}</span>`) // 使用replace替换
  }
}

// 打开弹窗
const openDrawer = async (row) => {
  roleInfo.value = row
  drawerVisible.value = true
  console.log(roleInfo.value.permissions)
}
defineExpose({ openDrawer }) // 提供 openModal 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.height-light {
  color: $error-color;
  border-color: $error-color;
}
</style>
