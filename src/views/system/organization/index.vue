<!--  机构管理  -->
<template>
  <!-- 搜索工作栏 -->

  <ContentWrap>
    <a-form :model="queryParams" ref="queryFormRef" layout="inline">
      <a-form-item :label="`机构名称`" name="keyword">
        <a-input v-model:value="queryParams.keyword" placeholder="请输入机构名称或者编码" />
      </a-form-item>

      <a-form-item :label="`机构类型`" name="organizationType">
        <a-select
          v-model:value="queryParams.organizationType"
          placeholder="请选择状态"
          style="width: 200px"
          :options="state.organizationTypeOptions"
        />
      </a-form-item>

      <a-form-item :label="`状态`" name="status">
        <a-select
          v-model:value="queryParams.status"
          placeholder="请选择状态"
          style="width: 200px"
          :options="state.statusOptions"
        />
      </a-form-item>
      <a-button type="primary" html-type="submit" @click="getList">查询</a-button>
      <a-button @click="resetQuery">重置</a-button>
    </a-form>
  </ContentWrap>

  <!--  表格  -->
  <a-card :bordered="false" style="min-width: 1650px; padding-bottom: 30px" id="card-content">
    <!--  <ContentWrap>-->
    <!--    <a-button type="primary" @click="toggleExpandAll" v-hasPermi="['system:menu:create']">-->
    <!--      <Icon icon="ep:plus" class="mr-5px" color="#fff" /> 新增新增</a-button-->
    <!--    >-->

    <div class="card-content">
      <!--  左侧按钮  -->
      <div class="button-content">
        <a-button type="primary" @click="openModal()">
          <template #icon><Icon icon="svg-icon:add" class="btn-icon" :size="10" /></template>
          新增
        </a-button>
        <a-button @click="toggleExpandAll">
          <template #icon>
            <Icon icon="svg-icon:expansion" class="btn-icon" :size="10" v-if="state.isExpandAll" />
            <Icon icon="svg-icon:expandFold" class="btn-icon" :size="10" v-else />
          </template>
          展开收起
        </a-button>
      </div>
      <!--  右侧操作  -->
      <div class="operation-content">
        <!--        <Icon icon="svg-icon:search" :size="50" class="cursor-pointer" />-->
        <Icon icon="svg-icon:full-screen" :size="50" class="cursor-pointer" @click="fullScreen" />
        <!--        <Icon icon="svg-icon:print-connect" :size="50" class="cursor-pointer" />-->
        <Icon icon="svg-icon:refresh" :size="50" class="cursor-pointer" @click="getList" />
        <Icon
          icon="svg-icon:custom-column"
          :size="50"
          class="cursor-pointer"
          @click="state.isShowCustomColumnModal = true"
        />
      </div>
    </div>

    <!--  分页 - - 之前有 后面去掉了  -->
    <!--    :pagination="{-->
    <!--    pageSizeOptions: ['20', '30', '60', '100'],-->
    <!--    showSizeChanger: true,-->
    <!--    showQuickJumper: true,-->
    <!--    pageSize: queryParams.pageSize,-->
    <!--    current: queryParams.current,-->
    <!--    total: state.total,-->
    <!--    showTotal: (total) => `总共 ${total} 条`-->
    <!--    }"-->

    <a-table
      v-if="state.refreshTable"
      :columns="state.columns"
      :data-source="state.tableDataList"
      :scroll="{ x: '100%' }"
      :pagination="false"
      @change="onChange"
      :row-key="(record) => record.id"
      :loading="state.loading"
      :expandable="{ defaultExpandAllRows: false, expandRowByClick: false }"
      :defaultExpandAllRows="state.isExpandAll"
      @resizeColumn="handleResizeColumn"
    >
      <!--  自定义展开折叠图标  -->
      <template #expandIcon="props">
        <span v-if="props.record.children && props.record.children.length > 0">
          <div
            v-if="props.expanded"
            style="display: inline-block; margin-right: 10px"
            @click="
              (e) => {
                props.onExpand(props.record, e)
              }
            "
          >
            <Icon icon="ep:caret-bottom" :size="12" />
          </div>
          <div
            v-else
            style="display: inline-block; margin-right: 10px"
            @click="
              (e) => {
                props.onExpand(props.record, e)
              }
            "
          >
            <Icon icon="ep:caret-right" :size="12" />
          </div>
        </span>
        <span v-else style="margin-right: 22px"></span>
      </template>
      <!--  单元格插槽  -->
      <template #bodyCell="{ column, record }">
        <!--  可用名额   -->
        <template v-if="column?.key === 'usableAmount'">
          <div class="text-color">{{ record.accountUsedCount }}/{{ record.accountCount }}</div>
        </template>
        <!--  有效期   -->
        <template v-if="column?.key === 'validityPeriod'">
          <div>{{ record.effectiveStartDate }}~{{ record.expireTime }}</div>
        </template>
        <!--  状态   -->
        <template v-if="column?.key === 'statusSwitch'">
          <!-- TODO： 0开启 1关闭 ...换成开关的话 -  -需要对数据进行处理  - - 即对tree里的status进行替换 为布尔值 ... -->
          <!-- <div class="employees-Number">{{ record.status }}</div>-->
          <!--          <a-switch-->
          <!--            v-model:checked="record.statusSwitch"-->
          <!--            @change="(value) => tableStatusChange(value, record)"-->
          <!--          />-->
          <a-switch
            :disabled="record.level === 1"
            v-model:checked="record.statusSwitch"
            @change="(value) => setTableStatusChangeInfo(value, record)"
          />
        </template>
        <!--  操作   -->
        <template v-if="column?.key === 'operation'">
          <div class="operation-content">
            <div class="text-color margin-right-5" @click="edit(record)">修改</div>
            <div class="text-color margin-right-5" @click="openModal(record)">新增子项</div>
            <div class="text-color margin-right-5" @click="assignPermission(record)">功能配置</div>
            <a-popover placement="bottom">
              <template #content>
                <div class="text-color margin-right-5" @click="detailsInfo(record)">详情</div>
              </template>
              <Icon icon="svg-icon:ellipsis" class="btn-icon" :size="10" />
            </a-popover>
          </div>
        </template>
      </template>
    </a-table>
    <!--  </ContentWrap>-->
  </a-card>

  <!-- 新增 编辑 Modal -->
  <a-modal
    v-model:visible="state.isShow"
    :title="state.modalTitle"
    wrapClassName="add-edit-modal"
    @cancel="closeModal"
    :bodyStyle="{ maxHeight: '600px', margin: 'auto', paddingBottom: '25px', overflow: 'auto' }"
  >
    <div class="base_info_content">
      <a-form
        :model="state.formState"
        ref="formRef"
        v-bind="layout"
        :label-col="{ style: { width: '130px' } }"
      >
        <a-form-item :label="`上级机构`" name="parentId">
          <a-tree-select
            v-model:value="state.formState.parentId"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择上级机构"
            :tree-data="state.optionalMenuTree"
            :fieldNames="{ children: 'children', label: 'name', value: 'id' }"
            treeNodeFilterProp="label"
          />
        </a-form-item>

        <a-form-item
          :label="`机构类型`"
          name="organizationType"
          :rules="[{ required: true, message: `机构类型不能为空` }]"
        >
          <a-tree-select
            v-model:value="state.formState.organizationType"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择机构类型"
            :tree-data="state.organizationTypeOptions"
            treeNodeFilterProp="label"
          />
        </a-form-item>

        <a-form-item
          :label="`机构名称`"
          name="name"
          :rules="[{ required: true, message: `机构名称不能为空` }]"
        >
          <a-input
            v-model:value="state.formState.name"
            show-count
            :maxlength="20"
            placeholder="请输入机构编码"
          />
        </a-form-item>

        <a-form-item
          :label="`机构编码`"
          name="code"
          :rules="[{ required: true, message: `机构编码不能为空` }]"
        >
          <a-input
            v-model:value="state.formState.code"
            show-count
            :maxlength="20"
            placeholder="请输入机构编码"
          />
        </a-form-item>

        <a-form-item :label="`机构简称`" name="abbreviate">
          <a-input
            v-model:value="state.formState.abbreviate"
            show-count
            :maxlength="10"
            placeholder="请输入机构简称"
          />
        </a-form-item>

        <a-form-item
          :label="`负责人`"
          name="contactName"
          :rules="[{ required: true, message: `负责人不能为空` }]"
        >
          <a-input v-model:value="state.formState.contactName" placeholder="请输入负责人姓名" />
        </a-form-item>

        <a-form-item label="负责人电话" name="contactMobile" :rules="state.contactMobileRules">
          <a-input v-model:value="state.formState.contactMobile" placeholder="请输入机构编码" />
        </a-form-item>

        <a-form-item label="负责人邮箱" name="contactMail" :rules="state.contactMailRules">
          <a-input v-model:value="state.formState.contactMail" placeholder="请输入邮箱" />
        </a-form-item>

        <a-form-item label="排序" name="sort" :rules="[{ required: true, message: '排序!' }]">
          <a-input-number v-model:value="state.formState.sort" :min="0" :max="100" />
        </a-form-item>

        <a-form-item
          v-if="state.modalType === 'add'"
          label="状态"
          name="status"
          :rules="[{ required: true, message: '菜单状态!' }]"
        >
          <a-switch
            v-model:checked="state.formState.status"
            checked-children="开启"
            un-checked-children="关闭"
          />
        </a-form-item>
      </a-form>
    </div>

    <template #footer>
      <a-button
        type="primary"
        html-type="submit"
        @click="addMajorIndividualFN"
        :loading="state.addEditLoading"
        >确定</a-button
      >
      <a-button @click="closeModal">取消</a-button>
    </template>
  </a-modal>

  <!-- 配置权限 Modal -->
  <a-modal
    v-model:visible="state.isShowPermission"
    title="配置权限"
    @ok="closePermissionModal"
    @cancel="closePermissionModal"
    :width="'665px'"
    :bodyStyle="{ height: '700px', margin: '0', padding: '0', overflow: 'auto' }"
  >
    <div class="per-content">
      <div class="text-content">请选择该机构的功能配置权限：</div>
      <!--  左右两侧  -->
      <div class="select-content">
        <div class="left-content">
          <a-tabs
            v-model:activeKey="state.activeKey"
            tabBarGutter="40px"
            :tabBarStyle="{ paddingLeft: '10px', background: 'rgb(246, 246, 246)', margin: 0 }"
          >
            <a-tab-pane key="frontDesk" tab="前台" force-render>前台</a-tab-pane>
            <a-tab-pane key="backstage" tab="后台">
              <div class="tab-search-content">
                <a-checkbox v-model:checked="state.selectAll" @change="selectAll">全选</a-checkbox>
                <a-checkbox v-model:checked="state.isExpandAllTab" @change="expandAllFN"
                  >展开/折叠</a-checkbox
                >
              </div>
              <div>
                <a-tree
                  v-if="state.isShowTree"
                  v-model:selectedKeys="state.selectedKeys"
                  v-model:checkedKeys="state.checkedKeys"
                  :defaultExpandAll="state.defaultExpandAll"
                  checkable
                  :height="533"
                  :tree-data="state.menuTreeList"
                  :fieldNames="state.fieldNames"
                  @check="testCheck"
                  multiple
                >
                  <!--                  <template #title="{ title, key }">-->
                  <!--                    <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>-->
                  <!--                    <template v-else>{{ title }}</template>-->
                  <!--                  </template>-->
                </a-tree>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div class="right-content">
          <div>
            <a-tree
              v-if="state.isShowRightTree"
              defaultExpandAll
              :height="533"
              :tree-data="state.selectTree"
              :fieldNames="state.fieldNames"
            >
              <!--                  <template #title="{ title, key }">-->
              <!--                    <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>-->
              <!--                    <template v-else>{{ title }}</template>-->
              <!--                  </template>-->
            </a-tree>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="PermissionOk">确定选择</a-button>
      <a-button @click="closePermissionModal">取消</a-button>
    </template>
  </a-modal>

  <!--  状态开始关闭 短信提示Modal  -->
  <a-modal
    v-model:visible="state.isShowMessage"
    :title="state.messageTitle"
    @ok="statusOk"
    @cancel="statusCancel"
    width="560px"
    :bodyStyle="{
      width: '100%',
      height: '200px',
      margin: '0',
      padding: '30px 0 0 0',
      overflow: 'auto'
    }"
  >
    <div class="message-content">
      <!--      <img :src="warningImg" alt="" class="tip-img" />-->
      <div class="message-text-content">
        <div class="message-text">
          <img :src="warningImg" alt="" class="tip-img message-img" />
          {{ state.messageText }}
        </div>
        <div class="message-phone">
          机构负责人绑定的手机号：{{
            state.messageContactMobile.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2')
          }}
        </div>
        <div class="message-input-content"
          >短信验证码:
          <a-input
            v-model:value="state.messageCode"
            placeholder="请输入验证码"
            style="width: 180px; margin-left: 8px"
          />
          <div v-if="state.canSendCode" class="send-code-btn" @click="senCodeFN"> 发送验证码 </div>
          <div v-else class="countdown-code-btn">{{ state.codeCountdown }}s重新获取</div>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="statusOk">{{
        state.messageBtnText
      }}</a-button>
      <a-button @click="statusCancel">取消</a-button>
    </template>
  </a-modal>

  <!--  状态开始关闭 确认Modal  -->
  <a-modal
    v-model:visible="state.isShowStatus"
    :closable="false"
    width="424px"
    :bodyStyle="{
      width: '100%',
      height: '139px',
      margin: '0',
      padding: '33px 0 0 0px',
      overflow: 'auto'
    }"
  >
    <div class="status-content">
      <!--      <img :src="warningImg" alt="" class="tip-img" />-->
      <div class="status-text-content">
        <div class="status-text">
          <img :src="warningImg" alt="" class="tip-img" />{{
            state.tableStatusChangeInfo.statusBtnText
          }}
          {{ state.tableStatusChangeInfo.record.name }} 吗？</div
        >
        <div
          v-if="state.tableStatusChangeInfo.record?.children?.length > 0"
          class="status-text-info"
        >
          {{ state.tableStatusChangeInfo.statusTopText }} ，{{
            state.tableStatusChangeInfo.record.name
          }}底下
          <span class="status-span">{{
            state.tableStatusChangeInfo.record?.children?.length
          }}</span>
          个子项机构将同步 {{ state.tableStatusChangeInfo.statusText }}，请谨慎操作。
        </div>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="tableStatusConfirm">{{
        state.tableStatusChangeInfo.statusBtnText
      }}</a-button>
      <a-button @click="closeStatusModal">取消</a-button>
    </template>
  </a-modal>

  <!--  详情  -->
  <a-modal
    v-model:visible="state.isShowDetails"
    title="详情"
    wrapClassName="details-modal"
    width="763px"
    :bodyStyle="{ overflow: 'auto' }"
  >
    <div class="details-edit" @click="edit(state.record, true)"
      ><img :src="editImg" alt="" class="edit-Img" />修改</div
    >
    <div v-for="(item, index) in state.detailsInfo" :key="`info${index}`" class="details-content">
      <div class="title-content"><div class="blue-line"></div>{{ item.baseTitle }}</div>
      <div class="info-content" v-if="item.baseTitle !== '配置权限'">
        <div
          :class="['text-style', { 'super-admin-style': childItem?.isSuperAdmin }]"
          v-for="(childItem, childIndex) in item.infoArr"
          :key="`childItem${childIndex}`"
          ><span>{{ childItem.textSpan }}</span>
          <img
            v-if="childItem?.imgUrl"
            :src="childItem?.imgUrl"
            alt=""
            class="details-img"
            @click="setPreviewImage(childItem?.imgUrl)"
          />
          <template v-else>
            <a-tooltip>
              <template #title> {{ childItem.text }}</template>
              {{ childItem.text }}
            </a-tooltip>
          </template>

          <div v-if="childItem?.isSuperAdmin" class="send-code-btn" @click="resetPassword">
            重置密码
          </div>
        </div>
      </div>
      <div class="details-modal-content select-content" v-else>
        <div class="details-modal-left">
          <div class="details-heard">前台</div>
          <!--          <a-tree-->
          <!--            defaultExpandAll-->
          <!--            :tree-data="item.treeArr"-->
          <!--            :fieldNames="state.fieldNames"-->
          <!--          >-->
          <!--          </a-tree>-->
        </div>
        <div class="details-modal-left">
          <div class="details-heard">后台({{ item.treeArr?.length }})</div>
          <a-tree defaultExpandAll :tree-data="item.treeArr" :fieldNames="state.fieldNames" />
        </div>
      </div>
    </div>
  </a-modal>

  <!--  重置密码 Modal  -->
  <a-modal
    v-model:visible="state.isShowResetPassWord"
    :title="state.resetPasswordTitle"
    :closable="state.closable"
    :footer="null"
    wrapClassName="reset-PassWord"
    :width="`${state.resetModalStyle.width}px`"
    :bodyStyle="{
      width: `${state.resetModalStyle.width}px`,
      height: `${state.resetModalStyle.height}px`,
      margin: '0',
      padding: '0',
      overflow: 'auto'
    }"
  >
    <div v-if="!state.isResetPasswordSuccessMark" class="reset-PassWord-tip">
      重置密码后不可恢复，请谨慎操作。
    </div>
    <div v-else>
      <div class="reset-Password-success">
        <img :src="successImg" alt="" class="success-img" />
        重置密码成功！
      </div>
      <div class="user-info1">
        <span>超管用户名：</span>
        <span>{{ state.resetPasswordSuccessInfo?.username }}</span>
      </div>
      <div class="user-info2">
        <span>新密码：</span>
        <span>{{ state.resetPasswordSuccessInfo?.password }}</span>
        <div class="copy-button" @click="copyText">复制</div>
      </div>
      <div class="user-info3">
        重置密码的信息已成功发送到负责人手机号{{
          state.resetPasswordSuccessInfo.mobile.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2')
        }}中，请注意查收!
      </div>
    </div>

    <!--  footer  -->
    <div v-if="!state.isResetPasswordSuccessMark" class="reset-PassWord-btn-content">
      <a-button type="primary" html-type="submit" @click="resetPasswordFN">确认</a-button>
      <a-button @click="closePasswordModal">取消</a-button>
    </div>
    <div class="close-btn-content" v-else>
      <a-button @click="closePasswordModal">关闭</a-button>
    </div>
  </a-modal>

  <!--  定制列  -->
  <CustomColumn
    v-if="state.isShowCustomColumnModal"
    @change-column="changeColumn"
    :allColumns="allColumns"
    :defaultKeys="state.defaultKeys"
    :changedColumnsObj="state.changedColumnsObj"
    :pageKey="PageKeyObj.organization"
  />

  <!--  上传图片预览  -->
  <a-modal
    :visible="previewVisible"
    :title="previewTitle"
    :footer="null"
    @cancel="handleCancel"
    :bodyStyle="{
      width: `100%`,
      height: `100%`,
      margin: '0',
      padding: '0',
      overflow: 'auto'
    }"
  >
    <img alt="example" style="width: 100%; height: 100%" :src="previewImage" />
  </a-modal>
