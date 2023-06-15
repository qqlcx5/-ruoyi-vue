<template>
  <!-- 新增 编辑 Modal 门店-->
  <a-modal
    v-model:visible="state.isShow"
    destroyOnClose
    :title="state.modalTitle"
    wrapClassName="add-edit-modal"
    @cancel="closeModal()"
    :width="'665px'"
    :bodyStyle="{ padding: 0 }"
  >
    <div class="base_info_content" @scroll="handleModalScroll">
      <a-form
        :model="state.formState"
        ref="formRef"
        v-bind="layout"
        :label-col="{ style: { width: '130px' } }"
        autocomplete="off"
      >
        <a-tabs v-model:activeKey="state.activeKey">
          <a-tab-pane key="basicInformation" tab="基础信息">
            <a-form-item
              v-if="props.needStoreSubtyping"
              label="子门店类型"
              name="storeSubtyping"
              :rules="[{ required: true, message: `子门店类型不能为空` }]"
            >
              <a-radio-group
                v-model:value="state.formState.storeSubtyping"
                :disabled="state.modalType === 'edit'"
              >
                <a-radio
                  :value="item.value"
                  :key="`storeSubtyping${index}`"
                  v-for="(item, index) in state.childStoreOptions"
                  >{{ item.label }}</a-radio
                >
              </a-radio-group>
            </a-form-item>

            <a-form-item :label="`上级主体`" name="belongTenantId" v-if="props.needBelongTenantId">
              <a-tree-select
                v-model:value="state.formState.belongTenantId"
                :disabled="state.modalType === 'edit'"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择上级主体"
                :tree-data="state.majorIndividualOption"
                :fieldNames="{ children: 'children', label: 'name', value: 'id' }"
                treeNodeFilterProp="name"
              />
            </a-form-item>

            <a-form-item :label="`上级机构`" name="parentId" v-if="props.needParentId">
              <a-tree-select
                v-model:value="state.formState.parentId"
                :disabled="props.storeType !== organizationType.store"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择上级机构"
                :tree-data="state.optionalMenuTree"
                :fieldNames="{ children: 'children', label: 'name', value: 'id' }"
                treeNodeFilterProp="name"
              />
            </a-form-item>

            <a-form-item
              :label="`专营店编码`"
              name="specialtyCode"
              :rules="[
                { required: true, message: `专营店编码不能为空` },
                { validator: enNumValidator }
              ]"
            >
              <!--  门店不禁 子门店 主体管理进不禁 机构管理进 禁 -->
              <a-input
                v-model:value="state.formState.specialtyCode"
                :disabled="
                  state.storeType !== organizationType.store && props.fromPage === 'organization'
                "
                show-count
                :maxlength="20"
                placeholder="请输入专营店编码"
              />
            </a-form-item>

            <a-form-item
              :label="`机构名称`"
              name="name"
              :rules="[{ required: true, message: `机构名称不能为空` }]"
            >
              <a-input
                v-model:value="state.formState.name"
                @change="nameChange"
                show-count
                :maxlength="20"
                placeholder="请输入机构名称"
              />
            </a-form-item>

            <a-form-item
              :label="`机构编码`"
              name="code"
              :rules="[
                { required: true, message: `机构编码不能为空` },
                { validator: enNumValidator }
              ]"
            >
              <a-input
                v-model:value="state.formState.code"
                show-count
                :maxlength="50"
                placeholder="请输入机构编码"
              />
            </a-form-item>

            <a-form-item
              :label="`机构简称`"
              name="abbreviate"
              :rules="[{ validator: chineseValidator }]"
            >
              <a-input
                v-model:value="state.formState.abbreviate"
                show-count
                :maxlength="10"
                placeholder="请输入机构简称"
              />
            </a-form-item>

            <a-form-item
              :label="`品牌`"
              name="brand"
              :rules="[{ required: true, message: '品牌不能为空!' }]"
            >
              <a-tree-select
                v-model:value="state.formState.brand"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择品牌，可多选"
                multiple
                :tree-data="state.barnOptions"
              />
            </a-form-item>

            <!--  级联选择器  - -   -->
            <a-form-item
              :label="`地址`"
              name="detailedAddress"
              :rules="[{ required: true, message: '地址不能为空!' }]"
            >
              <div class="flex-content adress-content">
                <a-form-item-rest>
                  <a-cascader
                    v-model:value="state.formState.companyAddress"
                    :options="state.proMunAreaList"
                    @change="cascadeChange"
                    placeholder="请选择省市区"
                    class="adress-cascader"
                  />
                </a-form-item-rest>
                <a-input
                  v-model:value="state.formState.detailedAddress"
                  placeholder="请输入详细的公司地址，具体门牌号"
                  class="adress-input"
                />
              </div>
            </a-form-item>

            <a-form-item :label="`负责人`" name="contactName">
              <a-tree-select
                v-model:value="state.formState.contactName"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择负责人"
                :tree-data="state.memberOptions"
                treeNodeFilterProp="label"
                @change="getPhoneList"
              />
            </a-form-item>

            <a-form-item label="负责人电话" name="contactMobile" :rules="state.contactMobileRules">
              <!--          <a-input v-model:value="state.formState.contactMobile" placeholder="请输入负责人电话" />-->
              <a-select
                v-model:value="state.formState.contactMobile"
                class="width-100"
                :options="state.memberPhoneOptions"
                placeholder="请选择负责人电话"
                optionFilterProp="label"
              />
            </a-form-item>

            <a-form-item label="负责人邮箱" name="contactMail" :rules="state.contactMailRules">
              <a-input v-model:value="state.formState.contactMail" placeholder="请输入负责人邮箱" />
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
          </a-tab-pane>
          <a-tab-pane key="underlyingAttribute" tab="基础属性" force-render>
            <a-form-item
              label="分公司类型"
              :rules="[{ required: true, message: `分公司类型不能为空` }]"
              v-if="
                props.needOrganizationType &&
                (state.currentType === organizationType.branchCompany ||
                  state.currentType === '分公司' ||
                  state.detailsRecord?.type === organizationType.branchCompany)
              "
            >
              <a-radio-group v-model:value="state.formState.type">
                <a-radio
                  :value="item.value"
                  :key="`type${index}`"
                  name="type"
                  v-for="(item, index) in state.branchCompanyTypeOptions"
                  >{{ item.label }}</a-radio
                >
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="门店类型"
              v-if="
                props.needOrganizationType &&
                !(
                  state.currentType === organizationType.branchCompany ||
                  state.currentType === '分公司' ||
                  state.detailsRecord?.type === organizationType.branchCompany
                )
              "
            >
              <a-checkbox-group v-model:value="state.formState.type">
                <a-checkbox
                  v-for="(item, index) in state.storeTypeOptions"
                  :value="item.value"
                  :key="`type${index}`"
                  name="type"
                  >{{ item.label }}</a-checkbox
                >
              </a-checkbox-group>
            </a-form-item>

            <div class="form-content">
              <a-form-item label="是否有销售" name="isSale" class="width-50">
                <a-radio-group v-model:value="state.formState.isSale">
                  <a-radio-button
                    v-for="(item, index) in state.barndOptions"
                    :key="`isSale-${index}`"
                    :value="item.value"
                    >{{ item.label }}</a-radio-button
                  >
                </a-radio-group>
              </a-form-item>

              <a-form-item
                label="销售品牌"
                name="saleBrand"
                class="width-50"
                :rules="[{ required: true, message: `销售品牌不能为空` }]"
                v-if="state.formState.isSale === 0"
              >
                <a-tree-select
                  v-model:value="state.formState.saleBrand"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择销售品牌"
                  multiple
                  :tree-data="state.saleBrandOptions"
                />
              </a-form-item>
            </div>
            <div class="form-content">
              <a-form-item label="是否提供救援" name="isRescue" class="width-50">
                <a-radio-group v-model:value="state.formState.isRescue">
                  <a-radio-button
                    v-for="(item, index) in state.barndOptions"
                    :key="`isRescue-${index}`"
                    :value="item.value"
                    >{{ item.label }}</a-radio-button
                  >
                </a-radio-group>
              </a-form-item>

              <a-form-item
                label="救援品牌"
                name="rescueBrand"
                class="width-50"
                :rules="[{ required: true, message: `救援品牌不能为空` }]"
                v-if="state.formState.isRescue === 0"
              >
                <a-tree-select
                  v-model:value="state.formState.rescueBrand"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择救援品牌"
                  multiple
                  :tree-data="state.rescueBrandOptions"
                />
              </a-form-item>
            </div>
            <div class="form-content">
              <a-form-item label="是否提供维保" name="isMaintenance" class="width-50">
                <a-radio-group v-model:value="state.formState.isMaintenance">
                  <a-radio-button
                    v-for="(item, index) in state.barndOptions"
                    :key="`isMaintenance-${index}`"
                    :value="item.value"
                    >{{ item.label }}</a-radio-button
                  >
                </a-radio-group>
              </a-form-item>

              <a-form-item
                label="维保品牌"
                name="maintenanceBrand"
                class="width-50"
                :rules="[{ required: true, message: `维保品牌不能为空` }]"
                v-if="state.formState.isMaintenance === 0"
              >
                <a-tree-select
                  v-model:value="state.formState.maintenanceBrand"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="请选择维保品牌"
                  multiple
                  :tree-data="state.maintenanceBrandOptions"
                />
              </a-form-item>
            </div>

            <a-form-item :label="`星级`" name="startRating">
              <a-rate v-model:value="state.formState.startRating" allow-half />
            </a-form-item>

            <a-form-item label="系统logo" name="logoUrl">
              <div style="height: 131px">
                <UploadImg
                  v-model:modelValue="state.logoUrlSuccess"
                  fileSize="300"
                  :fileUnit="FileUnit.KB"
                  :resolution="[400, 400]"
                />
                <!--                <a-upload-->
                <!--                  v-model:file-list="state.logoListUrl"-->
                <!--                  :action="updateUrl + '?updateSupport=' + updateSupport"-->
                <!--                  list-type="picture-card"-->
                <!--                  @preview="handlePreview"-->
                <!--                  accept=".jpg, .png, .gif"-->
                <!--                  class="avatar-uploader"-->
                <!--                  :show-upload-list="true"-->
                <!--                  :headers="uploadHeaders"-->
                <!--                  :before-upload="(file, fileList) => beforeUpload(file, fileList, 'logo')"-->
                <!--                  @change="-->
                <!--                    (file, fileList) => {-->
                <!--                      handleChange(file, fileList, 'logo')-->
                <!--                    }-->
                <!--                  "-->
                <!--                  @remove="-->
                <!--                    (file) => {-->
                <!--                      removeImg(file, 'logo')-->
                <!--                    }-->
                <!--                  "-->
                <!--                >-->
                <!--                  <div v-if="state.logoListUrl.length < 1">-->
                <!--                    <Icon icon="svg-icon:add-upload" :size="15" />-->
                <!--                    <div style="margin-top: 8px">上传logo</div>-->
                <!--                  </div>-->
                <!--                </a-upload>-->
                <div class="upload-text"> 支持jpg/png格式，尺寸400px * 400px，不超过300k </div>
              </div>
            </a-form-item>

            <a-form-item label="环境图片" name="environmentUrl">
              <div style="height: 131px">
                <UploadImg
                  v-model:modelValue="state.environmentSuccess"
                  :resolution="[1125, 633]"
                  fileSize="5"
                  width="160px"
                  height="100px"
                />
                <!--                <a-upload-->
                <!--                  v-model:file-list="state.environmentUrl"-->
                <!--                  :action="updateUrl + '?updateSupport=' + updateSupport"-->
                <!--                  list-type="picture-card"-->
                <!--                  @preview="handlePreview"-->
                <!--                  accept=".jpg, .png, .gif , .jpeg"-->
                <!--                  class="avatar-uploader"-->
                <!--                  :show-upload-list="true"-->
                <!--                  :headers="uploadHeaders"-->
                <!--                  :before-upload="(file, fileList) => beforeUpload(file, fileList, 'environment')"-->
                <!--                  @change="-->
                <!--                    (file, fileList) => {-->
                <!--                      handleChange(file, fileList, 'environment')-->
                <!--                    }-->
                <!--                  "-->
                <!--                  @remove="-->
                <!--                    (file) => {-->
                <!--                      removeImg(file, 'legalPerson')-->
                <!--                    }-->
                <!--                  "-->
                <!--                >-->
                <!--                  <div v-if="state.environmentUrl.length < 1">-->
                <!--                    <Icon icon="svg-icon:add-upload" :size="15" />-->
                <!--                    <div style="margin-top: 8px">上传环境图片</div>-->
                <!--                  </div>-->
                <!--                </a-upload>-->

                <div class="upload-text"> 尺寸1125*633px，支持jpg/jpeg/png/gif格式，不超过5M </div>
              </div>
            </a-form-item>

            <a-space
              v-for="(item, index) in state.formState.contactInformationArr"
              :key="item.id"
              style="display: flex; margin-bottom: 0px"
              align="baseline"
            >
              <a-form-item :name="['contactInformationArr', index, 'mobile']" label="联系方式">
                <a-select
                  v-model:value="item.contactType"
                  placeholder="请选择联系方式"
                  style="width: 200px"
                  :options="state.contactInformationOptions"
                />
              </a-form-item>
              <a-form-item
                :name="['contactInformationArr', index, 'mobile']"
                :rules="[{ validator: numValidator }]"
              >
                <a-input
                  v-model:value="item.mobile"
                  placeholder="请输入联系电话"
                  style="width: 130px"
                />
              </a-form-item>

              <Icon
                icon="svg-icon:add-circle"
                class="add-circle"
                :size="20"
                @click="addContactInformation()"
              />
              <Icon
                v-if="state.formState.contactInformationArr?.length > 1"
                icon="svg-icon:reduce-circle"
                class="add-circle"
                :size="20"
                @click="removeContactInformation(item)"
              />
            </a-space>

            <div class="title-content"><div class="blue-line"></div> 详细属性 </div>
            <a-form-item :label="`统一社会信用代码`" name="creditCode">
              <a-input
                v-model:value="state.formState.creditCode"
                placeholder="请输入统一社会信用代码"
              />
            </a-form-item>

            <a-form-item :label="`法定代表人`" name="legalRepresentative">
              <a-input
                v-model:value="state.formState.legalRepresentative"
                placeholder="请输入法定代表人姓名"
              />
            </a-form-item>

            <a-form-item label="法人电话" name="legalMobile" :rules="state.legalMobileRules">
              <a-input
                v-model:value="state.formState.legalMobile"
                placeholder="请输入法人联系电话"
              />
            </a-form-item>

            <a-form-item :label="`成立日期`" name="establishDate">
              <a-date-picker
                ref="establishRef"
                v-model:value="state.formState.establishDate"
                format="YYYY/MM/DD"
                placeholder="请选择时间"
              />
            </a-form-item>

            <a-form-item label="法人身份证" name="legalIdentityUrl">
              <div style="height: 131px">
                <UploadImg
                  v-model:modelValue="state.legalPersonUrlSuccess"
                  width="160px"
                  height="100px"
                />
                <!--                <a-upload-->
                <!--                  v-model:file-list="state.legalPersonListUrl"-->
                <!--                  :action="updateUrl + '?updateSupport=' + updateSupport"-->
                <!--                  list-type="picture-card"-->
                <!--                  @preview="handlePreview"-->
                <!--                  accept=".jpg, .png, .gif"-->
                <!--                  class="avatar-uploader"-->
                <!--                  :show-upload-list="true"-->
                <!--                  :headers="uploadHeaders"-->
                <!--                  :before-upload="(file, fileList) => beforeUpload(file, fileList, 'legalPerson')"-->
                <!--                  @change="-->
                <!--                    (file, fileList) => {-->
                <!--                      handleChange(file, fileList, 'legalPerson')-->
                <!--                    }-->
                <!--                  "-->
                <!--                  @remove="-->
                <!--                    (file) => {-->
                <!--                      removeImg(file, 'legalPerson')-->
                <!--                    }-->
                <!--                  "-->
                <!--                >-->
                <!--                  <div v-if="state.legalPersonListUrl.length < 1">-->
                <!--                    <Icon icon="svg-icon:add-upload" :size="15" />-->
                <!--                    <div style="margin-top: 8px">上传法人证件</div>-->
                <!--                  </div>-->
                <!--                </a-upload>-->

                <div class="upload-text">
                  请上传法人的清晰正面人头像身份证照片，支持png/jpg格式的照片
                </div>
              </div>
            </a-form-item>

            <a-form-item label="营业执照" name="businessLicenseUrl">
              <div style="height: 131px">
                <UploadImg
                  v-model:modelValue="state.businessLicenseSuccess"
                  width="160px"
                  height="100px"
                />
                <!--                <a-upload-->
                <!--                  v-model:file-list="state.businessLicenseListUrl"-->
                <!--                  :action="updateUrl + '?updateSupport=' + updateSupport"-->
                <!--                  list-type="picture-card"-->
                <!--                  @preview="handlePreview"-->
                <!--                  accept=".jpg, .png, .gif"-->
                <!--                  class="avatar-uploader"-->
                <!--                  :show-upload-list="true"-->
                <!--                  :headers="uploadHeaders"-->
                <!--                  :before-upload="-->
                <!--                    (file, fileList) => beforeUpload(file, fileList, 'businessLicense')-->
                <!--                  "-->
                <!--                  @change="-->
                <!--                    (file, fileList) => {-->
                <!--                      handleChange(file, fileList, 'businessLicense')-->
                <!--                    }-->
                <!--                  "-->
                <!--                  @remove="-->
                <!--                    (file) => {-->
                <!--                      removeImg(file, 'businessLicense')-->
                <!--                    }-->
                <!--                  "-->
                <!--                >-->
                <!--                  <div v-if="state.businessLicenseListUrl.length < 1">-->
                <!--                    <Icon icon="svg-icon:add-upload" :size="15" />-->
                <!--                    <div style="margin-top: 8px">上传营业执照</div>-->
                <!--                  </div>-->
                <!--                </a-upload>-->

                <div class="upload-text"> 请上传企业的营业执照，支持png/jpg格式的照片</div>
              </div>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="advancedAttribute" tab="高级属性">
            <div class="title-content"><div class="blue-line"></div> 试运营信息 </div>

            <a-form-item :label="`公司名称`" name="trialOperationCompanyName">
              <a-input
                v-model:value="state.formState.trialOperationCompanyName"
                placeholder="请输入公司名称"
                @change="trialOperationCompanyNameChange"
              />
            </a-form-item>

            <a-form-item :label="`门店地址`" name="trialOperationStoreAddress">
              <a-input
                v-model:value="state.formState.trialOperationStoreAddress"
                @change="trialOperationStoreAddressChange"
                placeholder="请输入门店地址"
              />
            </a-form-item>

            <a-form-item :label="`门店级别`" name="trialOperationStoreLevel">
              <a-input
                v-model:value="state.formState.trialOperationStoreLevel"
                @change="trialOperationStoreLevelChange"
                placeholder="请输入门店级别"
              />
            </a-form-item>

            <a-form-item :label="`试运营时间`" name="trialOperationTime">
              <a-date-picker
                ref="operationRef"
                v-model:value="state.formState.trialOperationTime"
                format="YYYY/MM/DD"
                placeholder="请选择时间"
              />
            </a-form-item>

            <a-form-item label="通知函" name="noticeLetter">
              <div style="height: 131px">
                <UploadFile v-model:modelValue="state.noticeLetterSuccess" class="upload-file" />
                <!--                <a-upload-->
                <!--                  v-model:file-list="state.noticeLetterUrl"-->
                <!--                  :action="updateUrl + '?updateSupport=' + updateSupport"-->
                <!--                  @preview="handlePreview"-->
                <!--                  accept=".jpg, .png, .gif"-->
                <!--                  class="avatar-uploader"-->
                <!--                  :show-upload-list="true"-->
                <!--                  :headers="uploadHeaders"-->
                <!--                  :before-upload="(file, fileList) => beforeUpload(file, fileList, 'noticeLetter')"-->
                <!--                  @change="-->
                <!--                    (file, fileList) => {-->
                <!--                      handleChange(file, fileList, 'noticeLetter')-->
                <!--                    }-->
                <!--                  "-->
                <!--                  @remove="-->
                <!--                    (file) => {-->
                <!--                      removeImg(file, 'noticeLetter')-->
                <!--                    }-->
                <!--                  "-->
                <!--                >-->
                <!--                  <a-button> 上传文件 </a-button>-->
                <!--                </a-upload>-->
                <!--                <div class="upload-text"> 支持扩展名：.doc .docx .pdf .jpg</div>-->
              </div>
            </a-form-item>

            <div class="title-content"><div class="blue-line"></div> 验收信息 </div>
            <a-form-item :label="`公司名称`" name="creditCode">
              <a-input
                v-model:value="state.formState.acceptanceCompanyName"
                placeholder="请输入公司名称"
              />
            </a-form-item>

            <a-form-item :label="`门店地址`" name="acceptanceAddress">
              <a-input
                v-model:value="state.formState.acceptanceAddress"
                placeholder="请输入门店地址"
              />
            </a-form-item>

            <a-form-item label="门店级别" name="acceptanceStoreLevel">
              <a-input
                v-model:value="state.formState.acceptanceStoreLevel"
                placeholder="请输入门店级别"
              />
            </a-form-item>

            <a-form-item label="店面验收评分" name="acceptanceStoreLevel">
              <a-input
                v-model:value="state.formState.storeScore"
                placeholder="请输入店面验收评分"
              />
            </a-form-item>

            <a-form-item label="建店补偿金额" name="compensateAmount">
              <a-input
                v-model:value="state.formState.compensateAmount"
                placeholder="请输入建店补偿金额"
              />
            </a-form-item>

            <a-form-item label="规定运营年限" name="operationDeadline">
              <a-input
                v-model:value="state.formState.operationDeadline"
                placeholder="请输入规定运营年限"
              />
            </a-form-item>

            <a-form-item :label="`验收通过时间`" name="acceptanceTime">
              <a-date-picker
                ref="acceptanceRef"
                v-model:value="state.formState.acceptanceTime"
                format="YYYY/MM/DD"
                placeholder="请选择时间"
              />
            </a-form-item>

            <a-form-item label="告知函" name="legalIdentityUrl">
              <div style="height: 131px">
                <UploadFile
                  v-model:modelValue="state.notificationLetterSuccess"
                  class="upload-file"
                />
                <!--                <a-upload-->
                <!--                  v-model:file-list="state.notificationLetterUrl"-->
                <!--                  :action="updateUrl + '?updateSupport=' + updateSupport"-->
                <!--                  @preview="handlePreview"-->
                <!--                  accept=".jpg, .png, .gif"-->
                <!--                  class="avatar-uploader"-->
                <!--                  :show-upload-list="true"-->
                <!--                  :headers="uploadHeaders"-->
                <!--                  :before-upload="-->
                <!--                    (file, fileList) => beforeUpload(file, fileList, 'notificationLetter')-->
                <!--                  "-->
                <!--                  @change="-->
                <!--                    (file, fileList) => {-->
                <!--                      handleChange(file, fileList, 'notificationLetter')-->
                <!--                    }-->
                <!--                  "-->
                <!--                  @remove="-->
                <!--                    (file) => {-->
                <!--                      removeImg(file, 'notificationLetter')-->
                <!--                    }-->
                <!--                  "-->
                <!--                >-->
                <!--                  <a-button> 上传文件 </a-button>-->
                <!--                </a-upload>-->

                <!--                <div class="upload-text"> 支持扩展名：.doc .docx .pdf .jpg </div>-->
              </div>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </div>

    <template #footer>
      <a-button
        type="primary"
        html-type="submit"
        @click="addMajorIndividualFN"
        :loading="state.addEditLoading"
      >
        确认</a-button
      >
      <a-button @click="closeModal()">取消</a-button>
    </template>
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
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import {
  addOrganizationStore,
  getOrganizationStoreDetails,
  getOrganizationTypeList,
  getSimpleOrganizationList,
  getStoreList,
  updateOrganizationStore
} from '@/api/system/organization'
import { getMemberAllList, getMemberAllListBusiness, getMemberPhoneList } from '@/api/system/member'
import { reconstructedTreeData, reconstructionArrayObject } from '@/utils/utils'
import { message, Upload, UploadChangeParam, UploadProps } from 'ant-design-vue'
import { getAccessToken, getTenantId } from '@/utils/auth'
import { provincesMunicipalitiesArea } from '@/constant/pr'
import {
  addChildStore,
  addStore,
  getSimpleTenantList,
  getStoreDetails,
  updateStore
} from '@/api/system/business'
import { handleTree } from '@/utils/tree'
import { organizationType } from '@/utils/constants'
import UploadImg from '@/components/UploadFile/src/UploadImg.vue'
import UploadFile from '@/components/UploadFile/src/UploadFile.vue'
import { FileUnit } from '@/components/UploadFile/src/helper'
import dayjs from 'dayjs'

