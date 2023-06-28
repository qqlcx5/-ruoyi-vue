<template>
  <XModal
    :loading="btnLoading"
    v-model="dialogVisible"
    :title="editFlag ? '编辑' : '新增'"
    width="800"
    height="80%"
  >
    <el-form :model="form" ref="formRef" :hide-required-asterisk="false">
      <el-form-item label="规则名称" style="margin-left: 0">
        <el-input
          v-model="form.distributeRuleName"
          placeholder="请输入规则名称"
          @change="changeRuleName"
          maxlength="20"
          show-word-limit
          type="text"
        />
      </el-form-item>
      <el-form-item label="适用门店" style="margin-left: 0">
        <el-cascader
          ref="treeShopCascader"
          v-model="form.shopIdList"
          placeholder="请选择"
          :options="shopTreeList"
          :props="{
            label: 'name',
            value: 'id',
            expandTrigger: 'hover',
            emitPath: false,
            multiple: true
          }"
          :show-all-levels="false"
          clearable
          collapse-tags
          collapse-tags-tooltip
          filterable
        />
      </el-form-item>
      <el-divider />
      <div class="sub-title">规则设置</div>
      <div class="tit">派发分配规则</div>
      <el-form-item prop="distributeType">
        <el-radio-group v-model="form.distributeType">
          <el-radio :label="1" style="margin: 6px 4px 0 0"
            >规则分配（按照设定的规则自动分配）
          </el-radio>
          <el-radio :label="2" style="margin: 6px 4px 0 0"
            >手动分配（成员自行选择成员进行线索分配）
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="mb10">
        <div class="tit">派发规则设置</div>
        <div class="divider-row"></div>
        <el-form-item v-show="form.distributeType === 2" label="是否允许规则外增加派发成员：">
          <el-switch
            active-color="#13ce66"
            v-model="form.augment"
            :active-value="1"
            :inactive-value="0"
          />
          <div class="Grey mb10 tips-right">(开启后，清洗员可以手动新增派发成员)</div>
        </el-form-item>
        <el-form-item
          v-show="form.distributeType === 2"
          label="单条线索派发给"
          prop="distributeNum"
        >
          <div class="no-wrap">
            <el-input v-model="form.distributeNum" placeholder="人数" type="number" min="0" />
            人
          </div>
        </el-form-item>
        <el-form-item label="接单模式:" prop="receivePattern">
          <el-radio-group v-model="form.receivePattern" @input="changeReceivePattern">
            <el-radio :label="1">配置模式</el-radio>
            <el-radio :label="2">混合模式</el-radio>
            <el-radio :label="3">团队独享模式</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="独享范围" v-if="form.receivePattern === 3">
          <el-radio-group v-model="form.teamEnjoyScope">
            <el-radio :label="1">不限</el-radio>
            <el-radio :label="2">按区域</el-radio>
            <el-radio :label="3">按门店</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.receivePattern === 3">
          <el-button type="primary" size="small" @click="addTeam">添加团队</el-button>
          <el-table
            :data="form.teams"
            ref="teamTableRef"
            :header-cell-style="{ backgroundColor: '#F6F6F6' }"
          >
            <el-table-column label="团队" prop="teamName" />
            <el-table-column label="关联岗位" width="200">
              <template #default="{ row }">
                <el-cascader
                  filterable
                  v-model="row.positionSunTypeList"
                  :options="postList"
                  :props="{ label: 'name', value: 'id', multiple: true, emitPath: false }"
                />
              </template>
            </el-table-column>
            <el-table-column label="允许独享人数" prop="permitEnjoyNum">
              <template #default="{ row }">
                <el-input v-model="row.permitEnjoyNum" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ $index }">
                <el-button text type="primary" @click="deleteShopRule($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div class="mb10">
          <el-form-item
            v-if="form.receivePattern === 1"
            label="派发后允许接单人数"
            prop="receiveNum"
          >
            <div class="no-wrap">
              <el-input v-model="form.receiveNum" placeholder="人数" type="number" min="0" />
              人
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <template #footer>
      <XButton type="primary" @click="onConfirm">确认</XButton>
      <XButton @click="hide">取消</XButton>
    </template>
  </XModal>
</template>

