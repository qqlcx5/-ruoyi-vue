<!--  菜单管理  -->
<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <a-form :model="queryParams" ref="queryFormRef" layout="inline">
      <a-form-item :label="`菜单名称`" name="name">
        <a-input v-model:value="queryParams.name" placeholder="请输入菜单名称" />
      </a-form-item>
      <a-form-item :label="`菜单类型`" name="type">
        <a-select
          v-model:value="queryParams.type"
          placeholder="请选择菜单类型"
          style="width: 200px"
          :options="getIntDictOptions(DICT_TYPE.SYSTEM_MENU_TYPE)"
        />
      </a-form-item>
      <a-form-item :label="`状态`" name="status">
        <a-select
          v-model:value="queryParams.status"
          placeholder="请选择菜单状态"
          style="width: 200px"
          :options="getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
        />
      </a-form-item>
      <!-- TODO:权限-->
      <a-button type="primary" html-type="submit" @click="getList">查询</a-button>
      <a-button @click="resetQuery">重置</a-button>
    </a-form>
  </ContentWrap>

  <!--  表格  -->
  <a-card :bordered="false" style="width: 1650px" id="card-content">
    <!--  <ContentWrap>-->
    <!--    <a-button type="primary" @click="toggleExpandAll" v-hasPermi="['system:menu:create']">-->
    <!--      <Icon icon="ep:plus" class="mr-5px" color="#fff" /> 新增新增</a-button-->
    <!--    >-->

    <div class="card-content">
      <!--  左侧按钮  -->
      <div class="button-content">
        <a-button type="primary" @click="openModal">
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

    <a-table
      :columns="state.columns"
      :data-source="list"
      :row-key="(record) => record.id"
      :expandable="{ defaultExpandAllRows: false, expandRowByClick: false }"
      :defaultExpandAllRows="state.isExpandAll"
      v-if="state.refreshTable"
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
        <span v-else style="margin-right: 29px"></span>
      </template>
      <!--  单元格插槽  -->
      <template #bodyCell="{ column, record }">
        <!--  菜单名称   -->
        <template v-if="column.key === 'name'">
          <div class="name-content">
            <Icon :icon="record.icon" v-if="record.icon" style="margin-right: 5px" />
            <div>{{ record.name }}</div>
          </div>
        </template>
        <!--  类型   -->
        <template v-if="column.key === 'type'">
          <span v-show="record.type === 1">目录</span>
          <span v-show="record.type === 2">菜单</span>
          <span v-show="record.type === 3">按钮</span>
        </template>
        <!--  员工数   -->
        <template v-if="column.key === 'employeesNumber'">
          <div class="employees-Number">{{ record.type }}</div>
        </template>
        <!--  状态   -->
        <template v-if="column.key === 'status'">
          <!-- TODO： 0开启 1关闭 ...换成开关的话 -  -需要对数据进行处理  - - 即对tree里的status进行替换 为布尔值 ... -->
          <!-- <div class="employees-Number">{{ record.status }}</div>-->
          <a-switch
            v-model:checked="record.statusSwitch"
            @change="(value) => tableStatusChange(value, record)"
          />
        </template>
        <!--  操作   -->
        <template v-if="column.key === 'operation'">
          <div class="operation-content">
            <div class="text-color margin-right-5" @click="edit(record)">修改</div>
            <div class="text-color margin-right-5" @click="openModal(record)">新增子项</div>
            <div class="text-color margin-right-5" @click="detailsInfo(record)">详情</div>
            <a-popover placement="bottom">
              <template #content>
                <div class="text-color margin-right-5" @click="setDeleteInfo(record)">删除</div>
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
    v-if="state.isShow"
    v-model:visible="state.isShow"
    :title="state.addEditTitle"
    @cancel="closeModal"
    :width="'534px'"
    :bodyStyle="{ margin: 'auto', paddingBottom: '25px' }"
  >
    <div class="base_info_content">
      <a-form :model="state.formState" ref="formRef" v-bind="layout">
        <a-form-item
          :label="`${state.currentMenu}名称`"
          name="name"
          :rules="[{ required: true, message: `${state.currentMenu}名称不能为空` }]"
        >
          <a-input v-model:value="state.formState.name" />
        </a-form-item>

        <a-form-item
          label="菜单类型"
          name="type"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-radio-group
            v-model:value="state.formState.type"
            :options="options"
            @change="typeChange"
          />
        </a-form-item>

        <a-form-item
          :label="
            state.formState.type === SystemMenuTypeEnum.BUTTON
              ? `上级菜单`
              : `上级${state.currentMenu}`
          "
          name="parentId"
          :rules="[{ required: true, message: `上级${state.currentMenu}` }]"
        >
          <!--          <a-select-->
          <!--            v-model:value="state.formState.parentDirectory"-->
          <!--            placeholder="选择目录"-->
          <!--            style="width: 200px"-->
          <!--            :options="options1"-->
          <!--          />-->

          <a-tree-select
            v-model:value="state.formState.parentId"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择上级目录"
            :tree-data="menuTree"
            :fieldNames="{ children: 'children', label: 'name', value: 'id' }"
          />
        </a-form-item>

        <a-form-item
          label="图标"
          name="icon"
          v-if="state.formState.type !== SystemMenuTypeEnum.BUTTON"
        >
          <IconSelect v-model="state.formState.icon" clearable />
        </a-form-item>

        <a-form-item
          label="路由地址"
          name="path"
          :rules="state.routerRules"
          v-if="state.formState.type !== SystemMenuTypeEnum.BUTTON"
        >
          <a-input v-model:value="state.formState.path" />
        </a-form-item>

        <a-form-item
          v-if="state.formState.type === SystemMenuTypeEnum.MENU"
          label="组件地址"
          name="component"
        >
          <a-input v-model:value="state.formState.component" />
        </a-form-item>

        <a-form-item
          v-if="state.formState.type === SystemMenuTypeEnum.MENU"
          label="组件名字"
          name="componentName"
        >
          <a-input v-model:value="state.formState.componentName" />
        </a-form-item>

        <a-form-item
          v-if="state.formState.type !== SystemMenuTypeEnum.DIR"
          label="权限标识"
          name="permission"
        >
          <div class="flex-content">
            <a-input v-model:value="state.formState.permission" />
            <a-tooltip placement="topLeft" class="icon-tip">
              <template #title>
                <span>
                  Controller方法上的权限字符，如：@PreAuthorize(`@ss.hasPermission('system:user:list')`)</span
                >
              </template>
              <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
            </a-tooltip>
          </div>
        </a-form-item>

        <a-form-item label="排序" name="sort" :rules="[{ required: true, message: '排序!' }]">
          <a-input-number v-model:value="state.formState.sort" :min="0" :max="100" />
        </a-form-item>

        <a-form-item
          label="菜单状态"
          name="status"
          :rules="[{ required: true, message: '菜单状态!' }]"
        >
          <a-switch
            v-model:checked="state.formState.statusSwitch"
            checked-children="开启"
            un-checked-children="关闭"
          />
        </a-form-item>

        <a-form-item
          v-if="state.formState.type !== SystemMenuTypeEnum.BUTTON"
          label="显示状态"
          name="visible"
          :rules="[{ required: true, message: '显示状态!' }]"
        >
          <a-switch
            v-model:checked="state.formState.visible"
            checked-children="开启"
            un-checked-children="关闭"
          />
          <a-tooltip placement="topLeft" class="icon-tip">
            <template #title>
              <span>选择隐藏时，路由将不会出现在侧边栏，但仍然可以访问</span>
            </template>
            <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
          </a-tooltip>
        </a-form-item>

        <a-form-item
          v-if="state.formState.type !== SystemMenuTypeEnum.BUTTON"
          label="总是显示"
          name="alwaysShow"
          :rules="[{ required: true, message: '总是显示!' }]"
        >
          <a-switch
            v-model:checked="state.formState.alwaysShow"
            checked-children="开启"
            un-checked-children="关闭"
          />
          <a-tooltip placement="topLeft" class="icon-tip">
            <template #title>
              <span>选择不是时，当该菜单只有一个子菜单时，不展示自己，直接展示子菜单</span>
            </template>
            <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
          </a-tooltip>
        </a-form-item>

        <a-form-item
          v-if="state.formState.type === SystemMenuTypeEnum.MENU"
          label="缓存状态"
          name="keepAlive"
          :rules="[{ required: true, message: '缓存状态!' }]"
        >
          <a-switch
            v-model:checked="state.formState.keepAlive"
            checked-children="开启"
            un-checked-children="关闭"
          />
          <a-tooltip placement="topLeft" class="icon-tip">
            <template #title>
              <span>选择缓存时，则会被 `keep-alive` 缓存，必须填写「组件名称」字段</span>
            </template>
            <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
          </a-tooltip>
        </a-form-item>
      </a-form>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="saveForm" :loading="state.modalBtnLoading"
        >确定</a-button
      >
      <a-button @click="closeModal">取消</a-button>
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
          <img :src="warningImg" alt="" class="tip-img" />
          {{ state.tableStatusChangeInfo.statusBtnText }}
          {{ state.tableStatusChangeInfo.record?.name }} 吗？</div
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
          个菜单将同步 {{ state.tableStatusChangeInfo.statusText }}，请谨慎操作。
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

  <!--  删除确认modal  -->
  <a-modal
    v-model:visible="state.isShowDelete"
    :closable="false"
    :width="state.deleteModalWidth"
    :bodyStyle="{
      width: '100%',
      height: '192px',
      margin: '0',
      padding: '0',
      overflow: 'auto'
    }"
    :footer="null"
  >
    <!--  不可删除提示  -->
    <div v-if="state.currentRecord.children?.length > 0">
      <div class="delete-title"> 提示 </div>
      <div class="delete-content">
        <img :src="warningImg" alt="" class="tip-img delete-img" />
        <div class="delete-text">
          {{ state.currentRecord.name }} 该菜单底下还存在
          <span class="delete-red-text">{{ state.currentRecord.children?.length }} </span>
          个子菜单，不允许删除， 请删除或转移子菜单再操作删除
        </div>
      </div>

      <a-button class="delete-cancel-btn" @click="closeDeleteModal">返回</a-button>
    </div>
    <!--  删除确认  -->
    <div v-else>
      <div class="delete-content delete-content-two">
        <img :src="warningImg" alt="" class="tip-img delete-img" />
        <div class="delete-text delete-text-two">
          确定删除菜单 {{ state.currentRecord.name }} 吗？
        </div>
      </div>
      <div class="delete-text-tip"> 删除后，该菜单信息将全部删除，且不可恢复， 请谨慎操作。 </div>
      <div class="delete-btn-content">
        <a-button type="primary" @click="okDelete" :loading="state.modalBtnLoading"
          >确定删除</a-button
        >
        <a-button @click="closeDeleteModal">取消</a-button>
      </div>
    </div>
  </a-modal>

  <!--  详情modal  -->
  <a-modal
    v-model:visible="state.isShowDetails"
    wrapClassName="details-modal"
    title="详情"
    :bodyStyle="{
      width: '100%',
      height: '192px',
      margin: '0',
      padding: '0',
      overflow: 'auto'
    }"
    :footer="null"
  >
    <div class="details-edit" @click="edit(state.currentRecord, true)"
      ><img :src="editImg" alt="" class="edit-Img" />修改</div
    >
    <div class="details-content">
      <div class="text-style" v-for="(item, index) in state.detailsInfo" :key="`info${index}`">
        <span>{{ item.textSpan }}</span>
        <Icon v-if="item?.icon" :icon="item.icon" class="mr-5px" :size="14" />
        <a-tooltip v-else>
          <template #title>
            {{ item.text }}
          </template>
          {{ item.text }}
        </a-tooltip>
      </div>
    </div>
  </a-modal>

  <!--  定制列  -->
  <CustomColumn
    v-if="state.isShowCustomColumnModal"
    @change-column="changeColumn"
    :allColumns="allColumns"
    :defaultKeys="state.defaultKeys"
    :changedColumnsObj="state.changedColumnsObj"
    pageKey="menu"
  />