interface Props {
  tabsActiveKey?: string
  belongTenantId?: string
  parentId?: string
  editRecord?: any
  storeType?: string
  needBelongTenantId?: boolean
  needParentId?: boolean
  needStoreSubtyping?: boolean
  needOrganizationType?: boolean
  useStoreList?: any
  fromPage?: string
}

//needXXX 全部单独传进来 而不在组件内 通过门店 or 子门店判断 - - 免得到时候 产品又叠需求跟修改 到时候不好改
const props = withDefaults(defineProps<Props>(), {
  tabsActiveKey: 'basicInformation', //current tab
  belongTenantId: '0', //上级主体
  parentId: '0', //上级机构
  editRecord: {}, //回显
  storeType: organizationType.store, //门店 or 子门店
  needBelongTenantId: true, //是否需要上级主体
  needParentId: true, //是否需要上级机构
  needStoreSubtyping: false, //是否需要子门店类型 子门店需要
  needOrganizationType: true, //基本属性 机构类型 分公司/门店 才有
  useStoreList: {
    needUseStore: false,
    belongTenantId: '0'
  }, //新增子门店 上级机构需要取 当前父级主体下所有的门店
  fromPage: 'business' //默认为主体管理 由于 主体管理与机构管理的门店要走 不同接口(...出入参一样) 因此加个mark
})