</template>

<script lang="tsx" setup>
import * as MenuApi from '@/api/system/menu'
import { handleTree } from '@/utils/tree'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message, Upload } from 'ant-design-vue'
import type { UploadProps, UploadChangeParam } from 'ant-design-vue'
import { SystemMenuTypeEnum, PageKeyObj } from '@/utils/constants'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import {
  addMajorIndividual,
  addTenantPackage,
  editTenantPackage,
  getMajorIndividualDetails,
  getMajorIndividualList,
  getSimpleTenantList,
  getTenantPackage,
  putResetPassWord,
  updateEditMajorIndividual,
  updateEditMajorIndividualStatus
} from '@/api/system/business'
import { provincesMunicipalitiesArea } from './pr'
import { filterTree, getAllIds, reconstructedTreeData, getColumns } from '@/utils/utils'
import dayjs from 'dayjs'
import warningImg from '@/assets/imgs/system/warning.png'
import editImg from '@/assets/imgs/system/editImg.png'
import successImg from '@/assets/imgs/system/successImg.png'
import useClipboard from 'vue-clipboard3'
import { getAccessToken, getTenantId } from '@/utils/auth'
import CustomColumn from '@/components/CustomColumn/CustomColumn.vue'
import {
  addOrganization,
  getOrganizationDetails,
  getOrganizationList,
  getOrganizationTypeList,
  getSimpleOrganizationList,
  updateOrganization
} from '@/api/system/organization'

