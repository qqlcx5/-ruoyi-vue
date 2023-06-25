<template>
  <div class="content-wrap">
    <el-card class="card-wrap" style="width: 438px; margin-right: 10px">
      <div class="card-title">填写基本信息</div>
      <el-form :model="baseForm" label-width="100px">
        <el-form-item label="问卷名称" prop="name">
          <el-input
            v-model="baseForm.name"
            maxlength="30"
            show-word-limit
            placeholder="请输入问卷名称"
          />
        </el-form-item>
        <el-form-item label="问卷编码" prop="code">
          <el-input
            v-model="baseForm.code"
            maxlength="10"
            show-word-limit
            placeholder="请输入问卷编码"
          />
        </el-form-item>
        <el-form-item label="所属分组">
          <el-select v-model="baseForm.code" placeholder="请选择所属分组">
            <el-option label="1" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="适用门店">
          <el-radio-group v-model="baseForm.store" class="ml-4">
            <el-radio label="1" size="large">全部</el-radio>
            <el-radio label="2" size="large">部分</el-radio>
          </el-radio-group>
          <el-tree-select v-if="baseForm.store === '2'" :render-after-expand="false" />
        </el-form-item>
        <el-form-item label="适用车型">
          <el-radio-group v-model="baseForm.car" class="ml-4">
            <el-radio label="1" size="large">全部</el-radio>
            <el-radio label="2" size="large">部分</el-radio>
          </el-radio-group>
          <el-tree-select v-if="baseForm.car === '2'" :render-after-expand="false" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="baseForm.status" />
        </el-form-item>
        <el-form-item label="是否前端展示">
          <el-switch v-model="baseForm.isShow" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="flex: 1">
      <div class="card-title" style="margin-bottom: 8px"
        >设置题目和分值
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
          <el-switch v-model="baseForm.status" />
        </el-form-item>
        <el-form-item label="问卷样式">
          <el-tooltip placement="bottom" class="icon-tip">
            <template #content>
              <span> 为左上角显示的系统整体名称</span>
            </template>
            <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
          </el-tooltip>
          <el-radio-group v-model="baseForm.car">
            <el-radio label="1" size="large">无分类</el-radio>
            <el-radio label="2" size="large">有分类</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary">添加题目</el-button>
        <span style="padding-left: 10px"
          >数量：<span style="color: #0081ff">{{ topicList.length }}</span
          >题 总计：<span style="color: #ff4141">100</span>分</span
        >
      </div>

      <div class="category-wrap">
        <div class="category-header">
          <div class="category-header__l">
            <el-input style="width: 240px" placeholder="请输入分类名称" />
            <el-button type="primary" style="margin: 0 10px">添加题目</el-button>
            <span>数量：2题</span>
          </div>
          <div class="category-header__r"
            >总计最高分值：<span style="color: #ff4141">100</span></div
          >
        </div>
        <div class="category-body">
          <div class="topic-wrap" style="margin-top: 0">
            <div class="topic-item" v-for="(topic, index) in topicList" :key="index">
              <div class="topic-header">
                <div class="topic-title"
                  >{{ topic.name }}&nbsp;&nbsp;&nbsp;&nbsp;({{
                    topic.type
                  }})&nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox
                    v-model="topic.required"
                    label="必答题"
                    size="large"
                /></div>

                <div class="topic-topScore">最高分数：<span class="score">100</span></div>
              </div>
              <div class="topic-body">
                <div class="topic-options">
                  <div class="topic-option" v-for="(option, i) in topic.options" :key="i">
                    <span>{{ i + 1 }}、</span>
                    <el-input
                      v-model="option.score"
                      placeholder="请输入分值"
                      style="width: 180px"
                    />
                    <span class="option-val">{{ option.val }}</span>
                  </div>
                </div>
                <div class="topic-active">
                  <el-link class="active-item"
                    ><Icon
                      icon="svg-icon:move-up"
                      :size="12"
                      color="rgb(0, 129, 255)"
                    />上移</el-link
                  >
                  <el-link class="active-item"
                    ><Icon
                      icon="svg-icon:move-down"
                      :size="12"
                      color="rgb(0, 129, 255)"
                    />下移</el-link
                  >
                  <el-link class="active-item">删除</el-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="topic-wrap">
        <div class="topic-item" v-for="(topic, index) in topicList" :key="index">
          <div class="topic-header">
            <div class="topic-title"
              >{{ topic.name }}&nbsp;&nbsp;&nbsp;&nbsp;({{
                topic.type
              }})&nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox
                v-model="topic.required"
                label="必答题"
                size="large"
            /></div>

            <div class="topic-topScore">最高分数：<span class="score">100</span></div>
          </div>
          <div class="topic-body">
            <div class="topic-options">
              <div class="topic-option" v-for="(option, i) in topic.options" :key="i">
                <span>{{ i + 1 }}、</span>
                <el-input v-model="option.score" placeholder="请输入分值" style="width: 180px" />
                <span class="option-val">{{ option.val }}</span>
              </div>
            </div>
            <div class="topic-active">
              <el-link class="active-item"
                ><Icon icon="svg-icon:move-up" :size="12" color="rgb(0, 129, 255)" />上移</el-link
              >
              <el-link class="active-item"
                ><Icon icon="svg-icon:move-down" :size="12" color="rgb(0, 129, 255)" />下移</el-link
              >
              <el-link class="active-item">删除</el-link>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
  <div class="bottom-btns">
    <el-button size="large">取消</el-button>
    <el-button type="primary" size="large">提交</el-button>
  </div>

  <el-dialog v-model="state.isShow" title="选择车型" width="760">
    <div class="modal-body">
      <div class="search-wrap">
        <el-input placeholder="请输入车型" style="width: 340px; margin-right: 10px" />
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </div>
      <div class="modal-content">
        <div class="column">
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          />
        </div>
        <div class="column">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="Option A" />
            <el-checkbox label="Option B" />
            <el-checkbox label="Option C" />
          </el-checkbox-group>
        </div>
        <div class="column">
          <div>已选择的信息</div>
          <el-tree :data="data" :props="defaultProps" />
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="state.isShow = false"> 确认选择 </el-button>
        <el-button @click="state.isShow = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// 基础信息表单
const baseForm = reactive({
  name: '',
  code: '',
  store: '1',
  car: '1',
  status: true,
  isShow: false
})
const tooltip = ref(true)
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

const state = reactive({
  isShow: true
})
const defaultProps = {
  children: 'children',
  label: 'label'
}

const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1'
          },
          {
            id: 10,
            label: 'Level three 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1'
      },
      {
        id: 6,
        label: 'Level two 2-2'
      }
    ]
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1'
      },
      {
        id: 8,
        label: 'Level two 3-2'
      }
    ]
  }
]
const checkList = ref(['selected and disabled', 'Option A'])
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
      }
      .topic-topScore {
        .score {
          color: #ff4141;
        }
      }
    }
    .topic-body {
      display: flex;
      justify-content: space-between;

      .topic-options {
        flex: 1;
        .topic-option {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          &:last-child {
            margin-bottom: 0;
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
          //padding: 16px;
          color: rgba(153, 153, 153, 100);
          margin-left: 8px;
          //border: 1px solid rgba(234, 235, 239, 1);
        }
      }
    }
  }
}

.modal-body {
  .search-wrap {
    display: flex;
    margin-bottom: 14px;
  }
  .modal-content {
    display: flex;
    .column {
      flex: 1;
      border: 1px solid rgba(234, 235, 239, 1);
      padding: 14px;
      &:nth-child(2) {
        border-left: none;
        border-right: none;
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
