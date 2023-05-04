<template>
  <ContentWrap>
    <el-form class="query-form w-full" ref="elFormRef" :model="searchParams" label-position="left" label-width="70px">
      <el-row gutter="12">
        <el-col :span="4">
          <el-form-item label="参数名称">
            <el-input v-model="searchParams.name" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="参数键名">
            <el-input v-model="searchParams.key" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="系统内置">
            <el-select v-model="searchParams.type" placeholder="请选择">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_CONFIG_TYPE)" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchParams.createTime"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <!-- 列表 -->
    <XTable @register="registerTable" border>
      <template #toolbar_buttons>
        <!-- 操作：新增 -->
        <XButton
          type="primary"
          preIcon="ep:zoom-in"
          :title="t('action.add')"
          v-hasPermi="['infra:config:create']"
          @click="handleCreate()"
        />
<!--        &lt;!&ndash; 操作：导出 &ndash;&gt;-->
<!--        <XButton-->
<!--          type="warning"-->
<!--          preIcon="ep:download"-->
<!--          :title="t('action.export')"-->
<!--          v-hasPermi="['infra:config:export']"-->
<!--          @click="exportList('配置.xls')"-->
<!--        />-->
      </template>
      <template #visible_default="{ row }">
        <el-switch
          v-model="row.visible"
          :active-value="true"
          :inactive-value="false"
          @click.stop
          @change="handleStatusChange(row)"
        />
      </template>
      <template #actionbtns_default="{ row }">
        <!-- 操作：修改 -->
        <XTextButton
          :title="t('action.edit')"
          v-hasPermi="['infra:config:update']"
          @click="handleUpdate(row.id)"
        />
        <!-- 操作：详情 -->
        <XTextButton
          :title="t('action.detail')"
          v-hasPermi="['infra:config:query']"
          @click="handleDetail(row.id)"
        />
        <!-- 操作：删除 -->
        <XTextButton
          :title="t('action.del')"
          v-hasPermi="['infra:config:delete']"
          @click="deleteData(row.id, `是否确认删除参数名称为''${row.name}''的数据项?`)"
        />
      </template>
    </XTable>
  </ContentWrap>

  <XModal className="wg-xmodal" v-model="dialogVisible" :title="dialogTitle" width="534px">
    <!-- 对话框(添加 / 修改) -->
    <Form
      v-if="['create', 'update'].includes(actionType)"
      :schema="allSchemas.formSchema"
      :rules="rules"
      ref="formRef"
    />
    <!-- 对话框(详情) -->
    <Descriptions
      v-if="actionType === 'detail'"
      :schema="allSchemas.detailSchema"
      :data="detailData"
    >
      <template #visible="{ row }">
        <span>{{ row.visible ? '是' : '否' }} </span>
      </template>
    </Descriptions>
    <!-- 操作按钮 -->
    <template #footer>
      <!-- 按钮：保存 -->
      <XButton
        v-if="['create', 'update'].includes(actionType)"
        type="primary"
        :title="t('action.save')"
        :loading="actionLoading"
        @click="submitForm()"
      />
      <!-- 按钮：关闭 -->
      <XButton :loading="actionLoading" :title="t('dialog.close')" @click="dialogVisible = false" />
    </template>
  </XModal>
  <el-drawer v-model="detailVisible" title="详情" :size="763" :lock-scroll="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="text-20px font-700 !mb-0">详情</div>
    </template>
    <Descriptions
      :schema="allSchemas.detailSchema"
      :data="detailData"
    >
      <template #visible="{ row }">
        <span>{{ row.visible ? '是' : '否' }} </span>
      </template>
    </Descriptions>
  </el-drawer>
</template>
<script setup lang="ts" name="Config">
import type { FormExpose } from '@/components/Form'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
// 业务相关的 import
import * as ConfigApi from '@/api/infra/config'
import { rules, allSchemas } from './config.data'
import {CommonStatusEnum} from "@/utils/constants";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const searchParams = ref({
  name: '',
  key: '',
  type: '',
  createTime: [],
})
// 列表相关的变量
const [registerTable, { reload, deleteData, exportList }] = useXTable({
  allSchemas: allSchemas,
  params: searchParams,
  getListApi: ConfigApi.getConfigPageApi,
  deleteApi: ConfigApi.deleteConfigApi,
  exportListApi: ConfigApi.exportConfigApi
})

const onSubmit = async () => {
  await reload();
}

const onReset = async () => {
  searchParams.value = {
    name: '',
    key: '',
    type: '',
    createTime: [],
  }
  await reload();
}

// ========== CRUD 相关 ==========
const actionLoading = ref(false) // 遮罩层
const actionType = ref('') // 操作按钮的类型
const dialogVisible = ref(false) // 是否显示弹出层
const dialogTitle = ref('edit') // 弹出层标题
const formRef = ref<FormExpose>() // 表单 Ref
const detailData = ref() // 详情 Ref

// 设置标题
const setDialogTile = (type: string) => {
  dialogTitle.value = t('action.' + type)
  actionType.value = type
  dialogVisible.value = true
}

// 新增操作
const handleCreate = () => {
  setDialogTile('create')
}

const handleStatusChange = (row) => {
  const text = row.status === CommonStatusEnum.ENABLE ? '展示' : '隐藏'
  message
    .confirm(`是否确认${text}参数名称为"${row.name}"的数据项?`, t('common.reminder'))
    .then(async () => {
      let updateStatus = await ConfigApi.updateConfigApi({ ...row });
      if (updateStatus) {
        message.success(text + '成功');
      } else {
        message.warning(t('sys.api.operationFailed'));
      }
      await reload();
    })
    .catch(() => {
      row.status =
        row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
    })
}

// 修改操作
const handleUpdate = async (rowId: number) => {
  setDialogTile('update')
  // 设置数据
  const res = await ConfigApi.getConfigApi(rowId)
  unref(formRef)?.setValues(res)
}

const detailVisible = ref(false);
// 详情操作
const handleDetail = async (rowId: number) => {
  // setDialogTile('detail')
  const res = await ConfigApi.getConfigApi(rowId)
  detailData.value = res
  detailVisible.value = true;
}

// 提交按钮
const submitForm = async () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      actionLoading.value = true
      // 提交请求
      try {
        const data = unref(formRef)?.formModel as ConfigApi.ConfigVO
        if (actionType.value === 'create') {
          await ConfigApi.createConfigApi(data)
          message.success(t('common.createSuccess'))
        } else {
          await ConfigApi.updateConfigApi(data)
          message.success(t('common.updateSuccess'))
        }
        dialogVisible.value = false
      } finally {
        actionLoading.value = false
        // 刷新列表
        await reload()
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.query-form {
  :deep(.el-form-item--default) {
    margin-bottom: 0;
  }
}
</style>
