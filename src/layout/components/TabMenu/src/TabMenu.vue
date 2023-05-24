<script lang="tsx">
import { usePermissionStore } from '@/store/modules/permission'
import { useAppStore } from '@/store/modules/app'

import { ElScrollbar } from 'element-plus'
import { Icon } from '@/components/Icon'
import { Menu } from '@/layout/components/Menu'
import { pathResolve } from '@/utils/routerHelper'
import { cloneDeep } from 'lodash-es'
import { filterMenusPath, initTabMap, tabPathMap } from './helper'
import { useDesign } from '@/hooks/web/useDesign'
import { isUrl } from '@/utils/is'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tab-menu')

export default defineComponent({
  name: 'TabMenu',
  setup() {
    const { push, currentRoute } = useRouter()

    const { t } = useI18n()

    const appStore = useAppStore()

    const collapse = computed(() => appStore.getCollapse)

    const fixedMenu = computed(() => appStore.getFixedMenu)

    const permissionStore = usePermissionStore()

    const routers = computed(() => permissionStore.getRouters)

    const tabRouters = computed(() => unref(routers).filter((v) => !v?.meta?.hidden))

    const setCollapse = () => {
      appStore.setCollapse(!unref(collapse))
    }

    onMounted(() => {
      if (unref(fixedMenu)) {
        const path = `/${unref(currentRoute).path.split('/')[1]}`
        const children = unref(tabRouters).find(
          (v) =>
            (v.meta?.alwaysShow || (v?.children?.length && v?.children?.length > 1)) &&
            v.path === path
        )?.children

        tabActive.value = path
        if (children) {
          permissionStore.setMenuTabRouters(
            cloneDeep(children).map((v) => {
              v.path = pathResolve(unref(tabActive), v.path)
              return v
            })
          )
        }
      }
    })

    watch(
      () => routers.value,
      (routers: AppRouteRecordRaw[]) => {
        initTabMap(routers)
        filterMenusPath(routers, routers)
      },
      {
        immediate: true,
        deep: true
      }
    )

    const showTitle = ref(true)

    watch(
      () => collapse.value,
      (collapse: boolean) => {
        if (!collapse) {
          setTimeout(() => {
            showTitle.value = !collapse
          }, 200)
        } else {
          showTitle.value = !collapse
        }
      }
    )

    // 是否显示菜单
    const showMenu = ref(unref(fixedMenu) ? true : false)

    watch(
      () => showMenu.value,
      (visible: boolean) => {
        appStore.setIsShowCutSubMenu(visible)
      }
    )

    // tab高亮
    const tabActive = ref('')

    // tab点击事件
    const tabClick = (item: AppRouteRecordRaw) => {
      if (isUrl(item.path)) {
        window.open(item.path)
        return
      }
      const newPath = item.children ? item.path : item.path.split('/')[0]
      const oldPath = unref(tabActive)
      tabActive.value = item.children ? item.path : item.path.split('/')[0]
      if (item.children) {
        if (newPath === oldPath || !unref(showMenu)) {
          showMenu.value = unref(fixedMenu) ? true : !unref(showMenu)
        }
        if (unref(showMenu)) {
          permissionStore.setMenuTabRouters(
            cloneDeep(item.children).map((v) => {
              v.path = pathResolve(unref(tabActive), v.path)
              return v
            })
          )
        }
      } else {
        push(item.path)
        permissionStore.setMenuTabRouters([])
        showMenu.value = false
      }
    }

    // 设置高亮
    const isActive = (currentPath: string) => {
      const { path } = unref(currentRoute)
      if (tabPathMap[currentPath].includes(path)) {
        return true
      }
      return false
    }

    // const mouseleave = () => {
    //   if (!unref(showMenu) || unref(fixedMenu)) return
    //   showMenu.value = false
    // }

    return () => (
      <div
        id={`${variables.namespace}-menu`}
        class={[prefixCls, 'relative bg-[var(--left-menu-bg-color)] flex-shrink-0 flex']}
        // onMouseleave={mouseleave}
      >
        <div
          class={[
            prefixCls,
            'relative bg-[var(--left-menu-bg-color)] flex-shrink-0',
            {
              collapse: !unref(collapse),
              'w-[var(--tab-menu-max-width)]': !unref(collapse),
              'w-[var(--tab-menu-min-width)]': unref(collapse)
            }
          ]}
        >
          <ElScrollbar class="!h-[calc(100%-var(--tab-menu-collapse-height)-1px)]">
            <div>
              {() => {
                return unref(tabRouters).map((v) => {
                  const item = (
                    v.meta?.alwaysShow || (v?.children?.length && v?.children?.length > 1)
                      ? v
                      : {
                          ...(v?.children && v?.children[0]),
                          path: pathResolve(v.path, (v?.children && v?.children[0])?.path as string)
                        }
                  ) as AppRouteRecordRaw
                  return (
                    <div
                      class={[
                        `${prefixCls}__item`,
                        'text-center text-14px relative h-50px cursor-pointer flex items-center',
                        {
                          'no-children': v?.children?.length === 1,
                          'is-active': isActive(v.path),
                          '!pl-16px': !unref(collapse),
                          'px-[var(--el-menu-base-level-padding)] justify-center': unref(collapse)
                        }
                      ]}
                      onClick={() => {
                        tabClick(item)
                      }}
                    >
                      <div
                        class={[`flex items-center justify-center`, { 'pr-8px': !unref(collapse) }]}
                      >
                        <Icon class="icon" icon={item?.meta?.icon}></Icon>
                      </div>
                      {unref(collapse) ? undefined : (
                        <p class="break-words py-0 m-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
                          {t(item.meta?.title)}
                        </p>
                      )}
                    </div>
                  )
                })
              }}
            </div>
          </ElScrollbar>
          <div
            class={[
              `${prefixCls}--collapse`,
              'absolute bottom-24px flex items-center text-center justify-center text-[var(--left-menu-text-color)] bg-[var(--left-menu-bg-light-color)] h-[var(--tab-menu-collapse-height)] leading-[var(--tab-menu-collapse-height)] cursor-pointer',
              {
                'left-18px right-18px': !unref(collapse),
                'left-10px right-10px': unref(collapse)
              }
            ]}
            onClick={setCollapse}
          >
            <i
              class={[
                'iconfont cursor-pointer !text-18px',
                {
                  'icon-shouqicaidan': unref(collapse),
                  'icon-zhankaicaidan mr-4px': !unref(collapse)
                }
              ]}
            ></i>
            {unref(collapse) ? undefined : <span class="whitespace-nowrap">收起菜单</span>}
          </div>
        </div>

        <Menu
          v-show="unref(showMenu) && unref(fixedMenu)"
          class={[
            'wg-cut-sub-menu top-0 border-solid border-[var(--el-border-color)] border-r-1 border-t-1 bg-[var(--el-bg-color)]',
            {
              '!w-[calc(var(--left-sub-menu-max-width)+1px)]': unref(showMenu) || unref(fixedMenu),
              '!w-0': !unref(showMenu) && !unref(fixedMenu)
            }
          ]}
          style="transition: width var(--transition-time-02), left var(--transition-time-02);"
        ></Menu>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tab-menu;

.#{$prefix-cls} {
  transition: all var(--transition-time-02);

  &:after {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    border-left: 1px solid var(--left-menu-border-color);
    content: '';
  }

  &__item {
    color: var(--left-menu-text-color);
    //display: flex;
    //align-items: center;
    //height: var(--el-menu-item-height);
    //line-height: var(--el-menu-item-height);
    //font-size: var(--el-menu-item-font-size);
    ///* color: var(--el-menu-text-color); */
    //padding-right: var(--el-menu-base-level-padding) !important;
    //list-style: none;
    //cursor: pointer;
    //position: relative;
    //transition: border-color var(--el-transition-duration),background-color var(--el-transition-duration),color var(--el-transition-duration);
    //box-sizing: border-box;
    //white-space: nowrap;

    &:hover {
      color: var(--left-menu-text-active-color);
    }
  }

  &--collapse {
    color: var(--left-menu-text-color);
    background-color: var(--left-menu-bg-light-color);
    border-top: 1px solid var(--left-menu-border-color);
  }

  .is-active {
    position: relative;
    color: var(--left-menu-text-active-color);

    & .icon {
      color: var(--left-menu-bg-active-color);
    }
    background-color: var(--left-menu-bg-light-color);

    &.no-children {
      color: var(--el-color-primary);
      &:before {
        display: none;
      }
    }
  }

  .collapse {
    .is-active {
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background-color: var(--left-menu-bg-active-color);
      }
    }
  }

  .wg-cut-sub-menu {
    :deep(.wg-scroll-bar) {
      .el-scrollbar__wrap {
        .el-scrollbar__view {
          .el-menu {
            background-color: var(--el-bg-color);
            .el-sub-menu,
            .el-menu-item,
            .el-sub-menu.is-opened {
              color: var(--el-text-color-regular) !important;
              background-color: var(--el-bg-color) !important;
            }
            .el-sub-menu,
            .el-sub-menu .el-menu-item,
            .el-menu-item,
            .el-sub-menu.is-opened .el-sub-menu__title,
            .el-sub-menu.is-active .el-sub-menu__title {
              padding-left: 26px !important;
            }
            .el-sub-menu.is-opened,
            .el-sub-menu.is-active {
              padding-left: 0 !important;

              .el-sub-menu__title {
                &::before {
                  //left: 0 !important;
                  display: none;
                }
                &::after {
                  left: 8px !important;
                }
              }
            }
            .el-sub-menu__title {
              color: var(--el-text-color-regular) !important;
              background-color: var(--el-bg-color) !important;

              &::after {
                content: '\e68f';
                font-family: 'iconfont';
                font-style: normal;
                font-size: 14px;
                position: absolute;
                left: -18px;
                transition: transform var(--el-transition-duration);
              }
            }
            /*close menu*/
            .el-sub-menu > .el-sub-menu__title::after {
              transition: transform 0.3s; //cancel move animation
            }
            /*open menu*/
            .el-sub-menu.is-opened > .el-sub-menu__title::after {
              -webkit-transform: rotateZ(180deg);
              transform: rotateZ(180deg);
              transition: transform 0.3s;
            }

            // 设置子菜单悬停的高亮和背景色
            .el-sub-menu__title,
            .el-menu-item {
              height: calc(var(--left-menu-item-height) - 10px) !important;
              &:hover {
                color: var(--el-color-primary) !important;
              }
              &.is-active {
                color: var(--el-color-primary) !important;
                background-color: #edf4fb !important;
                &:before {
                  content: '';
                  position: absolute;
                  left: 0;
                  top: 0;
                  bottom: 0;
                  width: 3px;
                  background-color: var(--left-menu-bg-active-color);
                }
              }
              .el-icon {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
