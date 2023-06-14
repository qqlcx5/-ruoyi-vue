<template>
  <el-card class="role-container" :gutter="12" shadow="never">
    <el-form class="wg-query-form w-full" ref="elFormRef" label-position="left">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label-width="70px" label="角色名称">
            <el-input
              v-model="queryParams.keyword"
              placeholder="请输入角色名称或编码"
              @keyup.enter="getRoleList"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select class="w-full" v-model="queryParams.status" placeholder="请选择" clearable>
              <el-option
                v-for="item in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="!flex flex-column justify-between">
          <div>
            <el-button type="primary" @click="getRoleList">查询</el-button>
            <el-button @click="onRoleSearchReset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <ContentWrap>
    <!-- 列表 -->
    <XTable @register="registerTable">
      <!-- 操作：新增 -->
      <template #toolbar_buttons>
        <XButton
          type="primary"
          iconFont="icon-xinzeng"
          :title="t('action.add')"
          v-hasPermi="['system:role:create']"
          @click="handleCreate()"
        />
      </template>
      <template #staff_count="{ row }">
        <el-link type="primary" @click="handleDetail(row.id, 'staff')">
          {{ row.staffCount }}
        </el-link>
      </template>
      <template #status_default="{ row }">
        <el-switch
          v-model="row.status"
          :active-value="0"
          :inactive-value="1"
          @click.stop
          @change="roleStatusChange(row)"
          :disabled="!hasPermission(['system:role:update-status'])"
        />
      </template>
      <template #actionbtns_default="{ row }">
        <!-- 操作：编辑 -->
        <XTextButton
          :title="t('action.edit')"
          v-hasPermi="['system:role:update']"
          @click="handleUpdate(row)"
        />
        <!-- 操作：权限配置 -->
        <XTextButton
          title="权限配置"
          v-hasPermi="['system:role:role-menu-data-scope']"
          @click="openConfigModal(row)"
        />
        <!-- 操作：详情 -->
        <XTextButton
          :title="t('action.detail')"
          v-hasPermi="['system:role:detail']"
          @click="handleDetail(row.id)"
        />
        <!-- 操作：删除 -->
        <XTextButton
          :title="t('action.del')"
          v-hasPermi="['system:role:delete']"
          @click="onRoleDel(row)"
        />
      </template>
    </XTable>
    <XModal v-model="dialogVisible" :title="dialogTitle" width="540px">
      <!-- 对话框(添加 / 修改) -->
      <Form
        v-if="['create', 'update'].includes(actionType)"
        :schema="allSchemas.formSchema"
        :rules="rules"
        ref="formRef"
      >
        <template #code="form">
          <el-input
            v-model="form.code"
            placeholder="请输入角色编码"
            @input="(val) => (form.code = val.replace(/[\u4e00-\u9fa5]+/g, ''))"
          />
        </template>
        <template #status="form">
          <el-switch
            v-model="form.status"
            :active-value="0"
            :inactive-value="1"
            @click.stop
            @change="formRoleStatusChange"
          />
        </template>
      </Form>
      <!-- 操作按钮 -->
      <template #footer>
        <XButton
          v-if="['create', 'update'].includes(actionType)"
          type="primary"
          :title="t('action.save')"
          :loading="actionLoading"
          @click="submitForm()"
        />
        <XButton
          :loading="actionLoading"
          :title="t('dialog.close')"
          @click="dialogVisible = false"
        />
      </template>
    </XModal>
    <ConfigDetailDrawer ref="configDetailDrawerRef" />
  </ContentWrap>
</template>
<script setup lang="ts" name="Role">
import type { FormExpose } from '@/components/Form'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { rules, allSchemas } from './role.data'
import * as RoleApi from '@/api/system/role'
import ConfigDetailDrawer from './component/ConfigDetailDrawer.vue'
import { h } from 'vue'
import { CommonStatusEnum } from '@/utils/constants'
import { hasPermission } from '@/utils/routerHelper'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const router = useRouter() // 路由

// 列表相关的变量
const searchForm = ref()
const queryParams = ref({ keyword: '', status: '' })
const [registerTable, { reload, deleteReq, search }] = useXTable({
  tableKey: 'role-table',
  allSchemas: allSchemas,
  params: searchForm,
  getListApi: RoleApi.getRolePageApi,
  deleteApi: RoleApi.deleteRoleApi,
  border: true
})
const getRoleList = () => {
  searchForm.value = { ...queryParams.value }
  search()
}
// 查询重置
const onRoleSearchReset = () => {
  queryParams.value = { keyword: '', status: '' }
  getRoleList()
}

// ========== CRUD 相关 ==========
const actionLoading = ref(false) // 遮罩层
const actionType = ref('') // 操作按钮的类型
const dialogVisible = ref(false) // 是否显示弹出层
const dialogTitle = ref('edit') // 弹出层标题
const formRef = ref<FormExpose>() // 表单 Ref
const configDetailDrawerRef = ref()

