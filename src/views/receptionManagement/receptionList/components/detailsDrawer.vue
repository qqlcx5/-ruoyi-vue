<template>
  <div>
    <el-drawer
      v-model="modelValue_"
      class="reception-drawer"
      direction="rtl"
      title="详情"
      :lockScroll="false"
      size="764px"
      @close="modelValue_ = false"
      :modal-append-to-body="false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="接待信息" name="1">
          <div>
            <el-descriptions title="基本信息" :column="2">
              <el-descriptions-item label="开始录音时间">kooriookami</el-descriptions-item>
              <el-descriptions-item label="录音时长">18100000000</el-descriptions-item>
              <el-descriptions-item label="员工">Suzhou</el-descriptions-item>
              <el-descriptions-item label="部门">
                This is a remark. This is a remark. This is a remark.
              </el-descriptions-item>
              <el-descriptions-item label="进店类型">1112</el-descriptions-item>
              <el-descriptions-item label="客户类型">1112</el-descriptions-item>
              <el-descriptions-item label="客户来源">1112</el-descriptions-item>
              <el-descriptions-item label="关联邀约单">1112</el-descriptions-item>
              <el-descriptions-item label="客户姓名">1112</el-descriptions-item>
              <el-descriptions-item label="客户手机">1112</el-descriptions-item>
              <el-descriptions-item label="客户性别">1112</el-descriptions-item>
              <el-descriptions-item label="同行人数">1112</el-descriptions-item>
              <el-descriptions-item label="客户微信">1112</el-descriptions-item>
              <el-descriptions-item label="关联微信群">1112</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="线索信息" :column="2">
              <el-descriptions-item label="线索来源">厂家推送-厂家推送</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="意向信息" :column="2">
              <el-descriptions-item label="意向车型"
                >哈弗-哈弗赤兔-哈弗赤兔-202304-1.5T-自动-23款4G15M-两驱-国6</el-descriptions-item
              >
              <el-descriptions-item label="意向等级">H</el-descriptions-item>
              <el-descriptions-item label="购车类型">新购</el-descriptions-item>
              <el-descriptions-item label="购车关注">价格,配置 </el-descriptions-item>
              <el-descriptions-item label="购车目的">上下班通勤</el-descriptions-item>
              <el-descriptions-item label="其他需求">暂无</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="预算信息" :column="2">
              <el-descriptions-item label="购车预算">5 ~ 10 (万)</el-descriptions-item>
              <el-descriptions-item label="付款方式">贷款</el-descriptions-item>
              <el-descriptions-item label="预计购车周期">今日成交</el-descriptions-item>
              <el-descriptions-item label="是否有报价"> 是 </el-descriptions-item>
              <el-descriptions-item label="按揭产品">天津邮储-标息贷（通用）</el-descriptions-item>
              <el-descriptions-item label="按揭期数">36期（月利率0.29%）</el-descriptions-item>
              <el-descriptions-item label="车身价格">111000 元</el-descriptions-item>
              <el-descriptions-item label="首付金额">7000 元</el-descriptions-item>
              <el-descriptions-item label="还款方式">等额本息</el-descriptions-item>
              <el-descriptions-item label="贷款金额">74000 元</el-descriptions-item>
              <el-descriptions-item label="月供金额">2055.56 元</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="旧车回收" :column="2">
              <el-descriptions-item label="是否有二手车出售">否</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="接待总结" :column="2">
              <el-descriptions-item label="接待总结">有事处理</el-descriptions-item>
              <el-descriptions-item label="是否试乘试驾">是</el-descriptions-item>
              <el-descriptions-item label="是否下订">否 未面签</el-descriptions-item>
              <el-descriptions-item label="未下订原因"> 其他 </el-descriptions-item>
              <el-descriptions-item label="未下订说明">有事处理</el-descriptions-item>
              <el-descriptions-item label="主管是否参与接待">111</el-descriptions-item>
              <el-descriptions-item label="下次跟进时间"> </el-descriptions-item>
              <el-descriptions-item label="下次跟进事项"> </el-descriptions-item>
              <el-descriptions-item label="备忘图片">
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
              <el-descriptions-item label="点赞">有事处理</el-descriptions-item>
              <el-descriptions-item label="加油">是</el-descriptions-item>
              <el-descriptions-item label="点评人">否 未面签</el-descriptions-item>
              <el-descriptions-item label="点评分数"> 其他 </el-descriptions-item>
              <el-descriptions-item label="2023-06-07 16:48:48">
                <el-button type="primary" link>点评详情></el-button>
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

let activeName = '1'
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
  console.log(res, 'receptionManageDetailApi')
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

<style lang="scss" scoped>
.reception-drawer {
}
</style>
