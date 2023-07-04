<template>
  <!--  门店详情  -->
  <a-modal
    v-model:visible="state.isShowDetails"
    destroyOnClose
    title="详情"
    wrapClassName="details-modal set-attribute-modal"
    @cancel="closeStoreDetailsModal"
    width="763px"
    :bodyStyle="{ overflow: 'auto' }"
    :footer="null"
  >
    <!--  机构信息  -->
    <div v-for="(item, index) in state.detailsInfo" :key="`info${index}`" class="details-content">
      <div class="flex-space">
        <div class="title-content"><div class="blue-line"></div>{{ item.baseTitle }}</div>
        <div class="details-edit" @click="edit()" v-hasPermi="[`${state.editPermission}`]"
          ><img :src="editImg" alt="" class="edit-Img" />修改</div
        >
      </div>
      <div class="info-content">
        <div
          :class="[
            'text-style',
            { 'super-admin-style': childItem?.isSuperAdmin },
            { 'width-full': childItem?.isFull }
          ]"
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
    </div>
    <!--  机构属性  -->
    <div
      class="details-content"
      v-if="
        state.detailsRecord.organizationType === '门店' ||
        state.detailsRecord.organizationType === '分公司'
      "
    >
      <div class="flex-space">
        <div class="title-content"><div class="blue-line"></div>机构属性</div>
        <div class="details-edit" @click="assignPermission(state.detailsRecord, true)"
          ><img :src="editImg" alt="" class="edit-Img" />修改</div
        >
      </div>
    </div>

    <!--  TODO 有空考虑 改一下 并到一起  催命似的催 先这样  -->
    <div class="title-content"><div class="blue-line"></div>基础属性</div>
    <div
      v-for="(item, index) in state.detailsInfoSecond"
      :key="`info${index}`"
      class="details-content"
    >
      <div class="info-content">
        <div
          :class="[
            'text-style',
            { 'super-admin-style': childItem?.isSuperAdmin },
            { 'width-full': childItem?.isFull }
          ]"
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

            <a-rate
              v-if="childItem?.startRating"
              v-model:value="childItem.startRating"
              disabled
              allow-half
            />

            <div v-if="childItem?.contactInformationOptions" class="tags-content">
              <div v-for="itemTag in childItem?.contactInformationOptions" class="tag-content">
                <a-tag :color="rgbFN()">{{ itemTag?.label }}</a-tag>
                <div>{{ itemTag?.value }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!--  TODO 有空考虑 改一下 并到一起  催命似的催 先这样  -->
    <div class="title-content"><div class="blue-line"></div>高级属性</div>
    <div
      v-for="(item, index) in state.detailsInfoThree"
      :key="`info${index}`"
      class="details-content"
    >
      <div>试运营信息</div>
      <div class="info-content">
        <div
          :class="[
            'text-style',
            { 'super-admin-style': childItem?.isSuperAdmin },
            { 'width-full': childItem?.isFull }
          ]"
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

            <a-rate
              v-if="childItem?.startRating"
              v-model:value="childItem.startRating"
              allow-half
            />

            <div v-if="childItem?.contactInformationOptions" class="tags-content">
              <div v-for="itemTag in childItem?.contactInformationOptions" class="tag-content">
                <a-tag :color="rgbFN()">{{ itemTag?.label }}</a-tag>
                <div>{{ itemTag?.value }}</div>
              </div>
            </div>

            <div v-if="childItem?.generalArr">
              <div
                v-for="(itemNoticeLetter, itemNoticeLetterIndex) in childItem?.generalArr"
                @click="previewFile(itemNoticeLetter)"
                :key="`noticeLetter${itemNoticeLetterIndex}`"
                >{{ itemNoticeLetter.fileName }}</div
              >
            </div>
          </template>
        </div>
      </div>
    </div>

    <!--  TODO 有空考虑 改一下 并到一起  催命似的催 先这样  -->
    <div
      v-for="(item, index) in state.detailsInfoFour"
      :key="`info${index}`"
      class="details-content"
    >
      <div>验收信息</div>
      <div class="info-content">
        <div
          :class="[
            'text-style',
            { 'super-admin-style': childItem?.isSuperAdmin },
            { 'width-full': childItem?.isFull }
          ]"
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

            <a-rate
              v-if="childItem?.startRating"
              v-model:value="childItem.startRating"
              allow-half
            />

            <div v-if="childItem?.contactInformationOptions" class="tags-content">
              <div v-for="itemTag in childItem?.contactInformationOptions" class="tag-content">
                <a-tag :color="rgbFN()">{{ itemTag?.label }}</a-tag>
                <div>{{ itemTag?.value }}</div>
              </div>
            </div>

            <div v-if="childItem?.generalArr">
              <div
                v-for="(itemNoticeLetter, itemNoticeLetterIndex) in childItem?.generalArr"
                @click="previewFile(itemNoticeLetter)"
                :key="`noticeLetterFile${itemNoticeLetterIndex}`"
                >{{ itemNoticeLetter.fileName }}</div
              >
            </div>
          </template>
        </div>
      </div>
    </div>
  </a-modal>

  <!--  上传图片预览  -->
  <a-modal
    :visible="previewVisible"
    destroyOnClose
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

  <!--  上传文件预览  -->
  <preview-dialog
    v-model="state.isShowDialog"
    :title="state.previewTitle"
    :url="state.previewUrl"
  />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import {
  getOrganizationStoreDetails,
  getOrganizationTypeList,
  getSimpleOrganizationList
} from '@/api/system/organization'
import { organizationType, storeSubType } from '@/utils/constants'
import { getMemberAllList } from '@/api/system/member'
import { hasPermission, reconstructionArrayObject } from '@/utils/utils'
import editImg from '@/assets/imgs/system/editImg.png'
import { getMajDictList, getSimpleTenantList, getStoreDetails } from '@/api/system/business'

