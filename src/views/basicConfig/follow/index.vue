<template>
  <div class="basic-config-content follow-container">
    <div class="part-title">
      <span class="main-text">取消跟进设置</span>
    </div>
    <div class="config-form-item">
      <span>客户到店后是否取消对应有效线索的跟进计划：</span>
      <el-switch v-model="ruleForm.cancelFollowPlan" :active-value="1" :inactive-value="0" />
    </div>
    <div class="config-form-item-tip">
      <div
        >开启时：客户到店后，接待录音关联的邀约单对应的有效线索变为已到店，该有效线索下的待跟进计划变为已取消；</div
      >
      <div
        >关闭时：客户到店后，接待录音关联的邀约单对应的有效线索变为已到店，不对该有效线索的待跟进计划进行取消操作；</div
      >
    </div>
    <div class="part-title">
      <span class="main-text">无通话录音设置</span>
    </div>
    <div class="config-form-item">
      <!--  todo    -->
      <span>无通话录音打通客户电话是否允许独享线索：</span>
      <el-switch v-model="ruleForm.cancelFollowPlan" :active-value="1" :inactive-value="0" />
    </div>
    <div class="config-form-item-tip">
      <div
        >开启：跟进线索时，选择暂无通话记录，上传截图后，是否联系上客户选择【是】时，按照通话录音已接通的情况进行逻辑判断。</div
      >
      <div
        >关闭：跟进线索时，选择暂无通话记录，上传截图后，是否联系上客户选择【是】时，不按照通话录音已接通的情况进行逻辑判断，其他成员依旧可以接单、跟进客户。</div
      >
    </div>
    <div class="part-title">
      <span class="main-text">未打通电话自动生成跟进记录</span>
      <el-switch v-model="ruleForm.autoCreateFollowPlan" :active-value="1" :inactive-value="0" />
    </div>
    <div class="config-form-item">
      <span>未打通客户电话每日最少跟进次数</span>
      <el-input-number
        v-model.number="ruleForm.notGetThroughLeastFollowNum"
        class="number-input"
        :max="99999"
        step-strictly
        :step="1"
        :controls="false"
      />
      <span>次</span>
    </div>
    <div class="config-form-item mt-15px">
      <span>*下次跟进时间</span>
      <el-input-number
        v-model.number="ruleForm.clueFollowConfigHour"
        class="number-input"
        :max="99999"
        step-strictly
        :step="1"
        :controls="false"
      />
      <span>小时后</span>
    </div>
    <div class="part-title mt-30px">
      <span class="main-text">短信联系客户自动生成跟进记录</span>
      <el-switch v-model="ruleForm.smsAutoCreateFollowPlan" :active-value="1" :inactive-value="0" />
    </div>
    <div class="config-form-item mt-15px" v-if="ruleForm.smsAutoCreateFollowPlan === 1">
      <span>下次跟进时间</span>
      <el-input-number
        v-model.number="ruleForm.smsClueFollowConfigHour"
        class="number-input"
        :max="99999"
        step-strictly
        :step="1"
        :controls="false"
      />
      <span>小时后</span>
    </div>
    <div class="part-title mt-30px">
      <span class="main-text">线索跟进方式配置</span>
      <span class="sub-text">（跟进方式为电话时，必须配置为可选择）</span>
    </div>
    <el-button type="primary" class="mb-26px">编辑</el-button>
    <el-button type="primary" class="mb-26px" @click="handleAddRow">新增行</el-button>
    <el-table
      :data="ruleForm.followMethodList"
      class="custom-table"
      max-height="300px"
      style="max-width: 1220px"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="date" label="跟进方式" width="180">
        <template #default="{ row }">
          <el-select v-model="row.followMethod">
            <el-option label="1" value="2" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="是否可选择" width="180">
        <template #default="{ row }">
          <el-switch v-model="row.isSelect" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="使用岗位" />
      <el-table-column prop="address" label="首次跟进是否允许选择" />
      <el-table-column prop="address" label="操作" width="100px">
        <template #default="{ $index }">
          <el-button type="primary" link @click="handleDeleteRow($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="part-title mt-30px">
      <span class="main-text">首次跟进未打通电话弹窗提示</span>
      <el-switch
        v-model="ruleForm.clueNotGetThroughHintStatus"
        :active-value="1"
        :inactive-value="0"
      />
    </div>
    <div class="config-form-item">
      <span>首次跟进线索客户，未打通客户电话：</span>
      <el-input-number
        v-model.number="ruleForm.clueNotGetThroughHintMinute"
        class="number-input"
        :max="99999"
        step-strictly
        :step="1"
        :controls="false"
      />
      <span>分钟后，弹窗提醒对应接单人进行再次拨号；</span>
    </div>
    <div class="config-form-item mt-15px">
      <span>当天最多弹窗提醒次数：</span>
      <el-input-number
        v-model.number="ruleForm.clueNotGetThroughHintDayNumber"
        class="number-input"
        :max="99999"
        step-strictly
        :step="1"
        :controls="false"
      />
    </div>
    <div class="config-form-item mt-15px">
      <span>单条线索最多弹窗提醒次数：</span>
      <el-input-number
        v-model.number="ruleForm.clueNotGetThroughHintTotalNumber"
        class="number-input"
        :max="99999"
        step-strictly
        :step="1"
        :controls="false"
      />
    </div>
    <div class="config-form-item mt-15px">
      <span>弹窗提醒时间段设置（在设置的时间段内才可弹窗提醒）：</span>
    </div>
    <div class="mt-15px">
      <el-button type="primary">编辑</el-button>
      <el-button type="primary" @click="handleAddTime">增加时间段</el-button>
    </div>
    <div class="mb-36px">
      <div v-for="(item, index) in ruleForm.timeList" :key="index" class="config-form-item mt-15px">
        <span class="mr-8px">时间段</span>
        <el-time-select
          v-model="item.startTime"
          :max-time="item.endTime"
          placeholder="开始时间"
          start="00:00"
          step="00:05"
          end="23:55"
          style="width: 130px"
        />
        <span class="ml-8px mr-8px">-</span>
        <el-time-select
          v-model="item.endTime"
          :min-time="item.startTime"
          placeholder="结束时间"
          start="00:00"
          step="00:05"
          end="23:55"
          class="mr-8px"
          style="width: 130px"
        />
        <Icon icon="ep:remove" class="toggle-icon" @click="handleDelTime(index)" color="#FF4141" />
      </div>
    </div>
  </div>
  <div class="bottom-btns">
    <el-button type="primary" size="large">保存设置</el-button>
  </div>