const emit = defineEmits<{
  (e: 'closeStore', key: boolean): boolean
}>()

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
    } else {
      resolve()
    }
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

//英文数字
const enNumValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      const regExp = /^[a-zA-Z0-9]+$/
      if (!regExp.test(value)) {
        reject('只能输入字母跟数字')
      } else {
        resolve()
      }
    } else {
      resolve()
    }
  })
}

//限制中文
const chineseValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      const regExp = /^[\u4e00-\u9fa5]*$/
      if (!regExp.test(value)) {
        reject('请输入中文')
      } else {
        resolve()
      }
    } else {
      resolve()
    }
  })
}

//限制数字
const numValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      const regExp = /^[0-9]*$/
      if (!regExp.test(value)) {
        reject('只能输入数字')
      } else {
        resolve()
      }
    } else {
      resolve()
    }
  })
}

// 成立日期组件
const establishRef = ref()
// 试运营时间组件
const operationRef = ref()
// 验收通过时间组件
const acceptanceRef = ref()
/** 弹窗滚动事件 */
const handleModalScroll = () => {
  establishRef.value.blur()
  operationRef.value.blur()
  acceptanceRef.value.blur()
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const formRef = ref()
const state: any = reactive({
  activeKey: 'basicInformation',
  modalType: 'add',
  addEditLoading: false,
  isShow: true, //新增编辑modal
  modalTitle: '新增门店', //modal title
  barnOptions: [],
  formState: {
    storeSubtyping: null, //子门店类型
    belongTenantId: props.belongTenantId || null, //上级主体
    parentId: props.parentId || 0, //上级机构ID
    organizationType: organizationType.store, //机构类型
    specialtyCode: undefined, //专营店编码
    name: '', //机构名称
    code: '', //机构编码
    abbreviate: '', //机构简称
    brand: [], //品牌
    contactName: undefined, //负责人
    contactMobile: undefined, //负责人电话
    contactMail: '', //负责人邮箱
    sort: 0, //排序
    status: true, //状态

    type: [], //分公司类型 门店类型
    isSale: '1', //是否有销售
    saleBrand: [], //销售品牌
    isRescue: '1', //是否提供救援
    rescueBrand: [], //救援品牌
    isMaintenance: '1', //是否提供维保
    maintenanceBrand: [], //维保品牌
    startRating: 0, //星级
    logoUrl: '', //系统logo
    environmentUrl: '', //环境图片
    companyAddress: [], //公司地址
    cascadeInfo: [], //选中的省市区全部信息
    detailedAddress: '', //公司地址 详细地址
    contactInformationArr: [
      {
        contactType: null,
        mobile: '',
        id: Date.now()
      }
    ], //联系方式 设置属性
    // status: true, //状态
    creditCode: '', //统一社会信用代码
    // organizationCode: '', //组织机构代码
    legalRepresentative: '', //法定代表人
    legalMobile: '', //法人联系电话
    legalIdentityUrl: '', //法人身份证
    establishDate: '', //成立日期
    businessLicenseUrl: '', //营业执照

    trialOperationCompanyName: '', //公司名称
    trialOperationStoreAddress: '', //门店地址
    trialOperationStoreLevel: '', //门店级别
    trialOperationTime: null, //试运营时间
    acceptanceCompanyName: '', //验收信息 公司名称
    acceptanceAddress: '', //验收信息 门店地址
    acceptanceStoreLevel: '', //验收信息 门店级别
    storeScore: '', //验收信息 店面验收评分
    compensateAmount: '', //验收信息 建店补偿金额
    operationDeadline: '', //验收信息  规定运营年限
    acceptanceTime: null //验收通过时间
  }, //新增表单
  proMunAreaList: [], //省市区数据
  optionalMenuTree: [], //上级机构 treeList
  organizationTypeOptions: [], //机构类型列表
  childStoreOptions: [], //子门店类型列表
  branchCompanyTypeOptions: [], //分公司类型列表
  majorIndividualOption: [], //上级主体
  memberOptions: [], //新增修改 负责人list
  memberPhoneOptions: [], //新增修改 负责人电话list
  barndOptions: [
    { label: '是', value: 0 },
    { label: '否', value: 1 }
  ],
  logoListUrl: [], //系统logo 上传 回显 - -
  logoUrlSuccess: '', //系统logo 新增编辑入参
  legalPersonListUrl: [], //法人身份证 上传回显
  legalPersonUrlSuccess: '', //法人身份证 新增编辑入参
  businessLicenseListUrl: [], //营业执照 上传回显
  businessLicenseSuccess: '', //营业执照 新增编辑入参
  environmentUrl: [], //环境图片 上传回显
  environmentSuccess: '', //环境图片 新增编辑入参
  noticeLetterUrl: [], //通知函 上传回显
  noticeLetterSuccess: [], //通知函 新增编辑入参
  notificationLetterUrl: [], //告知函 上传回显
  notificationLetterSuccess: [], //告知函 新增编辑入参
  legalMobileRules: [{ validator: legalMobileValidator }],
  contactMobileRules: [{ validator: contactMobileValidator }],
  contactMailRules: [{ validator: contactMailRulesValidator }]
})

const loading = ref<boolean>(false)
const imageUrl = ref<string>('')
let updateUrl = import.meta.env.VITE_UPLOAD_URL
let regVersion = import.meta.env.VITE_REG_VERSION
const updateSupport = ref(0)
const uploadHeaders = ref({
  Authorization: 'Bearer ' + getAccessToken(),
  'tenant-id': getTenantId(),
  'Reg-Version': regVersion
})

//关闭Modal
const closeModal = (isRefresh = false) => {
  console.log('isRefresh???/**/', isRefresh)
  emit('closeStore', isRefresh)
}

const getPhoneList = async (value) => {
  const res = await getMemberPhoneList({ id: value })
  state.memberPhoneOptions = []
  res.map((item) => {
    state.memberPhoneOptions.push({
      label: item,
      value: item
    })
  })
  if (res?.length > 0) {
    state.formState.contactMobile = res[0]
  }
}

//新增机构
const addMajorIndividualFN = async () => {
  console.log('state.noticeLetterSuccess', state.noticeLetterSuccess)
  if (
    state.activeKey !== 'basicInformation' &&
    (!state.formState.name ||
      !state.formState.code ||
      !state.formState.brand.length > 0 ||
      !state.formState.detailedAddress ||
      !state.formState.specialtyCode)
  ) {
    //基础信息
    state.activeKey = 'basicInformation'
  }

  if (
    state.activeKey !== 'underlyingAttribute' &&
    state.formState.name &&
    state.formState.code &&
    state.formState.brand.length > 0 &&
    state.formState.detailedAddress &&
    ((state.formState.isSale === 0 && state.formState.saleBrand.length === 0) ||
      (state.formState.isRescue === 0 && state.formState.rescueBrand.length === 0) ||
      (state.formState.isMaintenance === 0 && state.formState.maintenanceBrand.length === 0))
  ) {
    //基础属性
    state.activeKey = 'underlyingAttribute'
  }
  // 校验表单
  if (!formRef) return
  await formRef.value.validate()

  console.log('state.formState.saleBrand', state.formState.saleBrand)
  state.addEditLoading = true
  const tempNoticeLetter: any = []
  const tempNotificationLetter: any = []

  state.noticeLetterSuccess.map((item) => {
    tempNoticeLetter.push({
      fileName: item.fileName || item.name,
      fileUrl: item.fileUrl || item.url //通知函
    })
  })

  state.notificationLetterSuccess.map((item) => {
    tempNotificationLetter.push({
      fileName: item.fileName || item.name,
      fileUrl: item.fileUrl || item.url //告知函
    })
  })

  let params = {
    tenantId: state.formState.belongTenantId, //上级主体
    parentId: props.needBelongTenantId ? '0' : state.formState.parentId, //上级机构
    // organizationType: state.formState.organizationType, //机构类型
    organizationType: organizationType.store, //机构类型 门店
    name: state.formState.name, //机构名称
    code: state.formState.code, //机构编码
    abbreviate: state.formState.abbreviate, //机构简称
    specialtyCode: state.formState.specialtyCode, //专营店编码
    brandIds: state.formState.brand, //品牌
    address: state.formState.detailedAddress, //公司地址 详细地址
    contactId: state.formState.contactName, //负责人
    contactMobile: state.formState.contactMobile, //负责人电话
    contactMail: state.formState.contactMail, //负责人邮箱
    sort: state.formState.sort, //排序
    status: state.formState.status, //状态

    organizationRel: {
      type: state.formState.type, //分公司类型
      isSale: state.formState.isSale, //是否有销售
      saleBrand: state.formState.isSale === 0 ? state.formState.saleBrand : [], //销售品牌
      isRescue: state.formState.isRescue, //是否提供救援
      rescueBrand: state.formState.isRescue === 0 ? state.formState.rescueBrand : [], //救援品牌
      isMaintenance: state.formState.isMaintenance, //是否提供维保
      maintenanceBrand: state.formState.isMaintenance === 0 ? state.formState.maintenanceBrand : [], //维保品牌
      startRating: state.formState.startRating, //星级
      logoUrl: state.logoUrlSuccess, //系统logo
      environmentUrl: state.environmentSuccess, //环境图片
      contact: state.formState.contactInformationArr, //联系方式 设置属性
      creditCode: state.formState.creditCode, //统一社会信用代码
      legalRepresentative: state.formState.legalRepresentative, //法定代表人
      legalMobile: state.formState.legalMobile, //法人联系电话
      legalIdentityUrl: state.legalPersonUrlSuccess, //法人身份证
      businessLicenseUrl: state.businessLicenseSuccess, //营业执照

      trialOperationCompanyName: state.formState.trialOperationCompanyName, //试运营公司名称
      trialOperationStoreAddress: state.formState.trialOperationStoreAddress, //门店地址
      trialOperationStoreLevel: state.formState.trialOperationStoreLevel, //门店级别
      // trialOperationTime: state.formState.trialOperationTime, //试运营时间
      companyName: state.formState.acceptanceCompanyName, //验收信息 公司名称
      companyAddress: state.formState.acceptanceAddress, //验收信息 门店地址
      storeLevel: state.formState.acceptanceStoreLevel, //验收信息 门店级别
      storeScore: state.formState.storeScore, //验收信息 店面验收评分
      compensateAmount: state.formState.compensateAmount, //验收信息 建店补偿金额
      operationDeadline: state.formState.operationDeadline, //验收信息 规定运营年限
      // acceptanceTime: state.formState.acceptanceTime //验收信息 验收通过时间

      noticeLetters: tempNoticeLetter, //通知函
      notificationLetters: tempNotificationLetter //告知函
    }
  }

  if (state.formState.belongTenantId) {
    params['tenantId'] = state.formState.belongTenantId
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

  if (state.formState.establishDate) {
    params['establishDate'] = state.formState.establishDate?.format('YYYY-MM-DD') //成立日期
  }

  if (state.formState.trialOperationTime) {
    params.organizationRel['trialOperationTime'] =
      state.formState.trialOperationTime.format('YYYY-MM-DD') //试运营时间
  }

  if (state.formState.acceptanceTime) {
    params.organizationRel['acceptanceTime'] = state.formState.acceptanceTime?.format('YYYY-MM-DD') //验收通过时间
  }

  try {
    if (state.modalType === 'add') {
      // await addOrganization(params)
      switch (props.fromPage) {
        case 'business':
          if (props.storeType != organizationType.store) {
            //  非门店 判定为 子门店
            params['storeSubtyping'] = state.formState.storeSubtyping
            await addChildStore(params)
          } else {
            //主体管理新增门店
            await addStore(params)
          }

          break
        default:
          //机构管理
          await addOrganizationStore(params)
      }

      message.success('新增成功')
    } else {
      params['id'] = state.formState.id
      params.organizationRel['id'] = state.formState.attributeId
      params.organizationRel['organizationId'] = state.formState.id
      switch (props.fromPage) {
        case 'business':
          //主体管理新增门店
          await updateStore(params)
          break
        default:
          //机构管理
          await updateOrganizationStore(params)
      }

      message.success('修改成功')
    }

    closeModal(true)
  } finally {
    state.addEditLoading = false
  }
}

const rgbFN = () => {
  //rgb颜色随机
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r},${g},${b})`
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
//上传的 预览 关闭modal
const handleCancel = () => {
  previewVisible.value = false
  previewTitle.value = ''
}
//上传图片预览
const handlePreview = async (file) => {
  console.log('file', file)
  //   const w = window.open(file.url);
  //   //延迟刷新浏览器标签页名 防止不显示
  //   setTimeout(function () {
  //     w.document.title = `${file.name}`
  //   }, 100);
  // return
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
        if (width && this.width != width) {
          // message.error('请上传宽小于' + width + 'px的图片')
          message.error('请上传' + width + 'px*' + height + 'px的图片')
          resolve(false)
          // reject(false)
        } else if (height && this.height != height) {
          // message.error('请上传高小于' + height + 'px的图片')
          message.error('请上传' + width + 'px*' + height + 'px的图片')
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
  if (type === 'environment') {
    //环境图片
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
    if (!isJpgOrPng) {
      message.error('仅支持jpg/jpeg/png/gif格式')
      return Upload.LIST_IGNORE
    }
  } else if (type === 'noticeLetter') {
    //通知函
    if (state.noticeLetterUrl.length === 3) {
      message.warning(`通知函最多只能上传三个`)
      return Upload.LIST_IGNORE
    }
  } else if (type === 'notificationLetter') {
    //告知函
    if (state.notificationLetterUrl.length === 3) {
      message.warning(`告知函最多只能上传三个`)
      return Upload.LIST_IGNORE
    }
  } else {
    //其他图片上传
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('仅支持jpg/png格式')
      return Upload.LIST_IGNORE
    }
  }
  //是否放行  - - 图片 宽高 满足 则放行
  let isTrue = true
  switch (type) {
    case 'logo':
      isTrue = await checkImageWH(file, 400, 400)
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
    case 'environment':
      isTrue = await checkImageWH(file, 1125, 633)
      if (!isTrue) {
        //不上传 包括前端不显示
        return Upload.LIST_IGNORE
      }

      const isLt5M = file.size / 1024 / 1024 < 5
      //max 5M
      if (!isLt5M) {
        message.error('图片不能超过5M')
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
      case 'environment':
        if (!info?.file.response?.data) {
          message.error(info?.file.response?.msg)
          state.environmentUrl = []
          return
        }
        state.environmentSuccess = info?.file.response?.data?.store || ''
        break
      case 'noticeLetter':
        if (!info?.file.response?.data) {
          message.error(info?.file.response?.msg)
          // state.noticeLetterUrl = []
          return
        }
        const tempNoticeLetter = state.noticeLetterUrl.filter((item) => item?.status != 'error')
        state.noticeLetterSuccess = []
        tempNoticeLetter.map((item) => {
          if (item.status === 'done') {
            state.noticeLetterSuccess.push({
              fileName: item.name,
              fileUrl: item.response?.data?.store
            })
          }
        })

        console.log('state.noticeLetterUrl', state.noticeLetterUrl)
        console.log('state.noticeLetterSuccess===>', state.noticeLetterSuccess)
        break
      case 'notificationLetter':
        if (!info?.file.response?.data) {
          message.error(info?.file.response?.msg)
          // state.notificationLetterUrl = []
          return
        }
        const tempNotificationLetterUrl = state.notificationLetterUrl.filter(
          (item) => item?.status != 'error'
        )
        console.log('state.notificationLetterUrl', state.notificationLetterUrl)
        console.log('tempNotificationLetterUrl', tempNotificationLetterUrl)
        state.notificationLetterSuccess = []
        tempNotificationLetterUrl.map((item) => {
          if (item.status === 'done') {
            state.notificationLetterSuccess.push({
              fileName: item.name,
              fileUrl: item.response?.data?.store
            })
          }
        })
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
    switch (type) {
      case 'logo':
        state.logoListUrl = []
        break
      case 'legalPerson':
        state.legalPersonListUrl = []
        break
      case 'businessLicense':
        state.businessLicenseListUrl = []
        break
      case 'environment':
        state.environmentUrl = []
        break
      case 'noticeLetter':
        state.noticeLetterUrl = state.noticeLetterUrl.filter((item) => item?.status != 'error')
        break
      case 'notificationLetter':
        state.notificationLetterUrl = state.notificationLetterUrl.filter(
          (item) => item?.status != 'error'
        )
        break
    }
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
    case 'environment':
      //环境图片
      state.environmentUrl = [] //环境图片 上传回显
      state.environmentSuccess = '' //环境图片 新增编辑入参
      break
    case 'noticeLetter':
      //通知函 新增编辑入参
      state.noticeLetterSuccess = state.noticeLetterSuccess.filter(
        (item) => item.fileUrl != file.fileUrl
      )
      break
    case 'notificationLetter':
      //告知函 新增编辑入参
      state.notificationLetterSuccess = state.notificationLetterSuccess.filter(
        (item) => item.fileUrl != file.fileUrl
      )
      console.log('state.notificationLetterSuccess', state.notificationLetterSuccess)
      break
  }
}

//级联选择器选中的内容 改变
const cascadeChange = (value, selectedOptions) => {
  state.formState.cascadeInfo = selectedOptions
}

//设置属性 动态添加联系方式
const addContactInformation = () => {
  state.formState.contactInformationArr.push({
    contactType: null,
    mobile: '',
    id: Date.now()
  })
}
//设置属性 动态删除联系方式
const removeContactInformation = (item) => {
  let index = state.formState.contactInformationArr.indexOf(item)
  if (index !== -1) {
    state.formState.contactInformationArr.splice(index, 1)
  }
}

//机构名称change
const nameChange = () => {
  state.formState.trialOperationCompanyName = state.formState.acceptanceCompanyName =
    state.formState.name
}
//试运营 公司名称change
const trialOperationCompanyNameChange = () => {
  state.formState.acceptanceCompanyName = state.formState.trialOperationCompanyName
}
//试运营 门店地址change
const trialOperationStoreAddressChange = () => {
  state.formState.acceptanceAddress = state.formState.trialOperationStoreAddress
}
//试运营 门店级别change
const trialOperationStoreLevelChange = () => {
  state.formState.acceptanceStoreLevel = state.formState.trialOperationStoreLevel
}

//获取数据字典
const getOrganizationTypeListFN = async () => {
  let majorIndividualOptionRes = await getSimpleTenantList()
  // 新增门店 上级主体 只有经销商
  majorIndividualOptionRes = majorIndividualOptionRes.filter((item) => item.type === 'dealer')
  state.majorIndividualOption = handleTree(
    majorIndividualOptionRes,
    'id',
    'belongTenantId',
    'children'
  )
  const res = await getOrganizationTypeList()
  //机构类型
  state.organizationTypeOptions = res.filter((item) => item.dictType === 'organization_type')
  //子门店类型
  state.childStoreOptions = res.filter((item) => item.dictType === 'store_subtyping')
  //分公司类型
  state.branchCompanyTypeOptions = res.filter((item) => item.dictType === 'branch_company_type')
  //品牌
  const tempBarnOptions = res.filter((item) => item.dictType === 'brand')
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
  let memberRes = []
  if (props.fromPage === 'business') {
    //主体管理
    //TODO 主体管理内 门店与子门店 需要tenantId  没空没空 先全上 有空再看取哪个
    memberRes = await getMemberAllListBusiness({
      tenantId:
        props.editRecord.belongTenantId ||
        props.editRecord.tenantId ||
        props.useStoreList.belongTenantId ||
        state.formState.belongTenantId
    })
  } else {
    //机构管理页面
    memberRes = await getMemberAllList()
  }
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

  state.barnOptions = tempBarnOptions
}
//获取机构类型
getOrganizationTypeListFN()

const getOrganizationDetailsFN = async () => {
  if (props.useStoreList.needUseStore) {
    //子门店 上级机构为 父级主体 底下所有门店
    const storeListRes = await getStoreList({ tenantId: props.useStoreList.belongTenantId })
    console.log('storeList', storeListRes)
    state.optionalMenuTree = handleTree(storeListRes, 'id', 'parentId', 'children')
  } else {
    const majorIndividualRes = await getSimpleOrganizationList({ status: 0 })
    let menuTree = []
    // let menu = {}
    let menu: Tree = { id: 0, name: '顶层机构', children: [] }
    menu.children = handleTree(majorIndividualRes, 'id', 'parentId', 'children')
    menuTree.push(menu)
    // const menuTree = handleTree(res, 'id', 'parentId', 'children')
    //上级机构
    state.optionalMenuTree = menuTree
    console.log('state.optionalMenuTree', state.optionalMenuTree)
  }

  if (Object.keys(props.editRecord).length === 0) {
    //空对象判断
    state.modalType = 'add'
    state.modalTitle = '新增门店'
    if (props.storeType != organizationType.store) {
      //  非门店 判定为 子门店
      state.modalTitle = '新增子门店'
    }
    return
  } else {
    state.modalType = 'edit'
    state.modalTitle = '修改门店'
    if (props.storeType != organizationType.store) {
      //  非门店 判定为 子门店
      state.modalTitle = '修改子门店'
    }
    state.activeKey = props.tabsActiveKey
  }

  //获取机构详情
  // const res = await getOrganizationDetails({ id: props.editRecord.id })
  const params: any = {
    id: props.editRecord.id,
    tenantId: props.editRecord.belongTenantId || props.editRecord.tenantId
  }
  let res: any
  // const res = await getOrganizationStoreDetails({
  //   id: props.editRecord.id,
  //   tenantId: props.editRecord.belongTenantId || props.editRecord.tenantId
  // })

  switch (props.fromPage) {
    case 'business':
      //主体管理 门店 详情
      res = await getStoreDetails(params)
      break
    default:
      //机构管理
      res = await getOrganizationStoreDetails(params)
  }

  //... res 可能为null
  // let tempType = [] || ''
  console.log('详情res', res)

  // if (record.organizationType == '分公司') {
  //   tempType = res?.relVO?.type[0]
  // } else {
  //   tempType = res?.relVO?.type
  // }

  //赋值 回显
  state.formState = {
    id: res.id, //机构id
    storeSubtyping: res?.storeSubtyping, //子门店类型
    belongTenantId: res.tenantId, //上级主体
    parentId: res.parentId, //上级机构ID
    organizationType: res.organizationType, //机构类型
    name: res.name, //机构名称
    code: res.code, //机构编码
    abbreviate: res.abbreviate, //机构简称
    specialtyCode: res?.specialtyCode, //专营店编码
    brand: res?.brandIds ? res?.brandIds : [], //品牌
    detailedAddress: res?.address, //地址 详细地址
    // contactName: res.contactName, //负责人
    contactName: res.contactId, //负责人
    contactMobile: res.contactMobile, //负责人电话
    contactMail: res.contactMail, //负责人邮箱
    sort: res.sort, //排序
    status: res.status === 0, //状态

    organizationId: res.id, //机构id
    attributeId: res?.relVO?.id, //机构属性ID
    type: res?.relVO?.type, //分公司类型
    isSale: res?.relVO?.isSale, //是否有销售
    saleBrand: res?.relVO?.saleBrand, //销售品牌
    isRescue: res?.relVO?.isRescue, //是否提供救援
    rescueBrand: res?.relVO?.rescueBrand, //救援品牌
    isMaintenance: res?.relVO?.isMaintenance, //是否提供维保
    maintenanceBrand: res?.relVO?.maintenanceBrand, //维保品牌
    startRating: res?.relVO?.startRating, //星级
    creditCode: res?.relVO?.creditCode, //统一社会信用代码
    legalRepresentative: res?.relVO?.legalRepresentative, //法定代表人
    legalMobile: res?.relVO?.legalMobile, //法人联系电话

    trialOperationCompanyName: res?.relVO?.trialOperationCompanyName, //公司名称
    trialOperationStoreAddress: res?.relVO?.trialOperationStoreAddress, //门店地址
    trialOperationStoreLevel: res?.relVO?.trialOperationStoreLevel, //门店级别
    // trialOperationTime: null, //试运营时间
    acceptanceCompanyName: res?.relVO?.companyName, //验收信息 公司名称
    acceptanceAddress: res?.relVO?.companyAddress, //验收信息 门店地址
    acceptanceStoreLevel: res?.relVO?.storeLevel, //验收信息 门店级别
    storeScore: res?.relVO?.storeScore, //验收信息 店面验收评分
    compensateAmount: res?.relVO?.compensateAmount, //验收信息 建店补偿金额
    operationDeadline: res?.relVO?.operationDeadline //验收信息  规定运营年限
    // acceptanceTime: null //验收通过时间
  }

  //省市区
  state.formState.companyAddress = []
  state.formState.cascadeInfo = []
  if (res?.provinceCode) {
    state.formState.companyAddress.push(res?.provinceCode)
    state.formState.cascadeInfo.push({
      label: res?.province,
      value: res?.provinceCode
    })
  }
  if (res?.cityCode) {
    state.formState.companyAddress.push(res?.cityCode)
    state.formState.cascadeInfo.push({
      label: res?.city,
      value: res?.cityCode
    })
  }
  if (res?.countyCode) {
    state.formState.companyAddress.push(res?.countyCode)
    state.formState.cascadeInfo.push({
      label: res?.county,
      value: res?.countyCode
    })
  }

  //联系方式 设置属性
  const tempArr: any = []
  if (res?.relVO?.contact) {
    res?.relVO?.contact.map((item) => {
      tempArr.push({
        contactType: item.contactType === '' ? null : item.contactType,
        mobile: item.mobile
      })
    })
  }

  state.formState.contactInformationArr = tempArr

  if (res.relVO?.contact === null || res?.relVO === null) {
    state.formState.contactInformationArr = [
      {
        contactType: null,
        mobile: '',
        id: Date.now()
      }
    ] //联系方式 设置属性
  }

  if (res?.relVO?.logoUrl) {
    state.logoListUrl = [
      {
        url: res?.relVO?.logoUrl //系统logo
      }
    ]
    state.logoUrlSuccess = res?.relVO?.logoUrl
  }

  if (res?.relVO?.legalIdentityUrl) {
    state.legalPersonListUrl = [
      {
        url: res?.relVO?.legalIdentityUrl //法人身份证
      }
    ]
    state.legalPersonUrlSuccess = res?.relVO?.legalIdentityUrl
  }

  if (res?.relVO?.businessLicenseUrl) {
    state.businessLicenseListUrl = [
      {
        url: res?.relVO?.businessLicenseUrl //营业执照
      }
    ]
    state.businessLicenseSuccess = res?.relVO?.businessLicenseUrl
  }

  if (res?.relVO?.environmentUrl) {
    state.environmentUrl = [
      {
        url: res?.relVO?.environmentUrl //环境图片
      }
    ]
    state.environmentSuccess = res?.relVO?.environmentUrl
  }

  if (res?.relVO?.establishDate) {
    state.formState['establishDate'] = dayjs(res?.relVO?.establishDate) //成立日期
  }
  if (res?.relVO?.trialOperationTime) {
    state.formState['trialOperationTime'] = dayjs(res?.relVO?.trialOperationTime) //试运营时间
  }
  if (res?.relVO?.acceptanceTime) {
    state.formState['acceptanceTime'] = dayjs(res?.relVO?.acceptanceTime) //验收通过时间
  }

  if (res?.relVO?.noticeLetters) {
    res?.relVO?.noticeLetters.map((item) => {
      state.noticeLetterUrl.push({
        name: item.fileName,
        status: 'done',
        url: item.fileUrl, //通知函
        fileName: item.fileName,
        fileUrl: item.fileUrl //通知函
      })
    })
    state.noticeLetterSuccess = state.noticeLetterUrl
  }

  if (res?.relVO?.notificationLetters) {
    res?.relVO?.notificationLetters.map((item) => {
      state.notificationLetterUrl.push({
        name: item.fileName,
        status: 'done',
        url: item.fileUrl, //告知函
        fileName: item.fileName,
        fileUrl: item.fileUrl //告知函
      })
    })
    state.notificationLetterSuccess = state.notificationLetterUrl
  }
}

getOrganizationDetailsFN()

//处理省市区数据
// 树结构数据过滤 数组中嵌数组 里面的数组为需要替换的属性名以及替换后的属性名
let needReplaceKey = [
  ['label', 'fullname'],
  ['value', 'code']
]
state.proMunAreaList = reconstructedTreeData(provincesMunicipalitiesArea, needReplaceKey)
</script>

<style lang="scss" scoped>
.base_info_content {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 520px;
  margin: 0;
  overflow: auto;
  padding: 20px;
}
.width-50 {
  width: 50%;
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
//新增修改 modal 上传 底下文字
.upload-text {
  color: rgba(153, 153, 153, 1);
  font-size: 12px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
.adress-content {
  width: 458px;
}
.adress-cascader {
  width: 210px !important;
}
.adress-input {
  width: 248px !important;
}
//设置属性 联系方式  +
.add-circle {
  position: relative;
  top: 5px;
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
//蓝色竖线
.blue-line {
  width: 3px;
  height: 14px;
  margin: 3px;
  background-color: rgba(0, 129, 255, 1);
}
.form-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
<style lang="scss">
//新增 编辑 modal
.add-edit-modal {
  .upload-file {
    .el-upload__input {
      display: none;
    }
  }
}
</style>
