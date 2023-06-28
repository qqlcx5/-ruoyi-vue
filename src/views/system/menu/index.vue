<template>
  <div class="system-menu">
    <!-- 成员端、管理端、客户端  memberSide、managementEnd、client -->
    <el-tabs type="border-card" v-model="tabsName">
      <el-tab-pane label="成员端" name="memberSide"> </el-tab-pane>
      <el-tab-pane label="管理端" name="managementEnd"> </el-tab-pane>
    </el-tabs>
    <MenuComp v-if="tabsName !== 'client'" :mode="tabsName" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuComp from './components/menuComp.vue'

let tabsName = ref('managementEnd')
</script>

<style lang="scss" scoped>
.system-menu {
  :deep(.el-card) {
    border: none;
    border-radius: 0;
  }
  :deep(.el-tabs__content) {
    display: none;
  }
  :deep(.el-tabs--border-card > .el-tabs__header) {
    border-bottom: none;
    background-color: #f1f3f6;
  }
  :deep(.el-tabs__item) {
    position: relative;
    height: 50px;
    line-height: 50px;
    padding-left: 34px !important;
    padding-right: 34px !important;
    &.is-active {
      background-color: #fff;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #409eff;
      }
    }
  }

  :deep(.el-tabs--border-card) {
    border: none;
  }
}
</style>
