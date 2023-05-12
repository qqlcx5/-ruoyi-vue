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
            <div
              class="text-color margin-right-5"
              @click="assignPermission(record)"
              v-if="record.organizationType === '分公司' || record.organizationType === '门店'"
              >设置属性</div
            >
            <div class="text-color margin-right-5" @click="detailsInfo(record)" v-else>详情</div>
            <a-popover placement="bottom">
              <template #content>
                <div
                  class="text-color margin-right-5"
                  @click="detailsInfo(record)"
                  v-if="record.organizationType === '分公司' || record.organizationType === '门店'"
                  >详情</div
                >
                <div
                  class="text-color margin-right-5"
                  @click="setTableStatusChangeInfo(false, record, 'delete')"
                  >删除</div
                >
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
          <a-input v-model:value="state.formState.contactMobile" placeholder="请输入负责人电话" />
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

  <!-- 设置属性 Modal -->
  <a-modal
    v-model:visible="state.isShowPermission"
    title="设置属性"
    @ok="closePermissionModal"
    @cancel="closePermissionModal"
    wrapClassName="set-attribute-modal"
    :width="'710px'"
    :bodyStyle="{ height: '700px', margin: 'auto', paddingBottom: '25px', overflow: 'auto' }"
  >
    <div class="base_info_content">
      <a-form
        :model="state.formAttributeState"
        ref="formAttributeRef"
        v-bind="layout1"
        :label-col="{ style: { width: '130px' } }"
      >
        <div class="title-content"><div class="blue-line"></div> 基本属性 </div>

        <!--        <a-form-item-->
        <!--          :label="`分公司类型`"-->
        <!--          name="type"-->
        <!--          :rules="[{ required: true, message: '分公司类型不能为空!' }]"-->
        <!--        >-->
        <!--          <a-radio-group v-model:value="state.formAttributeState.type" name="radioGroup">-->
        <!--            <a-radio-->
        <!--              v-for="(item, index) in state.branchCompanyTypeOptions"-->
        <!--              :value="item.value"-->
        <!--              :key="`type${index}`"-->
        <!--              >{{ item.label }}</a-radio-->
        <!--            >-->
        <!--          </a-radio-group>-->
        <!--        </a-form-item>-->

        <a-form-item
          label="分公司类型"
          v-if="
            state.currentType === '2' ||
            state.currentType === '分公司' ||
            state.detailsRecord?.type === '2'
          "
        >
          <a-checkbox-group v-model:value="state.formAttributeState.type">
            <a-checkbox
              v-for="(item, index) in state.branchCompanyTypeOptions"
              :value="item.value"
              :key="`type${index}`"
              name="type"
              :rules="[{ required: true, message: '分公司类型不能为空!' }]"
              >{{ item.label }}</a-checkbox
            >
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="门店类型" v-else>
          <a-checkbox-group v-model:value="state.formAttributeState.type">
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

        <a-form-item :label="`星级`" name="startRating">
          <a-rate v-model:value="state.formAttributeState.startRating" allow-half />
        </a-form-item>

        <a-form-item label="系统logo" name="logoUrl">
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
              <plus-outlined />
              <div style="margin-top: 8px">上传logo</div>
            </div>
          </a-upload>
          <div class="upload-text"> 支持jpg/png格式，尺寸400px * 400px，不超过300k </div>
        </a-form-item>

        <a-form-item label="环境图片" name="environmentUrl">
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
              <plus-outlined />
              <div style="margin-top: 8px">上传环境图片</div>
            </div>
          </a-upload>

          <div class="upload-text"> 尺寸1125*633px，支持jpg/jpeg/png/gif格式，不超过5M </div>
        </a-form-item>

        <!--  级联选择器  - -   -->
        <a-form-item :label="`地址`" name="detailedAddress">
          <div class="flex-content adress-content">
            <a-form-item-rest>
              <a-cascader
                v-model:value="state.formAttributeState.companyAddress"
                :options="state.proMunAreaList"
                @change="cascadeChange"
                placeholder="请选择省市区"
              />
            </a-form-item-rest>
            <a-input
              v-model:value="state.formAttributeState.detailedAddress"
              placeholder="请输入详细的公司地址，具体门牌号"
              class="adress-input"
            />
          </div>
        </a-form-item>

        <a-space
          v-for="(item, index) in state.formAttributeState.contactInformationArr"
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
          <a-form-item :name="['contactInformationArr', index, 'mobile']">
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

          <!--  <MinusCircleOutlined @click="addContactInformation()" />-->
          <!--  <MinusCircleOutlined @click="removeContactInformation(item)" />  -->
        </a-space>

        <a-form-item
          label="状态"
          name="status"
          :rules="[{ required: true, message: '状态不能为空!' }]"
        >
          <a-switch
            v-model:checked="state.formAttributeState.status"
            checked-children="开启"
            un-checked-children="关闭"
          />
        </a-form-item>

        <div class="title-content"><div class="blue-line"></div> 详细属性 </div>
        <a-form-item :label="`统一社会信用代码`" name="creditCode">
          <a-input
            v-model:value="state.formAttributeState.creditCode"
            placeholder="请输入统一社会信用代码"
          />
        </a-form-item>

        <a-form-item :label="`组织机构代码`" name="organizationCode">
          <a-input
            v-model:value="state.formAttributeState.organizationCode"
            placeholder="请输入组织机构代码"
          />
        </a-form-item>

        <a-form-item :label="`法定代表人`" name="legalRepresentative">
          <a-input
            v-model:value="state.formAttributeState.legalRepresentative"
            placeholder="请输入法定代表人姓名"
          />
        </a-form-item>

        <a-form-item label="法人电话" name="legalMobile" :rules="state.legalMobileRules">
          <a-input
            v-model:value="state.formAttributeState.legalMobile"
            placeholder="请输入法人联系电话"
          />
        </a-form-item>

        <a-form-item label="法人身份证" name="legalIdentityUrl">
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
              <plus-outlined />
              <div style="margin-top: 8px">上传法人证件</div>
            </div>
          </a-upload>

          <div class="upload-text">
            请上传法人的清晰正面人头像身份证照片，支持png/jpg格式的照片
          </div>
        </a-form-item>

        <a-form-item :label="`成立日期`" name="establishDate">
          <a-date-picker
            v-model:value="state.formAttributeState.establishDate"
            format="YYYY/MM/DD"
            placeholder="请选择时间"
          />
        </a-form-item>

        <a-form-item label="营业执照" name="businessLicenseUrl">
          <a-upload
            v-model:file-list="state.businessLicenseListUrl"
            :action="updateUrl + '?updateSupport=' + updateSupport"
            list-type="picture-card"
            @preview="handlePreview"
            accept=".jpg, .png, .gif"
            class="avatar-uploader"
            :show-upload-list="true"
            :headers="uploadHeaders"
            :before-upload="(file, fileList) => beforeUpload(file, fileList, 'businessLicense')"
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
              <plus-outlined />
              <div style="margin-top: 8px">上传营业执照</div>
            </div>
          </a-upload>

          <div class="upload-text"> 请上传企业的营业执照，支持png/jpg格式的照片</div>
        </a-form-item>
      </a-form>
    </div>

    <template #footer>
      <a-button
        type="primary"
        html-type="submit"
        @click="PermissionOk"
        :loading="state.addEditLoading"
        >确定</a-button
      >
      <a-button @click="closePermissionModal">取消</a-button>
    </template>
  </a-modal>

  <!--  状态开始关闭 删除 确认Modal  -->
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
    <div class="status-content" v-if="state.tableStatusChangeInfo?.ctiveEmployeesNumber === 0">
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
          个子项机构将同步 {{ state.tableStatusChangeInfo.statusText }}，{{
            state.tableStatusChangeInfo.statusTextF
          }}请谨慎操作。
        </div>
      </div>
    </div>

    <div class="message-content" v-else>
      <div class="message-text-content">
        <div class="message-text">
          <img :src="warningImg" alt="" class="tip-img message-img" />
          <div>
            系统校验到该机构底下还存在<span class="status-span">{{
              state.tableStatusChangeInfo?.ctiveEmployeesNumber
            }}</span
            >个账户状态开启的员工，请先关闭或转移所有员工再操作{{
              state.tableStatusChangeInfo?.operation
            }}哦~
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button
        type="primary"
        html-type="submit"
        @click="tableStatusConfirm"
        v-if="state.tableStatusChangeInfo?.ctiveEmployeesNumber === 0"
        >{{ state.tableStatusChangeInfo.statusBtnText }}</a-button
      >
      <a-button v-else type="primary" html-type="submit">去操作</a-button>
      <a-button @click="closeStatusModal">取消</a-button>
    </template>
  </a-modal>

  <!--  详情  -->
  <a-modal
    v-model:visible="state.isShowDetails"
    title="详情"
    wrapClassName="details-modal set-attribute-modal"
    width="763px"
    :bodyStyle="{ overflow: 'auto' }"
  >
    <!--  机构信息  -->
    <div v-for="(item, index) in state.detailsInfo" :key="`info${index}`" class="details-content">
      <div class="flex-space">
        <div class="title-content"><div class="blue-line"></div>{{ item.baseTitle }}</div>
        <div class="details-edit" @click="edit(state.detailsRecord, true)"
          ><img :src="editImg" alt="" class="edit-Img" />修改</div
        >
      </div>
      <div class="info-content">
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
    </div>
    <!--  机构属性  -->
    <div class="details-content">
      <div class="flex-space">
        <div class="title-content"><div class="blue-line"></div>机构属性</div>
        <div class="details-edit" @click="assignPermission(state.detailsRecord, true)"
          ><img :src="editImg" alt="" class="edit-Img" />修改</div
        >
      </div>
    </div>

    <a-tabs v-model:activeKey="state.activeKey">
      <a-tab-pane key="baseKey" tab="基本属性">
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
      </a-tab-pane>
      <a-tab-pane key="detailsKey" tab="详细属性" force-render>
        <div
          v-for="(item, index) in state.detailsInfoThree"
          :key="`info${index}`"
          class="details-content"
        >
          <div class="title-content"><div class="blue-line"></div>{{ item.baseTitle }}</div>
          <div class="info-content">
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
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
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
import { PlusOutlined, LoadingOutlined, MinusCircleOutlined } from '@ant-design/icons-vue'
import { message, Upload } from 'ant-design-vue'
import type { UploadProps, UploadChangeParam } from 'ant-design-vue'
import { SystemMenuTypeEnum, PageKeyObj } from '@/utils/constants'
import { useCache } from '@/hooks/web/useCache'
import { putResetPassWord, updateEditMajorIndividualStatus } from '@/api/system/business'
import { provincesMunicipalitiesArea } from './pr'
import { filterTree, getAllIds, reconstructedTreeData, getColumns } from '@/utils/utils'
import dayjs from 'dayjs'
import warningImg from '@/assets/imgs/system/warning.png'
import editImg from '@/assets/imgs/system/editImg.png'
import useClipboard from 'vue-clipboard3'
import { getAccessToken, getTenantId } from '@/utils/auth'
import CustomColumn from '@/components/CustomColumn/CustomColumn.vue'
import {
  addAttribute,
  addOrganization,
  deleteOrganization,
  getActiveEmployeesNumber,
  getOrganizationDetails,
  getOrganizationList,
  getOrganizationTypeList,
  getSimpleOrganizationList,
  updateAttribute,
  updateOrganization,
  updateOrganizationStatus
} from '@/api/system/organization'
import { cloneDeep } from 'lodash-es'

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

