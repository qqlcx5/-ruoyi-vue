<template>
  <el-form
    :model="loginData.loginForm"
    :rules="LoginRules"
    label-position="top"
    class="login-form w-full"
    label-width="120px"
    size="large"
    ref="formLogin"
  >
    <el-row class="flex flex-col justify-center px-56px">
      <div class="mt-70px">
        <img src="@/assets/imgs/company.png" alt="" class="m-auto" />
      </div>
      <div class="flex justify-between items-center mb-22px mt-70px">
        <div class="text-20px font-bold form-title">{{ LoginFormTitle }}</div>
        <div class="qrcode-box flex items-center">
          <div
            v-show="getShow"
            class="qrcode-tip relative flex items-center h-30px text-12px px-8px rounded-2px"
          >
            <i class="iconfont icon-anquan mr-4px !text-14px"></i>
            扫码登录更安全
          </div>
          <img
            :src="getShow ? qrCodeImage : formImage"
            alt="qrcode"
            class="w-50px inline-block cursor-pointer"
            @click="
              setLoginState(
                getLoginState === LoginStateEnum.QR_CODE
                  ? LoginStateEnum.LOGIN
                  : LoginStateEnum.QR_CODE
              )
            "
          />
        </div>
      </div>
      <div v-show="getShow">
        <el-col :span="24">
          <el-form-item prop="username">
            <el-input
              v-model="loginData.loginForm.username"
              :placeholder="t('login.usernamePlaceholder')"
            >
              <template #prefix>
                <i class="iconfont icon-zhanghu !text-18px"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="password">
            <el-input
              v-model="loginData.loginForm.password"
              type="password"
              :placeholder="t('login.passwordPlaceholder')"
              show-password
              @keyup.enter="getCode()"
            >
              <template #prefix>
                <i class="iconfont icon-mima !text-18px"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="24">-->
        <!--          <el-form-item prop="tenantName">-->
        <!--            <el-input-->
        <!--              type="text"-->
        <!--              v-model="loginData.loginForm.tenantName"-->
        <!--              :placeholder="t('login.tenantNamePlaceholder')"-->
        <!--            >-->
        <!--              <template #prefix>-->
        <!--                <i class="iconfont icon-gongsi !text-18px"></i>-->
        <!--              </template>-->
        <!--            </el-input>-->
        <!--            &lt;!&ndash;            <el-select v-model="loginData.loginForm.tenantName" placeholder="请选择" class="w-full">&ndash;&gt;-->
        <!--            &lt;!&ndash;              <template #prefix>&ndash;&gt;-->
        <!--            &lt;!&ndash;                <i class="iconfont icon-gongsi !text-18px"></i>&ndash;&gt;-->
        <!--            &lt;!&ndash;              </template>&ndash;&gt;-->
        <!--            &lt;!&ndash;              <el-option&ndash;&gt;-->
        <!--            &lt;!&ndash;                :label="loginData.loginForm.tenantName"&ndash;&gt;-->
        <!--            &lt;!&ndash;                :value="loginData.loginForm.tenantName"&ndash;&gt;-->
        <!--            &lt;!&ndash;              />&ndash;&gt;-->
        <!--            &lt;!&ndash;            </el-select>&ndash;&gt;-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="24">
          <el-form-item>
            <el-row justify="space-between">
              <el-col :span="6">
                <el-checkbox v-model="loginData.loginForm.rememberMe">
                  {{ t('login.remember') }}
                </el-checkbox>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="text-center">
          <el-form-item>
            <XButton
              :loading="loginLoading"
              type="primary"
              class="w-[100%]"
              :title="t('login.login')"
              @click="getCode()"
            />
          </el-form-item>
          <el-link type="primary">{{ t('login.forgetPassword') }}</el-link>
        </el-col>
      </div>
      <div>
        <!-- 二维码登录 -->
        <NewQrCodeForm />
      </div>
      <Verify
        ref="verify"
        mode="pop"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        @success="getTenantByUser"
      />
    </el-row>
  </el-form>
  <SwitchTenant ref="switchTenantRef" @confirm="onSwitchBodyConfirm" />
</template>
<script setup lang="ts">
import { ElLoading } from 'element-plus'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { NewQrCodeForm } from './index'

import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, LoginStateMap, useLoginState, useFormValid } from './useLogin'
import SwitchTenant from '@/layout/components/SwitchTenant/index.vue'

import qrCodeImage from '@/assets/imgs/login-qrcode.png'
import formImage from '@/assets/imgs/login-form.png'

const message = useMessage()
const { t } = useI18n()
const formLogin = ref()
const { validForm } = useFormValid(formLogin)
const { setLoginState, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)
const LoginFormTitle = computed(() => LoginStateMap[unref(getLoginState)])

