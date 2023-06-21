<template>
  <el-form
    :model="loginData.loginForm"
    :rules="LoginRules"
    :validate-on-rule-change="false"
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
        <div class="text-20px font-bold form-title !leading-50px">{{
          getLoginState !== LoginStateEnum.QR_CODE ? LoginFormTitle : ''
        }}</div>
        <div
          v-show="
            [LoginStateEnum.LOGIN, LoginStateEnum.MOBILE, LoginStateEnum.QR_CODE].includes(
              getLoginState
            )
          "
          class="qrcode-box flex items-center"
        >
          <div class="qrcode-tip relative flex items-center h-30px text-12px px-8px rounded-2px">
            <i class="iconfont icon-anquan mr-4px !text-14px"></i>
            扫码登录更安全
          </div>
          <img
            :src="getLoginState === LoginStateEnum.QR_CODE ? formImage : qrCodeImage"
            alt="qrcode"
            class="w-50px inline-block cursor-pointer"
            @click="
              switchLoginWay(
                getLoginState === LoginStateEnum.LOGIN
                  ? LoginStateEnum.QR_CODE
                  : LoginStateEnum.LOGIN
              )
            "
          />
        </div>
      </div>
      <!--      密码登录-->
      <div v-show="getLoginState === LoginStateEnum.LOGIN">
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
              minlength="8"
              @keyup.enter="getCode()"
            >
              <template #prefix>
                <i class="iconfont icon-mima !text-18px"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </div>
      <!--      验证码登录 / 重置密码 -->
      <div v-show="[LoginStateEnum.MOBILE, LoginStateEnum.RESET_PASSWORD].includes(getLoginState)">
        <!-- 手机号 -->
        <el-col :span="24">
          <el-form-item prop="mobileNumber">
            <el-input
              v-model="loginData.loginForm.mobileNumber"
              :placeholder="t('login.mobileNumberPlaceholder')"
              @input="(val) => (loginData.loginForm.mobileNumber = val.replace(/[^0-9]/g, ''))"
              maxlength="11"
            >
              <template #prefix>
                <i class="iconfont icon-shouji !text-18px"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 验证码 -->
        <el-col :span="24">
          <el-form-item prop="code">
            <div class="flex">
              <el-input
                class="w-full"
                v-model="loginData.loginForm.code"
                :placeholder="t('login.codePlaceholder')"
                @input="(val) => (loginData.loginForm.code = val.replace(/[^0-9]/g, ''))"
                maxlength="6"
              >
                <template #prefix>
                  <i class="iconfont icon-a-yanzhengma3 !text-18px"></i>
                </template>
              </el-input>
              <div
                @click="getCode"
                class="sms-btn w-160px text-center"
                :class="{
                  disabled: mobileCodeTimer > 0 || loginData.loginForm.mobileNumber.length !== 11
                }"
              >
                <template v-if="mobileCodeTimer <= 0">
                  {{ t('login.getSmsCode') }}
                </template>
                <template v-if="mobileCodeTimer > 0"> 倒计时{{ mobileCodeTimer }}s </template>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <!--        新密码-->
        <el-col v-if="getLoginState === LoginStateEnum.RESET_PASSWORD" :span="24">
          <el-form-item prop="newPassword">
            <el-input
              v-model="loginData.loginForm.newPassword"
              type="password"
              :placeholder="t('login.newPasswordPlaceholder')"
              show-password
            >
              <template #prefix>
                <i class="iconfont icon-mima !text-18px"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </div>
      <!-- 二维码登录 -->
      <NewQrCodeForm
        ref="qrCodeRef"
        v-show="getLoginState === LoginStateEnum.QR_CODE"
        @success="handleQrCodeSuccess"
      />
      <!--      表单按钮-->
      <el-col
        v-show="[LoginStateEnum.LOGIN, LoginStateEnum.MOBILE].includes(getLoginState)"
        :span="24"
      >
        <el-form-item>
          <div class="w-full flex justify-between leading-none">
            <el-link
              class="leading-40px"
              type="primary"
              :underline="false"
              @click="
                switchLoginWay(
                  getLoginState === LoginStateEnum.LOGIN
                    ? LoginStateEnum.MOBILE
                    : LoginStateEnum.LOGIN
                )
              "
            >
              <i class="iconfont icon-qiehuan !text-12px mr-6px"></i>
              {{
                t(
                  getLoginState === LoginStateEnum.MOBILE
                    ? 'login.switchPasswordLogin'
                    : 'login.switchVerificationCodeLogin'
                )
              }}
            </el-link>
            <el-checkbox
              v-show="getLoginState === LoginStateEnum.LOGIN"
              v-model="loginData.loginForm.rememberMe"
            >
              {{ t('login.remember') }}
            </el-checkbox>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="text-center">
        <template v-if="LoginStateEnum.LOGIN === getLoginState">
          <el-form-item>
            <XButton
              :loading="loginLoading"
              type="primary"
              class="w-[100%]"
              :title="t('login.login')"
              @click="getCode()"
            />
          </el-form-item>
          <!--          <el-link-->
          <!--            v-show="getLoginState === LoginStateEnum.LOGIN"-->
          <!--            type="primary"-->
          <!--            @click="switchLoginWay(LoginStateEnum.RESET_PASSWORD)"-->
          <!--          >-->
          <!--            {{ t('login.forgetPassword') }}-->
          <!--          </el-link>-->
        </template>
        <template v-if="LoginStateEnum.MOBILE === getLoginState">
          <el-form-item>
            <XButton
              :loading="loginLoading"
              type="primary"
              class="w-[100%]"
              :title="t('login.login')"
              @click="getTenant"
            />
          </el-form-item>
        </template>
        <template v-else-if="getLoginState === LoginStateEnum.RESET_PASSWORD">
          <el-form-item>
            <XButton
              :loading="loginLoading"
              type="primary"
              class="w-[100%]"
              :title="t('login.reset')"
              @click="confirmReset()"
            />
          </el-form-item>
          <el-link type="primary" @click="switchLoginWay(LoginStateEnum.LOGIN)">
            {{ t('login.loginForAccount') }}
          </el-link>
        </template>
      </el-col>
      <Verify
        ref="verify"
        mode="pop"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        @success="onVerifySuccess"
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
// import { sendSmsCodeApi, smsLoginApi } from '@/api/login'
import validate from '@/utils/validate'

