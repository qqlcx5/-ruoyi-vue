<template>
  <!-- 搜索工作栏 -->

  <ContentWrap>
    <a-form :model="queryParams" ref="queryFormRef" layout="inline">
      <a-form-item :label="`主体名称`" name="keyword">
        <a-input v-model:value="queryParams.keyword" placeholder="请输入主体名称或者编码" />
      </a-form-item>
      <a-form-item :label="`系统名称`" name="systemName">
        <a-input v-model:value="queryParams.systemName" placeholder="请输入系统名称" />
      </a-form-item>
      <a-form-item :label="`有效期`" name="startEndTime">
        <a-range-picker
          v-model:value="queryParams.startEndTime"
          format="YYYY/MM/DD"
          :placeholder="['开始时间', '结束时间']"
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
  <a-card :bordered="false" style="width: 1650px" id="card-content">
    <!--  <ContentWrap>-->
    <!--    <a-button type="primary" @click="toggleExpandAll" v-hasPermi="['system:menu:create']">-->
    <!--      <Icon icon="ep:plus" class="mr-5px" color="#fff" /> 新增新增</a-button-->
    <!--    >-->

    <div class="card-content">
      <!--  左侧按钮  -->
      <div class="button-content">
        <a-button type="primary" @click="openModal">新增</a-button>
        <a-button @click="toggleExpandAll" v-if="false">展开收起</a-button>
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
      v-if="state.refreshTable"
      :columns="columns"
      :data-source="state.tableDataList"
      :pagination="{
        pageSizeOptions: ['20', '30', '60', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: queryParams.pageSize,
        current: queryParams.current,
        total: state.total,
        showTotal: (total) => `总共 ${total} 条`
      }"
      @change="onChange"
      :row-key="(record) => record.id"
      :loading="state.loading"
      :expandable="{ defaultExpandAllRows: false, expandRowByClick: false }"
      :defaultExpandAllRows="state.isExpandAll"
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
        <!--  可用名额   -->
        <template v-if="column.key === 'usableAmount'">
          <div class="text-color"
            >{{ record.accountCount - record.accountUsedCount }}/{{ record.accountCount }}</div
          >
        </template>
        <!--  有效期   -->
        <template v-if="column.key === 'validityPeriod'">
          <div class="text-color">{{ record.effectiveStartDate }}—{{ record.expireTime }}</div>
        </template>
        <!--  状态   -->
        <template v-if="column.key === 'statusSwitch'">
          <!-- TODO： 0开启 1关闭 ...换成开关的话 -  -需要对数据进行处理  - - 即对tree里的status进行替换 为布尔值 ... -->
          <!-- <div class="employees-Number">{{ record.status }}</div>-->
          <a-switch v-model:checked="record.statusSwitch" />
        </template>
        <!--  操作   -->
        <template v-if="column.key === 'operation'">
          <div class="operation-content">
            <div class="text-color margin-right-5" @click="edit(record)">修改</div>
            <div class="text-color margin-right-5">功能配置</div>
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
    @ok="closeModal"
    @cancel="closeModal"
    :width="'900px'"
    :bodyStyle="{ height: '600px', margin: 'auto', paddingBottom: '25px', overflow: 'auto' }"
  >
    <div class="base_info_content">
      <a-form :model="state.formState" ref="formRef" v-bind="layout">
        <div> 基本信息 </div>
        <a-form-item
          :label="`主体编码`"
          name="code"
          :rules="[{ required: true, message: `主体编码不能为空` }]"
        >
          <a-input v-model:value="state.formState.code" show-count :maxlength="20" />
        </a-form-item>

        <a-form-item
          :label="`主体名称`"
          name="name"
          :rules="[{ required: true, message: `主体名称不能为空` }]"
        >
          <a-input v-model:value="state.formState.name" show-count :maxlength="20" />
        </a-form-item>

        <a-form-item :label="`主体简称`" name="abbreviate">
          <a-input v-model:value="state.formState.abbreviate" show-count :maxlength="10" />
        </a-form-item>

        <a-form-item
          :label="`系统名称`"
          name="systemName"
          :rules="[{ required: true, message: `系统名称不能为空` }]"
        >
          <div class="flex-content">
            <a-input v-model:value="state.formState.systemName" show-count :maxlength="10" />
            <a-tooltip placement="topLeft">
              <template #title>
                <span> 为左上角显示的系统整体名称</span>
              </template>
              <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
            </a-tooltip>
          </div>
        </a-form-item>

        <a-form-item label="系统logo" name="logoUrl">
          <a-upload
            v-model:file-list="fileList"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="loading" />
              <plus-outlined v-else />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item
          :label="`负责人`"
          name="contactName"
          :rules="[{ required: true, message: `负责人不能为空` }]"
        >
          <a-input v-model:value="state.formState.contactName" />
        </a-form-item>

        <a-form-item label="负责人电话" name="contactMobile" :rules="state.contactMobileRules">
          <a-input v-model:value="state.formState.contactMobile" />
          <div> 主要用于重要功能的安全验证，请确保填写正确 </div>
        </a-form-item>

        <a-form-item
          :label="`有效期`"
          name="effectiveStartEndTime"
          :rules="[{ required: true, message: `有效期不能为空` }]"
        >
          <div class="flex-content">
            <a-range-picker
              v-model:value="state.formState.effectiveStartEndTime"
              format="YYYY/MM/DD"
              :placeholder="['开始时间', '结束时间']"
            />
            <div>
              <a-form-item-rest>
                <a-checkbox v-model:checked="state.formState.forever">
                  永久有效</a-checkbox
                ></a-form-item-rest
              >
            </div>
          </div>
        </a-form-item>

        <a-form-item
          :label="`可用名额`"
          name="accountCount"
          :rules="[{ required: true, message: `可用名额不能为空` }]"
        >
          <a-input-number
            id="inputNumber"
            v-model:value="state.formState.accountCount"
            :controls="false"
          />
        </a-form-item>

        <a-form-item
          :label="`绑定域名`"
          name="bindingDomainName"
          :rules="[{ required: true, message: `绑定域名不能为空` }]"
        >
          <a-input v-model:value="state.formState.bindingDomainName" />
        </a-form-item>

        <a-form-item label="状态" name="status" :rules="[{ required: true, message: '菜单状态!' }]">
          <a-switch
            v-model:checked="state.formState.status"
            checked-children="开启"
            un-checked-children="关闭"
          />
        </a-form-item>

        <div> 详细信息 </div>
        <a-form-item :label="`统一社会信用代码`" name="creditCode">
          <a-input v-model:value="state.formState.creditCode" />
        </a-form-item>

        <a-form-item :label="`组织机构代码`" name="organizationCode">
          <a-input v-model:value="state.formState.organizationCode" />
        </a-form-item>

        <a-form-item :label="`法定代表人`" name="legalRepresentative">
          <a-input v-model:value="state.formState.legalRepresentative" />
        </a-form-item>

        <a-form-item label="法人电话" name="legalMobile" :rules="state.legalMobileRules">
          <a-input v-model:value="state.formState.legalMobile" />
        </a-form-item>

        <a-form-item label="法人身份证" name="legalIdentityUrl">
          <a-upload
            v-model:file-list="fileList"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="loading" />
              <plus-outlined v-else />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <div> 请上传法人的清晰正面人头像身份证照片，支持png/jpg格式的照片 </div>
        </a-form-item>

        <a-form-item :label="`成立日期`" name="establishDate">
          <a-date-picker
            v-model:value="state.formState.establishDate"
            format="YYYY/MM/DD"
            placeholder="请选择时间"
          />
        </a-form-item>

        <!--  级联选择器  - -   -->
        <a-form-item :label="`公司地址`" name="detailedAddress">
          <div class="flex-content">
            <a-form-item-rest>
              <a-cascader
                v-model:value="state.formState.companyAddress"
                :options="state.proMunAreaList"
                @change="cascadeChange"
                placeholder="请选择省市区"
              />
            </a-form-item-rest>
            <a-input
              v-model:value="state.formState.detailedAddress"
              placeholder="请输入详细的公司地址，具体门牌号"
            />
          </div>
        </a-form-item>

        <a-form-item label="营业执照" name="businessLicenseUrl">
          <a-upload
            v-model:file-list="fileList"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="loading" />
              <plus-outlined v-else />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <div> 请上传法人的清晰正面人头像身份证照片，支持png/jpg格式的照片 </div>
        </a-form-item>
      </a-form>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="addMajorIndividualFN">确定</a-button>
      <a-button @click="closeModal">取消</a-button>
    </template>
  </a-modal>