const { wsCache } = useCache()

const { toClipboard } = useClipboard()

interface FormState {
  id?: number
  name: string
  type: number
  parentId: number
  icon: string
  path: string
  sort: number
  status: number
  visible: boolean
  alwaysShow?: boolean
  component: string
  componentName: string
  permission: string
  keepAlive: boolean
}

const queryParams = reactive({
  current: 1, //当前页码
  pageSize: 10, //显示条数
  keyword: undefined, //机构名称
  organizationType: undefined, //机构类型
  status: undefined //状态
})

const queryFormRef = ref() // 搜索的表单

//路由地址校验规则
const routeValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      //目录必须以/开头
      if (state.formState.type === SystemMenuTypeEnum.DIR && !value.startsWith('/')) {
        reject('路由地址必须以/开头')
      } else if (state.formState.type === SystemMenuTypeEnum.MENU && value.startsWith('/')) {
        //菜单不能以/开头
        reject('路由地址不能以/开头')
      } else {
        resolve()
      }
    }
  })
}

//手机号码正则校验 -  简单校验没有全按国内的号码段来  -
const isValidPhoneNumber = (phoneNumber) => {
  const regExp = /^1[3456789]\d{9}$/
  return regExp.test(phoneNumber)
}

//邮箱正则校验
const isValidMail = (email) => {
  const regExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  return regExp.test(email)
}

//负责人电话校验
const contactMobileValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      if (!isValidPhoneNumber(value)) {
        reject('请输入正确的手机号码')
      } else {
        resolve()
      }
    }
    // else {
    //   reject('负责人电话不能为空')
    // }
  })
}

//负责人邮箱校验
const contactMailRulesValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      if (!isValidMail(value)) {
        reject('请输入正确的邮箱')
      } else {
        resolve()
      }
    } else {
      resolve()
      // reject('负责人电话不能为空')
    }
  })
}

//法人电话校验
const legalMobileValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      if (!isValidPhoneNumber(value)) {
        reject('请输入正确的手机号码')
      } else {
        resolve()
      }
    } else {
      resolve()
    }
  })
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
}

let updateUrl = import.meta.env.VITE_UPLOAD_URL
let regVersion = import.meta.env.VITE_REG_VERSION
const updateSupport = ref(0)
const uploadHeaders = ref({
  Authorization: 'Bearer ' + getAccessToken(),
  'tenant-id': getTenantId(),
  'Reg-Version': regVersion
})

