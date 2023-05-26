<template>
  <el-card class="post-container" :gutter="12" shadow="never">
    <template #header>
      <div class="text-18px font-medium">
        <span class="font-500">岗位类型</span>
      </div>
    </template>
    <div class="flex">
      <!-- ====== 岗位类型 ====== -->
      <div class="w-1/2 overflow-hidden">
        <el-form
          class="query-form w-full"
          ref="elFormRef"
          :model="postTypeSearchForm"
          label-position="left"
        >
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label-width="70px" label="岗位类型">
                <el-input
                  v-model="postTypeSearchForm.nameOrCode"
                  placeholder="请输入岗位类型或编码"
                  @keyup.enter="postSearch"
                  clearable
                />
              </el-form-item>
            </el-col>
            <!--            <el-col :span="8">-->
            <!--              <el-form-item label="状态">-->
            <!--                <el-select class="w-full" v-model="postTypeSearchForm.status" placeholder="请选择">-->
            <!--                  <el-option-->
            <!--                    v-for="item in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"-->
            <!--                    :key="item.value"-->
            <!--                    :label="item.label"-->
            <!--                    :value="item.value"-->
            <!--                  />-->
            <!--                </el-select>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->

            <el-col :span="8" class="!flex flex-column justify-between">
              <div>
                <el-button type="primary" @click="postSearch">查询</el-button>
                <el-button @click="onPostTypeSearchReset">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <el-divider class="!mt-0 !mb-16px" />
        <XTable ref="postTypeRef" @register="registerPostType" @cell-click="cellClickEvent">
          <!-- 操作：新增类型 -->
          <template #toolbar_buttons>
            <XButton
              type="primary"
              iconFont="icon-xinzeng"
              :title="t('action.add')"
              v-hasPermi="['system:post:create']"
              @click="openModal('create', 'type')"
            />
            <!--            <XButton-->
            <!--              type="primary"-->
            <!--              plain-->
            <!--              iconFont="icon-daoru"-->
            <!--              :title="t('action.import')"-->
            <!--              v-hasPermi="['system:post:create']"-->
            <!--              @click="openModal('create', 'type')"-->
            <!--            />-->
            <!--            <XButton-->
            <!--              type="primary"-->
            <!--              plain-->
            <!--              iconFont="icon-daochu"-->
            <!--              :title="t('action.export')"-->
            <!--              v-hasPermi="['system:post:export']"-->
            <!--              @click="postTypeExport('岗位类型.xls')"-->
            <!--            />-->
          </template>
          <template #user_count="{ row }">
            <el-link type="primary" @click="goto(row, 'postType')">{{ row.userCount }}</el-link>
          </template>
          <template #actionbtns_default="{ row }">
            <!-- 操作：修改数据 -->
            <XTextButton
              :title="t('action.modify')"
              v-hasPermi="['system:post:update']"
              @click="openModal('update', 'type', row?.id)"
            />
            <!-- 操作：删除 -->
            <XTextButton
              :title="t('action.delete')"
              v-hasPermi="['system:post:delete']"
              @click="onPostDel(row, 'type')"
            />
          </template>
        </XTable>
      </div>

      <!-- ====== 岗位信息 ====== -->
      <div class="w-1/2 px-12px py-18px ml-50px shadow-card rounded-2px overflow-hidden">
        <p class="text-18px font-500">
          <span v-show="postParent?.name">{{ `${postParent?.name}-` }}</span>
          岗位信息
          <el-button v-if="postParent?.id" type="primary" text bg @click="removePostType"
            >清除</el-button
          >
        </p>
        <!--        <div v-if="!postParent" class="text-20px text-tip text-center mt-248px"> 请从左侧选择 </div>-->
        <div>
          <el-form
            class="query-form w-full"
            ref="elFormRef"
            :model="postInfoSearchForm"
            label-position="left"
          >
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="岗位名称">
                  <el-input
                    v-model="postInfoSearchForm.nameOrCode"
                    placeholder="请输入岗位名称或编码"
                    @keyup.enter="postInfoSearch"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态">
                  <el-select
                    class="w-full"
                    v-model="postInfoSearchForm.status"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="!flex flex-column justify-between">
                <div>
                  <el-button type="primary" @click="postInfoSearch">查询</el-button>
                  <el-button @click="onPostInfoSearchReset">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <el-divider class="!mt-0 !mb-16px" />
          <!-- 列表 -->
          <XTable @register="registerPostInfo">
            <!-- 操作：新增数据 -->
            <template #toolbar_buttons>
              <XButton
                type="primary"
                iconFont="icon-xinzeng"
                :title="t('action.add')"
                v-hasPermi="['system:post:create']"
                @click="openModal('create', 'info', postParent?.code)"
              />
              <!--              <XButton-->
              <!--                type="primary"-->
              <!--                plain-->
              <!--                iconFont="icon-daoru"-->
              <!--                :title="t('action.import')"-->
              <!--                v-hasPermi="['system:post:create']"-->
              <!--                @click="openModal('create', 'info')"-->
              <!--              />-->
              <!--              <XButton-->
              <!--                type="primary"-->
              <!--                plain-->
              <!--                iconFont="icon-daochu"-->
              <!--                :title="t('action.export')"-->
              <!--                v-hasPermi="['system:post:export']"-->
              <!--                @click="postInfoExport('岗位信息.xls')"-->
              <!--              />-->
              <XButton
                color="#666666"
                plain
                title="批量分配角色"
                v-hasPermi="['system:post:create']"
                @click="openDistributeModal(false, 'multi')"
              />
            </template>
            <template #role_list="{ row }">
              <div v-for="item in row.roleList" :key="item.roleId" class="role-tag-box">
                <div
                  v-if="item.roleName"
                  class="role-tag"
                  :class="{ delete: item.roleDeleted, close: item.roleStatus }"
                >
                  {{ item.roleName }}
                  <span v-if="item.roleDeleted">(删除)</span>
                  <span v-else-if="item.roleStatus">(关闭)</span>
                </div>
              </div>
            </template>
            <template #status_default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="0"
                :inactive-value="1"
                @click.stop
                @change="postInfoStatusChange(row)"
              />
            </template>
            <template #user_count="{ row }">
              <el-link type="primary" @click="goto(row, 'post')">{{ row.userCount }}</el-link>
            </template>
            <template #actionbtns_default="{ row }">
              <!-- 操作：修改数据 -->
              <XTextButton
                :title="t('action.modify')"
                v-hasPermi="['system:post:update']"
                @click="openModal('update', 'info', row?.id)"
              />
              <!-- 操作：分配角色 -->
              <XTextButton
                title="分配角色"
                v-hasPermi="['system:post:delete']"
                @click="openDistributeModal(row, 'single')"
              />
              <!-- 操作：删除 -->
              <XTextButton
                :title="t('action.delete')"
                v-hasPermi="['system:post:delete']"
                @click="onPostDel(row, 'info')"
              />
            </template>
          </XTable>
        </div>
      </div>
    </div>
  </el-card>
  <!-- 表单弹窗：添加/修改/详情 -->
  <PostForm ref="modalRef" @success="postFormSuccess" />
  <!--  分配岗位-->
  <DistributeModal ref="distributeModalRef" @success="postInfoGet" />
