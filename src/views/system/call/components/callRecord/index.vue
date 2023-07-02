<template>
  <div class="voice-content">
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="col-direction" v-if="isPlaying">
        <el-button class="btn" link type="primary" @click="playAudio(model, 3)">
          <el-icon :size="20">
            <video-play />
          </el-icon>
        </el-button>
        <span>播放</span>
      </div>
      <div class="col-direction" v-if="!isPlaying">
        <el-button class="btn" link type="primary" @click="pauseAudio(model, 3)">
          <el-icon :size="20">
            <video-pause />
          </el-icon>
        </el-button>
        <span>暂停</span>
      </div>
      <div class="el-slider">
        <el-slider v-model="currentTime" :min="0" :max="totalTime" />
        <span
          >{{ formatTime(currentTime) || '00:00:00' }}/{{
            formatTime(totalTime) || '00:00:00'
          }}</span
        >
      </div>
      <div class="col-direction">
        <el-button
          size="small"
          type="text"
          @click="translateAudio"
          v-if="translateContent.length === 0"
        >
          <el-icon :size="20">
            <Connection />
          </el-icon>
        </el-button>
        <span>转文字</span>
      </div>

      <div class="col-direction">
        <el-button
          type="text"
          @click="downloadFunc(model.voiceAddress, '录音文件')"
          style="padding: 0"
        >
          <el-icon :size="20">
            <Download />
          </el-icon>
        </el-button>
        <span>下载</span>
      </div>

      <div v-if="translateContent.length > 0">
        <el-table :data="translateContent">
          <el-table-column prop="onebest" label="内容" />
        </el-table>
      </div>

      <audio ref="audioRef" :src="model.voiceAddress"></audio>
    </div>
  </div>
</template>

<script setup lang="ts" name="callRecord">
import { getCallRecordDetail, queryAudioContent } from '@/api/system/call/index'
import { VideoPlay, VideoPause, Download, Connection } from '@element-plus/icons-vue'
import download from '@/utils/download'

onMounted(() => {
  queryCallRecordDetails()
  audioRef.value.addEventListener('loadeddata', () => {
    totalTime.value = audioRef.value.duration
  })
  audioRef.value.addEventListener('timeupdate', (e) => {
    currentTime.value = e.target.currentTime
    if (currentTime.value >= totalTime.value) {
      isPlaying.value = false
    }
  })
  audioRef.value.addEventListener('error', () => {
    totalTime.value = audioRef.value.duration
    onStop(audioRef.value)
  })
})
// watch(
//   () => duration.value,
//   (val) => {
//     totalTime.value = val
//   },
//   {
//     immediate: true
//   }
// )
const props = defineProps({
  title: { type: String, default: '混合录音' },
  callRecordId: { type: String, default: '' },
  businessType: { type: String, default: '' }
})

// const message = useMessage()
const audioRef = ref()
const model = ref<Object>({})
const isPlaying = ref(true)
const currentTime = ref(0)
// const duration = ref(0)
const totalTime = ref(0)
const translateContent = ref<Object[]>([])
const queryCallRecordDetails = async () => {
  const data = await getCallRecordDetail(props.callRecordId)
  console.log(data, 'recorddetail')
  model.value = data
}
const onStop = (audio) => {
  audio.pause()
}
// 播放
const playAudio = () => {
  isPlaying.value = false
  setTimeout(() => {
    audioRef.value.play()
  }, 500)
}
// 暂停播放
const pauseAudio = () => {
  isPlaying.value = true
  nextTick(() => {
    audioRef.value.pause()
  })
}

const downloadFunc = (url, filename) => {
  download.downloadFunc(url, filename)
}

const formatTime = (val) => {
  val = Math.ceil(val)
  let hour = parseInt(val / 60 / 60).toString()
  let minute = parseInt((val - hour * 3600) / 60).toString()
  let second = (val % 60).toString()
  hour = hour.padStart(2, '0')
  minute = minute.padStart(2, '0')
  second = second.padStart(2, '0')
  return `${hour}:${minute}:${second}`
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
</script>

<style lang="scss" scoped>
.voice-content {
  padding: 14px 20px;
  background-color: rgb(255 255 255 / 100%);
  border: 1px solid rgb(220 223 226 / 100%);
  border-radius: 6px;

  .title {
    margin-bottom: 18px;
    font-size: 16px;
    text-align: left;
  }

  .content {
    display: flex;
    font-size: 12px;
    justify-content: space-between;

    .col-direction {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .btn {
        font-size: 24px;
      }
    }

    .el-slider {
      width: 80%;
      //width: 246px;
      //display: flex;
      //flex-direction: column;
    }
  }
}
</style>