const loading = ref<boolean>(false)
const imageUrl = ref<string>('')

const state = reactive({
  record: {}, //表格状态修改时存的整条数据 详细共用(修改)
  messageContactMobile: '18888888888', //短信验证手机号
  messageText: '为了保护您的机构公司业务数据安全，请通过安全验证：',
  canSendCode: true, //能否发送验证码
  codeCountdown: 60, //短信发送倒计时 s
  messageCode: '', //短信验证码
  messageBtnText: '确认开启', //消息modal 确认button 文字内容
  total: 0, //总条数
  statusOptions: [
    { value: 0, label: '正常' },
    { value: 1, label: '停用' }
  ], //状态 0 正常 1停用
  organizationTypeOptions: [], //机构类型列表
  loading: true, //表格加载中
  rawData: [], //表格数据 原始数据 未组树 主要用来过滤 判断父级状态是否开启
  tableDataList: [], //表格数据
  isExpandAll: false, //展开折叠
  refreshTable: true, //v-if table
  isFullScreen: false, //全屏
  isShow: false, //新增编辑modal
  isShowPermission: false, //功能配置modal
  isShowMessage: false, //短信modal
  isShowStatus: false, //表格状态改变 确认modal 确认后才开短信modal
  messageTitle: '提示', //短信modal title
  modalTitle: '新增', //modal title
  currentMenu: '目录',
  routerRules: [{ required: true }, { validator: routeValidator }],
  contactMobileRules: [{ validator: contactMobileValidator }],
  contactMailRules: [{ validator: contactMailRulesValidator }],
  legalMobileRules: [{ validator: legalMobileValidator }],
  modalType: 'add', //add新增edit编辑
  proMunAreaList: [], //省市区数据
  formState: {
    parentId: 0, //上级机构ID
    organizationType: undefined, //机构类型
    name: '', //机构名称
    code: '', //机构编码
    abbreviate: '', //机构简称
    contactName: '', //负责人
    contactMobile: '', //负责人电话
    contactMail: '', //负责人邮箱
    sort: 0, //排序
    status: true //状态
  }, //新增表单
  addSuccessId: undefined, //创建机构成功ID 主要是用于创建机构后配置权限
  activeKey: 'backstage', // tabsKey frontDesk前台 backstage后台
  selectAll: false, //权限配置 全选
  isExpandAllTab: false, //权限配置 展开折叠
  menuTreeList: [], //权限配置 前台列表
  fieldNames: { children: 'children', title: 'name', key: 'id' }, //权限配置 前台列表 tree的对应字段替换
  selectedKeys: [], //权限配置 前台列表 设置选中的树节点
  checkedKeys: [], //权限配置 前台列表 选中复选框的树节点
  parentCheckedKeys: [], //权限配置 前台列表 所有一级菜单ID 用于 全选全不选
  defaultExpandAll: false, //权限配置 前台列表 默认展开折叠
  isShowTree: false, //权限配置 前台列表 v-if 主要是配合用来 展开折叠的
  idArr: [], //权限配置 创建所需的 id
  selectTree: [], //权限配置 选中的树 数据 右侧
  isShowRightTree: false, //权限配置 选中的树 是否显示
  permissionRecord: {}, //权限配置 操作 时 存的整条数据
  PermissionType: 'add', //权限配置 新增 修改
  editPermissionID: undefined, //编辑功能配置时的id
  isShowDetails: false, //详细modal
  detailsInfo: [], //详情内容
  isShowResetPassWord: false, //重置密码提示modal
  resetPasswordTitle: '', //重置密码 modal title
  resetPasswordSuccessInfo: {}, //重置密码成功后
  closable: false, //重置密码 modal 右上角×
  isResetPasswordSuccessMark: false,
  resetModalStyle: {
    width: 488,
    height: 270
  }, //重置密码 modal样式
  isShowCustomColumnModal: false, //是否打开定制列modal
  columns: [], //表格 columns
  optionalMenuTree: [], //上级机构 treeList
  logoListUrl: [], //系统logo 上传 回显 - -
  logoUrlSuccess: '', //系统logo 新增编辑入参
  legalPersonListUrl: [], //法人身份证 上传回显
  legalPersonUrlSuccess: '', //法人身份证 新增编辑入参
  businessLicenseListUrl: [], //营业执照 上传回显
  businessLicenseSuccess: '', //营业执照 新增编辑入参
  addEditLoading: false, //新增编辑 modal button 异步loading
  tableStatusChangeInfo: {}, //存当前表格item项以及switch值
  tableStatusModalInfo: {}, //存当前表格item项 modal
  defaultKeys: [
    'name',
    'code',
    'contactName',
    'employeesNumber',
    'organizationType',
    'sort',
    'statusSwitch',
    'operation'
  ], //定制列默认的keys
  changedColumnsObj: {} //定制列组件接收到的当前列信息
})

const getOrganizationTypeListFN = async () => {
  const res = await getOrganizationTypeList()
  state.organizationTypeOptions = res.filter((item) => item.dictType === 'organization_type')
  // console.log('全部字典', res)
  console.log('机构类型', state.organizationTypeOptions)
}
//获取机构类型
getOrganizationTypeListFN()

//存放功能配置 选中的所有keys(包括父节点id)
const checkedKeysBack = ref([])

//获取子节点的 父节点id
const testCheck = (checkedKeys, e) => {
  //存放功能配置 选中的所有keys(包括父节点id)
  checkedKeysBack.value = checkedKeys.concat(e.halfCheckedKeys)
}

//ALL columns 用于定制列过滤 排序
const allColumns = [
  {
    title: '机构名称',
    width: 200,
    dataIndex: 'name',
    key: 'name',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 1
  },
  {
    title: '机构编码',
    width: 100,
    dataIndex: 'code',
    key: 'code',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 2
  },
  {
    title: '负责人',
    width: 100,
    dataIndex: 'contactName',
    key: 'contactName',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 3
  },
  {
    title: '员工数',
    width: 100,
    dataIndex: 'employeesNumber',
    key: 'employeesNumber',
    ellipsis: true,
    sort: 4
  },
  {
    title: '机构类型',
    width: 100,
    dataIndex: 'organizationType',
    key: 'organizationType',
    resizable: true,
    ellipsis: true,
    sort: 5
  },
  {
    title: '排序',
    width: 100,
    dataIndex: 'sort',
    key: 'sort',
    resizable: true,
    ellipsis: true,
    sort: 6
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'statusSwitch',
    key: 'statusSwitch',
    resizable: true,
    ellipsis: true,
    sort: 7
  },

  //
  // {
  //   title: '负责人',
  //   width: 100,
  //   dataIndex: 'contactName',
  //   key: 'contactName',
  //   resizable: true,
  //   ellipsis: true,
  //   sort: 7
  // },
  // {
  //   title: '负责人电话',
  //   width: 100,
  //   dataIndex: 'contactMobile',
  //   key: 'contactMobile',
  //   resizable: true,
  //   ellipsis: true,
  //   sort: 8
  // },

  {
    title: '创建人',
    dataIndex: 'creator',
    width: 100,
    key: 'creator',
    resizable: true,
    ellipsis: true,
    sort: 8
  },
  {
    title: '创建时间',
    width: 100,
    dataIndex: 'createTime',
    key: 'createTime',
    resizable: true,
    ellipsis: true,
    sort: 9
  },
  {
    title: '最近操作人',
    width: 100,
    dataIndex: 'updater',
    key: 'updater',
    resizable: true,
    ellipsis: true,
    sort: 10
  },
  {
    title: '最近操作时间',
    width: 100,
    dataIndex: 'updateTime',
    key: 'updateTime',
    resizable: true,
    ellipsis: true,
    sort: 11
  },

  {
    title: '操作',
    width: 240,
    dataIndex: 'operation',
    key: 'operation',
    resizable: true,
    ellipsis: true,
    sort: 12
  }
]