</template>

<script lang="tsx" setup>
import * as MenuApi from '@/api/system/menu'
import * as TenantMenuApi from '@/api/system/TenantMenu'
import { handleTree } from '@/utils/tree'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
// import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { CommonStatusEnum, SystemMenuTypeEnum } from '@/utils/constants'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import warningImg from '@/assets/imgs/system/warning.png'
import editImg from '@/assets/imgs/system/editImg.png'
import {
  getMajorIndividualDetails,
  getSimpleTenantList,
  updateEditMajorIndividualStatus
} from '@/api/system/business'
import { updateMenuStatus } from '@/api/system/TenantMenu'
import CustomColumn from '@/components/CustomColumn/CustomColumn.vue'
import dayjs from 'dayjs'

const queryParams = reactive({
  name: undefined,
  status: undefined,
  type: null
})

const queryFormRef = ref() // 搜索的表单
const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数据

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
    } else {
      reject()
    }
  })
}

//ALL columns 用于定制列过滤 排序
const allColumns = [
  {
    title: '名称',
    width: 200,
    dataIndex: 'name',
    key: 'name',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 1
  },
  {
    title: '类型',
    width: 100,
    dataIndex: 'type',
    key: 'type',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 2
  },
  {
    title: '员工数',
    width: 100,
    dataIndex: 'employeesNumber',
    key: 'employeesNumber',
    ellipsis: true,
    sort: 3
  },
  {
    title: '排序',
    width: 100,
    dataIndex: 'sort',
    key: 'sort',
    resizable: true,
    ellipsis: true,
    sort: 4
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'status',
    key: 'status',
    resizable: true,
    ellipsis: true,
    sort: 5
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    width: 100,
    key: 'creator',
    resizable: true,
    ellipsis: true,
    sort: 6
  },
  {
    title: '创建时间',
    width: 100,
    dataIndex: 'createTime',
    key: 'createTime',
    resizable: true,
    ellipsis: true,
    sort: 7
  },
  {
    title: '最近操作人',
    width: 100,
    dataIndex: 'updater',
    key: 'updater',
    resizable: true,
    ellipsis: true,
    sort: 8
  },
  {
    title: '最近操作时间',
    width: 100,
    dataIndex: 'updateTime',
    key: 'updateTime',
    resizable: true,
    ellipsis: true,
    sort: 9
  },
  {
    title: '操作',
    width: 200,
    dataIndex: 'operation',
    key: 'operation',
    resizable: true,
    ellipsis: true,
    sort: 10
  }
]

