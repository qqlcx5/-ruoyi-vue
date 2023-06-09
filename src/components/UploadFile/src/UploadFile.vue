<template>
  <div class="upload-file">
    <el-upload
      ref="uploadRef"
      multiple
      v-model:file-list="fileList"
      :show-file-list="true"
      :auto-upload="autoUpload"
      :limit="props.limit"
      :drag="drag"
      :accept="fileType"
      :before-upload="beforeUpload"
      :http-request="uploadRequest"
      :on-exceed="handleExceed"
      :on-error="excelUploadError"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      class="upload-file-uploader"
    >
      <el-button><Icon icon="ep:upload" class="mr-1" />上传文件</el-button>
      <template v-if="isShowTip" #tip>
        <div class="tips">
          <slot>支持扩展名：{{ fileType.split(',').join(' ') }}</slot>
        </div>
      </template>
    </el-upload>
    <preview-dialog v-model="showDialog" :title="previewTitle" :url="previewUrl" />
  </div>
</template>
<script setup lang="ts" name="UploadFile">
import { withDefaults } from 'vue'
import type {
  UploadInstance,
  UploadUserFile,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions
} from 'element-plus'
import { uploadFile } from '@/api/common'
import { FileUnit } from './helper'

const props = withDefaults(
  defineProps<{
    modelValue: UploadUserFile[]
    title?: string
    fileType?: string // 文件类型
    fileSize?: number // 大小限制(MB)
    limit?: number // 数量限制
    autoUpload?: boolean // 自动上传
    drag?: boolean // 拖拽上传
    isShowTip?: boolean // 是否显示提示
    fileUnit?: FileUnit // 文件大小单位
    preivew?: boolean // 是否支持点击预览
  }>(),
  {
    title: '文件上传',
    fileType: '.doc, .docx, .pdf, .jpg',
    autoUpload: true,
    drag: false,
    isShowTip: true,
    fileUnit: FileUnit.MB,
    preivew: true
  }
)

const showDialog = ref(false)
const message = useMessage() // 消息弹窗
const loading = ref(false)
const emit = defineEmits(['update:modelValue'])
const fileTypeToArray = computed(() => props.fileType.trimAll().replaceAll('.', '').split(','))
// 文件大小单位转小写
const fileUnit = computed(() => props.fileUnit.toLowerCase())

// ========== 上传相关 ==========
const uploadRef = ref<UploadInstance>()
const uploadList = ref<UploadUserFile[]>([])
const fileList = ref<UploadUserFile[]>(props.modelValue)
const uploadNumber = ref<number>(0)
// 文件上传之前判断
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  let fileExtension = ''
  if (file.name.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
  }

  const isTrueFormat = fileTypeToArray.value.some((type: string) => {
    if (file.type.indexOf(type) > -1) return true
    return !!(fileExtension && fileExtension.indexOf(type) > -1)
  })

  if (props.limit) {
    if (fileList.value.length >= props.limit) {
      message.error(`上传文件数量不能超过${props.limit}个!`)
      return false
    }
  }

  if (!isTrueFormat) {
    message.error(`文件格式不正确, 请上传${fileTypeToArray.value.join('/')}格式!`)
    return false
  }
  if (props.fileSize) {
    const isLimit =
      (fileUnit.value === FileUnit.KB ? file.size / 1024 : file.size / 1024 / 1024) < props.fileSize
    if (!isLimit) {
      message.error(`上传文件大小不能超过${props.fileSize}${fileUnit}!`)
      return false
    }
  }
  uploadNumber.value++
}

// 文件上传成功
const handleFileSuccess = (res: any) => {
  message.success('上传成功')
  fileList.value.pop()
  uploadList.value.push({ name: res.data.originalName, url: res.data.store })
  if (uploadList.value.length == uploadNumber.value) {
    fileList.value = fileList.value.concat(uploadList.value)
    uploadList.value = []
    uploadNumber.value = 0
    emit('update:modelValue', fileList.value)
  }
}
// 文件数超出提示
const handleExceed: UploadProps['onExceed'] = (): void => {
  message.error(`上传文件数量不能超过${props.limit}个!`)
}
// 上传错误提示
const excelUploadError = () => {
  message.error('上传失败')
}
// 删除上传文件
const handleRemove = () => {
  emit('update:modelValue', fileList.value)
}
// 预览文件
const previewUrl = ref('')
const previewTitle = ref('')
const handlePreview: UploadProps['onPreview'] = (file: any) => {
  if (!props.preivew) return
  previewUrl.value = file.url
  previewTitle.value = file.name
  showDialog.value = true
}

// 自定义上传方法
const uploadRequest = async (options: UploadRequestOptions) => {
  const { file } = options
  try {
    const res = await uploadFile({ file })
    if (res) {
      handleFileSuccess(res)
      loading.value = false
    }
  } catch (err) {
    excelUploadError()
    loading.value = false
  }
}
</script>
<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}

.tips {
  margin-top: 8px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: $tip-color;
  text-align: left;
}

:deep(.upload-file-list .el-upload-list__item) {
  position: relative;
  margin-bottom: 10px;
  line-height: 2;
  border: 1px solid #e4e7ed;
}

:deep(.el-upload-list__item-file-name) {
  max-width: 250px;
}

:deep(.upload-file-list .ele-upload-list__item-content) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

:deep(.ele-upload-list__item-content-action .el-link) {
  margin-right: 10px;
}
</style>
