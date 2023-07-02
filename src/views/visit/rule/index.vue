<template>
  <ContentWrap>
    <Search :schema="schema" @search="search" @reset="getList">
      <template #roleName="{ model }">
        <el-cascader
          v-model="model.roleId"
          :options="ruleConfig.options.postList"
          :props="{ label: 'name', value: 'id', emitPath: false }"
          filterable
          collapse-tags
          collapse-tags-tooltip
          clearable
        />
      </template>
    </Search>
  </ContentWrap>
  <ContentWrap v-loading="ruleConfig.loading">
    <div class="mb-16px">
      <XButton type="primary" icon-font="icon-xinzeng" title="新增" @click="add()" />
      <!--      <XButton title="删除" @click="onDelete" />-->
    </div>
    <el-row :gutter="16">
      <el-col v-for="item in ruleList" :key="item.id" :md="12" :lg="12" :xl="8">
        <RuleItem :rule="item" @load="getList" @edit="edit(item)" />
      </el-col>
    </el-row>
    <Pagination
      v-if="ruleConfig.total"
      :total="ruleConfig.total"
      v-model:page="ruleConfig.params.pageNo"
      v-model:limit="ruleConfig.params.pageSize"
      @pagination="getList"
    />
    <Empty v-if="!ruleList || ruleList.length === 0" class="py-20vh" />
  </ContentWrap>
  <RuleDialog ref="ruleDialogRef" @success="getList" />
</template>

<script lang="ts" setup>
import { visitList, getVisitTypeList } from '@/api/visit'
import RuleItem from './components/RuleItem/index.vue'
import RuleDialog from './components/RuleDialog/index.vue'
import { useCommonList } from '@/hooks/web/useCommonList'

const { getPostList } = useCommonList()

const ruleDialogRef = ref()
const ruleList = ref<any[]>([])
const ruleConfig = reactive({
  loading: false,
  total: 0,
  params: {
    pageNo: 1,
    pageSize: 10,
    roleId: '',
    visitLimitDay: '',
    visitSettingPurpose: '',
    visitSettingType: ''
  },
  options: {
    type: [],
    purpose: [],
    postList: getPostList()
  }
})

const schema = reactive<any>([
  {
    field: 'visitSettingType',
    label: '回访类型',
    component: 'Select',
    componentProps: {
      options: []
    }
  },
  {
    field: 'visitSettingPurpose',
    label: '回访目的',
    component: 'Input'
  },
  {
    field: 'roleName',
    label: '回访岗位',
    componentProps: {
      slots: {
        default: 'roleName'
      }
    }
  }
])

const getList = async () => {
  ruleConfig.loading = true
  const res = await visitList(ruleConfig.params).finally(() => (ruleConfig.loading = false))
  if (res) {
    ruleList.value = res.list || []
    ruleConfig.total = res.total || 0
  }
}

const add = () => {
  ruleDialogRef.value.openDialog()
}
const edit = (record) => {
  ruleDialogRef.value.openDialog(record)
}
const search = (data) => {
  Object.keys(data).forEach((item) => {
    ruleConfig.params[item] = data[item]
  })
  getList()
}

onMounted(async () => {
  await Promise.all([getVisitTypeList()]).then((res) => {
    schema[0]!.componentProps.options = res[0].map((i) => {
      return { label: i.value, value: i.key }
    })
  })
  await getList()
})
</script>

<style lang="scss" scoped></style>