const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
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
  total: 0, //总条数
  statusOptions: [
    { value: 0, label: '正常' },
    { value: 1, label: '停用' }
  ], //状态 0 正常 1停用
  organizationTypeOptions: [], //机构类型列表
  branchCompanyTypeOptions: [], //分公司类型列表
  contactInformationOptions: [], //联系方式类型列表
  storeTypeOptions: [], //门店类型
  loading: true, //表格加载中
  rawData: [], //表格数据 原始数据 未组树 主要用来过滤 判断父级状态是否开启
  tableDataList: [], //表格数据
  isExpandAll: false, //展开折叠
  refreshTable: true, //v-if table
  isFullScreen: false, //全屏
  isShow: false, //新增编辑modal
  isShowPermission: false, //设置属性modal
  isShowStatus: false, //表格状态改变 确认modal 确认后才开短信modal
  isShowDelete: false, //删除确认 modal
  modalTitle: '新增', //modal title
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
  formAttributeState: {
    type: [], //分公司类型 门店类型
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
    status: true, //状态
    creditCode: '', //统一社会信用代码
    organizationCode: '', //组织机构代码
    legalRepresentative: '', //法定代表人
    legalMobile: '', //法人联系电话
    legalIdentityUrl: '', //法人身份证
    establishDate: '', //成立日期
    businessLicenseUrl: '' //营业执照
  }, //新增(设置)属性表单
  addSuccessId: undefined, //创建机构成功ID 主要是用于创建机构后配置权限
  activeKey: 'baseKey', //详情modal tab
  permissionRecord: {}, //权限配置 操作 时 存的整条数据
  PermissionType: 'add', //权限配置 新增 修改
  editPermissionID: undefined, //编辑功能配置时的id
  isShowDetails: false, //详细modal
  detailsInfo: [], //详情内容
  detailsInfoSecond: [], //详情内容 tabs
  detailsInfoThree: [], //详情内容 tabs
  isShowResetPassWord: false, //重置密码提示modal
  resetPasswordTitle: '', //重置密码 modal title
  resetPasswordSuccessInfo: {}, //重置密码成功后
  closable: false, //重置密码 modal 右上角×
  isResetPasswordSuccessMark: false,
  isShowCustomColumnModal: false, //是否打开定制列modal
  columns: [], //表格 columns
  optionalMenuTree: [], //上级机构 treeList
  logoListUrl: [], //系统logo 上传 回显 - -
  logoUrlSuccess: '', //系统logo 新增编辑入参
  legalPersonListUrl: [], //法人身份证 上传回显
  legalPersonUrlSuccess: '', //法人身份证 新增编辑入参
  businessLicenseListUrl: [], //营业执照 上传回显
  businessLicenseSuccess: '', //营业执照 新增编辑入参
  environmentUrl: [], //环境图片 上传回显
  environmentSuccess: '', //环境图片 新增编辑入参
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
  changedColumnsObj: {}, //定制列组件接收到的当前列信息
  detailsRecord: {}, //当前点击的表格record后获取到的机构详情(包括属性)
  currentType: '-1' //新增/修改/设置属性 机构类型(门店/分公司)  '2'分公司 '4'门店
})

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

  try {
    const res = await getOrganizationList(params)
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
  if (!(Object.keys(record).length === 0)) {
    //非空对象判断 新增子项时回显
    state.formState.parentId = record.id
  }
  const res = await getSimpleOrganizationList()

  let menuTree = []
  // let menu = {}
  let menu: Tree = { id: 0, name: '顶层机构', children: [] }
  menu.children = handleTree(res, 'id', 'parentId', 'children')
  menuTree.push(menu)
  // const menuTree = handleTree(res, 'id', 'parentId', 'children')

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
  state.currentType = '-1' //新增/修改/设置属性 机构类型(门店/分公司)
}

