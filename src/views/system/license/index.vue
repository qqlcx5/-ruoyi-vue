<template>
  <div class="flex">
    <el-form
      :model="uploadData"
      :rules="UploadRules"
      label-position="top"
      label-width="120px"
      size="large"
      ref="formUpload"
    >
      <el-row style="maring-left: -10px; maring-right: -10px" :gutter="12">
        <el-col>
          <el-form-item prop="subject" label="服务名">
            <el-input v-model="uploadData.subject" placeholder="请输入服务名" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="validCode" label="校验码">
            <el-input v-model="uploadData.validCode" placeholder="请输入校验码" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="file" label="证书文件">
            <el-upload
              ref="uploadRef"
              :action="updateUrl + '?updateSupport=' + updateSupport"
              :headers="uploadHeaders"
              :drag="true"
              v-model:file-list="fileList"
              :limit="1"
              :multiple="false"
              :show-file-list="true"
              :disabled="uploadDisabled"
              :before-upload="beforeUpload"
              :on-exceed="handleExceed"
              :on-success="handleFileSuccess"
              :on-error="handleUploadError"
              :auto-upload="false"
              accept=".lic"
            >
              <Icon icon="ep:upload-filled" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <template #tip>
                <div class="el-upload__tip">请上传 .lic 标准格式文件</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col>
          <el-button type="primary" @click="submitForm">上传证书</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="License">
import * as LicenseApi from '@/api/system/license'
import { ElMessageBox, FormInstance, UploadInstance, UploadRawFile } from 'element-plus'

const formUpload = ref<FormInstance>()
const message = useMessage() // 消息弹窗
const uploadRef = ref<UploadInstance>()

const UploadRules = {
  file: [required],
  subject: [required],
  validCode: [required]
}

const fileList = ref([])
const uploadData = ref({
  file: null,
  subject: '',
  validCode: ''
})

const uploadHeaders = ref()
const updateSupport = ref(0)
const uploadDisabled = ref(false)
let updateUrl = import.meta.env.VITE_UPLOAD_URL
const submitForm = async () => {
  uploadData.value.file = fileList.value[0]['raw']
  // 参数校验
  const elForm = unref(formUpload)
  if (!elForm) return
  const valid = await elForm.validate()
  if (!valid) return
  ElMessageBox.confirm('确认上传证书？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await LicenseApi.uploadLicenseFile(uploadData.value)
      message.success('上传成功')
      formUpload.value?.resetFields()
      uploadRef.value?.clearFiles()
    })
    .catch(() => {})
}

// 文件上传之前判断
const beforeUpload = (file: UploadRawFile) => {
  // const isImg = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
  // const isLt5M = file.size / 1024 / 1024 < 5
  // if (!isImg) message.error('上传文件只能是 jpeg / gif / png 格式!')
  // if (!isLt5M) message.error('上传文件大小不能超过 5MB!')
  console.log(file)
  return
}
// 文件上传成功
const handleFileSuccess = async (response: any): Promise<void> => {
  console.log(response)
  if (response.code !== 0) {
    message.error(response.msg)
    return
  }
  message.success('上传成功')
  uploadDisabled.value = false
}
// 文件数超出提示
const handleExceed = (): void => {
  message.error('最多只能上传一个文件！')
}

const handleUploadError = (): void => {
  message.error('导入证书，请重新上传！')
}
</script>
