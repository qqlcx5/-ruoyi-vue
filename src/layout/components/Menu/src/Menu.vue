<script lang="tsx">
import {computed, PropType} from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRenderMenuItem } from './components/useRenderMenuItem'
import { isUrl } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { LayoutType } from '@/types/layout'
import { Icon } from '@/components/Icon'
import {useScrollTo} from "@/hooks/event/useScrollTo";

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('menu')

export default defineComponent({
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const appStore = useAppStore()

    const layout = computed(() => appStore.getLayout)

    const { push, currentRoute } = useRouter()

    const permissionStore = usePermissionStore()

    const menuMode = computed((): 'vertical' | 'horizontal' => {
      // 竖
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

      if (vertical.includes(unref(layout))) {
        return 'vertical'
      } else {
        return 'horizontal'
      }
    })

    const routers = computed(() =>
      unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
    )

    const collapse = computed(() => appStore.getCollapse)

    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })

    const menuSelect = (index: string) => {
      if (props.menuSelect) {
        props.menuSelect(index)
      }
      // 自定义事件
      if (isUrl(index)) {
        window.open(index)
      } else {
        push(index)
      }
    }

    // elscroll 实例
    const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()
    const elMenuRef = ref<ComponentRef<typeof ElMenu>>()

    const menuScroll = (direction: string) => {
      const wrap$ = unref(scrollbarRef)?.wrapRef
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: direction === 'right' ? (unref(scrollLeftNumber)+150) : (unref(scrollLeftNumber)-150),
        duration: 300
      })
      start()
    }

    // 保存滚动位置
    const scrollLeftNumber = ref(0)

    const scroll = ({ scrollLeft }) => {
      scrollLeftNumber.value = scrollLeft as number
    }

    const renderMenuWrap = () => {
      if (unref(layout) === 'top') {
        return (
          <div class="flex relative">
            <div
              onClick={() => menuScroll('left')}
              class={"flex items-center justify-center w-20px h-[var(--top-tool-height)] px-8px hover-trigger sticky left-0 top-0 bottom-0 text-[var(--top-header-text-color)] bg-[var(--left-menu-bg-color)] z-1"}>
              <Icon
                icon="svg-icon:arrow-left"
                size={16}
                color="appStore.getIsDark ? 'var(&#45;&#45;el-text-color-regular)' : '#333'"
              />
            </div>
            <ElScrollbar ref={scrollbarRef} class="h-full" onScroll={scroll}>
              {renderMenu()}
            </ElScrollbar>

            <div
              onClick={() => menuScroll('right')}
              class={"flex items-center justify-center w-20px h-[var(--top-tool-height)] px-8px hover-trigger sticky right-0 top-0 bottom-0 text-[var(--top-header-text-color)] bg-[var(--left-menu-bg-color)] z-1"}>
              <Icon
                icon="svg-icon:arrow-right"
                size={16}
                color="appStore.getIsDark ? 'var(&#45;&#45;el-text-color-regular)' : '#333'"
              />
            </div>
          </div>
        )
      } else {
        // return <ElScrollbar class="wg-scroll-bar">{renderMenu()}</ElScrollbar>
        return <ElScrollbar class={unref(collapse) ? 'collapse-menu' : 'wg-scroll-bar'}>{renderMenu()}</ElScrollbar>
      }
    }

    const renderMenu = () => {
      return (
        <ElMenu
          ref={elMenuRef}
          defaultActive={unref(activeMenu)}
          mode={unref(menuMode)}
          collapse={
            unref(layout) === 'top' || unref(layout) === 'cutMenu' ? false : unref(collapse)
          }
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
          backgroundColor="var(--left-menu-bg-color)"
          textColor="var(--left-menu-text-color)"
          activeTextColor="var(--left-menu-text-active-color)"
          onSelect={menuSelect}
          ellipsis={false}
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem(unref(menuMode))
              return renderMenuItem(unref(routers))
            }
          }}
        </ElMenu>
      )
    }

    return () => (
      <div
        id={prefixCls}
        class={[
          `${prefixCls} ${prefixCls}__${unref(menuMode)}`,
          'h-[100%] overflow-hidden flex-col bg-[var(--left-menu-bg-color)]',
          {
            'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu',
            'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu'
          }
        ]}
      >
        {renderMenuWrap()}
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-menu;

.is-active--after {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background-color: var(--left-menu-bg-active-color);
  content: '';
}

.#{$prefix-cls} {
  position: relative;
  transition: width var(--transition-time-02);

  &:after {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    border-left: 1px solid var(--left-menu-border-color);
    content: '';
  }

  :deep(.#{$elNamespace}-menu.el-menu--vertical) {
    width: 100% !important;
    border-right: none;

    // 设置选中时子标题的颜色
    .is-active {
      & > .#{$elNamespace}-sub-menu__title {
        color: var(--left-menu-text-active-color) !important;
      }
    }

    // 设置子菜单悬停的高亮和背景色
    .#{$elNamespace}-sub-menu__title,
    .#{$elNamespace}-menu-item {
      padding-left: 18px;
      .#{$elNamespace}-icon {
        width: auto;
        margin-right: 10px;
      }
      &:hover {
        color: var(--left-menu-text-active-color) !important;
        //background-color: var(--left-menu-bg-color) !important;
      }
    }

    // 设置选中时的高亮背景和高亮颜色
    .#{$elNamespace}-sub-menu.is-active,
    .#{$elNamespace}-menu-item.is-active {
      color: var(--el-color-primary) !important;
      //background-color: var(--left-menu-bg-light-color) !important;

      &:hover {
        //background-color: var(--left-menu-bg-active-color) !important;
      }
    }

    .#{$elNamespace}-menu-item.is-active {
      position: relative;
      //color: var(--left-menu-bg-active-color) !important;
      //&:after {
      //  @extend .is-active--after;
      //}
    }

    // 设置子菜单的背景颜色
    .#{$elNamespace}-menu {
      .#{$elNamespace}-sub-menu__title,
      .#{$elNamespace}-menu-item:not(.is-active) {
        //background-color: var(--left-menu-bg-light-color) !important;
      }
    }
  }

  // 折叠时的最小宽度
  :deep(.#{$elNamespace}-menu--collapse) {
    width: var(--left-menu-min-width);

    & > .is-active,
    & > .is-active > .#{$elNamespace}-sub-menu__title {
      position: relative;
      //background-color: var(--left-menu-collapse-bg-active-color) !important;

      //&:after {
      //  @extend .is-active--after;
      //}
      .#{$elNamespace}-icon {
        color: var(--el-color-primary) !important;
      }
    }
  }

  // 折叠动画的时候，就需要把文字给隐藏掉
  :deep(.horizontal-collapse-transition) {
    // transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out !important;
    .#{$prefix-cls}__title {
      display: none;
    }
  }

  // 水平菜单
  &__horizontal {
    height: calc(var(--top-tool-height)) !important;

    :deep(.#{$elNamespace}-menu--horizontal) {
      height: calc(var(--top-tool-height));
      border-bottom: none;
      // 重新设置底部高亮颜色
      & > .#{$elNamespace}-sub-menu.is-active {
        .#{$elNamespace}-sub-menu__title {
          border-bottom-color: var(--el-color-primary) !important;
        }
      }

      .#{$elNamespace}-menu-item.is-active {
        position: relative;

        &:after {
          display: none !important;
        }
      }

      .#{$prefix-cls}__title {
        /* stylelint-disable-next-line */
        max-height: calc(var(--top-tool-height) - 2px) !important;
        /* stylelint-disable-next-line */
        line-height: calc(var(--top-tool-height) - 2px);
      }
      //.#{$elNamespace}-icon {
      //  display:none !important;
      //}
    }
  }
}