interface Props {
  currentRecord?: any
  fromPage?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentRecord: {},
  fromPage: 'business' //默认为主体管理 由于 主体管理与机构管理的门店要走 不同接口(...出入参一样) 因此加个mark
})

const emit = defineEmits<{
  (e: 'closeStoreDetails', key: boolean): void
  (e: 'editStoreDetails', key: object): void
}>()

const state: any = reactive({
  isShowDetails: true, //详情modal
  detailsInfo: [], //详情内容
  detailsInfoSecond: [], //
  detailsInfoThree: [], //
  detailsInfoFour: [], //
  detailsRecord: {}, //当前点击的表格record后获取到的机构详情(包括属性)
  organizationTypeOptions: [], //机构类型列表
  branchCompanyTypeOptions: [], //分公司类型列表
  contactInformationOptions: [], //联系方式类型列表
  storeTypeOptions: [], //门店类型
  saleBrandOptions: [], //销售品牌List 设置属性
  rescueBrandOptions: [], //救援品牌List 设置属性
  maintenanceBrandOptions: [], //销售品牌List 设置属性
  memberOptions: [], //新增修改 负责人list
  isShowDialog: false,
  previewTitle: '',
  previewUrl: '',
  editPermission:
    props.fromPage === 'business' ? 'system:tenant:update' : 'system:organization:update-store'
})

const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')

