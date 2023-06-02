<template>
  <div v-show="getShow" class="flex flex-col justify-center items-center text-tip text-18px">
    <Qrcode :logo="logoImg" :width="250" />
    <div>使用手机扫码登录</div>
  </div>
</template>
<script setup lang="ts">
import logoImg from '@/assets/imgs/logo.png'

import { useLoginState, LoginStateEnum } from './useLogin'

const { getLoginState } = useLoginState()
const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE)
</script>
