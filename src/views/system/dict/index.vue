<template>
  <el-card class="dict" :gutter="12" shadow="never">
    <template #header>
      <div class="card-header text-18px font-medium">
        <span>字典分类</span>
      </div>
    </template>
    <div class="flex">
      <!-- ====== 字典分类 ====== -->
      <div class="w-1/2 overflow-hidden">
        <el-form
          class="query-form w-full"
          ref="elFormRef"
          :model="typeSearchForm"
          label-position="left"
          label-width="70px"
        >
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="字典名称">
                <el-input
                  v-model="typeSearchForm.name"
                  placeholder="请输入字典名称"
                  @keyup.enter="onTypeSearchSubmit"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="字典编码">
                <el-input
                  v-model="typeSearchForm.type"
                  placeholder="请输入字典编码"
                  @keyup.enter="onTypeSearchSubmit"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8" class="!flex flex-column justify-between">
              <div>
                <el-button type="primary" @click="onTypeSearchSubmit">查询</el-button>
                <el-button @click="onTypeSearchReset">重置</el-button>
              </div>
              <el-button class="!px-0" text @click="onTypeSearchToggle">
                {{ searchFormToggle ? '收起' : '展开'
                }}<i
                  class="iconfont icon-a-bianzu3 !text-12px transform transition-transform ml-2px"
                  :class="{ 'rotate-180': !searchFormToggle }"
                ></i>
              </el-button>
            </el-col>
            <el-col v-show="searchFormToggle" :span="8">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="typeSearchForm.createTime"
                  type="datetimerange"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col v-show="searchFormToggle" :span="8">
              <el-form-item label="状态">
                <el-select class="w-full" v-model="typeSearchForm.status" placeholder="请选择">
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-divider class="!mt-0 !mb-16px" />
        <XTable @register="registerType" @cell-click="cellClickEvent">
          <!-- 操作：新增类型 -->
          <template #toolbar_buttons>
            <XButton
              type="primary"
              iconFont="icon-xinzeng"
              :title="t('action.add')"
              v-hasPermi="['system:dict:create']"
              @click="handleTypeCreate()"
            />
          </template>
          <!--        <template #toolbar_tools>-->
          <!--          &lt;!&ndash; 操作：新增 &ndash;&gt;-->
          <!--          <XButton-->
          <!--            type="primary"-->
          <!--            preIcon="ep:zoom-in"-->
          <!--            title="dddddasd"-->
          <!--          />-->
          <!--        </template>-->
          <template #status_default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="0"
              :inactive-value="1"
              @click.stop
              @change="handleStatusChange(row, 'type')"
              disabled
            />
          </template>
          <template #actionbtns_default="{ row }">
            <!-- 操作：编辑类型 -->
            <XTextButton
              :title="t('action.edit')"
              v-hasPermi="['system:dict:update']"
              @click="handleTypeUpdate(row.id)"
            />
            <!--            &lt;!&ndash; 操作：删除类型 &ndash;&gt;-->
            <!--            <XTextButton-->
            <!--              :title="t('action.del')"-->
            <!--              v-hasPermi="['system:dict:delete']"-->
            <!--              @click="typeDeleteData(row.id, `是否删除字典名称为''${row.name}''的数据项?`)"-->
            <!--            />-->
          </template>
        </XTable>
      </div>

      <!-- ====== 字典数据 ====== -->
      <div class="w-1/2 dict px-12px py-18px ml-50px shadow-card rounded-2px overflow-hidden">
        <p class="text-18px font-medium">字典数据</p>
        <div v-if="!tableTypeSelect" class="text-20px text-tip text-center mt-248px"
          >请从左侧选择</div
        >
        <div v-else>
          <el-form
            class="query-form w-full"
            ref="elFormRef"
            :model="queryParams"
            label-position="left"
            label-width="70px"
          >
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="数据标签">
                  <el-input
                    v-model="queryParams.label"
                    placeholder="请输入数据标签"
                    @keyup.enter="onDataSearchSubmit"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" class="!flex flex-column justify-between">
                <div>
                  <el-button type="primary" @click="onDataSearchSubmit">查询</el-button>
                  <el-button @click="onDataSearchReset">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <el-divider class="!mt-0 !mb-16px" />
          <!-- 列表 -->
          <XTable @register="registerData">
            <!-- 操作：新增数据 -->
            <template #toolbar_buttons>
              <XButton
                type="primary"
                iconFont="icon-xinzeng"
                :title="t('action.add')"
                v-hasPermi="['system:dict:create']"
                @click="handleDataCreate()"
              />
            </template>
            <template #status_default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="0"
                :inactive-value="1"
                @change="handleStatusChange(row, 'data')"
                disabled
              />
            </template>
            <template #actionbtns_default="{ row }">
              <!-- 操作：修改数据 -->
              <XTextButton
                v-hasPermi="['system:dict:update']"
                :title="t('action.edit')"
                @click="handleDataUpdate(row.id)"
              />
              <!-- 操作：详情 -->
              <XTextButton
                v-hasPermi="['system:dict:update']"
                :title="t('action.detail')"
                @click="handleDataDetail(row)"
              />
              <!--              &lt;!&ndash; 操作：删除数据 &ndash;&gt;-->
              <!--              <XTextButton-->
              <!--                v-hasPermi="['system:dict:delete']"-->
              <!--                :title="t('action.del')"-->
              <!--                @click="dataDeleteData(row.id, `是否确认删除数据标签为''${row.label}''的数据项?`)"-->
              <!--              />-->
            </template>
          </XTable>
        </div>
      </div>
    </div>
    <XModal id="dictModel" v-model="dialogVisible" :title="dialogTitle" width="534px">
      <Form
        v-if="['typeCreate', 'typeUpdate'].includes(actionType)"
        :schema="DictTypeSchemas.allSchemas.formSchema"
        :rules="DictTypeSchemas.dictTypeRules"
        ref="typeFormRef"
      >
        <template #type>
          <template v-if="actionType == 'typeUpdate'">
            <el-tag>{{ dictTypeValue }}</el-tag>
          </template>
          <template v-else
            ><el-input
              v-model="dictTypeValue"
              placeholder="请输入字典编码"
              @input="(val) => (dictTypeValue = val.replace(/[^a-zA-Z0-9]/g, ''))"
            />
          </template>
        </template>
      </Form>
      <Form
        v-if="['dataCreate', 'dataUpdate'].includes(actionType)"
        :schema="DictDataSchemas.allSchemas.formSchema"
        :rules="DictDataSchemas.dictDataRules"
        ref="dataFormRef"
      >
        <template #value="row">
          <template v-if="['dataUpdate'].includes(actionType)">
            <div>{{ row.value }}</div>
          </template>
          <template v-else
            ><el-input
              v-model="row.value"
              placeholder="请输入数据键值"
              @input="(val) => (row.value = val.replace(/[^a-zA-Z0-9]/g, ''))"
            />
          </template>
        </template>
      </Form>
      <Form
        v-if="['dataLevel3Create', 'dataLevel3Update'].includes(actionType)"
        :schema="DictDataLevel3Schemas.allSchemas.formSchema"
        :rules="DictDataLevel3Schemas.dictDataRules"
        ref="dataFormRef"
      >
        <template #value="row">
          <template v-if="['dataLevel3Update'].includes(actionType)">
            <div>{{ row.value }}</div>
          </template>
          <template v-else
            ><el-input
              v-model="row.value"
              placeholder="请输入子项键值"
              @input="(val) => (row.value = val.replace(/[^a-zA-Z0-9]/g, ''))"
            />
          </template>
        </template>
      </Form>
      <!-- 操作按钮 -->
      <template #footer>
        <XButton
          v-if="['typeCreate', 'typeUpdate'].includes(actionType)"
          type="primary"
          :title="t('action.save')"
          :loading="actionLoading"
          @click="submitTypeForm"
        />
        <XButton
          v-if="
            ['dataCreate', 'dataUpdate', 'dataLevel3Create', 'dataLevel3Update'].includes(
              actionType
            )
          "
          type="primary"
          :title="t('action.save')"
          :loading="actionLoading"
          @click="submitDataForm"
        />
        <XButton :title="t('dialog.close')" @click="dialogVisible = false" />
      </template>
    </XModal>
    <XModal v-model="dictDataVisible" :title="`${dictDataSelected?.label}数据详情`" width="1045px">
      <el-form
        class="query-form w-full"
        ref="elFormRef"
        :model="dataLevel3queryParams"
        label-position="left"
        label-width="70px"
      >
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item label="子项标签" class="!mb-0">
              <el-input v-model="dataLevel3queryParams.label" placeholder="请输入子项标签" />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="!flex flex-column justify-between">
            <div>
              <el-button type="primary" @click="onDataSearchSubmit('dataLevel3')">查询</el-button>
              <el-button @click="onDataSearchReset('dataLevel3')">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-divider class="!my-12px" />
      <XTable @register="registerDataLevel3">
        <!-- 操作：新增数据 -->
        <template #toolbar_buttons>
          <XButton
            type="primary"
            iconFont="icon-xinzeng"
            :title="t('action.add')"
            v-hasPermi="['system:dict:create']"
            @click="handleDataCreate('dataLevel3Create')"
          />
        </template>
        <template #status_default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(row, 'dataLevel3')"
            disabled
          />
        </template>
        <template #actionbtns_default="{ row }">
          <!-- 操作：修改数据 -->
          <XTextButton
            v-hasPermi="['system:dict:update']"
            :title="t('action.edit')"
            @click="handleDataUpdate(row.id, 'dataLevel3Update')"
          />
          <!--          &lt;!&ndash; 操作：删除数据 &ndash;&gt;-->
          <!--          <XTextButton-->
          <!--            v-hasPermi="['system:dict:delete']"-->
          <!--            :title="t('action.del')"-->
          <!--            @click="dataLevel3DeleteData(row.id, `是否确认删除子项标签为''${row.label}''的数据项?`)"-->
          <!--          />-->
        </template>
      </XTable>
    </XModal>
  </el-card>
