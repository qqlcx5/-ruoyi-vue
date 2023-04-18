<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
// import { useIcon } from '@/hooks/web/useIcon'
import { useDesign } from '@/hooks/web/useDesign'
import { propTypes } from '@/utils/propTypes'

const { getPrefixCls } = useDesign()

defineProps({
  color: propTypes.string.def('')
})

// const prefixCls = getPrefixCls('theme-switch')

// const Sun = useIcon({ icon: 'emojione-monotone:sun', color: '#fde047' })

// const CrescentMoon = useIcon({ icon: 'emojione-monotone:crescent-moon', color: '#fde047' })

const appStore = useAppStore()

// 初始化获取是否是暗黑主题
const isDark = computed(() => appStore.getIsDark)

// // 设置switch的背景颜色
// const blackColor = 'var(--el-color-black)'

//黑暗模式下icon颜色
const changeIconColor = (val) => {
  const root = document.documentElement
  // const style = getComputedStyle(root)
  // const iconColor = style.getPropertyValue('--top-header-text-color')
  //直接特殊判断改掉吧 - - 他原来这个有点乱 不好改 - -
  if (val) {
    //黑暗模式
    setTimeout(() => {
      root.style.setProperty('--top-header-text-color', '#FFF')
    }, 0)
  } else {
    //非黑暗模式
    root.style.setProperty('--top-header-text-color', 'inherit')
  }
}

const themeChange = (val) => {
  changeIconColor(!val)
  appStore.setIsDark(!val)
}

onMounted(() => {
  changeIconColor(isDark.value)
})
</script>

<template>
  <div class="icon-content" @click="themeChange(isDark)">
    <Icon :size="18" icon="ep:sunny" class="cursor-pointer" :color="color" />
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
