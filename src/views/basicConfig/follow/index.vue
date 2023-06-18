<template>
  <div
    class="basic-config-content follow-container"
    v-loading="loading"
    :style="{ height: loading ? '100%' : '' }"
  >
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
      <span>无通话录音打通客户电话是否允许独享线索：</span>
      <el-switch v-model="ruleForm.clueGrabEnjoyStatus" :active-value="1" :inactive-value="0" />
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
        step-strictly
        :step="1"
        :controls="false"
      />
      <span>次</span>
    </div>
    <div class="config-form-item mt-15px">
      <span>下次跟进时间</span>
      <el-input-number
        v-model.number="ruleForm.clueFollowConfigHour"
        class="number-input"
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
    <el-button v-if="!editFlag" type="primary" class="mb-26px" @click="editFollowMethod(true)"
      >编辑</el-button
    >
    <div v-else class="mb-26px">
      <el-button type="primary" @click="editFollowMethod(false)">完成</el-button>
      <el-button type="primary" @click="handleAddRow">新增行</el-button>
    </div>
    <el-form :model="ruleForm" :disabled="!editFlag">
      <el-table
        ref="tableRef"
        :data="ruleForm.followMethodList"
        class="custom-table"
        max-height="300px"
        style="max-width: 1220px"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="date" label="跟进方式" width="180">
          <template #default="{ row }">
            <el-select v-model="row.followMethod" @change="followMethodChange($event, row)">
              <el-option
                v-for="item in dictFollowMethod"
                :label="item.text"
                :value="+item.value"
                :key="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="是否可选择" width="180">
          <template #default="{ row }">
            <el-switch
              v-model="row.isSelect"
              :disabled="row.followMethod === 1"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="适用岗位">
          <template #default="{ row }">
            <el-select
              multiple
              collapse-tags
              collapse-tags-tooltip
              value-key="roleId"
              v-model="row.limitRoleList"
              @change="roleChange($event, row)"
            >
              <el-option
                v-for="item in postList"
                :label="item.roleName"
                :value="item"
                :key="item.roleId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="首次跟进是否允许选择">
          <template #default="{ row }">
            <el-switch v-model="row.isPermitFirstSelect" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="100px">
          <template #default="{ $index }">
            <el-button type="primary" link @click="handleDeleteRow($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="part-title mt-30px">
      <span class="main-text">首次跟进未打通电话弹窗提示</span>
      <el-switch
        v-model="ruleForm.clueNotGetThroughHintConfigVO.clueNotGetThroughHintStatus"
        :active-value="1"
        :inactive-value="0"
      />
    </div>
    <div class="config-form-item">
      <span>首次跟进线索客户，未打通客户电话：</span>
      <el-input-number
        v-model.number="ruleForm.clueNotGetThroughHintConfigVO.clueNotGetThroughHintMinute"
        class="number-input"
        step-strictly
        :step="1"
        :controls="false"
      />
      <span>分钟后，弹窗提醒对应接单人进行再次拨号；</span>
    </div>
    <div class="config-form-item mt-15px">
      <span>当天最多弹窗提醒次数：</span>
      <el-input-number
        v-model.number="ruleForm.clueNotGetThroughHintConfigVO.clueNotGetThroughHintDayNumber"
        class="number-input"
        step-strictly
        :step="1"
        :controls="false"
      />
    </div>
    <div class="config-form-item mt-15px">
      <span>单条线索最多弹窗提醒次数：</span>
      <el-input-number
        v-model.number="ruleForm.clueNotGetThroughHintConfigVO.clueNotGetThroughHintTotalNumber"
        class="number-input"
        step-strictly
        :step="1"
        :controls="false"
      />
    </div>
    <div class="config-form-item mt-15px">
      <span>弹窗提醒时间段设置（在设置的时间段内才可弹窗提醒）：</span>
    </div>
    <div id="time-range" class="mt-15px">
      <el-button v-if="!editTimeFlag" type="primary" @click="timeEdit(true)">编辑</el-button>
      <template v-else>
        <el-button type="primary" @click="timeEdit(false)">保存</el-button>
        <el-button type="primary" @click="handleAddTime">增加时间段</el-button>
      </template>
    </div>

    <div class="mb-36px">
      <el-form ref="timeFormRef" :model="timeList" :disabled="!editTimeFlag" scroll-to-error>
        <div
          v-for="(item, index) in timeList"
          :key="item.timestamp"
          class="config-form-item mt-15px"
        >
          <span class="mr-8px">时间段</span>
          <el-form-item
            :prop="`${index}.arr`"
            :rules="[{ required: true, message: '请选择时间段', trigger: 'change' }]"
            style="margin-bottom: 0"
          >
            <el-time-picker
              v-model="item.arr"
              is-range
              format="HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              class="mr-8px"
              style="flex: unset; width: 240px"
            />
          </el-form-item>
          <Icon
            v-if="editTimeFlag"
            icon="ep:remove"
            class="toggle-icon"
            @click="handleDelTime(index)"
            color="#FF4141"
            style="cursor: pointer"
          />
        </div>
      </el-form>
    </div>
  </div>
  <div class="bottom-btns">
    <el-button type="primary" size="large" :loading="btnLoading" @click="handleSave"
      >保存设置</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { queryClueFollowConfig, saveClueFollowConfig } from '@/api/clue/basicConfig'