/** 添加/修改操作 */
const formRef = ref()
//设置属性
const formAttributeRef = ref()

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
  if (isCloseDetails) {
    //关闭详情moal
    state.isShowDetails = false
  }
  //获取机构详情
  const res = await getOrganizationDetails({ id: record.id })
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
  state.formState.status = record.status === true

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
  state.formAttributeState.cascadeInfo = selectedOptions
}

//关闭功能配置 modal
const closePermissionModal = () => {
  state.isShowPermission = false
  state.PermissionType = 'add'
  state.addSuccessId = undefined

  formAttributeRef.value.resetFields()
  //级联选择器 需要单独清空
  state.formAttributeState.companyAddress = []
  state.formAttributeState = {
    type: '', //分公司类型
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
    status: true, //状态
    creditCode: '', //统一社会信用代码
    organizationCode: '', //组织机构代码
    legalRepresentative: '', //法定代表人
    legalMobile: '', //法人联系电话
    legalIdentityUrl: '', //法人身份证
    establishDate: '', //成立日期
    businessLicenseUrl: '' //营业执照
  }

  state.logoListUrl = [] //系统logo 上传 回显 - -
  state.logoUrlSuccess = '' //系统logo 新增编辑入参
  state.legalPersonListUrl = [] //法人身份证 上传回显
  state.legalPersonUrlSuccess = '' //法人身份证 新增编辑入参
  state.businessLicenseListUrl = [] //营业执照 上传回显
  state.businessLicenseSuccess = '' //营业执照 新增编辑入参
  state.environmentUrl = [] //环境图片 上传回显
  state.environmentSuccess = '' //环境图片 新增编辑入参
  delete state.formAttributeState?.id
  state.currentType = '-1' //新增/修改/设置属性 机构类型(门店/分公司)
  state.detailsRecord = {}

  state.addEditLoading = false
}