const LoginRules = {
  // tenantName: [required],
  username: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    tenantName: '万车利源码',
    username: 'admin',
    password: 'admin123',
    captchaVerification: '',
    rememberMe: false
  }
})

// const socialList = [
//   { icon: 'ant-design:github-filled', type: 0 },
//   { icon: 'ant-design:wechat-filled', type: 30 },
//   { icon: 'ant-design:alipay-circle-filled', type: 0 },
//   { icon: 'ant-design:dingtalk-circle-filled', type: 20 }
// ]

// 获取验证码
const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (loginData.captchaEnable === 'false') {
    await handleLogin()
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}
// //获取租户ID
// const getTenantId = async () => {
//   if (loginData.tenantEnable === 'true') {
//     const res = await LoginApi.getTenantIdByNameApi(loginData.loginForm.tenantName)
//     authUtil.setTenantId(res)
//   }
// }
// 记住我
const getCookie = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe ? true : false,
      tenantName: loginForm.tenantName ? loginForm.tenantName : loginData.loginForm.tenantName
    }
  }
}

// 登录前请求是否有多主体可选
const switchTenantRef = ref()
const getTenantByUser = async (data) => {
  loginLoading.value = true
  loginData.loginForm.captchaVerification = data.captchaVerification
  const params = {
    captchaVerification: loginData.loginForm.captchaVerification,
    username: loginData.loginForm.username,
    password: loginData.loginForm.password
  }
  await LoginApi.getTenantUser(params)
    .then(async (res) => {
      if (!res) return message.error('登录失败，账号密码不正确')
      let tenantList: any[] = []
      res.forEach((tenant) => {
        tenantList = [...tenantList, ...tenant.tenantInfos]
      })
      if (tenantList.length === 0) {
        message.error('没有主体可以进入系统')
      } else if (tenantList.length === 1) {
        // 直接进入系统
        authUtil.setTenantId(tenantList[0].tenantId)
        await handleLogin(tenantList[0])
      } else {
        // 多主体选择登录的主体
        const defaultTenant = tenantList.find((t) => t.isDefaultLogin)
        if (defaultTenant) {
          authUtil.setTenantId(defaultTenant.tenantId)
          await handleLogin(defaultTenant)
        } else {
          switchTenantRef.value.openDialog(tenantList, '', loginData.loginForm)
        }
      }
    })
    .finally(() => {
      loginLoading.value = false
    })
}

// 选择主体完确定
const onSwitchBodyConfirm = (data) => {
  authUtil.setTenantId(data)
  handleLogin()
}

// 登录
const handleLogin = async (tenantData?) => {
  loginLoading.value = true
  try {
    authUtil.setTenantData(tenantData)
    // await getTenantId()
    const data = await validForm()
    if (!data) {
      return
    }
    const res = await LoginApi.loginApi(loginData.loginForm)
    if (!res) {
      return
    }
    ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (loginData.loginForm.rememberMe) {
      authUtil.setLoginForm(loginData.loginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    if (!redirect.value) {
      redirect.value = '/'
    }
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  } catch {
    loginLoading.value = false
  } finally {
    setTimeout(() => {
      const loadingInstance = ElLoading.service()
      loadingInstance.close()
    }, 400)
  }
}

// 社交登录
// const doSocialLogin = async (type: number) => {
//   if (type === 0) {
//     message.error('此方式未配置')
//   } else {
//     loginLoading.value = true
//     if (loginData.tenantEnable === 'true') {
//       await message.prompt('请输入租户名称', t('common.reminder')).then(async ({ value }) => {
//         const res = await LoginApi.getTenantIdByNameApi(value)
//         authUtil.setTenantId(res)
//       })
//     }
//     // 计算 redirectUri
//     const redirectUri =
//       location.origin + '/social-login?type=' + type + '&redirect=' + (redirect.value || '/')
//     // 进行跳转
//     const res = await LoginApi.socialAuthRedirectApi(type, encodeURIComponent(redirectUri))
//     window.location.href = res
//   }
// }
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {
  getCookie()
})
</script>

<style lang="scss" scoped>
.form-title,
.qrcode-box i {
  color: var(--el-color-primary);
}
.qrcode-box {
  div {
    color: var(--el-color-primary);
    background-color: #e8f2ff;
  }
  .qrcode-tip::after {
    content: '';
    position: absolute;
    right: -4px;
    top: 50%;
    width: 10px;
    height: 10px;
    background-color: #e8f2ff;
    transform: translateY(-50%) rotate(45deg);
  }
}
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
.login-code {
  width: 100%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    width: 100%;
    max-width: 100px;
    height: auto;
    vertical-align: middle;
  }
}
</style>