</template>

<script lang="tsx" setup>
import * as MenuApi from '@/api/system/menu'
import { handleTree } from '@/utils/tree'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { CommonStatusEnum, SystemMenuTypeEnum } from '@/utils/constants'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import {
  addMajorIndividual,
  editMajorIndividual,
  getMajorIndividualList,
  updateEditMajorIndividual
} from '@/api/system/business'
const { wsCache } = useCache()

import { provincesMunicipalitiesArea } from './pr'
import { reconstructedTreeData } from '@/utils/utils'
import dayjs from 'dayjs'
// console.log('provincesMunicipalitiesArea', provincesMunicipalitiesArea)

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
  keyword: undefined,
  systemName: undefined,
  startEndTime: [],
  status: undefined
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

//负责人电话校验
const contactMobileValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      console.log(' isValidPhoneNumber(value)', isValidPhoneNumber(value))
      if (!isValidPhoneNumber(value)) {
        reject('请输入正确的手机号码')
      } else {
        resolve()
      }
    } else {
      reject('负责人电话不能为空')
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
  labelCol: { span: 4 },
  wrapperCol: { span: 14 }
}

const state = reactive({
  total: 0, //总条数
  statusOptions: [
    { value: 0, label: '正常' },
    { value: 1, label: '停用' }
  ], //状态 0 正常 1停用
  loading: true, //表格加载中
  tableDataList: [], //表格数据
  isExpandAll: false, //展开折叠
  refreshTable: true, //v-if table
  isFullScreen: false, //全屏
  isShow: false,
  modalTitle: '新增', //modal title
  currentMenu: '目录',
  routerRules: [{ required: true }, { validator: routeValidator }],
  contactMobileRules: [
    { required: true, message: `负责人电话不能为空` },
    { validator: contactMobileValidator }
  ],
  legalMobileRules: [{ validator: legalMobileValidator }],
  modalType: 'add', //add新增edit编辑
  proMunAreaList: [], //省市区数据
  formState: {
    code: '', //主体编码
    name: '', //主体名称
    abbreviate: '', //主体简称
    systemName: '', //系统名称
    logoUrl: '', //系统logo
    contactName: '', //负责人
    contactMobile: '', //负责人电话
    effectiveStartEndTime: [], //有效期
    forever: false, //永久有效
    accountCount: undefined, //可用名额
    bindingDomainName: '', //绑定域名
    status: true, //状态
    creditCode: '', //统一社会信用代码
    organizationCode: '', //组织机构代码
    legalRepresentative: '', //法定代表人
    legalMobile: '', //法人联系电话
    legalIdentityUrl: '', //法人身份证
    establishDate: '', //成立日期
    companyAddress: [], //公司地址
    cascadeInfo: [], //选中的省市区全部信息
    detailedAddress: '', //公司地址 详细地址

    businessLicenseUrl: '' //营业执照
  }, //新增表单
  addSuccessId: '' //创建主体成功ID 主要是用于创建主体后配置权限
})