// 设置标题
const setDialogTile = (type: string) => {
  dialogTitle.value = t('action.' + type)
  actionType.value = type
  dialogVisible.value = true
}

// 新增操作
const handleCreate = () => {
  setDialogTile('create')
}

// 修改操作
const handleUpdate = async (row) => {
  setDialogTile('update')
  // 设置数据
  await nextTick()
  unref(formRef)?.setValues(JSON.parse(JSON.stringify(row)))
}

// 详情操作
const handleDetail = async (rowId, trigger) => {
  const res = await RoleApi.getRoleApi(rowId)
  configDetailDrawerRef.value.openDrawer(res, trigger)
}

// 删除操作
const onRoleDel = async (row) => {
  const activeUserCount = await RoleApi.getActiveUsersCount(row.id) // 请求在职员工数
  if (activeUserCount > 0) {
    message
      .wgOperateConfirm(
        h('span', [
          '系统校验到该岗位类型底下还存在 ',
          h('span', { style: { color: 'red' } }, activeUserCount),
          ' 个在职状态开启的员工，请先关闭或转移所有员工再操作关闭哦~'
        ]),
        `提示`,
        {
          confirmButtonText: t('common.toOperate'),
          cancelButtonText: t('common.cancel'),
          lockScroll: false
        }
      )
      .then(async () => {
        goto(row)
      })
      .catch(() => {})
  } else {
    message
      .wgConfirm('删除后， 数据将不可恢复，请谨慎操作。', `确定删除 ${row.name} 角色吗？`, {
        confirmButtonText: t('common.confirmDel'),
        cancelButtonText: t('common.cancel')
      })
      .then(async () => {
        await deleteReq(row.id)
      })
      .catch(() => {})
  }
}

const formRoleStatusChange = () => {
  if (actionType.value === 'update') {
    const res = unref(formRef)?.formModel
    if (res) roleStatusChange(res, 'form')
  }
}
// 状态变更
const roleStatusChange = async (row, trigger) => {
  const text = row.status === CommonStatusEnum.ENABLE ? '开启' : '关闭'
  if (row.status === CommonStatusEnum.DISABLE) {
    const activeUserCount = await RoleApi.getActiveUsersCount(row.id) // 请求在职员工数
    if (activeUserCount === null) return message.error('系统异常')
    if (activeUserCount > 0) {
      return message
        .wgOperateConfirm(
          h('span', [
            '系统校验到该机构底下还存在 ',
            h('span', { style: { color: 'red' } }, activeUserCount),
            ' 个在职状态开启的员工，请先关闭或转移所有员工再操作关闭哦~'
          ]),
          `提示`,
          {
            confirmButtonText: t('common.toOperate'),
            cancelButtonText: t('common.cancel'),
            lockScroll: false
          }
        )
        .then(async () => {
          goto(row)
          if (trigger === 'form') dialogVisible.value = false
        })
        .catch(() => {})
        .finally(() => {
          if (trigger !== 'form') {
            row.status =
              row.status === CommonStatusEnum.ENABLE
                ? CommonStatusEnum.DISABLE
                : CommonStatusEnum.ENABLE
          } else {
            unref(formRef)?.setValues({
              status:
                row.status === CommonStatusEnum.ENABLE
                  ? CommonStatusEnum.DISABLE
                  : CommonStatusEnum.ENABLE
            })
          }
        })
    }
  }
  if (trigger === 'form') return
  message
    .wgConfirm(
      row.status === CommonStatusEnum.ENABLE ? '' : `${text}后， 将无法再选择该角色，请谨慎操作。`,
      `确定${text} ${row.name} 吗？`,
      {
        confirmButtonText: t(
          row.status === CommonStatusEnum.ENABLE ? 'common.confirmOpen' : 'common.confirmClose'
        ),
        cancelButtonText: t('common.cancel')
      }
    )
    .then(async () => {
      const result = await RoleApi.updateRoleApi(row)
      if (result) {
        message.success(`成功${text}${row.name}`)
      } else {
        message.error(`${text}${row.name}失败`)
      }
      await reload()
    })
    .catch(() => {
      reload()
    })
}

// 提交按钮
const submitForm = async () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      actionLoading.value = true
      // 提交请求
      try {
        const data = unref(formRef)?.formModel as RoleApi.RoleVO
        if (actionType.value === 'create') {
          await RoleApi.createRoleApi(data)
          message.success(t('common.createSuccess'))
        } else {
          await RoleApi.updateRoleApi(data)
          message.success(t('common.updateSuccess'))
        }
        dialogVisible.value = false
      } finally {
        actionLoading.value = false
        // 刷新列表
        await reload()
      }
    }
  })
}

const goto = ({ id }) => {
  router.push({
    name: 'Member',
    query: { roleId: id }
  })
}

// ========== 权限配置 ==========
const openConfigModal = (row) => {
  router.push(`/system/role-config?id=${row.id}`)
}

// ========== 初始化 ==========
onMounted(() => {})
</script>
<style lang="scss" scoped></style>
