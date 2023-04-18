<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
// import { useIcon } from '@/hooks/web/useIcon'
import { useDesign } from '@/hooks/web/useDesign'
import { propTypes } from '@/utils/propTypes'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('theme-switch')

// const Sun = useIcon({ icon: 'emojione-monotone:sun', color: '#fde047' })

// const CrescentMoon = useIcon({ icon: 'emojione-monotone:crescent-moon', color: '#fde047' })

const appStore = useAppStore()

// 初始化获取是否是暗黑主题
const isDark = computed(() => appStore.getIsDark)

// // 设置switch的背景颜色
// const blackColor = 'var(--el-color-black)'

const themeChange = (val) => {
  appStore.setIsDark(!val)
}

defineProps({
  color: propTypes.string.def('')
})
</script>

<template>
  <div class="icon-content" @click="themeChange(isDark)">
    <Icon :size="18" icon="ep:sunny" :class="prefixCls" class="cursor-pointer" :color="color" />
    <!--  <ElSwitch-->
    <!--    :class="prefixCls"-->
    <!--    v-model="isDark"-->
    <!--    inline-prompt-->
    <!--    :border-color="blackColor"-->
    <!--    :inactive-color="blackColor"-->
    <!--    :active-color="blackColor"-->
    <!--    :active-icon="Sun"-->
    <!--    :inactive-icon="CrescentMoon"-->
    <!--    @change="themeChange"-->
    <!--  />-->
  </div>
</template>

<style lang="scss" scoped>
.icon-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
