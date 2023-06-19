<template>
  <XModal v-model="dialogVisible" title="规则设置" width="800" height="50%">
    <el-form
      :model="form"
      ref="formRef"
      size="small"
      inline
      :rules="rules"
      :hide-required-asterisk="false"
    >
      <el-form-item label="适用名称">
        <el-input v-model="form.distributeRuleName" />
      </el-form-item>
      <el-form-item label="适用门店">
        <el-cascader
          ref="treeShopCascader"
          v-model="form.applicableShopId"
          placeholder="请选择"
          :options="shopTreeList"
          :props="{
            label: 'name',
            value: 'id',
            expandTrigger: 'hover',
            emitPath: false
          }"
          :show-all-levels="false"
          clearable
        />
      </el-form-item>
      <el-divider />
      <div class="tit">派发分配规则</div>
      <el-form-item prop="distributeType" style="margin-left: 2px">
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
          <el-switch active-color="#13ce66" v-model="form.augment" />
        </el-form-item>
        <div class="Grey mb10 tips-right">(开启后，清洗员可以手动新增派发成员)</div>
        <el-form-item label="单条线索派发给" prop="distributeNum">
          <el-input
            v-model="form.distributeNum"
            class="c-input"
            placeholder="人数"
            type="number"
            min="0"
          />
          人
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
                <el-tooltip effect="dark" placement="top">
                  <template #content v-if="row.positionSunNameList.length > 0">
                    row.positionSunNameList.join(',')
                  </template>
                  <el-button @click="showPositionDialog(row)">
                    {{
                      row.positionSunNameList.length > 0
                        ? row.positionSunNameList.join(',')
                        : '请选择岗位'
                    }}
                  </el-button>
                </el-tooltip>
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
            <el-input
              v-model="form.receiveNum"
              class="c-input"
              placeholder="人数"
              type="number"
              min="0"
            />
            人
          </el-form-item>
        </div>
      </div>
    </el-form>
  </XModal>
</template>

<script setup lang="ts" name="rule_crud">
const dialogVisible = ref(false)
const shopTreeList = ref<object[]>([])

const openDialog = (shopTreeList: any) => {
  shopTreeList.value = shopTreeList
  dialogVisible.value = true
}
const rules = ref({
  distributeNum: { validator: true, message: '值不能小于0' }
})

type TeamObj = {
  id: number
  teamName: string
  permitEnjoyNum: number
  positionSunTypeList: string[]
  positionSunNameList: string[]
  selectedRoleObj: string[]
}
type RuleObj = {
  distributeRuleName: string
  applicableShopId: string
  distributeType: number
  augment: number
  distributeNum: number
  receivePattern: number
  teamEnjoyScope: number
  clueDistributeTeamDTOs: TeamObj[]
  receiveNum: number
}
const form = ref<RuleObj>()
// 添加团队
const addTeam = () => {
  let count = form.value?.clueDistributeTeamDTOs.length
  form.value?.clueDistributeTeamDTOs.push({
    id: Number(count) + 1,
    teamName: `团队${Number(count) + 1}`,
    permitEnjoyNum: 1,
    positionSunTypeList: [],
    positionSunNameList: [],
    selectedRoleObj: []
  })
}
const receivePatternHasChange = ref(false)
const changeReceivePattern = (id) => {
  if (id === 3) {
    // if (form.value.clueDistributeTeamDTOs.length < 1) {
    //   // 如果团队为空，则默认添加一条
    //   addTeam()
    // }
  }
  receivePatternHasChange.value = true
}

const showPositionDialog = () => {
  console.log('选择岗位')
}
const deleteShopRule = () => {
  console.log('删除')
}
defineExpose({ openDialog })
</script>

<style lang="scss" scoped></style>
