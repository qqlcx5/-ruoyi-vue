<template>
  <!--  门店修改上级主体 校验-->
  <a-modal
    v-model:visible="state.isShow"
    title="修改上级主体"
    destroyOnClose
    wrapClassName="status-change-modal"
    width="530px"
    @cancel="closeStatusModal"
    :bodyStyle="{
      width: '100%',
      height: '189px',
      margin: '0',
      padding: '33px 0 0 0px',
      overflow: 'auto'
    }"
  >
    <div class="base_info_content">
      <a-form
        :model="state.formState"
        ref="formRef"
        v-bind="layout"
        :label-col="{ style: { width: '130px' } }"
        autocomplete="off"
      >
        <a-form-item
          :label="`上级主体`"
          name="belongTenantId"
          :rules="[{ required: true, message: `上级主体不能为空` }]"
        >
          <a-tree-select
            v-model:value="state.formState.belongTenantId"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择上级主体"
            :tree-data="state.optionalMenuTree"
            :fieldNames="{ children: 'children', label: 'name', value: 'id' }"
            treeNodeFilterProp="name"
          />
        </a-form-item>
      </a-form>

      <!--      <img :src="warningImg" alt="" class="tip-img" />-->
      <div class="tip-text-content">
        <div class="tip-text">
          <img :src="warningImg" alt="" class="tip-img message-img" />
          重要提示：修改上级主体后，该门店底下的所有基础和业务数据
          将全部迁移到该主体公司底下，且不可恢复，请谨慎操作！
        </div>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="checkConfirm">确定</a-button>
      <a-button @click="closeStatusModal">取消</a-button>
    </template>
  </a-modal>

  <!--  门店修改上级主体 短信提示Modal  -->
  <a-modal
    v-model:visible="state.isShowMessage"
    destroyOnClose
    title="提示"
    wrapClassName="date-status-change-modal"
    @ok="statusOk"
    @cancel="statusCancel"
    width="560px"
    :bodyStyle="{
      width: '100%',
      height: '190px',
      margin: '0',
      padding: '10px 0 0 0',
      overflow: 'auto'
    }"
  >
    <div class="message-content">
      <!--      <img :src="warningImg" alt="" class="tip-img" />-->
      <div class="message-text-content">
        <div class="message-text">
          <img :src="warningImg" alt="" class="tip-img message-img" />
          为了保护您的主体公司业务数据安全，请通过安全验证：
        </div>
        <div class="message-phone">
          主体负责人绑定的手机号：{{
            state.contactMobile.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2')
          }}
        </div>
        <div class="message-input-content"
          >短信验证码:
          <a-input
            v-model:value="state.messageCode"
            placeholder="请输入验证码"
            style="width: 180px; margin-left: 8px"
          />
          <div v-if="state.canSendCode" class="send-code-btn" @click="senCodeFN"> 发送验证码 </div>
          <div v-else class="countdown-code-btn">{{ state.codeCountdown }}s重新获取</div>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="statusOk">确认修改</a-button>
      <a-button @click="statusCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import {
  getCheckMajorIndividual,
  getMajorIndividualList,
  getSimpleTenantList,
  getSimpleTenantListStore,
  getTopPhone,
  updateEditMajorIndividualStatus,
  updateParentMajorIndividual
} from '@/api/system/business'
import { handleTree } from '@/utils/tree'
import warningImg from '@/assets/imgs/system/warning.png'
import { message } from 'ant-design-vue'
import { updateOrganizationStatus } from '@/api/system/organization'

interface Props {
  currentRecord?: object
}

const props = withDefaults(defineProps<Props>(), {
  currentRecord: {}
})

const emit = defineEmits<{
  (e: 'closeStoreParentMajorIndividual', key: boolean): void
}>()

const state = reactive({
  isShow: true,
  isShowMessage: false,
  formState: {
    belongTenantId: null //上级主体编号
  },
  optionalMenuTree: [], //上级主体 treeList
  canSendCode: true, //能否发送验证码
  codeCountdown: 60, //短信发送倒计时 s
  messageCode: '', //短信验证码
  contactMobile: '' //顶层主体的手机号 因为只有两层 所以只需要找父节点即可
})

