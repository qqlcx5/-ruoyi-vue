<template>
  <div>
    <el-row class="role-config" :gutter="12">
      <el-col :span="16">
        <el-card class="role-container" :gutter="12" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="font-medium text-18px">配置权限</span>
            </div>
          </template>
          <el-tabs class="-mt-16px" v-model="activeName">
            <el-tab-pane label="前台" name="front">
              <ConfigContent ref="frontConfigRef" stage="front" @change="onConfigChange" />
            </el-tab-pane>
            <el-tab-pane label="后台" name="backstage">
              <ConfigContent ref="backstageConfigRef" stage="backstage" @change="onConfigChange" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="role-container" :gutter="12" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="font-medium text-18px">已选权限</span>
            </div>
          </template>
          <ConfigDetail
            ref="configDetailRef"
            :frontTableData="frontTableData"
            :backstageTableData="backstageTableData"
          />
        </el-card>
      </el-col>
    </el-row>
    <div
      class="footer absolute left-0 bottom-0 w-full flex items-center justify-center py-20px bg-[var(--el-bg-color)] z-10"
    >
      <el-button type="primary" @click="handleOk" :loading="loading">{{
        t('common.ok')
      }}</el-button>
      <el-button @click="handleCancel">{{ t('common.cancel') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as RoleApi from '@/api/system/role'
import ConfigDetail from './component/ConfigDetail.vue'
import ConfigContent from './component/ConfigContent.vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

const { t } = useI18n() // 国际化
const router = useRouter()
const { query } = useRoute()
const message = useMessage()
const tagsViewStore = useTagsViewStore()

const activeName = ref('backstage')
const frontTableData = ref<any[]>([]) // 前台已选权限
const backstageTableData = ref<any[]>([]) // 后台已选权限
const loading = ref<boolean>(false)

const onConfigChange = (config) => {
  if (config.stage === 'front') {
    frontTableData.value = config.data || []
  } else if (config.stage === 'backstage') {
    backstageTableData.value = config.data || []
  }
}
// ============ footer操作 ===========
const frontConfigRef = ref()
const backstageConfigRef = ref()
const handleOk = async () => {
  loading.value = true
  const params = {
    menuDataScopeItemList:
      activeName.value === 'front'
        ? frontConfigRef.value.getParams()
        : backstageConfigRef.value.getParams(),
    roleId: query.id
  }
  const result = await RoleApi.assignRoleMenuDataScope(params).finally(
    () => (loading.value = false)
  )
  if (result) {
    message.success('保存成功')
    handleCancel()
  } else {
    message.error('保存失败')
  }
}
const handleCancel = () => {
  tagsViewStore.delView(unref(router.currentRoute))
  router.replace('/system/role')
}
</script>
<style lang="scss" scoped>
.role-config {
  .el-card {
    border: none;
  }
  .role-container {
    :deep(.el-card__body) {
      min-height: 74vh;
    }
  }
}
.footer {
  box-shadow: 0px -5px 8px 0px rgba(210, 210, 210, 0.2);
}
</style>
