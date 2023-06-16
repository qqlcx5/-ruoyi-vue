<template>
  <XModal :title="id ? '修改' : '编辑'" v-model="visible" width="50%">
    <div class="window-body">
      <div style="margin-bottom: 16px">线索归属配置</div>
      <div class="rule-wrapper">
        <el-form size="mini" :model="form" ref="form">
          <template>
            <el-form-item label="线索渠道" prop="clueChannelId" required>
              <el-cascader
                ref="treeChannelCascader"
                v-model="form.clueChannelId"
                placeholder="请选择线索渠道"
                :options="channelData"
                :props="{
                  label: 'clueChannelName',
                  value: 'clueChannelId',
                  expandTrigger: 'hover',
                  emitPath: false
                }"
                :show-all-levels="false"
                clearable
              />
            </el-form-item>
            <el-form-item label="线索清洗员" prop="filterUserId">
              <template v-if="form.clueChannelId">
                <el-cascader
                  ref="treeChannelCascader"
                  v-model="form.filterUserId"
                  placeholder="请选择清洗员"
                  :options="filterUserData"
                  :props="{
                    label: 'filterUserName',
                    value: 'filterUserId',
                    expandTrigger: 'hover',
                    emitPath: false
                  }"
                  :show-all-levels="false"
                  clearable
                />
              </template>
            </el-form-item>
            <el-form-item label="派发门店配置" prop="distributeShopIdList">
              <el-cascader
                ref="treeShopCascader"
                v-model="form.distributeShopIdList"
                placeholder="请选择门店"
                :options="shopData"
                collapse-tags
                @change="getDistributeShopIdList"
                :props="{
                  label: 'departName',
                  value: 'departId',
                  expandTrigger: 'hover',
                  multiple: true,
                  emitPath: false
                }"
                filterable
                :show-all-levels="false"
                clearable
              />
            </el-form-item>
          </template>
        </el-form>
      </div>
      <el-divider />
      <staff-config
        v-if="form.clueChannelId && form.distributeShopIdList.length > 0"
        :db-list="staffConfigList"
        ref="staffConfigRef"
      />
    </div>

    <!--    <div class="window-footer">-->
    <!--      <el-button size="mini" @click="hide">取消</el-button>-->
    <!--      <el-button type="primary" :loading="loading" size="mini" @click="confirm">确认</el-button>-->
    <!--    </div>-->

    <!-- 操作按钮 -->
    <template #footer>
      <!-- 按钮：保存 -->
      <XButton type="primary" :title="t('action.save')" :loading="loading" @click="confirm" />
      <!-- 按钮：关闭 -->
      <XButton :loading="loading" :title="t('common.cancel')" @click="hide" />
    </template>
  </XModal>
</template>

<script setup lang="ts" name="Crud">
import * as dispatchApi from '@/api/clue/dispatchStrategy/index'
import StaffConfig from '@/views/dispatchStrategyConfig/components/staffConfig.vue'
import { treeShopData } from '@/api/common'
const { t } = useI18n()
const message = useMessage()
const visible = ref(false)
const loading = ref(false)
const form = ref({
  companyId: '',
  shopId: '',
  clueChannelId: '',
  clueChannelName: '',
  filterUserName: '',
  filterUserId: '',
  distributeShopIdList: []
})
const staffConfigList = ref([])

onMounted(() => {
  getShopData()
})

// 弹窗
const id = ref('')
const openDialog = (id) => {
  if (id) {
    id.value = id
    dispatchApi.clueDistributeDetailV2(id).then((res) => {
      if (res) {
        form.value = res.data
        staffConfigList.value = res.data.userList
      } else {
        message.error(res.message)
      }
    })
  }
  visible.value = true
}
const hide = () => {
  visible.value = false
}
const emit = defineEmits(['refresh'])
const confirm = () => {
  loading.value = true
  if (!form.value.clueChannelId) {
    return message.error('请选择线索渠道')
  }
  if (id.value) {
    const params = {
      clueChannelId: form.value.clueChannelId,
      distributeShopIdList: form.value.distributeShopIdList,
      filterUserId: form.value.filterUserId,
      id: id.value
    }
    dispatchApi.clueDistributeUpdateV2(params).then((res) => {
      if (res) {
        emit('refresh')
        message.success('修改成功')
        loading.value = false
        hide()
      } else {
        message.error(res.message)
      }
    })
  } else {
    // 创建
    let addform = {
      clueAffiliationList: [
        {
          clueChannelId: form.value.clueChannelId,
          filterUserId: form.value.filterUserId
        }
      ],
      id: id.value,
      clueDistributeSaveV2: form.value.distributeShopIdList
    }
    dispatchApi.clueDistributeSaveV2(addform).then((res) => {
      if (res.status === 200) {
        message.success('创建成功')
        emit('refresh')
        loading.value = false
        hide()
      } else {
        message.error(res.message)
        loading.value = false
      }
    })
  }
}

// 线索渠道下拉框数据
type channelObj = {
  clueChannelName: string
  clueChannelId: string
  children: channelObj[]
}
const channelData = ref<channelObj[]>([])
// 线索清洗员下拉框数据
type filterUserObj = {
  filterUserName: string
  filterUserId: string
  children: filterUserObj[]
}
const filterUserData = ref<filterUserObj[]>([])

// 门店下拉框数据
type ShopDataObj = {
  departName: string
  departId: string
  children: ShopDataObj[]
}
const shopData = ref<ShopDataObj[]>([])
const formatTreeData = (data) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].children && data[i].children.length < 1) {
      data[i].children = undefined
    } else if (data[i].children) {
      formatTreeData(data[i].children)
    }
  }
  return data
}
const getShopData = () => {
  treeShopData().then((res) => {
    if (res) {
      shopData.value = formatTreeData(res.data)
    } else {
      message.error(res.message)
    }
  })
}

// 获取不同门店下的派发成员
const getDistributeShopIdList = () => {
  staffConfigList.value = []
  let params = {
    clueDistributeId: id.value,
    shopIdList: form.value.distributeShopIdList
  }
  dispatchApi.getDistributeShopUserList(params).then((res) => {
    if (res) {
      staffConfigList.value = res.userList
    } else {
      message.error(res.message)
    }
  })
}

defineExpose({ openDialog })
</script>

<style lang="scss" scoped></style>
