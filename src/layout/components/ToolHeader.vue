<script lang="tsx">
import { defineComponent, computed } from 'vue'
import { Message } from '@/layout/components//Message'
import { Collapse } from '@/layout/components/Collapse'
import { UserInfo } from '@/layout/components/UserInfo'
import { Screenfull } from '@/layout/components/Screenfull'
import { Breadcrumb } from '@/layout/components/Breadcrumb'
import { SizeDropdown } from '@/layout/components/SizeDropdown'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import { Icon } from '@/components/Icon'

const state = reactive({
  userInfo: {
    company: '厦门分公司'
  }
})

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tool-header')

const appStore = useAppStore()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)

// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)

// 尺寸图标
const size = computed(() => appStore.getSize)

// 布局
const layout = computed(() => appStore.getLayout)

// 多语言图标
const locale = computed(() => appStore.getLocale)

// 消息图标
const message = computed(() => appStore.getMessage)

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
        {layout.value !== 'top' ? (
          <div class="h-full flex items-center">
            {hamburger.value ? (
              <Collapse
                class="collapse"
                color="var(--top-header-text-color)"
              ></Collapse>
            ) : undefined}
            {breadcrumb.value ? <Breadcrumb class="<md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined}
        <div class="h-full flex items-center">
          <div class="company-content flex items-center px-22px">
            <div class="company-text">
              <span class="company">{state.userInfo.company}</span>
            </div>
            <Icon
              icon="svg-icon:switch"
              size={14}
              class="cursor-pointer"
              color="var(--top-header-text-color)"
            />
          </div>
          <div class="vertical-line"></div>
          {screenfull.value ? (
            <Screenfull class="hover-trigger" color="var(--top-header-text-color)"></Screenfull>
          ) : undefined}
          {size.value ? (
            <SizeDropdown class="hover-trigger" color="var(--top-header-text-color)"></SizeDropdown>
          ) : undefined}
          {locale.value ? (
            <LocaleDropdown
              class="hover-trigger"
              color="var(--top-header-text-color)"
            ></LocaleDropdown>
          ) : undefined}
          <div class="hover-trigger">
            <ThemeSwitch color="var(--top-header-text-color)" />
          </div>
          {message.value ? (
            <Message class="hover-trigger" color="var(--top-header-text-color)"></Message>
          ) : undefined}
          <div class="vertical-line"></div>
          <UserInfo></UserInfo>
        </div>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tool-header;

.#{$prefix-cls} {
  transition: left var(--transition-time-02);
}

.company-content {
  color: $header-icon-color;
  cursor: pointer;
  font-size: $font-size;
  font-family: $font-family;
  .company-text {
    color: $header-text-color;
  }
  .el-icon {
    color: var(--top-header-text-color);;
  }
  .company {
    color: var(--top-header-text-color);
    margin-right: 4px;
  }

}

.hover-trigger {
  color: #8291A9;
}

.collapse {
  min-width: auto;
  margin: 0 0 0 10px;
}

.vertical-line {
  height: 23px;
  width: 0;
  border-right: 1px solid rgb(235, 235, 235);
}
</style>
