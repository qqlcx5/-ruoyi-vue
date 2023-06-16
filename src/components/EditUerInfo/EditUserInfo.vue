<template>
  <a-modal
    v-model:visible="state.isShow"
    title="系统名称修改"
    @ok="handleOk"
    @cancel="handleEditCancel"
    :confirm-loading="state.loading"
  >
    <a-form
      :model="formState"
      ref="formRef"
      v-bind="layout"
      :label-col="{ style: { width: '130px' } }"
      autocomplete="off"
    >
      <a-form-item
        :label="`系统名称`"
        name="name"
        :rules="[{ required: true, message: `系统名称不能为空` }]"
      >
        <a-input
          v-model:value="formState.name"
          show-count
          :maxlength="20"
          placeholder="请输入系统名称"
        />
      </a-form-item>

      <a-form-item label="系统logo" name="logoUrl">
        <div style="height: 131px">
          <UploadImg
            v-model:modelValue="state.logoUrlSuccess"
            fileSize="300"
            :fileUnit="FileUnit.KB"
            :resolution="[400, 400]"
          />
          <!--          <a-upload-->
          <!--            v-model:file-list="state.logoListUrl"-->
          <!--            :action="updateUrl + '?updateSupport=' + updateSupport"-->
          <!--            list-type="picture-card"-->
          <!--            @preview="handlePreview"-->
          <!--            accept=".jpg, .png, .gif"-->
          <!--            class="avatar-uploader"-->
          <!--            :show-upload-list="true"-->
          <!--            :headers="uploadHeaders"-->
          <!--            :before-upload="(file, fileList) => beforeUpload(file, fileList, 'logo')"-->
          <!--            @change="-->
          <!--              (file, fileList) => {-->
          <!--                handleChange(file, fileList, 'logo')-->
          <!--              }-->
          <!--            "-->
          <!--            @remove="-->
          <!--              (file) => {-->
          <!--                removeImg(file, 'logo')-->
          <!--              }-->
          <!--            "-->
          <!--          >-->
          <!--            <div v-if="state.logoListUrl.length < 1">-->
          <!--              <Icon icon="svg-icon:add-upload" :size="15" />-->
          <!--              <div style="margin-top: 8px">上传logo</div>-->
          <!--            </div>-->
          <!--          </a-upload>-->
          <div class="upload-text"> 支持jpg/png格式，尺寸400px * 400px，不超过300k </div>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>

  <!--  上传图片预览  -->
  <a-modal
    :visible="previewVisible"
    destroyOnClose
    :title="previewTitle"
    :footer="null"
    @cancel="handleCancel"
    :bodyStyle="{
      width: `100%`,
      height: `100%`,
      margin: '0',
      padding: '0',
      overflow: 'auto'
    }"
  >
    <img alt="example" style="width: 100%; height: 100%" :src="previewImage" />
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { getAccessToken, getTenantId } from '@/utils/auth'
import { message, Upload, UploadChangeParam, UploadProps } from 'ant-design-vue'
import { putUserNameLogo } from '@/api/system/business'
import { useAppStore } from '@/store/modules/app'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
// import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import UploadImg from '@/components/UploadFile/src/UploadImg.vue'
import { FileUnit } from '@/components/UploadFile/src/helper'
const appStore = useAppStore()
const { wsCache } = useCache()

const state = reactive({
  loading: false,
  isShow: true,
  logoListUrl: [], //系统logo 上传 回显 - -
  logoUrlSuccess: '' //系统logo 新增编辑入参
})

const formState = reactive({
  name: '',
  logoUrl: ''
})
console.log('editUserInfo -----')

let userInfo = wsCache.get(CACHE_KEY.USER)
formState.name = userInfo?.tenant?.systemName || '万国投资管理系统'

if (userInfo?.tenant?.logoUrl) {
  state.logoListUrl = [
    {
      url: userInfo?.tenant?.logoUrl //系统logo
    }
  ]
  state.logoUrlSuccess = userInfo?.tenant?.logoUrl
}

const formRef = ref()
let updateUrl = import.meta.env.VITE_UPLOAD_URL
let regVersion = import.meta.env.VITE_REG_VERSION
const updateSupport = ref(0)
const loading = ref<boolean>(false)
const imageUrl = ref<string>('')
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const uploadHeaders = ref({
  Authorization: 'Bearer ' + getAccessToken(),
  'tenant-id': getTenantId(),
  'Reg-Version': regVersion
})

const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')

//判断上传图片的宽高
const checkImageWH = (file, width, height) => {
  return new Promise((resolve, reject) => {
    let filereader = new FileReader()
    let isTrue = false
    filereader.onload = (e) => {
      let src = e.target.result
      const image = new Image()
      image.onload = function () {
        if (width && this.width != width) {
          // message.error('请上传宽小于' + width + 'px的图片')
          message.error('请上传' + width + 'px*' + height + 'px的图片')
          resolve(false)
          // reject(false)
        } else if (height && this.height != height) {
          // message.error('请上传高小于' + height + 'px的图片')
          message.error('请上传' + width + 'px*' + height + 'px的图片')
          resolve(false)
          // reject(false)
        } else {
          resolve(true)
          // resolve(true)
        }
      }
      image.onerror = reject
      image.src = src
    }
    filereader.readAsDataURL(file)
  })
}

//上传图片转base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