//详情(打开)
const detailsInfo = async (record) => {
  console.log('re!!!!!!!!!!!', record)
  //数据字典
  let dictRes = []
  state.detailsRecord = record
  //获取机构详情
  // const res = await getOrganizationDetails({ id: record.id })
  const params: any = {
    id: record.id,
    tenantId: record.belongTenantId || record.tenantId
  }
  let res: any
  // const res = await getOrganizationStoreDetails({
  //   id: record.id,
  //   tenantId: record.belongTenantId || record.tenantId
  // })
  switch (props.fromPage) {
    case 'business':
      //主体管理 门店 详情
      res = await getStoreDetails(params)
      //数据字典
      dictRes = await getMajDictList({
        tenantId: record.tenantId
      })
      break
    default:
      //机构管理
      res = await getOrganizationStoreDetails(params)
      //数据字典
      dictRes = await getOrganizationTypeList()
  }

  const { relVO = {} } = res

  //是否为子门店
  const isChildStore =
    res?.storeSubtyping === storeSubType.popStore || res?.storeSubtyping === storeSubType.cityHall

  //上级机构
  const tempRes = await getSimpleOrganizationList({ status: 0 })
  const tempItem = tempRes.filter((item) => item.id === record.parentId)

  const tempArrType = state.organizationTypeOptions.filter(
    (item) => item.value === res.organizationType
  )

  //主体列表
  const majorIndividualRes = await getSimpleTenantList()
  const tempParentMajorIndividual = majorIndividualRes.find((item) => item.id === res.tenantId)

  //类型
  let tempArrTypeString = ''
  if (res.organizationType === organizationType.branchCompany) {
    //分公司
    // const tempArrTypeF = state.organizationTypeOptions.filter((topItem) => {
    const tempArrTypeF = state.branchCompanyTypeOptions.filter((topItem) => {
      return relVO?.type.some((item) => topItem.value === item)
    })

    tempArrTypeF.map((item) => {
      if (tempArrTypeString === '') {
        //避免开头多拼一个 、
        tempArrTypeString = item.label
      } else {
        tempArrTypeString = tempArrTypeString + '、' + item.label
      }
    })
  } else if (res.organizationType === organizationType.store) {
    //门店
    const tempArrTypeF = state.storeTypeOptions.filter((topItem) => {
      return relVO?.type.some((item) => topItem.value === item)
    })

    tempArrTypeF.map((item) => {
      if (tempArrTypeString === '') {
        //避免开头多拼一个 、
        tempArrTypeString = item.label
      } else {
        tempArrTypeString = tempArrTypeString + '、' + item.label
      }
    })
  }

  const tempBrandList = dictRes.filter((item) => item.dictType === 'brand')
  console.log('tempBarnList', tempBrandList)
  // tempBrandString = item.brand.join()
  // item.brands.split(',')
  //品牌
  let tempBrandtring = ''
  console.log('res?.brandIds', res?.brandIds)
  const tempBrandIds = res?.brandIds.split(',')
  const tempBrandArr = tempBrandList.filter((topItem) => {
    return tempBrandIds.some((item) => topItem.value === item)
  })

  tempBrandArr.map((item) => {
    if (tempBrandtring === '') {
      //避免开头多拼一个 、
      tempBrandtring = item.label
    } else {
      tempBrandtring = tempBrandtring + '、' + item.label
    }
  })

  //销售品牌
  let tempSaleString = ''
  const tempSaleArr = state.saleBrandOptions.filter((topItem) => {
    return relVO?.saleBrand.some((item) => topItem.value === item)
  })

  tempSaleArr.map((item) => {
    if (tempSaleString === '') {
      //避免开头多拼一个 、
      tempSaleString = item.label
    } else {
      tempSaleString = tempSaleString + '、' + item.label
    }
  })

  //救援品牌
  let tempRescueString = ''
  const tempRescueArr = state.rescueBrandOptions.filter((topItem) => {
    return relVO?.rescueBrand.some((item) => topItem.value === item)
  })

  tempRescueArr.map((item) => {
    if (tempRescueString === '') {
      //避免开头多拼一个 、
      tempRescueString = item.label
    } else {
      tempRescueString = tempRescueString + '、' + item.label
    }
  })

  //维保品牌
  let tempMaintenanceString = ''
  const tempMaintenanceArr = state.maintenanceBrandOptions.filter((topItem) => {
    return relVO?.maintenanceBrand.some((item) => topItem.value === item)
  })

  tempMaintenanceArr.map((item) => {
    if (tempMaintenanceString === '') {
      //避免开头多拼一个 、
      tempMaintenanceString = item.label
    } else {
      tempMaintenanceString = tempMaintenanceString + '、' + item.label
    }
  })

  //地址 数据统计区域
  let companyAddressData = ''
  if (res?.province) {
    companyAddressData = res?.dataProvinceName + res?.dataCityName + res?.dataCountyName
  }

  //地址
  let companyAddress = ''
  if (res?.province) {
    companyAddress = res?.province + res?.city + res?.county
  }
  if (res?.address) {
    companyAddress += res?.address
  }

  //联系方式
  const tempArrContactInformationArr: any = []
  state.contactInformationOptions.filter((topItem) => {
    return relVO?.contact.some((item) => {
      if (topItem.value === item.contactType) {
        tempArrContactInformationArr.push({
          label: topItem?.label,
          value: item?.mobile
        })
      }
    })
  })

  const tempContactName = state.memberOptions.find((item) => item.value === res?.contactId)
  console.log('res', res)
  console.log('res.relVO?.trialOperationTime', res.relVO?.trialOperationTime)

  state.detailsInfo = [
    {
      baseTitle: '基础信息',
      infoArr: [
        {
          textSpan: '上级主体：',
          text: tempParentMajorIndividual?.name
        },
        {
          textSpan: '上级机构：',
          text: tempItem.length === 0 ? '顶层机构' : tempItem[0]?.name
        },
        {
          textSpan: '专营店编码：',
          text: res?.specialtyCode
        },
        {
          textSpan: '机构类型：',
          text: tempArrType[0]?.label
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
          textSpan: '品牌：',
          text: tempBrandtring
        },
        {
          textSpan: '数据统计区域：',
          text: companyAddressData,
          isFull: true
        },
        {
          textSpan: '门店地址：',
          text: companyAddress,
          isFull: true
        },
        {
          textSpan: '负责人：',
          text: tempContactName?.label || ''
        },
        {
          textSpan: '岗位：',
          text: res?.contactPost || ''
        },
        {
          textSpan: '负责人电话：',
          text: res.contactMobile
        },
        {
          textSpan: '负责人邮箱：',
          text: res.contactMail
        },
        {
          textSpan: '排序：',
          text: res.sort
        },
        {
          textSpan: '状态：',
          text: res.status === 0 ? '开启' : '关闭'
        }
      ]
    }
  ]

  state.detailsInfoSecond = [
    {
      baseTitle: '基本属性',
      infoArr: [
        // {
        //   textSpan: '类型：',
        //   text: tempArrTypeString,
        //   isFull: true
        // },
        {
          textSpan: '是否有销售：',
          text: relVO?.isSale === 0 ? '是' : '否'
        },
        {
          textSpan: '销售品牌：',
          text: tempSaleString
        },
        {
          textSpan: '是否提供救援：',
          text: relVO?.isRescue === 0 ? '是' : '否'
        },
        {
          textSpan: '救援品牌：',
          text: tempRescueString
        },
        {
          textSpan: '是否提供维保：',
          text: relVO?.isMaintenance === 0 ? '是' : '否'
        },
        {
          textSpan: '维保品牌：',
          text: tempMaintenanceString
        },
        {
          textSpan: '门店等级：',
          text: '',
          startRating: res.relVO?.startRating
        },
        {
          textSpan: 'logo：',
          text: '暂无上传图片',
          imgUrl: res.relVO?.logoUrl
        },
        {
          textSpan: '门店图片：',
          text: '暂无上传图片',
          imgUrl: res.relVO?.environmentUrl
        },
        // {
        //   textSpan: '门店地址：',
        //   text: companyAddress,
        //   isFull: true
        // },

        {
          textSpan: '门店联系方式：',
          contactInformationOptions: tempArrContactInformationArr,
          isFull: true
        }
      ]
    }
  ]

  console.log('isChildStore', isChildStore)
  if (!isChildStore) {
    // 门店
    state.detailsInfoSecond[0].infoArr.unshift({
      textSpan: '类型：',
      text: tempArrTypeString,
      isFull: true
    })
  }

  //高级属性 试运营信息
  state.detailsInfoThree = [
    {
      baseTitle: '高级属性',
      infoArr: [
        {
          textSpan: '公司名称：',
          text: res.relVO?.trialOperationCompanyName
        },
        {
          textSpan: '门店地址：',
          text: res.relVO?.trialOperationStoreAddress
        },
        {
          textSpan: '门店级别：',
          text: res.relVO?.trialOperationStoreLevel
        },
        {
          textSpan: '试运营时间：',
          text: res.relVO?.trialOperationTime
        },
        {
          textSpan: '通知函：',
          text: '',
          isFull: true,
          generalArr: relVO?.noticeLetters
        }
      ]
    }
  ]

  //高级属性 验收信息
  state.detailsInfoFour = [
    {
      baseTitle: '高级属性',
      infoArr: [
        {
          textSpan: '公司名称：',
          text: res.relVO?.companyName
        },
        {
          textSpan: '门店地址：',
          text: res.relVO?.companyAddress
        },
        {
          textSpan: '门店级别：',
          text: res.relVO?.storeLevel
        },
        {
          textSpan: '店面验收评分：',
          text: res.relVO?.storeScore
        },
        {
          textSpan: '建店补偿金额：',
          text: res.relVO?.compensateAmount
        },
        {
          textSpan: '规定运营年限：',
          text: res.relVO?.operationDeadline
        },

        {
          textSpan: '验收通过时间：',
          text: res.relVO?.acceptanceTime
        },
        {
          textSpan: '告知函：',
          text: '',
          isFull: true,
          generalArr: relVO?.notificationLetters
        }
      ]
    }
  ]

  state.isShowDetails = true
  return
}

