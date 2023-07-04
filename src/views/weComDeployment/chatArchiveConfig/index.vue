<template>
  <el-card class="box-card">
    <template #header>1、完成企微配置 </template>
    <el-row>
      <div class="label">企业ID</div>
      <div v-if="hasConfig" class="value">ww425c37477297ced0</div>
      <XTextButton v-else title="去配置" @click="goConfigWecom" />
    </el-row>
  </el-card>
  <template v-if="hasConfig">
    <el-card class="box-card-two">
      <template #header
        >2、复制以下信息并填入到 <span class="blue">企业微信后台会话存档配置</span> 页面
      </template>
      <el-form label-position="right" label-width="112px">
        <el-form-item label="可信IP地址">
          <el-input disabled>
            <template #suffix>
              <XButton title="复制" type="primary" @click="onCopy()" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="信息加密公钥">
          <el-input disabled type="textarea" />
          <XTextButton title="复制" type="primary" @click="onCopy()" />
        </el-form-item>
        <div class="small-gray mt-5">
          <div>
            客户与上下游>客户>API>可调用应用>选择配置的应用 <XTextButton title="去配置" />
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card class="box-card-three">
      <template #header
        >3、将<span class="blue">企业微信后台会话存档配置</span> 页面的Secret复制粘贴到下框中
      </template>
      <el-form label-position="right" label-width="112px">
        <el-form-item label="会话存档Secret">
          <el-input />
        </el-form-item>
        <el-form-item label="公钥版本号">
          <el-input />
        </el-form-item>
        <div class="small-gray mt-5">
          <div> 管理工具 > 会话内容存档 <XTextButton title="去获取" /> </div>
        </div>
      </el-form>
    </el-card>
    <el-card class="box-card-four">
      <template #header>4、配置会话消息回调接收应用 </template>
      <el-form label-position="right" label-width="112px">
        <el-form-item label="配置应用">
          <XButton
            v-if="!hasSelectApp"
            title="选择应用"
            type="primary"
            plain
            @click="goConfigApp"
          />
          <template v-else>
            <div class="app-content">
              <div class="left"></div>
              <div class="right">
                <div class="app-name">万车利助手</div>
                <div class="app-status">正常</div>
              </div>
            </div>
            <XButton title="替换应用" type="primary" plain @click="goConfigApp" />
          </template>
        </el-form-item>
        <el-form-item label="URL">
          <el-input disabled>
            <template #suffix>
              <XButton title="复制" type="primary" @click="onCopy()" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Token">
          <el-input disabled>
            <template #suffix>
              <XButton title="复制" type="primary" @click="onCopy()" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="EncodingAESKey">
          <el-input disabled>
            <template #suffix>
              <XButton title="复制" type="primary" @click="onCopy()" />
            </template>
          </el-input>
        </el-form-item>
        <div class="small-gray mt-5">
          <div
            >应用管理>自建应用>选择接收回调应用>接收消息>设置API接收 <XTextButton title="配置" />
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card class="box-card-five">
      <el-form label-position="right" label-width="112px">
        <el-form-item label="会话存档状态">
          <el-switch />
        </el-form-item>
      </el-form>
    </el-card>
    <app-config v-model="showDialog" />
  </template>
</template>

<script setup lang="ts" name="chatArchiveConfig">
import AppConfig from './components/appConfigDialog.vue'
import useClipboard from 'vue-clipboard3'

const { toClipboard } = useClipboard()
const message = useMessage()
const router = useRouter()
const hasConfig = ref<boolean>(false)
const goConfigWecom = () => {
  router.push('/we-com-deployment/weComConfig')
}
const onCopy = async (val = '') => {
  try {
    await toClipboard(val)
    message.success('复制成功')
  } catch (e) {
    message.error('复制失败')
  }
}
// 是否选择配置应用
const hasSelectApp = ref<boolean>(true)
const showDialog = ref<boolean>(false)
const goConfigApp = () => {
  showDialog.value = true
}
</script>

<style lang="scss" scoped>
:deep(.el-card__header) {
  font-weight: bold;
}

.el-input,
.el-textarea {
  width: 466px;
}

.input-with-select .el-input-group__prepend {
  background-color: rgb(0 129 255 / 100%) !important;
}

:deep(.el-input__wrapper) {
  padding: 1px 0 1px 11px;
}

.label {
  width: 90px;
  margin-right: 14px;
  text-align: right;
}

.small-gray {
  font-size: 14px;
  color: rgb(153 153 153 / 100%);

  &.mt-5 {
    margin: 5px 0 20px 100px;
  }

  &.m-20 {
    margin: 12px 0 20px 100px;
  }

  &.mt-20 {
    margin-top: -20px;
    margin-left: 100px;
  }
}

.blue {
  color: #0081ff;
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
}
</style>
