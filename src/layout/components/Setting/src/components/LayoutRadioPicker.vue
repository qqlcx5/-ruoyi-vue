<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout-radio-picker')

const appStore = useAppStore()

const layout = computed(() => appStore.getLayout)
</script>

<template>
  <div :class="prefixCls" class="total-content flex flex-wrap space-x-14px layout-content">
    <div
      :class="[
        `${prefixCls}__classic`,
        'relative w-80px h-60px cursor-pointer bg-white',
        {
          'is-acitve': layout === 'classic'
        },
        'checkmark-content'
      ]"
      @click="appStore.setLayout('classic')"
    >
      <Icon
        v-show="layout === 'classic'"
        class="checked-icon"
        icon="svg-icon:tick-circle"
        color="#3296fa"
        :size="24" />
    </div>
    <!--    <div-->
    <!--      :class="[-->
    <!--        `${prefixCls}__top-left`,-->
    <!--        'relative w-56px h-48px cursor-pointer bg-gray-300',-->
    <!--        {-->
    <!--          'is-acitve': layout === 'topLeft'-->
    <!--        }-->
    <!--      ]"-->
    <!--      @click="appStore.setLayout('topLeft')"-->
    <!--    ></div>-->
    <div
      :class="[
        `${prefixCls}__top`,
        'relative w-80px h-60px cursor-pointer bg-white',
        {
          'is-acitve': layout === 'top'
        },
        'checkmark-content'
      ]"
      @click="appStore.setLayout('top')"
    >
      <Icon
        v-show="layout === 'top'"
        class="checked-icon"
        icon="svg-icon:tick-circle"
        color="#3296fa"
        :size="24" />
    </div>
    <div
      :class="[
        `${prefixCls}__cut-menu`,
        'relative w-80px h-60px cursor-pointer bg-white',
        {
          'is-acitve': layout === 'cutMenu'
        },
        'checkmark-content'
      ]"
      @click="appStore.setLayout('cutMenu')"
    >
      <div class="absolute w-[20%] top-[16%] bottom-0 left-[20%] bg-gray-200"></div>
      <Icon
        v-show="layout === 'cutMenu'"
        class="checked-icon"
        icon="svg-icon:tick-circle"
        color="#3296fa"
        :size="24" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-layout-radio-picker;

.#{$prefix-cls} {
  &__classic {
    border: 1px solid #e5e7eb;
    border-radius: 8px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 20%;
      height: 100%;
      background-color: #273352;
      border-radius: 8px 0 0 8px;
      content: '';
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 16%;
      background-color: #fff;
      border-bottom: 1px solid #e5e7eb;
      border-radius: 8px 8px 0 8px;
      content: '';
    }
  }

  &__top-left {
    border: 1px solid #e5e7eb;
    border-radius: 8px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 20%;
      background-color: #273352;
      border-radius: 8px 8px 0 0;
      content: '';
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 33%;
      height: 100%;
      background-color: #fff;
      border-radius: 8px 0 0 8px;
      content: '';
    }
  }

  &__top {
    border: 1px solid #e5e7eb;
    border-radius: 8px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 30%;
      background-color: #273352;
      border-radius: 8px 8px 0 0;
      content: '';
    }
  }

  &__cut-menu {
    border: 1px solid #e5e7eb;
    border-radius: 8px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 16%;
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      border-radius: 8px 8px 0 0;
      content: '';
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 20%;
      height: 100%;
      background-color: #273352;
      border-radius: 8px 0 0 8px;
      content: '';
      z-index: 1;
    }
  }

  .is-acitve {
    box-shadow: 0px 0px 9px 0px rgba(51, 157, 255, 0.51);
  }
}

.checked-icon {
  position: absolute;
  right: 0;
  bottom: 0;
}

.total-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