</template>
<script setup lang="ts" name="Post">
import { VxeTableEvents } from 'vxe-table'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { allSchemas as typeAllSchemas } from '@/views/system/post/post-type.data'
import { allSchemas as infoAllSchemas } from '@/views/system/post/post-info.data'
import * as PostTypeApi from '@/api/system/post/type'
import * as PostInfoApi from '@/api/system/post/info'
import PostForm from './form.vue'
import DistributeModal from './component/DistributeModal.vue'
import { h } from 'vue'
import { CommonStatusEnum } from '@/utils/constants'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { push } = useRouter()

/* 岗位类型 */
const postTypeSearchForm = ref({
  name: '',
  status: ''
})
// 列表相关的变量
const postTypeRef = ref()
// const [registerPostType, { reload: postTypeGet, deleteReq, exportList: postTypeExport }] =
const [registerPostType, { reload: postTypeGet, deleteReq, search: postSearch }] = useXTable({
  tableKey: 'post-type-table',
  allSchemas: typeAllSchemas, // 列表配置
  params: postTypeSearchForm,
  getListApi: PostTypeApi.getPostPageApi, // 加载列表的 API
  deleteApi: PostTypeApi.deletePostApi, // 删除数据的 API
  exportListApi: PostTypeApi.exportPostApi, // 导出数据的 API
  border: true,
  height: 660
})
// 字典分类点击行事件
const postParent = ref()
const cellClickEvent: VxeTableEvents.CellClick = async ({ row }) => {
  postParent.value = row
  postInfoSearchForm.value.typeCode = row.code
  await nextTick()
  await postInfoGet()
}
// 查询重置
const onPostTypeSearchReset = () => {
  postTypeSearchForm.value = {
    name: '',
    status: ''
  }
  postTypeGet()
}

