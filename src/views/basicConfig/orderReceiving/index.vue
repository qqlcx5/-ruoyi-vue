<template>
  <div class="basic-config-content order-receiving-container">
    <div class="part-title">
      <span class="main-text">抢单后状态变化</span>
    </div>
    <div class="config-form-item">
      <span>线索被抢单状态变化：</span>
      <el-radio-group v-model="radio" size="small">
        <el-radio label="1">自动变化</el-radio><el-radio label="2">手动接单变化</el-radio>
      </el-radio-group>
    </div>
    <div class="config-form-item-tip">
      <div>自动变化：当门店有一个成员接单后，其他成员自动变为被抢单状态 </div>
      <div>手动接单变化：当门店有一个成员接单后，其他成员需要点击接单，状态才会变为被抢单</div>
    </div>
    <div class="part-title">
      <span class="main-text">接单推送间隔设置</span>
      <el-switch v-model="bool" />
    </div>
    <div class="config-form-item">
      <span>成员选择【暂不接单】或未接单时，间隔</span>
      <el-input-number
        v-model.number="num"
        class="number-input"
        :max="99999"
        step-strictly
        :step="1"
        :controls="false"
      />
      <span>分钟再次推送接单提醒通知，直到接单为止</span>
    </div>
    <div class="config-form-item-tip">
      <div>说明：若成员选择【不想接单】，则不在推送接单通知</div>
    </div>
    <div class="part-title">
      <span class="main-text">跟进未打通电话推送通知间隔时间设置</span>
      <el-switch v-model="bool" />
    </div>
    <div class="config-form-item">
      <span>成员跟进客户未打通电话，间隔</span>
      <el-input-number
        v-model.number="num"
        class="number-input"
        :max="99999"
        step-strictly
        :step="1"
        :controls="false"
      />
      <span>分钟再次推送接单提醒通知，直到接单为止</span>
    </div>
    <el-button class="mt-90px" type="primary" size="large">保存设置</el-button>
  </div>
</template>

<script setup lang="ts">
const radio = ref<string>('1')
const num = ref<number>()
const bool = ref<boolean>(false)
</script>

<style scoped lang="scss">
@import '../style/index';
.order-receiving-container {
  min-height: 100%;
}
</style>
