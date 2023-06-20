<template>
  <XModal :loading="btnLoading" v-model="dialogVisible" title="设置" width="800">
    <el-form :model="form" ref="formRef" :hide-required-asterisk="false">
      <el-form-item label="适用名称">
        <el-input v-model="form.distributeRuleName" maxlength="20" show-word-limit type="text" />
      </el-form-item>
      <el-form-item label="适用门店">
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
          filterable
        />
      </el-form-item>
      <el-divider />
      <div class="sub-title">规则设置</div>
      <div class="tit">派发分配规则</div>
      <el-form-item prop="distributeType">
        <el-radio-group v-model="form.distributeType">
          <el-radio :label="1" style="margin: 6px 4px 0 0"
            >规则分配（按照设定的规则自动分配）</el-radio
          >
          <el-radio :label="2" style="margin: 6px 4px 0 0"
            >手动分配（成员自行选择成员进行线索分配）</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <div class="mb10">
        <div class="tit">派发设置</div>
        <div class="divider-row"></div>
        <el-form-item label="是否允许规则外增加派发成员：">
          <el-switch
            active-color="#13ce66"
            v-model="form.augment"
            :active-value="1"
            :inactive-value="0"
          />
          <div class="Grey mb10 tips-right">(开启后，清洗员可以手动新增派发成员)</div>
        </el-form-item>
        <el-form-item label="单条线索派发给" prop="distributeNum">
          <div class="no-wrap">
            <el-input v-model="form.distributeNum" placeholder="人数" type="number" min="0" />人
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
          <el-table :data="form.clueDistributeTeamDTOs">
            <el-table-column label="团队" prop="teamName" />
            <el-table-column label="关联岗位" width="200">
              <template #default="{ row }">
                <!--                <el-tooltip effect="dark" placement="top">-->
                <!--                  <template #content v-if="row.positionSunNameList.length > 0">-->
                <!--                    {{ row.positionSunNameList.join(',') }}-->
                <!--                  </template>-->
                <!--                  <el-button @click="showPositionDialog(row)">-->
                <!--                    {{-->
                <!--                      row.positionSunNameList.length > 0-->
                <!--                        ? row.positionSunNameList.join(',')-->
                <!--                        : '请选择岗位'-->
                <!--                    }}-->
                <!--                  </el-button>-->
                <el-select
                  v-model="row.positionSunTypeList"
                  multiple
                  filterable
                  clearable
                  collapse-tags
                  style="width: 180px"
                >
                  <el-option
                    v-for="item in postList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <!--                </el-tooltip>-->
              </template>
            </el-table-column>
            <el-table-column label="允许独享人数" prop="permitEnjoyNum">
              <template #default="{ row }">
                <el-input v-model="row.permitEnjoyNum" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ $index }">
                <div @click="deleteShopRule($index)">删除</div>
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
              <el-input v-model="form.receiveNum" placeholder="人数" type="number" min="0" />人
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
import { listSimplePostsApi } from '@/api/system/post/info'
import { RuleObj } from '../helpers'
const message = useMessage()
const dialogVisible = ref(false)
const shopTreeList = ref<object[]>([])
const btnLoading = ref(false)
const emit = defineEmits(['refresh'])
const formRef = ref()
const initForm: RuleObj = {
  distributeRuleName: '',
  shopIdList: [],
  applicableShopId: '',
  distributeType: 1,
  augment: 0,
  distributeNum: 0,
  receivePattern: 1,
  teamEnjoyScope: 1,
  clueDistributeTeamDTOs: [],
  receiveNum: 0
}
const form = ref(cloneDeep(initForm))

const openDialog = (id: number, formshopTreeList: any) => {
  nextTick(() => {
    formRef.value?.resetFields()
    form.value = cloneDeep(initForm)
    shopTreeList.value = formshopTreeList
    if (id) {
      dispatchApi.getClueDistributeRuleDetail(id).then((res) => {
        form.value = res
        form.value.shopIdList = form.value.applicableShopId.split(',')
        console.log(form.value)
      })
    }
    dialogVisible.value = true
  })
}
const hide = () => {
  formRef.value?.resetFields()
  dialogVisible.value = false
}
const postList = ref<object[]>([])
const getPostList = async () => {
  const data = await listSimplePostsApi()
  postList.value = data
}

onMounted(() => {
  getPostList()
})

// 添加团队
const addTeam = () => {
  let count = form.value?.clueDistributeTeamDTOs.length
  form.value?.clueDistributeTeamDTOs.push({
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
    if (form.value.clueDistributeTeamDTOs.length < 1) {
      // 如果团队为空，则默认添加一条
      addTeam()
    }
  }
  receivePatternHasChange.value = true
}

const deleteShopRule = () => {
  console.log('删除')
}

const onConfirm = () => {
  let params = cloneDeep(form.value)
  params.applicableShopId = params.shopIdList.join(',')
  // delete params.shopIdList

  // let params = {
  //   distributeRuleName: 123,
  //   applicableShopId: '150,149',
  //   distributeType: 1,
  //   augment: 0,
  //   distributeNum: 3,
  //   receivePattern: 1,
  //   teamEnjoyScope: 1,
  //   clueDistributeTeamDTOs: [],
  //   receiveNum: 0
  // }
  btnLoading.value = true
  dispatchApi.addClueDistributeRule(params).then((res) => {
    console.log(res)
    message.success('保存成功')
    emit('refresh')
    dialogVisible.value = false
  })
  btnLoading.value = false
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
</style>