.hide-icon {
  .#{$elNamespace}-sub-menu__title,
  .#{$elNamespace}-menu-item,
  .#{$elNamespace}-sub-menu {
    display: none !important;
  }
}

.wg-scroll-bar {
  :deep(.#{$elNamespace}-scrollbar__wrap) {
    >.#{$elNamespace}-scrollbar__view {
      >.#{$elNamespace}-menu {
        > .#{$elNamespace}-sub-menu__title,
        > .#{$elNamespace}-menu-item,
        > .#{$elNamespace}-sub-menu,
        {
          &.is-opened {
            position: relative;
            //background-color: var(--left-menu-bg-light-color) !important;
            .#{$elNamespace}-sub-menu__title,
            .#{$elNamespace}-menu-item,
            .#{$elNamespace}-sub-menu, {
              //background-color: var(--left-menu-bg-light-color) !important;
            }
            >.#{$elNamespace}-sub-menu__title, {
              &:before {
                position: absolute;
                top: 0;
                left: -18px;
                width: 3px;
                height: 100%;
                background-color: var(--el-color-primary);
                content: '';
              }
              .v-icon {
                color: var(--el-color-primary);
              }
            }
          }
          padding-left: 18px !important;
          >.el-menu {
            >.el-menu-item {
              //padding-left: 0 !important;
              @extend .hide-icon;
            }
            >.el-sub-menu__title {
              padding-left: 0 !important;
            }
            > .#{$elNamespace}-sub-menu {
              >.el-sub-menu__title {
                //padding-left: 0 !important;
              }
            }
            .el-menu-item, .el-sub-menu__title {
              padding-left: 26px !important;
              .v-icon {
                width: 14px;
                margin-right: 4px;
              }
            }
          }
          >.el-sub-menu__title {
            padding-left: 0 !important;
            >.el-icon {
              //margin-right: 0 !important;
              span {
                font-size: 16px !important;
              }
            }
          }
          > .#{$elNamespace}-sub-menu {
            padding-left: 0 !important;
          }
          >.el-icon {
            span {
              font-size: 16px !important;
            }
          }
        }

      }
    }
  }
}

