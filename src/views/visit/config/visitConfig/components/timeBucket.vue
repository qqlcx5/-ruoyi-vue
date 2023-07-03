<template>
  <el-card class="mb-24px">
    <template #header>
      <div>
        <span class="card-header">回访考核时段配置</span>
        <span class="tip-text"
          >（在设置时间段内，才会计算回访的逾期时间，时间段以外不进行逾期时间计算）</span
        >
      </div>
    </template>
    <div>
      <template v-if="timeBucketConfig.operateState === 'edit'">
        <el-button type="primary" @click="timeBucketSave" :loading="timeBucketConfig.loading">
          保存
        </el-button>
        <el-button @click="timeBucketCancel">取消</el-button>
        <el-button type="primary" @click="timeBucketAdd"> 新增时间段 </el-button>
      </template>
      <el-button v-else type="primary" @click="timeBucketEdit">{{
        timeBucketConfig.periods.length ? '编辑' : '新增'
      }}</el-button>
      <el-descriptions :column="1" border class="w-500px mt-16px">
        <el-descriptions-item
          v-for="(item, index) in timeBucketConfig.periods"
          :key="index"
          label="时间段"
          align="center"
          width="100px"
        >
          <div
            v-if="timeBucketConfig.operateState === 'edit'"
            class="flex items-center justify-center"
          >
            <el-time-select
              class="w-150px"
              v-model="item.startTime"
              placeholder="起始时间"
              start="00:00"
              end="24:00"
              step="00:05"
            />
            <span class="px-8px"> - </span>
            <el-time-select
              class="w-150px"
              v-model="item.endTime"
              placeholder="结束时间"
              start="00:00"
              end="24:00"
              step="00:05"
              :min-time="item.startTime"
            />
            <i
              class="iconfont icon-cuowu ml-8px tip-text cursor-pointer"
              @click="timeBucketDelete(index)"
            ></i>
          </div>
          <div v-else class="leading-32px">{{ item.startTime }} - {{ item.endTime }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { queryVisitCheckTimeConfig, saveVisitCheckTimeConfig } from '@/api/visit'

const message = useMessage()

/** 回访考核时段配置 **/
const timeBucketConfig = reactive({
  loading: false,
  operateState: '',
  periods: []
})
const timeBucketEdit = async () => {
  timeBucketConfig.operateState = 'edit'
}
const timeBucketCancel = async () => {
  timeBucketConfig.operateState = ''
  getVisitCheckTimeConfig()
}
const timeBucketSave = async () => {
  if (timeBucketConfig.periods.some((item) => !item.startTime || !item.endTime)) {
    return message.error('请填写完整考核时间段')
  }
  timeBucketConfig.loading = true
  let params = { timeList: timeBucketConfig.periods }
  await saveVisitCheckTimeConfig(params)
    .then((res) => {
      res ? message.success('操作成功') : message.error('操作失败')
    })
    .finally(() => {
      timeBucketConfig.operateState = ''
      timeBucketConfig.loading = false
    })
}
const timeBucketAdd = async () => {
  timeBucketConfig.periods.push({ startTime: '', endTime: '' })
}
const timeBucketDelete = async (index) => {
  timeBucketConfig.periods.splice(index, 1)
}
const getVisitCheckTimeConfig = async () => {
  const res = await queryVisitCheckTimeConfig()
  timeBucketConfig.periods = res.timeList || []
}

onMounted(() => {
  getVisitCheckTimeConfig()
})
</script>