//上传图片预览
const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}

//上传的 预览 关闭modal
const handleCancel = () => {
  previewVisible.value = false
  previewTitle.value = ''
}

//上传前
const beforeUpload = async (file: UploadProps['beforeUpload'][number], fileList, type) => {
  if (type === 'environment') {
    //环境图片
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
    if (!isJpgOrPng) {
      message.error('仅支持jpg/jpeg/png/gif格式')
      return Upload.LIST_IGNORE
    }
  } else {
    //其他图片上传
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('仅支持jpg/png格式')
      return Upload.LIST_IGNORE
    }
  }
  //是否放行  - - 图片 宽高 满足 则放行
  let isTrue = true
  switch (type) {
    case 'logo':
      isTrue = await checkImageWH(file, 400, 400)
      if (!isTrue) {
        //不上传 包括前端不显示
        return Upload.LIST_IGNORE
      }

      const isLt30kb = file.size / 1024 / 1024 < 0.3
      //max 300kb
      if (!isLt30kb) {
        message.error('图片不能超过300kb')
        return Upload.LIST_IGNORE
      }
      break
    case 'environment':
      isTrue = await checkImageWH(file, 1125, 633)
      if (!isTrue) {
        //不上传 包括前端不显示
        return Upload.LIST_IGNORE
      }

      const isLt5M = file.size / 1024 / 1024 < 5
      //max 5M
      if (!isLt5M) {
        message.error('图片不能超过5M')
        return Upload.LIST_IGNORE
      }
      break
  }

  // const isLt2M = file.size / 1024 / 1024 < 2
  // if (!isLt2M) {
  //   message.error('Image must smaller than 2MB!')
  // }
  // return isJpgOrPng && isLt30kb
}

//上传 change
const handleChange = (info: UploadChangeParam, fileList, type) => {
  if (info.file.status === 'uploading') {
    loading.value = true
    return
  }
  if (info.file.status === 'done') {
    switch (type) {
      case 'logo':
        if (!info?.file.response?.data) {
          message.error(info?.file.response?.msg)
          state.logoListUrl = []
          return
        }
        state.logoUrlSuccess = info?.file.response?.data?.store || ''
        console.log('state.logoUrlSuccess', state.logoUrlSuccess)
        console.log('state.logoListUrl', state.logoListUrl)
        break
      case 'legalPerson':
        if (!info?.file.response?.data) {
          message.error(info?.file.response?.msg)
          state.legalPersonListUrl = []
          return
        }
        state.legalPersonUrlSuccess = info?.file.response?.data?.store || ''
        break
      case 'businessLicense':
        if (!info?.file.response?.data) {
          message.error(info?.file.response?.msg)
          state.businessLicenseListUrl = []
          return
        }
        state.businessLicenseSuccess = info?.file.response?.data?.store || ''
        break
      case 'environment':
        if (!info?.file.response?.data) {
          message.error(info?.file.response?.msg)
          state.environmentUrl = []
          return
        }
        state.environmentSuccess = info?.file.response?.data?.store || ''
        break
    }

    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (base64Url: string) => {
      imageUrl.value = base64Url
      loading.value = false
    })
    message.success('上传成功')
  }
  if (info.file.status === 'error') {
    state.logoListUrl = []
    loading.value = false
    message.error('上传失败')
  }
}

//删除上传的图片 回调  - -
const removeImg = (file, type) => {
  switch (type) {
    case 'logo':
      //系统logo
      state.logoListUrl = [] //系统logo 上传 回显 - -
      state.logoUrlSuccess = '' //系统logo 新增编辑入参
      break
    case 'legalPerson':
      //法人身份证
      state.legalPersonListUrl = [] //法人身份证 上传回显
      state.legalPersonUrlSuccess = '' //法人身份证 新增编辑入参
      break
    case 'businessLicense':
      //营业执照
      state.businessLicenseListUrl = [] //营业执照 上传回显
      state.businessLicenseSuccess = '' //营业执照 新增编辑入参
      break
    case 'environment':
      //环境图片
      state.environmentUrl = [] //环境图片 上传回显
      state.environmentSuccess = '' //环境图片 新增编辑入参
      break
  }
}

const handleEditCancel = () => {
  appStore.setIsShowEditUserInfo(!appStore.getIsShowEditUserInfo)
  // state.isShow = false
  formState.name = ''
  state.logoUrlSuccess = ''
  state.logoListUrl = []
}

const handleOk = async () => {
  // 校验表单
  if (!formRef) return
  await formRef.value.validate()
  console.log('formState', formState)
  console.log('logoUrlSuccess', state.logoUrlSuccess)
  state.loading = true
  const params = {
    systemName: formState.name,
    logoUrl: state.logoUrlSuccess
  }
  try {
    await putUserNameLogo(params)
    let userInfo = wsCache.get(CACHE_KEY.USER)
    userInfo.tenant.logoUrl = state.logoUrlSuccess
    userInfo.tenant.systemName = formState.name
    console.log('userInfo!!!!', userInfo)
    wsCache.set(CACHE_KEY.USER, userInfo)
    message.success('修改成功')
    handleEditCancel()
  } finally {
    state.loading = false
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100px;
  height: 100px;
  background: skyblue;
}
.upload-text {
  color: rgba(153, 153, 153, 1);
  font-size: 12px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
</style>
