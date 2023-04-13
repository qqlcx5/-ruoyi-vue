<template>
  <div :class="prefixCls">
    <div class="checkbox-content">
      <div class="checkbox-style" v-for="(item, index) in state.arr" :key="`layout+${index}`">
        <el-checkbox
          v-if="!item?.isWater"
          v-model="item.checkboxValue"
          size="large"
          :label="item.label"
          @change="item.changeFN"
        />
        <div v-else class="water-content">
          <el-checkbox
            v-model="checkValue"
            size="large"
            :label="item.label"
            @change="waterCheckboxChang"
          />
          <ElInput
            :placeholder="t('common.inputText')"
            v-model="water"
            input-style="height: 30px; margin: 0 10px;"
            class="w-20 right-1"
            @input="setWater()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { setCssVar } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useWatermark } from '@/hooks/web/useWatermark'
import { useAppStore } from '@/store/modules/app'

const { t } = useI18n()
const { getPrefixCls } = useDesign()
const { setWatermark } = useWatermark()
const prefixCls = getPrefixCls('interface-display')
const appStore = useAppStore()

const water = ref()
//水印复选框
const checkValue = ref(null)

// 面包屑
const breadcrumb = ref(appStore.getBreadcrumb)

const breadcrumbChange = (show: boolean) => {
  appStore.setBreadcrumb(show)
}

// 面包屑图标
const breadcrumbIcon = ref(appStore.getBreadcrumbIcon)

const breadcrumbIconChange = (show: boolean) => {
  appStore.setBreadcrumbIcon(show)
}

// 折叠图标
const hamburger = ref(appStore.getHamburger)

const hamburgerChange = (show: boolean) => {
  appStore.setHamburger(show)
}

// 全屏图标
const screenfull = ref(appStore.getScreenfull)

const screenfullChange = (show: boolean) => {
  appStore.setScreenfull(show)
}

// 尺寸图标
const size = ref(appStore.getSize)

const sizeChange = (show: boolean) => {
  appStore.setSize(show)
}

// 多语言图标
const locale = ref(appStore.getLocale)

const localeChange = (show: boolean) => {
  appStore.setLocale(show)
}

// 消息图标
const message = ref(appStore.getMessage)

const messageChange = (show: boolean) => {
  appStore.setMessage(show)
}

// 标签页
const tagsView = ref(appStore.getTagsView)

const tagsViewChange = (show: boolean) => {
  // 切换标签栏显示时，同步切换标签栏的高度
  setCssVar('--tags-view-height', show ? '35px' : '0px')
  appStore.setTagsView(show)
}

// 标签页图标
const tagsViewIcon = ref(appStore.getTagsViewIcon)

const tagsViewIconChange = (show: boolean) => {
  appStore.setTagsViewIcon(show)
}

// logo
const logo = ref(appStore.getLogo)

const logoChange = (show: boolean) => {
  appStore.setLogo(show)
}

// 菜单手风琴
const uniqueOpened = ref(appStore.getUniqueOpened)

const uniqueOpenedChange = (uniqueOpened: boolean) => {
  appStore.setUniqueOpened(uniqueOpened)
}

// 固定头部
const fixedHeader = ref(appStore.getFixedHeader)

const fixedHeaderChange = (show: boolean) => {
  appStore.setFixedHeader(show)
}

// 页脚
const footer = ref(appStore.getFooter)

const footerChange = (show: boolean) => {
  appStore.setFooter(show)
}

// 灰色模式
const greyMode = ref(appStore.getGreyMode)

const greyModeChange = (show: boolean) => {
  appStore.setGreyMode(show)
}

// 固定菜单
const fixedMenu = ref(appStore.getFixedMenu)

const fixedMenuChange = (show: boolean) => {
  appStore.setFixedMenu(show)
}

//水印复选框改变
const waterCheckboxChang = () => {
  setWater()
}

// 设置水印
const setWater = () => {
  //选中 有值 水印
  //未选中 无水印
  if (checkValue.value && water.value !== undefined) {
    setWatermark(water.value)
  } else {
    setWatermark('')
  }
}

const layout = computed(() => appStore.getLayout)

const state = reactive({
  arr: [
    //面包屑
    {
      checkboxValue: breadcrumb,
      label: t('setting.breadcrumb'),
      changeFN: breadcrumbChange
    },
    //消息图标
    {
      checkboxValue: message,
      label: t('setting.messageIcon'),
      changeFN: messageChange
    },
    //面包屑图标
    {
      checkboxValue: breadcrumbIcon,
      label: t('setting.breadcrumbIcon'),
      changeFN: breadcrumbIconChange
    },
    //标签页
    {
      checkboxValue: tagsView,
      label: t('setting.tagsView'),
      changeFN: tagsViewChange
    },
    //折叠图标
    {
      checkboxValue: hamburger,
      label: t('setting.hamburgerIcon'),
      changeFN: hamburgerChange
    },
    //标签页图标
    {
      checkboxValue: tagsViewIcon,
      label: t('setting.tagsViewIcon'),
      changeFN: tagsViewIconChange
    },
    //全屏图标
    {
      checkboxValue: screenfull,
      label: t('setting.screenfullIcon'),
      changeFN: screenfullChange
    },
    //标志
    {
      checkboxValue: logo,
      label: t('setting.logo'),
      changeFN: logoChange
    },
    //尺寸图标
    {
      checkboxValue: size,
      label: t('setting.sizeIcon'),
      changeFN: sizeChange
    },
    //菜单手风琴
    {
      checkboxValue: uniqueOpened,
      label: t('setting.uniqueOpened'),
      changeFN: uniqueOpenedChange
    },
    //多语言图标
    {
      checkboxValue: locale,
      label: t('setting.localeIcon'),
      changeFN: localeChange
    },
    //固定头部
    {
      checkboxValue: fixedHeader,
      label: t('setting.fixedHeader'),
      changeFN: fixedHeaderChange
    },
    //页脚
    {
      checkboxValue: footer,
      label: t('setting.footer'),
      changeFN: footerChange
    },
    //固定菜单
    {
      checkboxValue: fixedMenu,
      label: t('setting.fixedMenu'),
      changeFN: fixedMenuChange
    },
    //灰色模式
    {
      checkboxValue: greyMode,
      label: t('setting.greyMode'),
      changeFN: greyModeChange
    },
    //水印
    {
      isWater: true,
      checkboxValue: checkValue,
      inputValue: water,
      label: t('watermark.watermark'),
      changeFN: setWater
    }
  ]
})

watch(
  () => layout.value,
  (n) => {
    if (n === 'top') {
      appStore.setCollapse(false)
    }
  }
)
</script>

<style lang="scss" scoped>
.checkbox-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.checkbox-style {
  width: 50%;
}
//水印
.water-content {
  display: flex;
  align-items: center;
}
</style>
