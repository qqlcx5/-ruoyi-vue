<template>
  <div class="financial-product-edit-page">
    <div class="left-content">
      <div class="page-title">新增金融产品</div>
      <div class="sub-title">金融产品信息</div>
      <el-scrollbar style="flex: 1">
        <el-form ref="formRef" class="left-form" :model="ruleForm" :rules="rules" label-width="110">
          <el-form-item label="所属资金方" prop="mortgageFinanceVOList">
            <el-select v-model="ruleForm.mortgageFinanceVOList" multiple>
              <el-option
                v-for="item in financeList"
                :key="item.id"
                :label="item.financeName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="金融产品名称" prop="productName">
            <el-input v-model="ruleForm.productName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="金融产品类别" prop="productType">
            <el-select v-model="ruleForm.productType">
              <el-option
                v-for="item in financeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="适用门店" prop="shopVOList">
            <el-cascader
              v-model="ruleForm.shopVOList"
              :options="shopTreeList"
              :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
              filterable
              collapse-tags
              collapse-tags-tooltip
              clearable
            />
          </el-form-item>
          <el-form-item label="产品简介">
            <el-input
              type="textarea"
              v-model="ruleForm.productIntroduce"
              :rows="4"
              placeholder="可描述产品介绍"
              :maxlength="1000"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="产品标签">
            <div>
              <div class="product-tags">
                <div class="tags-header">
                  <span>已添加标签</span>
                  <div class="add-tag-btn" @click="handleAddTag">
                    <span
                      style="
                        cursor: pointer;
                        display: inline-block;
                        padding: 1px;
                        border: 1px solid;
                        height: 16px;
                        vertical-align: text-top;
                        margin-top: 1px;
                      "
                      ><Icon size="11" svg icon="ep:plus" style="vertical-align: top"
                    /></span>
                    新增标签
                  </div>
                </div>
                <div class="tag-list" v-if="ruleForm.tagSaveVOList.length">
                  <div
                    class="tag"
                    :class="{ enable: tag.tagStatus === 1 }"
                    v-for="(tag, index) in ruleForm.tagSaveVOList"
                    :key="index"
                    @click="tag.tagStatus = tag.tagStatus === 1 ? 0 : 1"
                  >
                    <span class="tag-label">{{ tag.tagName }}</span>
                    <Icon
                      class="tag-del-icon"
                      size="12"
                      svg
                      icon="ep:close"
                      @click.stop="deleteTag(index)"
                    />
                  </div>
                </div>
              </div>
              <el-input
                type="textarea"
                v-model="ruleForm.productAdvantage"
                :rows="4"
                placeholder="可详细描述产品优势"
                :maxlength="500"
                show-word-limit
              />
            </div>
          </el-form-item>
          <el-form-item label="优惠政策">
            <Editor
              v-model="ruleForm.preferentialPolicies"
              :toolbarConfig="{ excludeKeys: ['group-image', 'group-video', 'emotion'] }"
              :height="220"
              style="width: 360px; z-index: 10"
            />
          </el-form-item>
          <el-form-item label="话术">
            <Editor
              v-model="ruleForm.speakTechnique"
              :toolbarConfig="{ excludeKeys: ['group-image', 'group-video', 'emotion'] }"
              :height="220"
              style="width: 360px; z-index: 10"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <div class="right-content">
      <div class="sub-title">金融产品明细</div>
      <div class="detail-list">
        <div
          class="detail-part"
          v-for="(item, index) in ruleForm.detailSaveVOList"
          :id="'detail-table-' + index"
          :key="index"
        >
          <div class="part-index-title">产品明细{{ index + 1 }}</div>
          <Icon
            v-if="ruleForm.detailSaveVOList.length > 1"
            class="table-delete"
            icon="ep:delete"
            @click="deleteDetail(index)"
          />
          <el-form inline :model="ruleForm">
            <el-form-item label="产品明细名称">
              <el-input v-model="item.detailName" style="width: 180px" />
            </el-form-item>
            <el-form-item label="计算器文件">
              <el-upload
                :show-file-list="false"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              >
                <el-button type="primary" style="vertical-align: bottom"
                  ><Icon icon="ep:upload" /> 上传文件</el-button
                >
              </el-upload>
            </el-form-item>
            <el-form-item label="开启状态" style="float: right">
              <el-switch v-model="item.detailStatus" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-table class="custom-table" :data="item.itemSaveVOList">
              <template #empty>
                <el-button @click="itemAdd(0, item.itemSaveVOList)">增加行</el-button>
              </template>
              <el-table-column label="名称" min-width="160px">
                <template #default="{ row }">
                  <el-input v-model.trim="row.rateLevel" maxlength="50" show-word-limit />
                </template>
              </el-table-column>
              <el-table-column label="总费率" min-width="120px">
                <template #header>
                  <span class="detail-table-required">总费率</span>
                </template>
                <template #default="{ row }">
                  <el-input-number
                    class="table-input-number"
                    v-model.trim="row.apr"
                    :controls="false"
                    :min="0"
                    :max="9999"
                    step-strictly
                    :step="0.01"
                  />
                </template>
              </el-table-column>
              <el-table-column label="月费率" min-width="120px">
                <template #header>
                  <span class="detail-table-required">月费率</span>
                </template>
                <template #default="{ row }">
                  <el-input-number
                    class="table-input-number"
                    v-model.trim="row.mpr"
                    :controls="false"
                    :min="0"
                    :max="9999"
                    step-strictly
                    :step="0.01"
                  />
                </template>
              </el-table-column>
              <el-table-column label="年费率" min-width="120px">
                <template #default="{ row }">
                  <el-input-number
                    class="table-input-number"
                    v-model.trim="row.ypr"
                    :controls="false"
                    :min="0"
                    :max="9999"
                    step-strictly
                    :step="0.01"
                  />
                </template>
              </el-table-column>
              <el-table-column label="贷款期限" min-width="120px">
                <template #header>
                  <span class="detail-table-required">贷款期限</span>
                </template>
                <template #default="{ row }">
                  <el-input-number
                    class="table-input-number month"
                    v-model.trim="row.loanPeriod"
                    :controls="false"
                    :min="0"
                    :max="9999"
                    step-strictly
                    :step="1"
                  />
                </template>
              </el-table-column>
              <el-table-column label="返点" min-width="120px">
                <template #default="{ row }">
                  <el-input-number
                    class="table-input-number"
                    v-model.trim="row.rebates"
                    :controls="false"
                    :min="0"
                    :max="9999"
                    step-strictly
                    :step="0.01"
                  />
                </template>
              </el-table-column>
              <el-table-column label="备注" min-width="180px">
                <template #default="{ row }">
                  <el-input
                    type="textarea"
                    v-model="row.remark"
                    :rows="1"
                    :maxlength="100"
                    show-word-limit
                    style="min-height: 32px"
                  />
                </template>
              </el-table-column>
              <el-table-column label="状态" min-width="80px">
                <template #default="{ row }">
                  <el-switch v-model="row.itemStatus" :active-value="1" :inactive-value="0" />
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="150px">
                <template #default="{ $index }">
                  <el-button link type="primary" @click="itemAdd($index, item.itemSaveVOList)"
                    >增加</el-button
                  >
                  <el-button link type="primary" @click="itemCopy($index, item.itemSaveVOList)"
                    >复制</el-button
                  >
                  <el-button link type="primary" @click="itemDelete($index, item.itemSaveVOList)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </div>
      <div style="text-align: right; padding: 20px 20px 0">
        <XButton type="primary" iconFont="icon-xinzeng" title="新增明显" @click="addDetail" />
      </div>
    </div>
    <div class="bottom-btns">
      <el-button>取消</el-button>
      <el-button type="primary">保存</el-button>
    </div>
  </div>
  <AddTag v-model="visible" :tagList="ruleForm.tagSaveVOList" @confirm="tagSave" />
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import type { FormInstance, FormRules } from 'element-plus'
import { mortgageFinancePage } from '@/api/mortgage'