const message = useMessage()
const { t } = useI18n()
const formLogin = ref()
const qrCodeRef = ref()
const { validForm } = useFormValid(formLogin)
const { setLoginState, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字

const LoginFormTitle = computed(() => LoginStateMap[unref(getLoginState)])

const validateMobile = (rule: any, value: any, callback: any) => {
  if (
    [LoginStateEnum.RESET_PASSWORD, LoginStateEnum.MOBILE].includes(getLoginState.value) &&
    !validate.tel(value)
  ) {
    callback(new Error('请输入正确手机号'))
  } else {
    callback()
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (getLoginState.value === LoginStateEnum.RESET_PASSWORD && !value) {
    callback(new Error('请输入正确格式新密码'))
  } else {
    // if (loginData.loginForm.newPassword !== '') {
    //   if (!formLogin.value) return
    //   formLogin.value.validateField('newPassword', () => null)
    // }
    callback()
  }
}

const LoginRules = computed(() => {
  return {
    username: [{ required: getLoginState.value === LoginStateEnum.LOGIN, message: '请输入用户名' }],
    password: [
      {
        required: getLoginState.value === LoginStateEnum.LOGIN,
        min: 8,
        message: '请输入至少8位密码'
      }
    ],
    mobileNumber: [
      {
        required: [LoginStateEnum.RESET_PASSWORD, LoginStateEnum.MOBILE].includes(
          getLoginState.value
        ),
        validator: validateMobile,
        message: '请输入正确手机号',
        trigger: 'change'
      }
    ],
    code: [
      {
        required: getLoginState.value === LoginStateEnum.MOBILE,
        len: 6,
        message: '请输入六位验证码',
        trigger: 'change'
      }
    ],
    newPassword: [
      {
        required: getLoginState.value === LoginStateEnum.RESET_PASSWORD,
        validator: validatePassword,
        message: '请输入正确格式新密码',
        trigger: 'change'
      }
    ]
  }
})
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    tenantName: '',
    username: '', // admin
    password: '', // admin123
    newPassword: '',
    mobileNumber: '',
    code: '',
    captchaVerification: '',
    rememberMe: false
  }
})
const isFirstLogin = ref(false)
watch(
  () => loginData.loginForm.mobileNumber,
  (data) => {
    loginData.loginForm.mobileNumber = data.replace('/^\\d{11}$/', '')
  }
)

