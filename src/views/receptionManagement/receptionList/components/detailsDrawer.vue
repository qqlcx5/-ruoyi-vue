<template>
  <div>
    <el-drawer
      v-model="modelValue_"
      class="reception-drawer"
      direction="rtl"
      :lockScroll="false"
      size="764px"
      title="详情"
      @close="modelValue_ = false"
    >
      <div class="tabs-header">
        <div class="tabs-header-right text-confirm-gray fs-16px"
          >画像因子总分：100 当前得分：0 级别判定：N</div
        >
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="接待信息" name="1">
          <div>
            <el-descriptions title="基本信息" :column="2">
              <el-descriptions-item label="开始录音时间">{{
                pageInfo.recordBeginTime
              }}</el-descriptions-item>
              <el-descriptions-item label="录音时长">{{
                pageInfo.receptionAudioDuration
              }}</el-descriptions-item>
              <el-descriptions-item label="员工">{{ pageInfo.userName }}</el-descriptions-item>
              <el-descriptions-item label="部门">
                {{ pageInfo.userDepartment }}
              </el-descriptions-item>
              <el-descriptions-item label="进店类型">{{
                pageInfo.combineType
              }}</el-descriptions-item>
              <el-descriptions-item label="客户类型">{{
                pageInfo.customerType
              }}</el-descriptions-item>
              <el-descriptions-item label="客户来源">{{
                pageInfo.customerSource
              }}</el-descriptions-item>
              <el-descriptions-item label="关联邀约单">{{
                pageInfo.callInviteId
              }}</el-descriptions-item>
              <el-descriptions-item label="客户姓名">{{
                pageInfo.customerName
              }}</el-descriptions-item>
              <el-descriptions-item label="客户手机">{{
                pageInfo.customerMobile
              }}</el-descriptions-item>
              <el-descriptions-item label="客户性别">{{
                pageInfo.customerSex
              }}</el-descriptions-item>
              <el-descriptions-item label="同行人数">{{ pageInfo.peerNum }}</el-descriptions-item>
              <el-descriptions-item label="客户微信">{{ pageInfo.wxAccount }}</el-descriptions-item>
              <el-descriptions-item label="关联微信群">{{
                pageInfo.customerWechatGroupName
              }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="线索信息" :column="2">
              <el-descriptions-item label="线索来源">{{
                pageInfo.clueSource
              }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="意向信息" :column="2">
              <el-descriptions-item label="意向车型">{{
                pageInfo.intentionModel
              }}</el-descriptions-item>
              <el-descriptions-item label="意向等级">{{
                pageInfo.intentionLevel
              }}</el-descriptions-item>
              <el-descriptions-item label="购车类型">{{
                pageInfo.buyCarType
              }}</el-descriptions-item>
              <el-descriptions-item label="购车关注"
                >{{ pageInfo.buyCarAttention }}
              </el-descriptions-item>
              <el-descriptions-item label="购车目的">{{
                pageInfo.buyCarGoal
              }}</el-descriptions-item>
              <el-descriptions-item label="其他需求">{{ pageInfo.otherNeed }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="预算信息" :column="2">
              <el-descriptions-item label="购车预算"
                >{{ pageInfo.buyCarBudgetBegin }}(万)</el-descriptions-item
              >
              <el-descriptions-item label="付款方式">{{
                pageInfo.paymentMethod
              }}</el-descriptions-item>
              <el-descriptions-item label="预计购车周期">{{
                pageInfo.budgetCycle
              }}</el-descriptions-item>
              <el-descriptions-item label="是否有报价xxx"> 是 </el-descriptions-item>
              <el-descriptions-item label="按揭产品xxx"
                >天津邮储-标息贷（通用）</el-descriptions-item
              >
              <el-descriptions-item label="按揭期数xxx">36期（月利率0.29%）</el-descriptions-item>
              <el-descriptions-item label="车身价格xxx">111000 元</el-descriptions-item>
              <el-descriptions-item label="首付金额xxx">7000 元</el-descriptions-item>
              <el-descriptions-item label="还款方式xxx">等额本息</el-descriptions-item>
              <el-descriptions-item label="贷款金额">{{
                pageInfo.budgetCycle
              }}</el-descriptions-item>
              <el-descriptions-item label="月供金额xxx">2055.56 元</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="旧车回收" :column="2">
              <el-descriptions-item label="是否有二手车出售">{{
                pageInfo.isAutosRecycle
              }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="接待总结" :column="2">
              <el-descriptions-item label="接待总结">{{
                pageInfo.customerSummary
              }}</el-descriptions-item>
              <el-descriptions-item label="是否试乘试驾">{{
                pageInfo.testDrive
              }}</el-descriptions-item>
              <el-descriptions-item label="是否下订">{{
                pageInfo.placeOrderStatus
              }}</el-descriptions-item>
              <el-descriptions-item label="未下订原因">
                {{ pageInfo.transactionRemark }}
              </el-descriptions-item>
              <el-descriptions-item label="未下订说明xxx">111</el-descriptions-item>
              <el-descriptions-item label="主管是否参与接待xxx">111</el-descriptions-item>
              <el-descriptions-item label="下次跟进时间xxx"> </el-descriptions-item>
              <el-descriptions-item label="下次跟进事项xxx"> </el-descriptions-item>
              <el-descriptions-item label="备忘图片xxx">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="srcList[0]"
                  :zoom-rate="1.2"
                  :preview-src-list="srcList"
                  :initial-index="4"
                  fit="cover"
                />
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="点评点赞" :column="2">
              <el-descriptions-item label="点赞xxx">有事处理</el-descriptions-item>
              <el-descriptions-item label="加油xxx">是</el-descriptions-item>
              <el-descriptions-item label="点评人xxx">否 未面签</el-descriptions-item>
              <el-descriptions-item label="点评分数xxx"> 其他 </el-descriptions-item>
              <el-descriptions-item label="2023-06-07 16:48:48">
                <el-tooltip effect="dark">
                  <template #content>
                    1、接待是否及时，接待过程是否主动热情态度热情(10分）<br />
                    2、主动接待：递交名片，自我介绍，询问对方尊称有按要求执行（0分）<br />
                    3、提供三种以上饮品有（0分） 4、是否询问电话号码有（0分）<br />
                    5、是否询问添加微信有（0分） 6、主动邀请试乘试驾是（10分）<br />
                    7、是否询问置换需求询问了客户未明确回复（5分）<br />
                    8、是否提供按揭购车方案有按要求完整介绍（5分）<br />
                    9、业务介绍话术是否流畅中等（7分）<br />
                    10、不少于5项产品卖点讲解：根据产品核心体验点及客户实际关注点，从动力、科技、配置维度<br />
                    （可借助短视频、图文、DM 单等），话术是否熟练中等（7分）<br />
                    11、主动询问客户关注的竞品，并进行竞品应对策略话术攻击有开展，未做好（5分）<br />
                    12、能否详细介绍店内的营销策略、促销方案，并进行有效逼单介绍一般（3分）<br />
                    13、针对客户提出的产品异议，进行专业解答有提问，解答一般（5分）<br />
                    14、能否通过需求分析，并结合公司政策导向给客户设计购车方案有设计，不够好（3分）<br />
                    15、集团优势介绍和万国服务无忧介绍只介绍了一项（5分）<br />
                    16、客户离店是否发企业个人微信感谢信息发送内容完整（5分）<br />
                    17、对于硬性执行项的处理没有违规内容（0分） 18、录音音质很清晰（5分）<br />
                    19、点评描述客户到店了解一下哈弗二狗，对比坦克，回去考虑一下，请继续跟进
                  </template>
                  <el-button type="primary" link>点评详情></el-button>
                </el-tooltip>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
        <el-tab-pane label="画像因子" name="2">
          <div> 1、客户预购时间（客户表现出来的购车时间）</div>
          <div> 2、客户购车车型得分（客户是否明确自己所购车型）</div>
          <div> 3、客户预算得分（评估客户的预选与车型吻合度）</div>
          <div> 4、决策人得分（客户是否为购车决策人）</div>
          <div> 5、购车用途得分（客户是否明确购车用途）</div>
          <div> 6、看车经历得分（客户是否有多轮看车经历）</div>
          <div> 7、购买方式得分（客户是否明确了购车付款方式）</div>
          <div> 8、老客户推荐因素</div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import * as receptionList from '@/api/receptionManagement/receptionList'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
let activeName = '1'
let pageInfo = ref({} as any)
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
]
// 接待详情
async function receptionManageDetailApi(id) {
  const res = await receptionList.receptionManageDetailApi(id)
  // 开始录音时间
  res.recordBeginTime = dayjs(res.recordBeginTime).format('YYYY-MM-DD HH:mm:ss')
  // 录音时长
  res.receptionAudioDuration = dayjs
    .duration(res.receptionAudioDuration, 'seconds')
    .format('HH:mm:ss')
  // 进店类型
  res.combineType = typeOfStoreEntry[res.combineType]
  // 客户类型
  res.customerType = customerType[res.customerType]
  // 客户来源
  res.customerSource = customerSource[res.customerSource]
  // 客户手机
  res.customerMobile = res.customerMobile?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || ''
  // 客户性别
  res.customerSex = customerGender[res.customerSex]
  // 意向等级
  res.intentionLevel = intentionLevelType[res.intentionLevel]
  // 购车类型
  res.buyCarType = carPurchaseType[res.buyCarType]
  // 付款方式
  res.paymentMethod = paymentMethod[res.paymentMethod]
  // 是否试乘试驾
  res.testDrive = testDriveOrNot[res.testDrive]
  // 客户是否下订
  res.placeOrderStatus = doesTheCustomerPlaceAnOrder[res.placeOrderStatus]
  // 是否成交
  res.transactionStatus = isItATransactionOrNot[res.transactionStatus]
  // 旧车回收
  res.isAutosRecycle = usedCarRecycling[res.isAutosRecycle]
  pageInfo.value = res
}
/* ---------------------------------- 数据处理 ---------------------------------- */
// 进店类型
let typeOfStoreEntry = {
  '1': '首次进店看车',
  '2': '再次到店洽谈',
  '3-1': '提车 - 我司售卖提车',
  '3-2': '提车 - 厂家售卖提车',
  '4': '办理手续',
  '5': '交余款',
  '6': '其他',
  '7-1': '维保顺便看车 - 置换/增购',
  '7-2': '维保顺便看车 - 推荐买车',
  '7-3': '维保顺便看车 - 随便看看'
}
// 客户类型
let customerType = {
  1: '个人',
  2: '企业'
}
// 客户来源
let customerSource = {
  1: '电话邀约',
  2: '展厅邀约',
  3: '自然到店',
  4: '线索自邀'
}
// 客户性别
let customerGender = {
  0: '未知',
  1: '男',
  2: '女'
}
// 意向等级
let intentionLevelType = {
  1: 'H',
  2: 'A',
  3: 'B',
  4: 'C',
  5: 'N',
  0: '其他'
}
// 购车类型
let carPurchaseType = {
  1: '新购',
  2: '再购',
  3: '置换',
  0: '其他'
}
// 付款方式
let paymentMethod = {
  1: '全款',
  2: '贷款'
}
// 是否试乘试驾
let testDriveOrNot = {
  0: '否',
  1: '是'
}
// 客户是否下订
let doesTheCustomerPlaceAnOrder = {
  0: '否',
  1: '是',
  2: '考虑中'
}
// 是否成交
let isItATransactionOrNot = {
  0: '否',
  1: '是'
}
// 旧车回收
let usedCarRecycling = {
  0: '否',
  1: '是'
}
/* --------------------------------- // 打开抽屉 -------------------------------- */
function openDrawer(row) {
  modelValue_.value = true
  receptionManageDetailApi(row.id)
}
defineExpose({
  openDrawer
})
/* ---------------------------------- 弹窗初始化 --------------------------------- */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:modelValue', 'refresh'])
const modelValue_ = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
</script>

<style lang="scss">
.reception-drawer {
  .el-drawer__header {
    color: rgba(51, 51, 51, 1);
    font-size: 32px;
    margin-bottom: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #eaebef;
    font-weight: bold;
  }
  .tabs-header {
    position: relative;
    &-right {
      position: absolute;
      right: 0;
      top: 10px;
    }
  }
}
</style>