//获取数据字典
const getOrganizationTypeListFN = async () => {
  const res = await getOrganizationTypeList()
  //机构类型
  state.organizationTypeOptions = res.filter((item) => item.dictType === 'organization_type')
  //分公司类型
  state.branchCompanyTypeOptions = res.filter((item) => item.dictType === 'branch_company_type')
  //门店类型
  state.storeTypeOptions = res.filter((item) => item.dictType === 'store_type')
  //联系方式类型
  state.contactInformationOptions = res.filter((item) => item.dictType === 'contact_type')
  //销售品牌
  state.saleBrandOptions = res.filter((item) => item.dictType === 'sellingBrand')
  //救援品牌
  state.rescueBrandOptions = res.filter((item) => item.dictType === 'rescueBrand')
  //维保品牌
  state.maintenanceBrandOptions = res.filter((item) => item.dictType === 'maintenanceBrand')
  //获取成员列表(不分页) 新增编辑 modal内的负责人list
  // const memberRes = await getMemberList()
  const memberRes = await getMemberAllList()
  //username nickname
  const needReplacePartPostKey = [
    ['tempLabel', 'nickname'],
    ['value', 'id'],
    ['memberNum', 'username']
  ]
  state.memberOptions = reconstructionArrayObject(memberRes, needReplacePartPostKey)
  state.memberOptions.map((item) => {
    item.label = `${item.tempLabel}-${item.memberNum}`
  })
}