const state = reactive({
  menuArr: [], //菜单arr 用于详情查找上级菜单
  isExpandAll: false, //展开折叠
  refreshTable: true, //v-if table
  isFullScreen: false, //全屏
  isShow: false,
  isShowDetails: false, //详情modal
  currentMenu: '目录',
  routerRules: [{ required: true }, { validator: routeValidator }],
  isShowStatus: false, //table 状态开启关闭 modal
  modalType: 'add', //add新增edit编辑
  addEditTitle: '新增', //新增编辑 modal title
  formState: {
    id: 0,
    name: '', //目录名称
    type: SystemMenuTypeEnum.DIR, //菜单类型
    parentId: 0, //上级目录
    icon: '', //图标
    path: '', //路由地址
    sort: 0, //排序
    status: CommonStatusEnum.ENABLE, //菜单状态
    statusSwitch: true, //菜单状态 - - switch boolean
    visible: true, //显示状态
    alwaysShow: true, //总是显示
    component: '', //====菜单===组件地址
    componentName: '', //====菜单===组件名称
    permission: '', //====菜单===权限标识
    keepAlive: true //====菜单===缓存状态
  }, //新增表单
  tableStatusChangeInfo: {}, //存当前表格item项以及switch值
  currentRecord: {}, //当前的record
  isShowDelete: false, //删除确认 modal
  deleteModalWidth: '488px', //删除modal width
  modalBtnLoading: false,
  isShowCustomColumnModal: false, //是否打开定制列modal
  columns: [],
  defaultKeys: ['name', 'type', 'employeesNumber', 'sort', 'status', 'operation'], //定制列默认的keys
  changedColumnsObj: {} //定制列组件接收到的当前列信息
})

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const res = await MenuApi.getMenuList(queryParams)
    // const res = await TenantMenuApi.getMenuList(queryParams)
    res.map((item) => {
      item.statusSwitch = item.status === 0
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
    })
    state.menuArr = res
    list.value = handleTree(res)
  } finally {
    loading.value = false
  }
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
const openModal = (record = {}) => {
  if (!(Object.keys(record).length === 0)) {
    //非空对象判断 新增子项时回显
    state.formState.parentId = record.id
  }
  state.isShow = true
}
//关闭Modal
const closeModal = () => {
  state.isShow = false
  formRef.value.resetFields()
  state.formState = {
    id: 0,
    name: '', //目录名称
    type: SystemMenuTypeEnum.DIR, //菜单类型
    parentId: 0, //上级目录
    icon: '', //图标
    path: '', //路由地址
    sort: 0, //排序
    status: CommonStatusEnum.ENABLE, //菜单状态
    statusSwitch: true, //菜单状态 - - switch boolean
    visible: true, //显示状态
    alwaysShow: true, //总是显示
    component: '', //====菜单===组件地址
    componentName: '', //====菜单===组件名称
    permission: '', //====菜单===权限标识
    keepAlive: true //====菜单===缓存状态
  }

  state.modalType = 'add'
  state.addEditTitle = '新增'
}

