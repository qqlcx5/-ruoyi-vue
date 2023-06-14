<template>
  <div v-show="getShow" class="flex flex-col justify-center items-center text-20px">
    <div class="text-title mb-12px">请打开万车利助手扫码登录</div>
    <Qrcode :logo="logoImg" :width="250" />
  </div>
</template>
<script setup lang="ts">
import logoImg from '@/assets/imgs/logo.png'

import { useLoginState, LoginStateEnum } from './useLogin'

const { getLoginState } = useLoginState()
const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE)
</script>