:deep(.#{$elNamespace}-menu--horizontal) {
  .el-icon span {
    font-size: 16px !important;
  }
}


.collapse-menu {
  :deep(.#{$elNamespace}-menu) {

    .#{$elNamespace}-menu-item,
    .#{$elNamespace}-sub-menu__title,
    {
      display: flex;
      align-items: center;
      height: var(--el-menu-item-height);
      line-height: var(--el-menu-item-height);
      font-size: var(--el-menu-item-font-size);
      color: var(--el-menu-text-color);
      //padding: 0 var(--el-menu-base-level-padding) !important;
      list-style: none;
      cursor: pointer;
      position: relative;
      transition: border-color var(--el-transition-duration),background-color var(--el-transition-duration),color var(--el-transition-duration);
      box-sizing: border-box;
      white-space: nowrap;
    }
    .el-icon {
      span {
        font-size: 16px !important;
      }
    }
  }
}
</style>

<style lang="scss">
$prefix-cls: #{$namespace}-menu-popper;

.is-active--after {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background-color: var(--el-color-primary);
  content: '';
}

.wg-menu__arrow, .el-sub-menu__title .el-sub-menu__icon-arrow {
  svg {
    display: none;
  }
  position: absolute;
  top: 50%;
  right: var(--el-menu-base-level-padding);
  margin-top: -6px;
  transition: transform var(--el-transition-duration);
  margin-right: 0 !important;
  width: inherit;
}
/*close menu*/
.el-sub-menu > .el-sub-menu__title .el-sub-menu__icon-arrow {
  transition: transform .3s;//cancel move animation
}
/*open menu*/
.el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow {
  -webkit-transform: rotateZ(180deg);
  transform: rotateZ(180deg);
  transition: transform .3s;
}

.el-sub-menu__title .el-sub-menu__icon-arrow {
  &:after {
    content: "\e688";
    font-family: "iconfont";
    font-style: normal;
    font-size: 14px;
  }
}

.#{$prefix-cls}--vertical,
.#{$prefix-cls}--horizontal {
  // 设置选中时子标题的颜色
  .is-active {
    & > .el-sub-menu__title {
      color: var(--left-menu-text-active-color) !important;
    }
  }

  // 设置子菜单悬停的高亮和背景色
  .el-sub-menu__title,
  .el-menu-item {
    &:hover {
      color: var(--left-menu-text-active-color) !important;
      background-color: var(--left-menu-bg-color) !important;
    }
  }

  // 设置选中时的高亮背景
  .el-menu-item.is-active {
    position: relative;
    //background-color: var(--left-menu-bg-active-color) !important;
    //color: var(--left-menu-bg-active-color) !important;

    &:hover {
      background-color: var(--left-menu-bg-active-color) !important;
    }

    //&:after {
    //  @extend .is-active--after;
    //}
  }
}

.#{$prefix-cls}--vertical {
  .el-menu-item.is-active {
    position: relative;
    //background-color: var(--left-menu-bg-active-color) !important;
    color: var(--left-menu-bg-active-color) !important;

    &:hover {
      background-color: var(--left-menu-bg-active-color) !important;
    }
  }
}

.el-menu .el-menu-item:not(.is-disabled):focus, .el-menu .el-menu-item:not(.is-disabled):hover {
  background-color: unset !important;
}
</style>