</template>
<script setup lang="ts" name="Dict">
import { VxeTableEvents } from 'vxe-table'
import type { FormExpose } from '@/components/Form'
import * as DictTypeSchemas from './dict.type'
import * as DictDataSchemas from './dict.data'
import * as DictDataLevel3Schemas from './dict.dataLevel3'
import * as DictTypeApi from '@/api/system/dict/dict.type'
import * as DictDataApi from '@/api/system/dict/dict.data'
import { DictDataVO, DictTypeReqVO } from '@/api/system/dict/types'
import { CommonStatusEnum } from '@/utils/constants'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { reactive } from 'vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const typeSearchForm = ref({
  createTime: []
})
const [registerType, { reload: typeGetList, deleteData: typeDeleteData }] = useXTable({
  tableKey: 'dict-type-table',
  allSchemas: DictTypeSchemas.allSchemas,
  params: typeSearchForm,
  getListApi: DictTypeApi.getDictTypePageApi,
  deleteApi: DictTypeApi.deleteDictTypeApi,
  border: true,
  pagerConfig: { border: false, background: false, perfect: false, pagerCount: 4 },
  height: 660
})

const queryParams = reactive({
  parentId: 0,
  dictType: null,
  label: ''
})
const [registerData, { reload: dataGetList, deleteData: dataDeleteData }] = useXTable({
  tableKey: 'dict-data-table',
  allSchemas: DictDataSchemas.allSchemas,
  params: queryParams,
  getListApi: DictDataApi.getDictDataPageApi,
  deleteApi: DictDataApi.deleteDictDataApi,
  border: true,
  height: 606
})