/** 查询列表 */
const getList = async () => {
  state.loading = true
  const params = {
    // pageNo: queryParams.current,
    // pageSize: queryParams.pageSize,
    keyword: queryParams.keyword,
    organizationType: queryParams.organizationType,
    status: queryParams.status
  }

  // if (queryParams?.startEndTime[0] && queryParams?.startEndTime[1]) {
  //   params['localDates'] = [
  //     queryParams.startEndTime[0]?.format('YYYY-MM-DD'),
  //     queryParams.startEndTime[1]?.format('YYYY-MM-DD')
  //     // queryParams.startEndTime[0]?.format('YYYY/MM/DD'),
  //     // queryParams.startEndTime[1]?.format('YYYY/MM/DD')
  //   ]
  // }

  try {
    // const res = await getMajorIndividualList(params)
    const res = await getOrganizationList(params)
    console.log('机构列表res', res)
    state.rawData = res
    state.tableDataList = res
    state.tableDataList.map((item) => {
      item.statusSwitch = item.status === 0
      item.employeesNumber = item.staffCount
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
    })

    state.tableDataList = handleTree(state.tableDataList, 'id', 'parentId', 'children')

    state.total = res.total
  } finally {
    state.loading = false
  }

  //获取菜单列表
  const menuList = await MenuApi.getSimpleMenusList()
  //不要展示按钮 默认按钮全选 后端处理
  const tempArr = menuList.filter((item) => item.type !== 3)
  state.menuTreeList = handleTree(tempArr)

  // state.menuTreeList = handleTree(await MenuApi.getSimpleMenusList())
  state.parentCheckedKeys = []
  state.menuTreeList.map((item) => {
    state.parentCheckedKeys.push(item.id)
  })
  // state.defaultExpandAll = true
  await nextTick(() => {
    state.isShowTree = true
  })
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

getList()

//一键 展开 折叠 全部
const toggleExpandAll = () => {
  //由于antdV只提供了初始化时默认展开全部的 API 因此 此处利用v-if 来实现重新初始化
  state.refreshTable = false
  state.isExpandAll = !state.isExpandAll
  nextTick(() => {
    state.refreshTable = true
  })
}

//全屏/退出
const fullScreen = () => {
  const elem = document.getElementById('card-content')

  if (state.isFullScreen === false) {
    if (elem?.requestFullscreen) {
      elem?.requestFullscreen()
      state.isFullScreen = !state.isFullScreen
    }
  } else {
    document.exitFullscreen()
    state.isFullScreen = !state.isFullScreen
  }
}

//打开Modal
const openModal = async (record = {}) => {
  console.log('record', record)
  if (!(Object.keys(record).length === 0)) {
    //非空对象判断 新增子项时回显
    state.formState.parentId = record.id
  }
  const res = await getSimpleOrganizationList()
  console.log('上级机构', res)

  let menuTree = []
  // let menu = {}
  let menu: Tree = { id: 0, name: '顶层机构', children: [] }
  menu.children = handleTree(res, 'id', 'parentId', 'children')
  menuTree.push(menu)
  // const menuTree = handleTree(res, 'id', 'parentId', 'children')
  console.log('menuTree', menuTree)

  state.optionalMenuTree = menuTree

  state.isShow = true
}
//关闭Modal
const closeModal = () => {
  state.isShow = false
  formRef.value.resetFields()
  //级联选择器 需要单独清空
  state.formState.companyAddress = []
  state.formState = {
    parentId: 0, //上级机构ID
    organizationType: undefined, //机构类型
    name: '', //机构名称
    code: '', //机构编码
    abbreviate: '', //机构简称
    contactName: '', //负责人
    contactMobile: '', //负责人电话
    contactMail: '', //负责人邮箱
    sort: 0, //排序
    status: true //状态
  }
  delete state.formState?.id
  state.modalTitle = '新增'
  state.modalType = 'add'
}

/** 添加/修改操作 */
const formRef = ref()

/** 获取下拉框[上级菜单]的数据  */
const menuTree = ref<Tree[]>([]) // 树形结构
const getTree = async () => {
  menuTree.value = []
  const res = await MenuApi.getSimpleMenusList()
  let menu: Tree = { id: 0, name: '主类目', children: [] }
  menu.children = handleTree(res)
  menuTree.value.push(menu)
}
getTree()

//编辑
const edit = async (record, isCloseDetails = false) => {
  console.log('编辑record', record)
  if (isCloseDetails) {
    //关闭详情moal
    state.isShowDetails = false
  }
  //获取机构详情
  const res = await getOrganizationDetails({ id: record.id })
  console.log('机构详情', res)
  //菜单状态 0开启 1关闭
  // record.statusSwitch = record.status === 0
  record.status = record.status === 0

  state.modalType = 'edit'
  state.modalTitle = '编辑'
  //赋值 回显
  state.formState = {
    id: record.id,
    parentId: res.parentId, //上级机构ID
    organizationType: res.organizationType, //机构类型
    name: res.name, //机构名称
    code: res.code, //机构编码
    abbreviate: res.abbreviate, //机构简称
    contactName: res.contactName, //负责人
    contactMobile: res.contactMobile, //负责人电话
    contactMail: res.contactMail, //负责人邮箱
    sort: res.sort, //排序
    status: res.status //状态
  }

  //状态0 开启 1关闭
  state.formState.status = record.status === 0

  openModal()
}

//页码改变
const onChange = ({ pageSize, current }) => {
  queryParams.current = current
  queryParams.pageSize = pageSize
  getList()
}

//处理省市区数据
// 树结构数据过滤 数组中嵌数组 里面的数组为需要替换的属性名以及替换后的属性名
let needReplaceKey = [
  ['label', 'fullname'],
  ['value', 'code']
]
state.proMunAreaList = reconstructedTreeData(provincesMunicipalitiesArea, needReplaceKey)

//新增机构
const addMajorIndividualFN = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  state.addEditLoading = true
  let params = {
    parentId: state.formState.parentId, //上级机构
    organizationType: state.formState.organizationType, //机构类型
    name: state.formState.name, //机构名称
    code: state.formState.code, //机构编码
    abbreviate: state.formState.abbreviate, //机构简称
    contactName: state.formState.contactName, //负责人
    contactMobile: state.formState.contactMobile, //负责人电话
    contactMail: state.formState.contactMail, //负责人邮箱
    sort: state.formState.sort, //排序
    status: state.formState.status //状态
  }

  //状态0 开启 1关闭
  if (state.formState.status) {
    params['status'] = 0
  } else {
    params['status'] = 1
  }

  try {
    let res = []
    if (state.modalType === 'add') {
      res = await addOrganization(params)
      state.addSuccessId = res
      message.success('新增成功')
      // 配置权限
      // openPermissionModal()
    } else {
      params['id'] = state.formState.id
      res = await updateOrganization(params)
      message.success('编辑成功')
    }

    closeModal()
    await getList()
  } finally {
    state.addEditLoading = false
  }
}

//级联选择器选中的内容 改变
const cascadeChange = (value, selectedOptions) => {
  state.formState.cascadeInfo = selectedOptions
}

//关闭功能配置 modal
const closePermissionModal = () => {
  state.isShowPermission = false
  state.PermissionType = 'add'
  state.addSuccessId = undefined
  state.selectTree = []
  state.checkedKeys = []
}

//开启功能配置 modal
const openPermissionModal = async () => {
  state.isShowPermission = true
  // //获取菜单列表
  // state.menuTreeList = handleTree(await MenuApi.getSimpleMenusList())
  //获取菜单列表
  const menuList = await MenuApi.getSimpleMenusList()
  //不要展示按钮 默认按钮全选 后端处理
  const tempArr = menuList.filter((item) => item.type !== 3)
  state.menuTreeList = handleTree(tempArr)
}