const rgbFN = () => {
  //rgb颜色随机
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r},${g},${b})`
}

//关闭Modal
const closeStoreDetailsModal = () => {
  emit('closeStoreDetails', false)
}

//详情 修改
const edit = () => {
  emit('editStoreDetails', props.currentRecord)
}

//详情modal 预览图片
const setPreviewImage = (imgUrl = '') => {
  previewImage.value = imgUrl
  previewTitle.value = '预览'
  previewVisible.value = true
}

//上传的 预览 关闭modal
const handleCancel = () => {
  previewVisible.value = false
  previewTitle.value = ''
}

const previewFile = (item) => {
  state.isShowDialog = !state.isShowDialog
  state.previewTitle = item.fileName
  state.previewUrl = item.fileUrl
}

onMounted(async () => {
  //获取机构类型
  await getOrganizationTypeListFN()
  state.detailsRecord = props.currentRecord
  detailsInfo(props.currentRecord)
})
</script>

<style lang="scss" scoped>
.details-content {
  display: flex;
  flex-direction: column;
}
.flex-space {
  display: flex;
  justify-content: space-between;
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
//详情修改文字
.details-edit {
  width: 50%;
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
  //overflow: hidden;
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
//详情img
.details-img {
  width: 20px;
  height: 20px;
  cursor: pointer;
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
//详情 机构属性  基本信息 类型 独占一行
.width-full {
  width: 100%;
}
.tags-content {
  flex-wrap: wrap;
  display: flex;
}
.tag-content {
  margin-right: 15px;
  margin-bottom: 20px;
  display: flex;
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

.set-attribute-modal {
  //星级
  .ant-rate {
    display: flex;
  }
  [class^='ant-rate-star-'] {
    display: flex;
    align-items: center;
  }
  .ant-select-multiple .ant-select-selection-item-remove {
    display: flex;
    align-items: center;
  }
}

//状态变更
.status-change-modal {
  .ant-modal-footer {
    border-width: 0;
  }
}
</style>
