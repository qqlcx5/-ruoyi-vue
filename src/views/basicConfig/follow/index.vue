<template>
  <div class="basic-config-content follow-container">
    <div class="part-title">
      <span class="main-text">取消跟进设置</span>
    </div>
    <div class="config-form-item">
      <span>客户到店后是否取消对应有效线索的跟进计划：</span>
      <el-switch v-model="bool" />
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
      <span>无通话录音打通客户电话是否允许独享线索：</span>
      <el-switch v-model="bool" />
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
      <el-switch v-model="bool" />
    </div>
    <div class="config-form-item">
      <span>*未打通客户电话每日最少跟进次数</span>
      <el-input-number
        v-model.number="num"
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
        v-model.number="num"
        class="number-input"
        :max="99999"
        step-strictly
        :step="1"
        :controls="false"
      />
      <span>小时后</span>
    </div>
    <div class="part-title mt-30px">
      <span class="main-text">未打通电话自动生成跟进记录</span>
      <el-switch v-model="bool" />
    </div>
    <div class="config-form-item mt-15px">
      <span>*下次跟进时间</span>
      <el-input-number
        v-model.number="num"
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
    <el-table :data="[{}]" class="custom-table" style="max-width: 1220px">
      <el-table-column type="index" width="50" />
      <el-table-column prop="date" label="跟进方式" width="180" />
      <el-table-column prop="name" label="是否可选择" width="180" />
      <el-table-column prop="address" label="使用岗位" />
      <el-table-column prop="address" label="首次跟进是否允许选择" />
      <el-table-column prop="address" label="操作" width="100px" />
    </el-table>
    <div class="part-title mt-30px">
      <span class="main-text">首次跟进未打通电话弹窗提示</span>
      <el-switch v-model="bool" />
    </div>
    <div class="config-form-item">
      <span>首次跟进线索客户，未打通客户电话：</span>
      <el-input-number
        v-model.number="num"
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
        v-model.number="num"
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
        v-model.number="num"
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
    <el-button type="primary" class="mt-15px">编辑</el-button>
    <div class="config-form-item mt-15px mb-36px">
      <span>时间段</span>
      <el-input-number
        v-model.number="num"
        class="number-input"
        :max="99999"
        step-strictly
        :step="1"
        :controls="false"
      />
    </div>
  </div>
  <div class="bottom-btns">
    <el-button type="primary" size="large">保存设置</el-button>
  </div>
</template>

<script setup lang="ts">
const num = ref<number>()
const bool = ref<boolean>(false)
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
