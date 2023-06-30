<!-- 成员管理  -->
<template>
  <div class="total-content" id="card-content">
    <div class="left-card-content">
      <!--  tree  -->
      <LeftTreeSelect
        :tree-data="state.organizationOptions"
        @sendCurrentSelect="sendCurrentSelect"
        :selectedKeys="state.selectedKeys"
        :testArr="state.testArr"
      />
    </div>
    <div class="right-card-content">
      <!--  搜索  -->
      <a-card :bodyStyle="{ marginBottom: '10px' }">
        <!--  本来是不上表单的  非要校验联系电话  -->
        <a-form :model="queryParams" :noStyle="true" class="search-form-style" autocomplete="off">
          <div class="total-search-content">
            <div class="search-content">
              <div class="search-item">
                <div class="item-label">成员姓名：</div>
                <div class="item-condition">
                  <a-input
                    class="width-100"
                    v-model:value="queryParams.memberName"
                    @pressEnter="getList(1)"
                    placeholder="请输入姓名或工号"
                    allowClear
                  />
                </div>
              </div>
              <div class="search-item">
                <div class="item-label">联系电话：</div>
                <div class="item-condition">
                  <!-- <a-form-item name="memberPhone" :rules="[{ validator: numValidator }]">-->
                  <a-input
                    class="width-100"
                    v-model:value="queryParams.memberPhone"
                    @pressEnter="getList()"
                    @change="() => limitInput(queryParams.memberPhone)"
                    maxlength="11"
                    placeholder="请输入联系电话"
                    allowClear
                  />
                  <!-- </a-form-item>-->
                </div>
              </div>
              <div class="search-item">
                <div class="item-label">岗位类型：</div>
                <div class="item-condition">
                  <a-select
                    v-model:value="queryParams.postType"
                    :options="state.postTypeOptions"
                    @change="postTypeChange"
                    class="width-100"
                    placeholder="请选择"
                    allowClear
                  />
                </div>
              </div>

              <div class="search-item">
                <div class="item-label">岗位：</div>
                <div class="item-condition">
                  <a-select
                    v-model:value="queryParams.post"
                    :options="state.postTypeSpecifyOptions"
                    class="width-100"
                    placeholder="请选择"
                    allowClear
                  />
                </div>
              </div>

              <!--            <div class="search-item">-->
              <!--              <div class="item-label">岗位：</div>-->
              <!--              <div class="item-condition flex-style">-->
              <!--                <a-select-->
              <!--                  v-model:value="queryParams.post"-->
              <!--                  :options="state.postTypeSpecifyOptions"-->
              <!--                  class="width-100"-->
              <!--                  placeholder="请选择"-->
              <!--                />-->
              <!--                &lt;!&ndash;                <a-input&ndash;&gt;-->
              <!--                &lt;!&ndash;                  class="width-100"&ndash;&gt;-->
              <!--                &lt;!&ndash;                  v-model:value="queryParams.post"&ndash;&gt;-->
              <!--                &lt;!&ndash;                  @pressEnter="getList"&ndash;&gt;-->
              <!--                &lt;!&ndash;                  placeholder="输入岗位名称搜索"&ndash;&gt;-->
              <!--                &lt;!&ndash;                />&ndash;&gt;-->
              <!--              </div>-->
              <!--            </div>-->

              <div class="search-item">
                <div class="item-label">是否兼岗：</div>
                <div class="item-condition">
                  <a-select
                    v-model:value="queryParams.partPost"
                    class="width-100"
                    :options="state.partPostOptions"
                    placeholder="请选择"
                    allowClear
                  />
                </div>
              </div>

              <div class="search-item">
                <div class="item-label">入职时间：</div>
                <div class="item-condition item-condition-date">
                  <a-range-picker
                    v-model:value="queryParams.startEndTime"
                    format="YYYY/MM/DD"
                    :placeholder="['开始时间', '结束时间']"
                  />
                </div>
              </div>

              <div class="search-item">
                <div class="item-label">配置角色：</div>
                <div class="item-condition">
                  <a-select
                    v-model:value="queryParams.configureRoles"
                    class="width-100"
                    :options="state.configureRolesOptions"
                    mode="multiple"
                    placeholder="请选择"
                    optionFilterProp="label"
                    allowClear
                  />
                </div>
              </div>
              <div class="search-item">
                <div class="item-label">人员类型：</div>
                <div class="item-condition">
                  <a-select
                    v-model:value="queryParams.memberType"
                    class="width-100"
                    :options="state.memberTypeOptions"
                    placeholder="请选择"
                    allowClear
                  />
                </div>
              </div>
              <div class="search-item">
                <div class="item-label">在职状态：</div>
                <div class="item-condition">
                  <a-select
                    v-model:value="queryParams.isOnJob"
                    class="width-100"
                    :options="state.onJobOptions"
                    placeholder="请选择"
                    allowClear
                  />
                </div>
              </div>
              <div class="search-item">
                <div class="item-label">账号状态：</div>
                <div class="item-condition">
                  <a-select
                    v-model:value="queryParams.userType"
                    class="width-100"
                    :options="state.userTypeOptions"
                    placeholder="请选择"
                    allowClear
                  />
                </div>
              </div>
            </div>

            <div class="search-btn-content">
              <a-button
                type="primary"
                html-type="submit"
                @click="getList(1)"
                v-hasPermi="['system:user:list']"
                >查询</a-button
              >
              <a-button @click="resetQuery">重置</a-button>
            </div>
          </div>
        </a-form>
      </a-card>

      <!--  表格  -->
      <a-card :bordered="false" style="padding-bottom: 30px">
        <div class="card-content">
          <!--  左侧按钮  -->
          <div class="button-content">
            <a-button type="primary" @click="openModal()" v-hasPermi="['system:user:create']">
              <template #icon>
                <Icon icon="svg-icon:add" class="btn-icon" :size="10" />
              </template>
              新增
            </a-button>
            <a-button @click="toggleExpandAll" v-if="false">
              <template #icon>
                <Icon
                  icon="svg-icon:expansion"
                  class="btn-icon"
                  :size="10"
                  v-if="state.isExpandAll"
                />
                <Icon icon="svg-icon:expandFold" class="btn-icon" :size="10" v-else />
              </template>
              展开收起
            </a-button>
            <a-button
              :disabled="state.selectedRowKeys && state.selectedRowKeys.length === 0"
              @click="batchChangePost()"
              v-hasPermi="['system:user:post-adjustment']"
              >批量转岗
            </a-button>
            <a-button
              :disabled="state.selectedRowKeys && state.selectedRowKeys.length === 0"
              @click="batchAssignUserRole()"
              v-hasPermi="['system:permission:assign-user-role-batch']"
              >批量设角色
            </a-button>
          </div>
          <!--  右侧操作  -->
          <div class="operation-content">
            <!--        <Icon icon="svg-icon:search" :size="50" class="cursor-pointer" />-->
            <Icon
              icon="svg-icon:full-screen"
              :size="50"
              class="cursor-pointer"
              @click="fullScreen"
            />
            <!--        <Icon icon="svg-icon:print-connect" :size="50" class="cursor-pointer" />-->
            <Icon
              icon="svg-icon:refresh"
              :size="50"
              class="cursor-pointer"
              @click="getList(queryParams.current, true)"
            />
            <Icon
              icon="svg-icon:custom-column"
              :size="50"
              class="cursor-pointer"
              @click="state.isShowCustomColumnModal = true"
            />
          </div>
        </div>

        <!-- 分页本来用antdV自带的  那边用的vxe table 在没有引进antdV之前用element plus 的分页封了个组件 - - 本来想说换成antdV的 榕森不换  -->
        <!--        @change="onChange"-->
        <!--        :pagination="{-->
        <!--        pageSizeOptions: ['20', '30', '60', '100', '200', '500', '1000'],-->
        <!--        showSizeChanger: true,-->
        <!--        showQuickJumper: true,-->
        <!--        pageSize: queryParams.pageSize,-->
        <!--        current: queryParams.current,-->
        <!--        total: state.total,-->
        <!--        showTotal: (total) => `总共 ${total} 条`-->
        <!--        }"-->
        <a-table
          v-if="state.refreshTable"
          class="table-list"
          :columns="state.columns"
          :data-source="state.tableDataList"
          :scroll="{ x: 'max-content', y: 500 }"
          row-key="id"
          :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
          :loading="state.loading"
          :expandable="{ defaultExpandAllRows: false, expandRowByClick: false }"
          :defaultExpandAllRows="state.isExpandAll"
          @resizeColumn="handleResizeColumn"
          :pagination="false"
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
            <!--  联系电话   -->
            <template v-if="column?.key === 'memberPhone'">
              <div
                v-for="(item, index) in record?.memberPhoneList"
                :key="`memberPhoneList${index}`"
                class="phone-div-content"
              >
                <div class="phone-div">{{ item.phoneNum }}</div>
                <div :class="item.type === '1' ? 'private-tag' : 'company-tag'"
                  >{{ item.phoneType }}
                </div>
              </div>
            </template>

            <!--  部门/岗位   -->
            <template v-if="column?.key === 'departmentPost'">
              <div
                v-for="(item, index) in record?.departmentPostList"
                class="phone-div-content"
                :key="`departmentPostList${index}`"
              >
                <div class="phone-div">
                  <a-tooltip>
                    <template #title>{{ item.departmentAll }}</template>
                    <span
                      :class="[
                        { 'close-style': item.depStatus },
                        { 'delete-style': item.depDelete }
                      ]"
                      >{{ item.department }}</span
                    >
                  </a-tooltip>
                  /
                  <span
                    :class="[
                      { 'close-style': item.postStatus },
                      { 'delete-style': item.postDelete }
                    ]"
                    >{{ item.post }}</span
                  >
                </div>
                <div :class="item.type === 'main_post' ? 'principal-tag' : 'part-tag'"
                  >{{ item.typeText }}
                </div>
              </div>
            </template>

            <!--  配置角色   -->
            <template v-if="column?.key === 'configureRoles'">
              <!--              <a-tag-->
              <!--                v-for="item in record?.roleVOList"-->
              <!--                :color="item.type === '1' ? '#0081FF' : '#0081FF'"-->
              <!--                >{{ item.roleName }}</a-tag-->
              <!--              >-->
              <!--              :class="item.type === '1' ? 'role-tag' : 'role-close-tag'"-->
              <div class="phone-div-content">
                <!--  催命似的催  这里直接暴力上判断了  -->
                <div
                  :class="[
                    { 'role-tag': !item.roleStatus && !item.roleDelete },
                    { 'role-close-tag': !item.roleDelete && item.roleStatus },
                    { 'role-delete-tag': item.roleDelete }
                  ]"
                  v-for="item in record?.roleVOListDeal"
                  >{{ item.roleName }}
                </div>
              </div>
            </template>

            <!--  状态   -->
            <template v-if="column?.key === 'statusSwitch'">
              <a-switch
                v-model:checked="record.statusSwitch"
                @change="(value) => setTableStatusChangeInfo(value, record)"
                :disabled="record.userStatus === 1 || !state.organizationHasPermission"
              />
            </template>
            <!--  操作   -->
            <template v-if="column?.key === 'operation'">
              <div class="operation-content">
                <div
                  class="text-color margin-right-5"
                  @click="edit(record)"
                  v-hasPermi="['system:user:update']"
                  >修改</div
                >
                <div
                  class="text-color margin-right-5"
                  @click="assignPermission(record)"
                  v-hasPermi="['system:permission:assign-user-role']"
                  >分配角色
                </div>
                <div
                  class="text-color margin-right-5"
                  @click="detailsInfo(record)"
                  v-hasPermi="['system:user:query']"
                  >详情</div
                >
                <a-popover placement="bottom">
                  <template #content>
                    <div
                      class="text-color margin-right-5"
                      @click="setTableStatusChangeInfo(false, record, 'delete')"
                      v-hasPermi="['system:user:delete']"
                      >删除
                    </div>
                    <div
                      class="text-color margin-right-5"
                      @click="resetPassword(record)"
                      v-hasPermi="['system:user:update-password']"
                    >
                      重置密码
                    </div>
                  </template>
                  <Icon icon="svg-icon:ellipsis" class="btn-icon" :size="18" />
                </a-popover>
              </div>
            </template>
          </template>
        </a-table>
        <!-- 分页 -->
        <Pagination
          :total="state.total"
          v-model:page="queryParams.current"
          v-model:limit="queryParams.pageSize"
          style="padding: 0 15px"
          @pagination="onPageChange"
        />
      </a-card>
    </div>

    <!--  详情 角色信息 tags弹窗-->
    <ConfigDetailDrawer ref="configDetailDrawerRef" :showStaff="false" />
  </div>

  <!-- 新增 编辑 Modal -->
  <a-modal
    v-model:visible="state.isShow"
    destroyOnClose
    :title="state.modalTitle"
    wrapClassName="add-edit-modal"
    @cancel="closeModal"
    :width="'950px'"
    :bodyStyle="{ padding: 0 }"
  >
    <div class="base_info_content" @scroll="handleModalScroll">
      <a-form
        :model="formState"
        ref="formRef"
        v-bind="layout"
        :label-col="{ style: { width: '130px' } }"
        autocomplete="off"
      >
        <div class="title-content">
          <div class="blue-line"></div>
          基本信息
        </div>
        <div class="form-content">
          <a-form-item
            :label="`成员工号`"
            name="memberNum"
            :rules="[{ required: true, message: `成员工号不能为空` }, { validator: numValidator }]"
            class="width-50"
          >
            <a-input
              v-model:value="formState.memberNum"
              show-count
              :maxlength="20"
              placeholder="请输入成员工号"
            />
          </a-form-item>

          <a-form-item
            :label="`成员姓名`"
            name="memberName"
            :rules="state.memberNameRules"
            class="width-50"
          >
            <a-input
              v-model:value="formState.memberName"
              show-count
              :maxlength="20"
              placeholder="请输入成员真实姓名"
              @change="changeToPinYin"
            />
          </a-form-item>

          <a-form-item
            :label="`姓名拼音全拼`"
            name="namePhoneticize"
            :rules="[
              { required: true, message: `姓名拼音全拼不能为空` },
              { validator: englishValidator }
            ]"
            class="width-50"
          >
            <a-input
              v-model:value="formState.namePhoneticize"
              placeholder="系统根据输入的姓名自动带出"
            />
          </a-form-item>

          <a-form-item
            :label="`英文名`"
            name="englishName"
            class="width-50"
            :rules="[{ validator: englishValidator }]"
          >
            <a-input
              v-model:value="formState.englishName"
              show-count
              :maxlength="20"
              placeholder="请输入成员英文名"
            />
          </a-form-item>

          <a-form-item
            :label="`性别`"
            name="sex"
            :rules="[{ required: true, message: `性别不能为空` }]"
            class="width-50"
          >
            <a-radio-group v-model:value="formState.sex" name="radioSexGroup">
              <a-radio value="1">男</a-radio>
              <a-radio value="2">女</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            :label="`入职时间`"
            name="entryTime"
            :rules="[{ required: true, message: `入职时间不能为空` }]"
            class="width-50"
          >
            <a-date-picker
              ref="entryRef"
              placeholder="请选择时间"
              v-model:value="formState.entryTime"
              class="width-100"
            />
          </a-form-item>

          <a-form-item
            :label="`人员类型`"
            name="memberType"
            :rules="[{ required: true, message: `人员类型不能为空` }]"
            class="width-50"
          >
            <a-radio-group v-model:value="formState.memberType" name="radioMemberTypeGroup">
              <a-radio v-for="item in state.memberTypeOptions" :value="item.value"
                >{{ item.label }}
              </a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            v-if="state.modalType === 'edit'"
            :label="`人员状态`"
            name="isOnJob"
            :rules="[{ required: true, message: `人员状态不能为空` }]"
            class="width-50"
          >
            <a-radio-group v-model:value="formState.isOnJob" name="radioIsOnJobGroup">
              <a-radio v-for="item in state.onJobOptions" :value="item.value"
                >{{ item.label }}
              </a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            v-if="formState.isOnJob === '1'"
            :label="`离职日期`"
            name="departureTime"
            class="width-50"
            :rules="[{ required: true, message: `离职时间不能为空` }]"
          >
            <a-date-picker
              placeholder="请选择离职日期"
              v-model:value="formState.departureTime"
              :disabled-date="disabledDate"
              class="width-100"
            />
          </a-form-item>

          <a-form-item
            v-if="state.modalType === 'add'"
            label="账号状态"
            name="status"
            :rules="[{ required: true, message: '菜单状态!' }]"
            class="width-50"
          >
            <a-switch
              v-model:checked="formState.status"
              checked-children="开启"
              un-checked-children="关闭"
            />
          </a-form-item>

          <a-form-item
            :label="`联系电话`"
            :rules="[{ required: true, message: `联系电话不能为空` }]"
            class="width-100"
          >
            <a-table
              :data-source="addDataSource.addEditTableData"
              :columns="addEditColumns"
              :pagination="false"
              @resizeColumn="handleResizeColumn"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'phoneType'">
                  <div>
                    <a-radio-group
                      v-model:value="record.phoneType"
                      name="radioPhoneTypeGroup"
                      @change="() => clearPhoneNum(record)"
                    >
                      <a-radio-button
                        value="1"
                        style="margin-right: 5px; border-radius: 4px"
                        class="radio-btn"
                      >
                        <Icon
                          icon="svg-icon:check"
                          :size="10"
                          class="margin-right-4"
                          v-if="record.phoneType === '1'"
                        />手机号</a-radio-button
                      >
                      <a-radio-button value="2" style="border-radius: 4px" class="radio-btn"
                        ><Icon
                          icon="svg-icon:check"
                          :size="10"
                          class="margin-right-4"
                          v-if="record.phoneType === '2'"
                        />座机</a-radio-button
                      >
                    </a-radio-group>
                  </div>
                </template>

                <template v-if="column.key === 'phoneNum'">
                  <div class="phone-style">
                    <a-form-item
                      :rules="[{ required: true, message: `电话不能为空` }]"
                      class="phone-form-style"
                    >
                      <a-input
                        v-model:value="record.phoneNum"
                        @change="() => limitInput(record.phoneNum, record)"
                        placeholder="请输入号码"
                        :maxlength="record.phoneType === '1' ? 11 : 12"
                      />
                    </a-form-item>
                  </div>
                </template>

                <template v-if="column.key === 'useType'">
                  <div>
                    <a-radio-group v-model:value="record.useType" name="radioUseTypeGroup">
                      <a-radio-button
                        value="1"
                        size="small"
                        style="margin-right: 5px; border-radius: 4px"
                        class="radio-btn"
                        ><Icon
                          icon="svg-icon:check"
                          :size="10"
                          class="margin-right-4"
                          v-if="record.useType === '1'"
                        />私人</a-radio-button
                      >
                      <a-radio-button value="2" style="border-radius: 4px" class="radio-btn"
                        ><Icon
                          icon="svg-icon:check"
                          :size="10"
                          class="margin-right-4"
                          v-if="record.useType === '2'"
                        />公司</a-radio-button
                      >
                    </a-radio-group>
                  </div>
                </template>

                <template v-if="column.key === 'isService'">
                  <div>
                    <a-switch
                      v-model:checked="record.isService"
                      checked-children="开启"
                      un-checked-children="关闭"
                    />
                  </div>
                </template>

                <template v-if="column.key === 'existWxWork'">
                  <div>
                    <a-switch
                      v-model:checked="record.existWxWork"
                      checked-children="开启"
                      un-checked-children="关闭"
                    />
                  </div>
                </template>

                <!--  操作   -->
                <template v-if="column?.key === 'operation'">
                  <div class="operation-content">
                    <div class="text-color margin-right-5" @click="addColumns(index)">增加</div>
                    <div
                      class="text-color margin-right-5"
                      @click="deleteColumns(index)"
                      v-if="addDataSource.addEditTableData?.length > 1"
                      >删除
                    </div>
                  </div>
                </template>
              </template>
            </a-table>
          </a-form-item>

          <a-form-item label="成员头像" name="legalIdentityUrl" class="width-100">
            <div style="height: 131px">
              <UploadImg
                v-model:modelValue="state.legalPersonUrlSuccess"
                width="72px"
                height="100px"
              />
              <!--              <a-upload-->
              <!--                v-model:file-list="state.legalPersonListUrl"-->
              <!--                :action="updateUrl + '?updateSupport=' + updateSupport"-->
              <!--                list-type="picture-card"-->
              <!--                @preview="handlePreview"-->
              <!--                accept=".jpg, .png, .gif"-->
              <!--                class="avatar-uploader"-->
              <!--                :show-upload-list="true"-->
              <!--                :headers="uploadHeaders"-->
              <!--                :before-upload="(file, fileList) => beforeUpload(file, fileList, 'legalPerson')"-->
              <!--                @change="-->
              <!--                  (file, fileList) => {-->
              <!--                    handleChange(file, fileList, 'legalPerson')-->
              <!--                  }-->
              <!--                "-->
              <!--                @remove="-->
              <!--                  (file) => {-->
              <!--                    removeImg(file, 'legalPerson')-->
              <!--                  }-->
              <!--                "-->
              <!--              >-->
              <!--                <div v-if="state.legalPersonListUrl.length < 1">-->
              <!--                  <Icon icon="svg-icon:add-upload" :size="15" />-->
              <!--                  <div style="margin-top: 8px">上传照片</div>-->
              <!--                </div>-->
              <!--              </a-upload>-->

              <div class="upload-text"> 请上传成员的头像，支持png/jpg格式。</div>
            </div>
          </a-form-item>
        </div>

        <div class="title-content">
          <div class="blue-line"></div>
          岗位信息
        </div>
        <a-form-item :label="``" class="width-100">
          <a-table
            :data-source="addPostDataSource.addEditTableData"
            :columns="addEditPostColumns"
            :pagination="false"
            @resizeColumn="handleResizeColumn"
          >
            <template #headerCell="{ column }">
              <!--  自定义表头  -->
              <template v-if="column.key === 'department'">
                <div class="table_heard">
                  <span style="color: red">* </span>
                  <span>所属公司/门店/部门</span>
                </div>
              </template>

              <template v-if="column.key === 'post'">
                <div class="table_heard">
                  <span style="color: red">* </span>
                  <span>岗位</span>
                </div>
              </template>
            </template>

            <template #bodyCell="{ column, text, record, index }">
              <template v-if="column.key === 'department'">
                <div>
                  <a-tree-select
                    v-model:value="record.department"
                    dropdownClassName="department-tree-select-content"
                    :dropdownMatchSelectWidth="false"
                    show-search
                    :dropdown-style="{ maxHeight: '400px', width: '500px', overflow: 'auto' }"
                    placeholder="请选择公司/门店/部门"
                    :tree-data="state.organizationIDOptions"
                    :field-names="{
                      children: 'children',
                      label: 'title',
                      value: 'key'
                    }"
                    treeNodeFilterProp="title"
                  />
                </div>
              </template>

              <template v-if="column.key === 'post'">
                <div>
                  <a-tree-select
                    v-model:value="record.post"
                    style="width: 100%"
                    show-search
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="请选择岗位"
                    :tree-data="state.postListOptions"
                    treeNodeFilterProp="label"
                  />
                </div>
              </template>

              <template v-if="column.key === 'brand'">
                <div>
                  <a-tree-select
                    v-model:value="record.brand"
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="请选择所属品牌"
                    multiple
                    :tree-data="state.barnOptions"
                  />
                </div>
              </template>

              <template v-if="column.key === 'isMainPost'">
                <div>
                  <!--                  <a-select-->
                  <!--                    v-model:value="record.isMainPost"-->
                  <!--                    class="width-100"-->
                  <!--                    :options="state.partPostOptionsText"-->
                  <!--                    placeholder="请选择"-->
                  <!--                  />-->
                  {{ record?.isMainPostText }}
                </div>
              </template>

              <template v-if="column.key === 'isShow'">
                <div>
                  <a-switch :disabled="index === 0" v-model:checked="record.isShow" />
                </div>
              </template>

              <!--  操作   -->
              <template v-if="column?.key === 'operation'">
                <div class="operation-content">
                  <div class="text-color margin-right-5" @click="addPostColumns(index)"
                    >增加兼岗</div
                  >
                  <div
                    class="text-color margin-right-5"
                    @click="deletePostColumns(index)"
                    v-if="index !== 0"
                    >删除
                  </div>
                </div>
              </template>
            </template>
          </a-table>
        </a-form-item>

        <div class="title-content">
          <div class="blue-line"></div>
          详细信息
        </div>

        <div class="form-content">
          <a-form-item :label="`出生日期`" class="width-50">
            <a-date-picker
              ref="birthDayRef"
              placeholder="请选择时间"
              v-model:value="formState.birthDay"
              :disabled-date="disabledDate"
              class="width-100"
            />
          </a-form-item>

          <a-form-item
            :label="`QQ`"
            name="qqNum"
            class="width-50"
            :rules="[{ validator: numValidator }]"
          >
            <a-input
              v-model:value="formState.qqNum"
              show-count
              :maxlength="20"
              placeholder="请输入QQ"
            />
          </a-form-item>

          <a-form-item
            name="email"
            :label="`电子邮箱`"
            class="width-50"
            :rules="state.contactMailRules"
          >
            <a-input v-model:value="formState.email" placeholder="请输入电子邮箱" />
          </a-form-item>

          <a-form-item :label="`个人微信号`" class="width-50">
            <a-input v-model:value="formState.wechat" placeholder="请输入个人微信号" />
          </a-form-item>
        </div>

        <!--  级联选择器  - -   -->
        <a-form-item :label="`家庭地址`" name="detailedAddress">
          <div class="flex-content adress-content">
            <a-form-item-rest>
              <a-cascader
                v-model:value="formState.companyAddress"
                :options="state.proMunAreaList"
                @change="cascadeChange"
                placeholder="请选择省市区"
              />
            </a-form-item-rest>
            <a-input
              v-model:value="formState.detailedAddress"
              placeholder="请输入详细的地址信息，具体到门牌号"
              class="adress-input"
            />
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
        >确定
      </a-button>
      <a-button @click="closeModal">取消</a-button>
    </template>
  </a-modal>

  <!-- 分配角色 Modal -->
  <a-modal
    v-model:visible="state.isShowPermission"
    destroyOnClose
    title="分配角色"
    @cancel="closePermissionModal"
    :width="'665px'"
    :bodyStyle="{ height: '207px', margin: '0', padding: '0', overflow: 'auto' }"
  >
    <div class="assign-roles-content">
      <div class="member-info">
        <div class="member-num">
          {{ state.permissionRecord?.username }}
        </div>
        <div class="member-name">
          {{ state.permissionRecord?.memberName || state.permissionRecord?.nickname }}
        </div>
      </div>

      <div
        class="message-text assign-roles-tip"
        v-if="
          (state.permissionRecord?.roleVOList?.length === 0 ||
            state.permissionRecord?.roleVOList === null) &&
          state.hasRoles
        "
      >
        <img :src="warningImg" alt="" class="tip-img message-img waring-img" />
        <div class="roles-text">
          系统校验到您设置的岗位
          <span
            v-for="(item, index) in state.permissionRecord?.postVOListDeal"
            :key="`postVOListDeal-${index}`"
          >
            【{{ item.postName }}】
          </span>
          已有分配以下角色，您可修改或增加
        </div>
      </div>

      <div class="roles-select-content">
        <div class="role-text">分配角色</div>
        <a-select
          v-model:value="state.roleId"
          mode="multiple"
          style="width: 100%"
          placeholder="请选择角色"
          :options="state.configureRolesNewTreeOptions"
          @change="rolesChange"
          optionFilterProp="label"
        />
      </div>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="PermissionOk" :loading="state.btnLoading"
        >确定</a-button
      >
      <a-button @click="closePermissionModal">暂不设置</a-button>
    </template>
  </a-modal>

  <!--  状态开始关闭  删除 确认Modal  -->
  <a-modal
    v-model:visible="state.isShowStatus"
    destroyOnClose
    :closable="false"
    @cancel="closeStatusModal"
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
            state.tableStatusChangeInfo.statusTitleText
          }}
          {{ state.tableStatusChangeInfo.record.memberName }}
          {{ state.tableStatusChangeInfo.statusText }}
          吗？
        </div>
        <div class="status-text-info">
          {{ state.tableStatusChangeInfo.statusTopText }}，
          {{ state.tableStatusChangeInfo.record.name }}
          {{ state.tableStatusChangeInfo.statusContentText }}
        </div>
      </div>
    </div>

    <template #footer>
      <a-button type="primary" html-type="submit" @click="tableStatusConfirm"
        >{{ state.tableStatusChangeInfo.statusBtnText }}
      </a-button>
      <a-button @click="closeStatusModal">取消</a-button>
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
    <div v-for="(item, index) in state.detailsInfo" :key="`info${index}`" class="details-content">
      <div class="flex-space">
        <div class="title-content">
          <div class="blue-line"></div>
          {{ item.baseTitle }}
        </div>
        <div
          class="details-edit"
          @click="edit(state.detailsRecord, true)"
          v-if="item?.needEdit"
          v-hasPermi="['system:user:update']"
          ><img :src="editImg" alt="" class="edit-Img" />修改
        </div>
      </div>
      <div :class="['info-content', { 'tags-content': item?.isShow }]">
        <template v-if="!item.isShow">
          <div
            :class="[
              'text-style',
              { 'super-admin-style': childItem?.isSuperAdmin },
              { 'width-full': childItem?.isFull }
            ]"
            v-for="(childItem, childIndex) in item.infoArr"
            :key="`childItem${childIndex}`"
          >
            <span>{{ childItem.textSpan }}</span>
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

            <!--  联系电话  -->
            <div v-if="childItem?.type === 'contactNumber'">
              <a-table
                :dataSource="childItem?.tableData"
                :columns="childItem?.tableColumns"
                :pagination="false"
              />
            </div>

            <!--  岗位信息 -->
            <div v-if="childItem?.type === 'postInfo'">
              <a-table
                :dataSource="childItem?.tableData"
                :columns="childItem?.tableColumns"
                :pagination="false"
              />
            </div>
          </div>
        </template>

        <!--  角色信息 tag  -->
        <template v-if="item.isShow">
          <div
            v-for="(childItem, childIndex) in item.infoArr"
            :key="`childItem${childIndex}`"
            class="margin-left-6"
          >
            <a-tag @click="clickRoleTag(childItem)" class="tag-style"
              >{{ childItem?.roleName }}
            </a-tag>
          </div>
        </template>
      </div>

      <!--  变更记录  -->
      <div v-if="item?.type === 'changeRecord'" class="change-record">
        <a-timeline>
          <a-timeline-item
            v-for="(recorditem, index) in item?.changeRecord"
            :key="`recorditem${index}`"
          >
            <div class="record-title-content">
              <div class="record-data">
                {{ recorditem.date }}
              </div>
              <div class="record-time">
                {{ recorditem.time }}
              </div>
              <div class="record-type">
                {{ recorditem.type }}
              </div>
            </div>

            <div class="record-tip-content" v-if="recorditem.needBeforeChange">
              <div class="width-10"> 变更前:</div>
              <div class="width-90">
                {{ recorditem.beforeChange }}
              </div>
            </div>

            <div class="record-tip-content">
              <div class="width-10"> 变更后:</div>
              <div class="width-90">
                {{ recorditem.afterChange }}
              </div>
            </div>

            <div class="record-tip-content">
              <div class="width-10"> 操作人:</div>
              <div class="width-90">
                {{ recorditem.operator }}
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
      </div>
    </div>
  </a-modal>

  <!--  重置密码 Modal  -->
  <a-modal
    v-model:visible="state.isShowResetPassWord"
    destroyOnClose
    :title="state.resetPasswordTitle"
    :closable="state.closable"
    :footer="null"
    @cancel="closePasswordModal"
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
    <!--  这里分开写吧 其实可以合一起  -->
    <div
      v-if="state.isResetPasswordSuccessMark === operationPasswordType.resetPassWord"
      class="reset-PassWord-tip"
    >
      重置密码后不可恢复，请谨慎操作。
    </div>
    <div v-if="state.isResetPasswordSuccessMark === operationPasswordType.resetPassWordSuccess">
      <div class="reset-Password-success">
        <img :src="successImg" alt="" class="success-img" />
        重置密码成功！
      </div>
      <div class="user-info1">
        <span>用户名：</span>
        <span>{{ state.resetPasswordSuccessInfo?.username }}</span>
      </div>
      <div class="user-info2">
        <span>新密码：</span>
        <span>{{ state.resetPasswordSuccessInfo?.password }}</span>
        <!--        <div class="copy-button" @click="copyText">复制</div>-->
      </div>
    </div>
    <div v-if="state.isResetPasswordSuccessMark === operationPasswordType.initSuccess">
      <div class="message-text padding-right-40">
        <img :src="successImg" alt="" class="success-img message-img" />
        成员【{{
          state.resetPasswordSuccessInfo?.nickname
        }}】用户密码系统已为您自动生成，可使用以下信息登录系统。
      </div>

      <div class="user-info3">
        <span>用户工号：</span>
        <span>{{ state.resetPasswordSuccessInfo?.username }}</span>
      </div>
      <div class="user-info3 margin-top-9">
        <span>初始密码：</span>
        <span>{{ state.resetPasswordSuccessInfo?.password }}</span>
      </div>
    </div>

    <!--  footer  -->
    <div
      v-if="state.isResetPasswordSuccessMark === operationPasswordType.resetPassWord"
      class="reset-PassWord-btn-content"
    >
      <a-button type="primary" html-type="submit" @click="resetPasswordFN">确认</a-button>
      <a-button @click="closePasswordModal">取消</a-button>
    </div>
    <div class="close-btn-content" v-else>
      <a-button type="primary" @click="copyText">复制</a-button>
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
    :pageKey="PageKeyObj.member"
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
  <BatchChangePostModal ref="batchChangePostModalRef" @success="resetQuery" />
  <BatchAssignUserRoleModal ref="batchAssignUserRoleModalRef" @success="resetQuery" />