const options = [
  { value: SystemMenuTypeEnum.DIR, label: '目录' },
  { value: SystemMenuTypeEnum.MENU, label: '菜单' },
  { value: SystemMenuTypeEnum.BUTTON, label: '按钮' }
]
// //上级目录
// const options1 = ref<SelectProps['options']>([
//   { value: 0, label: '目录' },
//   { value: 1, label: '菜单' },
//   { value: 2, label: '按钮' }
// ])

/** 添加/修改操作 */
const formRef = ref()

interface FormState {
  // username: string
  // password: string
  // type: number
  // fileList: []
  // parentId: null | string
  // sort: number
  // statusF: boolean
  // visible: boolean
  // alwaysShow: boolean
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
//保存
const saveForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  const params = state.formState as unknown as MenuApi.MenuVO
  //菜单状态 0开启 1关闭 ...
  if (params?.statusSwitch) {
    params.status = 0
  } else {
    params.status = 1
  }
  state.modalBtnLoading = true
  //
  try {
    let res = []
    if (state.modalType === 'add') {
      res = await MenuApi.createMenu(params)
      // res = await TenantMenuApi.createMenu(params)
      message.success('新增成功')
    } else {
      res = await MenuApi.updateMenu(params)
      message.success('编辑成功')
    }

    closeModal()
    await getList()
    await getTree()
  } finally {
    state.modalBtnLoading = false
    // 清空，从而触发刷新
    wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
  }
}
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

