<template>
  <div v-show="getShow" class="flex flex-col justify-center items-center text-20px">
    <div class="text-title mb-12px">请打开万车利助手扫码登录</div>
    <Qrcode
      :width="250"
      :text="qrCodeId"
      :disabled="qrCodeState === null"
      :disabledText="'二维码已过期'"
      @disabledClick="getQrcodeId"
    />
  </div>
</template>
<script setup lang="ts">
import { useLoginState, LoginStateEnum } from './useLogin'
import { getQrCodeApi, getQrCodeStateApi } from '@/api/login'

// const timer = ref()
const message = useMessage()
const { getLoginState } = useLoginState()
const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE)

const qrCodeId = ref<string | null>()
const qrCodeState = ref()
const getQrcodeId = async () => {
  qrCodeId.value = await getQrCodeApi()
  if (qrCodeId.value) {
    await getQrcodeState()
    // timer.value = setInterval(async () => {
    // await getQrcodeState()
    // }, 1000)
  }
}

const getQrcodeState = async () => {
  const qrCodeData = await getQrCodeStateApi({ qrCode: qrCodeId.value })
  if (qrCodeData) {
    qrCodeState.value = qrCodeData.state
    if (qrCodeData.state === 'un_scan_code') {
    } else if (qrCodeData.state === 'confirmed') {
      emit('qrCodeLogin', qrCodeData)
    } else if (qrCodeData.state === 'null') {
    } else {
      message.error('未知的二维码状态')
    }
  } else {
    message.error('获取二维码状态失败')
  }
}

const emit = defineEmits(['qrCodeLogin'])
onMounted(() => {
  getQrcodeId()
})
</script>
