const validate = {
  pureNumber: (str) => {
    // 纯数字
    const regx = /^[0-9]*$/g
    return regx.test(str)
  },
  pureAlphabet: (str) => {
    // 纯字母
    const regx = /[a-zA-Z]/g
    return regx.test(str)
  },
  numberAndAlphabet: (str) => {
    // 数字、字母混合
    const regx = /^[0-9a-zA-Z]+$/g
    return regx.test(str)
  },
  userName: (str) => {
    // 用户名正则，4到16位（字母，数字，下划线，减号）
    const regx = /^[a-zA-Z0-9_-]{4,16}$/
    return regx.test(str)
  },
  illegalUserName: (str) => {
    const arr = ['admin', 'administrator', 'Admin', 'Administrator', 'editor']
    return arr.includes(str)
  },
  password: (str) => {
    // 密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
    const regx = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/
    return regx.test(str)
  },
  tel: (str) => {
    // 手机号正则
    const regx = /^1[3456789]\d{9}$/
    return regx.test(str)
  },
  captcha: (str, length = 4) => {
    // 手机验证码
    const regx = new RegExp(`^\\d{${length}\}$`)
    return regx.test(str)
  },
  id: (str) => {
    // 身份证号（18位）正则
    const regx =
      /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return regx.test(str)
  }
}

export default validate