/* 岗位信息 */
const postInfoSearchForm = ref({
  nameOrCode: '',
  status: '',
  typeCode: ''
})
// 列表相关的变量
const [
  registerPostInfo,
  {
    reload: postInfoGet,
    deleteReq: postInfoDelete,
    // exportList: postInfoExport,
    getCheckboxRecords: getInfoCheckboxRecords,
    search: postInfoSearch
  }
] = useXTable({
  tableKey: 'post-info-table',
  allSchemas: infoAllSchemas, // 列表配置
  params: postInfoSearchForm,
  getListApi: PostInfoApi.getPostPageApi, // 加载列表的 API
  deleteApi: PostInfoApi.deletePostApi, // 删除数据的 API
  exportListApi: PostInfoApi.exportPostApi, // 导出数据的 API
  border: true,
  height: 606
})
// 查询重置
const onPostInfoSearchReset = () => {
  postInfoSearchForm.value.nameOrCode = ''
  postInfoSearchForm.value.status = ''
  postInfoGet()
}
// 清除
const removePostType = () => {
  postParent.value = {}
  postInfoSearchForm.value.typeCode = ''
  onPostInfoSearchReset()
  postTypeRef.value.Ref.clearCurrentRow()
}

// 删除
const onPostDel = async (row, type: string) => {
  if (type === 'type' ? +row.postCount : +row.userCount) {
    const { total } = await PostInfoApi.getPostPageApi({
      typeCode: row.code,
      status: CommonStatusEnum.ENABLE
    })
    message
      .wgOperateConfirm(
        type === 'type'
          ? h('span', [
              h('span', '系统校验到该岗位类型底下还存在 '),
              h('span', { style: { color: 'red' } }, total),
              h('span', ' 个状态开启的岗位，请先关闭或转移所有岗位再操作删除哦~')
            ])
          : h('span', [
              h('span', '系统校验到该岗位类型底下还存在 '),
              h('span', { style: { color: 'red' } }, row.userCount),
              h('span', ' 个在职员工，请先关闭或转移所有员工再操作删除哦~')
            ]),
        `提示`,
        {
          confirmButtonText: t('common.toOperate'),
          cancelButtonText: t('common.cancel'),
          lockScroll: false,
          autofocus: false
        }
      )
      .then(async () => {
        goto(row, type === 'type' ? 'postType' : 'post')
      })
      .catch(() => {})
  } else {
    if (type === 'type') {
      message
        .wgConfirm(
          h('span', [
            h('span', `删除后， ${row.name} 底下的 `),
            h('span', { style: { color: 'red' } }, row.postCount),
            h('span', ' 个岗位将同步删除，且不可恢复，请谨慎操作。')
          ]),
          `确定删除 ${row.name} 该岗位类型吗？`
        )
        .then(async () => {
          deleteReq(row.id)
          postParent.value = {}
          postInfoGet()
        })
        .catch(() => {})
    } else if (type === 'info') {
      message
        .wgConfirm(
          h('span', [
            h('span', `删除后， ${row.name} 底下的 `),
            h('span', { style: { color: 'red' } }, row.userCount),
            h('span', ' 个员工岗位将同步删除，且不可恢复，请谨慎操作。')
          ]),
          `确定删除 ${row.name} 该岗位类型吗？`
        )
        .then(async () => {
          await postInfoDelete(row.id)
          await postTypeGet()
        })
        .catch(() => {})
    }
  }
}
// 更新岗位状态
const postInfoStatusChange = async (row) => {
  const text = row.status === CommonStatusEnum.ENABLE ? '开启' : '关闭'
  if (+row.userCount && row.status === CommonStatusEnum.DISABLE) {
    message
      .wgOperateConfirm(
        h('span', [
          h('span', '系统校验到该岗位底下还存在 '),
          h('span', { style: { color: 'red' } }, row.userCount),
          h('span', ' 个在职员工，请先关闭或转移所有员工再操作关闭哦~')
        ]),
        `提示`,
        {
          confirmButtonText: t('common.toOperate'),
          cancelButtonText: t('common.cancel'),
          lockScroll: false,
          autofocus: false
        }
      )
      .then(async () => {
        goto(row, 'post')
      })
      .catch(() => {})
      .finally(() => {
        row.status =
          row.status === CommonStatusEnum.ENABLE
            ? CommonStatusEnum.DISABLE
            : CommonStatusEnum.ENABLE
      })
  } else {
    message
      .wgConfirm(
        row.status === CommonStatusEnum.DISABLE
          ? h('span', [
              h('span', `${text}后，将无法再选择该岗位，且${row.name}底下已配置的 `),
              h('span', { style: { color: 'red' } }, row.userCount),
              h('span', ' 个员工也将同步关闭该岗位，请谨慎操作。')
            ])
          : h('span', [
              h('span', `${text}后，${row.name}底下的 `),
              h('span', { style: { color: 'red' } }, row.userCount),
              h('span', ' 个员工将同步开启该岗位，请谨慎操作。')
            ]),
        `确定${text} ${row.name} 吗？`,
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          lockScroll: false,
          autofocus: false
        }
      )
      .then(async () => {
        const updateStatus = await PostInfoApi.updatePostApi({ ...row })
        await postTypeGet()
        if (updateStatus) {
          message.success(text + '成功')
        } else {
          message.warning(t('sys.api.operationFailed'))
        }
      })
      .catch(() => {
        row.status =
          row.status === CommonStatusEnum.ENABLE
            ? CommonStatusEnum.DISABLE
            : CommonStatusEnum.ENABLE
      })
  }
}