import { postListAllSimple } from '@/api/common/index'
import { judgeTimeList } from '@/utils/utils'
import type { FormInstance, ElTable } from 'element-plus'
import dayjs from 'dayjs'

const message = useMessage()
let ruleForm = reactive({
  cancelFollowPlan: 0, // 客户到店后是否取消对应有效线索的跟进计划
  clueGrabEnjoyStatus: 0, // 无通话录音打通客户电话是否允许独享线索
  autoCreateFollowPlan: 0, // 未打通电话自动生成跟进记录
  notGetThroughLeastFollowNum: null, // 未打通客户电话每日最少跟进次数
  clueFollowConfigHour: null, // 下次跟进时间
  smsAutoCreateFollowPlan: 0, // 短信联系客户自动生成跟进记录
  smsClueFollowConfigHour: null, // 短信下次跟进时间
  followMethodList: [], // 线索跟进方式配置
  clueNotGetThroughHintConfigVO: {
    // 未通电话提示配置
    clueNotGetThroughHintStatus: 0, // 首次跟进未打通电话弹窗提示
    clueNotGetThroughHintMinute: null, // 首次跟进线索客户，未打通客户电话：...
    clueNotGetThroughHintDayNumber: null, // 当天最多弹窗提醒次数
    clueNotGetThroughHintTotalNumber: null, // 单条线索最多弹窗提醒次数
    timeList: [] as object[] // 时间段 {startTime: 00:00, endTime: 23:59}
  }
})
const dictFollowMethod = [
  { text: '电话', value: '1' },
  { text: '微信', value: '2' },
  { text: '短信', value: '3' }
]
const followMethodChange = (val, row) => {
  if (val === 1) {
    row.isSelect = 1
  }
}
let postList = reactive<object[]>([])
const getPostList = () => {
  postListAllSimple().then((data) => {
    console.log(data)
    postList = reactive(data.map((d) => ({ roleId: d.id, roleName: d.name })))
  })
}
getPostList()
const roleChange = (val, row) => {
  row.applyPositionType = val.length ? 2 : 1
  console.log(val)
}

// 获取详情
const loading = ref<boolean>(false)
const getInfo = async () => {
  try {
    loading.value = true
    const data = await queryClueFollowConfig()
    ruleForm = reactive(data)
    const arr = ruleForm?.clueNotGetThroughHintConfigVO?.timeList || []
    dealTimeList(arr)
  } finally {
    loading.value = false
  }
}
getInfo()

// 跟进发放
const editFlag = ref<boolean>(false)
const editFollowMethod = (bool) => {
  editFlag.value = bool
}
const tableRef = ref<InstanceType<typeof ElTable>>()
const handleAddRow = async () => {
  if (!ruleForm.followMethodList) {
    ruleForm.followMethodList = []
  }
  ;(ruleForm.followMethodList as any[]).push({
    followMethod: null, // 跟进方式（1-电话，2-微信 3-短信）
    isSelect: 0, // 是否可选择 0-否 1-是
    applyPositionType: 1, // 适用岗位类型 1-不限 2-部分岗位
    limitRoleList: [], // 限制岗位 [{roleId, roleName}]
    isPermitFirstSelect: 0 // 首次跟进是否允许选择 0-否 1-是
  })
  await nextTick()
  tableRef.value?.setScrollTop(ruleForm.followMethodList.length * 50)
}
const handleDeleteRow = (index) => {
  ruleForm.followMethodList.splice(index, 1)
}

// 处理时间段数据
const timeList = ref<object[]>([])
const dealTimeList = (list) => {
  const nowDate = dayjs().format('YYYY-MM-DD ')
  timeList.value = list.map((d) => {
    return {
      timestamp: new Date().getTime(),
      arr: [nowDate + d.startTime, nowDate + d.endTime]
    }
  })
}
// 时间段编辑
const editTimeFlag = ref<boolean>(false)
const timeFormRef = ref<FormInstance>()
const timeEdit = async (bool) => {
  if (bool === false) {
    try {
      await timeFormRef.value?.validate()
    } catch (e) {
      return false
    }
    const arr = timeList.value.map((d) => {
      return {
        startTime: dayjs(d['arr'][0]).format('HH:mm'),
        endTime: dayjs(d['arr'][1]).format('HH:mm')
      }
    })
    const vali = judgeTimeList(arr)
    if (!vali) {
      const dom = document.querySelector('#time-range')
      dom && dom.scrollIntoView({ behavior: 'smooth' })
      message.error('时间段不能重叠!')
      return false
    }
    ruleForm.clueNotGetThroughHintConfigVO.timeList = arr
    editTimeFlag.value = bool
    return true
  } else {
    editTimeFlag.value = bool
  }
}
// 添加时间段
const handleAddTime = async () => {
  timeList.value.push({
    timestamp: new Date().getTime(),
    arr: []
  })
  await nextTick()
  const dom = document.querySelector('#time-range')
  dom && dom.scrollIntoView({ behavior: 'smooth' })
}
const handleDelTime = (index) => {
  timeList.value.splice(index, 1)
}

// 保存
const btnLoading = ref<boolean>(false)
const handleSave = async () => {
  try {
    if (editTimeFlag.value && !(await timeEdit(false))) return
    editFlag.value = false
    btnLoading.value = true
    await saveClueFollowConfig(ruleForm)
    message.success('保存成功')
  } finally {
    btnLoading.value = false
  }
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
