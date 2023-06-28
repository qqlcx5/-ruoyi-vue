<template>
  <div class="financial-product-edit-page">
    <el-scrollbar class="left-content">
      <div class="page-title">新增金融产品</div>
      <el-form ref="formRef" class="left-form" :model="ruleForm" label-width="110">
        <div class="sub-title">金融产品信息</div>
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
          <el-input type="textarea" :rows="4" :maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="产品标签">
          <div class="product-tags">
            <div class="tags-header">
              <span>已添加标签</span>
              <span>新增标签</span>
            </div>
            <div class="tag-list">
              <div class="tag">
                <span>标签名称</span>
              </div>
            </div>
          </div>
          <el-input type="textarea" :rows="4" :maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="优惠政策">
          <Editor
            :toolbarConfig="{ excludeKeys: ['group-image', 'group-video', 'emotion'] }"
            :height="220"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item label="话术">
          <Editor
            :toolbarConfig="{ excludeKeys: ['group-image', 'group-video', 'emotion'] }"
            :height="220"
            style="width: 360px"
          />
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.financial-product-edit-page {
  display: flex;
  height: 100%;
  .page-title {
    line-height: 25px;
    font-size: 18px;
    font-weight: bold;
    color: $title-color;
    padding: 15px;
    border-bottom: 1px solid $border-color;
  }
  .sub-title {
    position: relative;
    line-height: 22px;
    font-size: 16px;
    font-weight: bold;
    padding-left: 6px;
    margin-bottom: 15px;
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
    margin-right: 10px;
    background-color: #ffffff;
    .left-form {
      padding: 15px 30px 15px 15px;
      .el-select,
      .el-input {
        width: 360px;
      }
      .product-tags {
        width: 100%;
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
          padding: 0 12px 12px;
        }
      }
    }
  }
}
</style>
