<template>
  <div class="visit-rule-item" v-loading="loading">
    <div class="item-header flex items-center justify-between">
      <div class="flex items-center py-10px">
        <span v-if="ruleData">
          {{ ruleData.visitSettingTypeStr }}-{{ ruleData.visitSettingPurposeStr }}
        </span>
      </div>
      <div>
        <el-switch
          v-model="ruleData.visitFlag"
          :active-value="1"
          :inactive-value="0"
          @change="onRuleStatusChange($event, 'visitFlag')"
        />
        <el-link class="ml-15px" type="primary" :underline="false" @click="onEdit">编辑</el-link>
        <el-link class="ml-15px" type="primary" :underline="false" @click="onDelete">删除</el-link>
      </div>
    </div>
    <el-descriptions :column="2" border>
      <el-descriptions-item
        v-for="item in columns"
        :key="item.key"
        label-align="left"
        class-name="desc-content"
        label-class-name="desc-label"
        width="25%"
      >
        <template #label>
          <div class="flex items-center w-136px overflow-hidden">
            {{ item.label }}
            <el-tooltip v-if="item.tip" effect="dark" :content="item.tip">
              <el-icon class="ml-4px"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <div v-if="ruleData" class="content">
          <el-switch
            v-if="['overdueFlag', 'recycleFlag'].includes(item.key)"
            v-model="ruleData[item.key]"
            :active-value="1"
            :inactive-value="0"
            @change="onRuleStatusChange($event, item.key)"
          />
          <div v-else-if="['visitLimitDay', 'visitTimeoutDay'].includes(item.key)">
            T + {{ ruleData[item.key] }} 天
          </div>
          <div v-else-if="['advanceDays'].includes(item.key)">
            T + {{ ruleData.extInfoVo ? ruleData.extInfoVo['advanceDays'] : '' }} 天
          </div>
          <div v-else-if="['overdueGeneral', 'overdueSerious'].includes(item.key)">
            N + {{ ruleData.extInfoVo ? ruleData.extInfoVo[item.key] : '' }} min
          </div>
          <div v-else-if="['overdueRecycle'].includes(item.key)">
            X + {{ ruleData.extInfoVo ? ruleData.extInfoVo[item.key] : '' }} min
          </div>
          <el-tooltip v-else placement="top-start">
            <template #content>
              <div class="max-w-300px">
                {{ item.extInfo ? ruleData[item.extInfo][item.key] : ruleData[item.key] }}
              </div>
            </template>
            {{ item.extInfo ? ruleData[item.extInfo][item.key] : ruleData[item.key] }}
          </el-tooltip>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { updateVisit, visitDel, updateOverdueFlag, updateOverDueRecycle } from '@/api/visit'
import { getDictLabel } from '@/utils/dict'

const message = useMessage()

const emit = defineEmits(['load', 'edit'])
const props = defineProps({
  rule: { type: Object, default: () => {} }
})
const ruleData = ref()
const loading = ref<boolean>(false)

watch(
  () => props.rule,
  (val) => {
    val['distributeRoleStr'] = val.distributeRoleList
      ? val.distributeRoleList.map((i) => i.value).join('、')
      : ''
    val['shopDTOStr'] = val.shopDTOList ? val.shopDTOList.map((i) => i.shopName).join('、') : ''
    val['applyShopDTOStr'] = val.applyShopDTOList
      ? val.applyShopDTOList.map((i) => i.shopName).join('、')
      : ''
    val['visitObjectStr'] = getDictLabel('visit_object', val.visitObject)
    ruleData.value = val
  },
  {
    immediate: true,
    deep: true
  }
)

const columns = reactive([
  { label: '参考时间(T）', key: 'originTimeTypeStr' },
  { label: '一般逾期时间', key: 'overdueGeneral', extInfo: 'extInfoVo' },
  { label: '生成时间', key: 'advanceDays', extInfo: 'extInfoVo' },
  {
    label: '严重逾期时间',
    key: 'overdueSerious',
    extInfo: 'extInfoVo',
    tip: '严重逾期时间＞一般逾期时间'
  },
  { label: '计划回访时间(N)', key: 'visitLimitDay', tip: '生成时间≤计划回访时间' },
  {
    label: '00:00开始计算逾期',
    key: 'overdueFlag',
    tip: '开启：00:00开始计算逾期，关闭：计划开始时间后立刻开始计算逾期'
  },
  {
    label: '过期时间',
    key: 'visitTimeoutDay',
    tip: '过期时间＞计划回访时间'
  },
  { label: '开启回收规则', key: 'recycleFlag' },
  { label: '回访岗位', key: 'roleName' },
  {
    label: '回收时间',
    key: 'overdueRecycle',
    extInfo: 'extInfoVo',
    tip: 'X＝计划回访时间/分配时间/转派时间'
  },
  { label: '分配岗位', key: 'distributeRoleStr' },
  { label: '不适用门店', key: 'shopDTOStr' },
  { label: '回访对象', key: 'visitObjectStr' },
  { label: '适用门店', key: 'applyShopDTOStr' }
])
const onRuleStatusChange = async (val, type) => {
  loading.value = true
  const params = { id: ruleData.value.visitSettingId }
  let res
  if (type === 'visitFlag') {
    res = await updateVisit(params).finally(() => (loading.value = false))
  } else if (type === 'overdueFlag') {
    res = await updateOverdueFlag(params).finally(() => (loading.value = false))
  } else if (type === 'recycleFlag') {
    res = await updateOverDueRecycle(params).finally(() => (loading.value = false))
  }
  if (!res) {
    emit('load')
    return message.error('操作失败')
  } else {
    message.success('操作成功')
  }
}
const onEdit = () => {
  emit('edit')
}
const onDelete = async () => {
  message.wgOperateConfirm('确认删除当前数据？', '提示').then(async (res) => {
    if (res === 'confirm') {
      await visitDel({
        visitSettingIdList: [ruleData.value.visitSettingId]
      }).then((res) => {
        if (res) {
          message.success('删除成功')
          emit('load')
        } else {
          message.error('删除成功')
        }
      })
    }
    console.log(res)
  })
}
</script>

<style lang="scss">
.visit-rule-item {
  .desc-label {
    width: 144px !important;
    white-space: nowrap;
    background: #f3f8ff !important;
  }

  .desc-content {
    width: auto !important;
    word-wrap: break-word;
  }
}
</style>
<style lang="scss" scoped>
.visit-rule-item {
  margin-bottom: 16px;

  .item-header {
    padding: 0 14px;
    background-color: $table-head-color;
    border: 1px solid var(--el-border-color-lighter);
    border-bottom: none;
  }

  :deep(.el-descriptions__body .el-descriptions__table) {
    width: 100%;
    table-layout: fixed;
  }

  .content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
