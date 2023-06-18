<template>
  <ContentWrap>
    <form-table
      ref="table"
      :form-options="{ schema: allSchemas.searchSchema }"
      :table-options="{
        columns: allSchemas.tableColumns,
        listApi: channelApi.getClueChannel,
        showAdd: true,
        actionButtons,
        selection: true
      }"
      @add="handleAdd"
    >
      <template #needFilter="{ row }">
        <el-switch
          v-model="row.needFilter"
          :active-value="1"
          :inactive-value="0"
          @change="handleNeedFilterChange(row, 'needFilter')"
        />
      </template>
    </form-table>
  </ContentWrap>
  <AddChannelModal ref="addChannelModalRef" />
</template>

<script setup lang="ts" name="ClueChannel">
import * as channelApi from '@/api/clue/channel'
import { FormExpose } from '@/components/Form'
import { unref } from 'vue'
import { CommonStatusEnum } from '@/utils/constants'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'

import AddChannelModal from './components/AddChannelModal.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const columns: TableColumn[] = [
  {
    label: '编号',
    field: 'serialNumber'
  },
  {
    label: '线索平台所属门店',
    field: 'shopName',
    isSearch: true
  },
  {
    label: '线索平台',
    field: 'clueSource',
    isSearch: true
  },
  {
    label: '平台账号',
    field: 'platformUsername'
  },
  {
    label: '平台密码',
    field: 'platformPassword'
  },
  {
    label: '创建人',
    field: 'createBy'
  },
  {
    label: '创建时间',
    field: 'createTime'
  },
  {
    label: '是否需要清洗',
    field: 'needFilter'
  },
  {
    label: '是否自动派发',
    field: 'autoDistribute'
  },
  {
    label: '是否线索平台规则派发',
    field: 'platformRule'
  },
  {
    label: '手动创建线索是否可选',
    field: 'isShow'
  },
  {
    label: '操作',
    field: 'action'
  }
]
const actionButtons = [
  {
    name: '编辑',
    click: (row) => {
      console.log(row)
      handleUpdate(row)
    }
  },
  {
    name: '删除',
    click: (row) => {
      console.log(row)
    }
  }
]

const { allSchemas } = useCrudSchemas(columns)

const formRef = ref<FormExpose>() // 表单 Ref

const addChannelModalRef = ref()
const { push } = useRouter() // 路由
const handleAdd = () => {
  push({
    path: '/clueChannel/source'
  })
  // setDialogTitle('add')
  // addChannelModalRef.value.openModal()
}
const handleUpdate = async (rowId: string) => {
  setDialogTitle('update')
  const res = await channelApi.getClueChannelById(rowId)
  unref(formRef)?.setValues(res)
}

// 设置标题
const setDialogTitle = (type: string) => {
  console.log(type)
  // dialogTitle.value = t('action.' + type)
  // actionType.value = type
  // dialogVisible.value = true
}

// 改变用户状态操作
const handleNeedFilterChange = async (row, type) => {
  console.log('===========================', row)
  return
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
</script>

<style lang="scss" scoped></style>
