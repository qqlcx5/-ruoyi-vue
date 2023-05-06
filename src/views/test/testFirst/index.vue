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
        <a-button type="primary" @click="openModal">新增</a-button>
        <a-button @click="toggleExpandAll">展开收起</a-button>
      </div>
      <!--  右侧操作  -->
      <div class="operation-content">
        <Icon icon="svg-icon:search" :size="50" class="cursor-pointer" />
        <Icon icon="svg-icon:full-screen" :size="50" class="cursor-pointer" @click="fullScreen" />
        <Icon icon="svg-icon:print-connect" :size="50" class="cursor-pointer" />
        <Icon icon="svg-icon:refresh" :size="50" class="cursor-pointer" />
        <Icon icon="svg-icon:custom-column" :size="50" class="cursor-pointer" />
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="list"
      :row-key="(record) => record.id"
      :expandable="{ defaultExpandAllRows: false, expandRowByClick: false }"
      :defaultExpandAllRows="state.isExpandAll"
      v-if="state.refreshTable"
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
          <a-switch v-model:checked="record.statusSwitch" />
        </template>
        <!--  操作   -->
        <template v-if="column.key === 'operation'">
          <div class="operation-content">
            <div class="text-color margin-right-5" @click="edit(record)">修改</div>
            <div class="text-color margin-right-5" @click="openModal(record)">新增子项</div>
            <div class="text-color margin-right-5">详情</div>
            <div class="text-color margin-right-5" @click="deleteFN(record.id)">删除</div>
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
    @ok="closeModal"
    @cancel="closeModal"
    :width="'900px'"
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
            <a-tooltip placement="topLeft">
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
          <a-tooltip placement="topLeft">
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
          <a-tooltip placement="topLeft">
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
          <a-tooltip placement="topLeft">
            <template #title>
              <span>选择缓存时，则会被 `keep-alive` 缓存，必须填写「组件名称」字段</span>
            </template>
            <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
          </a-tooltip>
        </a-form-item>
      </a-form>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="saveForm">确定</a-button>
      <a-button @click="closeModal">取消</a-button>
    </template>
  </a-modal>
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
    }
  })
}

const state = reactive({
  isExpandAll: false, //展开折叠
  refreshTable: true, //v-if table
  isFullScreen: false, //全屏
  isShow: false,
  currentMenu: '目录',
  routerRules: [{ required: true }, { validator: routeValidator }],
  // formState: reactive<FormState>({
  //   username: '',
  //   password: '',
  //   type: 1,
  //   fileList: [],
  //   parentId: null,
  //   sort: 0,
  //   statusF: true,
  //   visible: true,
  //   alwaysShow: true
  // }) //新增表单
  modalType: 'add', //add新增edit编辑
  addEditTitle: '新增', //新增编辑 modal title
  typeArr: [
    {
      label: '目录',
      value: 1
    },
    {
      label: '菜单',
      value: 2
    },
    {
      label: '按钮',
      value: 3
    }
  ],
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
  } //新增表单
})

const columns = [
  {
    title: '名称',
    width: 200,
    dataIndex: 'name',
    key: 'name',
    ellipsis: true
  },
  {
    title: '类型',
    width: 100,
    dataIndex: 'type',
    key: 'type',
    ellipsis: true
  },
  {
    title: '员工数',
    width: 100,
    dataIndex: 'employeesNumber',
    key: 'employeesNumber',
    ellipsis: true
  },
  {
    title: '排序',
    width: 100,
    dataIndex: 'sort',
    key: 'sort',
    ellipsis: true
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'status',
    key: 'status',
    ellipsis: true
  },
  {
    title: '操作',
    width: 200,
    dataIndex: 'operation',
    key: 'operation',
    ellipsis: true
  }
]

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  console.log('queryParams', queryParams)
  try {
    const res = await MenuApi.getMenuList(queryParams)
    console.log('res', res)
    res.map((item) => {
      item.statusSwitch = item.status === 0
    })
    list.value = handleTree(res)
    console.log('list====>', list.value)
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
  console.log('record', record)
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

  console.log('formRef.value', formRef.value)
  console.log('state.formState', state.formState)
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
  console.log('save')
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  console.log('valid', valid)
  const params = state.formState as unknown as MenuApi.MenuVO
  console.log('params', params)
  //菜单状态 0开启 1关闭 ...
  if (params?.statusSwitch) {
    params.status = 0
  } else {
    params.status = 1
  }

  //
  try {
    let res = []
    if (state.modalType === 'add') {
      console.log('paramsAdd', params)
      res = await MenuApi.createMenu(params)
      message.success('新增成功')
    } else {
      console.log('paramsEdit', params)
      res = await MenuApi.updateMenu(params)
      message.success('编辑成功')
    }
    console.log('res', res)

    closeModal()
    await getList()
    await getTree()
  } finally {
    // 清空，从而触发刷新
    wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
    console.log('delete路由')
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
  console.log('menuTree', menuTree)
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
      console.log('', 1111)
      break
    default:
      state.currentMenu = '按钮'
  }
}

const edit = (record) => {
  console.log('reEEEE', record)
  //菜单状态 0开启 1关闭
  // record.statusSwitch = record.status === 0
  // record.status = record.status === 0

  state.modalType = 'edit'
  state.addEditTitle = '修改'
  //赋值
  state.formState = { ...record }
  openModal()
  // console.log('record)', record)
}

/** 删除按钮操作 */
const deleteFN = async (id: number) => {
  console.log('删除', id)
  try {
    // 发起删除
    await MenuApi.deleteMenu(id)
    message.success('删除成功')
    // 刷新列表
    await getList()
    await getTree()
    // 清空，从而触发刷新
    wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
  } catch {}
}
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
}
.text-color {
  color: rgba(0, 129, 255, 100);
}
.margin-right-5 {
  margin-right: 5px;
  cursor: pointer;
}
</style>
