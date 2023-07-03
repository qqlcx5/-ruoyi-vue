<template>
  <div class="financial-product-edit-page">
    <div class="left-content">
      <div class="page-title">新增金融产品</div>
      <div class="sub-title">金融产品信息</div>
      <el-scrollbar style="flex: 1">
        <el-form ref="formRef" class="left-form" :model="ruleForm" label-width="110">
          <el-form-item label="所属资金方">
            <el-select>
              <el-option label="1" value="23" />
            </el-select>
          </el-form-item>
          <el-form-item label="金融产品名称">
            <el-input />
          </el-form-item>
          <el-form-item label="金融产品类别">
            <el-select>
              <el-option label="1" value="23" />
            </el-select>
          </el-form-item>
          <el-form-item label="适用门店">
            <el-select>
              <el-option label="1" value="23" />
            </el-select>
          </el-form-item>
          <el-form-item label="产品简介">
            <el-input
              type="textarea"
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
                  <div class="add-tag-btn">
                    <span
                      style="
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
                <div class="tag-list">
                  <div class="tag" v-for="item in 10">
                    <span>标签名称</span>
                    <Icon
                      size="12"
                      svg
                      icon="ep:close"
                      style="vertical-align: middle; margin-left: 10px"
                    />
                  </div>
                </div>
              </div>
              <el-input
                type="textarea"
                :rows="4"
                placeholder="可详细描述产品优势"
                :maxlength="500"
                show-word-limit
              />
            </div>
          </el-form-item>
          <el-form-item label="优惠政策">
            <Editor
              :toolbarConfig="{ excludeKeys: ['group-image', 'group-video', 'emotion'] }"
              :height="220"
              style="width: 360px; z-index: 10"
            />
          </el-form-item>
          <el-form-item label="话术">
            <Editor
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
        <div class="detail-part" v-for="(item, index) in ruleForm.detailSaveVOList">
          <div class="part-index-title">产品明细{{ index + 1 }}</div>
          <el-form inline :model="ruleForm">
            <el-form-item label="产品明细名称">
              <el-input v-model="item.detailName" style="width: 180px" />
            </el-form-item>
            <el-form-item label="计算器文件">
              <el-upload
                :show-file-list="false"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              >
                <el-button type="primary" style="vertical-align: bottom">上传文件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="*开启状态" style="float: right">
              <el-switch v-model="item.detailStatus" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-table class="custom-table">
              <el-table-column label="名称" min-width="120px" />
              <el-table-column label="*总费率" min-width="120px" />
              <el-table-column label="*月费率" min-width="120px" />
              <el-table-column label="年费率" min-width="120px" />
              <el-table-column label="*贷款期限" min-width="120px" />
              <el-table-column label="返点" min-width="120px" />
              <el-table-column label="备注" min-width="120px" />
              <el-table-column label="状态" min-width="120px" />
              <el-table-column label="操作" fixed="right" width="110px" />
            </el-table>
          </el-form>
        </div>
      </div>
      <div style="text-align: right; padding: 20px 20px 0">
        <XButton type="primary" iconFont="icon-xinzeng" title="新增明显" />
      </div>
    </div>
    <div class="bottom-btns">
      <el-button>取消</el-button>
      <el-button type="primary">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  detailSaveVOList: [
    {
      detailName: '', // 产品明细名称
      fileName: '', // 上传文件名称
      calculatorFile: '', // 上传文件地址
      detailStatus: 1
    }
  ] // 金融产品明细
})
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
          padding: 0 12px 6px;
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
          .tag {
            cursor: pointer;
            align-self: flex-start;
            line-height: 20px;
            font-size: 14px;
            color: $text-color;
            padding: 5px 10px 5px 12px;
            border: 1px solid $border-color;
            border-radius: 4px;
            background-color: #ffffff;
            margin: 8px 8px 0 0;
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