const postFormSuccess = (type): void => {
  if (type === 'type') {
    postTypeGet()
  } else if (type === 'info') {
    postInfoGet()
    postTypeGet()
  }
}

// 表单相关的变量
const modalRef = ref()
const openModal = (type: string, tableType: string, id?: number) => {
  modalRef.value.openModal(type, tableType, id)
}

// 分配角色弹窗
const distributeModalRef = ref()
const openDistributeModal = (row, mode: string) => {
  if (mode === 'single') {
    distributeModalRef.value.openModal(row, mode, row.typeCode)
  } else if (mode === 'multi') {
    const checkedRow = getInfoCheckboxRecords()
    if (checkedRow && checkedRow.length === 0) {
      return message.warning('请勾选要分配的岗位')
    } else {
      distributeModalRef.value.openModal(checkedRow, mode, postParent.value.code)
    }
  }
}

// 跳转
const goto = ({ id }, type) => {
  push({
    name: 'Member',
    query:
      type === 'postType' ? { postTypeId: id } : { postId: id, postTypeId: postParent.value.id }
  })
}
</script>

<style lang="scss" scoped>
.post-container {
  :deep(.el-card__header) {
    border: none;
    box-shadow: 0 2px 4px 0 rgba(218, 218, 218, 0.5);
  }
  .role-tag-box {
    margin: 4px 0;
    &:not(:last-child) {
      margin-bottom: 2px;
    }
  }
  .role-tag {
    width: fit-content;
    font-size: 12px;
    padding: 4px 8px;
    line-height: 1;
    color: $wg-primary-color;
    background-color: #f0f8ff;
    border: 1px solid $wg-primary-color;
    border-radius: 4px;
    &.close {
      color: #71b9ff;
      background-color: #f0f8ff;
      border: 1px solid #71b9ff;
    }
    &.delete {
      color: #b5b7bd;
      background-color: #eaebef;
      border: none;
    }
  }
}
</style>
