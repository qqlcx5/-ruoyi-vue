<template>
  <div class="basic-config-content order-receiving-container" v-loading="loading">
    <div class="part-wrap">
      <div class="part-title">
        <span class="main-text">抢单后状态变化</span>
      </div>
      <div class="config-form-item">
        <span>线索被抢单状态变化：</span>
        <el-radio-group v-model="ruleForm.clueGrabType">
          <el-radio :label="1">自动变化</el-radio><el-radio :label="2">手动接单变化</el-radio>
        </el-radio-group>
      </div>
      <div class="config-form-item-tip">
        <div>自动变化：当门店有一个成员接单后，其他成员自动变为被抢单状态 </div>
        <div>手动接单变化：当门店有一个成员接单后，其他成员需要点击接单，状态才会变为被抢单</div>
      </div>
    </div>
    <div class="part-wrap">
      <div class="part-title">
        <span class="main-text">接单推送间隔设置</span>
        <el-switch v-model="ruleForm.receivePushStatus" :active-value="1" :inactive-value="0" />
      </div>
      <div class="config-form-item">
        <span>成员选择【暂不接单】或未接单时，间隔</span>
        <el-input-number
          v-model.number="ruleForm.receivePushMinute"
          class="number-input"
          step-strictly
          :step="1"
          :min="0"
          :controls="false"
        />
        <span>分钟再次推送接单提醒通知，直到接单为止</span>
      </div>
      <div class="config-form-item-tip">
        <div>说明：若成员选择【不想接单】，则不在推送接单通知</div>
      </div>
    </div>
    <div class="part-wrap">
      <div class="part-title">
        <span class="main-text">跟进未打通电话推送通知间隔时间设置</span>
        <el-switch
          v-model="ruleForm.followNotGetThroughPushStatus"
          :active-value="1"
          :inactive-value="0"
        />
      </div>
      <div class="config-form-item">
        <span>成员跟进客户未打通电话，间隔</span>
        <el-input-number
          v-model.number="ruleForm.followNotGetThroughPushMinute"
          class="number-input"
          step-strictly
          :step="1"
          :min="0"
          :controls="false"
        />
        <span>分钟推送再次跟进客户提醒通知</span>
      </div>
    </div>
    <div class="bottom-btns" v-hasPermi="['clue:basic-config:order-receiving:save']">
      <el-button type="primary" size="large" :loading="btnLoading" @click="handleSave"
        >保存设置</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { queryClueGrabConfig, saveClueGrabConfig } from '@/api/clue/basicConfig/index'
const message = useMessage()
let ruleForm = reactive({
  clueGrabType: null,
  receivePushStatus: 0,
  receivePushMinute: null,
  followNotGetThroughPushStatus: 0,
  followNotGetThroughPushMinute: null
})

const loading = ref<boolean>(false)
const getInfo = async () => {
  try {
    loading.value = true
    const data = await queryClueGrabConfig()
    console.log(data)
    ruleForm = reactive(data)
  } finally {
    loading.value = false
  }
}
getInfo()
const btnLoading = ref<boolean>(false)
const handleSave = async () => {
  try {
    btnLoading.value = true
    await saveClueGrabConfig(ruleForm)
    message.success('保存成功')
  } finally {
    btnLoading.value = false
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/custom.scss';
.order-receiving-container {
  min-height: 100%;
}
</style>