<script setup lang="ts" name="rule_crud">
import * as dispatchApi from '@/api/clue/dispatchStrategy'
import { cloneDeep } from 'lodash-es'
import { RuleObj } from '../helpers'
import { FormInstance } from 'element-plus'
import { useOption } from '@/store/modules/options'
import { useCommonList } from '@/hooks/web/useCommonList'
import { getPostDataList } from '@/api/common'
const store = useOption()
const { getSuitableShopList } = useCommonList()
onMounted(() => {
  // getSuitableShopListApi()
  // getexistRuleShopApi()
})
const message = useMessage()
const dialogVisible = ref(false)
const shopTreeList = ref<object[]>([])
const btnLoading = ref(false)
const emit = defineEmits(['refresh'])
const formRef = ref<FormInstance>()
const initForm: RuleObj = {
  distributeRuleName: '',
  shopIdList: [],
  applicableShopId: '',
  distributeType: 1,
  augment: 0,
  distributeNum: 0,
  receivePattern: 1,
  teamEnjoyScope: 1,
  teams: [],
  receiveNum: 0
}
const form = ref(cloneDeep(initForm))
const editFlag = ref<boolean>(false)
const editId = ref(0)
const selectedPositionId = ref<number[]>([])
const openDialog = (id: number) => {
  let applicableShopId = []
  nextTick(async () => {
    editId.value = id
    editFlag.value = !!id
    formRef.value?.resetFields()
    form.value = cloneDeep(initForm)
    // shopTreeList.value = formshopTreeList
    selectedPositionId.value = []
    if (id) {
      await dispatchApi.getClueDistributeRuleDetail(id).then((res) => {
        form.value = res
        if (!res.teams) {
          form.value.teams = []
        }
        applicableShopId = res.applicableShopId.split(',')
        form.value.shopIdList = applicableShopId.map((item) => +item)

        if (res.teams.length > 0) {
          res.teams.forEach((team) => {
            selectedPositionId.value.push(...team.positionSunTypeList)
          })
        }
      })
    }
    getPostListApi()
    getexistRuleShopApi(applicableShopId)
    dialogVisible.value = true
  })
}

const hide = () => {
  formRef.value?.resetFields()
  dialogVisible.value = false
}
type positionObj = {
  id: number
  name: string
  disabled: boolean
}
const postList = ref<positionObj[]>([])
const getPostListApi = async () => {
  const data = await getPostDataList()
  postList.value = data.map((pos: positionObj) => {
    pos['disabled'] = selectedPositionId.value.includes(pos.id)
    return pos
  })
}

const shopList = ref(getSuitableShopList())

const existShopList = ref<object[]>([])
const getexistRuleShopApi = async (applicableShopId) => {
  existShopList.value = await dispatchApi.existRuleShop()
  shopTreeList.value = store.dealShopList(shopList.value, existShopList.value, applicableShopId)
}

const changeRuleName = (val) => {
  if (!val) {
    return message.error('请输入规则名称')
  }
  if (!editFlag) return
  const isValid = dispatchApi.checkValidRuleName(editId.value, val)
  if (!isValid) {
    form.value.distributeRuleName = ''
    message.error('名称已经存在，请重新输入')
  }
}

// 添加团队
const addTeam = () => {
  let count = form.value?.teams?.length || 0
  form.value?.teams.push({
    id: Number(count) + 1,
    teamName: `团队${Number(count) + 1}`,
    permitEnjoyNum: 1,
    positionSunTypeList: []
    // positionSunNameList: [],
    // selectedRoleObj: []
  })
}
const receivePatternHasChange = ref(false)
const changeReceivePattern = (id) => {
  if (id === 3) {
    if (form.value.teams.length < 1) {
      // 如果团队为空，则默认添加一条
      addTeam()
    }
  }
  receivePatternHasChange.value = true
}

const deleteShopRule = (index) => {
  form.value.teams.splice(index, 1)
}

const onConfirm = async () => {
  if (!form.value.distributeRuleName) {
    return message.error('请填写规则名称')
  }
  if (form.value.shopIdList.length < 1) {
    return message.error('请选择适用门店')
  }
  let params = cloneDeep(form.value)
  params.applicableShopId = params.shopIdList.join(',')

  unref(editFlag)
    ? await dispatchApi.editClueDistributeRule(params)
    : await dispatchApi.addClueDistributeRule(params)
  message.success('保存成功')
  emit('refresh')
  dialogVisible.value = false
}
defineExpose({ openDialog })
</script>

<style lang="scss" scoped>
.divider-row {
  width: 100%;
  height: 1px;
  margin: 6px 0 10px;
  background-color: #ccc;
}

.sub-title {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
}

.tit {
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
}

.el-form-item {
  margin-left: 60px;
}

.tips-right {
  padding-right: 10px;
  margin-left: 15px;
  color: #999;
}

:deep(.el-input) {
  max-width: 400px;
}

.no-wrap {
  display: flex;
  flex-wrap: nowrap;
}

.el-table {
  width: 99.9% !important;
}
</style>