//菜单类型切换
const typeChange = (type) => {
  switch (type?.target?.value) {
    case 1:
      state.currentMenu = '目录'
      break
    case 2:
      state.currentMenu = '菜单'
      break
    default:
      state.currentMenu = '按钮'
  }
}

const edit = (record, isCloseDetails = false) => {
  if (isCloseDetails) {
    //关闭详情moal
    state.isShowDetails = false
  }
  //菜单状态 0开启 1关闭
  // record.statusSwitch = record.status === 0
  // record.status = record.status === 0

  state.modalType = 'edit'
  state.addEditTitle = '修改'
  //赋值
  state.formState = { ...record }
  openModal()
}

//关闭删除modal
const closeDeleteModal = () => {
  state.isShowDelete = false
  //延迟一下 - - view闪烁
  setTimeout(() => {
    state.currentRecord = {}
    state.deleteModalWidth = '488px'
  }, 200)
}

//删除
const setDeleteInfo = (record: object) => {
  state.currentRecord = { ...record }
  if (record.children) {
    state.deleteModalWidth = '488px'
  } else {
    state.deleteModalWidth = '424px'
  }

  state.isShowDelete = true
}

/** 删除 */
const deleteFN = async (id: number) => {
  state.modalBtnLoading = true
  try {
    // 发起删除
    await MenuApi.deleteMenu(id)
    message.success('删除成功')
    // 刷新列表
    await getList()
    await getTree()
    closeDeleteModal()
    // 清空，从而触发刷新
    wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
  } finally {
    state.modalBtnLoading = false
  }
}

