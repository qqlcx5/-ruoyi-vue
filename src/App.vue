<script setup lang="ts">
import { isDark } from '@/utils/is'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('app')
const appStore = useAppStore()
const currentSize = computed(() => appStore.getCurrentSize)
const greyMode = computed(() => appStore.getGreyMode)
const { wsCache } = useCache()
//antdV黑暗模式
import { DarkMode } from '@/styles/antdVTheme/changAntdModal'

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  let isDarkTheme = wsCache.get(CACHE_KEY.IS_DARK)
  if (isDarkTheme === null) {
    isDarkTheme = isDark()
  }
  appStore.setIsDark(isDarkTheme)
}
setDefaultTheme()

watchEffect(() => {
  //antdV黑暗模式
  DarkMode(appStore.isDark)
})

import zhCN from 'ant-design-vue/es/locale/zh_CN'
import 'dayjs/locale/zh-cn'
</script>
<template>
  <!--  element plus 全局配置-->
  <ConfigGlobal :size="currentSize">
    <!--  antdV 全局配置  -->
    <a-config-provider :componentSize="currentSize" :locale="zhCN">
      <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
    </a-config-provider>
  </ConfigGlobal>
</template>
<style lang="scss">
@import "@/styles/el-plus-var.scss";

$prefix-cls: #{$namespace}-app;
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  @extend .size;
  //打开modal后body出现100%-17px(滚动条) 产生原因未知 没空找 直接这里改
  width: 100%!important;

  #app {
    @extend .size;
  }
}
.#{$prefix-cls}-grey-mode {
  filter: grayscale(100%);
}

/*antdV message图标居中校正 肯定是被哪里影响到了 - - */
.ant-message-custom-content {
  display: flex;
  align-items: center;
}
</style>
