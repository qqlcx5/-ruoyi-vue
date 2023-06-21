<script setup lang="ts">
import { getOperateLogDetailApi } from '@/api/system/operatelog'
import { formatDate } from '@/utils/formatTime'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'

interface logChangeVO {
  field: string | null
  beforeValue: string
  afterValue: string
}

const drawerVisible = ref<boolean>(false)
const drawerLoading = ref<boolean>(false)
const detailInfo = ref<any>()
const baseDescription = ref<any[]>()
const logInfo = ref<any[]>([])
const onlyAfterChange = computed(() => {
  return logInfo.value!.every((item) => !item.beforeValue)
})
const baseInfo = reactive([
  { name: '操作人员', value: 'username' },
  { name: '部门/岗位', slot: 'depart' },
  { name: '操作模块', value: 'module' },
  { name: '操作端口', value: 'entrance' },
  { name: '操作类型', value: 'type' },
  { name: '操作按钮', value: 'name' },
  { name: '请求方式', value: 'requestMethod' },
  { name: '请求地址', value: 'requestUrl' },
  { name: 'ip地址', value: 'userIp' },
  { name: '操作地址', value: 'x2' },
  { name: '操作结果', value: 'resultCode', slot: 'resultCode' },
  { name: '操作时间', value: 'startTime' }
])

const getDetail = async (id) => {
  drawerLoading.value = true
  await getOperateLogDetailApi({ id })
    .then((res) => {
      detailInfo.value = res
      detailInfo.value.startTime = formatDate(res.startTime, 'YYYY-MM-DD HH:mm:ss')
      detailInfo.value.type = getDictLabel(DICT_TYPE.SYSTEM_OPERATE_TYPE, res.type)
      logInfo.value = []
      if (!res.exts) return
      let result: logChangeVO[] = []
      res.exts.forEach((item) => {
        Object.keys(item.afterExecuteData).forEach((key) => {
          result.push({
            field: key,
            afterValue: item.afterExecuteData[key] || '',
            beforeValue: item.beforeExecuteData[key] || ''
          })
        })
      })
      logInfo.value = result || []
    })
    .finally(() => {
      drawerLoading.value = false
    })
}

const onClose = () => {
  detailInfo.value = {}
  baseDescription.value = []
  logInfo.value = []
}

const openDrawer = (id: number) => {
  drawerVisible.value = true
  if (id) getDetail(id)
}
defineExpose({
  openDrawer
})
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    class="columns-drawer"
    direction="rtl"
    :lockScroll="false"
    size="762px"
    v-loading="drawerLoading"
    @close="onClose"
  >
    <template #header>
      <h4 class="text-18px font-black m-0">详情</h4>
    </template>
    <template #default>
      <div class="sub-title">基本信息</div>
      <el-row v-if="detailInfo" :gutter="30" class="pl-26px pr-20px mb-36px">
        <el-col
          class="description-item"
          :span="12"
          v-for="item in baseInfo"
          :key="item"
          :label="`${item.name}：`"
        >
          <div class="label">{{ item.name }}：</div>
          <div class="content">
            <template v-if="item.slot === 'depart'">
              <el-tooltip
                v-if="detailInfo"
                :content="`${detailInfo.componentName ? detailInfo.componentName : ''}${
                  detailInfo.organizationName ? '/' + detailInfo.organizationName : ''
                }${detailInfo.postName ? '/' + detailInfo.postName : ''}`"
                placement="top"
              >
                <div class="inline-block overflow-ellipsis whitespace-nowrap">
                  <span v-if="detailInfo.organizationName">{{ detailInfo.organizationName }}</span>
                  <span v-if="detailInfo.postName"> / {{ detailInfo.postName }}</span>
                </div>
              </el-tooltip>
            </template>
            <template v-if="item.slot === 'resultCode'">
              <el-tag :type="detailInfo[item.value] === 0 ? 'success' : 'danger'">{{
                detailInfo[item.value] === 0 ? '成功' : '失败'
              }}</el-tag>
            </template>
            <template v-else>
              <span class="description-item-content">
                <el-tooltip :content="detailInfo ? detailInfo[item.value] : ''" placement="top">
                  {{ detailInfo ? detailInfo[item.value] : '' }}
                </el-tooltip>
              </span>
            </template>
          </div>
        </el-col>
      </el-row>

      <div class="sub-title">日志内容</div>
      <div class="pl-26px pr-120px">
        <el-popover
          v-if="detailInfo && detailInfo.javaMethodArgs"
          :width="550"
          placement="right"
          trigger="click"
          effect="dark"
          :content="detailInfo ? detailInfo.javaMethodArgs : ''"
        >
          <template #reference>
            <el-link class="mb-16px" ref="checkBtnRef" type="primary" :underline="false"
              >详情</el-link
            >
          </template>
        </el-popover>
        <template v-if="onlyAfterChange">
          <el-descriptions v-if="logInfo.length > 0" :column="1" border>
            <el-descriptions-item
              v-for="(item, index) in logInfo"
              :key="index"
              :label="item.field"
              label-class-name="log-label"
            >
              <el-tooltip :content="item.afterValue" placement="top">
                <div class="max-w-400px truncate">{{ item.afterValue }}</div>
              </el-tooltip>
            </el-descriptions-item>
          </el-descriptions>
          <div v-else class="text-center text-tip mt-60px">暂无内容</div>
        </template>

        <el-table v-else :data="logInfo" border header-cell-class-name="table-header">
          <el-table-column prop="field" label="字段名" />
          <el-table-column prop="beforeValue" label="修改前" />
          <el-table-column prop="afterValue" label="修改后" />
        </el-table>
      </div>
    </template>
  </el-drawer>
</template>
<style lang="scss">
.columns-drawer {
  .el-drawer__header {
    padding: 25px 20px;
    margin-bottom: 0;
    border-bottom: 1px solid #eaebef;
  }

  .el-drawer__body {
    padding: 20px 30px;
  }

  .sub-title {
    position: relative;
    padding-left: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: bold;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      display: inline-block;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      background-color: $wg-primary-color;
      content: '';
      transform: translateY(-50%);
    }
  }

  .log-label {
    width: 140px;
    color: $title-color;
    background: var(--el-color-success-light-9);
  }

  .table-header {
    color: $title-color;
    background-color: #f6f6f6 !important;
  }

  .description-item {
    display: flex;
    margin-bottom: 18px;

    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
  }
}
</style>
