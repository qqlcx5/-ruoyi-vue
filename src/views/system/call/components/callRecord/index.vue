<template>
  <div class="voice-content">
    <div class="title">{{ voiceAdressObj.title }}</div>
    <div class="content">
      <div class="col-direction" v-if="isPlaying">
        <el-button class="btn" type="text" @click="playAudio()">
          <el-icon :size="20">
            <video-play />
          </el-icon>
        </el-button>
        <span>播放</span>
      </div>
      <div class="col-direction" v-if="!isPlaying">
        <el-button class="btn" type="text" @click="pauseAudio()">
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
      <div class="col-direction" :class="{ active: rateShow }" @click="rateShow = !rateShow">
        <div class="fs-14">{{ playbackRate }}</div>
        <div class="fs-12">倍放</div>
      </div>

      <div class="col-direction">
        <el-button
          type="text"
          @click="downloadFunc(voiceAdressObj.voiceAddress, '录音文件')"
          style="padding: 0"
        >
          <el-icon :size="20">
            <Download />
          </el-icon>
        </el-button>
        <span>下载</span>
      </div>
      <audio ref="audioRef" :src="voiceAdressObj.voiceAddress"></audio>
    </div>
    <div v-if="translateContent.length > 0">
      <el-table :data="translateContent">
        <el-table-column prop="onebest" label="内容" />
      </el-table>
    </div>
    <div class="rate-list" v-show="rateShow">
      <div
        class="rate-item"
        :class="{ active: playbackRate === rate }"
        v-for="rate of rateList"
        :key="rate"
        @click.stop="chooseRate(rate)"
      >
        {{ rate }}倍
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="callRecord">
import { queryAudioContent } from '@/api/system/call/index'
import { VideoPlay, VideoPause, Download, Connection } from '@element-plus/icons-vue'
import download from '@/utils/download'

onMounted(() => {
  audioRef.value.addEventListener('loadeddata', () => {
    totalTime.value = audioRef.value.duration
  })
  audioRef.value.addEventListener('timeupdate', (e) => {
    currentTime.value = e.target.currentTime
    if (currentTime.value >= totalTime.value) {
      isPlaying.value = true
      currentTime.value = 0
    }
  })
  audioRef.value.addEventListener('error', () => {
    totalTime.value = audioRef.value.duration
    onStop(audioRef.value)
  })
})

const props = defineProps({
  voiceAdressObj: { type: Object, defaullt: () => ({}) }
})

const audioRef = ref()
const isPlaying = ref(true)
const currentTime = ref(0)
// const duration = ref(0)
const totalTime = ref(0)
const translateContent = ref<Object[]>([])

const onStop = (audio) => {
  audio.pause()
}

//倍速播放
const rateShow = ref(false)
const playbackRate = ref(1)
const rateList = ref([1, 1.1, 1.2, 1.3, 1.5, 1.8])
const chooseRate = (rate) => {
  playbackRate.value = rate
  if (audioRef.value) {
    audioRef.value.playbackRate = playbackRate.value
  }
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
    businessType: props.voiceAdressObj.businessType,
    callRecordId: +props.voiceAdressObj.callRecordId
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
  margin-bottom: 15px;
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
      margin-right: 15px;

      &:last-child {
        margin-right: 0;
      }

      &.active {
        color: #1989fa;
      }

      .fs-12 {
        font-size: 12px;
      }

      .fs-14 {
        font-size: 14px;
      }

      .btn {
        font-size: 24px;
      }
    }

    .el-slider {
      width: 70%;
      //width: 246px;
      //display: flex;
      //flex-direction: column;
    }
  }
}

.rate-list {
  position: relative;
  display: grid;
  padding-top: 12px;
  margin-top: 12px;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 10px;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #dcdfe2;
    content: '';
  }

  &::after {
    position: absolute;
    top: 0;
    right: 55px;
    width: 12px;
    height: 12px;
    background-color: #fff;
    border-top: 2px solid #dcdfe2;
    border-right: 2px solid #dcdfe2;
    content: '';
    transform: translateY(-100%) translateX(-100%) rotate(-45deg);
    transform-origin: bottom right;
  }

  &.mini {
    grid-column-gap: 6px;
  }

  .rate-item {
    padding: 5px 8px 4px 9px;
    font-size: 12px;
    color: #767f8b;
    text-align: center;
    background-color: rgb(248 250 251 / 100%);
    border: 1px solid rgb(220 223 230 / 100%);
    border-radius: 4px;

    &.active {
      color: #fff;
      background-color: rgb(0 129 255 / 100%);
    }
  }
}
</style>
