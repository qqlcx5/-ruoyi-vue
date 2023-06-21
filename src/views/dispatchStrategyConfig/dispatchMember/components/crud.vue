<template>
  <XModal :title="id ? '修改' : '新增'" v-model="visible" width="50%">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="所属门店" prop="shopId">
        <el-cascader
          ref="treeShopCascader"
          v-model="form.shopIdList"
          placeholder="请选择门店"
          :options="shopTreeList"
          collapse-tags
          @change="getDistributeShopIdList"
          :props="{
            label: 'name',
            value: 'id',
            expandTrigger: 'hover',
            multiple: true,
            emitPath: false
          }"
          :show-all-levels="false"
          clearable
        />
      </el-form-item>
    </el-form>
    <el-divider />
    <div>派发人员配置</div>
    <XButton type="primary">选择成员</XButton>
    <StaffConfig v-if="form.shopIdList" :db-list="staffConfigList" ref="staffConfigRef" />
  </XModal>
</template>

<script setup lang="ts" name="dipatchMemberCrud">
import StaffConfig from '@/views/dispatchStrategyConfig/components/staffConfig.vue'
const visible = ref(false)

const form = ref({
  shopIdList: []
})
const rules = ref()
const id = ref('')
const shopTreeList = ref<object[]>([])

const openDialog = (id: string, formShopTreeList: any) => {
  // id.value = id
  staffConfigList.value = []
  if (id) {
    // todo 编辑
    console.log(id)
  } else {
    console.log('新增')
  }
  shopTreeList.value = formShopTreeList
  visible.value = true
}

const staffConfigList = ref<any[]>([])

const getDistributeShopIdList = () => {
  console.log(form.value.shopIdList)
  staffConfigList.value = []
}

defineExpose({ openDialog })
</script>

<style lang="scss" scoped></style>
