<template>
  <div class="content-wrap">
    <el-card class="card-wrap" style="width: 438px; margin-right: 10px">
      <div class="card-title">基本信息</div>
      <el-form :model="baseForm" label-width="100px">
        <el-form-item label="问卷名称" prop="name">{{ baseForm.name }}</el-form-item>
        <el-form-item label="问卷编码" prop="code">
          {{ baseForm.code }}
        </el-form-item>
        <el-form-item label="所属分组"> 接待录音 </el-form-item>
        <el-form-item label="适用门店"> 接待录音 </el-form-item>
        <el-form-item label="适用车型"> 领克 </el-form-item>
        <el-form-item label="状态"> 开启 </el-form-item>
        <el-form-item label="是否前端展示"> 是 </el-form-item>
      </el-form>
    </el-card>
    <el-card style="flex: 1">
      <div class="card-title" style="margin-bottom: 8px"
        >题目和分值
        <Icon
          icon="ep:question-filled"
          class="question-icon"
          @click="tooltip = true"
          color="rgb(176, 176, 176)"
        />
      </div>
      <div class="tooltip-content" v-if="tooltip">
        说明：<br />
        1.分值最多小数点后两位（可输入负数）；<br />
        2.添加多选题的题目时，如果该题目勾选了自动添加“以上都没有”选项。则该题选项会自动新增“以上都没有”选项，该题最高分取选项分值之和或以上都没有分值的最高分值。
        用户端如果选择以上都没有选项，则其他选项无法选择。<br />
        3.用户端最终得分为所有题目得分之和。 <br />（1）单选题得分取用户选择的选项分值（单个）<br />
        （2）多选题得分取用户选择的所有选择分值之和（多个）或以上都没有分值
        <br />（3）输入题取单一值 <br />（4）量表题取用户选择的选项分值（单个）<br />
        （5）如若分值输入的为负数，且用户勾选该选项后，则最终统计得分时相应扣减该分值 <br />
        （6）如最终得分为负数，则得分计为0 评价表详细信息： 考虑到 C
        端用户体验（如评价积极性、排版美观度等），建议题目不要超过 5 题
        <Icon icon="svg-icon:close" class="close-icon" :size="14" @click="tooltip = false" />
      </div>

      <el-form>
        <el-form-item label="是否开启分值">
          <el-tooltip placement="bottom" class="icon-tip">
            <template #content>
              <span> 为左上角显示的系统整体名称</span>
            </template>
            <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
          </el-tooltip>
          是
        </el-form-item>
        <el-form-item label="问卷样式">
          <el-tooltip placement="bottom" class="icon-tip">
            <template #content>
              <span> 为左上角显示的系统整体名称</span>
            </template>
            无分类
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div>
        <span style="padding-left: 10px"
          >数量：<span style="color: #0081ff">{{ topicList.length }}</span
          >题 总计：<span style="color: #ff4141">100</span>分</span
        >
      </div>

      <div class="topic-wrap">
        <div class="topic-item" v-for="(topic, index) in topicList" :key="index">
          <div class="topic-header">
            <div class="topic-title"
              ><span class="required">必答题</span>{{ topic.name }}({{ topic.type }})
            </div>
          </div>
          <div class="topic-body">
            <div class="topic-options">
              <div class="topic-option" v-for="(option, i) in topic.options" :key="i">
                <span class="topic-option-score">{{ i + 1 }}</span>
                <span class="option-val">{{ option.val }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
  <div class="bottom-btns">
    <el-button size="large">返回</el-button>
  </div>
</template>

<script lang="ts" setup>
// 基础信息表单
const baseForm = reactive({
  name: '试乘试驾评价表(领克)',
  code: '0004',
  store: '1',
  car: '1',
  status: true,
  isShow: false
})
const tooltip = ref(false)
const topicList = ref([
  {
    type: '单选题',
    required: true,
    name: '客户离店自动送别，并且当天发企业个人微信感谢信息，销售人员信息和店面信息',
    options: [
      {
        val: '有送别，并发送感谢信息',
        score: ''
      },

      {
        val: '有送别，并发送感谢信息',
        score: ''
      },

      {
        val: '有送别，并发送感谢信息',
        score: ''
      },
      {
        val: '有送别，并发送感谢信息',
        score: ''
      }
    ]
  },
  {
    type: '单选题',
    required: true,
    name: '客户离店自动送别，并且当天发企业个人微信感谢信息，销售人员信息和店面信息',
    options: [
      {
        val: '有送别，并发送感谢信息',
        score: ''
      },

      {
        val: '有送别，并发送感谢信息',
        score: ''
      },

      {
        val: '有送别，并发送感谢信息',
        score: ''
      },
      {
        val: '有送别，并发送感谢信息',
        score: ''
      }
    ]
  },
  {
    type: '单选题',
    required: true,
    name: '客户离店自动送别，并且当天发企业个人微信感谢信息，销售人员信息和店面信息',
    options: [
      {
        val: '有送别，并发送感谢信息',
        score: ''
      },

      {
        val: '有送别，并发送感谢信息',
        score: ''
      },

      {
        val: '有送别，并发送感谢信息',
        score: ''
      },
      {
        val: '有送别，并发送感谢信息',
        score: ''
      }
    ]
  }
])
</script>

<style lang="scss" scoped>
.content-wrap {
  display: flex;
  margin-bottom: 96px;
  .card-title {
    display: flex;
    align-items: center;
    padding-left: 5px;
    position: relative;
    margin-bottom: 20px;
    &::before {
      content: '';
      width: 3px;
      height: 14px;
      background-color: rgba(0, 129, 255, 1);
      position: absolute;
      left: -5px;
    }
  }
}
.question-icon {
}
.tooltip-content {
  border-radius: 4px;
  background-color: rgba(250, 173, 20, 0.07);
  border: 0.5px solid rgba(250, 173, 20, 1);
  padding: 13px 20px;
  position: relative;

  .close-icon {
    position: absolute;
    right: 16px;
    top: 13px;
  }
}
.category-wrap {
  border-radius: 4px;
  margin-top: 16px;
  border: 1px solid rgba(225, 227, 233, 1);
  .category-header {
    display: flex;
    padding: 13px;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(246, 246, 246, 1);
    border-radius: 4px;
    .category-header__l {
      display: flex;
      align-items: center;
    }
    .category-header__r {
    }
  }
  .category-body {
    padding: 12px 14px;
  }
}
.topic-wrap {
  .topic-item {
    padding: 15px;
    margin-top: 16px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(225, 227, 233, 1);
    .topic-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .topic-title {
        display: flex;
        align-items: center;
        .required {
          line-height: 16px;
          color: rgba(0, 129, 255, 1);
          font-size: 12px;
          border-radius: 4px;
          background-color: rgba(0, 129, 255, 0.06);
          padding: 3px 8px;
          margin-right: 6px;
        }
      }
      .topic-topScore {
        .score {
          color: #ff4141;
        }
      }
    }
    .topic-body {
      .topic-options {
        .topic-option {
          display: flex;
          align-items: center;
          margin-top: 19px;
          .topic-option-score {
            border-radius: 4px;
            background-color: rgba(234, 235, 239, 1);
            padding: 3px 14px;
            font-size: 12px;
          }
          .option-val {
            padding-left: 10px;
          }
        }
      }
      .topic-active {
        display: flex;
        align-items: end;
        text-align: end;
        .active-item {
          color: rgba(153, 153, 153, 100);
          margin-left: 8px;
        }
      }
    }
  }
}
.bottom-btns {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  text-align: center;
  line-height: 86px;
  height: 86px;
  background-color: var(--page-bg-color);
  box-shadow: 0px -5px 8px 0px rgba(210, 210, 210, 0.2);
}
</style>
