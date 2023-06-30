<template>
  <Dialog
    class="wg-dialog"
    v-model="dialogVisible"
    :title="'回访话术'"
    width="1000px"
    :confirm-loading="dialogLoading"
    @confirm="confirm"
    @cancel="cancel"
  >
    <div class="title !pt-0">填写话术内容</div>
    <Editor v-model="verbalTrick.visitContent" :height="300" />
    <div class="title">
      回访话术关联的回访计划规则
      <XButton type="primary" title="添加" @click="onAddRule()" />
    </div>
    <el-table :data="verbalTrick.tableData" border row-key="visitSettingId">
      <el-table-column prop="visitSettingTypeStr" label="回访类型" width="90" />
      <el-table-column prop="visitSettingPurposeStr" label="回访目的" />
      <el-table-column prop="roleName" label="回访岗位" />
      <el-table-column prop="distributeRoleList" label="分配岗位">
        <template #default="{ row }">
          <el-tooltip>
            <template #content>
              <div class="max-w-400px">
                {{ row.distributeRoleList.map((i) => i.value).join('、') }}
              </div>
            </template>
            <div class="w-140px overflow-ellipsis whitespace-nowrap">
              {{ row.distributeRoleList.map((i) => i.value).join('、') }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="visitObject" label="回访对象" width="100">
        <template #default="{ row }">{{
          getDictLabel('visit_object', row.visitObject) || ''
        }}</template>
      </el-table-column>
      <el-table-column prop="originTimeTypeStr" label="参考时间(T)" width="100" />
      <el-table-column prop="visitLimitDay" label="计划回访时间T+N(天数)" width="180" />
      <el-table-column fixed="right" label="操作" width="60">
        <template #default="{ row }">
          <el-link type="primary" @click="onDeleteRule(row.id)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </Dialog>
  <VisitRuleDialog ref="visitRuleDialogRef" @confirm="onVisitRuleConfirm" />
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import { getDictLabel } from '@/utils/dict'
import { visitContentUpdate, visitContentAdd } from '@/api/visit'
import VisitRuleDialog from '../VisitRuleDialog/index.vue'

const emit = defineEmits(['success'])
const message = useMessage()

const dialogVisible = ref<boolean>(false)
const dialogLoading = ref<boolean>(false)
const visitRuleDialogRef = ref()
const verbalTrick = reactive<any>({
  visitSettingContentId: '',
  visitContent: '',
  tableData: []
})

const onVisitRuleConfirm = (data) => {
  verbalTrick.tableData = data
}

const onAddRule = () => {
  visitRuleDialogRef.value.openDialog()
}

const onDeleteRule = (id) => {
  message.wgOperateConfirm('确认删除关联回访规则？', '提示').then(async (res) => {
    if (res === 'confirm') {
      verbalTrick.tableData = verbalTrick.tableData.filter((item) => {
        if (item.id) {
          return item.id !== id
        } else if (item.visitSettingId) {
          return item.visitSettingId !== id
        }
      })
    }
  })
}

const setDefaultValue = ({ visitContent, id, visitSettingContentRelate }) => {
  verbalTrick.visitContent = visitContent
  verbalTrick.visitSettingContentId = id
  verbalTrick.tableData = cloneDeep(visitSettingContentRelate)
}

const openDialog = (data?) => {
  if (data) setDefaultValue(data)
  dialogVisible.value = true
}

const confirm = async () => {
  if (!verbalTrick.visitContent) {
    return message.warning('请完善内容信息')
  }
  if (verbalTrick.tableData.length === 0) {
    return message.warning('请选择关联的回访计划规则')
  }
  dialogLoading.value = true
  let params = {
    visitContent: verbalTrick.visitContent,
    visitsettingIds: verbalTrick.tableData.map((item) => item.visitSettingId)
  }
  let res
  const visitSettingContentId = verbalTrick.visitSettingContentId
  if (verbalTrick.visitSettingContentId) {
    params['visitSettingContentId'] = visitSettingContentId
    res = await visitContentUpdate([params])
  } else {
    res = await visitContentAdd([params])
  }
  dialogLoading.value = false
  if (res) {
    message.success(visitSettingContentId ? '编辑成功' : '新增成功')
    emit('success')
    dialogVisible.value = false
  } else {
    message.error('操作失败')
  }
}
const cancel = () => {
  verbalTrick.visitSettingContentId = ''
  verbalTrick.visitContent = ''
  verbalTrick.tableData = []
  dialogVisible.value = false
}

defineExpose({ openDialog }) // 提供 openModal 方法，用
</script>

<style lang="scss" scoped>
.title {
  padding: 16px 0;
  font-size: 14px;
  font-weight: bold;
  color: $title-color;
}
</style>
