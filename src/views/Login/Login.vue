<template>
  <div
    :class="prefixCls"
    class="h-[100%] relative flex justify-center items-center <xl:bg-v-dark <sm:px-10px <xl:px-10px <md:px-10px"
  >
    <div class="flex w-1062px h-668px">
      <div :class="`login-left-block ${prefixCls}__left flex-1 pl-50px relative <xl:hidden`">
        <div class="mt-70px mb-20px text-40px">Hello</div>
        <div class="text-30px leading-tight">欢迎登录{{ underlineToHump(appStore.getTitle) }}</div>
      </div>
      <div
        class="login-right-block h-full flex m-auto w-[100%] @2xl:max-w-460px @xl:max-w-460px @md:max-w-460px @lg:max-w-460px"
      >
        <!-- 账号登录 -->
        <NewLoginForm />
      </div>
    </div>
    <LoginFooter class="absolute bottom-24px" />
  </div>
</template>
<script setup lang="ts">
import { underlineToHump } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { NewLoginForm } from './components'
import LoginFooter from './components/LoginFooter.vue'

const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  background: url('@/assets/imgs/login-bg.png') no-repeat center;
  background-size: cover;

  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }

  .login-left-block {
    color: #fff;
    background: url('@/assets/imgs/login-block.png') no-repeat center;
    background-size: contain;
  }

  .login-right-block {
    background-color: #fff;
    box-shadow: 6px 5px 16px 0 rgb(212 212 212 / 50%);
  }
}
</style>
