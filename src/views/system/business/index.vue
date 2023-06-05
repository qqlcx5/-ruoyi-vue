<!--  主体管理  -->
<template>
  <div class="total-content">
    <!-- 搜索工作栏 -->
    <a-card class="search-card">
      <a-form :model="queryParams" ref="queryFormRef" layout="inline" autocomplete="off">
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
        <a-button type="primary" html-type="submit" @click="getList()">查询</a-button>
        <a-button @click="resetQuery">重置</a-button>
      </a-form>
    </a-card>

    <!--  表格  -->
    <a-card
      :bordered="false"
      style="min-width: 1710px; height: 100%; padding-bottom: 30px"
      id="card-content"
    >
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
              <Icon
                icon="svg-icon:expansion"
                class="btn-icon"
                :size="10"
                v-if="state.isExpandAll"
              />
              <Icon icon="svg-icon:expandFold" class="btn-icon" :size="10" v-else />
            </template>
            {{ state.isExpandAll ? '收起全部' : '展开全部' }}
          </a-button>
        </div>
        <!--  右侧操作  -->
        <div class="operation-content">
          <!--        <Icon icon="svg-icon:search" :size="50" class="cursor-pointer" />-->
          <Icon icon="svg-icon:full-screen" :size="50" class="cursor-pointer" @click="fullScreen" />
          <!--        <Icon icon="svg-icon:print-connect" :size="50" class="cursor-pointer" />-->
          <Icon icon="svg-icon:refresh" :size="50" class="cursor-pointer" @click="getList(true)" />
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
        :expandIconColumnIndex="state.treeIconIndex"
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
          <template v-if="column?.key === 'name'">
            <div class="name-content"
              >{{ record.name }}
              <div class="store-tag" v-if="record.store">{{ record.store }}</div></div
            >
          </template>
          <!--  可用名额   -->
          <!--  排除门店  -->
          <template v-if="column?.key === 'usableAmount' && record.type !== null">
            <div>{{ record.accountUsedCount }}/{{ record.accountCount }}</div>
          </template>
          <!--  有效期   -->
          <!--  排除门店  -->
          <template v-if="column?.key === 'validityPeriod' && record.type !== null">
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
              <div
                class="text-color margin-right-5"
                @click="edit(record, false, record.type === null)"
                >修改</div
              >
              <div
                v-if="record.type !== null"
                class="text-color margin-right-5"
                @click="openModal(record)"
                >{{ record.type === 'dealer' ? '新增门店' : '新增子项' }}</div
              >
              <div
                v-else
                class="text-color margin-right-5"
                @click="openEditParentMajorIndividual(record)"
                >修改上级主体</div
              >

              <div
                v-if="record.type !== null"
                class="text-color margin-right-5"
                @click="assignPermission(record)"
                >功能配置</div
              >
              <div
                v-else
                class="text-color margin-right-5"
                @click="edit(record, false, record.type === null, 'underlyingAttribute')"
                >设置属性</div
              >
              <a-popover placement="bottom">
                <template #content>
                  <div class="text-color margin-right-5" @click="detailsInfo(record)">详情</div>
                </template>
                <Icon icon="svg-icon:ellipsis" class="btn-icon" :size="18" />
              </a-popover>
            </div>
          </template>
        </template>
      </a-table>
      <!--  </ContentWrap>-->
    </a-card>
  </div>

  <!-- 新增 编辑 Modal -->
  <a-modal
    v-model:visible="state.isShow"
    destroyOnClose
    :title="state.modalTitle"
    wrapClassName="add-edit-modal"
    @cancel="closeModal"
    :width="'665px'"
    :bodyStyle="{ height: '600px', margin: 'auto', paddingBottom: '25px', overflow: 'auto' }"
  >
    <div class="base_info_content">
      <a-form
        :model="state.formState"
        ref="formRef"
        v-bind="layout"
        :label-col="{ style: { width: '130px' } }"
        autocomplete="off"
      >
        <div class="title-content"><div class="blue-line"></div> 基本信息 </div>

        <a-form-item
          :label="`主体类型`"
          name="majorIndividualType"
          :rules="[{ required: true, message: `主体类型不能为空` }]"
        >
          <a-radio-group
            v-model:value="state.formState.majorIndividualType"
            :disabled="state.modalType === 'edit'"
            @change="majorIndividualTypeChange"
          >
            <a-radio
              v-for="item in state.majorIndividualTypeOptions"
              :value="item.value"
              :key="item.value"
            >
              {{ item.label }}</a-radio
            >
          </a-radio-group>
        </a-form-item>

        <a-form-item :label="`上级主体`" name="belongTenantId">
          <a-tree-select
            v-model:value="state.formState.belongTenantId"
            :disabled="state.modalType === 'edit'"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择上级主体"
            :tree-data="state.optionalMenuTreeChange"
            :fieldNames="{ children: 'children', label: 'name', value: 'id' }"
            treeNodeFilterProp="name"
          />
        </a-form-item>
        <a-form-item
          :label="`主体编码`"
          name="code"
          :rules="[{ required: true, message: `主体编码不能为空` }, { validator: codeValidator }]"
        >
          <a-input
            v-model:value="state.formState.code"
            show-count
            :maxlength="20"
            placeholder="请输入主体编码"
          />
        </a-form-item>

        <a-form-item
          :label="`主体名称`"
          name="name"
          :rules="[{ required: true, message: `主体名称不能为空` }]"
        >
          <a-input
            v-model:value="state.formState.name"
            show-count
            :maxlength="20"
            placeholder="请输入主体名称"
          />
        </a-form-item>

        <a-form-item :label="`主体简称`" name="abbreviate">
          <a-input
            v-model:value="state.formState.abbreviate"
            show-count
            :maxlength="10"
            placeholder="请输入主体简称"
          />
        </a-form-item>

        <a-form-item
          :label="`系统名称`"
          name="systemName"
          :rules="[
            { required: true, message: `系统名称不能为空` },
            { validator: chineseEnValidator }
          ]"
        >
          <div class="flex-content">
            <a-input
              v-model:value="state.formState.systemName"
              show-count
              :maxlength="10"
              placeholder="请输入系统名称"
            />
            <a-tooltip placement="topLeft" class="icon-tip">
              <template #title>
                <span> 为左上角显示的系统整体名称</span>
              </template>
              <Icon icon="ep:question-filled" color="rgb(176, 176, 176)" />
            </a-tooltip>
          </div>
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

        <a-form-item
          :label="`负责人`"
          name="contactName"
          :rules="[{ required: true, message: `负责人不能为空` }]"
        >
          <a-input v-model:value="state.formState.contactName" placeholder="请输入负责人姓名" />
        </a-form-item>

        <a-form-item label="负责人电话" name="contactMobile" :rules="state.contactMobileRules">
          <a-input v-model:value="state.formState.contactMobile" placeholder="请输入负责人电话" />
          <div class="phone-text"> 主要用于重要功能的安全验证，请确保填写正确 </div>
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
            <!--            <div>-->
            <!--              <a-form-item-rest>-->
            <!--                <a-checkbox v-model:checked="state.formState.forever" @change="foreverChange">-->
            <!--                  永久有效</a-checkbox-->
            <!--                ></a-form-item-rest-->
            <!--              >-->
            <!--            </div>-->
          </div>
        </a-form-item>

        <a-form-item
          :label="`可用名额`"
          name="accountCount"
          :rules="[{ required: true, message: `可用名额不能为空` }, { validator: numValidator }]"
        >
          <a-input
            id="inputNumber"
            v-model:value="state.formState.accountCount"
            :controls="false"
            placeholder="请输入整数"
          />
        </a-form-item>

        <a-form-item
          :label="`绑定域名`"
          name="bindingDomainName"
          :rules="[{ required: true, message: `绑定域名不能为空` }]"
        >
          <a-input
            v-model:value="state.formState.bindingDomainName"
            addon-before="https://"
            placeholder="请输入绑定的域名"
          />
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

        <div class="title-content"><div class="blue-line"></div> 详细信息 </div>
        <a-form-item
          :label="`统一社会信用代码`"
          name="creditCode"
          :rules="[{ validator: codeValidator }]"
        >
          <a-input
            v-model:value="state.formState.creditCode"
            placeholder="请输入统一社会信用代码"
          />
        </a-form-item>

        <!--  这里注释掉 不删 免得哪天又要  -->
        <!--        <a-form-item :label="`组织机构代码`" name="organizationCode">-->
        <!--          <a-input-->
        <!--            v-model:value="state.formState.organizationCode"-->
        <!--            placeholder="请输入组织机构代码"-->
        <!--          />-->
        <!--        </a-form-item>-->

        <a-form-item :label="`法定代表人`" name="legalRepresentative">
          <a-input
            v-model:value="state.formState.legalRepresentative"
            placeholder="请输入法定代表人姓名"
          />
        </a-form-item>

        <a-form-item label="法人电话" name="legalMobile" :rules="state.legalMobileRules">
          <a-input v-model:value="state.formState.legalMobile" placeholder="请输入法人联系电话" />
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

        <!--  级联选择器  - -   -->
        <a-form-item :label="`公司地址`" name="detailedAddress">
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
                <Icon icon="svg-icon:add-upload" :size="15" />
                <div style="margin-top: 8px">上传营业执照</div>
              </div>
            </a-upload>

            <div class="upload-text"> 请上传企业的营业执照，支持png/jpg格式的照片</div>
          </div>
        </a-form-item>
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

  <!--  新增/修改门店  -->
  <Store
    v-if="state.isShowStore"
    @closeStore="closeStore()"
    :belongTenantId="state.belongTenantId"
    :editRecord="state.record"
    :tabsActiveKey="state.currentTabs"
  ></Store>

  <!-- 配置权限 Modal -->
  <a-modal
    v-model:visible="state.isShowPermission"
    destroyOnClose
    title="配置权限"
    @ok="closePermissionModal"
    @cancel="closePermissionModal"
    :width="'665px'"
    :bodyStyle="{ height: '700px', margin: '0', padding: '0', overflow: 'auto' }"
  >
    <div class="per-content">
      <div class="text-content">请选择该主体的功能配置权限：</div>
      <!--  左右两侧  -->
      <div class="select-content">
        <div class="left-content">
          <a-tabs
            v-model:activeKey="state.activeKey"
            tabBarGutter="40px"
            :tabBarStyle="{ paddingLeft: '10px', background: 'rgb(246, 246, 246)', margin: 0 }"
          >
            <a-tab-pane key="frontDesk" tab="成员端" force-render>成员端</a-tab-pane>
            <a-tab-pane key="backstage" tab="管理端">
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
                  :selectable="false"
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
            <a-tab-pane key="client" tab="客户端" force-render>客户端</a-tab-pane>
          </a-tabs>
        </div>
        <div class="right-content">
          <div v-if="state.isShowRightTree">
            <div v-if="state.isShowRightTree">已选信息：</div>
            <a-tree
              v-if="state.isShowRightTree"
              :selectable="false"
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
            <div v-if="state.selectTree?.length === 0" class="select-tip"
              >请选择左侧要配置的菜单</div
            >
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="PermissionOk">确定选择</a-button>
      <a-button @click="closePermissionModal">暂不设置</a-button>
    </template>
  </a-modal>

  <!--  状态开始关闭 短信提示Modal  -->
  <a-modal
    v-model:visible="state.isShowMessage"
    destroyOnClose
    :title="state.messageTitle"
    wrapClassName="date-status-change-modal"
    @ok="statusOk"
    @cancel="statusCancel"
    width="560px"
    :bodyStyle="{
      width: '100%',
      height: '190px',
      margin: '0',
      padding: '10px 0 0 0',
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
          主体负责人绑定的手机号：{{
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
    destroyOnClose
    :closable="false"
    wrapClassName="status-change-modal"
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
          <span class="status-span">{{ state.tableStatusChangeInfo?.tempTreeNum }}</span>
          个子项{{ state.tableStatusChangeInfo?.type }}将同步
          {{ state.tableStatusChangeInfo.statusText }}，请谨慎操作。
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

  <!--  有效期内 状态关闭 开启/不开启Modal  没空没空 直接再开一个modal  -->
  <a-modal
    v-model:visible="state.isShowDateStatus"
    destroyOnClose
    title="提示"
    wrapClassName="date-status-change-modal"
    width="518px"
    :bodyStyle="{
      width: '100%',
      height: '129px',
      margin: '0',
      padding: '0px 33px 0 0px',
      overflow: 'auto'
    }"
  >
    <div class="message-content">
      <div class="message-text-content">
        <div class="message-text">
          <img :src="warningImg" alt="" class="tip-img message-img" />
          <div>
            系统校验到您的主体在有效期内：{{ state.dateTime.startTime }}~{{
              state.dateTime.endTime
            }}
            但是您的主体还处于已关闭状态。关闭的主体将会登录不了系统。
          </div>
        </div>

        <div class="status-text-info"> 请问您是否要开启该主体？ </div>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="dateOkModal">确认开启</a-button>
      <a-button @click="closeDateModal">暂不开启</a-button>
    </template>
  </a-modal>

  <!--  详情  -->
  <a-modal
    v-model:visible="state.isShowDetails"
    destroyOnClose
    title="详情"
    wrapClassName="details-modal"
    width="763px"
    :bodyStyle="{ overflow: 'auto' }"
    :footer="null"
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

  <!--  门店详情  -->
  <StoreDetails
    v-if="state.isShowStoreDetails"
    @closeStoreDetails="closeStoreDetails()"
    @editStoreDetails="editStoreDetails"
    :currentRecord="state.record"
  ></StoreDetails>

  <!--  重置密码 Modal  -->
  <a-modal
    v-model:visible="state.isShowResetPassWord"
    destroyOnClose
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

  <!--  门店修改上级主体  -->
  <EditParentMajorIndividual
    v-if="state.isShowParentMajorIndividual"
    @closeStoreParentMajorIndividual="closeStoreParentMajorIndividual()"
    :currentRecord="state.record"
  ></EditParentMajorIndividual>

  <!--  定制列  -->
  <CustomColumn
    v-if="state.isShowCustomColumnModal"
    @change-column="changeColumn"
    :allColumns="allColumns"
    :defaultKeys="state.defaultKeys"
    :changedColumnsObj="state.changedColumnsObj"
    :pageKey="PageKeyObj.business"
  />

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

<script lang="tsx" setup>
import * as MenuApi from '@/api/system/menu'
import { handleTree } from '@/utils/tree'
import { message, Upload } from 'ant-design-vue'
import type { UploadProps, UploadChangeParam } from 'ant-design-vue'
import { PageKeyObj, SystemMenuTypeEnum } from '@/utils/constants'
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
import { provincesMunicipalitiesArea } from '@/constant/pr.ts'
import {
  filterTree,
  getAllIds,
  getColumns,
  reconstructedTreeData,
  toTreeCount
} from '@/utils/utils'
import dayjs from 'dayjs'
import warningImg from '@/assets/imgs/system/warning.png'
import editImg from '@/assets/imgs/system/editImg.png'
import successImg from '@/assets/imgs/system/successImg.png'
import useClipboard from 'vue-clipboard3'
import { getAccessToken, getTenantId } from '@/utils/auth'
import CustomColumn from '@/components/CustomColumn/CustomColumn.vue'
import { cloneDeep } from 'lodash-es'
import Store from '@/views/system/business/Store.vue'
import StoreDetails from '@/views/system/business/StoreDetails.vue'
import EditParentMajorIndividual from '@/views/system/business/EditParentMajorIndividual.vue'

const { wsCache } = useCache()

const { toClipboard } = useClipboard()

import isBetween from 'dayjs/plugin/isBetween'
import { getOrganizationTypeList, updateOrganizationStatus } from '@/api/system/organization'
import { getMajorIndividualSimpleMenusList } from '@/api/system/menu'
dayjs.extend(isBetween)

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

//主体编码英文数字
const codeValidator = (rule, value) => {
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

//中英文
const chineseEnValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      const regExp = /^[a-zA-Z\u4e00-\u9fa5]+$/
      if (!regExp.test(value)) {
        reject('只能输入中英文')
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
  belongTenantId: null, //上级主体编号 新增门店
  record: {}, //表格状态修改时存的整条数据 详细共用(修改)
  messageContactMobile: '18888888888', //短信验证手机号
  messageText: '为了保护您的主体公司业务数据安全，请通过安全验证：',
  canSendCode: true, //能否发送验证码
  codeCountdown: 60, //短信发送倒计时 s
  messageCode: '', //短信验证码
  messageBtnText: '确认开启', //消息modal 确认button 文字内容
  total: 0, //总条数
  statusOptions: [
    { value: 0, label: '正常' },
    { value: 1, label: '停用' }
  ], //状态 0 正常 1停用
  loading: true, //表格加载中
  rawData: [], //表格数据 原始数据 未组树 主要用来过滤 判断父级状态是否开启
  tableDataList: [], //表格数据
  tableDataArr: [], //表格数据 Arr
  treeIconIndex: 0,
  isExpandAll: false, //展开折叠
  refreshTable: true, //v-if table
  isFullScreen: false, //全屏
  isShow: false, //新增编辑modal
  isShowStore: false, //新增编辑 门店
  isShowStoreDetails: false, //详情 门店
  currentTabs: 'basicInformation', //门店 设置属性&&修改 current Tab
  isShowPermission: false, //功能配置modal
  isShowMessage: false, //短信modal
  isShowStatus: false, //表格状态改变 确认modal 确认后才开短信modal
  isShowDateStatus: false, //修改modal 有效期 状态关闭 modal
  isShowParentMajorIndividual: false, //修改上级主体 门店
  dateTime: {}, //修改modal 有效期 状态关闭 modal  date
  messageTitle: '提示', //短信modal title
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
  majorIndividualTypeOptions: [], //适用主体类型Options
  formState: {
    majorIndividualType: '', //主体类型
    belongTenantId: null, //上级主体编号
    code: '', //主体编码
    name: '', //主体名称
    abbreviate: '', //主体简称
    systemName: '', //系统名称
    logoUrl: '', //系统logo
    contactName: '', //负责人
    contactMobile: '', //负责人电话
    effectiveStartEndTime: [], //有效期
    // forever: false, //永久有效
    accountCount: undefined, //可用名额
    bindingDomainName: '', //绑定域名
    status: true, //状态
    creditCode: '', //统一社会信用代码
    // organizationCode: '', //组织机构代码
    legalRepresentative: '', //法定代表人
    legalMobile: '', //法人联系电话
    legalIdentityUrl: '', //法人身份证
    establishDate: '', //成立日期
    companyAddress: [], //公司地址
    cascadeInfo: [], //选中的省市区全部信息
    detailedAddress: '', //公司地址 详细地址

    businessLicenseUrl: '' //营业执照
  }, //新增表单
  addSuccessId: undefined, //创建主体成功ID 主要是用于创建主体后配置权限
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
  optionalMenuList: [], //上级主体 List
  optionalMenuTree: [], //上级主体 treeList
  optionalMenuTreeChange: [], //上级主体 跟主体类型联动
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
    'majorIndividualType',
    'systemName',
    'usableAmount',
    'validityPeriod',
    'bindingDomainName',
    'contactName',
    'contactMobile',
    'statusSwitch',
    'operation'
  ], //定制列默认的keys
  changedColumnsObj: {} //定制列组件接收到的当前列信息
})

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
    title: '主体名称',
    width: 200,
    dataIndex: 'name',
    key: 'name',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 1
  },
  {
    title: '主体编码',
    width: 100,
    dataIndex: 'code',
    key: 'code',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 2
  },
  {
    title: '主体类型',
    width: 100,
    dataIndex: 'majorIndividualType',
    key: 'majorIndividualType',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 2
  },
  {
    title: '系统名称',
    width: 100,
    dataIndex: 'systemName',
    key: 'systemName',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 3
  },
  {
    title: '已用/可用名额',
    width: 100,
    dataIndex: 'usableAmount',
    key: 'usableAmount',
    resizable: true,
    ellipsis: true,
    sort: 4
  },
  {
    title: '有效期',
    width: 200,
    dataIndex: 'validityPeriod',
    key: 'validityPeriod',
    resizable: true,
    ellipsis: true,
    sort: 5
  },

  {
    title: '绑定域名',
    width: 100,
    dataIndex: 'bindingDomainName',
    key: 'bindingDomainName',
    resizable: true,
    ellipsis: true,
    sort: 6
  },
  {
    title: '负责人',
    width: 100,
    dataIndex: 'contactName',
    key: 'contactName',
    resizable: true,
    ellipsis: true,
    sort: 7
  },
  {
    title: '负责人电话',
    width: 100,
    dataIndex: 'contactMobile',
    key: 'contactMobile',
    resizable: true,
    ellipsis: true,
    sort: 8
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'statusSwitch',
    key: 'statusSwitch',
    resizable: true,
    ellipsis: true,
    sort: 9
  },

  {
    title: '创建人',
    dataIndex: 'creator',
    width: 100,
    key: 'creator',
    resizable: true,
    ellipsis: true,
    sort: 10
  },
  {
    title: '创建时间',
    width: 100,
    dataIndex: 'createTime',
    key: 'createTime',
    resizable: true,
    ellipsis: true,
    sort: 11
  },
  {
    title: '最近操作人',
    width: 100,
    dataIndex: 'updater',
    key: 'updater',
    resizable: true,
    ellipsis: true,
    sort: 12
  },
  {
    title: '最近操作时间',
    width: 100,
    dataIndex: 'updateTime',
    key: 'updateTime',
    resizable: true,
    ellipsis: true,
    sort: 12
  },

  {
    title: '操作',
    width: 240,
    dataIndex: 'operation',
    key: 'operation',
    resizable: true,
    ellipsis: true,
    sort: 13
  }
]

