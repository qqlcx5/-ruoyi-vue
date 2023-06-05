<template>
  <ElDrawer
    v-model="drawer"
    @close="closeDrawer"
    direction="rtl"
    size="450px"
    :z-index="4000"
    class="setting-drawer-content"
  >
    <template #header>
      <span class="text-16px font-700 text-[var(--top-header-text-color)]">{{
        t('setting.projectSetting')
      }}</span>
    </template>

    <!--    <ElDivider />-->
    <!--     TODO:有空再抽 都一样的-->
    <el-scrollbar>
      <div class="layout-content-center pt-14px pb-80px">
        <div class="text-center">
          <!-- 主题 -->
          <!--      <ElDivider>{{ t('setting.theme') }}</ElDivider>-->
          <!--      <ThemeSwitch />-->

          <!-- 布局 -->
          <div class="general-content mb-20px">
            <div class="drawer-title"> {{ t('setting.layout') }}</div>
            <div class="layout-radio-picker-content px-20px pt-20px">
              <LayoutRadioPicker />
            </div>
          </div>

          <!-- 系统主题 -->
          <div class="general-content pt-20px">
            <div class="drawer-title"> {{ t('setting.systemTheme') }}</div>
            <div class="layout-radio-picker-content px-20px pt-35px">
              <ColorRadioPicker
                v-model="systemTheme"
                :schema="['#0081FF', '#31C27C', '#447EFD', '#EB4A3B', '#FF9B32', '#D56D9D']"
                @change="setSystemTheme"
              />
            </div>
          </div>
          <!-- 头部主题 -->
          <div class="general-content pt-40px">
            <div class="drawer-title"> {{ t('setting.headerTheme') }}</div>
            <div class="layout-radio-picker-content px-20px pt-35px">
              <ColorRadioPicker
                v-model="headerTheme"
                :schema="['#fff', '#31C27C', '#597EFD', '#EB4A3B', '#FF9B32', '#D56D9D']"
                @change="setHeaderTheme"
              />
            </div>
          </div>

          <!-- 菜单主题 -->
          <div class="pt-40px" v-if="layout !== 'top'">
            <div class="drawer-title"> {{ t('setting.menuTheme') }}</div>
            <div class="layout-radio-picker-content px-20px pt-35px">
              <ColorRadioPicker
                v-model="menuTheme"
                :schema="['#fff', '#31394A', '#111E41', '#232738', '#272C42', '#9F9F9F']"
                @change="setMenuTheme"
              />
            </div>
          </div>
        </div>

        <!-- 界面显示 -->
        <div class="general-content pt-40px">
          <div class="drawer-title"> {{ t('setting.interfaceDisplay') }}</div>
          <div class="layout-radio-picker-content pl-20px pt-25px">
            <InterfaceDisplay />
          </div>
        </div>
      </div>
    </el-scrollbar>

    <div class="button-content w-450px flex text-center leading-60px cursor-pointer z-10">
      <div class="button-copy w-146px" @click="copyConfig">{{ t('setting.copy') }}</div>
      <div class="button-reset flex-grow" @click="clear">{{ t('setting.clearAndReset') }}</div>
    </div>
  </ElDrawer>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useCssVar, useClipboard } from '@vueuse/core'

import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

import { trim, setCssVar } from '@/utils'
import { colorIsDark, lighten, hexToRGB } from '@/utils/color'
import { useAppStore } from '@/store/modules/app'
// import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import ColorRadioPicker from './components/ColorRadioPicker.vue'
import InterfaceDisplay from './components/InterfaceDisplay.vue'
import LayoutRadioPicker from './components/LayoutRadioPicker.vue'

const { t } = useI18n()
const appStore = useAppStore()

const layout = computed(() => appStore.getLayout)
const drawer = ref(false)

// 主题色相关
const systemTheme = ref(appStore.getTheme.elColorPrimary)

