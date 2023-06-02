<template>
  <el-dialog class="wg-dialog" v-model="dialogVisible" width="530px" draggable append-to-body>
    <template #header>
      <div>选择登录主体</div>
    </template>
    <el-scrollbar>
      <div class="grid grid-cols-2 gap-16px max-h-560px">
        <div
          v-for="item in tenantList"
          :key="item.tenantId"
          class="item-box relative h-82px flex flex-col justify-between cursor-pointer"
          :class="{ active: item.tenantId === activeTenantId }"
          @click="handleItemClick(item)"
        >
          <div class="flex items-center justify-between">
            <div class="item-name">{{ item.tenantName }}-{{ TenantMap[item.tenantType] }}</div>
            <div v-if="item.isDefaultLogin" class="default-item">默认</div>
          </div>
          <div class="flex items-center justify-between">
            <div v-if="item.isLastLogin">
              <div class="new-login">最近登录</div>
            </div>
            <div
              v-if="!item.isDefaultLogin"
              class="set-default-item"
              @click="setDefaultLoginTenant(item)"
              >设默认</div
            >
          </div>
        </div>
      </div>
    </el-scrollbar>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onConfirm"> 确定选择 </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { updateDefaultTenant, updateDefaultTenantByUserName } from '@/api/login/index'
import { getAccessToken } from '@/utils/auth'
import * as authUtil from '@/utils/auth'

// 字典未登录无法获取，先写死
const TenantMap = {
  dealer: '经销商',
  manufacturer: '厂家'
}
const message = useMessage()

interface TenantInfo {
  tenantId: string | number
  tenantName: string
  tenantType: string
  isDefaultLogin?: boolean
  isLastLogin?: boolean
}

const loginForm = ref()
const emit = defineEmits(['confirm'])
const dialogVisible = ref(false)
const tenantList = ref<TenantInfo[]>([])
const activeTenantId = ref()

const handleItemClick = (item) => {
  activeTenantId.value = item.tenantId
}

// 设置默认主体
const setDefaultLoginTenant = async (item) => {
  let res = null
  if (getAccessToken()) {
    res = await updateDefaultTenant({ tenantId: item.tenantId })
  } else {
    const params = {
      tenantId: item.tenantId,
      username: loginForm.value.username,
      password: loginForm.value.password
    }
    res = await updateDefaultTenantByUserName(params)
  }
  if (!res) return message.error('设置默认主体失败')
  tenantList.value.forEach((item) => (item.isDefaultLogin = false))
  item.isDefaultLogin = true
}

// 打开弹窗
const openDialog = async (data?: TenantInfo[], defaultTenantId?, loginData?) => {
  // 可选主体列表
  if (data) {
    tenantList.value = data
    activeTenantId.value = defaultTenantId || data[0].tenantId
  }
  // 默认主体id
  if (defaultTenantId) activeTenantId.value = defaultTenantId
  // 登录信息
  if (loginData) loginForm.value = loginData
  dialogVisible.value = true
}

const onConfirm = () => {
  const activeTenant = tenantList.value.find((item) => item.tenantId == activeTenantId.value)
  if (activeTenant) authUtil.setTenantData(activeTenant)
  emit('confirm', activeTenantId.value)
  dialogVisible.value = false
}

defineExpose({ openDialog }) // 提供 openModal 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.item-box {
  font-size: 14px;
  padding: 14px 12px 14px 16px;
  line-height: 1;
  border: 1px solid $border-color;
  border-radius: 6px;
  &.active {
    border: 1px solid var(--el-color-primary);
    &::after {
      content: '';
      font-family: iconfont;
      position: absolute;
      right: 0;
      bottom: 0;
      width: 24px;
      height: 24px;
    }
    .item-name {
      color: var(--el-color-primary);
    }
  }
  .item-name {
    color: $title-color;
  }
  .default-item,
  .new-login {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
  }
  .default-item {
    color: $error-color;
    background-color: #ffe8e8;
  }
  .new-login {
    color: $text-color;
    background-color: #f6f6f6;
  }
  .set-default-item {
    color: var(--el-color-primary);
  }
}
</style>