/** 查询列表
 * @param isRefresh 右侧刷新图标进
 * */
const getList = async (isRefresh = false) => {
  state.loading = true
  const params = {
    // pageNo: queryParams.current,
    // pageSize: queryParams.pageSize,
    keyword: queryParams.keyword,
    systemName: queryParams.systemName,
    status: queryParams.status
  }

  if (queryParams?.startEndTime && queryParams?.startEndTime[0] && queryParams?.startEndTime[1]) {
    params['localDates'] = [
      queryParams?.startEndTime[0]?.format('YYYY-MM-DD'),
      queryParams?.startEndTime[1]?.format('YYYY-MM-DD')
      // queryParams.startEndTime[0]?.format('YYYY/MM/DD'),
      // queryParams.startEndTime[1]?.format('YYYY/MM/DD')
    ]
  }

  try {
    const res = await getMajorIndividualList(params)
    state.rawData = res
    state.tableDataArr = res
    state.tableDataList = res
    state.tableDataList.map((item) => {
      item.statusSwitch = item.status === 0
      item.bindingDomainName = item.domain
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')

      const tempType = state.majorIndividualTypeOptions.filter(
        (typeItem) => typeItem.value === item.type
      )

      item.majorIndividualType = tempType[0]?.label || ''

      item.store = item.type === null ? '门店' : ''
    })

    state.tableDataList = handleTree(state.tableDataList, 'id', 'belongTenantId', 'children')
    state.total = res.total
    console.log('state.tableDataList ', state.tableDataList)

    if (isRefresh) {
      message.success('刷新成功')
    }
  } finally {
    state.loading = false
  }

  // //获取菜单列表
  // // const menuList = await MenuApi.getSimpleMenusList()
  // const menuList = await MenuApi.getMajorIndividualSimpleMenusList({ id })
  // //不要展示按钮 默认按钮全选 后端处理
  // const tempArr = menuList.filter((item) => item.type !== 3)
  // state.menuTreeList = handleTree(tempArr)
  //
  // // state.menuTreeList = handleTree(await MenuApi.getSimpleMenusList())
  // state.parentCheckedKeys = []
  // state.menuTreeList.map((item) => {
  //   state.parentCheckedKeys.push(item.id)
  // })
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

//打开 修改上级主体 门店
const openEditParentMajorIndividual = (record) => {
  state.isShowParentMajorIndividual = true
  state.record = record
}

//打开Modal
const openModal = async (record = {}) => {
  //新增门店
  if (record.type === 'dealer' && state.modalType === 'add') {
    if (!(Object.keys(record).length === 0)) {
      //非空对象判断 新增子项时回显
      state.belongTenantId = record.id
      state.isShowStore = true
      console.log('新增门店')
    }
    return
  }
  const res = await getSimpleTenantList()

  // let menuTree = []
  // let menu = {}
  // let menu: Tree = { id: 0, name: '顶层主体', children: [] }
  // menu.children = handleTree(res, 'id', 'belongTenantId', 'children')
  // menuTree.push(menu)
  state.optionalMenuList = res

  state.optionalMenuTree = handleTree(res, 'id', 'belongTenantId', 'children')

  if (!(Object.keys(record).length === 0)) {
    //非空对象判断 新增子项时回显
    //上级主体
    if (!state.formState.majorIndividualType) {
      state.formState.belongTenantId = null
    } else {
      state.formState.belongTenantId = record.belongTenantId
    }
  } else {
    // state.formState.belongTenantId = state?.optionalMenuTree[0]
    //   ? state?.optionalMenuTree[0]?.id
    //   : null
    //不再取第一项了
    state.formState.belongTenantId = null
  }
  state.isShow = true
}

//关闭Modal
const closeModal = () => {
  state.isShow = false
  formRef.value.resetFields()
  //级联选择器 需要单独清空
  state.formState.companyAddress = []
  state.formState = {
    majorIndividualType: '', //主体类型
    belongTenantId: null, //上级主体
    code: '', //主体编码
    name: '', //主体名称
    abbreviate: '', //主体简称
    systemName: '', //系统名称
    logoUrl: '', //系统logo
    contactName: '', //负责人
    contactMobile: '', //负责人电话
    effectiveStartEndTime: [], //有效期
    // forever: false, //永久有效
    accountCount: undefined, //可用名额
    bindingDomainName: '', //绑定域名
    status: true, //状态
    creditCode: '', //统一社会信用代码
    // organizationCode: '', //组织机构代码
    legalRepresentative: '', //法定代表人
    legalMobile: '', //法人联系电话
    legalIdentityUrl: '', //法人身份证
    establishDate: '', //成立日期
    companyAddress: [], //公司地址
    cascadeInfo: [], //选中的省市区全部信息
    detailedAddress: '', //公司地址 详细地址
    businessLicenseUrl: '' //营业执照
  }

  state.logoListUrl = [] //系统logo 上传 回显 - -
  state.logoUrlSuccess = '' //系统logo 新增编辑入参
  state.legalPersonListUrl = [] //法人身份证 上传回显
  state.legalPersonUrlSuccess = '' //法人身份证 新增编辑入参
  state.businessLicenseListUrl = [] //营业执照 上传回显
  state.businessLicenseSuccess = '' //营业执照 新增编辑入参
  delete state.formState?.id
  state.modalTitle = '新增'
  state.modalType = 'add'
}

//关闭 新增/编辑门店
const closeStore = () => {
  state.isShowStore = false
  state.belongTenantId = null
  state.modalType = 'add'
  state.record = {}
  getList()
}

//关闭 详情 门店
const closeStoreDetails = () => {
  state.isShowStoreDetails = false
  state.record = {}
}

//关闭 修改上级主体 门店
const closeStoreParentMajorIndividual = () => {
  state.isShowParentMajorIndividual = false
  state.record = {}
  getList()
}

//详情 门店 修改
const editStoreDetails = (record) => {
  closeStoreDetails()
  console.log('record!!!!!!!!!!!!!!!!!!!', record)
  edit(record, false, record.type === null)
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
const edit = async (
  record,
  isCloseDetails = false,
  isStore = false,
  currentTabs = 'basicInformation'
) => {
  state.modalType = 'edit'
  state.modalTitle = '编辑'
  console.log('修改record', record)
  console.log('isStore', isStore)
  if (isStore) {
    //门店
    state.currentTabs = currentTabs
    state.isShowStore = true
    state.record = record
    return
  }
  // 修改modal 有效期 状态 关闭时  modal 用
  state.permissionRecord = record
  if (isCloseDetails) {
    //关闭详情moal
    state.isShowDetails = false
  }
  //获取主体详情
  const res = await getMajorIndividualDetails({ id: record.id })
  console.log('res==========', res)

  //菜单状态 0开启 1关闭
  // record.statusSwitch = record.status === 0
  record.status = record.status === 0

  //赋值 回显
  state.formState = {
    majorIndividualType: res.type, //主体类型
    belongTenantId: res.belongTenantId, //上级主体
    id: record.id,
    code: res.code, //主体编码
    name: res.name, //主体名称
    abbreviate: res.abbreviate, //主体简称
    systemName: res.systemName, //系统名称
    // logoUrl: res.logoUrl, //系统logo
    contactName: res.contactName, //负责人
    contactMobile: res.contactMobile, //负责人电话
    effectiveStartEndTime: [dayjs(res.effectiveStartDate), dayjs(res.expireTime)], //有效期 开始时间
    // expireTime: , //有效期 结束时间
    accountCount: res.accountCount, //可用名额
    // bindingDomainName: res.domain, //绑定域名
    bindingDomainName: res.domain.substring(8), //绑定域名
    creditCode: res.creditCode, //统一社会信用代码
    // organizationCode: res.organizationCode, //组织机构代码
    legalRepresentative: res.legalRepresentative, //法定代表人
    legalMobile: res.legalMobile, //法人联系电话
    // legalIdentityUrl: res.legalIdentityUrl, //法人身份证
    detailedAddress: res.address //公司地址 详细地址
    // businessLicenseUrl: res.businessLicenseUrl //营业执照
  }
  console.log('state.optionalMenuTree', state.optionalMenuTree)
  console.log('state.formState.belongTenantId', state.formState.belongTenantId)

  if (res.logoUrl) {
    state.logoListUrl = [
      {
        url: res.logoUrl //系统logo
      }
    ]
    state.logoUrlSuccess = res.logoUrl
  }

  if (res.legalIdentityUrl) {
    state.legalPersonListUrl = [
      {
        url: res.legalIdentityUrl //法人身份证
      }
    ]
    state.legalPersonUrlSuccess = res.legalIdentityUrl
  }

  if (res.businessLicenseUrl) {
    state.businessLicenseListUrl = [
      {
        url: res.businessLicenseUrl //营业执照
      }
    ]
    state.businessLicenseSuccess = res.businessLicenseUrl
  }

  if (res.establishDate) {
    state.formState['establishDate'] = dayjs(res.establishDate) //成立日期
  }

  //永久有效 起始时间为当前时间 结束时间为2099-12-31
  // state.formState.forever = res.expireTime === '2099-12-31'

  //状态0 开启 1关闭
  state.formState.status = res.status === 0

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

  majorIndividualTypeChange()
  openModal(record)
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

//新增主体
const addMajorIndividualFN = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  state.addEditLoading = true
  let params = {
    type: state.formState.majorIndividualType, //主体类型
    belongTenantId: state.formState.belongTenantId, //上级主体
    code: state.formState.code, //主体编码
    name: state.formState.name, //主体名称
    abbreviate: state.formState.abbreviate, //主体简称
    systemName: state.formState.systemName, //系统名称
    logoUrl: state.logoUrlSuccess, //系统logo
    contactName: state.formState.contactName, //负责人
    contactMobile: state.formState.contactMobile, //负责人电话
    effectiveStartDate: state.formState.effectiveStartEndTime[0]?.format('YYYY-MM-DD'), //有效期 开始时间
    expireTime: state.formState.effectiveStartEndTime[1]?.format('YYYY-MM-DD'), //有效期 结束时间
    // effectiveStartDate: state.formState.effectiveStartEndTime[0]?.format('YYYY/MM/DD'), //有效期 开始时间
    // expireTime: state.formState.effectiveStartEndTime[1]?.format('YYYY/MM/DD'), //有效期 结束时间
    accountCount: state.formState.accountCount, //可用名额
    domain: `https://${state.formState.bindingDomainName}`, //绑定域名
    creditCode: state.formState.creditCode, //统一社会信用代码
    // organizationCode: state.formState.organizationCode, //组织机构代码
    legalRepresentative: state.formState.legalRepresentative, //法定代表人
    legalMobile: state.formState.legalMobile, //法人联系电话
    legalIdentityUrl: state.legalPersonUrlSuccess, //法人身份证
    address: state.formState.detailedAddress, //公司地址 详细地址
    //
    businessLicenseUrl: state.businessLicenseSuccess //营业执照
  }

  // //永久有效 起始时间为当前时间 结束时间为2099-12-31
  // if (state.formState.forever) {
  //   params.effectiveStartDate = dayjs().format('YYYY-MM-DD')
  //   // params.effectiveStartDate = dayjs().format('YYYY/MM/DD')
  //   params.expireTime = '2099-12-31'
  // } else {
  //   params.effectiveStartDate = state.formState.effectiveStartEndTime[0]?.format('YYYY-MM-DD') //有效期 开始时间
  //   // params.effectiveStartDate = dayjs().format('YYYY/MM/DD')
  //   params.expireTime = state.formState.effectiveStartEndTime[1]?.format('YYYY-MM-DD') //有效期 结束时间
  // }
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
    // establishDate: state.formState.establishDate.format('YYYY/MM/DD'), //成立日期
  }

  try {
    let res = []
    if (state.modalType === 'add') {
      res = await addMajorIndividual(params)
      state.addSuccessId = res
      // message.success('新增成功')
      message.success('主体已建立成功！主体用户名和密码已发送到负责人手机号中，请注意查收！')
      //配置权限
      openPermissionModal(state.addSuccessId)
    } else {
      if (
        dayjs().isBetween(
          state.formState.effectiveStartEndTime[0],
          state.formState.effectiveStartEndTime[1],
          'day',
          []
        ) &&
        state.permissionRecord.statusSwitch === false
      ) {
        state.dateTime = {
          startTime: state.formState.effectiveStartEndTime[0].format('YYYY-MM-DD'),
          endTime: state.formState.effectiveStartEndTime[1].format('YYYY-MM-DD')
        }
        openDateModal()
        closeModal()
        return
      }

      params['id'] = state.formState.id
      res = await updateEditMajorIndividual(params)
      message.success('修改成功')
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
  state.selectAll = false
  state.isExpandAllTab = false
  state.isShowTree = false
}

//开启功能配置 modal
const openPermissionModal = async (id) => {
  state.isShowPermission = true
  // //获取菜单列表
  // state.menuTreeList = handleTree(await MenuApi.getSimpleMenusList())
  // //获取菜单列表
  // const menuList = await MenuApi.getSimpleMenusList()
  //获取菜单列表
  const menuList = await MenuApi.getMajorIndividualSimpleMenusList({ id })
  //不要展示按钮 默认按钮全选 后端处理
  const tempArr = menuList.filter((item) => item.type !== 3)
  state.menuTreeList = handleTree(tempArr)
}

//功能配置 Modal 确认
const PermissionOk = async () => {
  const params = {
    menuIds: state.idArr,
    tenantId: state.addSuccessId || state.permissionRecord.id, //主体id,新增权限模板从新增主体的res里取，修改时取当前列
    status: 0
  }
  if (state.permissionRecord?.packageId === null) {
    state.PermissionType = 'add'
  }
  if (state.PermissionType === 'add') {
    await addTenantPackage(params)
    message.success('新增成功')
  } else {
    params['id'] = state.editPermissionID
    await editTenantPackage(params)
    message.success('修改成功')
  }
  await getList()
  closePermissionModal()
}

const findParent = (childrenId, arr, path) => {
  if (path === undefined) {
    path = []
  }
  for (let i = 0; i < arr.length; i++) {
    let tmpPath = path.concat()
    tmpPath.push(arr[i].id)
    if (childrenId == arr[i].id) {
      return tmpPath
    }
    if (arr[i].children) {
      let findResult = findParent(childrenId, arr[i].children, tmpPath)
      if (findResult) {
        return findResult
      }
    }
  }
}

const assignPermission = async (record) => {
  state.permissionRecord = record
  state.PermissionType = 'edit'
  //TODO 有空改一下 - - 这里不大合适 需求一直改 这里改了好多次 - -
  await openPermissionModal(record.id)
  if (record.packageId != null) {
    const res = await getTenantPackage({ id: record.packageId })
    //... res 可能为null
    const { menuIds = [], dirIds = [], id } = res || []
    state.editPermissionID = id
    state.checkedKeys = menuIds
    console.log('state.menuTreeList', state.menuTreeList)
    console.log('dirIds', dirIds)
    console.log('menuIds', menuIds)
    nextTick(() => {
      state.selectTree = filterTree(state.menuTreeList, [...dirIds, ...menuIds])
    })
    console.log('state.selectTree', state.selectTree)
  } else {
    state.selectTree = []
  }
  //右侧展开显示 左侧选中的数据
  state.isShowRightTree = false
  nextTick(() => {
    state.isShowRightTree = true
    state.isShowTree = true
  })
  // await openPermissionModal(record.id)
}

//表格状态改变 确认modal... 然后才开短信 modal
//打开 状态开始关闭 确认modal
const openStatusModal = () => {
  state.isShowStatus = true
}
//关闭 状态开启关闭 确认modal
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
    state.tableStatusChangeInfo['tempTreeNum'] = toTreeCount(record?.children)
    state.tableStatusChangeInfo['type'] = record?.type === null ? '机构' : '主体'
  } else {
    state.tableStatusChangeInfo['statusBtnText'] = '确认关闭'
    state.tableStatusChangeInfo['statusTopText'] = `关闭后`
    state.tableStatusChangeInfo['statusText'] = `关闭`
    state.tableStatusChangeInfo['tempTreeNum'] = toTreeCount(record?.children)
    state.tableStatusChangeInfo['type'] = record?.type === null ? '机构' : '主体'
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
    state.messageText = '为了保护您的主体公司业务数据安全，请通过安全验证：'
  } else {
    state.messageBtnText = '确认关闭'
    state.messageText =
      '因您的主体公司还存在业务数据，如关闭则严重影响到业务，为了保护您的主体公司业务数据安全，请通过安全验证：'
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
  state.messageText = '为了保护您的主体公司业务数据安全，请通过安全验证：'
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
  try {
    if (state.record.type === null) {
      //门店 TODO 短信
      await updateOrganizationStatus({
        id: state.record.id,
        status: state.record.statusSwitch === true ? 0 : 1
      })
    } else {
      //主体
      const params = {
        id: state.record.id,
        code: state.messageCode,
        status: state.record.statusSwitch === true ? 0 : 1
      }

      await updateEditMajorIndividualStatus(params)
    }

    message.success('修改状态成功')
    statusCancel()
  } finally {
  }
}

//打开修改 modal 时 有效期与状态 判断 modal
const openDateModal = () => {
  state.isShowDateStatus = true
}

//关闭修改 modal 时 有效期与状态 判断 modal
const closeDateModal = () => {
  state.isShowDateStatus = false
  state.permissionRecord = {}
  state.dateTime = {}
}
//关闭修改 modal 时 有效期与状态 判断 modal  确认开启
const dateOkModal = () => {
  state.permissionRecord.statusSwitch = true
  tableStatusChange(true, state.permissionRecord)
  closeDateModal()
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
  if (record?.type === null) {
    //门店
    state.record = record
    state.isShowStoreDetails = true
    return
  }
  // state.record = record
  //获取主体详情
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

  const tempType = state.majorIndividualTypeOptions.filter((item) => item.value === res.type)

  state.detailsInfo = [
    {
      baseTitle: '基本信息',
      infoArr: [
        {
          textSpan: '上级主体：',
          text: tempItem[0]?.name
        },
        {
          textSpan: '主体名称：',
          text: res.name
        },
        {
          textSpan: '主体类型：',
          text: tempType[0]?.label
        },
        {
          textSpan: '主体编码：',
          text: res.code
        },
        {
          textSpan: '主体简称：',
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
        // {
        //   textSpan: '组织机构代码：',
        //   text: res.organizationCode
        // },
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

//数据字典
const getAllType = async () => {
  //获取数据字典
  const dictRes = await getOrganizationTypeList()

  //适用主体类型
  state.majorIndividualTypeOptions = dictRes.filter((item) => item.dictType === 'tenant_type')
}

// 新增、修改 主体类型
const majorIndividualTypeChange = () => {
  console.log('state.optionalMenuTree', state.optionalMenuTree)

  if (state.formState.majorIndividualType === 'manufacturer') {
    //  厂家
    //  厂家 - -只有顶层
    state.optionalMenuTreeChange = state.optionalMenuList.filter((item) => item.id === 0)
    console.log(' state.optionalMenuTreeChange=====', state.optionalMenuTreeChange)
  } else {
    //  经销商 - -顶层 跟厂家
    state.optionalMenuTreeChange = state.optionalMenuList.filter(
      (item) => item.id === 0 || item.type === 'manufacturer'
    )
  }

  state.optionalMenuTreeChange = handleTree(
    state.optionalMenuTreeChange,
    'id',
    'belongTenantId',
    'children'
  )
}

//接收 定制列modal事件  - -关闭modal也一起吧 - -
const changeColumn = (columnsObj, isCloseModal = false) => {
  if (isCloseModal) {
    state.isShowCustomColumnModal = false
    return
  }
  state.columns = cloneDeep(columnsObj.currentColumns)
  state.changedColumnsObj = cloneDeep(columnsObj)
  state.refreshTable = false
  state.refreshTable = true
  state.isShowCustomColumnModal = false
}

//初始化 获取默认的 columns
allColumns.map((item, index) => {
  item.sort = index + 1
})
state.columns = getColumns(state, PageKeyObj.business, allColumns, state.defaultKeys)

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
  },
  {
    immediate: true,
    deep: true
  }
)

watch(
  () => state.columns,
  (columns) => {
    const needItem = columns.find((item) => item.key === 'name')
    state.treeIconIndex = needItem.sort - 1
  },
  {
    immediate: true,
    deep: true
  }
)

onMounted(async () => {
  await getAllType()
  await getList()
})
</script>

<style lang="scss" scoped>
.search-card {
  min-width: 1710px;
  min-height: 72px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.total-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.content {
  width: 100px;
  height: 100px;
  background: skyblue;
}

//新增  导出 button
.card-content {
  width: 100%;
  //min-width: 1650px;
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
  //max-height: 870px;
  //min-height: 870px;
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
  cursor: pointer;
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
  width: 380px;
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
.select-tip {
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(179, 179, 179);
}
.name-content {
  display: flex;
}
.store-tag {
  margin-left: 10px;
  padding: 8px;
  width: 40px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: rgba(237, 249, 232, 1);
  color: rgba(82, 196, 26, 1);
  font-size: 12px;
  font-family: PingFangSC-Regular;
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

//状态变更
.status-change-modal {
  .ant-modal-footer {
    border-width: 0;
  }
}

.date-status-change-modal {
  .ant-modal-footer {
    border-width: 0;
  }
  .ant-modal-header {
    border-width: 0;
  }
}
</style>