const setSystemTheme = (color: string) => {
  setCssVar('--el-color-primary', color)
  appStore.setTheme({ elColorPrimary: color })
  const leftMenuBgColor = useCssVar('--left-menu-bg-color', document.documentElement)
  setMenuTheme(trim(unref(leftMenuBgColor)))
}

// 头部主题相关
const headerTheme = ref(appStore.getTheme.topHeaderBgColor || '')

const setHeaderTheme = (color: string) => {
  const isDarkColor = colorIsDark(color)
  const textColor = isDarkColor ? '#fff' : 'inherit'
  const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
  const topToolBorderColor = isDarkColor ? color : '#eee'
  setCssVar('--top-header-bg-color', color)
  setCssVar('--top-header-text-color', textColor)
  setCssVar('--top-header-hover-color', textHoverColor)
  setCssVar('--top-tool-border-color', topToolBorderColor)
  appStore.setTheme({
    topHeaderBgColor: color,
    topHeaderTextColor: textColor,
    topHeaderHoverColor: textHoverColor,
    topToolBorderColor
  })
  if (unref(layout) === 'top') {
    setMenuTheme(color)
  }
}

// 菜单主题相关
const menuTheme = ref(appStore.getTheme.leftMenuBgColor || '')

const setMenuTheme = (color: string) => {
  const primaryColor = useCssVar('--el-color-primary', document.documentElement)
  const isDarkColor = colorIsDark(color)
  const theme: Recordable = {
    // 左侧菜单边框颜色
    leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
    // 左侧菜单背景颜色
    leftMenuBgColor: color,
    // 左侧菜单浅色背景颜色
    leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
    // 左侧菜单选中背景颜色
    leftMenuBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    // 左侧菜单收起选中背景颜色
    leftMenuCollapseBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    // 左侧菜单字体颜色
    leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
    // 左侧菜单选中字体颜色
    leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
    // logo字体颜色
    logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
    // logo边框颜色
    logoBorderColor: isDarkColor ? color : '#eee'
  }
  appStore.setTheme(theme)
  appStore.setCssVarTheme()
}
if (layout.value === 'top' && !appStore.getIsDark) {
  headerTheme.value = '#fff'
  setHeaderTheme('#fff')
}

// 监听layout变化，重置一些主题色
watch(
  () => layout.value,
  (n) => {
    if (n === 'top' && !appStore.getIsDark) {
      headerTheme.value = '#fff'
      setHeaderTheme('#fff')
    } else {
      setMenuTheme(unref(menuTheme))
    }
  }
)