</template>

<script lang="tsx" setup>
import * as MenuApi from '@/api/system/menu'
import { handleTree } from '@/utils/tree'
import { message, Upload } from 'ant-design-vue'
import type { UploadProps, UploadChangeParam } from 'ant-design-vue'
import { operationPasswordType, PageKeyObj } from '@/utils/constants'
import { useCache } from '@/hooks/web/useCache'
import { putResetPassWord, updateEditMajorIndividualStatus } from '@/api/system/business'
import { aassignUserRoleApi } from '@/api/system/permission'
import { getRoleApi } from '@/api/system/role'
import { provincesMunicipalitiesArea } from '@/constant/pr.ts'
import {
  filterTree,
  getAllIds,
  getColumns,
  hasPermission,
  reconstructedTreeData,
  reconstructionArrayObject
} from '@/utils/utils'
import dayjs from 'dayjs'
import warningImg from '@/assets/imgs/system/warning.png'
import editImg from '@/assets/imgs/system/editImg.png'
import successImg from '@/assets/imgs/system/successImg.png'
import useClipboard from 'vue-clipboard3'
import { getAccessToken, getTenantId } from '@/utils/auth'
import CustomColumn from '@/components/CustomColumn/CustomColumn.vue'
import LeftTreeSelect from '@/components/LeftTreeSelect/LeftTreeSelect.vue'
import {
  addMember,
  deleteMember,
  getMemberDetails,
  getMemberList,
  getPostList,
  getPostTypeList,
  getRolePostList,
  getRolesList,
  getTypePostList,
  updateMember,
  updateMemberStatus
} from '@/api/system/member'
import {
  getDeptList,
  getOrganizationTypeList,
  getSimpleOrganizationList
} from '@/api/system/organization'
import { fullScreen } from '@/utils/utils'
import BatchChangePostModal from './components/BatchChangePostModal.vue'
import BatchAssignUserRoleModal from './components/BatchAssignUserRoleModal.vue'
import ConfigDetailDrawer from '@/views/system/role/component/ConfigDetailDrawer.vue'
import { cloneDeep } from 'lodash-es'
import Pinyin from 'js-pinyin'