import AddTag from '../components/AddTag/index.vue'
import { useCommonList } from '@/hooks/web/useCommonList'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
const { getSuitableShopList } = useCommonList()
const tableItem = {
  rateLevel: '', // 名称
  apr: null, // 总费率
  mpr: null, // 月费率
  ypr: null, // 年费率
  loanPeriod: null, // 贷款期限
  rebates: null, // 返点
  remark: '', // 备注
  itemStatus: 1 // 状态
}
const itemDetail = {
  detailName: '', // 产品明细名称
  fileName: '', // 上传文件名称
  calculatorFile: '', // 上传文件地址
  detailStatus: 1,
  itemSaveVOList: [cloneDeep(tableItem), cloneDeep(tableItem)]
}
const rules: FormRules = reactive({
  mortgageFinanceVOList: [{ required: true, message: '请选择所属资金方', trigger: 'change' }],
  productName: [{ required: true, message: '请输入金融产品名称', trigger: 'blur' }],
  productType: [{ required: true, message: '请选择金融产品类型', trigger: 'change' }],
  shopVOList: [{ required: true, message: '请选择适用门店', trigger: 'change' }]
})
const formRef = ref<FormInstance>()
const ruleForm = reactive({
  mortgageFinanceVOList: [], //所属资金方
  productName: '', // 金融产品名称
  productType: '', // 金融产品类型
  shopVOList: [], //适用门店 {branchId: "140310", shopIds: ["140311"]}
  productIntroduce: '', // 产品简介
  tagSaveVOList: [], // 产品优势 标签 {tagName: "标签1", tagStatus: 1}
  productAdvantage: '', // 产品优势
  preferentialPolicies: '', // 优惠政策
  speakTechnique: '', // 话术
  detailSaveVOList: [cloneDeep(itemDetail)] // 金融产品明细
})