//功能配置 Modal 确认
const PermissionOk = async () => {
  const params = {
    menuIds: state.idArr,
    tenantId: state.addSuccessId || state.permissionRecord.id, //机构id,新增权限模板从新增机构的res里取，修改时取当前列
    status: 0
  }
  if (state.PermissionType === 'add') {
    await addTenantPackage(params)
    message.success('新增成功')
  } else {
    params['id'] = state.editPermissionID
    await editTenantPackage(params)
    message.success('编辑成功')
  }
  await getList()
  closePermissionModal()
}

const assignPermission = async (record) => {
  state.permissionRecord = record
  state.PermissionType = 'edit'
  if (record.packageId) {
    const res = await getTenantPackage({ id: record.packageId })
    //... res 可能为null
    const { menuIds = [], id } = res || []
    state.editPermissionID = id
    state.checkedKeys = menuIds
    state.selectTree = filterTree(state.menuTreeList, menuIds)
  }
  //右侧展开显示 左侧选中的数据
  state.isShowRightTree = false
  nextTick(() => {
    state.isShowRightTree = true
  })
  await openPermissionModal()
}

//表格状态改变 确认modal... 然后才开短信 modal
//打开 状态开始关闭 确认modal
const openStatusModal = () => {
  state.isShowStatus = true
}
//关闭 状态开始关闭 确认modal
const closeStatusModal = () => {
  state.isShowStatus = false
  //直接这里补一次请求吧 - -
  if (state.isShowMessage === false) {
    //关闭 表格状态开启关闭 确认 modal时
    getList()
  }
}

//表格状态开关
const setTableStatusChangeInfo = (value, record) => {
  state.tableStatusChangeInfo = {
    value,
    record
  }

  if (value) {
    state.tableStatusChangeInfo['statusBtnText'] = '确认开启'
    state.tableStatusChangeInfo['statusTopText'] = `开启后`
    state.tableStatusChangeInfo['statusText'] = `开启`
  } else {
    state.tableStatusChangeInfo['statusBtnText'] = '确认关闭'
    state.tableStatusChangeInfo['statusTopText'] = `关闭后`
    state.tableStatusChangeInfo['statusText'] = `关闭`
  }

  //过滤得到父级项
  const parentItem = state.rawData.filter((item) => item.id === record.belongTenantId)
  if (parentItem.length > 0 && parentItem[0]?.status === 1) {
    record.statusSwitch = !record.statusSwitch
    return message.warning('请先开启父级状态')
  }

  openStatusModal()
}
//表格状态开关
const tableStatusChange = (value, record) => {
  if (value) {
    state.messageBtnText = '确认开启'
    state.messageText = '为了保护您的机构公司业务数据安全，请通过安全验证：'
  } else {
    state.messageBtnText = '确认关闭'
    state.messageText =
      '因您的机构公司还存在业务数据，如关闭则严重影响到业务，为了保护您的机构公司业务数据安全，请通过安全验证：'
  }
  state.isShowMessage = true
  state.messageContactMobile = record.contactMobile
  state.record = record
}

//表格状态开关modal 确认
const tableStatusConfirm = () => {
  tableStatusChange(state.tableStatusChangeInfo?.value, state.tableStatusChangeInfo?.record)
  closeStatusModal()
}

//发送短信验证码
const senCodeFN = () => {
  //TODO:发送短信请求
  if (true) {
    message.success(
      `验证码已发送至${state.messageContactMobile.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2')}`
    )
  }
  state.canSendCode = false
  let codeIn = setInterval(() => {
    state.codeCountdown -= 1
    if (state.codeCountdown === 0) {
      state.canSendCode = true
      state.codeCountdown = 60
      clearInterval(codeIn)
    }
  }, 1000)
}

//短信 modal 取消
const statusCancel = () => {
  state.isShowMessage = false
  state.record = {}
  state.messageContactMobile = '18888888888' //短信验证手机号
  state.messageText = '为了保护您的机构公司业务数据安全，请通过安全验证：'
  state.canSendCode = true //能否发送验证码
  state.codeCountdown = 60 //短信发送倒计时 s
  state.messageCode = '' //短信验证码
  //直接这里补一次请求吧 - -
  getList()
}
//短信 modal 确认
const statusOk = async () => {
  if (!state.messageCode) {
    message.warning('请输入短信验证码')
    return
  }

  const params = {
    id: state.record.id,
    code: state.messageCode,
    status: state.record.statusSwitch === true ? 0 : 1
  }

  try {
    await updateEditMajorIndividualStatus(params)
    message.success('修改状态成功')
    statusCancel()
  } finally {
  }
}

//功能配置 前台 全选全不选
const selectAll = ({ target }) => {
  if (target.checked) {
    //全选
    // state.checkedKeys = state.parentCheckedKeys
    state.checkedKeys = getAllIds(state.menuTreeList)
  } else {
    //全不选
    state.checkedKeys = []
    checkedKeysBack.value = []
  }
}
//功能配置 前台 展开折叠
const expandAllFN = ({ target }) => {
  if (target.checked) {
    state.isShowTree = false
    state.defaultExpandAll = true
    nextTick(() => {
      state.isShowTree = true
    })
  } else {
    state.isShowTree = false
    state.defaultExpandAll = false
    nextTick(() => {
      state.isShowTree = true
    })
  }
}

// 定义childArr存放所有子节点
const childArr = ref([])
// 遍历获取所有子节点
function getChildArr(data) {
  data.forEach((res) => {
    if (res.children && res.children.length > 0) {
      getChildArr(res.children)
    } else {
      childArr.value.push(res.id)
    }
  })
  return childArr.value
}

//详情(打开)
const detailsInfo = async (record) => {
  // state.record = record
  //获取机构详情
  const res = await getMajorIndividualDetails({ id: record.id })
  //不要展示按钮 默认按钮全选 后端处理
  const tempArr = res.menus?.filter((item) => item.type !== 3)

  state.record = res

  let companyAddress = ''
  if (res?.province) {
    companyAddress = res?.province + res?.city + res?.county + res?.address
  }

  const tempRes = await getSimpleTenantList()
  const tempItem = tempRes.filter((item) => item.id === record.belongTenantId)

  state.detailsInfo = [
    {
      baseTitle: '基本信息',
      infoArr: [
        {
          textSpan: '上级机构：',
          text: tempItem[0]?.name
        },
        {
          textSpan: '机构名称：',
          text: res.name
        },
        {
          textSpan: '机构编码：',
          text: res.code
        },
        {
          textSpan: '机构简称：',
          text: res.abbreviate
        },
        {
          textSpan: '系统名称：',
          text: res.systemName
        },
        {
          textSpan: '系统logo：',
          text: '暂无上传图片',
          imgUrl: res.logoUrl
        },
        {
          textSpan: '负责人：',
          text: res.contactName
        },
        {
          textSpan: '负责人电话：',
          text: res.contactMobile
        },
        {
          textSpan: '有效期：',
          text:
            res.expireTime === '2099-12-31'
              ? '永久有效'
              : `${res.effectiveStartDate}-${res.expireTime}`
        },
        {
          textSpan: '绑定域名：',
          text: res.domain
        },
        {
          textSpan: '状态：',
          text: res.status === 0 ? '开启' : '关闭'
        }
      ]
    },
    {
      baseTitle: '账户信息',
      infoArr: [
        {
          textSpan: '超级管理员：',
          text: res.username,
          isSuperAdmin: true
        }
      ]
    },
    {
      baseTitle: '详细信息',
      infoArr: [
        {
          textSpan: '统一社会信用代码：',
          text: res.creditCode
        },
        {
          textSpan: '组织机构代码：',
          text: res.organizationCode
        },
        {
          textSpan: '法定代表人：',
          text: res.legalRepresentative
        },
        {
          textSpan: '法人联系电话：',
          text: res.legalMobile
        },
        {
          textSpan: '法人身份证：',
          text: '暂无上传图片',
          imgUrl: res.legalIdentityUrl
        },
        {
          textSpan: '成立日期：',
          text: res.establishDate
        },
        {
          textSpan: '公司地址：',
          text: companyAddress
        },
        {
          textSpan: '营业执照：',
          text: '暂无上传图片',
          imgUrl: res.businessLicenseUrl
        }
      ]
    },
    {
      baseTitle: '配置权限',
      treeArr: handleTree(tempArr)
    }
  ]

  state.isShowDetails = true
}