</template>

<script setup lang="ts">
const ruleForm = reactive({
  cancelFollowPlan: 0, // 客户到店后是否取消对应有效线索的跟进计划
  autoCreateFollowPlan: 0, // 未打通电话自动生成跟进记录
  notGetThroughLeastFollowNum: null, // 未打通客户电话每日最少跟进次数
  clueFollowConfigHour: null, // 下次跟进时间
  smsAutoCreateFollowPlan: 0, // 短信联系客户自动生成跟进记录
  smsClueFollowConfigHour: null, // 短信下次跟进时间
  followMethodList: [], // 线索跟进方式配置
  clueNotGetThroughHintStatus: 0, // 首次跟进未打通电话弹窗提示
  clueNotGetThroughHintMinute: null, // 首次跟进线索客户，未打通客户电话：...
  clueNotGetThroughHintDayNumber: null, // 当天最多弹窗提醒次数
  clueNotGetThroughHintTotalNumber: null, // 单条线索最多弹窗提醒次数
  timeList: [] // 时间段 {startTime: 00:00, endTime: 23:59}
})

const handleAddRow = () => {
  ;(ruleForm.followMethodList as any[]).unshift({
    followMethod: null,
    isSelect: 0,
    applyPositionType: 1,
    limitRoleList: [],
    isPermitFirstSelect: 0
  })
}
const handleDeleteRow = (index) => {
  ruleForm.followMethodList.splice(index, 1)
}
const handleAddTime = () => {
  ruleForm.timeList.push({ startTime: null, endTime: null })
}
const handleDelTime = (index) => {
  ruleForm.timeList.splice(index, 1)
}
</script>

<style scoped lang="scss">
@import '../style/index';
.follow-container {
  min-height: 100%;
  padding-bottom: $btnWrapHeight;
}
.bottom-btns {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  text-align: center;
  line-height: $btnWrapHeight;
  height: $btnWrapHeight;
  background-color: var(--page-bg-color);
  box-shadow: 0px -5px 8px 0px rgba(210, 210, 210, 0.2);
}
</style>
