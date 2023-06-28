<!--  敏感词管理  -->
<template>
  <FormTable
    ref="tableRef"
    :form-options="{
      schema: allSchemas.searchSchema
    }"
    :table-options="{
      columns: allSchemas.tableColumns,
      listApi: getTableList,
      showAdd: hasPermission('system:sensitive-word:create'),
      actionButtons
    }"
    @add="
      () => {
        state.modalType = 'create'
        state.isShowAddEdit = true
      }
    "
  >
    <template #tableAppend>
      <!-- 操作：导出 -->
      <XButton
        plain
        preIcon="svg-icon:export"
        :title="t('action.export')"
        v-hasPermi="['system:sensitive-word:export']"
        @click="exportList('敏感词数据.xls')"
      />
    </template>
    <template #tags="{ row }">
      <el-tag
        style="margin-left: 5px"
        :disable-transitions="true"
        :key="index"
        v-for="(tag, index) in row.tags"
        :index="index"
      >
        {{ tag }}
      </el-tag>
    </template>
    <template #status="{ row }">
      <el-switch
        v-model="row.status"
        :active-value="0"
        :inactive-value="1"
        @change="statusChange($event, row)"
      />
    </template>
  </FormTable>

  <Dialog
    v-model="state.isShowAddEdit"
    :title="state.modalType === 'create' ? '新增' : '编辑'"
    width="534"
    @confirm="submitForm"
    @cancel="state.isShowAddEdit = false"
  >
    <!-- 对话框(添加 / 修改) -->
    <Form
      v-if="['create', 'update'].includes(state.modalType)"
      :schema="state.formState"
      :rules="rules"
      isCol
      ref="formRef"
    >
      <!--      <template #tags="form">-->
      <!--        <el-select v-model="form['tags']" multiple placeholder="请选择" style="width: 100%">-->
      <!--          <el-option v-for="item in tagsOptions" :key="item" :label="item" :value="item" />-->
      <!--        </el-select>-->
      <!--      </template>-->
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import FormTable from '@/components/FormTable/src/FormTable.vue'

import * as SensitiveWordApi from '@/api/system/sensitiveWord-tenant'
import { getSensitiveWordPageApi } from '@/api/system/sensitiveWord-tenant'

import { TableColumn } from '@/types/table'
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
// import { getConfigPageApi } from '@/api/infra/config'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { FormExpose } from '@/components/Form'
import { hasPermission } from '@/utils/utils'
// import { FormItemProps } from '@/types/form'
import { getOrganizationTypeList } from '@/api/system/organization'

const message = useMessage() // 消息弹窗

const { t } = useI18n()

const tableRef = ref()

const getTableList = async (params) => {
  const res = getSensitiveWordPageApi(params)
  console.log('res', res)
  return res
}

const columns: TableColumn[] = [
  {
    label: '敏感词编号',
    field: 'index',
    width: 100,
    type: 'index'
  },
  {
    label: '敏感词',
    field: 'name',
    isSearch: true
  },
  {
    label: '标签',
    field: 'tag',
    isTable: false,
    isForm: false,
    isDetail: false,
    isSearch: true
  },
  {
    label: '标签',
    field: 'tags'
  },
  {
    label: t('common.status'),
    field: 'status',
    dictType: DICT_TYPE.COMMON_STATUS,
    dictClass: 'number',
    isSearch: true
  },
  {
    label: '描述',
    field: 'description',
    form: {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 4
      },
      colProps: {
        span: 24
      }
    }
  },
  // {
  //   label: t('common.createTime'),
  //   field: 'createTime',
  //   formatter: 'formatDate',
  //   isForm: false,
  //   search: {
  //     show: true,
  //     itemRender: {
  //       name: 'XDataTimePicker'
  //     }
  //   }
  // },
  {
    label: t('common.createTime'),
    field: 'createTime',
    width: 170,
    isSearch: true,
    search: {
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD hh:mm:ss'
      }
    },
    formatter: (_, __, val: string) => {
      return formatDate(new Date(val))
    }
  }
  // {
  //   label: '操作',
  //   field: 'action',
  //   showOverflowTooltip: false
  // }
]

const { allSchemas } = useCrudSchemas(columns)

