<template>
  <Dialog
    title="应用详情"
    width="530px"
    :cancelConfig="{ name: '关闭' }"
    :confirmConfig="{ show: false }"
  >
    <div class="app-wrapper">
      <div class="app-content">
        <div class="left"></div>
        <div class="right">
          <div class="app-name">万车利助手</div>
          <div class="app-sub-name">企业应用详情企业应用详情</div>
          <div class="app-status">正常</div>
        </div>
      </div>
      <div class="app-form">
        <el-row>
          <div class="label">可信域名：</div>
          <div class="value">mo.wanguocar.com.cn</div>
        </el-row>
        <el-row>
          <div class="label">应用主页：</div>
          <div class="value">mo.wanguocar.com.cn</div>
        </el-row>
        <el-row>
          <div class="label">地理位置：</div>
          <div class="value">mo.wanguocar.com.cn</div>
        </el-row>
        <el-row>
          <div class="label">用户进入应用事件：</div>
          <div class="value">mo.wanguocar.com.cn</div>
        </el-row>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.app-content {
  display: flex;
  margin-bottom: 17px;

  .left {
    width: 60px;
    height: 60px;
    background-color: rgb(220 220 220 / 100%);
    border-radius: 8px;
  }

  .right {
    margin-left: 15px;

    .app-name {
      height: 20px;
      font-size: 14px;
      color: rgb(51 51 51 / 100%);
    }

    .app-sub-name {
      margin-top: 4px;
      font-size: 12px;
      color: rgb(102 102 102 / 100%);
    }

    .app-status {
      display: inline-block;
      padding: 3px 8px;
      margin-top: 3px;
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

.app-form {
  .el-row {
    margin-top: 10px;

    &:first-child {
      margin-top: 0;
    }
  }

  .label {
    height: 20px;
    font-size: 14px;
    font-weight: bold;
    color: rgb(51 51 51 / 100%);
  }

  .value {
    height: 20px;
    font-size: 14px;
    color: rgb(51 51 51 / 100%);
  }
}
</style>
