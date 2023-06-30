<template>
  <el-card class="mb-24px" v-loading="visitConfig.loading">
    <template #header>
      <div class="card-header">是否允许未关联录音保存回访记录</div>
    </template>
    <div v-for="item in visitConfig.visitTypeSetting" :key="item.key">
      <div>{{ item.value }}</div>
      <el-switch
        v-model="item.status"
        :active-value="1"
        :inactive-value="0"
        @change="onVisitTypeSettingSwitchChange"
      />
    </div>
    <div class="tip-text">
      <div>说明</div>
      <div>1、如果开启，则允许有拨打记录时，未关联通话录音进行保存回访记录</div>
      <div>2、如果关闭，则需关联了通话记录，才能保存回访记录</div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import {
  getVisitTypeList,
  queryVisitSettingCallRecord,
  saveVisitSettingCallRecord
} from '@/api/visit'

const message = useMessage()

const visitConfig = reactive<any>({
  loading: false,
  options: {
    type: []
  },
  visitTypeSetting: []
})
/** 是否允许未关联录音保存回访记录 **/
const onVisitTypeSettingSwitchChange = () => {
  visitConfig.loading = true
  const params = visitConfig.visitTypeSetting.map((item) => {
    return {
      associatedCall: item.status,
      visitType: item.key
    }
  })
  saveVisitSettingCallRecord(params)
    .then((res) => {
      if (!res) return message.error('操作失败')
      message.success('保存成功！')
    })
    .finally(() => {
      getVisitSettingCallRecord()
      visitConfig.loading = false
    })
}
const getVisitSettingCallRecord = async () => {
  const res = await queryVisitSettingCallRecord()
  visitConfig.visitTypeSetting = visitConfig.options.type.map((item) => {
    let idx = res.find((i) => i.visitType === item.key)
    item['status'] = idx ? idx.associatedCall : 0
    return item
  })
}

onMounted(() => {
  Promise.all([getVisitTypeList()]).then((res) => {
    visitConfig.options.type = res[0]
    getVisitSettingCallRecord()
  })
})
</script>
