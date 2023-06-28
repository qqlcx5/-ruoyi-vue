<template>
  <XModal
    :loading="btnLoading"
    :title="editFlag ? '修改' : '新增'"
    v-model="visible"
    width="60%"
    height="70%"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef">
      <el-form-item label="所属门店" prop="shopIdList">
        <el-cascader
          ref="treeShopCascader"
          v-model="ruleForm.shopIdList"
          placeholder="请选择门店"
          :options="shopTreeList"
          collapse-tags
          collapse-tags-tooltip
          filterable
          @visible-change="getDistributeShopIdList"
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
    <div
      >派发人员配置(请先选择门店)
      <!--      <XButton type="primary" @click="addMemberRule">添加行</XButton>-->
    </div>
    <div class="mb-15">
      <el-cascader
        v-model="memberList"
        ref="memberCasRef"
        collapse-tags
        filterables
        :options="shopUserList"
        :props="{ label: 'name', value: 'id', children: 'users', emitPath: false, multiple: true }"
        @change="addMemberRule"
      />
    </div>
    <el-table :data="memberTableList" :header-cell-style="{ backgroundColor: '#F6F6F6' }">
      <el-table-column label="门店" width="200px">
        <template #default="{ row }">
          <span>{{ row.shopName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员" width="150px">
        <template #default="{ row }">
          <span>{{ row.distributeUserName + '-' + row.positionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员平台昵称">
        <template #default="{ row }">
          <el-input v-model="row.nickname" placeholder="昵称" />
        </template>
      </el-table-column>
      <el-table-column label="销售品牌/车系" width="220px">
        <template #default="{ row }">
          <el-cascader
            ref="brandCasRef"
            v-model="row.brandArr"
            :options="brandAndSeriesOption"
            collapse-tags
            filterable
            :props="{ multiple: true, label: 'name', value: 'id' }"
            @change="brandAndSeriesChange($event, row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="派单状态">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column label="跟进是否回推厂家">
        <template #default="{ row }">
          <el-switch
            v-model="row.pushBackFactoryStatus"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
            inline-prompt
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template #default="{ row, $index }">
          <el-button text type="primary" @click="deleteRow(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <XButton type="primary" @click="onConfirm">确定</XButton>
      <XButton @click="hide">取消</XButton>
    </template>
  </XModal>
</template>

<script setup lang="ts" name="dipatchMemberCrud">
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import type { FormRules, FormInstance } from 'element-plus'
import { ref } from 'vue'
import { getAllBrand, querySeriesDetailsTree } from '@/api/model/brand'
import { getMemberTreeDataList } from '@/api/common'
import { difference } from 'lodash-es'
onMounted(() => {
  getBrandInfo()
  getBrandAndSeriesTreeList()
})
const treeShopCascader = ref()
const message = useMessage()
const visible = ref(false)
const btnLoading = ref(false)
const emit = defineEmits(['refresh'])
const formRef = ref<FormInstance>()
const ruleForm = ref({
  shopIdList: []
})
const rules: FormRules = reactive<FormRules>({
  shopIdList: [{ required: true, message: '请选择门店', trigger: 'blur' }]
})
const hide = () => {
  visible.value = false
}
const editFlag = ref<boolean>(false)
const openDialog = (id: string, formShopTreeList: any) => {
  nextTick(async () => {
    memberTableList.value = []
    shopTreeList.value = formShopTreeList
    editFlag.value = !!id
    if (id) {
      await getMemberTreeListApi()
      dispatchApi.getClueDistributeUserDetail(id).then((res) => {
        const shopIdArr = ref<number[]>([res.shopId])
        ruleForm.value.shopIdList = shopIdArr.value
        memberTableList.value = res.userList.map((item) => {
          item.shopName = item.distributeShopName
          item.shopId = item.distributeShopId
          item.brandArr = parseGetSeries(item.autoBrandIds)
          item.brandList = parseBrandList(item.autoBrandIds)
          memberList.value.push(item.distributeUserId)
          return item
        })
      })
    } else {
      ruleForm.value = { shopIdList: [] }
      memberList.value = []
    }
    visible.value = true
  })
}
// watch(
//   () => ruleForm.value,
//   (val) => console.log(val, '11111'),
//   { deep: true }
// )
const brandAndSeriesOption = ref<object[]>([])
const getBrandAndSeriesTreeList = async () => {
  const data = await querySeriesDetailsTree()
  brandAndSeriesOption.value = data
}
const parseBrandList = (str) => {
  return str && JSON.parse(str)
}
const parseGetSeries = (str) => {
  const seriesIds = ref<number[]>([])
  str &&
    JSON.parse(str).forEach((item) => {
      if (item.seriesIds.length > 0 && item.seriesIds[0]) {
        seriesIds.value.push(...item.seriesIds)
      } else {
        seriesIds.value.push(item.brandId)
      }
    })
  return seriesIds
}

const shopUserList = ref<Recordable[]>([])
// const shopUserList = ref(getMemberTreeList({
//   belongShopid: ruleForm.value.shopIdList,
//   childRuleValue: 'clue_pfcy_rule'
// }).value)

const getMemberTreeListApi = async () => {
  const data = await getMemberTreeDataList({
    belongShopid: ruleForm.value.shopIdList,
    childRuleValue: 'clue_pfcy_rule'
  })
  shopUserList.value = data.trees
}

const brandList = ref<object[]>([])
const getBrandInfo = async () => {
  const data = await getAllBrand()
  brandList.value = data
}

const shopTreeList = ref<object[]>([])

type brandObj = {
  brandId: number | string
  seriesIds: string[]
}
type tableObj = {
  shopId: string
  shopName: string
  distributeUserId: string
  distributeUserName: string
  positionName: string
  nickname: string
  status: number
  pushBackFactoryStatus: number
  brandList: brandObj[]
  brandArr: number[]
}
const memberTableList = ref<tableObj[]>([
  {
    shopId: '',
    shopName: '',
    distributeUserId: '',
    distributeUserName: '',
    positionName: '',
    nickname: '',
    status: 1,
    pushBackFactoryStatus: 0,
    brandArr: [],
    brandList: []
  }
])
const memberCasRef = ref()
const memberList = ref<number[]>([])
const addMemberRule = (val) => {
  if (ruleForm.value.shopIdList.length < 1) {
    return message.error('请先选择所属门店')
  }
  if (val.length > unref(memberTableList).length) {
    const ids = memberTableList.value.map((d) => d.distributeUserId)
    const diffIds = difference(val, ids) // 返回本次新增的
    const curData = memberCasRef.value.getCheckedNodes(true)
    curData.forEach((item) => {
      if (diffIds.includes(item.data.id)) {
        let newItem = {
          shopId: '',
          shopName: '',
          distributeUserId: '',
          distributeUserName: '',
          positionName: '',
          nickname: '',
          status: 1,
          pushBackFactoryStatus: 0,
          brandArr: [],
          brandList: []
        }
        newItem.distributeUserId = item.data.id
        newItem.distributeUserName = item.data.name
        newItem.positionName = item.data.positionName
        newItem.nickname = item.data.name
        newItem.shopId = item.data.belongStoreId
        newItem.shopName = item.data.belongStoreName
        memberTableList.value.push(newItem)
      }
    })
  } else {
    memberTableList.value = memberTableList.value.filter((d) => val.includes(d.distributeUserId))
  }
}
const getDistributeShopIdList = (val) => {
  if (!val) {
    memberTableList.value = []
    memberList.value = []
    getMemberTreeListApi()
  }
}
const deleteRow = (row, index) => {
  memberList.value = memberList.value.filter((item) => item !== row.distributeUserId)
  memberTableList.value.splice(index, 1)
}

const setBrandObj = (val) => {
  const obj = {}
  const brandList = ref<brandObj[]>([])
  val.map((item) => {
    if (obj[item[0]]) {
      obj[item[0]].push(item[1])
    } else {
      obj[item[0]] = [item[1]]
    }
  })
  Object.keys(obj).forEach((item) => {
    brandList.value.push({
      brandId: item,
      seriesIds: obj[item] !== undefined ? obj[item] : []
    })
  })
  return brandList.value
}
const brandCasRef = ref()
const brandAndSeriesChange = (val, row) => {
  row.brandList = setBrandObj(row.brandArr)
}

const onConfirm = async () => {
  if (ruleForm.value.shopIdList.length < 1) {
    return message.error('请先选择所属门店')
  }
  if (memberTableList.value.length < 1) {
    return message.error('请添加派发人员配置')
  }
  let isValidBrandList = ref(true)
  let isValidDistributeUserId = ref(true)
  memberTableList.value.forEach((item) => {
    if (!item.hasOwnProperty('brandList') || item?.brandList.length < 1) {
      isValidBrandList.value = false
    }
    if (!item.distributeUserId) {
      isValidDistributeUserId.value = false
    }
  })
  if (!isValidDistributeUserId.value) {
    return message.error('请选择成员')
  }
  if (!isValidBrandList.value) {
    return message.error('请选择品牌')
  }

  interface IParams {
    shopIdList: object[]
    userList: object[]
  }

  let params: IParams = {
    shopIdList: [],
    userList: []
  }
  params.shopIdList = ruleForm.value.shopIdList
  params.userList = memberTableList.value
  unref(editFlag)
    ? await dispatchApi.editClueDistributeUser(params)
    : await dispatchApi.addClueDistributeUser(params)
  message.success('保存成功')
  emit('refresh')
  visible.value = false
}

defineExpose({ openDialog })
</script>

<style lang="scss" scoped>
.mb-15 {
  margin: 15px 0;
}
</style>