interface IFinance {
  id: number
  financeName: string
}
const financeList = ref<IFinance[]>([])
const getFinancialList = async () => {
  const { list } = await mortgageFinancePage({ pageNo: 1, pageSize: 1000 })
  financeList.value = list as IFinance[]
}
getFinancialList()
let financeOptions = getIntDictOptions(DICT_TYPE.FINANCE_PRODUCT_CATEGORY)

const shopTreeList = ref(getSuitableShopList())

const visible = ref<boolean>(false)
const handleAddTag = () => {
  visible.value = true
}
const tagSave = (list) => {
  ruleForm.tagSaveVOList = toRaw(list)
}
const deleteTag = (index) => {
  ruleForm.tagSaveVOList.splice(index, 1)
}
const itemAdd = (index, list) => {
  console.log(index, list)
  list.splice(index, 0, cloneDeep(tableItem))
}
const itemCopy = (index, list) => {
  list.splice(index, 0, cloneDeep(list[index]))
}
const itemDelete = (index, list) => {
  list.splice(index, 1)
}
const addDetail = async () => {
  ruleForm.detailSaveVOList.push(cloneDeep(itemDetail))
}
const deleteDetail = (index) => {
  ruleForm.detailSaveVOList.splice(index, 1)
}
</script>

<style scoped lang="scss">
@import '@/styles/custom';
.financial-product-edit-page {
  display: flex;
  height: 100%;
  padding-bottom: 76px;
  .page-title {
    line-height: 25px;
    font-size: 18px;
    font-weight: bold;
    color: $title-color;
    padding: 15px;
    border-bottom: 1px solid $border-color;
    margin-bottom: 15px;
  }
  .sub-title {
    position: relative;
    line-height: 22px;
    font-size: 16px;
    font-weight: bold;
    padding-left: 6px;
    margin-bottom: 15px;
    margin-left: 15px;
    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: calc(50% - 7px);
      width: 3px;
      height: 14px;
      background-color: $wg-primary-color;
    }
  }
  .left-content {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    background-color: #ffffff;
    .left-form {
      padding: 15px 30px 15px 15px;
      .el-select,
      .el-input,
      .el-textarea,
      :deep(.el-cascader),
      .product-tags {
        width: 360px;
      }
      .product-tags {
        padding: 12px 0;
        background-color: #f7f8fa;
        margin-bottom: 10px;
        .tags-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 20px;
          font-size: 14px;
          color: $title-color;
          padding: 0 12px;
          .add-tag-btn {
            cursor: pointer;
            color: $wg-primary-color;
            vertical-align: bottom;
          }
        }
        .tag-list {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          min-height: 50px;
          max-height: 90px;
          overflow: auto;
          padding: 0 12px;
          margin-top: 6px;
          .tag {
            display: flex;
            align-items: center;
            cursor: pointer;
            align-self: flex-start;
            line-height: 20px;
            max-width: 100%;
            font-size: 14px;
            color: $text-color;
            padding: 5px 10px 5px 12px;
            border: 1px solid $border-color;
            border-radius: 4px;
            background-color: #ffffff;
            margin: 8px 8px 0 0;
            &.enable {
              border-color: $wg-primary-color;
              color: $wg-primary-color;
            }
          }
          .tag-label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .tag-del-icon {
            vertical-align: middle;
            margin-left: 10px;
            color: $text-color;
            &:hover {
              color: $error-color;
            }
          }
        }
      }
    }
  }
  .right-content {
    flex: 1;
    width: 1px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 0 10px;
    background-color: #ffffff;
    .detail-list {
      padding: 0 15px;
      overflow: auto;
    }
    .detail-part {
      position: relative;
      padding: 20px;
      background-color: #fcfcfd;
      border: 1px solid $border-color;
      border-radius: 4px;
      & + .detail-part {
        margin-top: 20px;
      }
      .part-index-title {
        line-height: 22px;
        font-size: 14px;
        font-weight: bold;
        color: $title-color;
        margin-bottom: 20px;
      }
      .table-delete {
        cursor: pointer;
        position: absolute;
        top: 22px;
        right: 20px;
        &:hover {
          color: $error-color;
        }
      }
    }
  }
  .detail-table-required:before {
    content: '*';
    color: $error-color;
  }
  .table-input-number {
    position: relative;
    width: 100%;
    :deep(.el-input__wrapper) {
      padding-right: 25px;
    }
    :deep(.el-input__inner) {
      text-align: left;
    }
    &:after {
      content: '%';
      position: absolute;
      right: 6px;
      top: 1px;
      color: $tip-color;
    }
    &.month {
      :deep(.el-input__wrapper) {
        padding-right: 40px;
      }
      &:after {
        content: '个月';
      }
    }
  }
  .bottom-btns {
    position: absolute;
    bottom: 0;
    z-index: 20;
    height: 86px;
    width: 100%;
    line-height: 86px;
    text-align: center;
    background-color: #ffffff;
    box-shadow: 0px -5px 8px 0px rgba(210, 210, 210, 0.2);
  }
}
</style>
