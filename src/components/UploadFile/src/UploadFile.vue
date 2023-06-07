<template>
  <div class="upload-file">
    <el-upload
      ref="uploadRef"
      :multiple="props.limit > 1"
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
    <preview-dialog v-model="showDialog" title="通知函" />
  </div>
</template>
<script setup lang="ts" name="UploadFile">
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import type {
  UploadInstance,
  UploadUserFile,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions
} from 'element-plus'
import { uploadFile } from '@/api/common'

const props = defineProps({
  modelValue: {
    type: Array as PropType<UploadUserFile[]>,
    required: true
  },
  title: propTypes.string.def('文件上传'),
  updateUrl: propTypes.string.def(import.meta.env.VITE_UPLOAD_URL),
  fileType: propTypes.string.def('.doc, .docx, .pdf, .jpg'), // 文件类型
  fileSize: propTypes.number.def(5), // 大小限制(MB)
  limit: propTypes.number.def(5), // 数量限制
  autoUpload: propTypes.bool.def(true), // 自动上传
  drag: propTypes.bool.def(false), // 拖拽上传
  isShowTip: propTypes.bool.def(true) // 是否显示提示
})

const showDialog = ref(false)
const message = useMessage() // 消息弹窗
const loading = ref(false)
const emit = defineEmits(['update:modelValue'])
const fileTypeToArray = computed(() => props.fileType.trimAll().replaceAll('.', '').split(','))
// ========== 上传相关 ==========
const uploadRef = ref<UploadInstance>()
const uploadList = ref<UploadUserFile[]>([])
const fileList = ref<UploadUserFile[]>(props.modelValue)
const uploadNumber = ref<number>(0)
// 文件上传之前判断
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  if (fileList.value.length >= props.limit) {
    message.error(`上传文件数量不能超过${props.limit}个!`)
    return false
  }

  let fileExtension = ''
  if (file.name.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
  }

  const isTrueFormat = fileTypeToArray.value.some((type: string) => {
    if (file.type.indexOf(type) > -1) return true
    return !!(fileExtension && fileExtension.indexOf(type) > -1)
  })
  const isLimit = file.size < props.fileSize * 1024 * 1024
  if (!isTrueFormat) {
    message.error(`文件格式不正确, 请上传${fileTypeToArray.value.join('/')}格式!`)
    return false
  }
  if (!isLimit) {
    message.error(`上传文件大小不能超过${props.fileSize}MB!`)
    return false
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
// 添加查看文件
const handlePreview: UploadProps['onPreview'] = () => {
  //TODO: 添加预览功能
  showDialog.value = !showDialog.value
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
