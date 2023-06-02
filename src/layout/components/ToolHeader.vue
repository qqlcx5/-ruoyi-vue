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
import SwitchTenant from '@/layout/components/SwitchTenant/index.vue'
import { useUserStoreWithOut } from '@/store/modules/user'
import { getTenantById, handoffTenant } from '@/api/login'
import { getTenantId, setTenantId } from '@/utils/auth'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import router from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import * as authUtil from '@/utils/auth'
import { ElLoading } from 'element-plus'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tool-header')

const appStore = useAppStore()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)
// // 折叠图标
// const hamburger = computed(() => appStore.getHamburger)

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
    const { wsCache } = useCache()
    const messageBox = useMessage()
    const userStore = useUserStoreWithOut()
    const permissionStore = usePermissionStoreWithOut()
    const switchTenantRef = ref()
    const tenantName = computed(() => {
      return userStore.getTenant.systemName
    })
    // 切换主体
    const switchTenant = async () => {
      await getTenantById({ tenantId: getTenantId() }).then((res) => {
        if (!res) return messageBox.error('获取可选主体失败')
        let tenantList: any[] = []
        res.forEach((tenant) => {
          tenantList = [...tenantList, ...tenant.tenantInfos]
        })
        switchTenantRef.value.openDialog(tenantList, getTenantId())
      })
    }
    // 选中切换主体
    const handleSwitchTenant = async (data) => {
      ElLoading.service({
        lock: true,
        text: '正在切换主体中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // 重新设置token信息
      await handoffTenant({ tenantId: data }).then((res) => {
        if (!res) return messageBox.error('获取新主体token失败')
        authUtil.setToken(res)
      })
      setTenantId(data)
      // 设置登录信息
      wsCache.delete(CACHE_KEY.USER)
      wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
      await userStore.setUserInfoAction()
      // 重新设置权限
      await permissionStore.generateRoutes()
      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      })
      router.go(0)
    }

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
              <Collapse class="collapse" color="var(--top-header-text-color)"></Collapse>
            ) : undefined}
            {breadcrumb.value ? <Breadcrumb class="<md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined}
        <div class="h-full flex items-center">
          <div
            class="company-content flex items-center px-22px hover-trigger"
            onClick={switchTenant}
          >
            <div class="company-text">
              <span class="company">{tenantName.value}</span>
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
        <SwitchTenant ref={switchTenantRef} onConfirm={handleSwitchTenant} />
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
    color: var(--top-header-text-color);
    color: var(--top-header-text-color);
  }
  .company {
    color: var(--top-header-text-color);
    margin-right: 4px;
  }
}

.hover-trigger {
  color: #8291a9;
  color: #8291a9;
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