//关闭 重置密码modal
const closePasswordModal = () => {
  state.isShowResetPassWord = false
  state.isResetPasswordSuccessMark = false
  state.resetPasswordTitle = '提示'
  setTimeout(() => {
    //延迟一下 - - 不然会导致 关闭的瞬间样式改变了 闪一下
    state.resetModalStyle = {
      width: 488,
      height: 270
    }
  }, 200)
}

//重置密码
const resetPassword = () => {
  state.isShowResetPassWord = true
  state.resetPasswordTitle = '提示'
  state.closable = true
  state.resetModalStyle = {
    width: 424,
    height: 138
  }
}
//重置密码 请求
const resetPasswordFN = async () => {
  state.resetPasswordSuccessInfo = await putResetPassWord({ id: state.record.contactUserId })
  state.resetPasswordTitle = ''
  state.closable = false
  state.resetModalStyle = {
    width: 488,
    height: 270
  }
  state.isResetPasswordSuccessMark = true
}

//复制密码
const copyText = async () => {
  try {
    await toClipboard(state.resetPasswordSuccessInfo.password) //实现复制
    message.success('复制成功')
  } catch (e) {
    message.error('复制失败，您使用的浏览器可能不支持复制功能')
  }
}

//上传图片转base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')
// const fileList = ref([
//   {
//     url: 'https://wcl.shenghuoduo.com:10102/v2/wclpro/local/files/2023/05/04/67129b133a5d4c8b9ed555e09775fba8.png'
//   }
// ])
//上传的 预览 关闭modal
const handleCancel = () => {
  previewVisible.value = false
  previewTitle.value = ''
}
//上传图片预览
const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}

//判断上传图片的宽高
const checkImageWH = (file, width, height) => {
  return new Promise((resolve, reject) => {
    let filereader = new FileReader()
    let isTrue = false
    filereader.onload = (e) => {
      let src = e.target.result
      const image = new Image()
      image.onload = function () {
        if (width && this.width > width) {
          message.error('请上传宽小于' + width + 'px的图片')
          resolve(false)
          // reject(false)
        } else if (height && this.height > height) {
          message.error('请上传高小于' + height + 'px的图片')
          resolve(false)
          // reject(false)
        } else {
          resolve(true)
          // resolve(true)
        }
      }
      image.onerror = reject
      image.src = src
    }
    filereader.readAsDataURL(file)
  })
}
//上传前
const beforeUpload = async (file: UploadProps['beforeUpload'][number], fileList, type) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('仅支持jpg/png格式')
    return Upload.LIST_IGNORE
  }
  switch (type) {
    case 'logo':
      const isTrue = await checkImageWH(file, 400, 400)
      if (!isTrue) {
        //不上传 包括前端不显示
        return Upload.LIST_IGNORE
      }

      const isLt30kb = file.size / 1024 / 1024 < 0.3
      //max 300kb
      if (!isLt30kb) {
        message.error('图片不能超过300kb')
        return Upload.LIST_IGNORE
      }
      break
  }

  // const isLt2M = file.size / 1024 / 1024 < 2
  // if (!isLt2M) {
  //   message.error('Image must smaller than 2MB!')
  // }
  // return isJpgOrPng && isLt30kb
}

//上传 change
const handleChange = (info: UploadChangeParam, fileList, type) => {
  if (info.file.status === 'uploading') {
    loading.value = true
    return
  }
  if (info.file.status === 'done') {
    switch (type) {
      case 'logo':
        if (!info?.file.response?.data) {
          message.error(info?.file.response?.msg)
          state.logoListUrl = []
          return
        }
        state.logoUrlSuccess = info?.file.response?.data?.store || ''
        break
      case 'legalPerson':
        if (!info?.file.response?.data) {
          message.error(info?.file.response?.msg)
          state.legalPersonListUrl = []
          return
        }
        state.legalPersonUrlSuccess = info?.file.response?.data?.store || ''
        break
      case 'businessLicense':
        if (!info?.file.response?.data) {
          message.error(info?.file.response?.msg)
          state.businessLicenseListUrl = []
          return
        }
        state.businessLicenseSuccess = info?.file.response?.data?.store || ''
        break
    }

    // Get this url from response in real world.
    getBase64(info.file.originFileObj, (base64Url: string) => {
      imageUrl.value = base64Url
      loading.value = false
    })
    message.success('上传成功')
  }
  if (info.file.status === 'error') {
    loading.value = false
    message.error('上传失败')
  }
}

//删除上传的图片 回调  - -
const removeImg = (file, type) => {
  switch (type) {
    case 'logo':
      //系统logo
      state.logoListUrl = [] //系统logo 上传 回显 - -
      state.logoUrlSuccess = '' //系统logo 新增编辑入参
      break
    case 'legalPerson':
      //法人身份证
      state.legalPersonListUrl = [] //法人身份证 上传回显
      state.legalPersonUrlSuccess = '' //法人身份证 新增编辑入参
      break
    case 'businessLicense':
      //营业执照
      state.businessLicenseListUrl = [] //营业执照 上传回显
      state.businessLicenseSuccess = '' //营业执照 新增编辑入参
      break
  }
}

// //永久有效 取消勾选清空 日期选择器值
// const foreverChange = (e) => {
//   console.log('e', e)
//   if (e.target.checked === false) {
//     state.formState.effectiveStartEndTime = []
//   }
// }

//table 列伸缩
const handleResizeColumn = (w, col) => {
  col.width = w
}

//详情modal 预览图片
const setPreviewImage = (imgUrl = '') => {
  previewImage.value = imgUrl
  previewTitle.value = '预览'
  previewVisible.value = true
}

//接收 定制列modal事件  - -关闭modal也一起吧 - -
const changeColumn = (columnsObj, isCloseModal = false) => {
  if (isCloseModal) {
    state.isShowCustomColumnModal = false
    return
  }
  state.columns = columnsObj.currentColumns
  state.changedColumnsObj = columnsObj
  state.refreshTable = false
  state.refreshTable = true
}
//
// //TODO:这个方法有空再抽出去
// //获取默认的columns
// const getColumns = () => {
//   //organization 为当前存储的页面
//   const columnsObj = wsCache.get(CACHE_KEY.TABLE_COLUMNS_OBJ) || {}
//   //有缓存 取缓存
//   if (columnsObj[PageKeyObj.organization]) {
//     state.changedColumnsObj = columnsObj[PageKeyObj.organization]
//     return columnsObj[PageKeyObj.organization].currentColumns
//   }
//   const currentColumns = allColumns.filter((columnsItem) => {
//     return state.defaultKeys.some((item) => columnsItem.key === item)
//   })
//   return currentColumns
// }
// // //初始化 获取默认的 columns
// // state.columns = getColumns()

//初始化 获取默认的 columns
state.columns = getColumns(state, PageKeyObj.organization, allColumns, state.defaultKeys)

