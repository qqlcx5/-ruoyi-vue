<template>
  <div class="dcc-edit-container">
    <div class="page-title">DCC考核设置</div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="DCC规则名称" label-width="100" prop="name">
        <el-input
          v-model.trim="ruleForm.name"
          maxlength="20"
          show-word-limit
          placeholder="请输入DCC规则名称"
          style="width: 340px"
        />
      </el-form-item>
      <el-form-item label="适用门店" label-width="100" prop="shop">
        <el-select v-model="ruleForm.shop" clearable>
          <el-option label="132" value="333" />
        </el-select>
      </el-form-item>
      <el-table :data="ruleForm.examineSetList" class="custom-table mb-30px">
        <el-table-column label="意向等级" />
        <el-table-column label="可选择性" min-width="220px">
          <template #default="{ row }">
            <span>派单时间后</span>
            <el-input-number
              :controls="false"
              v-model="row.selectivityTime"
              step-strictly
              :step="1"
              :min="0"
              :max="99999"
              class="input-w-90px"
            />
            <span>时</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进周期" min-width="650px">
          <template #default="{ row, $index }">
            <div
              class="cycle-item"
              v-for="(item, cIndex) in row.followUpCycleList"
              :key="item.timestamp"
            >
              <span>派单时间后</span>
              <el-input-number
                :controls="false"
                v-model="item.beginHour"
                step-strictly
                :step="1"
                :min="0"
                :max="99999"
                class="input-w-90px"
              />
              <span>至</span>
              <el-input-number
                :controls="false"
                v-model="item.endHour"
                step-strictly
                :step="1"
                :min="0"
                :max="99999"
                class="input-w-90px"
              />
              <span>小时内，每</span>
              <el-input-number
                :controls="false"
                v-model="item.everyHourFollow"
                step-strictly
                :step="1"
                :min="0"
                :max="99999"
                class="input-w-90px"
              />
              <span>小时内必须跟进</span>
              <Icon
                v-if="row.followUpCycleList.length - 1 === cIndex"
                icon="ep:circle-plus"
                class="toggle-icon"
                @click="handleAddRow($index)"
                color="#0081FF"
              />
              <Icon
                v-if="row.followUpCycleList.length > 1"
                icon="ep:remove"
                class="toggle-icon"
                @click="handleDelRow(row.followUpCycleList, cIndex)"
                color="#FF4141"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否可战败" min-width="100px">
          <template #default="{ row }">
            <el-switch v-model="row.failStatus" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="可战败起始时间" min-width="220px">
          <template #default="{ row }">
            <span>派单时间后</span>
            <el-input-number
              :controls="false"
              v-model="row.failStartTime"
              step-strictly
              :step="1"
              :min="0"
              :max="99999"
              class="input-w-90px"
            />
            <span>时</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-switch v-model="row.status" />
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="" label-width="0">
        <span class="mr-8px">线索有效率</span
        ><el-switch
          v-model="ruleForm.monthEffectiveRateStatus"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="" label-width="0">
        <el-radio-group v-model="ruleForm.effectiveRateType">
          <el-radio :label="1">按天</el-radio>
          <el-radio :label="2">按自然月</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" label-width="0">
        <span>每个成员的线索无效率不超过</span>
        <el-input-number
          v-model="ruleForm.effectiveRate"
          step-strictly
          :step="1"
          :min="0"
          :max="100"
          :controls="false"
          class="input-w-90px"
        />
        <span>%</span>
      </el-form-item>
      <el-form-item label="" label-width="0">
        <span class="mr-8px">DCC规则说明</span
        ><el-switch v-model="ruleForm.dccExplainStatus" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <Editor v-model="ruleForm.dccExplain" class="mb-20px" :height="220" style="width: 600px" />
    </el-form>
  </div>
  <div class="bottom-btns">
    <el-button type="primary" size="large" @click="handleSave">保存设置</el-button>
  </div>
</template>

<script setup lang="ts">
import type { FormRules } from 'element-plus'

const ruleForm = reactive({
  examineSetList: [
    {
      selectivityTime: null, // 可选择性
      followUpCycleList: [{ beginHour: null, endHour: null, everyHourFollow: null }],
      failStatus: 0, // 是否可战败
      failStartTime: null, // 可战败起始时间
      status: 0 // 状态
    }
  ],
  monthEffectiveRateStatus: 0, // 线索有效率
  effectiveRateType: 1, // 按天、按自然月
  effectiveRate: null, // 每个成员的线索无效率不超过
  dccExplainStatus: 0, // DCC规则说明
  dccExplain: '' // editor
})
const rules = reactive<FormRules>({})
const handleAddRow = (index) => {
  const cycle = {
    beginHour: null,
    endHour: null,
    everyHourFollow: null,
    timestamp: new Date().getTime()
  }
  ruleForm.examineSetList[index].followUpCycleList.push(cycle)
  console.log(cycle)
}
const handleDelRow = (list, index) => {
  // console.log(item)
  list.splice(index, 1)
}
const handleSave = () => {
  console.log(ruleForm)
}
</script>

<style scoped lang="scss">
@import '../style/index';
.dcc-edit-container {
  min-height: 100%;
  padding: 22px 30px $btnWrapHeight;
  background-color: var(--page-bg-color);
  .page-title {
    line-height: 25px;
    font-size: 14px;
    font-weight: bold;
    color: $title-color;
    padding-bottom: 10px;
    border-bottom: 1px solid $border-color;
    margin-bottom: 25px;
  }
  .input-w-90px {
    width: 90px;
    margin: 0 8px;
    :deep(.el-input__inner) {
      text-align: left;
    }
  }
  .toggle-icon {
    cursor: pointer;
    margin-left: 4px;
    vertical-align: middle;
  }
  .cycle-item + .cycle-item {
    margin-top: 8px;
  }
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