// 获取标签
const tagsOptions = ref()
const getTags = async () => {
  // const res = await SensitiveWordApi.getSensitiveWordTagsApi()
  //获取数据字典
  const dictRes = await getOrganizationTypeList(null)
  //字典标签数组对象
  const sensitiveWordsTagsList = dictRes.filter((item) => item.dictType === 'sensitive_words_tags')
  console.log(
    '🚀 ~ file: index.vue:195 ~ getTags ~ sensitiveWordsTagsList:',
    sensitiveWordsTagsList
  )
  //获取字典标签中文list
  tagsOptions.value = sensitiveWordsTagsList.map((item) => item.label)
  // tagsOptions.value = res
}

const actionLoading = ref(false) // 遮罩层
// const actionType = ref('') // 操作按钮的类型
// const dialogVisible = ref(false) // 是否显示弹出层
// const dialogTitle = ref('edit') // 弹出层标题
const formRef = ref<FormExpose>() // 表单 Ref
// const detailData = ref() // 详情 Ref
console.log('test')

// 表单校验
const rules = reactive({
  name: [required],
  tags: [required]
})

const state = reactive({
  isShowAddEdit: false,
  modalType: 'create',
  formState: [
    {
      label: '敏感词',
      field: 'name',
      component: 'Input',
      colProps: {
        span: 24
      }
    },
    {
      label: '标签',
      field: 'tags',
      component: 'Select',
      componentProps: {
        multiple: true,
        style: {
          width: '100%'
        },
        options: computed(() => {
          return tagsOptions.value.map((item) => {
            return {
              label: item,
              value: item
            }
          })
        })
      },
      colProps: {
        span: 24
      }
    },
    {
      label: '状态',
      field: 'status',
      component: 'Switch',
      value: true,
      colProps: {
        span: 24
      }
    },
    {
      label: '描述',
      field: 'description',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 4
      },
      colProps: {
        span: 24
      }
    }
  ]
})

const exportList = (fileName) => {
  // exportSensitiveWordApi(fileName)
  //TODO 导出
  console.log('导出', fileName)
}

const actionButtons = [
  {
    name: '编辑',
    permission: hasPermission('system:sensitive-word:update'),
    click: async ({ id }) => {
      state.modalType = 'update'
      state.isShowAddEdit = true
      const res = await SensitiveWordApi.getSensitiveWordApi(id)
      res.status = res.status === 0
      unref(formRef)?.setValues(res)
    }
  },
  //TODO 详情说先不做 后面再统一
  {
    name: '详情',
    permission: false && hasPermission('system:sensitive-word:update'),
    click: () => {
      console.log('详情')
    }
  },
  {
    name: '删除',
    permission: hasPermission('system:sensitive-word:delete'),
    click: async ({ id }) => {
      console.log('删除')
      await message.confirm('是否删除所选中数据？', '系统提示')
      await SensitiveWordApi.deleteSensitiveWordApi(id)
      message.success('删除成功')
      // 刷新列表
      await tableRef.value.tableMethods.reload()
    }
  }
]

const statusChange = async (_, { id }) => {
  if (!id) {
    return
  }
  state.modalType = 'update'
  const res = await SensitiveWordApi.getSensitiveWordApi(id)
  res.status = !(res.status === 0)
  const tempParams = res
  tempParams!.status = tempParams!.status ? '0' : '1'
  const data = tempParams as SensitiveWordApi.SensitiveWordVO
  await SensitiveWordApi.updateSensitiveWordApi(data)
  message.success(t('common.updateSuccess'))
  // 刷新列表
  await tableRef.value.tableMethods.reload()
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
        const tempParams = unref(formRef)?.formModel
        tempParams!.status = tempParams!.status ? '0' : '1'
        const data = tempParams as SensitiveWordApi.SensitiveWordVO
        if (state.modalType === 'create') {
          await SensitiveWordApi.createSensitiveWordApi(data)
          message.success(t('common.createSuccess'))
        } else {
          await SensitiveWordApi.updateSensitiveWordApi(data)
          message.success(t('common.updateSuccess'))
        }
        state.isShowAddEdit = false
      } finally {
        actionLoading.value = false
        // 刷新列表
        await tableRef.value.tableMethods.reload()
      }
    }
  })
}

onMounted(async () => {
  await getTags()
})
</script>

<style lang="scss" scoped>
.content {
  width: 100px;
  height: 100px;
  background: skyblue;
}
</style>
