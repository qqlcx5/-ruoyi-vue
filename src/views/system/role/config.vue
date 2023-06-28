<template>
  <div v-loading="">
    <el-row class="role-config" :gutter="12">
      <el-col :span="16">
        <el-card class="role-container" :gutter="12" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="font-medium text-18px">
                {{ roleInfo.name }}-{{ roleInfo.code }}
                <span class="ml-12px">配置权限</span>
              </span>
            </div>
          </template>
          <el-tabs v-model="roleConfig.activeName">
            <el-tab-pane label="成员端" name="front">
              <ConfigContent ref="frontConfigRef" stage="front" @change="onConfigChange" />
            </el-tab-pane>
            <el-tab-pane label="管理端" name="backstage">
              <ConfigContent ref="backstageConfigRef" stage="backstage" @change="onConfigChange" />
            </el-tab-pane>
            <!--            <el-tab-pane label="客户端" name="client">-->
            <!--              <ConfigContent ref="clientConfigRef" stage="client" @change="onConfigChange" />-->
            <!--            </el-tab-pane>-->
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
          <!--          <ConfigDetail-->
          <!--            ref="configDetailRef"-->
          <!--            :frontTableData="frontTableData"-->
          <!--            :backstageTableData="backstageTableData"-->
          <!--          />-->
          <ConfigDetailItem title="成员端" :tableData="frontTableData" />
          <ConfigDetailItem title="管理端" :tableData="backstageTableData" />
        </el-card>
      </el-col>
    </el-row>
    <div
      class="footer absolute left-0 bottom-0 w-full flex items-center justify-center py-20px bg-[var(--el-bg-color)] z-10"
    >
      <el-button type="primary" @click="handleOk" :loading="roleConfig.btnLoading">{{
        t('common.ok')
      }}</el-button>
      <el-button @click="handleCancel">{{ t('common.back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as RoleApi from '@/api/system/role'
// import ConfigDetail from './component/ConfigDetail.vue'
import ConfigContent from './component/ConfigContent.vue'
import ConfigDetailItem from './component/ConfigDetailItem.vue'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { getAuthMenuList } from '@/api/system/tenantMenu'
import { getRoleMenuDataScope } from '@/api/system/role'

const { t } = useI18n() // 国际化
const router = useRouter()
const { query } = useRoute()
const message = useMessage()
const tagsViewStore = useTagsViewStore()

const roleInfo = ref({})
const frontTableData = ref<any[]>([]) // 前台已选权限
const backstageTableData = ref<any[]>([]) // 后台已选权限
const frontConfigRef = ref()
const backstageConfigRef = ref()
const roleConfig = reactive<any>({
  loading: false,
  btnLoading: false,
  activeName: 'front',
  menuList: [],
  menuDataScope: {}
})

const onConfigChange = (config) => {
  if (config.stage === 'front') {
    frontTableData.value = config.data || []
  } else if (config.stage === 'backstage') {
    backstageTableData.value = config.data || []
  }
}

// ============ footer操作 ===========
const handleOk = async () => {
  roleConfig.btnLoading = true
  try {
    const params = {
      menuDataScopeItemList: [
        ...frontConfigRef.value.getParams(),
        ...backstageConfigRef.value.getParams()
      ],
      roleId: query.id
    }
    const result = await RoleApi.assignRoleMenuDataScope(params).finally(
      () => (roleConfig.btnLoading = false)
    )
    if (result) {
      message.success('保存成功')
      handleCancel()
    } else {
      message.error('保存失败')
    }
  } catch (err: any) {
    roleConfig.btnLoading = false
    console.error(err?.message)
  }
}
const handleCancel = () => {
  tagsViewStore.delView(unref(router.currentRoute))
  router.replace('/system/role')
}

const getRoleInfo = async () => {
  if (!query.id) return
  await RoleApi.getRoleApi(query.id as string).then((res) => {
    roleInfo.value = res
  })
}

const init = async () => {
  const { menuDataScopeItemMap } = roleConfig.menuDataScope
  frontConfigRef.value.init(roleConfig.menuList.memberSide, menuDataScopeItemMap.memberSide || [])
  backstageConfigRef.value.init(
    roleConfig.menuList.managementEnd,
    menuDataScopeItemMap.managementEnd || []
  )
}

onMounted(() => {
  getRoleInfo()
  roleConfig.loading = true
  Promise.all([getAuthMenuList(), getRoleMenuDataScope({ roleId: query.id })])
    .then((res) => {
      roleConfig.menuList = res[0]
      roleConfig.menuDataScope = res[1]
      init()
    })
    .finally(() => {
      roleConfig.loading = false
    })
})
</script>
<style lang="scss" scoped>
.role-config {
  height: 100%;

  .el-card {
    border: none;
  }

  .role-container {
    :deep(.el-card__body) {
      position: relative;
      min-height: 74vh;

      .el-tabs__content {
        height: calc(100% - 50px);
      }

      .el-tab-pane {
        height: 100%;
      }
    }

    :deep(.el-tabs) {
      position: absolute;
      inset: 20px;
    }
  }
}

.footer {
  box-shadow: 0 -5px 8px 0 rgb(210 210 210 / 20%);
}
</style>
