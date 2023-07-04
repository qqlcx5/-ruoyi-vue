<template>
  <el-card class="principal-card">
    <template #header>企业微信主体配置</template>
    <el-form
      :ref="principalFormRef"
      :model="principalForm"
      :rules="principalRules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="企业ID">
        <el-input placeholder="请输入企业ID" />
      </el-form-item>
      <div class="small-gray m-20"
        >我的企业 > 企业信息 > 企业ID
        <XTextButton title="去获取" type="primary" />
      </div>
      <el-form-item label="联系人Secret">
        <el-input placeholder="请输入联系人Secret" />
      </el-form-item>
      <div class="small-gray m-20"
        >客户与上下游 > 客户 > API > Secret
        <XTextButton title="去获取" type="primary" />
      </div>
      <el-form-item label="通讯录Secret">
        <el-input placeholder="请输入通讯录Secret" />
      </el-form-item>
      <div class="small-gray m-20"
        >管理工具 > 通讯录同步 > Secret
        <XTextButton title="去获取" type="primary" />
      </div>
      <el-form-item label="可信IP地址">
        <el-input placeholder="请输入联系人Secret" v-model="principalForm.ipAdress">
          <template #suffix>
            <XButton title="复制" type="primary" @click="onCopy()" />
          </template>
        </el-input>
      </el-form-item>
      <div class="small-gray m-20">
        <div
          >1、管理工具 > 通讯录同步 > 企业可信IP
          <XTextButton title="去获取" type="primary" />
        </div>
        <div> 2、权限-API编辑通讯录 > 勾选【开启手动编辑】</div>
      </div>
      <el-form-item>
        <XButton title="取消" />
        <XButton title="保存" type="primary" />
        <XButton title="编辑" type="primary" />
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="callback-card">
    <template #header>企业微信回调配置</template>
    <el-form
      :ref="callbackFormRef"
      :model="callbackForm"
      :rules="callbackRules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="URL">
        <el-input>
          <template #suffix>
            <XButton title="复制" type="primary" @click="onCopy()" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="Token">
        <el-input>
          <template #suffix>
            <XButton title="复制" type="primary" @click="onCopy()" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="EncodingAESKey">
        <el-input>
          <template #suffix>
            <XButton title="复制" type="primary" @click="onCopy()" />
          </template>
        </el-input>
      </el-form-item>
      <div class="small-gray mt-20">
        <div
          >客户与上下游 > 客户 > API > 接收事件服务器
          <XTextButton title="去配置" />
        </div>
        <div>
          管理工具 > 通讯录同步 > 接收事件服务器2、权限-API编辑通讯录 > 勾选【开启手动编辑】
          <XTextButton title="去配置" />
        </div>
      </div>
    </el-form>
  </el-card>

  <el-card class="app-card">
    <template #header>企业微信应用配置</template>
    <div class="app-wrapper" @click="showDetail">
      <div class="app-content">
        <div class="left"></div>
        <div class="right">
          <div class="app-name">万车利助手</div>
          <div class="app-status">正常</div>
        </div>
      </div>
      <div class="app-content add" @click.stop="addApp">
        <div class="add-upload">
          <Icon icon="svg-icon:add-upload" :size="16" />
        </div>
      </div>
    </div>
    <div class="small-gray mt-5">
      <div> 客户与上下游>客户>API>可调用应用>选择配置的应用 <XTextButton title="去配置" /> </div>
    </div>
  </el-card>
  <add-app-dialog v-model="showAddDialog" />
  <app-detail v-model="showAppDetail" />
</template>

<script setup lang="ts" name="weComConfig">
import type { FormRules, FormInstance } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import AddAppDialog from './components/addAppDialog.vue'
import AppDetail from './components/appDetailDialog.vue'
const { toClipboard } = useClipboard()
const message = useMessage()
const principalFormRef = ref<FormInstance>()
const principalRules = ref<FormRules>()
const principalForm = ref({
  ipAdress: ''
})

const callbackFormRef = ref<FormInstance>()
const callbackRules = ref<FormRules>()
const callbackForm = ref({})
const onCopy = async (val = '') => {
  try {
    await toClipboard(val)
    message.success('复制成功')
  } catch (e) {
    message.error('复制失败')
  }
}
const showAddDialog = ref<boolean>(false)
const addApp = () => {
  showAddDialog.value = true
}
const showAppDetail = ref<boolean>(false)
const showDetail = () => {
  showAppDetail.value = true
}
</script>

<style lang="scss" scoped>
:deep(.el-card__header) {
  font-weight: bold;
}

.el-input {
  width: 466px;
}

.el-form-item--default {
  margin-bottom: 0;
}

.input-with-select .el-input-group__prepend {
  background-color: rgb(0 129 255 / 100%) !important;
}

:deep(.el-input__wrapper) {
  padding: 1px 0 1px 11px;
}

.small-gray {
  font-size: 14px;
  color: rgb(153 153 153 / 100%);

  &.mt-5 {
    margin-top: 5px;
  }

  &.m-20 {
    margin: 8px 0 20px 100px;
  }

  &.mt-20 {
    margin-top: -20px;
    margin-left: 100px;
  }
}

.callback-card {
  .el-form-item--default {
    margin-bottom: 30px;
  }
}

.app-card {
  .app-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .app-content {
    display: flex;
    width: 240px;
    height: 82px;
    padding: 15px;
    margin-right: 10px;
    margin-bottom: 10px;
    background-color: rgb(255 255 255 / 100%);
    border: 1px solid rgb(227 228 229 / 100%);
    border-radius: 6px;

    .left {
      width: 52px;
      height: 52px;
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

    &.add {
      display: flex;
      background-color: rgb(248 248 248 / 100%);
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
