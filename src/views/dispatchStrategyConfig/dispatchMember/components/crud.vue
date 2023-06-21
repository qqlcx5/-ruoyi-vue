<template>
  <XModal
    :loading="btnLoading"
    :title="editFlag ? '修改' : '新增'"
    v-model="visible"
    width="60%"
    height="70%"
  >
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
    <div
      >派发人员配置
      <XButton type="primary" @click="addMemberRule">添加行</XButton>
      (请先选择门店)
    </div>
    <el-table :data="memberTableList">
      <el-table-column label="门店">
        <template #default="{ row }">
          <span>{{ row.shopName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员">
        <template #default="{ row }">
          <el-select
            v-model="row.distributeUserId"
            @change="changeUserById($event, row)"
            filterable
            collapse-tags
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
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
            <el-select v-model="row.seriesIds" multiple filterable collapse-tags>
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              />
            </el-select>
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
        <template #default="{ $index }">
          <el-button @click="deleteRow($index)">删除</el-button>
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
import type { FormRules } from 'element-plus'
import { getListSimpleUsersApi } from '@/api/system/user'
import { ref } from 'vue'
import { getAllBrand, querySeriesDetailsBelowBrand } from '@/api/model/brand'
import { cloneDeep } from 'lodash-es'
const message = useMessage()
const tableRef = ref()
const visible = ref(false)
const btnLoading = ref(false)
const emit = defineEmits(['refresh'])

const form = ref({
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
    form.value = { shopIdList: [] }
    editFlag.value = !!id
    if (id) {
      dispatchApi.getClueDistributeUserDetail(id).then((res) => {
        console.log(res)
        form.value.shopIdList = res.shopId
        memberTableList.value = res.userList
      })
    }
    console.log(cloneDeep(form), 'form111')
    visible.value = true
    console.log(form.value, 'form')
  })
}
watch(
  () => form.value,
  (val) => console.log(val, '11111'),
  { deep: true }
)
const userList = ref<object[]>([])
// const getUsers = async () => {
//   const data = await getUserPageApi({
//     deptId: Number(form.value.shopIdList.join(',')),
//     pageNo: 1,
//     pageSize: 999
//   })
//   console.log(data)
//   userList.value = data.list
// }
const getUsers = async () => {
  const data = await getListSimpleUsersApi({ storeIds: form.value.shopIdList.join(',') })
  console.log(data)
  userList.value = data
}

const brandList = ref<object[]>([])
const getBrandInfo = async () => {
  const data = await getAllBrand()
  brandList.value = data
}
onMounted(() => {
  getUsers()
  getBrandInfo()
})
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
      {
        brandId: 0,
        seriesIds: []
      }
    ]
  }
])
const addMemberRule = () => {
  console.log(form.value.shopIdList)
  if (!form.value.shopIdList || form.value.shopIdList.length < 1) {
    return message.error('请先选择所属门店')
  }
  let addItem: tableObj = {
    shopId: '',
    shopName: '',
    distributeUserId: '',
    nickname: '',
    status: 0,
    pushBackFactoryStatus: 0,
    brandList: [
      {
        brandId: 0,
        seriesIds: []
      }
    ]
  }
  memberTableList.value.push(addItem)
}
const getDistributeShopIdList = () => {
  memberTableList.value = []
  getUsers()
  console.log(userList.value)
}
const deleteRow = (index) => {
  console.log(index, 'index')
  memberTableList.value.splice(index, 1)
}

const changeUserById = (val, row) => {
  console.log(val, 'jfds')
  row.shopId = '0'
  row.shopName = '3333'
}
const changeBrandId = (val, row) => {
  if (!val) {
    console.log(val, row, 'brand')
    row.brandIds.length && getSeries(row.brandIds)
  }
}
const getSeries = (val) => {
  querySeriesDetailsBelowBrand({ brandIds: val })
}
// const changeStatus = () => {}
// const changePushBackFactoryStatus = () => {}
const onConfirm = () => {
  if (form.value.shopIdList.length < 1) {
    return message.error('请先选择所属门店')
  }
  interface IParams {
    shopIdList: object[]
    userList: object[]
  }
  let params: IParams = {
    shopIdList: [],
    userList: []
  }
  params.shopIdList = form.value.shopIdList
  params.userList = memberTableList.value
  btnLoading.value = true
  unref(editFlag)
    ? dispatchApi.editClueDistributeUser(params)
    : dispatchApi.addClueDistributeUser(params)
  message.success('保存成功')
  emit('refresh')
  visible.value = false
  btnLoading.value = false
  console.log(tableRef.value.tableObject.tableList)
  // dispatchApi.addClueDistributeUser()
}

defineExpose({ openDialog })
</script>

<style lang="scss" scoped></style>