const dataLevel3queryParams = reactive({
  parentId: null,
  label: ''
})
const [registerDataLevel3, { reload: dataLevel3GetList, deleteData: dataLevel3DeleteData }] =
  useXTable({
    tableKey: 'dict-level3data-table',
    allSchemas: DictDataLevel3Schemas.allSchemas,
    params: dataLevel3queryParams,
    getListApi: DictDataApi.getDictDataPageApi,
    deleteApi: DictDataApi.deleteDictDataApi,
    border: true
  })

// ========== 字典分类列表相关 ==========
const dictTypeValue = ref('')
// 字典分类修改操作
const handleTypeCreate = () => {
  dictTypeValue.value = ''
  setDialogTile('typeCreate')
}
const handleTypeUpdate = async (rowId: number) => {
  setDialogTile('typeUpdate')
  // 设置数据
  const res = await DictTypeApi.getDictTypeApi(rowId)
  dictTypeValue.value = res.type
  unref(typeFormRef)?.setValues(res)
}
// 分类搜索
const searchFormToggle = ref(false)
const onTypeSearchToggle = () => {
  searchFormToggle.value = !searchFormToggle.value
}
const onTypeSearchSubmit = async () => {
  await typeGetList()
}
const onTypeSearchReset = async () => {
  typeSearchForm.value = {
    createTime: []
  }
  await typeGetList()
}

// data搜索
const onDataSearchSubmit = async (type) => {
  if (type === 'dataLevel3') {
    await dataLevel3GetList()
  } else {
    await dataGetList()
  }
}
const onDataSearchReset = async (type) => {
  if (type === 'dataLevel3') {
    dataLevel3queryParams.label = ''
    await dataLevel3GetList()
  } else {
    queryParams.label = ''
    await dataGetList()
  }
}
const dictDataVisible = ref(false) // 字典数据详情是否显示弹出层
const dictDataSelected = ref() // 操作字典数据
//字典数据详情
const handleDataDetail = async (row) => {
  dictDataSelected.value = row
  dictDataVisible.value = true
  dataLevel3queryParams.parentId = row.id
}
// 字典数据修改操作
const handleDataCreate = (type = 'dataCreate') => {
  setDialogTile(type)
}
const handleDataUpdate = async (rowId: number, type = 'dataUpdate') => {
  setDialogTile(type)
  // 设置数据
  const res = await DictDataApi.getDictDataApi(rowId)
  unref(dataFormRef)?.setValues(res)
}
// 字典分类点击行事件
const parent = ref()
const tableTypeSelect = ref(false)

