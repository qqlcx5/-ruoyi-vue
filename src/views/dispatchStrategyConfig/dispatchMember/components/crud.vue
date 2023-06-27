<template>
  <XModal
    :loading="btnLoading"
    :title="editFlag ? '修改' : '新增'"
    v-model="visible"
    width="60%"
    height="70%"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef">
      <el-form-item label="所属门店" prop="shopId">
        <el-cascader
          ref="treeShopCascader"
          v-model="ruleForm.shopIdList"
          placeholder="请选择门店"
          :options="shopTreeList"
          collapse-tags
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
      <el-cascader
        v-model="memberList"
        ref="memberCasRef"
        filterables
        :options="shopUserList"
        :props="{ label: 'name', value: 'id', children: 'users', emitPath: false, multiple: true }"
        @change="addMemberRule"
      />
    </div>
    <el-table :data="memberTableList">
      <el-table-column label="门店">
        <template #default="{ row }">
          <span>{{ row.shopName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员">
        <template #default="{ row }">
          <el-cascader
            ref="cascaderRef"
            filterable
            v-model="row.distributeUserId"
            :options="shopUserList"
            :props="{ label: 'name', value: 'id', children: 'users' }"
            @change="changeUserById($event, row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="成员平台昵称">
        <template #default="{ row }">
          <el-input v-model="row.nickname" placeholder="昵称" />
        </template>
      </el-table-column>
      <el-table-column label="销售品牌">
        <template #default="{ row }">
          <el-select
            v-model="row.brandIds"
            @visible-change="changeBrandId($event, row)"
            multiple
            filterable
            collapse-tags
          >
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="销售车系" show-overflow-tooltip>
        <template #default="{ row }">
          <template v-if="row.brandIds">
            <el-cascader
              v-model="row.seriesIds"
              :options="seriesOption"
              collapse-tags
              filterable
              :props="{ multiple: true, label: 'seriesDetailsName', value: 'seriesDetailsId' }"
              @change="changeSeriesEvent($event, row)"
            />
          </template>
          <span v-else>请先选择品牌</span>
        </template>
      </el-table-column>
      <el-table-column label="派单状态">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          />
        </template>
      </el-table-column>
      <el-table-column label="跟进是否回推厂家">
        <template #default="{ row }">
          <el-switch
            v-model="row.pushBackFactoryStatus"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row, $index }">
          <el-button @click="deleteRow(row, $index)">删除</el-button>
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
import { getListSimpleUsersApi } from '@/api/system/user'
import { ref } from 'vue'
import { getAllBrand, querySeriesDetailsBelowBrand } from '@/api/model/brand'
// import { useCommonList } from '@/hooks/web/useCommonList'
import { getMemberTreeDataList } from '@/api/common'
import { difference } from 'lodash-es'
// const { getMemberTreeList } = useCommonList()
onMounted(() => {
  getBrandInfo()
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
const rules: FormRules = reactive({
  shopIdList: [{ required: true, message: '请选择门店', trigger: 'change' }]
})
const hide = () => {
  visible.value = false
}
const editFlag = ref<boolean>(false)
const openDialog = (id: string, formShopTreeList: any) => {
  nextTick(() => {
    memberTableList.value = []
    shopTreeList.value = formShopTreeList
    editFlag.value = !!id
    if (id) {
      getUsers()
      dispatchApi.getClueDistributeUserDetail(id).then((res) => {
        const shopIdArr = ref<number[]>([res.shopId])
        ruleForm.value.shopIdList = shopIdArr.value
        memberTableList.value = res.userList.map((item) => {
          item.brandIds = parseBrandIds(item.autoBrandIds)
          item.shopName = item.distributeShopName
          getSeries(item.brandIds)
          item.seriesIds = parseSeries(item.autoBrandIds)
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

const parseBrandIds = (str) => {
  return str && JSON.parse(str).map((item) => item.brandId)
}
const seriesData = ref<any[]>([])
const parseSeries = (str) => {
  seriesData.value = []
  str &&
    JSON.parse(str).map((item) => {
      seriesData.value.push([item.brandId, ...item.seriesIds])
    })
  return seriesData.value
}
const userList = ref<object[]>([])

const getUsers = async () => {
  let str = ruleForm.value.shopIdList.join(',')
  const data = await getListSimpleUsersApi({ storeIds: str })
  userList.value = data
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
  brandId: number
  seriesIds: string[]
}
type tableObj = {
  shopId: string
  shopName: string
  distributeUserId: string
  nickname: string
  status: number
  pushBackFactoryStatus: number
  brandList: brandObj[]
}
const memberTableList = ref<tableObj[]>([
  {
    shopId: '',
    shopName: '',
    distributeUserId: '',
    nickname: '',
    status: 0,
    pushBackFactoryStatus: 0,
    brandList: [
      // {
      //   brandId: 0,
      //   seriesIds: []
      // }
    ]
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
      }
      let newItem = {
        shopId: '',
        shopName: '',
        distributeUserId: '',
        nickname: '',
        status: 0,
        pushBackFactoryStatus: 0,
        brandList: []
      }
      newItem.distributeUserId = item.data.id
      newItem.shopId = item.data.belongStoreId
      newItem.shopName = item.data.belongStoreName
      memberTableList.value.push(newItem)
    })

    // const arr = diffIds.map((id) => {
    //   return {
    //     shopId: '',
    //     shopName: '',
    //     distributeUserId: id,
    //     nickname: '',
    //     status: 0,
    //     pushBackFactoryStatus: 0,
    //     brandList: []
    //   }
    // })
    // memberTableList.value.push(...arr)
  } else {
    memberTableList.value = memberTableList.value.filter((d) => val.includes(d.distributeUserId))
  }
}
const getDistributeShopIdList = (val) => {
  if (!val) {
    memberTableList.value = []
    getMemberTreeListApi()
  }
}
const deleteRow = (row, index) => {
  memberList.value = memberList.value.filter((item) => item !== row.distributeUserId)
  memberTableList.value.splice(index, 1)
}
const cascaderRef = ref()
const changeUserById = (val, row) => {
  let cascaderList = cascaderRef.value.getCheckedNodes()
  let cascaderData = cascaderList[0].data
  row.shopId = cascaderData.belongStoreId
  row.shopName = cascaderData.belongStoreName
}
const changeBrandId = (val, row) => {
  if (!val) {
    seriesOption.value = []
    row.brandList = []
    row.brandIds.length && getSeries(row.brandIds)
    row.brandIds.forEach((b) => {
      row.brandList.push({ brandId: b })
    })
  }
}

const changeSeriesEvent = (val, row) => {
  row.brandList = []
  const obj = {}
  row?.seriesIds?.map((item) => {
    if (obj[item[0]]) {
      obj[item[0]].push(item[1])
    } else {
      obj[item[0]] = [item[1]]
    }
  })
  let selectedBrandIds = row.brandIds
  selectedBrandIds.forEach((item) => {
    row.brandList.push({
      brandId: item,
      seriesIds: obj[item] || []
    })
  })
}
type seriesParams = {
  seriesDetailsName: string
  seriesDetailsId: number
  children: object[]
}
let seriesOption = ref<seriesParams[]>([])

const getSeries = async (val) => {
  const seriesData = await querySeriesDetailsBelowBrand({ brandIds: val })
  seriesData.forEach((item) => {
    let optionsObj: seriesParams = {
      seriesDetailsName: item.brand.brandName,
      seriesDetailsId: item.brand.brandId,
      children: item.seriesList
    }
    seriesOption.value.push(optionsObj)
  })
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
    if (item.brandIds.length < 1) {
      isValidBrandList.value = false
    }
    if (!item.distributeUserId) {
      isValidDistributeUserId.value = false
    } else {
      item.distributeUserId = item.distributeUserId[0]
      return item
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

<style lang="scss" scoped></style>