//开启功能配置 modal
const openPermissionModal = async () => {
  state.isShowPermission = true
}

//设置属性(新增修改属性) Modal 确认
const PermissionOk = async () => {
  // 校验表单
  if (!formAttributeRef) return
  const valid = await formAttributeRef.value.validate()
  state.addEditLoading = true

  const params = {
    organizationId: state.detailsRecord.id || state.addSuccessId,
    type: state.formAttributeState.type, //分公司类型
    startRating: state.formAttributeState.startRating, //星级
    logoUrl: state.logoUrlSuccess, //系统logo
    environmentUrl: state.environmentSuccess, //环境图片
    address: state.formAttributeState.detailedAddress, //公司地址 详细地址
    contact: state.formAttributeState.contactInformationArr, //联系方式 设置属性
    creditCode: state.formAttributeState.creditCode, //统一社会信用代码
    organizationCode: state.formAttributeState.organizationCode, //组织机构代码
    legalRepresentative: state.formAttributeState.legalRepresentative, //法定代表人
    legalMobile: state.formAttributeState.legalMobile, //法人联系电话
    legalIdentityUrl: state.legalPersonUrlSuccess, //法人身份证
    businessLicenseUrl: state.businessLicenseSuccess //营业执照
  }

  //状态0 开启 1关闭
  if (state.formState.status) {
    params['status'] = 0
  } else {
    params['status'] = 1
  }

  //省市区
  if (state.formAttributeState?.cascadeInfo[0]) {
    params['province'] = state.formAttributeState.cascadeInfo[0].label
    params['provinceCode'] = state.formAttributeState.cascadeInfo[0].value
  }
  if (state.formAttributeState?.cascadeInfo[1]) {
    params['city'] = state.formAttributeState.cascadeInfo[1].label
    params['cityCode'] = state.formAttributeState.cascadeInfo[1].value
  }
  if (state.formAttributeState?.cascadeInfo[2]) {
    params['county'] = state.formAttributeState.cascadeInfo[2].label
    params['countyCode'] = state.formAttributeState.cascadeInfo[2].value
  }

  if (state.formAttributeState.establishDate) {
    params['establishDate'] = state.formAttributeState.establishDate?.format('YYYY-MM-DD') //成立日期
  }

  // if (state.PermissionType === 'add') {
  //relVO null则没有属性
  // if (state.detailsRecord?.relVO === null) {
  if (!state.detailsRecord?.relVO) {
    await addAttribute(params)
    message.success('新增成功')
  } else {
    params['id'] = state.detailsRecord.relVO?.id
    await updateAttribute(params)
    message.success('编辑成功')
  }
  await getList()
  closePermissionModal()
}

