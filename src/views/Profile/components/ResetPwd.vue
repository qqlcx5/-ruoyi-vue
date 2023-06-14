<template>
  <el-form ref="formRef" :model="password" :rules="rules" label-width="80px">
    <el-form-item :label="t('profile.password.oldPassword')" prop="oldPassword">
      <InputPassword v-model="password.oldPassword" />
    </el-form-item>
    <el-form-item :label="t('profile.password.newPassword')" prop="newPassword">
      <InputPassword v-model="password.newPassword" maxLength="16" strength />
    </el-form-item>
    <el-form-item :label="t('profile.password.confirmPassword')" prop="confirmPassword">
      <InputPassword v-model="password.confirmPassword" maxLength="16" strength />
    </el-form-item>
    <div class="pwd-tip"
      >注：密码长度不能少于8位，需包含大写字母、小写字母、数字、特殊符号至少3种及以上元素</div
    >
    <el-form-item>
      <XButton type="primary" @click="submit(formRef)" :title="t('common.save')" />
      <XButton type="danger" :title="t('common.reset')" @click="reset(formRef)" />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'

import { InputPassword } from '@/components/InputPassword'
import { updateUserPwdApi } from '@/api/system/user/profile'
import { useUserStoreWithOut } from '@/store/modules/user'
import { useTagsViewStore } from '@/store/modules/tagsView'

const { t } = useI18n()
const message = useMessage()
const userStore = useUserStoreWithOut()
const tagsViewStore = useTagsViewStore()
const { replace } = useRouter()

const formRef = ref<FormInstance>()
const password = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单校验
const equalToPassword = (rule, value, callback) => {
  if (password.newPassword !== value && value !== password.newPassword) {
    callback(new Error(t('profile.password.diffPwd')))
  } else {
    callback()
  }
}
const newPassword = (rule, value, callback) => {
  const reg =
    /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/
  if (!reg.test(value)) {
    callback(new Error('密码应为数字、大小写字母、特殊字符中的至少3种组成'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  oldPassword: [{ required: true, message: t('profile.password.oldPwdMsg'), trigger: 'change' }],
  newPassword: [
    {
      required: true,
      validator: newPassword,
      min: 8,
      max: 16,
      message: t('profile.password.pwdRules'),
      trigger: 'change'
    }
  ],
  confirmPassword: [
    { required: true, message: t('profile.password.cfPwdMsg'), trigger: 'change' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ]
})
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      await updateUserPwdApi(password.oldPassword, password.newPassword)
      message.success(t('common.updateSuccess'))
      // 退出登录
      await userStore.loginOut()
      tagsViewStore.delAllViews()
      replace('/login?redirect=/index')
    }
  })
}
const reset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style lang="scss" scoped>
.pwd-tip {
  margin-bottom: 56px;
  margin-left: 80px;
  color: $error-color;
}
</style>