//监听  左侧选中数据  更新 右侧展示数据
watch(
  () => [state.checkedKeys, checkedKeysBack.value],
  () => {
    state.idArr = [...new Set(checkedKeysBack.value.concat(state.checkedKeys))]
    state.selectTree = filterTree(state.menuTreeList, state.idArr)
    state.isShowRightTree = false
    //右侧展开显示 左侧选中的数据
    nextTick(() => {
      state.isShowRightTree = true
    })
  }
)
</script>

<style lang="scss" scoped>
.content {
  width: 100px;
  height: 100px;
  background: skyblue;
}

//新增  导出 button
.card-content {
  min-width: 1650px;
  height: 62px;
  //background: skyblue;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

//button
:deep(.ant-btn) {
  margin-right: 10px;
  //min-width: 42px;
  //height: 32px;
  //padding: 6px 13px;
}

//antd card
:deep(.ant-card-body) {
  padding: 0;
  max-height: 870px;
}

.operation-content {
  display: flex;
  align-items: center;
}

//表格
:deep(.ant-table-wrapper) {
  padding: 0 15px;
}
//名称
.name-content {
  display: flex;
}
// 可用名额 操作 颜色
.text-color {
  color: rgba(0, 129, 255, 100);
}
:deep(.ant-table-cell-with-append) {
  display: flex;
}

.base_info_content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
//上传
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.flex-content {
  display: flex;
  align-items: center;
}

.margin-right-5 {
  margin-right: 5px;
  cursor: pointer;
}

//功能配置弹窗
.per-content {
  height: 680px;
  padding: 20px 20px 23px 20px;
}

.text-content {
  height: 20px;
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  text-align: left;
  font-family: PingFangSC-Regular;
  display: flex;
  flex-direction: column;
}

.select-content {
  width: 625px;
  display: flex;
  justify-content: space-between;
}
//配置权限左侧
.left-content {
  width: 290px;
  height: 620px;
  border: 1px solid rgb(234, 235, 239);
  //background: skyblue;
}

//配置权限右侧
.right-content {
  width: 290px;
  height: 620px;
  //background: red;
}

//表格状态改变 modal
.status-content {
  display: flex;
  margin-right: 30px;
}

.status-text-content {
  //margin-left: 15px;
  color: rgba(102, 102, 102, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
}
.status-text {
  margin-left: 32px;
  display: flex;
  align-items: center;
  color: rgba(51, 51, 51, 1);
  font-size: 16px;
  font-weight: bold;
  font-family: PingFangSC-Medium;
}
.status-text-info {
  margin-left: 68px;
  margin-top: 12px;
  height: 40px;
  color: rgba(102, 102, 102, 1);
  font-size: 14px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
.status-span {
  color: red;
}

//短信 modal
.message-content {
  display: flex;
}
.message-text-content {
  width: 520px;
  //margin-left: 15px;
}
.message-img {
  margin-top: 3px;
}
.message-text {
  margin-left: 20px;
  display: flex;
  //align-items: center;
  //margin-right: 40px;
  color: rgba(51, 51, 51, 1);
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  font-family: PingFangSC-Medium;
}
.message-phone {
  margin: 12px 0 0 56px;
}
.message-input-content {
  //padding-left: 76px;
  margin: 26px 0 0 132px;
  display: flex;
  align-items: center;
}
//发送验证码 btn
.send-code-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 94px;
  height: 32px;
  margin-left: 8px;
  border-radius: 4px;
  color: rgb(0, 129, 255);
  background-color: rgba(237, 244, 251);
  cursor: pointer;
}
//重新获取验证码
.countdown-code-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 106px;
  height: 32px;
  margin-left: 19px;
  border-radius: 4px;
  color: rgba(0, 129, 255, 0.61);
  background-color: rgb(237, 244, 251);
}
//权限配置前台底下搜索
.tab-search-content {
  height: 40px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  //background: skyblue;
  border-bottom: 1px solid rgb(234, 235, 239);
}

//详情
.title-content {
  display: flex;
  align-items: center;
  color: rgba(51, 51, 51, 1);
  font-size: 16px;
  font-weight: bold;
  font-family: PingFangSC-Medium;
}
.details-content {
  display: flex;
  flex-direction: column;
}
.info-content,
.details-modal-content {
  flex: 1;
}
//详情修改文字
.details-edit {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: rgba(0, 129, 255, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  cursor: pointer;
  .edit-Img {
    width: 8.65px;
    height: 8.81px;
    margin-right: 8px;
  }
}
//蓝色竖线
.blue-line {
  width: 3px;
  height: 14px;
  margin: 3px;
  background-color: rgba(0, 129, 255, 1);
}
.info-content {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.text-style {
  span {
    font-weight: bold;
    font-family: PingFangSC-Medium;
  }
  width: 50%;
  display: block;
  display: flex;
  margin-top: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  padding-left: 26px;
  font-family: PingFangSC-Regular;
}
.super-admin-style {
  display: flex;
  align-items: center;
}

//提示弹窗 img
.tip-img {
  width: 20px;
  height: 20px;
  margin-right: 16px;
}
//详情img
.details-img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.details-modal-content {
  padding: 15px 0 0 26px;
}

.details-heard {
  width: 100%;
  height: 40px;
  padding-left: 18px;
  display: flex;
  align-items: center;
  background-color: rgba(246, 246, 246, 1);
}

//详情 权限配置 左侧 前台
.details-modal-left {
  width: 290px;
  min-height: 300px;
  border: 1px solid rgb(234, 235, 239);
  //background: slateblue;
}

//重置密码成功
.reset-Password-success {
  padding: 43px 0 0 165px;
  display: flex;
  align-items: center;
}
.success-img {
  margin-right: 8px;
  width: 24px;
  height: 24px;
}
.user-info1 {
  padding: 28px 0 0 139px;
}
.user-info2 {
  padding: 9px 0 0 167px;
  display: flex;
}
.copy-button {
  width: 52px;
  height: 24px;
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 1);
  border-radius: 4px;
  background-color: rgba(0, 129, 255, 1);
}
.user-info3 {
  margin: 19px 0 0 50px;
  //width: 388px;
  height: 17px;
  color: rgba(231, 162, 60, 1);
  font-size: 12px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
.close-btn-content {
  margin-top: 37px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reset-PassWord-tip {
  margin-left: 20px;
}

.reset-PassWord-btn-content {
  margin: 56px 0 0 249px;
}

//拖拽动画
.flip-list-move {
  transition: transform 0.5s;
}

//定制列 checkbox
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0;
}

//新增修改 modal 负责人电话 底下 文字
.phone-text {
  color: rgba(231, 162, 60, 1);
  font-size: 12px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
//新增修改 modal 上传 底下文字
.upload-text {
  color: rgba(153, 153, 153, 1);
  font-size: 12px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
//新增 等按钮内 icon
.btn-icon {
  margin-right: 4px;
  cursor: pointer;
}
//新增修改 modal 系统名称- - width
.flex-content {
  width: 374px;
}
.icon-tip {
  margin-left: 8px;
}
.adress-content {
  width: 470px;
}
.adress-input {
  width: 530px;
}
</style>

<style lang="scss">
//修改 详细 modal位置
.details-modal {
  .ant-modal {
    max-width: 100%;
    position: absolute;
    top: 0;
    left: initial;
    right: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
//重置密码 modal
.reset-PassWord {
  .ant-modal-header,
  .ant-modal-footer {
    border: 0;
  }
}

//新增 编辑 modal
.add-edit-modal {
  //日期选择器清除icon 应该是被全局哪里影响到了
  .ant-picker-clear {
    background-color: transparent !important;
  }
  //级联选择器 清除icon 应该是被全局哪里影响到了
  .ant-select-clear {
    display: flex !important;
  }
  //新增修改表单
  .ant-form-item {
    margin-bottom: 14px;
  }
  //可用名额
  .ant-input-number {
    width: 200px;
  }
}
</style>