const assignPermission = async (record, isCloseDetails = false) => {
  if (isCloseDetails) {
    //关闭详情moal
    state.isShowDetails = false
  }
  nextTick(() => {
    state.currentType = record?.organizationType
  })
  state.permissionRecord = record
  state.PermissionType = 'edit'
  if (record.id) {
    const res = await getOrganizationDetails({ id: record.id })
    //... res 可能为null
    state.detailsRecord = res

    //赋值 回显
    state.formAttributeState = {
      organizationId: record.id, //机构id
      type: res.relVO?.type, //分公司类型
      startRating: res.relVO?.startRating, //星级
      detailedAddress: res.relVO?.address, //地址 详细地址
      contactInformationArr: res.relVO?.contact, //联系方式 设置属性
      creditCode: res.relVO?.creditCode, //统一社会信用代码
      organizationCode: res.relVO?.organizationCode, //组织机构代码
      legalRepresentative: res.relVO?.legalRepresentative, //法定代表人
      legalMobile: res.relVO?.legalMobile //法人联系电话
    }

    if (res.relVO?.contact === null) {
      state.formAttributeState.contactInformationArr = [
        {
          contactType: null,
          mobile: '',
          id: Date.now()
        }
      ] //联系方式 设置属性
    }

    if (res.relVO?.logoUrl) {
      state.logoListUrl = [
        {
          url: res.relVO?.logoUrl //系统logo
        }
      ]
      state.logoUrlSuccess = res.relVO?.logoUrl
    }

    if (res.relVO?.legalIdentityUrl) {
      state.legalPersonListUrl = [
        {
          url: res.relVO?.legalIdentityUrl //法人身份证
        }
      ]
      state.legalPersonUrlSuccess = res.relVO?.legalIdentityUrl
    }

    if (res.relVO?.businessLicenseUrl) {
      state.businessLicenseListUrl = [
        {
          url: res.relVO?.businessLicenseUrl //营业执照
        }
      ]
      state.businessLicenseSuccess = res.relVO?.businessLicenseUrl
    }

    if (res.relVO?.environmentUrl) {
      state.environmentUrl = [
        {
          url: res.relVO?.environmentUrl //环境图片
        }
      ]
      state.environmentSuccess = res.relVO?.environmentUrl
    }

    if (res.relVO?.establishDate) {
      state.formAttributeState['establishDate'] = dayjs(res.relVO?.establishDate) //成立日期
    }

    //状态0 开启 1关闭
    state.formAttributeState.status = res.status === 0

    //省市区
    state.formAttributeState.companyAddress = []
    state.formAttributeState.cascadeInfo = []
    if (res?.relVO?.provinceCode) {
      state.formAttributeState.companyAddress.push(res?.relVO?.provinceCode)
      state.formAttributeState.cascadeInfo.push({
        label: res?.relVO?.province,
        value: res?.relVO?.provinceCode
      })
    }
    if (res?.relVO?.cityCode) {
      state.formAttributeState.companyAddress.push(res?.relVO?.cityCode)
      state.formAttributeState.cascadeInfo.push({
        label: res?.relVO?.city,
        value: res?.relVO?.cityCode
      })
    }
    if (res?.relVO?.countyCode) {
      state.formAttributeState.companyAddress.push(res?.relVO?.countyCode)
      state.formAttributeState.cascadeInfo.push({
        label: res?.relVO?.county,
        value: res?.relVO?.countyCode
      })
    }
  }

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
  getList()
}