// ------------- 重置密码 ---------------
const confirmReset = () => {
  console.log('confirm reset')
}

// ------------- 手机验证码登录 ---------------
const mobileCodeTimer = ref(0)
const smsVO = reactive({
  smsCode: {
    mobile: '',
    scene: 21
  },
  loginSms: {
    mobile: '',
    code: ''
  }
})
const getSmsCode = async () => {
  if (mobileCodeTimer.value > 0) return
  smsVO.smsCode.mobile = loginData.loginForm.mobileNumber
  // 设置倒计时
  mobileCodeTimer.value = 60
  let msgTimer = setInterval(() => {
    mobileCodeTimer.value = mobileCodeTimer.value - 1
    if (mobileCodeTimer.value <= 0) {
      clearInterval(msgTimer)
    }
  }, 1000)
  message.success('验证码已发送')
  // await sendSmsCodeApi(smsVO.smsCode).then(async () => {
  //   message.success(t('login.SmsSendMsg'))
  //   // 设置倒计时
  //   mobileCodeTimer.value = 60
  //   let msgTimer = setInterval(() => {
  //     mobileCodeTimer.value = mobileCodeTimer.value - 1
  //     if (mobileCodeTimer.value <= 0) {
  //       clearInterval(msgTimer)
  //     }
  //   }, 1000)
  // })
}

// 切换登录方式
const switchLoginWay = (LoginState: number) => {
  if (LoginState === LoginStateEnum.QR_CODE) {
    qrCodeRef.value.initQrCode()
  }
  setLoginState(LoginState)
}

// 获取图片验证码
const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (loginData.captchaEnable === 'false') {
    if (
      getLoginState.value === LoginStateEnum.MOBILE &&
      (mobileCodeTimer.value > 0 || loginData.loginForm.mobileNumber.length !== 11)
    ) {
      return
    }
    if (getLoginState.value === LoginStateEnum.LOGIN) {
      const data = await validForm()
      if (!data) {
        return
      }
    }
    onVerifySuccess()
  } else {
    if (
      getLoginState.value === LoginStateEnum.MOBILE &&
      (mobileCodeTimer.value > 0 || loginData.loginForm.mobileNumber.length !== 11)
    ) {
      return
    }
    if (getLoginState.value === LoginStateEnum.LOGIN) {
      const data = await validForm()
      if (!data) {
        return
      }
    }
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    verify.value.show()
  }
}
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

const onVerifySuccess = (data?) => {
  if (getLoginState.value === LoginStateEnum.MOBILE) {
    getSmsCode()
  } else if (getLoginState.value === LoginStateEnum.LOGIN) {
    getTenant(data)
  }
}

