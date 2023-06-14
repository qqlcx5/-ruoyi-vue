<template>
  <el-card class="channel-container" :gutter="12" shadow="never">
    <el-form
      :model="queryParams"
      class="wg-query-form w-full"
      ref="elFormRef"
      label-position="left"
    >
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="线索平台所属部门">
            <el-input v-model="queryParams.shopName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="线索平台">
            <el-input v-model="queryParams.sourceName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6" class="!flex flex-column justify-between">
          <div>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <ContentWrap>
    <!--    列表-->
    <XTable @register="registerTable">
      <template #toolbar_buttons>
        <XButton type="primary" :title="t('action.add')" @click="handleAdd()" />
      </template>
      <template #need_filter_default="{ row }">
        <el-switch
          v-model="row.needFilter"
          :active-value="0"
          :inactive-value="1"
          @change="handleNeedFilterChange(row, 'needFilter')"
        />
      </template>
      <template #actionbtns_default="{ row }">
        <XTextButton :title="t('action.edit')" @click="handleUpdate(row.id)" />
        <XTextButton :title="t('action.del')" @click="deleteData(row.id)" />
      </template>
    </XTable>
  </ContentWrap>
  <XModal v-model="dialogVisible" :title="dialogTitle">
    <Form
      v-if="['add', 'edit'].includes(actionType)"
      :schema="allSchemas.formSchema"
      :rules="rules"
      ref="formRef"
    />
    <Descriptions />
    <template #footer>
      <XButton
        type="primary"
        :title="t('action.save')"
        :loading="actionLoading"
        @click="submitForm"
      />
      <XButton :title="t('dialog.close')" @click="dialogVisible = false" />
    </template>
  </XModal>
</template>

<script setup lang="ts" name="ClueChannel">
import { allSchemas, rules } from './channel.data'
import * as channelApi from '@/api/clue/channel'
import { FormExpose } from '@/components/Form'
import { unref } from 'vue'
import { CommonStatusEnum } from '@/utils/constants'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const queryParams = ref({ shopName: '', sourceName: '' })
const [registerTable, { reload, search: onSearch, deleteData }] = useXTable({
  tableKey: 'wg-basic-clue-channel',
  allSchemas: allSchemas,
  params: queryParams,
  getListApi: channelApi.getClueChannel,
  deleteApi: channelApi.delClueChannel,
  border: true
})

// 弹出框
const dialogVisible = ref(false) // 是否显示弹出层
const dialogTitle = ref('edit') // 弹出层标题
const actionLoading = ref(false) // 遮罩层
const actionType = ref('') // 操作按钮的类型
const formRef = ref<FormExpose>() // 表单 Ref

const handleAdd = () => {
  setDialogTitle('add')
}
const handleUpdate = async (rowId: string) => {
  setDialogTitle('update')
  const res = await channelApi.getClueChannelById(rowId)
  unref(formRef)?.setValues(res)
}

// 设置标题
const setDialogTitle = (type: string) => {
  dialogTitle.value = t('action.' + type)
  actionType.value = type
  dialogVisible.value = true
}

// 改变用户状态操作
const handleNeedFilterChange = async (row, type) => {
  const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
  let comfirmText = ''
  if (type === 'needFilter') {
    comfirmText = `是否确认${text}`
  }
  message
    .confirm(comfirmText, t('common.reminder'))
    .then(async () => {
      let updateStatus = false
      if (type === 'needFilter') {
        updateStatus = await channelApi.updateChannelSwitch(row.id, row.needFilter)
      }
      if (updateStatus) {
        message.success(text + '成功')
      } else {
        message.warning('sys.api.operationFailed')
      }
    })
    .catch(() => {
      row.status =
        row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
    })
}

// 保存按钮
const submitForm = async () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      actionLoading.value = true
      // 提交请求
      try {
        const data = unref(formRef)?.formModel as channelApi.ChannelVO
        if (actionType.value === 'add') {
          await channelApi.addClueChannel(data)
          message.success(t('common.createSuccess'))
        } else {
          await channelApi.updateClueChannel(data)
          message.success(t('common.updateSuccess'))
        }
        dialogVisible.value = false
      } finally {
        actionLoading.value = false
        // 刷新表格
        await reload()
      }
    }
  })
}
</script>

<style lang="scss" scoped></style>
