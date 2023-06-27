<template>
  <XModal v-model="dialogVisible" width="665px" :title="dialogTitle">
    <!-- 对话框(添加 / 修改) -->
    <Form
      v-if="['create', 'update'].includes(actionType)"
      :schema="allSchemas.formSchema"
      :rules="rules"
      ref="formRef"
    >
      <template #clueChannelId="form">
        <el-cascader
          :options="clueChannelTreeList"
          :props="clueChannelIdProps"
          v-model="form.clueChannelId"
          collapse-tags
          collapse-tags-tooltip
          clearable
        />
      </template>
      <template #filterUserId="form">
        <el-cascader
          :options="userOptions"
          :props="filterUserIdProps"
          v-model="form.filterUserId"
          collapse-tags
          collapse-tags-tooltip
          clearable
        />
        <!-- <div v-else>请先选择线索渠道</div> -->
      </template>
      <template #distributeShopIdList="form">
        <el-cascader
          :options="shopOptions"
          :props="props"
          v-model="form.distributeShopIdList"
          collapse-tags
          collapse-tags-tooltip
          clearable
          @change="changeShopIdList"
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
import { rules, allSchemas } from './dispatchStrategy.data'
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import * as postApi from '@/api/system/post/info'
import { getAllStoreList } from '@/api/system/organization/index'
import { listToTree } from '@/utils/tree'
// import { useCommonList } from '@/hooks/web/useCommonList'
// const { getMemberList } = useCommonList()

const formRef = ref<FormExpose>() // 表单 Ref
const { t } = useI18n() // 国际化
const message = useMessage()

let dialogVisible = ref(false)
let dialogTitle = ref('新增')
const actionLoading = ref(false) // 遮罩层
let actionType = ref('create') // 操作按钮的类型
const emit = defineEmits(['refreshList'])
const props = {
  multiple: true,
  label: 'name',
  value: 'id',
  emitPath: false
}

// 获取线索渠道
let clueChannelTreeList = ref<any[]>([])
const getShopUserList = async () => {
  let data = await dispatchApi.getClueChannelTree()
  if (data && data.length > 0) {
    data = data.map((item) => {
      item.label = item.companyShopName
      item.value = ''
      item.children = item.list.map((lItem) => {
        lItem.label = lItem.sourceName
        lItem.value = lItem.clueChannelId
        return lItem
      })
      return item
    })
    clueChannelTreeList.value = data
  }
}
const clueChannelIdProps = {
  emitPath: false
}
const filterUserIdProps = {
  label: 'clueName',
  value: 'clueSourceId',
  emitPath: false
}
// 获取岗位精简信息列表
const getListSimplePosts = async () => {
  let data = await postApi.listSimplePostsApi()
  if (data) {
    console.log(data)
    getfilterUserId()
  }
}
// 根据岗位岗位获取清洗员
let userOptions = ref<any[]>([])
const getfilterUserId = async () => {
  // userOptions.value = getMemberList({
  //   belongShopid: 0,
  //   childRuleValue: ''
  // }).value
}
getListSimplePosts()

// 获取门店
let shopOptions = []
const getShopList = async () => {
  const data = await getAllStoreList()
  shopOptions = listToTree(data || [], { pid: 'parentId' })
  console.log(shopOptions)
}
const changeShopIdList = (val) => {
  console.log(val)
  // let ids = val.reduce((prev, cur) => {
  //   console.log(prev, cur)

  //   return [...prev, ...cur]
  // }, [])
  // console.log(ids)

  getDistributeShopUserList(val)
}
getShopList()

// 根据门店获取成员
const getDistributeShopUserList = async (ids) => {
  let params = {
    shopIdList: ids
  }
  let data = await dispatchApi.getDistributeShopUserList(params)
  if (data) {
    let userList = data.userList || []
    tableList.value = userList.map((item) => {
      let autoBrandNames = item.autoBrandNames
      item.autoBrandNames = formatBrandSeries(autoBrandNames)
      let autoSeriesNames = item.autoSeriesNames
      item.autoSeriesNames = formatBrandSeries(autoSeriesNames)
      return item
    })
  }
}

const formatBrandSeries = (names) => {
  let autoBrandNames = ''
  if (Object.prototype.toString.call(names) == '[object String]') {
    try {
      names = JSON.parse(names)
      if (Object.prototype.toString.call(names) == '[object Array]') {
        autoBrandNames = names.join(',')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return autoBrandNames
}

// onMounted(() => {
//   console.log('======')
// })

const openDialog = (editType, data) => {
  console.log(editType, data)

  dialogVisible.value = true
  actionType.value = editType
  getShopUserList()
  if (data && data.distributeShopList) {
    setTimeout(() => {
      data.distributeShopIdList = data.distributeShopList.map((item) => item.distributeShopId)
      if (formRef.value) {
        formRef.value.setValues(data)
      }
    }, 200)
  }
}
defineExpose({ openDialog })
// 保存按钮
const submitForm = async () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      actionLoading.value = true
      // 提交请求
      try {
        const data: any = unref(formRef)?.formModel
        console.log(data)

        if (actionType.value == 'create') {
          clueDistributeSave(data)
        } else {
          clueDistributeUpdate(data)
        }

        // dialogVisible.value = false
      } finally {
        actionLoading.value = false
      }
    }
  })
}

const clueDistributeSave = async (dataSource) => {
  let clueChannelId = dataSource.clueChannelId || ''
  let filterUserId = dataSource.filterUserId || ''
  let clueAffiliation = {
    clueChannelId: clueChannelId,
    filterUserId: filterUserId
  }

  let distributeShopIdList = dataSource.distributeShopIdList || []
  // let newDistributeShopIdList = distributeShopIdList.reduce((prev, cur) => {
  //   return [...prev, ...cur]
  // }, [])

  let params = {
    clueAffiliationList: [clueAffiliation],
    distributeShopIdList: distributeShopIdList
  }
  let data = await dispatchApi.clueDistributeSaveV2(params)
  if (data) {
    message.success('操作成功')
    emit('refreshList')
    dialogVisible.value = false
  }
}
const clueDistributeUpdate = async (params) => {
  let data = await dispatchApi.clueDistributeUpdateV2(params)
  if (data) {
    message.success('操作成功')
    emit('refreshList')
    dialogVisible.value = false
    console.log(data)
  }
}

const tableColumns = [
  {
    label: '门店',
    field: 'distributeShopName',
    minWidth: '100px'
  },
  {
    label: '成员',
    field: 'distributeUserName',
    minWidth: '80px'
  },
  {
    label: '成员平台昵称',
    field: 'nickname',
    minWidth: '120px'
  },
  {
    label: '销量品牌',
    field: 'autoBrandNames',
    minWidth: '100px'
  },
  {
    label: '销量品牌',
    field: 'autoSeriesNames',
    minWidth: '100px'
  },
  {
    label: '派单状态',
    field: 'status',
    minWidth: '80px',
    formatter: (_, __, val: string) => {
      let obj = {
        0: '禁用',
        1: '启用'
      }
      return obj[val] || ''
    }
  }
]
// 岗位类型table
const tableList = ref<any[]>([])
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
