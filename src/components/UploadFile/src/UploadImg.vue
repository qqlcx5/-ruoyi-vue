<template>
  <div class="upload-box">
    <el-upload
      ref="upload"
      action=""
      :id="uuid"
      :class="['upload', drag ? 'no-border' : '']"
      :multiple="false"
      :show-file-list="false"
      :drag="drag"
      :accept="fileType"
      :beforeUpload="beforeUpload"
      :http-request="uploadRequest"
    >
      <template v-if="modelValue">
        <img :src="modelValue" class="upload-image" />
        <div class="upload-handle" @click.stop>
          <!-- <div class="handle-icon" @click="editImg">
            <Icon icon="ep:edit" />
            <span>{{ t('action.edit') }}</span>
          </div> -->
          <div class="handle-icon" @click="imgViewVisible = true">
            <Icon icon="ep:zoom-in" />
            <!-- <span>{{ t('action.detail') }}</span> -->
          </div>
          <div class="handle-icon" @click="deleteFile">
            <Icon icon="ep:delete" />
            <!-- <span>{{ t('action.del') }}</span> -->
          </div>
        </div>
      </template>
      <template v-else>
        <div v-loading="loading" class="upload-empty">
          <slot name="empty">
            <Icon icon="ep:plus" :size="15" />
            <span>{{ uploadName }}</span>
          </slot>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
    <el-image-viewer
      v-if="imgViewVisible"
      @close="imgViewVisible = false"
      :url-list="[modelValue]"
    />
  </div>
</template>

<script setup lang="ts" name="UploadImg">
import type { UploadProps, UploadRequestOptions } from 'element-plus'
import { generateUUID } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import { uploadFile } from '@/api/common'

const props = defineProps({
  modelValue: propTypes.string.def(''),
  updateUrl: propTypes.string.def(import.meta.env.VITE_UPLOAD_URL),
  drag: propTypes.bool.def(true), // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled: propTypes.bool.def(false), // 是否禁用上传组件 ==> 非必传（默认为 false）
  fileSize: propTypes.number.def(300), // 图片大小限制 ==> 非必传（默认为 300kb 单位kb）
  fileType: propTypes.string.def('.jpg, .png'), // 图片类型限制 ==> 非必传（默认为 ["image/jpg", "image/png"]）
  height: propTypes.string.def('80px'), // 组件高度 ==> 非必传（默认为 150px）
  width: propTypes.string.def('80px'), // 组件宽度 ==> 非必传（默认为 150px）
  borderRadius: propTypes.string.def('4px'), // 组件边框圆角 ==> 非必传（默认为 8px）
  uploadName: propTypes.string.def('上传') // 组件上传框里的提示文字 ==> 非必传（默认为 上传）
})
const message = useMessage() // 消息弹窗
// 生成组件唯一id
const uuid = ref('id-' + generateUUID())
// 查看图片
const imgViewVisible = ref(false)

const fileTypeToArray = computed(() => props.fileType.trimAll().replaceAll('.', '').split(','))

const upload = ref()

const loading = ref(false)

const emit = defineEmits(['update:modelValue'])

const deleteFile = () => {
  emit('update:modelValue', '')
  upload.value.clearFiles()
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const imgSize = rawFile.size / 1024 < props.fileSize
  loading.value = true

  let fileExtension = ''
  if (rawFile.name.lastIndexOf('.') > -1) {
    fileExtension = rawFile.name.slice(rawFile.name.lastIndexOf('.') + 1)
  }

  const isTrueFormat = fileTypeToArray.value.some((type: string) => {
    if (rawFile.type.indexOf(type) > -1) return true
    return !!(fileExtension && fileExtension.indexOf(type) > -1)
  })

  if (!isTrueFormat)
    message.error(`仅支持${fileTypeToArray.value.join('/')}格式`), (loading.value = false)

  if (!imgSize) message.notifyWarning(`图片不能超过 ${props.fileSize}kb`), (loading.value = false)
  return isTrueFormat && imgSize
}

// 上传成功提示
const uploadSuccess = (res: any): void => {
  message.success('上传成功')
  emit('update:modelValue', res.data.store)
}

// 上传错误提示
const uploadError = () => {
  message.notifyError('上传失败')
  deleteFile()
}

// 自定义上传方法
const uploadRequest = async (options: UploadRequestOptions) => {
  const { file } = options
  try {
    const res = await uploadFile({ file })
    if (res) {
      uploadSuccess(res)
      loading.value = false
    }
  } catch (err) {
    uploadError()
    loading.value = false
  }
}
</script>
<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;

    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderradius);
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);

        .upload-handle {
          opacity: 1;
        }
      }

      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: #f8f8f8;
        border: 1px dashed var(--el-border-color-darker);
        border-radius: v-bind(borderradius);

        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }

      .el-upload__input {
        display: none !important;
      }

      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }

      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);

        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }

      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        box-sizing: border-box;
        transition: var(--el-transition-duration-fast);
        align-items: center;
        justify-content: center;

        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;

          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }

          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }

  .el-upload__tip {
    width: 380px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: $tip-color;
    text-align: left;
  }
}
</style>
