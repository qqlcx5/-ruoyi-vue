<template>
  <el-dialog
    v-model="state.isShow"
    title="批量导入行政区划"
    width="663"
    custom-class="import-export-modal"
  >
    <div class="modal-body">
      <div class="modal-content">
        <div class="import-content"
          >模板下载
          <div class="import-tag">点击下载</div>
        </div>
        <div class="export-content">
          <div class="upload-text">文件上传</div>
          <div class="upload-content">
            <UploadFile fileType=".xls, .xlsx" :isShowTip="false">
              <div class="upload-style"> 123 </div>
            </UploadFile>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="modalDelete"> 确定 </el-button>
        <el-button @click="state.isShow = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import UploadFile from '@/components/UploadFile/src/UploadFile.vue'
const state = reactive({
  isShow: true
})
</script>

<style lang="scss" scoped>
.modal-body {
  border-top: 1px solid rgba(234, 235, 239, 1);
  border-bottom: 1px solid rgba(234, 235, 239, 1);
}
.modal-content {
  margin: 40px 114px;
  display: flex;
  flex-direction: column;
}
.import-content {
  display: flex;
  align-items: center;
}
.import-tag {
  margin-left: 12px;
  padding: 6px 13px;
  border-radius: 4px;
  background-color: rgba(237, 244, 251, 1);
  color: rgba(0, 129, 255, 1);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  font-family: PingFangSC-Regular;
}
.export-content {
  margin-top: 15px;
  display: flex;
}
.upload-text {
  margin-top: 7px;
}
.upload-content {
  margin-left: 12px;
}
.upload-style {
  width: 240px;
  height: 130px;
  display: flex;
  justify-content: center;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
  border: 1px dashed rgba(0, 0, 0, 0.15);
}
</style>

<style lang="scss">
.import-export-modal {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