const formRef = ref()

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
}

//修改上级主体 确认 校验
const checkConfirm = async () => {
  // 校验表单
  if (!formRef) return
  await formRef.value.validate()
  const res = await getCheckMajorIndividual({
    organizationId: props.currentRecord.id,
    tenantId: state.formState.belongTenantId
  })

  if (res) {
    //  可以迁移
    state.isShow = false
    state.isShowMessage = true
  } else {
    //不可以迁移
    message.error('修改不成功！原因为：修改的主体下有同名的门店名称/编码，请重新修改。')
  }
}

//发送短信验证码
const senCodeFN = () => {
  //TODO:发送短信请求
  if (true) {
    message.success(
      `验证码已发送至${state.contactMobile.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2')}`
    )
  }
  state.canSendCode = false
  let codeIn = setInterval(() => {
    state.codeCountdown -= 1
    if (state.codeCountdown === 0) {
      state.canSendCode = true
      state.codeCountdown = 60
      clearInterval(codeIn)
    }
  }, 1000)
}

//短信 modal 取消
const statusCancel = () => {
  emit('closeStoreParentMajorIndividual', false)
}
//短信 modal 确认
const statusOk = async () => {
  if (!state.messageCode) {
    message.warning('请输入短信验证码')
    return
  }
  try {
    await updateParentMajorIndividual({
      organizationId: props.currentRecord.id,
      tenantId: state.formState.belongTenantId
    })

    message.success('修改上级主体成功')
    statusCancel()
  } finally {
  }
}

const closeStatusModal = () => {
  emit('closeStoreParentMajorIndividual', false)
}

onMounted(async () => {
  // let res = await getSimpleTenantList()
  let res = await getSimpleTenantListStore({
    storeId: props.currentRecord.id
  })
  console.log('res', res)
  console.log('props.currentRecord', props.currentRecord)

  state.contactMobile = await getTopPhone({
    id: props.currentRecord.belongTenantId || props.currentRecord.tenantId
  })

  //contactMobile
  //去除顶层机构以及厂家 只保留经销商
  res = res.filter((item) => item.type === 'dealer')
  state.optionalMenuTree = handleTree(res, 'id', 'belongTenantId', 'children')
  console.log('state.optionalMenuTree', state.optionalMenuTree)
  state.formState.belongTenantId = props.currentRecord.belongTenantId
})
</script>

<style lang="scss" scoped>
.base_info_content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.tip-text-content {
  width: 449px;
  height: 61px;
}
.tip-text {
  margin-left: 41px;
  padding: 10px 12px;
  display: flex;
  font-weight: bold;
  width: 449px;
  height: 61px;
  border-radius: 4px;
  background-color: rgba(253, 246, 237, 1);
  border: 0.5px solid rgba(231, 162, 60, 1);
  color: rgba(250, 173, 20, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
}
//提示弹窗 img
.tip-img {
  width: 20px;
  height: 20px;
  margin-right: 16px;
}
.message-img {
  margin-top: 3px;
}

//短信 modal
.message-content {
  display: flex;
}
.message-text-content {
  width: 520px;
  //margin-left: 15px;
}
.message-text {
  margin-left: 20px;
  display: flex;
  //align-items: center;
  //margin-right: 40px;
  color: rgba(51, 51, 51, 1);
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  font-family: PingFangSC-Medium;
}
.message-phone {
  margin: 12px 0 0 56px;
}
.message-input-content {
  //padding-left: 76px;
  margin: 26px 0 0 132px;
  display: flex;
  align-items: center;
}
//发送验证码 btn
.send-code-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 94px;
  height: 32px;
  margin-left: 8px;
  border-radius: 4px;
  color: rgb(0, 129, 255);
  background-color: rgba(237, 244, 251);
  cursor: pointer;
}
//重新获取验证码
.countdown-code-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 106px;
  height: 32px;
  margin-left: 19px;
  border-radius: 4px;
  color: rgba(0, 129, 255, 0.61);
  background-color: rgb(237, 244, 251);
}
</style>
