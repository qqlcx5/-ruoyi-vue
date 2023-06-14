<template>
  <XModal title="派发成员列表" v-model="visible" width="50%">
    <div class="window-body">
      <div class="rule-wrapper">
        <el-form size="mini">
          <template>
            <el-form-item label="线索平台来源：">
              <span>{{ form.clueChannelName }}</span>
            </el-form-item>
            <el-form-item label="开通门店：">
              <span>{{ form.shopName }}</span>
            </el-form-item>
            <el-form-item label="所属区域：">
              <span>{{ form.parentName }}</span>
            </el-form-item>
            <el-form-item label="派发门店：">
              <span>{{ form.distributeShopName }}</span>
            </el-form-item>
            <el-form-item label="清洗员：">
              <span>{{ form.filterUserName }}</span>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <el-divider />
      <staff-config
        v-if="form.distributeShopName"
        :db-list="form.staffConfigList"
        ref="staffConfigRef"
      />
    </div>
  </XModal>
</template>
<script setup lang="ts" name="staffTable">
import StaffConfig from './staffConfig.vue'
import * as DispatchApi from '@/api/clue/dispatchStrategy/index'

const message = useMessage()

const visible = ref(false)
const form = ref({
  clueChannelName: '',
  shopName: '',
  parentName: '',
  distributeShopName: '',
  filterUserName: '',
  staffConfigList: []
})

const openDialog = async (distributeShopId: string, id: string) => {
  let params = {
    clueDistributeId: id,
    shopIdList: [distributeShopId]
  }
  const res = await DispatchApi.getDistributeShopUserList(params)
  if (res) {
    form.value = res.data
  } else {
    message.error(res.message)
  }
  visible.value = true
}
defineExpose({ openDialog })
</script>

<style lang="scss" scoped></style>
