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
import { uploadFile } from '@/api/common'
import { FileUnit } from './helper'
import { withDefaults } from 'vue'
import { isEmpty } from 'lodash-es'

const props = withDefaults(
  defineProps<{
    modelValue: string
    drag?: boolean //  ==> 非必传（默认为 true）
    disabled?: boolean // 是否禁用上传组件 ==> 非必传（默认为 false）
    fileSize?: number // 图片大小限制 ==> 非必传（默认为 300kb 单位kb）
    fileType?: string // 图片类型限制 ==> 非必传（默认为 ["image/jpg", "image/png"]）
    height?: string // 组件高度 ==> 非必传（默认为 150px）
    width?: string // 组件宽度 ==> 非必传（默认为 150px）
    borderRadius?: string // 组件边框圆角 ==> 非必传（默认为 8px）
    uploadName?: string // 组件上传框里的提示文字 ==> 非必传（默认为 上传）
    fileUnit?: FileUnit // 文件大小单位
    resolution?: number[] // 图片分辨率，数字类型，如[400, 200], 第一个值宽，第二个值高
  }>(),
  {
    drag: true,
    disabled: false,
    fileType: '.jpg, .png',
    height: '80px',
    width: '80px',
    resolution: () => [],
    borderRadius: '4px',
    uploadName: '上传',
    fileUnit: FileUnit.MB
  }
)
const emit = defineEmits(['update:modelValue'])
const message = useMessage() // 消息弹窗
// 生成组件唯一id
const uuid = ref('id-' + generateUUID())
// 查看图片
const imgViewVisible = ref(false)
const fileTypeToArray = computed(() => props.fileType.trimAll().replaceAll('.', '').split(','))
// 文件大小单位转小写
const fileUnit = computed(() => props.fileUnit.toLowerCase())
const upload = ref()
const loading = ref(false)

const deleteFile = () => {
  emit('update:modelValue', '')
  upload.value.clearFiles()
}

const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  let imgSize = true,
    isResolution = true

  loading.value = true

  let fileExtension = ''
  if (rawFile.name.lastIndexOf('.') > -1) {
    fileExtension = rawFile.name.slice(rawFile.name.lastIndexOf('.') + 1)
  }

  // 是否格式正确
  const isTrueFormat = fileTypeToArray.value.some((type: string) => {
    if (rawFile.type.indexOf(type) > -1) return true
    return !!(fileExtension && fileExtension.indexOf(type) > -1)
  })

  if (!isTrueFormat) {
    message.error(`仅支持${fileTypeToArray.value.join('/')}格式`)
    loading.value = false
    return false
  }

  if (props.fileSize) {
    imgSize =
      (fileUnit.value === FileUnit.KB ? rawFile.size / 1024 : rawFile.size / 1024 / 1024) <
      props.fileSize
    if (!imgSize) {
      message.error(`图片不能超过 ${props.fileSize}${fileUnit.value}`)
      loading.value = false
      return false
    }
  }

  if (!isEmpty(props.resolution)) {
    // 是否图片分辨率正确
    isResolution = await checkImageResolution(rawFile)
    loading.value = false
    return isResolution
  }
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

// 判断图片分辨率
const checkImageResolution = (file): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const filereader = new FileReader()
    filereader.onload = (e) => {
      const src = e.target?.result as string
      const image = new Image()
      image.onload = function () {
        if (image.width !== props.resolution[0] || image.height !== props.resolution[1]) {
          message.error('请上传' + props.resolution[0] + 'px*' + props.resolution[1] + 'px的图片')
          resolve(false)
        } else {
          resolve(true)
        }
      }
      image.onerror = reject
      image.src = src
    }
    filereader.readAsDataURL(file)
  })
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
      border-radius: v-bind(borderRadius);
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
        border-radius: v-bind(borderRadius);

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
