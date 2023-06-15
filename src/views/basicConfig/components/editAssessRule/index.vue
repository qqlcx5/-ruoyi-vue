<template>
  <div class="edit-assess-rule-dialog">
    <el-dialog
      class="custom-dialog"
      :model-value="props.modelValue"
      title="新增"
      width="665px"
      :before-close="handleClose"
    >
      <el-form ref="formRef" :rules="rules" :model="ruleForm">
        <el-form-item label="规则名称" label-width="70px">
          <el-input
            placeholder="请输入规则名称"
            maxlength="20"
            show-word-limit
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="适用门店" label-width="70px">
          <el-select style="width: 240px">
            <el-option label="1" value="2" />
          </el-select>
        </el-form-item>
        <el-divider />
        <div class="form-title">考核规则设置</div>
        <div class="form-sub-title">考核时间设置</div>
        <div class="form-tip-text"
          >（在设置的时段内，才会计算线索的逾期时间，时间段以外不进行逾期时间计算）</div
        >
        <div class="mt-15px mb-15px">
          <el-button type="primary">编辑</el-button>
          <el-button type="primary" @click="handleAddTime">增加时间段</el-button>
        </div>
        <el-form-item v-for="(item, index) in [{ startTime: '', endTime: '' }]" :key="index">
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
            end="24:00"
            class="mr-8px"
            style="width: 130px"
          />
          <Icon
            icon="ep:remove"
            class="toggle-icon"
            @click="handleDelTime(index)"
            color="#FF4141"
          />
        </el-form-item>
        <div class="form-sub-title mb-15px">
          <span class="mr-8px">接单逾期设置</span>
          <el-switch :active-value="1" :inactive-value="0" />
        </div>
        <el-form-item label="">
          <span>线索接单判定“一般逾期”为派单后</span>
          <el-input-number :controls="false" /><span>分钟接单</span>
        </el-form-item>
        <el-form-item label="">
          <span>线索接单判定“严重逾期”为派单后</span>
          <el-input-number :controls="false" /><span>分钟接单</span>
        </el-form-item>
        <div class="form-sub-title mb-15px">
          <span class="mr-8px">首次跟进逾期设置</span>
          <el-switch :active-value="1" :inactive-value="0" />
        </div>
        <el-form-item label="">
          <span>线索首次跟进判定“一般逾期”为派单后</span>
          <el-input-number :controls="false" /><span>分钟跟进</span>
        </el-form-item>
        <el-form-item label="">
          <span>线索首次跟进判定“严重逾期”为派单后</span>
          <el-input-number :controls="false" /><span>分钟跟进</span>
        </el-form-item>
        <div class="form-sub-title mb-15px">
          <span class="mr-8px">常规跟进逾期设置</span>
          <el-switch :active-value="1" :inactive-value="0" />
        </div>
        <el-form-item label="">
          <span>线索常规跟进逾期界限时间配置：计划跟进时间当日</span>
          <el-input-number :controls="false" />
        </el-form-item>
        <el-form-item label="">
          <span>线索常规跟进判定“一般逾期”为计划跟进时间当日22:00+</span>
          <el-input-number :controls="false" /><span>分钟后跟进</span>
        </el-form-item>
        <el-form-item label="">
          <span>线索常规跟进判定“严重逾期”为计划跟进时间当日22:00+</span>
          <el-input-number :controls="false" /><span>分钟后跟进</span>
        </el-form-item>
        <div class="form-sub-title mb-15px">
          <span class="mr-8px">回收设置</span>
          <el-switch :active-value="1" :inactive-value="0" />
        </div>
        <el-form-item label="">
          <el-input-number :controls="false" style="margin-left: 0px" />
          <span>分钟未进行跟进，则对线索进行回收重新派发</span>
        </el-form-item>
        <div class="form-sub-title mb-10px"><span>其他设置</span></div>
        <el-form-item label="" style="margin-bottom: 0px">
          <span>已派发的线索，是否允许再次增加派发成员：</span>
          <el-switch :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="">
          <span>成员已接单的有效线索，是否允许共享给其他成员进行跟进：</span>
          <el-switch :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  modelValue: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false
})
interface IEmit {
  (event: 'update:modelValue', modelValue: boolean): void
}
const emit = defineEmits<IEmit>()
const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  handleClose()
}
</script>

<style lang="scss">
.edit-assess-rule-dialog {
  @import '../../style/index';
  .el-form {
    padding: 0 20px;
  }
  .el-dialog__body {
    height: 450px;
    overflow: auto;
    padding-left: 0 !important;
    padding-right: 0 !important;
    .el-divider {
      width: calc(100% + 40px);
      margin-left: -20px;
    }
    .form-title {
      position: relative;
      line-height: 22px;
      font-size: 16px;
      font-weight: bold;
      color: $title-color;
      margin-bottom: 20px;
      &::before {
        content: '';
        position: absolute;
        left: -6px;
        top: calc(50% - 7px);
        display: block;
        width: 3px;
        height: 14px;
        background-color: $wg-primary-color;
      }
    }
    .form-sub-title {
      line-height: 20px;
      font-size: 14px;
      font-weight: bold;
      color: $title-color;
    }
    .form-tip-text {
      line-height: 20px;
      font-size: 14px;
      color: $tip-color;
      margin-top: 8px;
    }
    .el-switch {
      height: 20px;
    }
    .el-input-number {
      width: 120px;
      margin: 0 8px;
    }
  }
}
</style>