const cellClickEvent: VxeTableEvents.CellClick = async ({ row }) => {
  tableTypeSelect.value = true
  queryParams.dictType = row['type']
  queryParams.label = ''
  await nextTick()
  await dataGetList()
  parent.value = row
}

// 改变用户状态操作
const handleStatusChange = async (row, type) => {
  const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
  let confirmText = ''
  if (type === 'type') {
    confirmText = `是否确认${text}字典名称为"${row.name}"的数据项?`
  } else if (type === 'data') {
    confirmText = `是否确认${text}数据标签为"${row.label}"的数据项?`
  } else if (type === 'dataLevel3') {
    confirmText = `是否确认${text}子项标签为"${row.label}"的数据项?`
  }
  message
    .confirm(confirmText, t('common.reminder'))
    .then(async () => {
      let updateStatus = false
      if (type === 'type') {
        updateStatus = await DictTypeApi.updateDictTypeApi({ ...row })
        await typeGetList()
      } else if (type === 'data') {
        updateStatus = await DictDataApi.updateDictDataApi({ ...row })
        await dataGetList()
      } else if (type === 'dataLevel3') {
        updateStatus = await DictDataApi.updateDictDataApi({ ...row })
        await dataLevel3GetList()
      }
      if (updateStatus) {
        message.success(text + '成功')
      } else {
        message.warning(t('sys.api.operationFailed'))
      }
    })
    .catch(() => {
      row.status =
        row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
    })
}

// 弹出框
const dialogVisible = ref(false) // 是否显示弹出层
const dialogTitle = ref('edit') // 弹出层标题
const actionLoading = ref(false) // 遮罩层
const typeFormRef = ref<FormExpose>() // 分类表单 Ref
const dataFormRef = ref<FormExpose>() // 数据表单 Ref
const actionType = ref('') // 操作按钮的类型

// 设置标题
const setDialogTile = (type: string) => {
  if (type === 'dataLevel3Create') {
    dialogTitle.value = '子项数据新增'
  } else if (type === 'dataLevel3Update') {
    dialogTitle.value = '子项数据编辑'
  } else {
    dialogTitle.value = t('action.' + type)
  }
  actionType.value = type
  dialogVisible.value = true
}

// 同步dictTypeValue到form 否则导致表单验证不通过
watch(dictTypeValue, (val) => {
  unref(typeFormRef)?.setValues({ type: val })
})

// 提交按钮
const submitTypeForm = async () => {
  const elForm = unref(typeFormRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid && dictTypeValue.value != '') {
      actionLoading.value = true
      // 提交请求
      try {
        const data = unref(typeFormRef)?.formModel as DictTypeReqVO
        if (actionType.value === 'typeCreate') {
          data.type = dictTypeValue.value
          await DictTypeApi.createDictTypeApi(data).then(() => {
            message.success(t('common.createSuccess'))
            typeGetList()
          })
        } else if (actionType.value === 'typeUpdate') {
          await DictTypeApi.updateDictTypeApi(data).then(() => {
            message.success(t('common.updateSuccess'))
            typeGetList()
          })
        }
        dialogVisible.value = false
      } finally {
        actionLoading.value = false
      }
    }
  })
}
const submitDataForm = async () => {
  const elForm = unref(dataFormRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      actionLoading.value = true
      // 提交请求
      try {
        const data = unref(dataFormRef)?.formModel as DictDataVO
        if (['dataLevel3Create', 'dataLevel3Update'].includes(actionType.value)) {
          data.dictType = dictDataSelected.value.dictType
          data.parentId = dictDataSelected.value.id
          data.defaultLevel = 3
        }
        if (actionType.value === 'dataCreate') {
          data.dictType = parent.value.type
          await DictDataApi.createDictDataApi(data).then(() => {
            message.success(t('common.createSuccess'))
            dataGetList()
            typeGetList()
          })
        } else if (actionType.value === 'dataUpdate') {
          await DictDataApi.updateDictDataApi(data).then(() => {
            message.success(t('common.updateSuccess'))
            dataGetList()
          })
        } else if (actionType.value === 'dataLevel3Create') {
          await DictDataApi.createDictDataApi(data).then(() => {
            message.success(t('common.createSuccess'))
            dataLevel3GetList()
            dataGetList()
          })
        } else if (actionType.value === 'dataLevel3Update') {
          await DictDataApi.updateDictDataApi(data).then(() => {
            message.success(t('common.updateSuccess'))
            dataLevel3GetList()
          })
        }
        dialogVisible.value = false
      } finally {
        actionLoading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped></style>