// 拷贝
const copyConfig = async () => {
  const { copy, copied, isSupported } = useClipboard({
    source: `
      // 面包屑
      breadcrumb: ${appStore.getBreadcrumb},
      // 面包屑图标
      breadcrumbIcon: ${appStore.getBreadcrumbIcon},
      // 折叠图标
      hamburger: ${appStore.getHamburger},
      // 全屏图标
      screenfull: ${appStore.getScreenfull},
      // 尺寸图标
      size: ${appStore.getSize},
      // 多语言图标
      locale: ${appStore.getLocale},
      // 消息图标
      message: ${appStore.getMessage},
      // 标签页
      tagsView: ${appStore.getTagsView},
      // 标签页图标
      getTagsViewIcon: ${appStore.getTagsViewIcon},
      // logo
      logo: ${appStore.getLogo},
      // 菜单手风琴
      uniqueOpened: ${appStore.getUniqueOpened},
      // 固定header
      fixedHeader: ${appStore.getFixedHeader},
      // 页脚
      footer: ${appStore.getFooter},
      // 灰色模式
      greyMode: ${appStore.getGreyMode},
      // layout布局
      layout: '${appStore.getLayout}',
      // 暗黑模式
      isDark: ${appStore.getIsDark},
      // 组件尺寸
      currentSize: '${appStore.getCurrentSize}',
      // 主题相关
      theme: {
        // 主题色
        elColorPrimary: '${appStore.getTheme.elColorPrimary}',
        // 左侧菜单边框颜色
        leftMenuBorderColor: '${appStore.getTheme.leftMenuBorderColor}',
        // 左侧菜单背景颜色
        leftMenuBgColor: '${appStore.getTheme.leftMenuBgColor}',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '${appStore.getTheme.leftMenuBgLightColor}',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: '${appStore.getTheme.leftMenuBgActiveColor}',
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: '${appStore.getTheme.leftMenuCollapseBgActiveColor}',
        // 左侧菜单字体颜色
        leftMenuTextColor: '${appStore.getTheme.leftMenuTextColor}',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '${appStore.getTheme.leftMenuTextActiveColor}',
        // logo字体颜色
        logoTitleTextColor: '${appStore.getTheme.logoTitleTextColor}',
        // logo边框颜色
        logoBorderColor: '${appStore.getTheme.logoBorderColor}',
        // 头部背景颜色
        topHeaderBgColor: '${appStore.getTheme.topHeaderBgColor}',
        // 头部字体颜色
        topHeaderTextColor: '${appStore.getTheme.topHeaderTextColor}',
        // 头部悬停颜色
        topHeaderHoverColor: '${appStore.getTheme.topHeaderHoverColor}',
        // 头部边框颜色
        topToolBorderColor: '${appStore.getTheme.topToolBorderColor}'
      }
    `
  })
  if (!isSupported) {
    ElMessage.error(t('setting.copyFailed'))
  } else {
    await copy()
    if (unref(copied)) {
      ElMessage.success(t('setting.copySuccess'))
    }
  }
}

// 清空缓存
const clear = () => {
  const { wsCache } = useCache()
  wsCache.delete(CACHE_KEY.LAYOUT)
  wsCache.delete(CACHE_KEY.THEME)
  wsCache.delete(CACHE_KEY.IS_DARK)
  window.location.reload()
}

//关闭布局设置回调
const closeDrawer = () => {
  appStore.setIShowSetting(!appStore.isShowSetting)
}

watch(
  () => appStore.isShowSetting,
  (isShowSetting) => {
    drawer.value = isShowSetting
  }
)
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-setting;

.#{$prefix-cls} {
  border-radius: 6px 0 0 6px;
}
//拷贝 重置
.button-content {
  position: fixed;
  bottom: 0;
  background-color: var(--el-color-primary);

  .button-copy {
    color: #ffffff;
  }
  //重置
  .button-reset {
    color: var(--el-color-primary);
    background-color: #edf4fb;
  }
}
</style>

<style lang="scss">
.setting-drawer-content {
  .el-drawer__header {
    color: #333333;
    margin-bottom: 0;
    padding: 25px 20px;
    border-bottom: 1px solid #eaebef;
  }

  .el-drawer__body {
    padding: 0;
  }

  //详情底下content
  .layout-content-center {
    margin: 0 20px;
    //background: skyblue;
  }

  //布局--title
  .drawer-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  //横线
  .el-divider--horizontal {
    margin: 10px 0 0 0;
  }
  //布局/系统主题/头部主题/菜单主题content
  .layout-radio-picker-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 410px;
  }

  //=======圆圈内打钩start=======
  .checkmark {
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background: rgb(0, 129, 255);
    display: inline-block;
    position: relative;
    z-index: 999;
  }

  .checkmark:before,
  .checkmark::after {
    content: '';
    height: 14px;
    width: 3px;
    border-radius: 5px;
    display: block;
    background: white;
    position: absolute;
    top: 3px;
    /*40-6=34*/
    left: 10px;
    /*make the two rects in the middle of the cycle */
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
  }

  .checkmark::before {
    height: 7px;
    transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    position: absolute;
    top: 9px;
    /*40-18=12  */
    left: 4px;
  }
  //=======圆圈内打钩end=======
  //圆圈内打钩位置
  .checkmark-content {
    position: relative;
  }
  .checkmark-one {
    position: absolute;
    bottom: 3px;
    right: 3px;
  }
}
</style>
