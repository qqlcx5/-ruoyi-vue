<template>
  <div class="voice-content">
    <div class="title">{{ title }}</div>
    <div class="content">
      <el-button type="text" @click="playAudio(model, 3)">
        <i class="el-icon-video-play" v-if="isPlaying"></i>
        <i class="el-icon-video-pause" v-else></i>
      </el-button>
      <el-slider v-model="currentTime" :min="0" :max="totalTime" />
      <span>{{ currentTime || '00:00:00' }}/{{ totalTime || '00:00:00' }}</span>

      <el-button
        :type="true ? 'primary' : 'plain'"
        size="small"
        @click="translateAudio"
        v-if="translateContent.length === 0"
        >转文字
      </el-button>

      <el-button type="text" @click="downloadMp3(model.voiceAddressOut)" style="padding: 0">
        <i class="el-icon-download"></i>
      </el-button>
      <div v-if="translateContent.length > 0">
        <el-table :data="translateContent">
          <el-table-column prop="onebest" label="内容" />
        </el-table>
      </div>

      <audio src="playAudioSrc"></audio>
    </div>
  </div>
</template>

<script setup lang="ts" name="callRecord">
import { getCallRecordDetail, queryAudioContent } from '@/api/system/call/index'

onMounted(() => {
  queryCallRecordDetails()
})

const props = defineProps({
  title: { type: String, default: '混合录音' },
  callRecordId: { type: String, default: '' },
  businessType: { type: String, default: '' }
})

// const message = useMessage()

const model = ref<Object>({})
const isPlaying = ref(false)
const currentTime = ref(0)
const totalTime = ref(0)
const translateContent = ref<Object[]>([])
const queryCallRecordDetails = async () => {
  const data = await getCallRecordDetail(props.callRecordId)
  console.log(data, 'recorddetail')
  model.value = data
}
// 翻译文字
const translateAudio = async () => {
  const data = await queryAudioContent({
    businessType: props.businessType,
    callRecordId: props.callRecordId
  })
  let content = []
  JSON.parse(data).forEach((item) => {
    content.push(item)
  })
  translateContent.value = content
}
const playAudio = () => {}
const downloadMp3 = () => {}
</script>

<style lang="scss" scoped></style>
