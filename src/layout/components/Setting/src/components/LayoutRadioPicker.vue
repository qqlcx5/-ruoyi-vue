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
        'relative w-80px h-60px cursor-pointer bg-gray-300',
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
        'relative w-80px h-60px cursor-pointer bg-gray-300',
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
        'relative w-80px h-60px cursor-pointer bg-gray-300',
        {
          'is-acitve': layout === 'cutMenu'
        },
        'checkmark-content'
      ]"
      @click="appStore.setLayout('cutMenu')"
    >
      <div class="absolute h-full w-[33%] top-0 left-[10%] bg-gray-200"></div>
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
    border: 2px solid #e5e7eb;
    border-radius: 4px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 33%;
      height: 100%;
      background-color: #273352;
      border-radius: 4px 0 0 4px;
      content: '';
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 25%;
      background-color: #fff;
      border-radius: 4px 4px 0 4px;
      content: '';
    }
  }

  &__top-left {
    border: 2px solid #e5e7eb;
    border-radius: 4px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 33%;
      background-color: #273352;
      border-radius: 4px 4px 0 0;
      content: '';
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 33%;
      height: 100%;
      background-color: #fff;
      border-radius: 4px 0 0 4px;
      content: '';
    }
  }

  &__top {
    border: 2px solid #e5e7eb;
    border-radius: 4px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 33%;
      background-color: #273352;
      border-radius: 4px 4px 0 0;
      content: '';
    }
  }

  &__cut-menu {
    border: 2px solid #e5e7eb;
    border-radius: 4px;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 33%;
      background-color: #273352;
      border-radius: 4px 4px 0 0;
      content: '';
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 10%;
      height: 100%;
      background-color: #fff;
      border-radius: 4px 0 0 4px;
      content: '';
    }
  }

  .is-acitve {
    box-shadow: 0 0 4px #339DFF;
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