const { wsCache } = useCache()

const { toClipboard } = useClipboard()
import { useRouter, useRoute } from 'vue-router'

const $router = useRouter() // 这是路由跳转的
const $route = useRoute() // 用于接收路由参数的

//查询
const queryParams: any = reactive({
  current: 1, //当前页码
  pageSize: 10, //显示条数
  organization: null, //机构 左侧tree
  memberName: null, //成员姓名
  memberPhone: null, //联系电话
  postType: null, //岗位类型
  partPost: null, //是否有兼岗 主岗 兼岗
  startEndTime: [], //入职时间
  post: null, //岗位
  department: null, //部门
  configureRoles: [], //配置角色
  memberType: null, //人员类型
  postStatus: null, //岗位状态
  isOnJob: null, //在职状态
  userType: null //账号类型
})
//新增编辑
const formState: any = reactive({
  memberNum: null, //成员工号
  memberName: null, //成员姓名
  namePhoneticize: null, //姓名拼音全拼
  englishName: null, //英文名称
  sex: '1', //性别
  entryTime: dayjs(), //入职时间
  memberType: 'trial_members', //人员类型
  isOnJob: '0', //在职(人员)状态
  status: true, //账号状态
  birthDay: null, //出生日期
  qqNum: null, //QQ
  email: null, //电子邮箱
  wechat: null, //个人微信号
  companyAddress: [], //公司地址
  detailedAddress: '', //公司地址 详细地址
  cascadeInfo: [] //选中的省市区全部信息
})

// const queryFormRef = ref() // 搜索的表单
const configDetailDrawerRef = ref()

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

