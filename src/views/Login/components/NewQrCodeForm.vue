<template>
  <div class="flex flex-col justify-center items-center text-20px">
    <div class="text-title mb-12px">请打开万车利助手扫码登录</div>
    <Qrcode
      :width="250"
      :text="qrCodeId"
      :disabled="!qrCodeState"
      :disabledText="'二维码已过期'"
      @disabledClick="getQrcodeId"
    />
  </div>
</template>
<script setup lang="ts">
import { getQrCodeApi, getQrCodeStateApi } from '@/api/login'
import * as authUtil from '@/utils/auth'

const timer = ref()
const message = useMessage()

const qrCodeId = ref<string | null>()
const qrCodeState = ref()

const getQrcodeId = async () => {
  qrCodeId.value = await getQrCodeApi()

  if (qrCodeId.value) {
    await getQrcodeState()
    timer.value = setInterval(async () => {
      await getQrcodeState()
    }, 1000)
  } else {
    qrCodeState.value = null
    message.error('二维码已过期')
  }
}

const getQrcodeState = async () => {
  const qrCodeData = await getQrCodeStateApi({ qrCode: qrCodeId.value })
  qrCodeState.value = qrCodeData
  if (qrCodeData) {
    if (qrCodeData.state === 'un_scan_code') {
    } else if (qrCodeData.state === 'confirmed') {
      clearInterval(timer.value)
      authUtil.setTenantId(qrCodeData.tenantId)
      emit('success', qrCodeData)
    } else {
      message.error('未知的二维码状态')
    }
  } else {
    clearInterval(timer.value)
    message.error('二维码已过期')
  }
}

const initQrCode = () => {
  if (!qrCodeId.value) getQrcodeId()
}

const emit = defineEmits(['success'])
defineExpose({ initQrCode })

onUnmounted(() => {
  clearInterval(timer.value)
})
// onMounted(() => {
//   getQrcodeId()
// })
</script>