const okDelete = () => {
  deleteFN(state.currentRecord.id)
}

//table 状态开启关闭
//表格状态开关
const tableStatusChange = (value, record) => {
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
  state.isShowStatus = true
}

//关闭 状态开始关闭 确认modal
const closeStatusModal = async () => {
  state.isShowStatus = false
  state.tableStatusChangeInfo = {}
  //直接这里补一次请求吧 - -
  await getList()
}

//表格状态开关 modal确认
const tableStatusConfirm = async () => {
  const params = {
    id: state.tableStatusChangeInfo.record.id,
    name: state.tableStatusChangeInfo.record.name,
    parentId: state.tableStatusChangeInfo.record.parentId,
    sort: state.tableStatusChangeInfo.record.sort,
    status: state.tableStatusChangeInfo.record.statusSwitch === true ? 0 : 1,
    type: state.tableStatusChangeInfo.record.type
  }

  try {
    await MenuApi.updateMenuStatus(params)
    message.success('修改状态成功')
    await closeStatusModal()
    // 清空，从而触发刷新
    wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
  } finally {
  }
}

//详情(打开)
const detailsInfo = async (record) => {
  state.currentRecord = { ...record }
  state.isShowDetails = true
  let typeText = '目录'
  switch (record?.type) {
    case 1:
      typeText = '目录'
      state.detailsInfo = [
        {
          textSpan: '目录名称：',
          text: record?.name
        },
        {
          textSpan: '目录类型：',
          text: typeText
        },
        {
          textSpan: '图标：',
          text: '暂无图标',
          icon: record?.icon
        },
        {
          textSpan: '路由地址：',
          text: record?.path
        },
        {
          textSpan: '排序：',
          text: record?.sort
        },
        {
          textSpan: '菜单状态：',
          text: record?.status === 0 ? '开启' : '关闭'
        },
        {
          textSpan: '显示状态：',
          text: record?.visible ? '开启' : '关闭'
        },
        {
          textSpan: '总是显示：',
          text: record?.alwaysShow ? '开启' : '关闭'
        }
      ]
      break
    case 2:
      typeText = '菜单'
      const tempItem = state.menuArr.filter((item) => item.id === record.parentId)
      state.detailsInfo = [
        {
          textSpan: '菜单名称：',
          text: record?.name
        },
        {
          textSpan: '目录类型：',
          text: typeText
        },
        {
          textSpan: '上级目录：',
          text: tempItem[0]?.name
        },
        {
          textSpan: '图标：',
          text: '暂无图标',
          icon: record?.icon
        },
        {
          textSpan: '路由地址：',
          text: record?.path
        },
        {
          textSpan: '组件地址：',
          text: record?.component
        },
        {
          textSpan: '组件名字：',
          text: record?.componentName
        },
        {
          textSpan: '权限标识：',
          text: record?.permission
        },
        {
          textSpan: '排序：',
          text: record?.sort
        },
        {
          textSpan: '菜单状态：',
          text: record?.status === 0 ? '开启' : '关闭'
        },
        {
          textSpan: '显示状态：',
          text: record?.visible ? '开启' : '关闭'
        },
        {
          textSpan: '总是显示：',
          text: record?.alwaysShow ? '开启' : '关闭'
        },
        {
          textSpan: '缓存状态：',
          text: record?.keepAlive ? '缓存' : '不缓存'
        }
      ]
      break
    case 3:
      typeText = '按钮'
      const tempItemBtn = state.menuArr.filter((item) => item.id === record.parentId)
      state.detailsInfo = [
        {
          textSpan: '按钮名称：',
          text: record?.name
        },
        {
          textSpan: '按钮类型：',
          text: typeText
        },
        {
          textSpan: '上级菜单：',
          text: tempItemBtn[0]?.name
        },
        {
          textSpan: '图标：',
          text: '暂无图标',
          icon: record?.icon
        },
        {
          textSpan: '权限标识：',
          text: record?.permission
        },
        {
          textSpan: '排序：',
          text: record?.sort
        },
        {
          textSpan: '菜单状态：',
          text: record?.status === 0 ? '开启' : '关闭'
        }
      ]
      break
  }
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

//获取默认的columns
const getColumns = () => {
  //menu 为当前存储的页面
  const columnsObj = wsCache.get(CACHE_KEY.TABLE_COLUMNS_OBJ)?.menu
  //有缓存 取缓存
  if (columnsObj) {
    state.changedColumnsObj = columnsObj
    return columnsObj.currentColumns
  }
  const currentColumns = allColumns.filter((columnsItem) => {
    return state.defaultKeys.some((item) => columnsItem.key === item)
  })
  return currentColumns
}
//初始化 获取默认的 columns
state.columns = getColumns()

//table 列伸缩
const handleResizeColumn = (w, col) => {
  col.width = w
}

watch(
  () => state.formState.type,
  () => {
    // 菜单 新增/修改 默认图标
    if (state.formState.type === SystemMenuTypeEnum.MENU) {
      state.formState.icon = 'fa:circle-o'
    }
  },
  {
    immediate: true
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
//员工数
.employees-Number {
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
  width: 388.5px;
}
.text-color {
  color: rgba(0, 129, 255, 100);
}
.margin-right-5 {
  margin-right: 5px;
  cursor: pointer;
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
//提示弹窗 img
.tip-img {
  width: 20px;
  height: 20px;
  margin-right: 16px;
}

//删除modal确认
.delete-title {
  margin: 20px 0 0 20px;
  width: 36px;
  height: 25px;
  color: rgba(51, 51, 51, 1);
  font-size: 18px;
  font-weight: bold;
  font-family: PingFangSC-Medium;
}
.delete-content {
  display: flex;
  margin: 21px 0 0 20px;
}
.delete-content-two {
  display: flex;
  margin: 33px 0 0 32px;
}
.delete-text {
  width: 409px;
  height: 44px;
  color: rgba(51, 51, 51, 1);
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  font-family: PingFangSC-Medium;
}
.delete-text-two {
  height: 22px;
}
.delete-img {
  margin-top: 3px;
}
.delete-cancel-btn {
  margin: 31px 0 0 209px;
}
.delete-text-tip {
  margin: 12px 0 0 68px;
  left: 1081px;
  top: 490px;
  width: 294px;
  height: 40px;
  color: rgba(102, 102, 102, 1);
  font-size: 14px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
.delete-btn-content {
  margin: 34px 0 0 221px;
}
.delete-red-text {
  color: red;
}

//详情修改文字
.details-edit {
  padding: 23px 29px 0 0;
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
.details-content {
  margin: 23px 0 0 48px;
}
.text-style {
  span {
    font-weight: bold;
    font-family: PingFangSC-Medium;
  }
  margin-bottom: 15px;
  padding-right: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  font-family: PingFangSC-Regular;
}
//拖拽动画
.flip-list-move {
  transition: transform 0.5s;
}
//定制列 checkbox
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0;
}
//新增修改表单
:deep(.ant-form-item) {
  margin-bottom: 14px;
}
//新增 等按钮内 icon
.btn-icon {
  margin-right: 4px;
  cursor: pointer;
}
.icon-tip {
  margin-left: 8px;
}
</style>

<style lang="scss">
//修改 详细 modal位置
.details-modal {
  //display: flex;
  //.ant-modal {
  //  margin: 0;
  //  position: absolute;
  //  top: 0;
  //  left: initial;
  //  right: 0;
  //  padding: 0;
  //  //height: 1080px;
  //  min-height: 100vh;
  //}
  //.ant-modal-body {
  //  //height: calc(1080px - 55px - 53px);
  //  min-height: 100vh;
  //}

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
</style>
