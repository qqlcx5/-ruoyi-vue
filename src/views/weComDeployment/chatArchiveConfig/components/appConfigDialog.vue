<template>
  <Dialog title="已配置应用" :confirmConfig="{ name: '保存' }" @confirm="save">
    <div v-if="hasConfig">
      <div class="app-wrapper">
        <div class="app-content">
          <div class="left"></div>
          <div class="right">
            <div class="app-name">万车利助手</div>
            <div class="app-status">正常</div>
          </div>
        </div>
        <div class="app-content">
          <div class="left"></div>
          <div class="right">
            <div class="app-name">万车利助手</div>
            <div class="app-status">正常</div>
          </div>
        </div>
        <div class="app-content">
          <div class="left"></div>
          <div class="right">
            <div class="app-name">万车利助手</div>
            <div class="app-status">正常</div>
          </div>
        </div>
      </div>
    </div>
    <div class="c-center" v-else>
      <div>暂无已配置应用 <XTextButton title="去添加" @click="goAddApp" /> </div>
    </div>
    <add-app v-model="showAddAppDialog" />
  </Dialog>
</template>

<script setup lang="ts">
import AddApp from '@/views/weComDeployment/weComConfig/components/addAppDialog.vue'
const hasConfig = ref<boolean>(false)

// 添加应用
const showAddAppDialog = ref<boolean>(false)
const goAddApp = () => {
  console.log('添加应用')
  showAddAppDialog.value = true
}
const save = () => {
  console.log('保存')
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;

  .app-content {
    display: flex;
    padding: 15px;
    margin-right: 10px;
    margin-bottom: 10px;
    background-color: rgb(255 255 255 / 100%);
    border: 1px solid rgb(227 228 229 / 100%);
    border-radius: 6px;

    .left {
      width: 60px;
      height: 60px;
      background-color: #00b5ff;
      border-radius: 8px;
    }

    .right {
      margin-left: 15px;

      .app-name {
        height: 20px;
        font-size: 14px;
        color: rgb(51 51 51 / 100%);
      }

      .app-status {
        display: inline-block;
        padding: 3px 8px;
        margin-top: 10px;
        font-size: 12px;
        line-height: 18px;
        color: rgb(82 196 26 / 100%);
        text-align: center;
        background-color: rgb(237 249 232 / 100%);
        //height: 22px;
        border-radius: 4px;
      }
    }
  }
}

.c-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
