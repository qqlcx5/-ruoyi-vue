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
      <template #header> 2、配置聊天工具栏部署应用 </template>
      <el-form label-position="right" label-width="100px">
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
        <div class="sub-title">应用OAuth2.0网页授权功能的回调域名</div>
        <el-form-item label="可信域名">
          <el-input>
            <template #suffix>
              <XButton title="复制" type="primary" @click="onCopy()" />
            </template>
          </el-input>
        </el-form-item>
        <div class="small-gray mt-8">
          <div
            >应用管理 > 自建应用 > 选择配置应用 > 网页授权及JS-SDK
            <XTextButton title="去配置" />
          </div>
        </div>
        <div class="sub-title">调用JS-SDK、跳转小程序的可信域名</div>
        <el-form-item label="可信域名">
          <el-input>
            <template #suffix>
              <XButton title="复制" type="primary" @click="onCopy()" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="可信域名">
          <el-input>
            <template #suffix>
              <XButton title="复制" type="primary" @click="onCopy()" />
            </template>
          </el-input>
        </el-form-item>
        <div class="small-gray mt-8">
          <div
            >应用管理 > 自建应用 > 选择配置应用 > 网页授权及JS-SDK
            <XTextButton title="去配置" />
          </div>
        </div>

        <el-form-item label="上传校验文件">
          <template v-if="hasUploadFile">
            <upload-file
              v-model="fileList"
              title="上传校验文件"
              file-type=".txt"
              :isShowTip="false"
              :limit="1"
              :fileSize="100"
              file-unit="KB"
            />
            <XTextButton title="查看图示" type="primary" @click="lookExample" />
            <preview-dialog
              v-model="showExampleDialog"
              title="设置可信域名"
              url="v2/wclpro/dev/files/2023/07/04/5482b7bdc50f4a7bbdf449e330483da7.txt"
            />
          </template>
          <template v-else>
            <span class="file-name">专营店硬件验收评级告知函.pdf</span>
            <XTextButton title="下载" type="primary" />
            <XTextButton title="删除" type="danger" @click="delVerifyFile" />
          </template>
        </el-form-item>
        <div class="small-gray mt-8">
          <div
            >请上传txt格式的校验文件，用于可信域名配置校验
            <XTextButton title="去获取" />
          </div>
        </div>
      </el-form>
    </el-card>
    <el-card class="box-card-three">
      <template #header> 3、聊天工具栏地址 </template>
      <el-form label-position="right" label-width="100px">
        <el-form-item label="客户详情页">
          <el-input>
            <template #suffix>
              <XButton title="复制" type="primary" @click="onCopy()" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="客户跟进">
          <el-input>
            <template #suffix>
              <XButton title="复制" type="primary" @click="onCopy()" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="内容引擎">
          <el-input>
            <template #suffix>
              <XButton title="复制" type="primary" @click="onCopy()" />
            </template>
          </el-input>
        </el-form-item>
        <div class="small-gray mt-8">
          <div
            >客户与上下游 > 聊天工具 > 聊天工具栏管理 > 配置应用页面 > 选择上方配置应用 > 配置页面 >
            填写页面名称、自定义填入工具栏地址
            <XTextButton title="去配置" />
          </div>
        </div>
      </el-form>
    </el-card>
    <app-config v-model="showDialog" />
    <confirm-del v-model="showConfirmDel" />
  </template>
</template>

<script setup lang="ts" name="chatToolbar">
// import type { FormRules, FormInstance } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import AppConfig from '../chatArchiveConfig/components/appConfigDialog.vue'
import ConfirmDel from './components/confirmDel.vue'
import UploadFile from '@/components/UploadFile/src/UploadFile.vue'

const { toClipboard } = useClipboard()
const message = useMessage()
const fileList = ref<Recordable[]>([])
// const form = ref<FormInstance>()
// const rules = ref<FormRules>()

const onCopy = async (val = '') => {
  try {
    await toClipboard(val)
    message.success('复制成功')
  } catch (e) {
    message.error('复制失败')
  }
}
const router = useRouter()
const hasConfig = ref<boolean>(true)
const goConfigWecom = () => {
  router.push('/we-com-deployment/weComConfig')
}

const hasSelectApp = ref<boolean>(true)
const showDialog = ref<boolean>(false)
const goConfigApp = () => {
  showDialog.value = true
}
const showExampleDialog = ref<boolean>(false)
const lookExample = () => {
  showExampleDialog.value = true
}

const hasUploadFile = ref<boolean>(true)
const showConfirmDel = ref<boolean>(false)
const delVerifyFile = () => {
  showConfirmDel.value = true
}
</script>

<style lang="scss" scoped>
:deep(.el-card__header) {
  font-weight: bold;
}

.el-input {
  width: 466px;
}

:deep(.el-input__wrapper) {
  padding: 1px 0 1px 11px;
}

.small-gray {
  font-size: 14px;
  color: rgb(153 153 153 / 100%);

  &.mt-8 {
    margin: -10px 0 20px 100px;
  }
}

.sub-title {
  margin-bottom: 15px;
  font-weight: bold;
}

.label {
  width: 90px;
  margin-right: 14px;
  text-align: right;
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

:deep(.upload-file) {
  width: 200px;
}
</style>
