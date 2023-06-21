<template>
  <XModal v-model="dialogVisible" width="665px" :title="dialogTitle">
    <!-- 对话框(添加 / 修改) -->
    <Form
      v-if="['create', 'update'].includes(actionType)"
      :schema="allSchemas.formSchema"
      :rules="rules"
      ref="formRef"
    >
      <template #code="form">
        <el-input v-model="form.code" placeholder="请输入线索来源名称" />
      </template>
      <template #status="form">
        <el-cascader
          :options="options"
          :props="props"
          v-model="form.status"
          collapse-tags
          collapse-tags-tooltip
          clearable
        />
      </template>
    </Form>

    <Table
      :columns="tableColumns"
      :data="tableList"
      header-cell-class-name="table-header-style"
      max-height="40vh"
      headerAlign="left"
      :showOverflowTooltip="false"
      align="left"
    />

    <!-- 操作按钮 -->
    <template #footer>
      <XButton
        v-if="['create', 'update'].includes(actionType)"
        type="primary"
        :title="t('action.save')"
        :loading="actionLoading"
        @click="submitForm()"
      />
      <XButton :loading="actionLoading" :title="t('dialog.close')" @click="dialogVisible = false" />
    </template>
  </XModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormExpose } from '@/components/Form'
import { rules, allSchemas, oa_source_res } from './dispatchStrategy.data'

const formRef = ref<FormExpose>() // 表单 Ref
const { t } = useI18n() // 国际化

let dialogVisible = ref(false)
let dialogTitle = ref('新增')
const actionLoading = ref(false) // 遮罩层
const actionType = ref('create') // 操作按钮的类型

const props = {
  multiple: true,
  label: 'clueName',
  value: 'clueSourceId'
}

let options = ref(oa_source_res.data)

const openDialog = (data) => {
  console.log(data)

  dialogVisible.value = true
}
defineExpose({ openDialog })
// 保存按钮
const submitForm = async () => {
  console.log('======')
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      actionLoading.value = true
      // 提交请求
      try {
        const data = unref(formRef)?.formModel
        console.log(data)

        // dialogVisible.value = false
      } finally {
        actionLoading.value = false
      }
    }
  })
}

const tableColumns = [
  {
    label: '门店',
    field: 'serialNumber',
    minWidth: '100px'
  },
  {
    label: '成员',
    field: 'clueSource',
    minWidth: '80px'
  },
  {
    label: '成员平台昵称',
    field: 'shopName',
    minWidth: '120px'
  },
  {
    label: '销量品牌',
    field: 'platformUsername',
    minWidth: '100px'
  },
  {
    label: '销量品牌',
    field: 'platformPassword',
    minWidth: '100px'
  },
  {
    label: '派单状态',
    field: 'needFilter',
    minWidth: '80px'
  }
]
import { ChannelVO } from '@/api/clue/channel'
// 岗位类型table
const tableList = ref<ChannelVO[]>([
  {
    serialNumber: '厦门分公司-中埔哈弗红蓝标4S店',
    clueSource: '池小妹',
    shopName: '池小妹',
    platformUsername: '哈弗,皮卡',
    platformPassword: 'aaaa1111',
    needFilter: '开启',
    autoDistribute: '0',
    platformRule: '0',
    isShow: '1'
  }
])

for (let index = 0; index < 100; index++) {
  tableList.value.push({
    serialNumber: '厦门分公司-中埔哈弗红蓝标4S店',
    clueSource: '池小妹',
    shopName: '池小妹',
    platformUsername: '哈弗,皮卡',
    platformPassword: 'aaaa1111',
    needFilter: '开启',
    autoDistribute: '0',
    platformRule: '0',
    isShow: '1'
  })
}
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
:deep(.table-header-style) {
  height: 50px;
  font-size: 14px;
  color: $header-text-color;
  background-color: $table-head-color !important;
}
</style>