//成员姓名中文校验
const memberNameValidator = (rule, value) => {
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

//邮箱正则校验
const isValidMail = (email) => {
  const regExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  return regExp.test(email)
}

//邮箱校验
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

//限制英文
const englishValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      const regExp = /^[a-zA-Z]+$/
      if (!regExp.test(value)) {
        reject('只能输入字母')
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

//TODO 有空补吧
const state: any = reactive({
  organizationHasPermission: false, //table 状态switch 是否禁用 权限关禁用
  postTypeOptions: [], //岗位类型Options
  postTypeSpecifyOptions: [], //岗位类型 对应的岗位Options
  barnOptions: [], //所属品牌Options
  partPostOptions: [
    // {
    //   value: '2',
    //   label: '全部'
    // },
    {
      value: '0',
      label: '是'
    },
    {
      value: '1',
      label: '否'
    }
  ], //是否兼岗 Options tree
  configureRolesOptions: [], //配置角色 Options tree
  configureRolesNewOptions: [], //分配角色 Options tree
  configureRolesNewTreeOptions: [], //分配角色 Options tree  Modal 已删除 已关闭 包括
  configureRolesNewList: [], //分配角色 数组 没有 关闭跟删除
  btnLoading: false, //分配角色 btn
  memberTypeOptions: [
    {
      value: 'full_members',
      label: '正式'
    },
    {
      value: 'trial_members',
      label: '试用'
    }
  ], //人员类型 Options tree
  onJobOptions: [
    // {
    //   label: '全部',
    //   value: 'all'
    // },
    {
      value: '0',
      label: '在职'
    },
    {
      value: '1',
      label: '离职'
    }
  ], //在职状态 Options tree
  userTypeOptions: [
    // {
    //   label: '全部',
    //   value: 'all'
    // },
    {
      value: '0',
      label: '开启'
    },
    {
      value: '1',
      label: '关闭'
    }
  ], //帐号状态 Options tree
  roleId: [], //分配角色modal
  hasRoles: false, //默认岗位是否有分配角色

  partPostOptionsText: [
    {
      value: '0',
      label: '主岗'
    },
    {
      value: '1',
      label: '兼岗'
    }
  ], //新增修改 岗位信息 主岗/兼岗 Options
  postListOptions: [], //新增修改 岗位列表
  memberNameRules: [
    { required: true, message: `成员姓名不能为空` },
    { validator: memberNameValidator }
  ], //成员姓名限定中文
  organizationList: [], //左侧组织机构 List 用于过滤查找 当前选中的子级id
  selectedKeys: [], //左侧 机构选中的
  testArr: [1, 2, 3, 4],
  contactMailRules: [{ validator: contactMailRulesValidator }],

  record: {}, //表格状态修改时存的整条数据 详细共用(修改)
  messageContactMobile: '18888888888', //短信验证手机号
  messageText: '为了保护您的成员公司业务数据安全，请通过安全验证：',
  canSendCode: true, //能否发送验证码
  codeCountdown: 60, //短信发送倒计时 s
  messageCode: '', //短信验证码
  messageBtnText: '确认开启', //消息modal 确认button 文字内容
  total: 0, //总条数
  statusOptions: [
    { value: 0, label: '正常' },
    { value: 1, label: '停用' }
  ], //状态 0 正常 1停用
  loading: false, //表格加载中
  selectedRowKeys: [],
  rawData: [], //表格数据 原始数据 未组树 主要用来过滤 判断父级状态是否开启
  tableDataList: [], //表格数据
  isExpandAll: false, //展开折叠
  refreshTable: true, //v-if table
  isFullScreen: false, //全屏
  isShow: false, //新增编辑modal
  isShowPermission: false, //功能配置modal
  isShowMessage: false, //短信modal
  isShowStatus: false, //表格状态改变 确认modal 确认后才开短信modal
  needShowInitPassWord: false, //  //新增成员 后 的分配角色关闭才走
  messageTitle: '提示', //短信modal title
  modalTitle: '新增', //modal title
  currentMenu: '目录',
  contactMobileRules: [
    { required: true, message: `负责人电话不能为空` },
    { validator: contactMobileValidator }
  ],
  legalMobileRules: [{ validator: legalMobileValidator }],
  modalType: 'add', //add新增edit编辑
  proMunAreaList: [], //省市区数据
  formState: {
    belongTenantId: 0, //上级成员编号
    code: '', //成员编码
    name: '', //成员名称
    abbreviate: '', //成员简称
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
  addSuccessId: undefined, //创建成员成功ID 主要是用于创建成员后分配角色
  activeKey: 'backstage', // tabsKey frontDesk前台 backstage后台
  selectAll: false, //权限配置 全选
  isExpandAllTab: false, //权限配置 展开折叠
  menuTreeList: [], //权限配置 前台列表
  fieldNames: { children: 'children', title: 'name', key: 'id' }, //权限配置 前台列表 tree的对应字段替换
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
  isResetPasswordSuccessMark: operationPasswordType.resetPassWord,
  resetModalStyle: {
    width: 488,
    height: 270
  }, //重置密码 modal样式
  isShowCustomColumnModal: false, //是否打开定制列modal
  columns: [], //表格 columns
  optionalMenuTree: [], //上级成员 treeList
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
    'memberNum',
    'memberName',
    'memberPhone',
    'departmentPost',
    'configureRoles',
    'isOnJob',
    'memberType',
    'statusSwitch',
    'operation'
  ], //定制列默认的keys
  changedColumnsObj: {} //定制列组件接收到的当前列信息
})

//存放功能配置 选中的所有keys(包括父节点id)
const checkedKeysBack = ref([])

// //获取子节点的 父节点id
// const testCheck = (checkedKeys, e) => {
//   //存放功能配置 选中的所有keys(包括父节点id)
//   checkedKeysBack.value = checkedKeys.concat(e.halfCheckedKeys)
// }

//ALL columns 用于定制列过滤 排序
const allColumns = [
  {
    title: '成员工号',
    width: 100,
    dataIndex: 'memberNum',
    key: 'memberNum',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 1
  },
  {
    title: '成员姓名',
    width: 100,
    dataIndex: 'memberName',
    key: 'memberName',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 2
  },
  {
    title: '联系电话',
    width: 150,
    dataIndex: 'memberPhone',
    key: 'memberPhone',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 3
  },
  {
    title: '部门/岗位',
    width: 200,
    dataIndex: 'departmentPost',
    key: 'departmentPost',
    resizable: true,
    ellipsis: true,
    sort: 4
  },
  {
    title: '入职时间',
    width: 100,
    dataIndex: 'entryTime',
    key: 'entryTime',
    resizable: true,
    ellipsis: true,
    sort: 4
  },
  {
    title: '配置角色',
    width: 200,
    dataIndex: 'configureRoles',
    key: 'configureRoles',
    resizable: true,
    ellipsis: true,
    sort: 5
  },

  {
    title: '人员类型',
    width: 100,
    dataIndex: 'memberType',
    key: 'memberType',
    resizable: true,
    ellipsis: true,
    sort: 6
  },
  {
    title: '在职状态',
    width: 100,
    dataIndex: 'isOnJob',
    key: 'isOnJob',
    resizable: true,
    ellipsis: true,
    sort: 7
  },
  {
    title: '账号状态',
    width: 100,
    dataIndex: 'statusSwitch',
    key: 'statusSwitch',
    resizable: true,
    ellipsis: true,
    sort: 9
  },

  {
    title: '创建人',
    dataIndex: 'creatorName',
    width: 100,
    key: 'creatorName',
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
    dataIndex: 'updaterName',
    key: 'updaterName',
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
    fixed: 'right',
    ellipsis: true,
    sort: 13
  }
]

/** 查询列表 */
const getList = async (page, isRefresh = false) => {
  // //无查询按钮权限 不请求
  // if (!hasPermission('system:user:list')) {
  //   return
  // }

  state.loading = true

  if (page) {
    queryParams.current = page
  }

  let tempConfigureRoles = []
  let roleExist: any = null
  queryParams.configureRoles.map((item) => {
    if (item === 'all') {
      roleExist = null
    }
    if (item === 'empty') {
      roleExist = '1'
    }
  })
  //配置角色排除全部跟空
  tempConfigureRoles = queryParams.configureRoles.filter(
    (item) => item !== 'all' && item !== 'empty'
  )

  const params: any = {
    pageNo: queryParams.current,
    pageSize: queryParams.pageSize,
    // component: queryParams.organization, //机构 左侧tree
    organizationIds: queryParams.organization, //机构 左侧tree arr
    nameOrNumber: queryParams.memberName, //姓名or工号
    phone: queryParams.memberPhone, //联系电话
    encryptPhone: queryParams.memberPhone, //联系电话 后端说多传一个
    postTypeCode: queryParams.postType, //岗位类型
    // postName: queryParams.post, //岗位名称
    postId: queryParams.post,
    postType: queryParams.partPost === '2' ? null : queryParams.partPost, //是否兼岗
    roleIds: tempConfigureRoles, //配置角色
    userType: queryParams.memberType === 'all' ? null : queryParams.memberType, //人员类型
    status: queryParams.userType === 'all' ? null : queryParams.userType, //账号状态
    userStatus: queryParams.isOnJob === 'all' ? null : queryParams.isOnJob, //在职状态
    roleExist: roleExist //配置角色为空时 传'1'
  }

  console.log('queryParams?.startEndTime', queryParams?.startEndTime)
  if (queryParams?.startEndTime && queryParams?.startEndTime[0] && queryParams?.startEndTime[1]) {
    params.onboardingTime = [
      queryParams?.startEndTime[0]?.format('YYYY-MM-DD'),
      queryParams?.startEndTime[1]?.format('YYYY-MM-DD')
    ]
  }

  try {
    const res = await getMemberList(params)
    console.log('res', res)
    state.rawData = res.list
    state.tableDataList = res.list
    state.tableDataList.map((item) => {
      const tempPhoneList: any = []
      const tempDepartmentPost: any = []
      const tempRoleVOList: any = []
      //联系电话
      item?.phoneVOList?.map((phoneItem) => {
        // '0'公司 '1'私人
        let tempText = '公司'
        if (phoneItem.usageType === '1') {
          tempText = '私人'
        }
        tempPhoneList.push({
          phoneNum: phoneItem.phone,
          type: phoneItem.usageType,
          phoneType: tempText
        })
      })

      //部门、岗位
      item?.postVOList?.map((postItem) => {
        let tempText = '主岗'
        //main_post主岗 secondary_post兼岗
        if (postItem.type === 'secondary_post') {
          tempText = '兼岗'
        }
        //0开启 1关闭
        let depStatusText = postItem.organizationStatus === 0 ? '' : '(关闭)'
        //0未删除 1删除  删除显示优先级高于关闭
        depStatusText = postItem.organizationDeleted === 0 ? depStatusText : '(删除)'

        //0开启 1关闭
        let postStatusText = postItem.postStatus === 0 ? '' : '(关闭)'
        //0未删除 1删除  删除显示优先级高于关闭
        postStatusText = postItem.postDeleted === 0 ? postStatusText : '(删除)'
        tempDepartmentPost.push({
          department: `${postItem.organizationName}${depStatusText}`, //部门 末位
          departmentAll: `${postItem.componentName}${depStatusText}`, //部门 全部
          depStatus: postItem.organizationStatus === 1, //0开启 1关闭 部门开启/关闭
          depDelete: postItem.organizationDeleted === 1, //0未删除 1删除 部门未删除/删除
          postStatus: postItem.postStatus === 1, //0开启 1关闭 岗位开启/关闭
          postDelete: postItem.postDeleted === 1, //0未删除 1删除 岗位未删除/删除
          post: `${postItem.postName}${postStatusText}`, //岗位
          type: postItem.type, //主岗0 兼岗1
          typeText: tempText
        })
      })

      //配置角色
      item?.roleVOList?.map((roleItem) => {
        //0开启 1关闭
        let roleStatusText = roleItem.roleStatus === 0 ? '' : '(关闭)'
        //0未删除 1删除  删除显示优先级高于关闭
        roleStatusText = roleItem.roleDeleted === 0 ? roleStatusText : '(删除)'
        tempRoleVOList.push({
          roleName: `${roleItem.roleName}${roleStatusText}`,
          roleStatus: roleItem.roleStatus === 1, //0开启 1关闭 岗位开启/关闭
          roleDelete: roleItem.roleDeleted === 1, //0未删除 1删除 岗位未删除/删除
          id: roleItem.roleId
        })
      })

      //人员类型
      const tempMemberType = state.memberTypeOptions.filter(
        (memberTypeItem) => memberTypeItem.value === item.userType
      )
      item.memberNum = item.username
      item.memberName = item.nickname
      item.memberPhoneList = tempPhoneList
      item.departmentPostList = tempDepartmentPost
      item.statusSwitch = item?.status === 0 //账号状态
      item.memberType = tempMemberType[0]?.label //人员类型
      item.isOnJob = item.userStatus === 0 ? '在职' : '离职'
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
      item.entryTime = item.onboardingTime //入职时间
      item.roleVOListDeal = tempRoleVOList
    })

    state.total = res.total
    if (isRefresh) {
      message.success('刷新成功')
    }
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
  queryParams.current = 1 //当前页码
  queryParams.pageSize = 10 //显示条数
  //重置不包括左侧部门
  // queryParams.organization = null //机构 左侧tree
  queryParams.memberName = null //成员姓名
  queryParams.namePhoneticize = null //姓名拼音全拼
  queryParams.englishName = null //英文名称
  queryParams.memberPhone = null //联系电话
  queryParams.postType = null //岗位类型
  queryParams.partPost = null //是否有兼岗 主岗 兼岗
  queryParams.startEndTime = []
  queryParams.post = null //岗位
  queryParams.department = null //部门
  queryParams.configureRoles = [] //配置角色
  queryParams.memberType = null //人员类型
  queryParams.postStatus = null //岗位状态
  queryParams.isOnJob = null //在职状态
  queryParams.userType = null //账号类型

  state.postTypeSpecifyOptions = []
  postTypeChange(null)

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

//打开Modal
const openModal = async () => {
  state.isShow = true
}
//关闭Modal
const closeModal = () => {
  state.isShow = false
  formRef.value.resetFields()
  //级联选择器 需要单独清空
  formState.companyAddress = []

  formState.memberNum = null //成员工号
  formState.memberName = null //成员姓名
  formState.namePhoneticize = null //姓名拼音全拼
  formState.englishName = null //英文名称
  formState.sex = '1' //性别
  formState.entryTime = dayjs() //入职时间
  formState.memberType = 'trial_members' //人员类型
  formState.isOnJob = '0' //在职(人员)状态
  formState.status = true //账号状态
  formState.birthDay = null //出生日期
  formState.departureTime = null //离职日期
  formState.qqNum = null //QQ
  formState.email = null //电子邮箱
  formState.wechat = null //个人微信号
  formState.companyAddress = [] //公司地址
  formState.cascadeInfo = [] //选中的省市区全部信息
  formState.detailedAddress = '' //公司地址 详细地址

  state.legalPersonListUrl = [] //成员头像 上传回显
  state.legalPersonUrlSuccess = '' //成员头像 新增编辑入参
  delete formState?.id
  state.modalTitle = '新增'
  state.modalType = 'add'

  addDataSource.addEditTableData = [
    {
      index: 0,
      phoneType: '1',
      phoneNum: '',
      useType: '1',
      isService: true,
      existWxWork: true
    }
  ]

  addPostDataSource.addEditTableData = [
    {
      index: 0,
      department: null,
      post: null,
      brand: [],
      isMainPost: null,
      isMainPostKey: 'main_post',
      isMainPostText: '主岗',
      isShow: true
    }
  ]
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
  if (isCloseDetails) {
    //关闭详情moal
    state.isShowDetails = false
  }
  //获取成员详情
  const res = await getMemberDetails({ id: record.id })

  formState.id = record.id

  //菜单状态 0开启 1关闭
  // record.statusSwitch = record.status === 0
  record.status = record.status === 0

  state.modalType = 'edit'
  state.modalTitle = '编辑'

  const tempPhoneList: any = []
  const tempPostList: any = []
  // addDataSource.addEditTableData.map((item) => {
  record?.phoneVOList?.map((item, index) => {
    tempPhoneList.push({
      index: index,
      id: item.id,
      phoneType: item.phoneCategory,
      phoneNum: item.phone,
      useType: item.usageType,
      isService: item.recordEnable,
      existWxWork: item.existWxWork
    })
  })

  // addPostDataSource.addEditTableData.map((item) => {
  record?.postVOList?.map((item, index) => {
    const tempBrand = item.brands === '' || item.brands === null ? [] : item.brands.split(',')
    tempPostList.push({
      index: index,
      id: item.id,
      department: item.organizationId,
      post: item.postId,
      brand: tempBrand,
      isMainPost: item.type,
      isMainPostKey: item.type,
      isMainPostText: item.type === 'main_post' ? '主岗' : '兼岗',
      isShow: item.visible
    })
  })

  if (record?.phoneVOList === null) {
    tempPhoneList.push({
      index: 0,
      phoneType: '',
      phoneNum: '',
      useType: '',
      isService: true,
      existWxWork: true
    })
  }

  if (record?.postVOList === null) {
    tempPostList.push({
      index: 0,
      department: null,
      post: null,
      brand: [],
      isMainPost: null,
      isMainPostKey: 'main_post',
      isMainPostText: '主岗',
      isShow: true
    })
  }

  //赋值 回显
  formState.memberNum = record.username //成员工号
  formState.memberName = record.nickname ///成员姓名
  formState.namePhoneticize = res?.namePhoneticize //姓名拼音全拼
  formState.englishName = res?.englishName //英文名称
  formState.sex = String(record.sex) //性别
  formState.entryTime = record.onboardingTime ? dayjs(record.onboardingTime) : dayjs() //入职时间
  formState.memberType = String(record.userType) //人员类型
  formState.isOnJob = String(res.userStatus) //人员状态
  formState.status = record.statusSwitch // 账号状态
  addDataSource.addEditTableData = tempPhoneList //联系电话
  addPostDataSource.addEditTableData = tempPostList //岗位信息
  formState.birthDay = record.birthDay ? dayjs(record.birthDay) : dayjs() //出生日期
  formState.departureTime = res.departureTime ? dayjs(res.departureTime) : null //离职日期
  formState.qqNum = record.qq //QQ
  formState.email = record.email //电子邮箱
  formState.wechat = record.wechat //个人微信号
  formState.detailedAddress = record.address //公司地址 详细地址

  if (record.avatar) {
    state.legalPersonListUrl = [
      {
        url: record.avatar //成员头像
      }
    ]
    state.legalPersonUrlSuccess = record.avatar
  }

  if (res.establishDate) {
    state.formState['establishDate'] = dayjs(res.establishDate) //成立日期
  }

  //状态0 开启 1关闭
  state.formState.status = res.status === 0

  //省市区
  formState.companyAddress = []
  formState.cascadeInfo = []
  if (res?.provinceCode) {
    formState.companyAddress.push(res?.provinceCode)
    formState.cascadeInfo.push({
      label: res?.province,
      value: res?.provinceCode
    })
  }
  if (res?.cityCode) {
    formState.companyAddress.push(res?.cityCode)
    formState.cascadeInfo.push({
      label: res?.city,
      value: res?.cityCode
    })
  }
  if (res?.countyCode) {
    formState.companyAddress.push(res?.countyCode)
    formState.cascadeInfo.push({
      label: res?.county,
      value: res?.countyCode
    })
  }

  openModal()
}

// //页码改变
// const onChange = ({ pageSize, current }) => {
//   queryParams.current = current
//   queryParams.pageSize = pageSize
//   getList()
// }

//页码改变
const onPageChange = () => {
  getList(undefined)
}

//处理省市区数据
// 树结构数据过滤 数组中嵌数组 里面的数组为需要替换的属性名以及替换后的属性名
let needReplaceKey = [
  ['label', 'fullname'],
  ['value', 'code']
]
state.proMunAreaList = reconstructedTreeData(provincesMunicipalitiesArea, needReplaceKey)

//新增成员
const addMajorIndividualFN = async () => {
  // 校验表单
  if (!formRef) return
  await formRef.value.validate()

  const tempPhoneList: any = []
  const tempPostList: any = []
  let mark = false
  let markDep = false
  let markPost = false
  addDataSource.addEditTableData.map((item) => {
    if (formState.id) {
      //修改时
      tempPhoneList.push({
        phoneCategory: item.phoneType, //号码类别
        phone: item.phoneNum, //手机号
        usageType: item.useType, //使用类型
        recordEnable: item.isService, //是否开通云录音
        existWxWork: item?.existWxWork, //是否开通企微
        userId: formState.id,
        id: item.id
      })
    } else {
      tempPhoneList.push({
        phoneCategory: item.phoneType, //号码类别
        phone: item.phoneNum, //手机号
        usageType: item.useType, //使用类型
        recordEnable: item.isService, //是否开通云录音
        existWxWork: item?.existWxWork //是否开通企微
      })
    }

    if (!item.phoneNum) {
      mark = true
    }
  })

  if (mark) {
    return message.warning('请输入手机号')
  }

  addPostDataSource.addEditTableData.map((item: any) => {
    let tempBrandString = ''

    tempBrandString = item.brand.join()

    //修改时
    if (formState.id) {
      tempPostList.push({
        organizationId: item.department, //所属部门
        postId: item.post, //岗位
        brands: tempBrandString, //所属品牌
        type: item.isMainPostKey, //主岗/兼岗
        visible: item.isShow, //是否显示
        userId: formState.id,
        id: item.id
      })
    } else {
      tempPostList.push({
        organizationId: item.department, //所属部门
        postId: item.post, //岗位
        brands: tempBrandString, //所属品牌
        type: item.isMainPostKey, //主岗/兼岗
        visible: item.isShow //是否显示
      })
    }

    if (!item.department) {
      markDep = true
    }
    if (!item.post) {
      markPost = true
    }
  })

  if (markDep) {
    return message.warning('请选择所属部门')
  }
  if (markPost) {
    return message.warning('请选择岗位')
  }

  let params = {
    username: formState.memberNum, //成员工号
    nickname: formState.memberName, //成员姓名
    namePhoneticize: formState.namePhoneticize, //姓名拼音全拼
    englishName: formState.englishName, //英文名称
    sex: formState.sex, //性别
    onboardingTime: formState.entryTime?.format('YYYY-MM-DD'), //入职时间
    userType: formState.memberType, //人员类型
    userStatus: formState.isOnJob, //人员状态
    status: formState.status ? '0' : '1', //账号状态
    phoneList: tempPhoneList, //联系电话
    avatar: state.legalPersonUrlSuccess, //成员头像
    postList: tempPostList, //岗位信息
    birthDay: formState.birthDay?.format('YYYY-MM-DD'), //出生日期
    qq: formState.qqNum, //QQ
    email: formState.email, //电子邮箱
    wechat: formState.wechat, //个人微信号
    address: formState.detailedAddress //公司地址 详细地址
  }

  //省市区
  if (formState?.cascadeInfo[0]) {
    params['province'] = formState.cascadeInfo[0].label
    params['provinceCode'] = formState.cascadeInfo[0].value
  }
  if (formState?.cascadeInfo[1]) {
    params['city'] = formState.cascadeInfo[1].label
    params['cityCode'] = formState.cascadeInfo[1].value
  }
  if (formState?.cascadeInfo[2]) {
    params['county'] = formState.cascadeInfo[2].label
    params['countyCode'] = formState.cascadeInfo[2].value
  }

  state.addEditLoading = true
  try {
    let res: any = []
    if (state.modalType === 'add') {
      //后端说新增默认给个密码
      params['password'] = '123456'
      res = await addMember(params)
      console.log('新增成员res', res)
      state.addSuccessId = res?.id
      state.resetPasswordSuccessInfo = res
      message.success('新建成员成功')
      state.needShowInitPassWord = true
      //分配角色
      openPermissionModal(true)
    } else {
      params['id'] = formState.id
      params['departureTime'] = formState.departureTime?.format('YYYY-MM-DD')
      res = await updateMember(params)
      message.success('修改成员成功')
    }

    closeModal()
    await getList()
  } finally {
    state.addEditLoading = false
  }
}

//级联选择器选中的内容 改变
const cascadeChange = (value, selectedOptions) => {
  formState.cascadeInfo = selectedOptions
}

//关闭功能配置 modal
const closePermissionModal = () => {
  state.isShowPermission = false
  state.roleId = []
  state.permissionRecord = {}
  if (state.needShowInitPassWord) {
    //新增成员 后 的分配角色关闭才走
    openInitPasswordModal()
  }
}

//开启分配角色 modal
const openPermissionModal = async (isAdd = false) => {
  if (isAdd) {
    const res = await getMemberDetails({ id: state.addSuccessId })
    state.permissionRecord = res
    assignPermission(res)
  }
  // state.isShowPermission = true
}

//分配角色 Modal 确认
const PermissionOk = async () => {
  const params = {
    userId: state.permissionRecord?.id || state.addSuccessId,
    roleIds: state.roleId
  }
  state.btnLoading = true
  await aassignUserRoleApi(params)
  state.btnLoading = false
  await getList()
  closePermissionModal()
  if (state.needShowInitPassWord) {
    //新增成员 后 的分配角色关闭才走
    openInitPasswordModal()
  }
}

//数组对象去重
const uniqueFunc = (arr: any, uniId: any) => {
  const res = new Map()
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1))
}

const assignPermission = async (record) => {
  const { postVOList = [], roleVOList = [] } = record
  const tempArr: any = uniqueFunc(postVOList, 'postId')
  record.postVOListDeal = tempArr

  let postIdArr: any = []
  tempArr.map((item) => {
    postIdArr.push(item.postId)
  })

  if (roleVOList?.length === 0 || roleVOList === null) {
    const tempRes = await getRolePostList({
      postIds: postIdArr
    })
    state.hasRoles = tempRes?.length != 0 || false

    nextTick(() => {
      state.roleId = tempRes
    })
  }

  const tempRolesNewList = cloneDeep(state.configureRolesNewList)

  record?.roleVOListDeal?.map((item) => {
    if (item.roleDelete) {
      //删除 true
      tempRolesNewList.push({
        name: item.roleName,
        id: item.id
      })
    } else if (item.roleStatus) {
      //关闭 true
      tempRolesNewList.push({
        name: item.roleName,
        id: item.id
      })
    }
  })

  const needReplacePartPostKey = [
    ['label', 'name'],
    ['value', 'id']
  ]
  state.configureRolesNewTreeOptions = reconstructionArrayObject(
    tempRolesNewList,
    needReplacePartPostKey
  )

  state.permissionRecord = record
  //回显 已分配的角色
  state.roleId = []

  roleVOList?.map((item) => {
    state.roleId.push(item.roleId)
  })
  state.PermissionType = 'edit'
  // openPermissionModal()
  //开启分配角色 modal
  state.isShowPermission = true
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
const setTableStatusChangeInfo = (value, record, type = 'switch') => {
  state.tableStatusChangeInfo = {
    value,
    record,
    type: type
  }
  switch (type) {
    case 'delete':
      //删除
      state.tableStatusChangeInfo['statusTitleText'] = '确定删除成员'
      state.tableStatusChangeInfo['statusBtnText'] = '确定删除'
      state.tableStatusChangeInfo['statusTopText'] = `删除后`
      state.tableStatusChangeInfo['statusText'] = ``
      state.tableStatusChangeInfo['statusContentText'] =
        '该成员信息将全部删除，且不可恢复，请谨慎操作。'
      break
    default:
      if (value) {
        state.tableStatusChangeInfo['statusTitleText'] = '确定把成员'
        state.tableStatusChangeInfo['statusBtnText'] = '确定开启'
        state.tableStatusChangeInfo['statusTopText'] = `开启后`
        state.tableStatusChangeInfo['statusText'] = `开启`
        state.tableStatusChangeInfo['statusContentText'] = '该成员将可以登录系统，请谨慎操作。'
      } else {
        state.tableStatusChangeInfo['statusTitleText'] = '确定把成员'
        state.tableStatusChangeInfo['statusBtnText'] = '确认关闭'
        state.tableStatusChangeInfo['statusTopText'] = `关闭后`
        state.tableStatusChangeInfo['statusText'] = `关闭`
        state.tableStatusChangeInfo['statusContentText'] = '该成员将不可以再登录系统，请谨慎操作。'
      }
  }

  openStatusModal()
}

//表格状态开关modal 确认
const tableStatusConfirm = async () => {
  switch (state.tableStatusChangeInfo?.type) {
    case 'delete':
      await deleteMember(state.tableStatusChangeInfo.record.id)
      message.success('删除成员成功')
      break
    default:
      await updateMemberStatus({
        id: state.tableStatusChangeInfo.record.id,
        status: state.tableStatusChangeInfo.record.statusSwitch === true ? 0 : 1
      })
      message.success('修改账号状态成功')
  }

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
  state.messageText = '为了保护您的成员公司业务数据安全，请通过安全验证：'
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
  state.detailsRecord = record
  //获取成员详情
  const res = await getMemberDetails({ id: record.id })
  console.log('res ', res)
  const { roleVOList = [] } = record
  const { userHistoryVOList = [], phoneVOList = [], postVOList = [] } = res
  let sexText = '男'
  let isOnJobText = '在职'
  let homeAddress = ''
  let changeRecord = [
    {
      date: '2023-05-11',
      time: '09:00:00',
      type: '入职',
      beforeChange:
        '变更前：入职时间-2022-11-16、部门/岗位-厦门分公司-厦门后溪哈弗红蓝标4S店 /  销售顾问',
      afterChange:
        '变更后：入职时间-2023-08-01、部门/岗位-厦门分公司-厦门后溪哈弗红蓝标4S店 /  销售顾问',
      operator: '操作人：张三（010005）'
    },
    {
      date: '2023-04-11',
      time: '16:00:00',
      type: '离职',
      beforeChange: '变更前：在职状态-在职',
      afterChange: '变更后：在职状态-离职、离职时间-2023-05-15',
      operator: '操作人：张三（010005）'
    },
    {
      date: '2023-05-11',
      time: '09:00:00',
      type: '入职',
      beforeChange: '入职时间-2022-11-16、部门/岗位-厦门分公司-厦门后溪哈弗红蓝标4S店 /  销售顾问',
      afterChange: '入职时间-2023-08-01、部门/岗位-厦门分公司-厦门后溪哈弗红蓝标4S店 /  销售顾问',
      operator: '张三（010005）'
    }
  ]
  let tableData: any = []
  let tablePostData: any = []
  const tempRoleVOList: any = []

  roleVOList?.map((roleItem) => {
    //0开启 1关闭
    let roleStatusText = roleItem.roleStatus === 0 ? '' : '(关闭)'
    //0未删除 1删除  删除显示优先级高于关闭
    roleStatusText = roleItem.roleDeleted === 0 ? roleStatusText : '(删除)'
    tempRoleVOList.push({
      roleName: `${roleItem.roleName}${roleStatusText}`,
      roleId: roleItem.roleId
    })
  })

  switch (res.sex) {
    case 1:
      sexText = '男'
      break
    case 2:
      sexText = '女'
  }

  switch (res.userStatus) {
    case 0:
      isOnJobText = '在职'
      break
    case 1:
      isOnJobText = '离职'
  }
  if (record?.province) {
    homeAddress += record?.province
  }
  if (record?.city) {
    homeAddress += record?.city
  }
  if (record?.county) {
    homeAddress += record?.county
  }
  if (record?.address) {
    homeAddress += record?.address
  }

  //联系电话
  phoneVOList?.map((item) => {
    tableData.push({
      phoneType: item?.phoneCategory === '1' ? '手机' : '座机',
      phoneNum: item?.phone,
      useType: item?.usageType === '1' ? '私人' : '公司',
      isService: item?.recordEnable ? '是' : '否',
      existWxWork: item?.existWxWork ? '已开通' : '未开通' //是否开通企微
    })
  })

  //岗位信息
  postVOList?.map((item) => {
    const tempBarn = state.barnOptions.find((barnItem) => barnItem.value === item?.brands)
    tablePostData.push({
      department: item?.componentName,
      post: item?.postName,
      brand: tempBarn?.label,
      isMainPost: item?.type === 'main_post' ? '主岗' : '兼岗',
      isShow: item?.visible ? '显示' : '隐藏'
    })
  })

  changeRecord = []
  //变更记录
  userHistoryVOList.map((item) => {
    const temp1 = item.beforeData ? JSON.parse(item.beforeData) : {}
    const temp2 = item.afterData ? JSON.parse(item.afterData) : {}
    console.log('变更前', temp1)
    console.log('变更后', temp2)
    let tempItem: any = {
      date: dayjs(item?.createTime)?.format('YYYY-MM-DD'),
      time: dayjs(item?.createTime)?.format('HH:mm:ss')
      // type: '离职',
      // beforeChange: '变更前：在职状态-在职',
      // afterChange: '变更后：在职状态-离职、离职时间-2023-05-15',
      // operator: '操作人：张三（010005）'
    }

    tempItem.beforeChange = ''
    tempItem.afterChange = ''
    tempItem.needBeforeChange = !(Object.keys(temp1).length === 0)

    switch (item?.historyType) {
      case 'update':
        //修改
        tempItem.type = '修改'
        if (temp1?.onboardingTime) {
          tempItem.beforeChange += `在职状态-在职、在职时间-${temp1?.onboardingTime}`
        }
        if (temp2?.onboardingTime) {
          tempItem.afterChange += `在职状态-在职、在职时间-${temp2?.onboardingTime}`
        }
        if (temp1?.departureTime) {
          tempItem.beforeChange += `在职状态-离职、离职时间-${temp1?.departureTime}`
        }
        if (temp2?.departureTime) {
          tempItem.afterChange += `在职状态-离职、离职时间-${temp2?.departureTime}`
        }
        break
      case 'entry':
        //入职
        tempItem.type = '入职'
        break
      case 'depart':
        //离职
        tempItem.type = '离职'
        break
    }

    if (temp1?.userStatus === 0) {
      tempItem.beforeChange = '在职状态-在职'
      if (temp1?.onboardingTime) {
        tempItem.beforeChange += `、入职时间-${temp1?.onboardingTime}`
      }
    } else if (temp1?.userStatus === 1) {
      tempItem.beforeChange = '在职状态-离职'
      if (temp1?.departureTime) {
        tempItem.beforeChange += `、离职时间-${temp1?.departureTime}`
      }
    }

    const { postVOList = [] } = temp1
    if (postVOList.length > 0) {
      tempItem.beforeChange += `部门/岗位-`
      postVOList.map((postItem) => {
        tempItem.beforeChange += `${postItem.componentName}/${postItem.postName} `
      })
    }
    tempItem.operator = `${item.createName}`

    if (temp2?.userStatus === 0) {
      tempItem.afterChange = '在职状态-在职'
      if (temp2?.onboardingTime) {
        tempItem.afterChange += `、入职时间-${temp2?.onboardingTime}`
      }
    } else if (temp2?.userStatus === 1) {
      tempItem.afterChange = '在职状态-离职'
      if (temp2?.departureTime) {
        tempItem.afterChange += `、离职时间-${temp2?.departureTime}`
      }
    }

    if (temp2?.postVOList && temp2?.postVOList.length > 0) {
      tempItem.afterChange += `部门/岗位-`
      temp2?.postVOList.map((postItem) => {
        tempItem.afterChange += `${postItem.componentName}/${postItem.postName} `
      })
    }

    // switch (item?.historyType) {
    //   case 'update':
    //     //修改
    //     tempItem.type = '修改'
    //     tempItem.beforeChange = '部门/岗位-'
    //     tempItem.afterChange = `部门/岗位-`
    //     tempItem.needBeforeChange = true
    //     temp1?.map((item) => {
    //       const tempPostText = item?.type === 'main_post' ? '主岗' : '兼岗'
    //       tempItem.beforeChange += `${item?.componentName}/ ${item?.postName}(${tempPostText})      `
    //     })
    //
    //     temp2?.map((item) => {
    //       const tempPostText = item?.type === 'main_post' ? '主岗' : '兼岗'
    //       tempItem.afterChange += `${item?.componentName}/ ${item?.postName}(${tempPostText})      `
    //     })
    //
    //     tempItem.operator = `${item.createName}`
    //     break
    //   case 'entry':
    //     //入职
    //     tempItem.type = '入职'
    //     tempItem.beforeChange = `离职时间-${temp1[0]?.departureTime}、`
    //     tempItem.afterChange = `入职时间-${temp2[0]?.onboardingTime}、`
    //     // temp1?.map((item) => {
    //     //   const tempPostText = item?.type === 'main_post' ? '主岗' : '兼岗'
    //     //   tempItem.beforeChange += `${item?.updateTime?.year}-${item?.updateTime?.month}-${item?.updateTime?.day}、部门/岗位-${item?.componentName}/ ${item?.postName}(${tempPostText})      `
    //     // })
    //     tempItem.needBeforeChange = temp1.length > 0
    //     temp1?.map((item) => {
    //       const tempPostText = item?.type === 'main_post' ? '主岗' : '兼岗'
    //
    //       // tempItem.beforeChange += `${item?.updateTime?.date?.year}-${item?.updateTime?.date?.month}-${item?.updateTime?.date?.day}、部门/岗位-${item?.componentName}/ ${item?.postName}(${tempPostText})      `
    //       tempItem.beforeChange += `部门/岗位-${item?.componentName}/ ${item?.postName}(${tempPostText})      `
    //     })
    //
    //     temp2?.map((item) => {
    //       const tempPostText = item?.type === 'main_post' ? '主岗' : '兼岗'
    //
    //       // tempItem.afterChange += `${item?.updateTime?.date?.year}-${item?.updateTime?.date?.month}-${item?.updateTime?.date?.day}、部门/岗位-${item?.componentName}/ ${item?.postName}(${tempPostText})      `
    //       tempItem.afterChange += `部门/岗位-${item?.componentName}/ ${item?.postName}(${tempPostText})      `
    //     })
    //
    //     // tempItem.beforeChange = `变更前：入职时间-${temp1?.updateTime?.year}-${temp1?.updateTime?.month}-${temp1?.updateTime?.day}、部门/岗位-${temp1?.componentName}/ ${temp1?.postName}`
    //     // tempItem.afterChange = `变更后：入职时间-${temp2?.updateTime?.year}-${temp2?.updateTime?.month}-${temp2?.updateTime?.day}、部门/岗位-${temp2?.componentName}/ ${temp2?.postName}`
    //     tempItem.operator = `${item.createName}`
    //     break
    //   case 'depart':
    //     //离职
    //     tempItem.type = '离职'
    //     tempItem.beforeChange = `在职状态-在职`
    //     // tempItem.afterChange = `在职状态-离职、离职时间-${dayjs(temp1?.createTime)?.format(
    //     //   'YYYY-MM-DD'
    //     // )}`
    //     tempItem.needBeforeChange = true
    //     tempItem.afterChange = `在职状态-离职、离职时间-${temp2[0]?.departureTime}`
    //     tempItem.operator = `${item.createName}`
    //     break
    // }
    //
    //

    changeRecord.push(tempItem)
  })

  changeRecord?.reverse()

  let tableColumns: any = [
    {
      title: '序号',
      width: 50,
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      resizable: true,
      customRender: (text: any, record: any, index: any, column: any) => {
        return text.index + 1
      }
    },
    {
      title: '号码类别',
      width: 80,
      dataIndex: 'phoneType',
      key: 'phoneType',
      resizable: true,
      ellipsis: true,
      disabled: true,
      sort: 1
    },
    {
      title: '号码',
      width: 110,
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      resizable: true,
      ellipsis: true,
      disabled: true,
      sort: 2
    },
    {
      title: '使用类型',
      width: 80,
      dataIndex: 'useType',
      key: 'useType',
      resizable: true,
      ellipsis: true,
      disabled: true,
      sort: 3
    },
    {
      title: '是否开通云录音',
      width: 120,
      dataIndex: 'isService',
      key: 'isService',
      resizable: true,
      ellipsis: true,
      disabled: true,
      sort: 4
    },
    {
      title: '是否开通企微',
      width: 100,
      dataIndex: 'existWxWork',
      key: 'existWxWork',
      resizable: true,
      ellipsis: true,
      disabled: true,
      sort: 5
    }
  ]

  let tablePostColumns = [
    {
      title: '所属部门',
      width: 130,
      dataIndex: 'department',
      key: 'department',
      resizable: true,
      ellipsis: true,
      disabled: true,
      sort: 1
    },
    {
      title: '岗位',
      width: 110,
      dataIndex: 'post',
      key: 'post',
      resizable: true,
      ellipsis: true,
      disabled: true,
      sort: 2
    },
    {
      title: '所属品牌',
      width: 130,
      dataIndex: 'brand',
      key: 'brand',
      resizable: true,
      ellipsis: true,
      disabled: true,
      sort: 3
    },
    {
      title: '主岗/兼岗',
      width: 120,
      dataIndex: 'isMainPost',
      key: 'isMainPost',
      resizable: true,
      ellipsis: true,
      disabled: true,
      sort: 4
    },
    {
      title: '是否显示',
      width: 120,
      dataIndex: 'isShow',
      key: 'isShow',
      resizable: true,
      ellipsis: true,
      disabled: true,
      sort: 4
    }
  ]

  state.detailsInfo = [
    {
      baseTitle: '基本信息',
      needEdit: true,
      infoArr: [
        {
          textSpan: '成员工号：',
          text: record?.memberNum
        },
        {
          textSpan: '成员姓名：',
          text: record.memberName
        },
        {
          textSpan: '姓名拼音全拼：',
          text: res?.namePhoneticize
        },
        {
          textSpan: '英文名：',
          text: res?.englishName
        },
        {
          textSpan: '性别：',
          text: sexText
        },
        {
          textSpan: '入职时间：',
          text: res.onboardingTime
        },
        {
          textSpan: '人员类型：',
          text: record.memberType
        },
        {
          textSpan: '人员状态：',
          text: isOnJobText
        },
        {
          textSpan: '离职时间：',
          text: res.departureTime
        },
        {
          textSpan: '账号状态：',
          text: record.statusSwitch ? '开启' : '关闭'
        },
        {
          textSpan: '联系电话：',
          text: '',
          type: 'contactNumber',
          isFull: true,
          tableColumns: tableColumns,
          tableData: tableData
        },
        {
          textSpan: '成员头像：',
          text: '暂无上传图片',
          imgUrl: record.avatar,
          isFull: true
        }
      ]
    },
    {
      baseTitle: '岗位信息',
      infoArr: [
        {
          textSpan: '',
          text: '',
          type: 'postInfo',
          isFull: true,
          tableColumns: tablePostColumns,
          tableData: tablePostData
        }
      ]
    },
    {
      baseTitle: '角色信息',
      isShow: true,
      infoArr: tempRoleVOList
    },
    {
      baseTitle: '详细信息',
      infoArr: [
        {
          textSpan: '出生日期：',
          text: record.birthDay
        },
        {
          textSpan: '电子邮箱：',
          text: record.email
        },
        {
          textSpan: 'QQ：',
          text: record.qq
        },
        {
          textSpan: '个人微信号：',
          text: record.wechat
        },
        {
          textSpan: '家庭地址：',
          text: homeAddress
        }
      ]
    },
    {
      baseTitle: '变更记录 ',
      type: 'changeRecord',
      changeRecord: changeRecord
    }
  ]

  state.isShowDetails = true
}

//新增成员 初始化密码 分配角色mdoal 后
const openInitPasswordModal = () => {
  state.isResetPasswordSuccessMark = operationPasswordType.initSuccess
  state.isShowResetPassWord = true
  state.resetPasswordTitle = '用户密码'
  state.closable = true
  state.resetModalStyle = {
    width: 633,
    height: 216
  }
}

//关闭 重置密码modal
const closePasswordModal = () => {
  state.isShowResetPassWord = false
  state.isResetPasswordSuccessMark = operationPasswordType.resetPassWord
  state.resetPasswordTitle = '提示'
  state.needShowInitPassWord = false
  setTimeout(() => {
    //延迟一下 - - 不然会导致 关闭的瞬间样式改变了 闪一下
    state.resetModalStyle = {
      width: 488,
      height: 270
    }
  }, 200)
}

//重置密码
const resetPassword = (record) => {
  state.isShowResetPassWord = true
  state.resetPasswordTitle = '提示'
  state.closable = true
  state.resetModalStyle = {
    width: 424,
    height: 138
  }
  state.record = record
}
//重置密码 请求
const resetPasswordFN = async () => {
  state.resetPasswordSuccessInfo = await putResetPassWord({ id: state.record.id })
  state.resetPasswordTitle = ''
  state.closable = false
  state.resetModalStyle = {
    width: 488,
    height: 270
  }
  state.isResetPasswordSuccessMark = operationPasswordType.resetPassWordSuccess
}

//复制密码
const copyText = async () => {
  const userNameText = state.needShowInitPassWord ? '用户工号：' : '用户名:'
  const passWordText = state.needShowInitPassWord ? '初始密码：' : '新密码:'
  try {
    await toClipboard(
      `${userNameText}${state.resetPasswordSuccessInfo.username}\n${passWordText}${state.resetPasswordSuccessInfo.password}`
    ) //实现复制
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

// 成立日期组件
const entryRef = ref()
// 出生日期组件
const birthDayRef = ref()
/** 弹窗滚动事件 */
const handleModalScroll = () => {
  birthDayRef.value?.blur()
  entryRef.value?.blur()
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
const changeColumn = ({ columnsObj, isCloseModal = false }) => {
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
state.columns = getColumns(state, PageKeyObj.member, allColumns, state.defaultKeys)
console.log('state.defaultKeys', state.defaultKeys)
/**一维数组对象模糊搜索
 * dataList 为一维数组数据结构
 * value 为input框的输入值
 *  type 为指定想要搜索的字段名，array格式 ["name", "number"];
 */
function filterOne(dataList, value, type) {
  let s = dataList.filter(function (item) {
    for (let j = 0; j < type.length; j++) {
      if (item[type[j]] != undefined || item[type[j]] != null) {
        if (item[type[j]].indexOf(value) >= 0) {
          return item
        }
      }
    }
  })
  return s
}

const sendCurrentSelect = (currentKey) => {
  //Number强转 路由跳转进来为String
  const tempItem = state.organizationList.filter((item) => item.id === Number(currentKey))
  const tempComponent = tempItem[0]?.component
  const needArr = filterOne(state.organizationList, tempComponent, ['component'])
  const tempArr: any = []
  if (currentKey) {
    needArr.map((item) => {
      tempArr.push(item.id)
    })
    queryParams.organization = tempArr
  } else {
    // state.organizationList.map((item) => {
    //   tempArr.push(item.id)
    // })
    // queryParams.organization = tempArr
    queryParams.organization = null
  }
  getList(1)
}

// interface DataItem {
//   key: number
//   name: string
//   age: number
//   address: string
//   children?: DataItem[]
// }

//获取部门列表
const getOrganizationListFN = async () => {
  //新增 修改 上级机构
  const selectRes = await getSimpleOrganizationList()

  //左侧树
  const res = await getDeptList()

  res.map((item) => {
    if (item.migrated === 1) {
      //0没迁移 1迁移
      item.name = item.migrated === 1 ? `${item.name}(关闭)` : item.name
      item.tagText = '已转移'
      item.needTag = true
    } else {
      //0开启 1关闭
      item.name = item.status === 1 ? `${item.name}(关闭)` : item.name
      item.needTag = false
    }
  })

  selectRes.map((item) => {
    if (item.migrated === 1) {
      //0没迁移 1迁移
      item.name = item.migrated === 1 ? `${item.name}(关闭)` : item.name
      item.tagText = '已转移'
      item.needTag = true
    } else {
      //0开启 1关闭
      item.name = item.status === 1 ? `${item.name}(关闭)` : item.name
      item.needTag = false
    }
  })

  //又改！！！ 说好 关闭 跟转移 打()的  现在又要过滤掉 上面代码先不删 估计过两天又要改回来
  const tempRes = selectRes.filter((item) => item.migrated !== 1 && item.status !== 1)

  const organizationList = handleTree(res, 'id', 'parentId', 'children')

  const tempOrganizationList = handleTree(tempRes, 'id', 'parentId', 'children')

  state.organizationList = res
  // 树结构数据过滤 数组中嵌数组 里面的数组为需要替换的属性名以及替换后的属性名
  // let needReplaceKey = [
  //   ['title', 'name'],
  //   ['key', 'component']
  // ]
  let needReplaceIDKey: any = [
    ['title', 'name'],
    ['key', 'id'],
    ['tagText', 'tagText'],
    ['needTag', 'needTag']
  ]
  //左侧树 机构(部门)
  state.organizationOptions = reconstructedTreeData(organizationList, needReplaceIDKey)

  //新增修改内 上级机构
  state.organizationIDOptions = reconstructedTreeData(tempOrganizationList, needReplaceIDKey)

  return res
}

// getOrganizationListFN()

//获取岗位类型 配置角色 人员类型
const getAllType = async () => {
  //岗位类型
  const res = await getPostTypeList()
  //岗位列表
  const postList = await getPostList()
  //角色信息
  const rolesRes = await getRolesList()
  //获取数据字典
  const dictRes = await getOrganizationTypeList()

  //人员类型
  const tempMemberType = dictRes.filter((item) => item.dictType === 'person_type')
  //岗位类型  主岗/兼岗
  const tempPostType = dictRes.filter((item) => item.dictType === 'post_type')
  //所属品牌
  const tempBarnOptions = dictRes.filter((item) => item.dictType === 'brand')

  //处理一下吧 当然换成 在标签上通过fieldNames更改也可以
  const needReplaceKey = [
    ['label', 'name'],
    ['value', 'code']
  ]

  const needReplacePartPostKey = [
    ['label', 'name'],
    ['value', 'id']
  ]
  await nextTick(() => {
    state.postTypeOptions = reconstructionArrayObject(res, needReplaceKey)
    state.configureRolesOptions = reconstructionArrayObject(rolesRes, needReplacePartPostKey)
    state.configureRolesNewList = cloneDeep(rolesRes)
    state.configureRolesNewOptions = reconstructionArrayObject(rolesRes, needReplacePartPostKey)
    state.configureRolesOptions = [
      // {
      //   label: '全部',
      //   value: 'all'
      // },
      {
        label: '空',
        value: 'empty'
      },
      ...state.configureRolesOptions
    ]
    state.memberTypeOptions = [
      // {
      //   label: '全部',
      //   value: 'all'
      // },
      ...tempMemberType
    ]
    state.postListOptions = reconstructionArrayObject(postList, needReplacePartPostKey)
    state.partPostOptionsText = tempPostType
    state.barnOptions = tempBarnOptions
  })

  postTypeChange(null)
}

getAllType()

//新增编辑 联系电话
const addEditColumns = [
  {
    title: '序号',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    resizable: true,
    customRender: (text: any, record: any, index: any, column: any) => {
      return text.index + 1
    }
  },
  {
    title: '号码类别',
    width: 145,
    dataIndex: 'phoneType',
    key: 'phoneType',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 1
  },
  {
    title: '号码',
    width: 130,
    dataIndex: 'phoneNum',
    key: 'phoneNum',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 2
  },
  {
    title: '使用类型',
    width: 145,
    dataIndex: 'useType',
    key: 'useType',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 3
  },
  {
    title: '是否开通云录音',
    width: 120,
    dataIndex: 'isService',
    key: 'isService',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 4
  },
  {
    title: '是否开通企微',
    width: 100,
    dataIndex: 'existWxWork',
    key: 'existWxWork',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 5
  },
  {
    title: '操作',
    width: 80,
    dataIndex: 'operation',
    key: 'operation',
    ellipsis: true,
    sort: 13
  }
]

const addDataSource = reactive({
  addEditTableData: [
    {
      index: 0,
      phoneType: '1',
      phoneNum: '',
      useType: '1',
      isService: true,
      existWxWork: true
    }
  ]
})

//新增编辑 联系电话 add
const addColumns = (index) => {
  // addDataSource.addEditTableData.push({
  //   phoneType: '1',
  //   phoneNum: '',
  //   useType: '1',
  //   isService: true
  // })

  const tempObj = {
    phoneType: '1',
    phoneNum: '',
    useType: '1',
    isService: true,
    existWxWork: true
  }

  addDataSource.addEditTableData.splice(index + 1, 0, tempObj)

  addDataSource.addEditTableData.map((item, index) => {
    item.index = index
  })
}

//新增编辑 联系电话 delete
const deleteColumns = (index) => {
  addDataSource.addEditTableData = addDataSource.addEditTableData.filter(
    (item) => item.index !== index
  )

  addDataSource.addEditTableData.map((item, index) => {
    item.index = index
  })
}

//新增编辑 岗位信息
const addEditPostColumns = [
  {
    title: '所属部门',
    width: 200,
    dataIndex: 'department',
    key: 'department',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 1
  },
  {
    title: '岗位',
    width: 170,
    dataIndex: 'post',
    key: 'post',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 2
  },
  {
    title: '所属品牌',
    width: 150,
    dataIndex: 'brand',
    key: 'brand',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 3
  },
  {
    title: '主岗/兼岗',
    width: 90,
    dataIndex: 'isMainPost',
    key: 'isMainPost',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 4
  },
  {
    title: '是否显示',
    width: 100,
    dataIndex: 'isShow',
    key: 'isShow',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 4
  },
  {
    title: '操作',
    width: 120,
    dataIndex: 'operation',
    key: 'operation',
    ellipsis: true,
    sort: 13
  }
]

const addPostDataSource = reactive({
  addEditTableData: [
    {
      index: 0,
      department: null,
      post: null,
      brand: [],
      isMainPost: null,
      isMainPostKey: 'main_post',
      isMainPostText: '主岗',
      isShow: true
    }
  ]
})

//新增编辑 岗位信息 add
const addPostColumns = (index) => {
  // addPostDataSource.addEditTableData.push({
  //   department: null,
  //   post: null,
  //   brand: [],
  //   isMainPost: null,
  //   isMainPostKey: 'secondary_post',
  //   isMainPostText: '兼岗',
  //   isShow: true
  // })

  const tempObj = {
    department: null,
    post: null,
    brand: [],
    isMainPost: null,
    isMainPostKey: 'secondary_post',
    isMainPostText: '兼岗',
    isShow: true
  }

  addPostDataSource.addEditTableData.splice(index + 1, 0, tempObj)

  addPostDataSource.addEditTableData.map((item, index) => {
    item.index = index
  })
}

//新增编辑 岗位信息 delete
const deletePostColumns = (index) => {
  addPostDataSource.addEditTableData = addPostDataSource.addEditTableData.filter(
    (item) => item.index !== index
  )

  addPostDataSource.addEditTableData.map((item, index) => {
    item.index = index
  })
}

const rolesChange = (rolesID) => {
  console.log('rolesID', rolesID)
  console.log('state.roleId===>', state.roleId)
}

//详情 角色信息标签点击事件
const clickRoleTag = async (childItem) => {
  const res = await getRoleApi(childItem.roleId)
  await configDetailDrawerRef.value.openDrawer(res)
}

const disabledDate = (current) => {
  //日期大于当天
  return current && current > dayjs()
}

//岗位类型 获取岗位列表
const postTypeChange = async (value) => {
  if (!value) {
    state.postTypeSpecifyOptions = cloneDeep(state.postListOptions)
    return
  }
  const postListRes = await getTypePostList({ typeCode: value })
  queryParams.post = null
  const needReplacePartPostKey = [
    ['label', 'name'],
    ['value', 'id']
  ]
  state.postTypeSpecifyOptions = reconstructionArrayObject(postListRes, needReplacePartPostKey)
}

const limitInput = (value, currentValue) => {
  if (!value) {
    return
  }
  const regExp = /^[0-9]*$/
  if (!regExp.test(value)) {
    if (currentValue) {
      currentValue.phoneNum = null
    } else {
      queryParams.memberPhone = null
    }
    message.warning('联系电话只能输入数字')
  }
}

const clearPhoneNum = (record) => {
  record.phoneNum = ''
}

//转拼音
const changeToPinYin = () => {
  formState.namePhoneticize = Pinyin.getFullChars(formState.memberName)
}

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

// 批量转岗
const batchChangePostModalRef = ref()
const batchAssignUserRoleModalRef = ref()
const onSelectChange = (selectedRowKeys) => {
  state.selectedRowKeys = selectedRowKeys
}
const batchChangePost = (): void => {
  batchChangePostModalRef.value.openModal(state.selectedRowKeys)
}
const batchAssignUserRole = (): void => {
  batchAssignUserRoleModalRef.value.openModal(state.selectedRowKeys)
}
// 批量设角色

state.organizationHasPermission = hasPermission('system:user:update-status')

onMounted(async () => {
  state.organizationList = await getOrganizationListFN()
  let organizationId = ''
  //机构管理 员工数跳转进来
  if ($router.options.history.state?.back === '/system/organization') {
    const { isOnJob = '0', organization = null } = $route?.query || {}
    queryParams.isOnJob = isOnJob
    organizationId = organization
    nextTick(() => {
      state.selectedKeys = [Number(organization)]
    })
  } else if ($router.options.history.state?.back === '/system/post') {
    //岗位管理 页面跳转进来
    const { isOnJob = '0', postId = null, postTypeId = null } = $route?.query || {}
    await postTypeChange(postTypeId)
    if (postTypeId != null) {
      queryParams.postType = postTypeId
      queryParams.isOnJob = isOnJob
    }
    if (postId != null) {
      queryParams.post = Number(postId)
      queryParams.isOnJob = isOnJob
    }
  } else if ($router.options.history.state?.back === '/system/role') {
    //角色管理 页面跳转进来
    const { isOnJob = '0', roleId = null } = $route?.query || {}
    if (roleId != null) {
      queryParams.isOnJob = isOnJob
      queryParams.configureRoles = [Number(roleId)]
    }
  }

  sendCurrentSelect(organizationId)
})
</script>

<style lang="scss" scoped>
//========================== search start ==================================
.search-form-style {
  :deep(.ant-form-item) {
    margin: 0;
  }
}

.total-search-content {
  display: flex;
  justify-content: space-between;
}

.search-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  //flex: 1 3 auto;
}

.search-btn-content {
  width: 300px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  //background: skyblue;
  //flex: 1 1 auto;
}

.search-item {
  display: flex;
  //flex: 1;
  margin-top: 10px;
}

.item-label {
  width: 80px;
  //margin-left: 10px;
  display: flex;
  //justify-content: flex-start;
  justify-content: flex-end;
  align-items: center;
}

.item-condition {
  width: 180px;
}

.item-condition-date {
  width: 240px;
}

.flex-style {
  display: flex;
}

.select-input {
  width: 270px;
}

.width-70 {
  width: 70px;
}

.width-180 {
  width: 180px;
  flex: 1;
}

.width-100 {
  width: 100%;
}

//========================== search end ==================================
.total-content {
  width: 100%;
  height: 100%;
  //background: skyblue;
  //overflow: auto;
  display: flex;
  justify-content: space-between;
  background: rgb(245, 247, 249);
}

.left-card-content {
  width: 100%;
  //background: skyblue;
  flex: 1 4 auto;
  //flex-shrink: 1;
}

.right-card-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgb(255, 255, 255);
  flex: 4 1 auto;
  //margin-right: 10px;
  //flex-shrink: 3;
}

//搜索重置 btn
.search-btn-content {
  min-width: 160px;
  display: flex;
  justify-content: space-between;
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
  height: 600px;
  margin: 0;
  padding: 14px;
  overflow: auto;
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

//分配角色左侧
.left-content {
  width: 290px;
  height: 620px;
  border: 1px solid rgb(234, 235, 239);
  //background: skyblue;
}

//分配角色右侧
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

.flex-space {
  display: flex;
  justify-content: space-between;
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

.margin-left-6 {
  margin-left: 6px;
}

.tags-content {
  margin-top: 15px;
  justify-content: flex-start;
}

.tag-style {
  cursor: pointer;
}

.change-record {
  margin-left: 13px;
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

//初始化密码
.init-Password-success {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  font-family: PingFangSC-Medium;
}

//重置密码成功
.reset-Password-success {
  padding: 43px 0 0 165px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  font-family: PingFangSC-Medium;
}

.success-img {
  margin-right: 8px;
  width: 24px;
  height: 24px;
}

.user-info1 {
  padding: 28px 0 0 167px;
}

.user-info2 {
  padding: 9px 0 0 167px;
  display: flex;
}

.user-info3 {
  margin-top: 32px;
  margin-left: 246px;
}

.padding-right-40 {
  padding-right: 40px;
}

.margin-top-9 {
  margin-top: 9px;
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
  width: 570px;
}

//table 联系电话
.phone-div-content {
  display: flex;
  padding: 5px 0;
}

.phone-div {
  display: flex;
  align-items: center;
  margin-right: 14px;
}

//新增修改
.form-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.width-50 {
  width: 50%;
}

.width-100 {
  width: 100%;
  //background: skyblue;
}

//分配角色 modal
.assign-roles-content {
  margin: 20px;
}

.member-info {
  display: flex;
  margin-bottom: 14px;
}

//分配角色 工号
.member-num {
  margin-right: 50px;
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
}

//分配角色 姓名
.member-num {
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
}

//分配角色 modal
.assign-roles-tip {
  padding: 10px;
  margin: 0 0 15px;
  background-color: rgba(253, 246, 237, 1);
}

.waring-img {
  width: 14px;
  height: 14px;
}

.roles-text {
  color: rgba(231, 162, 60, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
}

.role-text {
  margin-bottom: 10px;
}

//分配角色 select
.roles-select-content {
}

//详情 modal 变更记录
.record-title-content {
  display: flex;
  color: rgba(51, 51, 51, 1);
  font-size: 16px;
  font-weight: bold;
  font-family: PingFangSC-Medium;
}

.record-time {
  margin-left: 20px;
}

.record-type {
  margin-left: 64px;
}

.record-ellipsis {
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.record-tip-content {
  display: flex;
}

.width-10 {
  width: 50px;
}

.width-90 {
  width: 90%;
}

.width-full {
  width: 100% !important;
}

////表格空数据时大小
//:deep(.table-list .empty-content) {
//  min-height: 480px;
//}
//私人
.private-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  width: 40px;
  height: 22px;
  border-radius: 4px;
  background-color: rgb(244, 234, 253);
  color: rgba(176, 94, 255, 1);
}

//公司
.company-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  height: 22px;
  border-radius: 4px;
  background-color: rgba(53, 198, 217, 0.24);
  color: rgba(53, 198, 217, 1);
}

//主岗
.principal-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  width: 40px;
  height: 22px;
  border-radius: 4px;
  background-color: rgba(237, 249, 232, 1);
  color: rgba(82, 196, 26, 1);
}

//兼岗
.part-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  width: 40px;
  height: 22px;
  border-radius: 4px;
  background-color: rgba(253, 246, 235, 1);
  color: rgba(231, 162, 60, 1);
}

//配置角色tag
.role-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  padding: 8px;
  height: 22px;
  border-radius: 4px;
  background-color: rgba(240, 248, 255, 1);
  border: 0.5px solid rgba(0, 129, 255, 1);
  color: rgba(0, 129, 255, 1);
}

.role-close-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  padding: 8px;
  height: 22px;
  border-radius: 4px;
  background-color: rgba(240, 248, 255, 1);
  border: 0.5px solid rgba(113, 185, 255, 1);
  color: rgba(0, 129, 255, 0.52);
}

.role-delete-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  padding: 8px;
  height: 22px;
  border-radius: 4px;
  background-color: rgba(234, 235, 239, 1);
  color: rgba(181, 183, 189, 1);
  font-size: 12px;
  font-family: PingFangSC-Regular;
}

:deep(.ant-select-multiple .ant-select-selection-item-remove) {
  display: flex;
  align-items: center;
}

.phone-style {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

//table 关闭状态颜色
.close-style {
  color: rgba(153, 153, 153, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
}

//table 删除状态颜色
.delete-style {
  color: rgba(210, 210, 210, 1) !important;
  font-size: 14px;
  font-family: PingFangSC-Regular;
}
.margin-right-4 {
  margin-right: 4px;
}
.radio-btn {
  width: 60px;
  height: 26px;
  padding: 0;
  line-height: 26px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
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

.department-tree-select-content {
  width: max-content !important;
}

//新增 编辑 modal
.add-edit-modal {
  .phone-form-style {
    margin: 0 !important;
  }

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

  //联系电话表格
  .ant-table thead > tr > th {
    background: rgb(246, 246, 246);
  }

  .ant-table-tbody {
    background: white;
  }

  .ant-modal .ant-table tbody > tr > td {
    border-bottom: 1px solid rgba(234, 235, 239, 1);
  }

  .ant-modal .ant-table thead > tr > th {
    border-bottom: 1px solid rgba(234, 235, 239, 1);
  }

  .ant-modal .ant-table tbody .ant-table-cell {
    background: white !important;
  }

  .ant-table-cell-row-hover {
    background: white !important;
  }

  .ant-table-tbody .ant-table-row-hover > td {
    background: white !important;
  }

  .ant-table-cell {
    padding: 8px;
    margin: 0;
  }
}

//详情modal
.details-modal {
  //联系电话表格
  .ant-table thead > tr > th {
    background: rgb(246, 246, 246);
  }

  .ant-table-tbody {
    background: white;
  }

  .ant-modal .ant-table tbody > tr > td {
    border-bottom: 1px solid rgba(234, 235, 239, 1);
  }

  .ant-modal .ant-table thead > tr > th {
    border-bottom: 1px solid rgba(234, 235, 239, 1);
  }

  .ant-modal .ant-table tbody .ant-table-cell {
    background: white !important;
  }

  .ant-table-cell-row-hover {
    background: white !important;
  }

  .ant-table-tbody .ant-table-row-hover > td {
    background: white !important;
  }

  .ant-table-cell {
    padding: 8px;
    margin: 0;
  }
}
</style>