//表格状态开关
const setTableStatusChangeInfo = async (value, record, type = 'switch') => {
  const res = await getActiveEmployeesNumber({ id: record.id })
  // const res = 25

  if (res === 0) {
    nextTick(() => {
      state.tableStatusChangeInfo['ctiveEmployeesNumber'] = 0
    })
  } else {
    nextTick(() => {
      state.tableStatusChangeInfo['ctiveEmployeesNumber'] = res
    })
  }

  if (type === 'delete') {
    //删除
    state.tableStatusChangeInfo = {
      value,
      record,
      operation: '删除',
      type: 'delete'
    }

    state.tableStatusChangeInfo['statusBtnText'] = '确认删除'
    state.tableStatusChangeInfo['statusTopText'] = `删除后`
    state.tableStatusChangeInfo['statusText'] = `删除`
    state.tableStatusChangeInfo['statusTextF'] = '将会导致业务数据的丢失，且不可恢复，'
  } else {
    //表格按钮状态
    state.tableStatusChangeInfo = {
      value,
      record,
      operation: '关闭'
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

    state.tableStatusChangeInfo['statusTextF'] = ''
  }

  openStatusModal()
}

//表格状态开关modal 确认
const tableStatusConfirm = async () => {
  switch (state.tableStatusChangeInfo?.type) {
    case 'delete':
      //删除
      await deleteOrganization(state.tableStatusChangeInfo.record.id)
      message.success('删除成功')
      break
    default:
      //状态开关
      const res = await updateOrganizationStatus({
        id: state.tableStatusChangeInfo.record.id,
        status: state.tableStatusChangeInfo.record.statusSwitch === true ? 0 : 1
      })

      message.success('修改状态成功')
  }

  closeStatusModal()
}

//详情(打开)
const detailsInfo = async (record) => {
  state.detailsRecord = record
  // state.record = record
  //获取机构详情
  const res = await getOrganizationDetails({ id: record.id })
  const { relVO = {} } = res

  //上级机构
  const tempRes = await getSimpleOrganizationList()
  const tempItem = tempRes.filter((item) => item.id === record.parentId)

  const tempArrType = state.organizationTypeOptions.filter(
    (item) => item.value === res.organizationType
  )

  //类型
  let tempArrTypeString = ''
  if (res.organizationType === '2') {
    //分公司
    const tempArrTypeF = state.organizationTypeOptions.filter((topItem) => {
      return relVO.type.some((item) => topItem.value === item)
    })

    tempArrTypeF.map((item) => {
      if (tempArrTypeString === '') {
        //避免开头多拼一个 、
        tempArrTypeString = item.label
      } else {
        tempArrTypeString = tempArrTypeString + '、' + item.label
      }
    })
  } else if (res.organizationType === '4') {
    //门店
    const tempArrTypeF = state.storeTypeOptions.filter((topItem) => {
      return relVO.type.some((item) => topItem.value === item)
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

  //地址
  let companyAddress = ''
  if (res.relVO?.province) {
    companyAddress = res.relVO?.province + res.relVO?.city + res.relVO?.county
  }
  if (res.relVO?.address) {
    companyAddress += res.relVO?.address
  }

  //联系方式
  const tempArrContactInformationArr = []
  const tempContactArr = state.contactInformationOptions.filter((topItem) => {
    return relVO.contact.some((item) => {
      if (topItem.value === item.contactType) {
        tempArrContactInformationArr.push({
          label: topItem?.label,
          value: item?.mobile
        })
      }
    })
  })

  state.detailsInfo = [
    {
      baseTitle: '机构信息',
      infoArr: [
        {
          textSpan: '上级机构：',
          text: tempItem[0]?.name
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
          textSpan: '负责人：',
          text: res.contactName
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
        {
          textSpan: '类型：',
          text: tempArrTypeString,
          isFull: true
        },
        {
          textSpan: '是否有销售：',
          text: ''
        },
        {
          textSpan: '销售品牌：',
          text: ''
        },
        {
          textSpan: '是否提供救援：',
          text: ''
        },
        {
          textSpan: '救援品牌：',
          text: ''
        },
        {
          textSpan: '是否提供维保：',
          text: ''
        },
        {
          textSpan: '维保品牌：',
          text: ''
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
        {
          textSpan: '门店地址：',
          text: companyAddress,
          isFull: true
        },

        {
          textSpan: '门店联系方式：',
          contactInformationOptions: tempArrContactInformationArr,
          isFull: true
        }
      ]
    }
  ]

  state.detailsInfoThree = [
    {
      baseTitle: '详细属性',
      infoArr: [
        {
          textSpan: '统一社会信用代码：',
          text: res.relVO?.creditCode
        },
        {
          textSpan: '组织机构代码：',
          text: res.relVO?.organizationCode
        },
        {
          textSpan: '法定代表人：',
          text: res.relVO?.legalRepresentative
        },
        {
          textSpan: '法人联系电话：',
          text: res.relVO?.legalMobile
        },
        {
          textSpan: '法人身份证：',
          text: '暂无上传图片',
          imgUrl: res.relVO?.legalIdentityUrl
        },
        {
          textSpan: '成立日期：',
          text: res.relVO?.establishDate
        },
        {
          textSpan: '营业执照：',
          text: '暂无上传图片',
          imgUrl: res.relVO?.businessLicenseUrl
        }
      ]
    }
  ]

  state.isShowDetails = true
  return
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

//初始化 获取默认的 columns
state.columns = getColumns(state, PageKeyObj.organization, allColumns, state.defaultKeys)

//设置属性 动态添加联系方式
const addContactInformation = () => {
  state.formAttributeState.contactInformationArr.push({
    contactType: null,
    mobile: '',
    id: Date.now()
  })
}
//设置属性 动态删除联系方式
const removeContactInformation = (item) => {
  let index = state.formAttributeState.contactInformationArr.indexOf(item)
  if (index !== -1) {
    state.formAttributeState.contactInformationArr.splice(index, 1)
  }
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

//设置属性弹窗
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
.tags-content {
  flex-wrap: wrap;
  display: flex;
}
.tag-content {
  margin-right: 15px;
  margin-bottom: 20px;
  display: flex;
}
//设置属性 联系方式  +
.add-circle {
  position: relative;
  top: 5px;
}
.flex-space {
  display: flex;
  justify-content: space-between;
}
//详情 机构属性  基本信息 类型 独占一行
.width-full {
  width: 100%;
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
}
</style>
