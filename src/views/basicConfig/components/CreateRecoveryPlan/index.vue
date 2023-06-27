<template>
  <div class="create-recovery-plan">
    <el-dialog
      class="wg-custom-dialog"
      :model-value="props.modelValue"
      title="新增回收计划"
      width="max-content"
      :before-close="handleClose"
    >
      <el-form
        class="left-content"
        ref="formRef"
        :rules="rules"
        :model="ruleForm"
        label-width="110px"
        v-loading="loading"
      >
        <el-form-item label="线索所属成员" prop="userId">
          <el-select v-model="ruleForm.userId" filterable>
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手动回收原因" prop="recycleReason">
          <el-select v-model="ruleForm.recycleReason" filterable>
            <el-option
              v-for="item in reason"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="线索所属门店" prop="shopId">
          <el-cascader
            v-model="ruleForm.shopId"
            :options="shopTreeList"
            :props="{ label: 'name', value: 'id', emitPath: false }"
            filterable
            clearable
            style="min-width: 180px"
          />
        </el-form-item>
        <el-form-item label="线索品牌" prop="brandIdList">
          <el-select
            v-model="ruleForm.brandIdList"
            filterable
            multiple
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="线索派发时间" prop="distributeTimeType">
          <el-radio-group v-model="ruleForm.distributeTimeType" @change="timeTypeChange">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="2">部分</el-radio>
            <el-form-item
              v-if="ruleForm.distributeTimeType === 2"
              prop="distributeStartTime"
              style="width: 100%"
            >
              <el-date-picker
                v-model="timeRange"
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" :rows="4" style="width: 240px" />
        </el-form-item>
      </el-form>
      <div class="right-content" v-if="show">
        <div class="content-title"
          >共查询到<span class="hl-num">{{ total }}</span
          >条线索</div
        >
        <div class="status-wrap">
          <span>待接单<span class="hl-num">0</span></span>
          <span>待跟进<span class="hl-num">0</span></span>
          <span>跟进中<span class="hl-num">0</span></span>
          <span>已到店<span class="hl-num">0</span></span>
        </div>
        <div class="result-list">
          <div class="result-item" v-for="item in 29">
            <div class="info-1">张先生 157****6671</div>
            <div class="info-2">哈弗第三代J6-2020-1-5,自动-两驱-国6</div>
          </div>
        </div>
        <Pagination
          small
          :total="total || 0"
          v-model:page="page.pageNo"
          v-model:limit="page.pageSize"
          @pagination="onPageChange"
          style="justify-content: right"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :disabled="loading" :loading="btnLoading" @click="handleConfirm"
            >确定</el-button
          >
          <el-button v-if="false" :loading="loading" :disabled="btnLoading" @click="handleSearch"
            >查询</el-button
          >
          <el-button @click="handleClose">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { getListSimpleUsersApi } from '@/api/system/user'
import { DICT_TYPE, getTenantDictOptions } from '@/utils/dict'
import { saveRecycleSchedule } from '@/api/clue/basicConfig'
import { getAllBrand } from '@/api/model/brand'
import { useCommonList } from '@/hooks/web/useCommonList'
const { getSuitableShopList } = useCommonList()
const message = useMessage()

interface IProps {
  modelValue: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false
})
interface IEmit {
  (event: 'update:modelValue', modelValue: boolean): void
  (event: 'success'): void
}
const emit = defineEmits<IEmit>()

watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      Promise.all([getUsers(), getBrandInfo(), getDicts()])
    } else {
      timeRange.value = []
      formRef.value?.resetFields()
    }
  }
)

const reason = ref<object[]>([])
const getDicts = async () => {
  reason.value = await getTenantDictOptions(DICT_TYPE.MANUAL_RECYCLING_REASON)
}
const userList = ref<object[]>([])
const getUsers = async () => {
  const data = await getListSimpleUsersApi()
  userList.value = data
}
const brandList = ref<object[]>([])
const getBrandInfo = async () => {
  const data = await getAllBrand()
  brandList.value = data
}

const shopTreeList = ref(getSuitableShopList())

const timeRange = ref<string[]>([])
watch(
  () => timeRange.value,
  (val) => {
    val = val || []
    ruleForm.distributeStartTime = val[0] || ''
    ruleForm.distributeEndTime = val[1] || ''
    formRef.value?.validateField('distributeStartTime')
  }
)
const timeTypeChange = async (val) => {
  if (val === 1) {
    timeRange.value = []
  }
}
const formRef = ref<FormInstance>()
let ruleForm = reactive({
  userId: '', // 成员id
  recycleReason: '', // 回收原因
  shopId: '', // 所属门店
  brandIdList: [], // 线索品牌ids
  distributeTimeType: 1, // 派发时间类型  1全部 2部分
  distributeStartTime: '',
  distributeEndTime: '',
  remark: '' // 备注
})
const rules: FormRules = reactive({
  userId: [{ required: true, message: '请选择线索所属成员', trigger: 'change' }],
  recycleReason: [{ required: true, message: '请选择手动回收原因', trigger: 'change' }],
  shopId: [{ required: true, message: '请选择所属门店', trigger: 'change' }],
  distributeStartTime: [{ required: true, message: '请选择线索派发时间', trigger: 'change' }],
  brandIdList: [{ required: true, message: '请选择线索品牌', trigger: 'change' }]
})
const handleClose = () => {
  show.value = false
  emit('update:modelValue', false)
}

const loading = ref<boolean>(false)
const show = ref<boolean>(false)
const handleSearch = () => {
  show.value = true
  // loading.value = true
}
const total = ref<number>(100000)
const page = reactive({ pageNo: 1, pageSize: 10 })
const onPageChange = ({ pageNo, pageSize }) => {}
const btnLoading = ref<boolean>(false)
const handleConfirm = () => {
  formRef.value?.validate(async (vali) => {
    if (vali) {
      try {
        btnLoading.value = true
        await saveRecycleSchedule(ruleForm)
        message.success('提交成功')
        emit('success')
        handleClose()
      } finally {
        btnLoading.value = false
      }
    }
  })
}
</script>

<style lang="scss">
.create-recovery-plan {
  @import '@/styles/custom.scss';
  .el-dialog__body {
    display: flex;
    min-width: 550px;
    height: 450px;
    .hl-num {
      color: $wg-primary-color;
    }
    .right-content {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      width: 380px;
      margin: -25px 0 -25px 20px;
      padding: 12px 0 0 20px;
      &::before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        border-left: 1px solid $border-color;
      }
      .content-title {
        line-height: 20px;
        font-size: 14px;
        font-weight: bold;
        color: $title-color;
      }
      .status-wrap {
        display: flex;
        justify-content: space-between;
        padding: 12px 40px 4px 0;
        border-bottom: 1px solid $border-color;
      }
      .result-list {
        flex: 1;
        height: 1px;
        padding-right: 15px;
        margin-right: -15px;
        margin-top: 10px;
        overflow: auto;
        .result-item {
          border: 1px solid $border-color;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 10px;
          .info-1 {
            line-height: 20px;
            font-size: 14px;
            font-weight: bold;
            color: $title-color;
            margin-bottom: 3px;
          }
          .info-2 {
            line-height: 17px;
            font-size: 12px;
            color: $title-color;
          }
        }
      }
    }
  }
  .left-content {
    .el-select,
    .el-cascader {
      width: 240px;
    }
    .el-date-editor {
      width: 220px;
    }
  }
}
</style>
