<template>
  <!-- 新增 编辑 Modal 门店-->
  <a-modal
    v-model:visible="state.isShow"
    destroyOnClose
    :title="state.modalTitle"
    wrapClassName="add-edit-modal"
    @cancel="closeModal"
    :width="'665px'"
    :bodyStyle="{ height: '520px', margin: '0', padding: '20px', overflow: 'auto' }"
  >
    <div class="base_info_content">
      <a-form
        :model="state.formState"
        ref="formRef"
        v-bind="layout"
        :label-col="{ style: { width: '130px' } }"
        autocomplete="off"
      >
        <a-tabs v-model:activeKey="state.activeKey">
          <a-tab-pane key="basicInformation" tab="基础信息">
            <a-form-item :label="`上级机构`" name="parentId">
              <a-tree-select
                v-model:value="state.formState.parentId"
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
          </a-tab-pane>
          <a-tab-pane key="underlyingAttribute" tab="基础属性" force-render>
            <a-form-item
              label="分公司类型"
              :rules="[{ required: true, message: `分公司类型不能为空` }]"
              v-if="
                state.currentType === '2' ||
                state.currentType === '分公司' ||
                state.detailsRecord?.type === '2'
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
              :rules="[{ required: true, message: `门店类型不能为空` }]"
              v-else
            >
              <a-checkbox-group v-model:value="state.formState.type">
                <a-checkbox
                  v-for="(item, index) in state.storeTypeOptions"
                  :value="item.value"
                  :key="`type${index}`"
                  name="type"
                  :rules="[{ required: true, message: '门店类型不能为空!' }]"
                  >{{ item.label }}</a-checkbox
                >
              </a-checkbox-group>
            </a-form-item>

            <div class="form-content">
              <a-form-item
                label="是否有销售"
                name="isSale"
                class="width-50"
                :rules="[{ required: true, message: `是否有销售不能为空` }]"
              >
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
                name="isSale"
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
              <a-form-item
                label="是否提供救援"
                name="isRescue"
                class="width-50"
                :rules="[{ required: true, message: `是否提供救援不能为空` }]"
              >
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
              <a-form-item
                label="是否提供维保"
                name="isMaintenance"
                class="width-50"
                :rules="[{ required: true, message: `是否提供维保不能为空` }]"
              >
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
                <a-upload
                  v-model:file-list="state.logoListUrl"
                  :action="updateUrl + '?updateSupport=' + updateSupport"
                  list-type="picture-card"
                  @preview="handlePreview"
                  accept=".jpg, .png, .gif"
                  class="avatar-uploader"
                  :show-upload-list="true"
                  :headers="uploadHeaders"
                  :before-upload="(file, fileList) => beforeUpload(file, fileList, 'logo')"
                  @change="
                    (file, fileList) => {
                      handleChange(file, fileList, 'logo')
                    }
                  "
                  @remove="
                    (file) => {
                      removeImg(file, 'logo')
                    }
                  "
                >
                  <div v-if="state.logoListUrl.length < 1">
                    <Icon icon="svg-icon:add-upload" :size="15" />
                    <div style="margin-top: 8px">上传logo</div>
                  </div>
                </a-upload>
                <div class="upload-text"> 支持jpg/png格式，尺寸400px * 400px，不超过300k </div>
              </div>
            </a-form-item>

            <a-form-item label="环境图片" name="environmentUrl">
              <div style="height: 131px">
                <a-upload
                  v-model:file-list="state.environmentUrl"
                  :action="updateUrl + '?updateSupport=' + updateSupport"
                  list-type="picture-card"
                  @preview="handlePreview"
                  accept=".jpg, .png, .gif , .jpeg"
                  class="avatar-uploader"
                  :show-upload-list="true"
                  :headers="uploadHeaders"
                  :before-upload="(file, fileList) => beforeUpload(file, fileList, 'environment')"
                  @change="
                    (file, fileList) => {
                      handleChange(file, fileList, 'environment')
                    }
                  "
                  @remove="
                    (file) => {
                      removeImg(file, 'legalPerson')
                    }
                  "
                >
                  <div v-if="state.environmentUrl.length < 1">
                    <Icon icon="svg-icon:add-upload" :size="15" />
                    <div style="margin-top: 8px">上传环境图片</div>
                  </div>
                </a-upload>

                <div class="upload-text"> 尺寸1125*633px，支持jpg/jpeg/png/gif格式，不超过5M </div>
              </div>
            </a-form-item>

            <!--  级联选择器  - -   -->
            <a-form-item :label="`地址`" name="detailedAddress">
              <div class="flex-content adress-content">
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
                  class="adress-input"
                />
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

            <a-form-item
              label="状态"
              name="status"
              :rules="[{ required: true, message: '状态不能为空!' }]"
            >
              <a-switch
                v-model:checked="state.formState.status"
                checked-children="开启"
                un-checked-children="关闭"
              />
            </a-form-item>

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
                v-model:value="state.formState.establishDate"
                format="YYYY/MM/DD"
                placeholder="请选择时间"
              />
            </a-form-item>

            <a-form-item label="法人身份证" name="legalIdentityUrl">
              <div style="height: 131px">
                <a-upload
                  v-model:file-list="state.legalPersonListUrl"
                  :action="updateUrl + '?updateSupport=' + updateSupport"
                  list-type="picture-card"
                  @preview="handlePreview"
                  accept=".jpg, .png, .gif"
                  class="avatar-uploader"
                  :show-upload-list="true"
                  :headers="uploadHeaders"
                  :before-upload="(file, fileList) => beforeUpload(file, fileList, 'legalPerson')"
                  @change="
                    (file, fileList) => {
                      handleChange(file, fileList, 'legalPerson')
                    }
                  "
                  @remove="
                    (file) => {
                      removeImg(file, 'legalPerson')
                    }
                  "
                >
                  <div v-if="state.legalPersonListUrl.length < 1">
                    <Icon icon="svg-icon:add-upload" :size="15" />
                    <div style="margin-top: 8px">上传法人证件</div>
                  </div>
                </a-upload>

                <div class="upload-text">
                  请上传法人的清晰正面人头像身份证照片，支持png/jpg格式的照片
                </div>
              </div>
            </a-form-item>

            <a-form-item label="营业执照" name="businessLicenseUrl">
              <div style="height: 131px">
                <a-upload
                  v-model:file-list="state.businessLicenseListUrl"
                  :action="updateUrl + '?updateSupport=' + updateSupport"
                  list-type="picture-card"
                  @preview="handlePreview"
                  accept=".jpg, .png, .gif"
                  class="avatar-uploader"
                  :show-upload-list="true"
                  :headers="uploadHeaders"
                  :before-upload="
                    (file, fileList) => beforeUpload(file, fileList, 'businessLicense')
                  "
                  @change="
                    (file, fileList) => {
                      handleChange(file, fileList, 'businessLicense')
                    }
                  "
                  @remove="
                    (file) => {
                      removeImg(file, 'businessLicense')
                    }
                  "
                >
                  <div v-if="state.businessLicenseListUrl.length < 1">
                    <Icon icon="svg-icon:add-upload" :size="15" />
                    <div style="margin-top: 8px">上传营业执照</div>
                  </div>
                </a-upload>

                <div class="upload-text"> 请上传企业的营业执照，支持png/jpg格式的照片</div>
              </div>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="advancedAttribute" tab="高级属性">

            <div class="title-content"><div class="blue-line"></div> 试运营信息 </div>

            <a-form-item :label="`公司名称`" name="creditCode">
              <a-input
                v-model:value="state.formState.creditCode"
                placeholder="请输入统一社会信用代码"
              />
            </a-form-item>

            <a-form-item :label="`统一社会信用代码`" name="creditCode">
              <a-input
                v-model:value="state.formState.creditCode"
                placeholder="请输入统一社会信用代码"
              />
            </a-form-item>

            <a-form-item :label="`统一社会信用代码`" name="creditCode">
              <a-input
                v-model:value="state.formState.creditCode"
                placeholder="请输入统一社会信用代码"
              />
            </a-form-item>

            <a-form-item label="系统logo" name="logoUrl">
              <div style="height: 131px">
                <a-upload
                  v-model:file-list="state.logoListUrl"
                  :action="updateUrl + '?updateSupport=' + updateSupport"
                  list-type="picture-card"
                  @preview="handlePreview"
                  accept=".jpg, .png, .gif"
                  class="avatar-uploader"
                  :show-upload-list="true"
                  :headers="uploadHeaders"
                  :before-upload="(file, fileList) => beforeUpload(file, fileList, 'logo')"
                  @change="
                    (file, fileList) => {
                      handleChange(file, fileList, 'logo')
                    }
                  "
                  @remove="
                    (file) => {
                      removeImg(file, 'logo')
                    }
                  "
                >
                  <div v-if="state.logoListUrl.length < 1">
                    <Icon icon="svg-icon:add-upload" :size="15" />
                    <div style="margin-top: 8px">上传logo</div>
                  </div>
                </a-upload>
                <div class="upload-text"> 支持jpg/png格式，尺寸400px * 400px，不超过300k </div>
              </div>
            </a-form-item>

            <a-form-item label="环境图片" name="environmentUrl">
              <div style="height: 131px">
                <a-upload
                  v-model:file-list="state.environmentUrl"
                  :action="updateUrl + '?updateSupport=' + updateSupport"
                  list-type="picture-card"
                  @preview="handlePreview"
                  accept=".jpg, .png, .gif , .jpeg"
                  class="avatar-uploader"
                  :show-upload-list="true"
                  :headers="uploadHeaders"
                  :before-upload="(file, fileList) => beforeUpload(file, fileList, 'environment')"
                  @change="
                    (file, fileList) => {
                      handleChange(file, fileList, 'environment')
                    }
                  "
                  @remove="
                    (file) => {
                      removeImg(file, 'legalPerson')
                    }
                  "
                >
                  <div v-if="state.environmentUrl.length < 1">
                    <Icon icon="svg-icon:add-upload" :size="15" />
                    <div style="margin-top: 8px">上传环境图片</div>
                  </div>
                </a-upload>

                <div class="upload-text"> 尺寸1125*633px，支持jpg/jpeg/png/gif格式，不超过5M </div>
              </div>
            </a-form-item>

            <!--  级联选择器  - -   -->
            <a-form-item :label="`地址`" name="detailedAddress">
              <div class="flex-content adress-content">
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
                  class="adress-input"
                />
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

            <a-form-item
              label="状态"
              name="status"
              :rules="[{ required: true, message: '状态不能为空!' }]"
            >
              <a-switch
                v-model:checked="state.formState.status"
                checked-children="开启"
                un-checked-children="关闭"
              />
            </a-form-item>

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
                v-model:value="state.formState.establishDate"
                format="YYYY/MM/DD"
                placeholder="请选择时间"
              />
            </a-form-item>

            <a-form-item label="法人身份证" name="legalIdentityUrl">
              <div style="height: 131px">
                <a-upload
                  v-model:file-list="state.legalPersonListUrl"
                  :action="updateUrl + '?updateSupport=' + updateSupport"
                  list-type="picture-card"
                  @preview="handlePreview"
                  accept=".jpg, .png, .gif"
                  class="avatar-uploader"
                  :show-upload-list="true"
                  :headers="uploadHeaders"
                  :before-upload="(file, fileList) => beforeUpload(file, fileList, 'legalPerson')"
                  @change="
                    (file, fileList) => {
                      handleChange(file, fileList, 'legalPerson')
                    }
                  "
                  @remove="
                    (file) => {
                      removeImg(file, 'legalPerson')
                    }
                  "
                >
                  <div v-if="state.legalPersonListUrl.length < 1">
                    <Icon icon="svg-icon:add-upload" :size="15" />
                    <div style="margin-top: 8px">上传法人证件</div>
                  </div>
                </a-upload>

                <div class="upload-text">
                  请上传法人的清晰正面人头像身份证照片，支持png/jpg格式的照片
                </div>
              </div>
            </a-form-item>

            <a-form-item label="营业执照" name="businessLicenseUrl">
              <div style="height: 131px">
                <a-upload
                  v-model:file-list="state.businessLicenseListUrl"
                  :action="updateUrl + '?updateSupport=' + updateSupport"
                  list-type="picture-card"
                  @preview="handlePreview"
                  accept=".jpg, .png, .gif"
                  class="avatar-uploader"
                  :show-upload-list="true"
                  :headers="uploadHeaders"
                  :before-upload="
                    (file, fileList) => beforeUpload(file, fileList, 'businessLicense')
                  "
                  @change="
                    (file, fileList) => {
                      handleChange(file, fileList, 'businessLicense')
                    }
                  "
                  @remove="
                    (file) => {
                      removeImg(file, 'businessLicense')
                    }
                  "
                >
                  <div v-if="state.businessLicenseListUrl.length < 1">
                    <Icon icon="svg-icon:add-upload" :size="15" />
                    <div style="margin-top: 8px">上传营业执照</div>
                  </div>
                </a-upload>

                <div class="upload-text"> 请上传企业的营业执照，支持png/jpg格式的照片</div>
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
        >{{ state.modalType === 'add' ? '下一步' : '确认' }}</a-button
      >
      <a-button @click="closeModal">取消</a-button>
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
  addOrganization,
  getOrganizationTypeList,
  updateOrganization
} from '@/api/system/organization'
import { getMemberAllList, getMemberPhoneList } from '@/api/system/member'
import { reconstructionArrayObject } from '@/utils/utils'
import { cloneDeep } from 'lodash-es'
import {message, Upload, UploadChangeParam, UploadProps} from 'ant-design-vue'
import {getAccessToken, getTenantId} from "@/utils/auth";

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

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const formRef = ref()
const state = reactive({
  activeKey: 'advancedAttribute',
  isShow: true, //新增编辑modal
  modalTitle: '新增门店', //modal title
  formState: {
    parentId: 0, //上级机构ID
    organizationType: undefined, //机构类型
    name: '', //机构名称
    code: '', //机构编码
    abbreviate: '', //机构简称
    contactName: undefined, //负责人
    contactMobile: undefined, //负责人电话
    contactMail: '', //负责人邮箱
    sort: 0, //排序
    status: true, //状态

    type: [], //分公司类型 门店类型
    isSale: '0', //是否有销售
    saleBrand: [], //销售品牌
    isRescue: '0', //是否提供救援
    rescueBrand: [], //救援品牌
    isMaintenance: '0', //是否提供维保
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


  }, //新增表单
  optionalMenuTree: [], //上级机构 treeList
  organizationTypeOptions: [], //机构类型列表
  branchCompanyTypeOptions: [], //分公司类型列表
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
  legalMobileRules: [{ validator: legalMobileValidator }],
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
    contactName: undefined, //负责人
    contactMobile: undefined, //负责人电话
    contactMail: '', //负责人邮箱
    sort: 0, //排序
    status: true //状态
  }
  delete state.formState?.id
  state.modalTitle = '新增'
  state.modalType = 'add'
  state.currentType = '-1' //新增/修改/设置属性 机构类型(门店/分公司)
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
    // contactName: state.formState.contactName, //负责人
    contactId: state.formState.contactName, //负责人
    contactMobile: state.formState.contactMobile, //负责人电话
    // contactMobile: state.formState.contactMobile, //负责人电话
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
      const tempCurrentType = cloneDeep(state.formState.organizationType)

      nextTick(() => {
        state.currentType = tempCurrentType
        // '2'分公司 '4'门店
        if (state.currentType === '2' || state.currentType === '4') {
          // 配置权限
          openPermissionModal()
        }
      })

      message.success('新增成功')
    } else {
      params['id'] = state.formState.id
      res = await updateOrganization(params)
      message.success('修改成功')
    }

    closeModal()
    await getList()
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
//获取机构类型
getOrganizationTypeListFN()
</script>

<style lang="scss" scoped>
.base_info_content {
  width: 100%;
  display: flex;
  flex-direction: column;
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
  width: 470px;
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