// 登录前请求是否有多主体可选
const switchTenantRef = ref()
const getTenant = async (data?) => {
  if (data) loginData.loginForm.captchaVerification = data.captchaVerification
  let res
  if (getLoginState.value === LoginStateEnum.LOGIN) {
    loginLoading.value = true
    const params = {
      captchaVerification: loginData.loginForm.captchaVerification,
      username: loginData.loginForm.username,
      password: loginData.loginForm.password
    }
    res = await LoginApi.getTenantUser(params).finally(() => {
      loginLoading.value = false
    })
  } else if (getLoginState.value === LoginStateEnum.MOBILE) {
    const data = await validForm()
    if (!data) {
      return
    }
    loginLoading.value = true
    const params = {
      captchaVerification: loginData.loginForm.captchaVerification,
      phone: loginData.loginForm.mobileNumber,
      code: loginData.loginForm.code
    }
    res = await LoginApi.getTenantPhone(params).finally(() => {
      loginLoading.value = false
    })
  }
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
      if (getLoginState.value === LoginStateEnum.LOGIN) {
        switchTenantRef.value.openDialog(tenantList, '', {
          username: loginData.loginForm.username,
          password: loginData.loginForm.password
        })
      } else if (getLoginState.value === LoginStateEnum.MOBILE) {
        switchTenantRef.value.openDialog(tenantList, '', {
          mobileNumber: loginData.loginForm.mobileNumber
        })
      }
    }
  }
}

// 选择主体完确定
const onSwitchBodyConfirm = (data) => {
  authUtil.setTenantId(data.tenantId)
  handleLogin(data)
}

// 二维码登录
const handleQrCodeSuccess = (data) => {
  handleLogin(
    {
      tenantId: data.tenantId,
      tenantName: data.tenantName,
      tenantType: data.tenantType
    },
    data.token
  )
}

// 登录
const handleLogin = async (tenantData?, qrToken?: string) => {
  loginLoading.value = true
  try {
    authUtil.setTenantData(tenantData)
    // await getTenantId()
    const data = await validForm()
    if (!data) {
      return
    }
    let res
    if (getLoginState.value === LoginStateEnum.LOGIN) {
      res = await LoginApi.loginApi(loginData.loginForm)
    } else if (getLoginState.value === LoginStateEnum.MOBILE) {
      res = await LoginApi.smsLoginApi({
        code: loginData.loginForm.code,
        phone: loginData.loginForm.mobileNumber
      })
    } else if (getLoginState.value === LoginStateEnum.QR_CODE) {
      res = await LoginApi.scanCodeLoginApi({
        token: qrToken
      })
    }
    if (!res) {
      return
    }
    ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    isFirstLogin.value = res.firstLogin === 1
    if (loginData.loginForm.rememberMe) {
      authUtil.setLoginForm({ ...loginData.loginForm })
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    authUtil.setLoginData({
      loginType: getLoginState.value,
      phone: loginData.loginForm.mobileNumber
    })
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
      if (isFirstLogin.value) {
        message
          .wgOperateConfirm(
            '系统校验到您的密码为初始密码，为了保证您的帐号安全，请先修改您的密码',
            '提示',
            {
              confirmButtonText: '修改密码',
              cancelButtonText: '暂不修改'
            }
          )
          .then(async () => {
            push('/user/profile?action=resetPwd')
          })
          .catch(() => {})
      }
    }, 400)
  }
}

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
  // 退出登录，初始化二维码
  if (getLoginState.value === LoginStateEnum.QR_CODE) {
    qrCodeRef.value.initQrCode()
  }
})
</script>

<style lang="scss" scoped>
.form-title,
.qrcode-box i {
  color: var(--el-color-primary);
}

.qrcode-box div,
.sms-btn {
  color: var(--el-color-primary);
  background-color: #e8f2ff;
}

.qrcode-box {
  .qrcode-tip::after {
    position: absolute;
    top: 50%;
    right: -4px;
    width: 10px;
    height: 10px;
    background-color: #e8f2ff;
    content: '';
    transform: translateY(-50%) rotate(45deg);
  }
}

.sms-btn {
  margin-left: 12px;
  //border: 1px solid var(--el-color-primary);
  cursor: pointer;
  border-radius: 5px;

  &.disabled {
    color: #9fceff;
    cursor: not-allowed;
  }
}
</style>