const columns = [
  {
    title: '主体编码',
    width: 200,
    dataIndex: 'code',
    key: 'code',
    ellipsis: true
  },
  {
    title: '主体名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true
  },
  {
    title: '系统名称',
    dataIndex: 'systemName',
    key: 'systemName'
  },
  {
    title: '可用名额',
    dataIndex: 'usableAmount',
    key: 'usableAmount'
  },
  {
    title: '有效期',
    width: 200,
    dataIndex: 'validityPeriod',
    key: 'validityPeriod'
  },

  {
    title: '绑定域名',
    dataIndex: 'bindingDomainName',
    key: 'bindingDomainName'
  },
  {
    title: '负责人',
    dataIndex: 'contactName',
    key: 'contactName'
  },
  {
    title: '负责人电话',
    dataIndex: 'contactMobile',
    key: 'contactMobile'
  },
  {
    title: '状态',
    dataIndex: 'statusSwitch',
    key: 'statusSwitch'
  },

  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation'
  }
]

/** 查询列表 */
const getList = async () => {
  state.loading = true
  console.log('queryParams', queryParams)
  const params = {
    pageNo: queryParams.current,
    pageSize: queryParams.pageSize,
    keyword: queryParams.keyword,
    systemName: queryParams.systemName,
    status: queryParams.status
  }

  if (queryParams?.startEndTime[0] && queryParams?.startEndTime[1]) {
    params['localDates'] = [
      queryParams.startEndTime[0]?.format('YYYY-MM-DD'),
      queryParams.startEndTime[1]?.format('YYYY-MM-DD')
    ]
  }

  console.log('params', params)
  try {
    const res = await getMajorIndividualList(params)
    state.tableDataList = res.list
    state.tableDataList.map((item) => {
      item.statusSwitch = item.status === 0
    })
    state.total = res.total
    console.log('res====>', res)
  } finally {
    state.loading = false
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
const openModal = () => {
  state.isShow = true
}
//关闭Modal
const closeModal = () => {
  state.isShow = false
  formRef.value.resetFields()
  //级联选择器 需要单独清空
  state.formState.companyAddress = []
  state.formState = {
    code: '', //主体编码
    name: '', //主体名称
    abbreviate: '', //主体简称
    systemName: '', //系统名称
    logoUrl: '', //系统logo
    contactName: '', //负责人
    contactMobile: '', //负责人电话
    effectiveStartEndTime: [], //有效期
    forever: false, //永久有效
    accountCount: undefined, //可用名额
    bindingDomainName: '', //绑定域名
    status: true, //状态
    creditCode: '', //统一社会信用代码
    organizationCode: '', //组织机构代码
    legalRepresentative: '', //法定代表人
    legalMobile: '', //法人联系电话
    legalIdentityUrl: '', //法人身份证
    establishDate: '', //成立日期
    companyAddress: [], //公司地址
    cascadeInfo: [], //选中的省市区全部信息
    detailedAddress: '', //公司地址 详细地址
    businessLicenseUrl: '' //营业执照
  }
  delete state.formState?.id
  state.modalTitle = '新增'
  state.modalType = 'add'
  console.log('编辑完成之后的state.formState', state.formState)
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
  console.log('menuTree', menuTree)
}
getTree()

//编辑
const edit = async (record) => {
  //获取主体详情
  const res = await editMajorIndividual({ id: record.id })
  console.log('res', res)

  //菜单状态 0开启 1关闭
  // record.statusSwitch = record.status === 0
  record.status = record.status === 0

  state.modalType = 'edit'
  state.modalTitle = '编辑'
  //赋值 回显
  state.formState = {
    id: record.id,
    code: res.code, //主体编码
    name: res.name, //主体名称
    abbreviate: res.abbreviate, //主体简称
    systemName: res.systemName, //系统名称
    logoUrl: res.logoUrl, //系统logo
    contactName: res.contactName, //负责人
    contactMobile: res.contactMobile, //负责人电话
    effectiveStartEndTime: [dayjs(res.effectiveStartDate), dayjs(res.expireTime)], //有效期 开始时间
    // expireTime: , //有效期 结束时间
    accountCount: res.accountCount, //可用名额
    bindingDomainName: res.domain, //绑定域名
    creditCode: res.creditCode, //统一社会信用代码
    organizationCode: res.organizationCode, //组织机构代码
    legalRepresentative: res.legalRepresentative, //法定代表人
    legalMobile: res.legalMobile, //法人联系电话
    legalIdentityUrl: res.legalIdentityUrl, //法人身份证
    establishDate: dayjs(res.establishDate), //成立日期
    detailedAddress: res.address, //公司地址 详细地址
    businessLicenseUrl: res.businessLicenseUrl //营业执照
  }

  //永久有效 起始时间为当前时间 结束时间为2099-12-31
  state.formState.forever = res.expireTime === '2099-12-31'

  //状态0 开启 1关闭
  state.formState.status = res.status === 0

  //省市区
  state.formState.companyAddress = [res?.provinceCode, res?.cityCode, res?.countyCode]
  state.formState.cascadeInfo = [
    {
      label: res?.province,
      value: res?.provinceCode
    },
    {
      label: res?.city,
      value: res?.cityCode
    },
    {
      label: res?.county,
      value: res?.countyCode
    }
  ]
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
console.log('state.proMunAreaList', state.proMunAreaList)

//新增主体
const addMajorIndividualFN = async () => {
  console.log('dayjs', dayjs().format('YYYY-MM-DD'))
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  console.log('valid', valid)
  console.log('formState', state.formState)
  let params = {
    code: state.formState.code, //主体编码
    name: state.formState.name, //主体名称
    abbreviate: state.formState.abbreviate, //主体简称
    systemName: state.formState.systemName, //系统名称
    logoUrl: state.formState.logoUrl, //系统logo
    contactName: state.formState.contactName, //负责人
    contactMobile: state.formState.contactMobile, //负责人电话
    effectiveStartDate: state.formState.effectiveStartEndTime[0]?.format('YYYY-MM-DD'), //有效期 开始时间
    expireTime: state.formState.effectiveStartEndTime[1]?.format('YYYY-MM-DD'), //有效期 结束时间
    accountCount: state.formState.accountCount, //可用名额
    domain: state.formState.bindingDomainName, //绑定域名
    creditCode: state.formState.creditCode, //统一社会信用代码
    organizationCode: state.formState.organizationCode, //组织机构代码
    legalRepresentative: state.formState.legalRepresentative, //法定代表人
    legalMobile: state.formState.legalMobile, //法人联系电话
    legalIdentityUrl: state.formState.legalIdentityUrl, //法人身份证
    establishDate: state.formState.establishDate.format('YYYY-MM-DD'), //成立日期
    companyAddress: [], //公司地址
    address: state.formState.detailedAddress, //公司地址 详细地址
    //
    businessLicenseUrl: state.formState.businessLicenseUrl //营业执照
  }

  //永久有效 起始时间为当前时间 结束时间为2099-12-31
  if (state.formState.forever) {
    params.effectiveStartDate = dayjs().format('YYYY-MM-DD')
    params.expireTime = '2099-12-31'
  }
  //状态0 开启 1关闭
  if (state.formState.status) {
    params['status'] = 0
  } else {
    params['status'] = 1
  }

  //省市区
  if (state.formState?.cascadeInfo[0]) {
    params['province'] = state.formState.cascadeInfo[0].label
    params['provinceCode'] = state.formState.cascadeInfo[0].value
  }
  if (state.formState?.cascadeInfo[1]) {
    params['city'] = state.formState.cascadeInfo[1].label
    params['cityCode'] = state.formState.cascadeInfo[1].value
  }
  if (state.formState?.cascadeInfo[2]) {
    params['county'] = state.formState.cascadeInfo[2].label
    params['countyCode'] = state.formState.cascadeInfo[2].value
  }

  console.log('params', params)

  try {
    let res = []
    if (state.modalType === 'add') {
      res = await addMajorIndividual(params)
      console.log('res====>', res)
      state.addSuccessId = res
      message.success('新增成功')
    } else {
      params['id'] = state.formState.id
      res = await updateEditMajorIndividual(params)
      console.log('编辑res====>', res)
      message.success('编辑成功')
    }

    closeModal()
    await getList()
  } finally {
  }
}

//级联选择器选中的内容 改变
const cascadeChange = (value, selectedOptions) => {
  state.formState.cascadeInfo = selectedOptions
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
  //background: red;
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

.operation-content {
  display: flex;
}

.margin-right-5 {
  margin-right: 5px;
  cursor: pointer;
}
</style>
