<!--  主体管理  -->
<template>
  <div class="store-major-content flex">
    <!--  主体信息  -->
    <div class="total-content" v-if="state.isShowTable">
      <a-card class="type-card-style" :bodyStyle="{ height: '100%' }">
        <div class="type-content">
          <div class="type-text flex-center"> 主体信息 </div>
          <div
            class="expand-narrow flex-center"
            @click="
              () => {
                state.isShowTable = false
              }
            "
          >
            <Icon icon="svg-icon:expand" :size="15" />
            <span class="expand-narrow-text"> 收起 </span>
          </div>
        </div>
      </a-card>
      <!-- 搜索工作栏 -->
      <a-card class="search-card">
        <a-form
          :model="queryParams"
          ref="queryFormRef"
          layout="inline"
          autocomplete="off"
          :colon="false"
          labelAlign="right"
        >
          <div class="total-search-content">
            <div class="search-content">
              <a-form-item
                :label="`主体名称`"
                name="keyword"
                class="search-item"
                labelAlign="right"
              >
                <div class="item-condition">
                  <a-input
                    v-model:value="queryParams.keyword"
                    placeholder="请输入主体名称或者编码"
                    class="width-100"
                  />
                </div>
              </a-form-item>
              <a-form-item :label="`主体类型`" name="type" class="search-item" labelAlign="right">
                <div class="item-condition">
                  <a-select
                    v-model:value="queryParams.type"
                    placeholder="请选择主体类型"
                    class="width-100"
                    :options="state.majorIndividualTypeOptions"
                  />
                </div>
              </a-form-item>
              <a-form-item :label="`状态`" name="status" class="search-item" labelAlign="right">
                <div class="item-condition">
                  <a-select
                    v-model:value="queryParams.status"
                    placeholder="请选择状态"
                    class="width-100"
                    :options="state.statusOptions"
                  />
                </div>
              </a-form-item>
              <a-form-item
                :label="`有效期`"
                name="startEndTime"
                class="search-item"
                labelAlign="right"
              >
                <div class="item-condition-date">
                  <a-range-picker
                    v-model:value="queryParams.startEndTime"
                    format="YYYY/MM/DD"
                    :placeholder="['开始时间', '结束时间']"
                  />
                </div>
              </a-form-item>
            </div>

            <div class="search-btn-content">
              <a-button
                type="primary"
                html-type="submit"
                @click="getList()"
                v-hasPermi="['system:tenant:query']"
                >查询</a-button
              >
              <a-button @click="resetQuery(PageKeyObj.business)">重置</a-button>
            </div>
          </div>
        </a-form>
      </a-card>

      <!--  表格  id card-content 全屏时 -->
      <a-card
        :bordered="false"
        style="width: 100%; height: 100%; padding-bottom: 30px; overflow: hidden"
        :id="state.majCardId"
      >
        <!--  <ContentWrap>-->
        <!--    <a-button type="primary" @click="toggleExpandAll" v-hasPermi="['system:menu:create']">-->
        <!--      <Icon icon="ep:plus" class="mr-5px" color="#fff" /> 新增新增</a-button-->
        <!--    >-->

        <div class="card-content">
          <!--  左侧按钮  -->
          <div class="button-content">
            <a-button type="primary" @click="openModal()" v-hasPermi="['system:tenant:create']">
              <template #icon><Icon icon="svg-icon:add" class="btn-icon" :size="10" /></template>
              新增主体
            </a-button>
            <a-button @click="toggleExpandAll(false)">
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
            <Icon
              icon="svg-icon:full-screen"
              :size="50"
              class="cursor-pointer"
              @click="fullScreenFN('majCardId')"
            />
            <!--        <Icon icon="svg-icon:print-connect" :size="50" class="cursor-pointer" />-->
            <Icon
              icon="svg-icon:refresh"
              :size="50"
              class="cursor-pointer"
              @click="getList(true)"
            />
            <Icon
              icon="svg-icon:custom-column"
              :size="50"
              class="cursor-pointer"
              @click="state.isShowCustomColumnModal = true"
            />
          </div>
        </div>

        <a-table
          v-if="state.refreshTable"
          :columns="state.columns"
          :data-source="state.tableDataPseudoPaginationList"
          :scroll="{ x: 'max-content', y: 440 }"
          :pagination="false"
          @change="onChange"
          :row-key="(record) => record.id"
          :loading="state.loading"
          :expandable="{ defaultExpandAllRows: false, expandRowByClick: false }"
          :defaultExpandAllRows="state.isExpandAll"
          @resizeColumn="handleResizeColumn"
          :expandIconColumnIndex="state.treeIconIndex"
          :customRow="clickRow"
          :rowClassName="setRowClassName"
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
            <!--  主体名称   -->
            <template v-if="column?.key === 'name'">
              <div class="name-content"
                >{{ record.name }}
                <div
                  :class="['store-tag', { 'child-store-tag': record?.childStore }]"
                  v-if="record.store"
                  >{{ record.store }}</div
                ></div
              >
            </template>
            <!--  可用名额   -->
            <!--  排除门店  -->
            <template
              v-if="
                column?.key === 'usableAmount' &&
                record.type !== organizationType.store &&
                record.type !== storeSubType.popStore &&
                record.type !== storeSubType.cityHall
              "
            >
              <div>{{ record.accountUsedCount }}/{{ record.accountCount }}</div>
            </template>
            <!--  有效期   -->
            <!--  排除门店  -->
            <template
              v-if="
                column?.key === 'validityPeriod' &&
                record.type !== organizationType.store &&
                record.type !== storeSubType.popStore &&
                record.type !== storeSubType.cityHall
              "
            >
              <div>{{ record.effectiveStartDate }}~{{ record.expireTime }}</div>
            </template>
            <!--  状态   -->
            <template v-if="column?.key === 'statusSwitch'">
              <!-- TODO： 0开启 1关闭 ...换成开关的话 -  -需要对数据进行处理  - - 即对tree里的status进行替换 为布尔值 ... -->
              <!--  门店  -->
              <a-switch
                v-if="record.type === organizationType.store"
                :disabled="record.level === 1 || !state.storeHasPermission"
                v-model:checked="record.statusSwitch"
                @change="(value) => setTableStatusChangeInfo(value, record)"
              />
              <!--  子门店  -->
              <a-switch
                v-if="
                  record.type === storeSubType.popStore || record.type === storeSubType.cityHall
                "
                :disabled="
                  record.level === 1 ||
                  !state.childStoreHasPermission ||
                  !record.parentStoreStatusSwitch
                "
                v-model:checked="record.statusSwitch"
                @change="(value) => setTableStatusChangeInfo(value, record)"
              />
              <!-- 主体  -->
              <a-switch
                v-if="
                  record.type !== organizationType.store &&
                  record.type !== storeSubType.popStore &&
                  record.type !== storeSubType.cityHall
                "
                :disabled="record.level === 1 || !state.majorIndividualHasPermission"
                v-model:checked="record.statusSwitch"
                @change="(value) => setTableStatusChangeInfo(value, record)"
              />
            </template>

            <!--  操作   -->
            <template v-if="column?.key === 'operation'">
              <!--  门店  -->
              <div class="operation-content" v-if="record.type === organizationType.store">
                <XTextButton
                  title="修改"
                  v-hasPermi="['system:tenant:update-store']"
                  @click="edit(record, false, record.type === organizationType.store)"
                />
                <XTextButton
                  title="修改上级主体"
                  v-hasPermi="['system:tenant:change-parent-tenant']"
                  @click="openEditParentMajorIndividual(record)"
                />

                <XTextButton
                  title="新增子门店"
                  v-hasPermi="['system:tenant:create-child-store']"
                  @click="openModal(record, true)"
                />

                <a-popover placement="bottom" class="margin-left-14">
                  <template #content>
                    <div>
                      <XTextButton
                        title="设置属性"
                        v-hasPermi="['system:tenant:set-attribute']"
                        @click="
                          edit(
                            record,
                            false,
                            record.type === organizationType.store,
                            'underlyingAttribute'
                          )
                        "
                      />
                    </div>
                    <div>
                      <XTextButton
                        title="详情"
                        v-hasPermi="['system:tenant:store-detail']"
                        @click="detailsInfo(record)"
                      />
                    </div>
                  </template>
                  <Icon icon="svg-icon:ellipsis" class="btn-icon" :size="18" />
                </a-popover>
              </div>
              <!--  子门店  -->
              <div
                class="operation-content"
                v-if="
                  record.type === storeSubType.popStore || record.type === storeSubType.cityHall
                "
              >
                <XTextButton
                  title="修改"
                  v-hasPermi="['system:tenant:update-child-store']"
                  @click="
                    edit(
                      record,
                      false,
                      record.type === storeSubType.popStore || record.type === storeSubType.cityHall
                    )
                  "
                />
                <XTextButton
                  title="设置属性"
                  v-hasPermi="['system:tenant:child-store-set-attribute']"
                  @click="
                    edit(
                      record,
                      false,
                      record.type === storeSubType.popStore ||
                        record.type === storeSubType.cityHall,
                      'underlyingAttribute'
                    )
                  "
                />
                <XTextButton
                  title="详情"
                  v-hasPermi="['system:tenant:child-store-detail']"
                  @click="detailsInfo(record)"
                />
              </div>
              <!--  主体 TODO click 可以换成 clickOperation方法-->
              <div
                class="operation-content"
                v-if="
                  record.type !== organizationType.store &&
                  record.type !== storeSubType.popStore &&
                  record.type !== storeSubType.cityHall
                "
              >
                <XTextButton
                  title="详情"
                  v-hasPermi="['system:tenant:detail']"
                  @click="detailsInfo(record)"
                />

                <a-popover placement="bottom" class="margin-left-14">
                  <template #content>
                    <div>
                      <XTextButton
                        title="修改"
                        v-hasPermi="['system:tenant:update']"
                        @click="edit(record, false, record.type === organizationType.store)"
                      />
                    </div>

                    <div>
                      <XTextButton
                        title="新增门店"
                        v-if="record.type === majorIndividualType.dealer"
                        v-hasPermi="['system:tenant:create-store']"
                        @click="openModal(record)"
                      />
                    </div>

                    <div>
                      <XTextButton
                        title="新增子项"
                        v-if="record.type === majorIndividualType.manufacturer"
                        v-hasPermi="['system:tenant:create-child']"
                        @click="openModal(record)"
                      />
                    </div>

                    <div>
                      <XTextButton
                        title="配置菜单"
                        v-hasPermi="['system:tenant:auth']"
                        @click="assignPermission(record)"
                      />
                    </div>

                    <div>
                      <XTextButton
                        title="绑定域名"
                        v-hasPermi="['system:tenant:bind-domain']"
                        @click="openDomainCulture(record, 'domain')"
                      />
                    </div>

                    <div>
                      <XTextButton
                        title="企业文化"
                        v-hasPermi="['system:tenant:update-culture']"
                        @click="openDomainCulture(record, 'culture')"
                      />
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
          :total="state.tableDataList.length"
          v-model:page="state.pageNo"
          v-model:limit="state.pageSize"
          style="padding: 0 15px"
          @pagination="onPageChange(PageKeyObj.business)"
        />
        <!--  </ContentWrap>-->
      </a-card>
    </div>
    <MajorIndividualSelectTree
      v-else
      :tree-data="state.tableDataList"
      :currentSelectRecord="state.currentClickRecord"
      :selectedKeys="state.majSelectedKeys"
      @sendCurrentSelect="clickMaj"
      @expandMaj="
        () => {
          state.isShowTable = true
        }
      "
      @addMaj="openModal()"
      @clickOperation="clickOperation"
      class="height-100"
    />
    <!--  门店信息  -->
    <div :class="['total-content store-content flex-1']">
      <a-card class="type-card-style" :bodyStyle="{ height: '100%' }">
        <div class="type-content">
          <div class="type-text flex-center"
            >{{ state.currentClickRecord.name ? `${state.currentClickRecord.name}-` : '' }} 门店信息
            <el-button
              v-if="state.currentClickRecord.name"
              type="primary"
              class="clear-tag"
              text
              bg
              @click="
                () => {
                  state.currentClickRecord = {}
                  state.majSelectedKeys = []
                  currentSelectChange()
                  getListStoreFN()
                }
              "
              >清除</el-button
            >
          </div>
        </div>
      </a-card>
      <div class="store-total-content">
        <div class="store-tree-content">
          <StoreProSelectTree
            :tree-data="state.areaListOptions"
            @sendCurrentSelect="sendCurrentSelect"
          />
        </div>
        <div :class="['flex flex-1 flex-col overflow-auto']">
          <!-- 搜索工作栏 -->
          <a-card :class="['search-card', { 'width-100': !state.isShowTable }]">
            <a-form
              :model="queryParamsStore"
              ref="queryFormStoreRef"
              layout="inline"
              autocomplete="off"
              :colon="false"
              labelAlign="right"
            >
              <div class="total-search-content store-total-search-content">
                <div class="search-content">
                  <a-form-item
                    :label="`门店名称`"
                    name="keyword"
                    class="search-item"
                    labelAlign="right"
                  >
                    <div class="item-condition">
                      <a-input
                        v-model:value="queryParamsStore.keyword"
                        placeholder="请输入门店名称或者编码"
                        class="width-100"
                      />
                    </div>
                  </a-form-item>
                  <a-form-item :label="`专营店编码`" name="specialtyCode" class="search-item">
                    <div class="item-condition">
                      <a-input
                        v-model:value="queryParamsStore.specialtyCode"
                        placeholder="请输入专营店编码"
                        class="width-100"
                      />
                    </div>
                  </a-form-item>
                  <a-form-item :label="`机构类型`" name="organizationType" class="search-item">
                    <div class="item-condition">
                      <a-select
                        v-model:value="queryParamsStore.organizationType"
                        placeholder="请选择机构类型"
                        class="width-100"
                        :options="[...state.organizationTypeOptions, ...state.childStoreOptions]"
                      />
                    </div>
                  </a-form-item>
                  <a-form-item
                    :label="`品牌`"
                    name="brand"
                    class="search-item"
                    v-if="!state.isShowTable"
                  >
                    <div class="item-condition">
                      <a-select
                        v-model:value="queryParamsStore.brand"
                        placeholder="请选择品牌"
                        class="width-100"
                        :options="state.brandOptions"
                      />
                    </div>
                  </a-form-item>
                  <a-form-item :label="`状态`" name="status" class="search-item" labelAlign="right">
                    <div class="item-condition">
                      <a-select
                        v-model:value="queryParamsStore.status"
                        placeholder="请选择状态"
                        class="width-100"
                        :options="state.statusOptions"
                      />
                    </div>
                  </a-form-item>
                </div>

                <div class="search-btn-content">
                  <a-button
                    type="primary"
                    html-type="submit"
                    @click="getListStoreFN()"
                    v-hasPermi="['system:tenant:store-list']"
                    >查询</a-button
                  >
                  <a-button @click="resetQuery(PageKeyObj.businessStore)">重置</a-button>
                </div>
              </div>
            </a-form>
          </a-card>

          <!--  表格  id card-content 全屏时 -->
          <a-card
            :bordered="false"
            class="w-full"
            style="height: 649px; padding-bottom: 30px; overflow: hidden"
            :id="state.storeId"
          >
            <div class="card-content">
              <!--  左侧按钮  -->
              <div class="button-content">
                <!--  type: 'dealer' 经销商 unNeedBelongTenantId: true 不需要默认回填上级主体  这块后面最好是改一下 一直在改 又一直催 先这样 按原来的逻辑走  凑入参进去 -->
                <a-button
                  type="primary"
                  @click="openModal({ type: 'dealer', unNeedBelongTenantId: true })"
                  v-hasPermi="['system:tenant:create-store']"
                >
                  <template #icon
                    ><Icon icon="svg-icon:add" class="btn-icon" :size="10"
                  /></template>
                  新增门店
                </a-button>
                <a-button @click="toggleExpandAll(true)">
                  <template #icon>
                    <Icon
                      icon="svg-icon:expansion"
                      class="btn-icon"
                      :size="10"
                      v-if="state.isExpandAllStore"
                    />
                    <Icon icon="svg-icon:expandFold" class="btn-icon" :size="10" v-else />
                  </template>
                  {{ state.isExpandAllStore ? '收起全部' : '展开全部' }}
                </a-button>
              </div>
              <!--  右侧操作  -->
              <div class="operation-content">
                <!--        <Icon icon="svg-icon:search" :size="50" class="cursor-pointer" />-->
                <Icon
                  icon="svg-icon:full-screen"
                  :size="50"
                  class="cursor-pointer"
                  @click="fullScreenFN('storeId')"
                />
                <!--        <Icon icon="svg-icon:print-connect" :size="50" class="cursor-pointer" />-->
                <Icon
                  icon="svg-icon:refresh"
                  :size="50"
                  class="cursor-pointer"
                  @click="getListStoreFN(true)"
                />
                <Icon
                  icon="svg-icon:custom-column"
                  :size="50"
                  class="cursor-pointer"
                  @click="state.isShowStoreCustomColumnModal = true"
                />
              </div>
            </div>

            <a-table
              v-if="state.refreshTableStore"
              style="width: 100%"
              :columns="state.columnsStore"
              :data-source="state.tableDataPseudoPaginationListStore"
              :scroll="{ x: 'max-content', y: 440 }"
              :pagination="false"
              @change="onChange"
              :row-key="(record) => record.id"
              :loading="state.loadingStore"
              :expandable="{ defaultExpandAllRows: false, expandRowByClick: false }"
              :defaultExpandAllRows="state.isExpandAllStore"
              @resizeColumn="handleResizeColumn"
              :expandIconColumnIndex="state.treeIconIndexStore"
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
                <!--  门店名称   -->
                <template v-if="column?.key === 'name'">
                  <div class="name-content"
                    >{{ record.name }}
                    <div
                      :class="['store-tag', { 'child-store-tag': record?.childStore }]"
                      v-if="record.store"
                      >{{ record.store }}</div
                    ></div
                  >
                </template>
                <!--  状态   -->
                <template v-if="column?.key === 'statusSwitch'">
                  <!-- TODO： 0开启 1关闭 ...换成开关的话 -  -需要对数据进行处理  - - 即对tree里的status进行替换 为布尔值 ... -->
                  <!--  门店  -->
                  <a-switch
                    v-if="record.organizationCategory === organizationCategory.store"
                    :disabled="record.level === 1 || !state.storeHasPermission"
                    v-model:checked="record.statusSwitch"
                    @change="(value) => setTableStatusChangeInfo(value, record)"
                  />
                  <!--  子门店  -->
                  <a-switch
                    v-if="record.organizationCategory === organizationCategory.childStore"
                    :disabled="
                      record.level === 1 ||
                      !state.childStoreHasPermission ||
                      !record.parentStoreStatusSwitch
                    "
                    v-model:checked="record.statusSwitch"
                    @change="(value) => setTableStatusChangeInfo(value, record)"
                  />
                </template>

                <!--  操作   -->
                <template v-if="column?.key === 'operation'">
                  <!--  门店  -->
                  <div
                    class="operation-content"
                    v-if="record.organizationCategory === organizationCategory.store"
                  >
                    <XTextButton
                      title="详情"
                      v-hasPermi="['system:tenant:store-detail']"
                      @click="detailsInfo(record)"
                    />

                    <a-popover placement="bottom" class="margin-left-14">
                      <template #content>
                        <div>
                          <XTextButton
                            title="修改"
                            v-hasPermi="['system:tenant:update-store']"
                            @click="
                              edit(
                                record,
                                false,
                                record.organizationCategory === organizationCategory.store
                              )
                            "
                          />
                        </div>

                        <div>
                          <XTextButton
                            title="设置属性"
                            v-hasPermi="['system:tenant:set-attribute']"
                            @click="
                              edit(
                                record,
                                false,
                                record.organizationCategory === organizationCategory.store,
                                'underlyingAttribute'
                              )
                            "
                          />
                        </div>

                        <div>
                          <XTextButton
                            title="修改上级主体"
                            v-hasPermi="['system:tenant:change-parent-tenant']"
                            @click="openEditParentMajorIndividual(record)"
                          />
                        </div>

                        <div>
                          <XTextButton
                            title="新增子门店"
                            v-hasPermi="['system:tenant:create-child-store']"
                            @click="openModal(record, true)"
                          />
                        </div>
                      </template>
                      <Icon icon="svg-icon:ellipsis" class="btn-icon" :size="18" />
                    </a-popover>
                  </div>
                  <!--  子门店  -->
                  <div
                    class="operation-content"
                    v-if="record.organizationCategory === organizationCategory.childStore"
                  >
                    <XTextButton
                      title="详情"
                      v-hasPermi="['system:tenant:child-store-detail']"
                      @click="detailsInfo(record)"
                    />

                    <a-popover placement="bottom" class="margin-left-14">
                      <template #content>
                        <div>
                          <XTextButton
                            title="修改"
                            v-hasPermi="['system:tenant:update-child-store']"
                            @click="
                              edit(
                                record,
                                false,
                                record.organizationCategory === organizationCategory.childStore
                              )
                            "
                          />
                        </div>
                        <div>
                          <XTextButton
                            title="设置属性"
                            v-hasPermi="['system:tenant:child-store-set-attribute']"
                            @click="
                              edit(
                                record,
                                false,
                                record.organizationCategory === organizationCategory.childStore,
                                'underlyingAttribute'
                              )
                            "
                          />
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
              :total="state.tableDataListStore.length"
              v-model:page="state.pageNoStore"
              v-model:limit="state.pageSizeStore"
              style="padding: 0 15px"
              @pagination="onPageChange(PageKeyObj.businessStore)"
            />
            <!--  </ContentWrap>-->
          </a-card>
        </div>
      </div>
    </div>
  </div>

  <!-- 新增 编辑 Modal -->
  <a-modal
    v-model:visible="state.isShow"
    destroyOnClose
    :title="state.modalTitle"
    wrapClassName="add-edit-modal"
    @cancel="closeModal"
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
              v-for="item in state.majorIndividualTypeOptionsClone"
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

        <a-form-item
          :label="`主体简称`"
          name="abbreviate"
          :rules="[{ required: true, message: `主体简称不能为空` }]"
        >
          <a-input
            v-model:value="state.formState.abbreviate"
            show-count
            :maxlength="10"
            placeholder="请输入主体简称"
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
          <div class="phone-text"> 主要用于重要功能的安全验证，请确保填写正确 </div>
        </a-form-item>

        <!--  级联选择器  - -   -->
        <a-form-item
          :label="`公司地址`"
          name="detailedAddress"
          :rules="[{ required: true, message: `公司地址不能为空` }]"
        >
          <div class="flex-content adress-content">
            <a-form-item-rest>
              <a-cascader
                ref="companyAddressRef"
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

        <!--        <a-form-item-->
        <!--          :label="`绑定域名`"-->
        <!--          name="bindingDomainName"-->
        <!--          :rules="state.bindingDomainNameValidatorRules"-->
        <!--        >-->
        <!--          <a-input v-model:value="state.formState.bindingDomainName" placeholder="请输入绑定的域名">-->
        <!--            <template #addonBefore>-->
        <!--              <a-select v-model:value="state.formState.bindingDomainNameBefore" style="width: 90px">-->
        <!--                <a-select-option value="http://">http://</a-select-option>-->
        <!--                <a-select-option value="https://">https://</a-select-option>-->
        <!--              </a-select>-->
        <!--            </template>-->
        <!--          </a-input>-->
        <!--        </a-form-item>-->

        <!--        <a-form-item-->
        <!--          v-if="state.modalType === 'add'"-->
        <!--          label="状态"-->
        <!--          name="status"-->
        <!--          :rules="[{ required: true, message: '菜单状态!' }]"-->
        <!--        >-->
        <!--          <a-switch-->
        <!--            v-model:checked="state.formState.status"-->
        <!--            checked-children="开启"-->
        <!--            un-checked-children="关闭"-->
        <!--          />-->
        <!--        </a-form-item>-->

        <div class="title-content"><div class="blue-line"></div> 系统信息 </div>
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
            <UploadImg v-model:modelValue="state.logoUrlSuccess" :resolution="[400, 400]" />
            <!--            <a-upload-->
            <!--              v-model:file-list="state.logoListUrl"-->
            <!--              :action="updateUrl + '?updateSupport=' + updateSupport"-->
            <!--              list-type="picture-card"-->
            <!--              @preview="handlePreview"-->
            <!--              accept=".jpg, .png, .gif"-->
            <!--              class="avatar-uploader"-->
            <!--              :show-upload-list="true"-->
            <!--              :headers="uploadHeaders"-->
            <!--              :before-upload="(file, fileList) => beforeUpload(file, fileList, 'logo')"-->
            <!--              @change="-->
            <!--                (file, fileList) => {-->
            <!--                  handleChange(file, fileList, 'logo')-->
            <!--                }-->
            <!--              "-->
            <!--              @remove="-->
            <!--                (file) => {-->
            <!--                  removeImg(file, 'logo')-->
            <!--                }-->
            <!--              "-->
            <!--            >-->
            <!--              <div v-if="state.logoListUrl.length < 1">-->
            <!--                <Icon icon="svg-icon:add-upload" :size="15" />-->
            <!--                <div style="margin-top: 8px">上传logo</div>-->
            <!--              </div>-->
            <!--            </a-upload>-->
            <!--            <div class="upload-text"> 支持jpg/png格式，尺寸400px * 400px </div>-->

            <div class="upload-text">
              支持jpg/png格式，尺寸400px * 400px
              <a-popover placement="bottom" class="margin-left-14">
                <template #content>
                  <img :src="logo" alt="" />
                </template>
                <span class="logo-example"> 示例 </span>
              </a-popover>
            </div>
          </div>
        </a-form-item>

        <a-form-item label="登录页logo" name="loginLogoUrl">
          <div style="height: 131px">
            <UploadImg v-model:modelValue="state.loginLogoUrlSuccess" :resolution="[192, 50]" />
            <div class="upload-text">
              支持jpg/png格式，尺寸192x * 50px
              <a-popover placement="bottom" class="margin-left-14">
                <template #content>
                  <img :src="loginLogo" alt="" />
                </template>
                <span class="logo-example"> 示例 </span>
              </a-popover>
            </div>
          </div>
        </a-form-item>

        <a-form-item
          :label="`有效期`"
          name="effectiveStartEndTime"
          :rules="[{ required: true, message: `有效期不能为空` }]"
        >
          <div class="flex-content">
            <a-range-picker
              ref="effectiveRef"
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
            <!--            <a-upload-->
            <!--              v-model:file-list="state.legalPersonListUrl"-->
            <!--              :action="updateUrl + '?updateSupport=' + updateSupport"-->
            <!--              list-type="picture-card"-->
            <!--              @preview="handlePreview"-->
            <!--              accept=".jpg, .png, .gif"-->
            <!--              class="avatar-uploader"-->
            <!--              :show-upload-list="true"-->
            <!--              :headers="uploadHeaders"-->
            <!--              :before-upload="(file, fileList) => beforeUpload(file, fileList, 'legalPerson')"-->
            <!--              @change="-->
            <!--                (file, fileList) => {-->
            <!--                  handleChange(file, fileList, 'legalPerson')-->
            <!--                }-->
            <!--              "-->
            <!--              @remove="-->
            <!--                (file) => {-->
            <!--                  removeImg(file, 'legalPerson')-->
            <!--                }-->
            <!--              "-->
            <!--            >-->
            <!--              <div v-if="state.legalPersonListUrl.length < 1">-->
            <!--                <Icon icon="svg-icon:add-upload" :size="15" />-->
            <!--                <div style="margin-top: 8px">上传法人证件</div>-->
            <!--              </div>-->
            <!--            </a-upload>-->

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
            <!--            <a-upload-->
            <!--              v-model:file-list="state.businessLicenseListUrl"-->
            <!--              :action="updateUrl + '?updateSupport=' + updateSupport"-->
            <!--              list-type="picture-card"-->
            <!--              @preview="handlePreview"-->
            <!--              accept=".jpg, .png, .gif"-->
            <!--              class="avatar-uploader"-->
            <!--              :show-upload-list="true"-->
            <!--              :headers="uploadHeaders"-->
            <!--              :before-upload="(file, fileList) => beforeUpload(file, fileList, 'businessLicense')"-->
            <!--              @change="-->
            <!--                (file, fileList) => {-->
            <!--                  handleChange(file, fileList, 'businessLicense')-->
            <!--                }-->
            <!--              "-->
            <!--              @remove="-->
            <!--                (file) => {-->
            <!--                  removeImg(file, 'businessLicense')-->
            <!--                }-->
            <!--              "-->
            <!--            >-->
            <!--              <div v-if="state.businessLicenseListUrl.length < 1">-->
            <!--                <Icon icon="svg-icon:add-upload" :size="15" />-->
            <!--                <div style="margin-top: 8px">上传营业执照</div>-->
            <!--              </div>-->
            <!--            </a-upload>-->

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
    @closeStore="closeStore"
    :belongTenantId="state.belongTenantId"
    :parentId="state.parentId"
    :editRecord="state.record"
    :tabsActiveKey="state.currentTabs"
    :needBelongTenantId="state.needBelongTenantId"
    :needParentId="state.needParentId"
    :needOrganizationType="state.needOrganizationType"
    :needStoreSubtyping="state.needStoreSubtyping"
    :useStoreList="state.useStoreList"
    :storeType="state.storeType"
    :storeRecord="state.storeRecord"
  />

  <!-- 配置权限 Modal -->
  <a-modal
    v-model:visible="state.isShowPermission"
    destroyOnClose
    title="配置权限"
    @cancel="closePermissionModal"
    :width="'1032px'"
    :bodyStyle="{ height: '700px', margin: '0', padding: '0', overflow: 'auto' }"
  >
    <div class="per-content">
      <!--  左右两侧  -->
      <div class="select-content">
        <div>
          <div class="text-content">请选择该主体的功能配置权限：</div>
          <a-tabs
            class="left-content"
            v-model:activeKey="state.activeKey"
            tabBarGutter="40px"
            :tabBarStyle="{ paddingLeft: '10px', background: 'rgb(246, 246, 246)', margin: 0 }"
          >
            <a-tab-pane key="frontDesk" tab="成员端" force-render>
              <div class="tab-search-content">
                <a-checkbox v-model:checked="state.selectAllFrontDesk" @change="selectAllFrontDesk"
                  >全选</a-checkbox
                >
                <a-checkbox
                  v-model:checked="state.isExpandAllTabFrontDesk"
                  @change="expandAllFNFrontDesk"
                  >展开/折叠</a-checkbox
                >
              </div>
              <div>
                <a-tree
                  v-if="state.isShowTreeFrontDesk"
                  v-model:selectedKeys="state.selectedKeysFrontDesk"
                  v-model:checkedKeys="state.checkedKeysFrontDesk"
                  :defaultExpandAll="state.defaultExpandAllFrontDesk"
                  blockNode
                  checkable
                  class="backstage-tabs-tree"
                  :height="533"
                  :tree-data="state.menuTreeListFrontDesk"
                  :fieldNames="state.fieldNames"
                  @check="testCheckFrontDesk"
                  @select="treeSelectFrontDesk"
                />
              </div>
            </a-tab-pane>
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
                  :defaultExpandAll="state.defaultExpandAll"
                  blockNode
                  checkable
                  class="backstage-tabs-tree"
                  :height="533"
                  :tree-data="state.menuTreeList"
                  :fieldNames="state.fieldNames"
                  @check="testCheck"
                  @select="treeSelect"
                />
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>

        <!--  成员端  -->
        <div class="right-content" v-if="state.activeKey === 'frontDesk'">
          <div style="height: 20px"></div>
          <div class="list-content border-1">
            <div class="right-top-text">操作权限</div>
            <div class="tab-search-content">
              <a-checkbox
                v-model:checked="state.selectAllOperationFrontDesk"
                @change="selectAllOperationFrontDesk"
                >全选</a-checkbox
              >
            </div>
            <div>
              <a-checkbox-group
                v-model:value="state.operationCheckedValueFrontDesk"
                @change="operationCheckedValueChangeFrontDesk"
                class="checkbox-group"
              >
                <div class="operation-checkbox-content">
                  <a-checkbox
                    v-for="(item, index) in state.operationCheckedListFrontDesk"
                    :value="item.id"
                    :key="`operationCheckbox${index}`"
                    class="operation-checkbox-style"
                    @change="operationCheckedChangeFrontDesk"
                  >
                    {{ item.name }}
                  </a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
          </div>
        </div>
        <!--  管理端  -->
        <div class="right-content" v-if="state.activeKey === 'backstage'">
          <div style="height: 20px"></div>
          <div class="list-content border-1">
            <div class="right-top-text">操作权限</div>
            <div class="tab-search-content">
              <a-checkbox v-model:checked="state.selectAllOperation" @change="selectAllOperation"
                >全选</a-checkbox
              >
            </div>
            <div>
              <a-checkbox-group
                v-model:value="state.operationCheckedValue"
                @change="operationCheckedValueChange"
                class="checkbox-group"
              >
                <div class="operation-checkbox-content">
                  <a-checkbox
                    v-for="(item, index) in state.operationCheckedList"
                    :value="item.id"
                    :key="`operationCheckbox${index}`"
                    class="operation-checkbox-style"
                    @change="operationCheckedChange"
                  >
                    {{ item.name }}
                  </a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
          </div>
        </div>

        <!--  已选信息  -->
        <div class="right-content">
          <div v-if="state.isShowRightTree">已选信息：</div>
          <div class="overflow-auto">
            <div v-if="state.isShowRightTree">
              <div class="right-top-text">成员端</div>
              <div class="right-card-content">
                <a-tree
                  v-if="state.isShowRightTree"
                  :selectable="false"
                  defaultExpandAll
                  :tree-data="state.selectTreeFrontDesk"
                  :fieldNames="state.fieldNames"
                >
                  <template #title="{ name, id }">
                    <div class="tree-node" :class="`right-tree-item-front-desk-${id}`">
                      <span>{{ name }}</span>
                    </div>
                  </template>
                </a-tree>
                <div v-if="state.selectTreeFrontDesk?.length === 0" class="select-tip"
                  >请选择左侧要配置的菜单</div
                >
              </div>
            </div>
            <div v-if="state.isShowRightTree" class="margin-top-8 margin-bottom-8">
              <div class="right-top-text">管理端</div>
              <div class="right-card-content">
                <a-tree
                  v-if="state.isShowRightTree"
                  :selectable="false"
                  defaultExpandAll
                  :tree-data="state.selectTree"
                  :fieldNames="state.fieldNames"
                >
                  <template #title="{ name, id }">
                    <div class="tree-node" :class="`right-tree-item-${id}`">
                      <span>{{ name }}</span>
                    </div>
                  </template>
                </a-tree>
                <div v-if="state.selectTree?.length === 0" class="select-tip"
                  >请选择左侧要配置的菜单</div
                >
              </div>
            </div>
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
    @cancel="closeStatusModal"
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
          v-if="
            state.tableStatusChangeInfo?.tempTreeNum > 0 &&
            state.tableStatusChangeInfo?.needChildNum
          "
          class="status-text-info"
        >
          {{ state.tableStatusChangeInfo.statusTopText }} ，{{
            state.tableStatusChangeInfo.record.name
          }}底下
          <span class="status-span">{{ state.tableStatusChangeInfo?.tempTreeNum }}</span>
          个子项{{ state.tableStatusChangeInfo?.type }}将同步
          {{ state.tableStatusChangeInfo?.statusText }}，请谨慎操作。
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
    width="528px"
    @cancel="closeDateModal"
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
    <div
      class="details-edit"
      @click="edit(state.record, true, null, null, true)"
      v-hasPermi="['system:tenant:update']"
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

          <div
            v-if="childItem?.isSuperAdmin"
            v-hasPermi="['system:tenant:reset-password']"
            class="send-code-btn"
            @click="resetPassword"
          >
            重置密码
          </div>
        </div>
      </div>
      <div class="details-modal-content select-content" v-else>
        <div class="details-modal-left">
          <div class="details-heard">前台({{ item.frontDeskTreeArr?.length }})</div>
          <a-tree
            defaultExpandAll
            :tree-data="item.frontDeskTreeArr"
            :fieldNames="state.fieldNames"
            :height="250"
          />
        </div>
        <div class="details-modal-left">
          <div class="details-heard">后台({{ item.backstageTreeArr?.length }})</div>
          <a-tree
            defaultExpandAll
            :tree-data="item.backstageTreeArr"
            :fieldNames="state.fieldNames"
            :height="250"
          />
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
  />

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

  <!--  绑定域名/企业文化 Modal  -->
  <a-modal
    v-model:visible="state.isShowDomainCulture"
    destroyOnClose
    :title="state.domainCultureTitle"
    @cancel="closeDomainCultureModal"
    wrapClassName="domain-Culture"
    :width="`530px`"
    :bodyStyle="{
      width: `100%`,
      height: `206px`,
      margin: '0',
      padding: '0',
      overflow: 'auto'
    }"
  >
    <div class="form-content">
      <a-form
        :model="domainCultureForm"
        ref="domainCultureFormRef"
        v-bind="layout"
        :label-col="{ style: { width: '130px' } }"
        autocomplete="off"
      >
        <div v-if="state.modalDomainCultureType === 'domain'">
          <a-form-item
            :label="`绑定域名`"
            name="bindingDomainName"
            :rules="state.bindingDomainNameValidatorRules"
          >
            <a-input
              v-model:value="domainCultureForm.bindingDomainName"
              placeholder="请输入绑定的域名"
            >
              <template #addonBefore>
                <a-select
                  v-model:value="domainCultureForm.bindingDomainNameBefore"
                  style="width: 90px"
                >
                  <a-select-option value="http://">http://</a-select-option>
                  <a-select-option value="https://">https://</a-select-option>
                </a-select>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item :label="`备案编号`" name="filingNumber">
            <a-textarea
              v-model:value="domainCultureForm.filingNumber"
              show-count
              :maxlength="50"
              :rows="1"
              :disabled="!domainCultureForm.bindingDomainName"
              placeholder="请输入备案编号"
            />
          </a-form-item>

          <a-form-item :label="`公网安备号`" name="securityNumber">
            <a-textarea
              v-model:value="domainCultureForm.securityNumber"
              show-count
              :maxlength="50"
              :rows="1"
              :disabled="!domainCultureForm.bindingDomainName"
              placeholder="请输入公网安备号"
            />
          </a-form-item>
        </div>

        <a-form-item
          :label="`经营理念`"
          name="corporateCulture"
          v-if="state.modalDomainCultureType === 'culture'"
        >
          <a-textarea
            v-model:value="domainCultureForm.corporateCulture"
            show-count
            :maxlength="100"
            :rows="5"
            placeholder="请输入经营理念"
          />
          <div class="corporateCulture-text"> 注：该提示语将展示在登录页中 </div>
        </a-form-item>
      </a-form>
    </div>

    <!--  footer  -->
    <template #footer>
      <a-button
        type="primary"
        html-type="submit"
        @click="domainCultureOk"
        :loading="state.modalBtnLoading"
        >确认</a-button
      >
      <a-button @click="closeDomainCultureModal">取消</a-button>
    </template>
  </a-modal>

  <!--  门店修改上级主体  -->
  <EditParentMajorIndividual
    v-if="state.isShowParentMajorIndividual"
    @closeStoreParentMajorIndividual="closeStoreParentMajorIndividual()"
    :currentRecord="state.record"
  />

  <!--  定制列  -->
  <CustomColumn
    v-if="state.isShowCustomColumnModal"
    @change-column="changeColumn"
    :allColumns="allColumns"
    :defaultKeys="state.defaultKeys"
    :changedColumnsObj="state.changedColumnsObj"
    :pageKey="PageKeyObj.business"
  />

  <!--  定制列 门店  不合并了 单独写 -->
  <CustomColumn
    v-if="state.isShowStoreCustomColumnModal"
    @change-column="changeColumn"
    :allColumns="allStoreColumns"
    :defaultKeys="state.defaultStoreKeys"
    :changedColumnsObj="state.changedStoreColumnsObj"
    :pageKey="PageKeyObj.businessStore"
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
import { organizationCategory, organizationType, PageKeyObj, storeSubType } from '@/utils/constants'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import {
  addMajorIndividual,
  addTenantPackage,
  editTenantPackage,
  getChildStoreNum,
  getMajorIndividualDetails,
  getMajorIndividualList,
  getSimpleTenantList,
  getStoreList,
  getTenantPackage,
  getTopPhone,
  putBindDomain,
  putCulture,
  putResetPassWord,
  updateEditMajorIndividual,
  updateEditMajorIndividualStatus,
  updateStoreStatus
} from '@/api/system/business'
import { provincesMunicipalitiesArea } from '@/constant/pr.ts'
import {
  filterTree,
  getAllIds,
  getColumns,
  reconstructedTreeData,
  toTreeCount,
  fullScreen,
  hasPermission,
  getAllChildIds,
  findParentIds,
  validateParams
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
import UploadImg from '@/components/UploadFile/src/UploadImg.vue'
import MajorIndividualSelectTree from '@/views/system/business/components/MajorIndividualSelectTree.vue'
import StoreProSelectTree from '@/views/system/business/components/StoreProSelectTree.vue'
import isBetween from 'dayjs/plugin/isBetween'
import { getAreaList, getCurrentAreaList, getOrganizationTypeList } from '@/api/system/organization'
import { majorIndividualType } from '@/utils/constants'
import Pagination from '@/components/Pagination/index.vue'
import loginLogo from '@/assets/imgs/system/loginLogo.png'
import logo from '@/assets/imgs/system/logo.png'

const { wsCache } = useCache()

const { toClipboard } = useClipboard()

dayjs.extend(isBetween)

const queryParams: any = reactive({
  current: 1, //当前页码
  pageSize: 10, //显示条数
  keyword: undefined,
  specialtyCode: undefined,
  systemName: undefined,
  startEndTime: [],
  status: undefined,
  type: null
})

const queryParamsStore: any = reactive({
  current: 1, //当前页码
  pageSize: 10, //显示条数
  keyword: undefined,
  specialtyCode: undefined,
  organizationType: undefined,
  brand: null,
  status: undefined
})

const queryFormRef = ref() // 搜索的表单 主体
const queryFormStoreRef = ref() // 搜索的表单 门店
const domainCultureFormRef = ref() // 绑定域名/企业文化
const domainCultureForm = reactive({
  bindingDomainNameBefore: 'https://', //绑定域名前缀
  bindingDomainName: null, //绑定域名
  filingNumber: null, //备案编号
  securityNumber: null, //公网安备号
  corporateCulture: null //经营理念
})

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

//绑定域名校验规则
const bindingDomainNameValidator = (rule, value) => {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      if (value.startsWith('http://') || value.startsWith('https://')) {
        reject('绑定域名已经有前缀，不允许输入http://或https://')
      } else {
        resolve()
      }
    } else {
      reject()
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

//TODO 有空补吧
const state: any = reactive({
  majCardId: '',
  storeId: '',
  pageNo: 1,
  pageSize: 10,
  pageNoStore: 1,
  pageSizeStore: 10,
  isShowTable: false, //主体表格
  areaListOptions: [],
  majorIndividualHasPermission: false, //table 状态switch 是否禁用 权限关禁用  主体状态权限
  storeHasPermission: false, //table 状态switch 是否禁用 权限关禁用 门店状态权限
  childStoreHasPermission: false, //table 状态switch 是否禁用 权限关禁用 子门店状态权限
  isSuperAdmin: false, //仅超管 有新增 btn
  belongTenantId: null, //上级主体编号 新增门店
  useStoreList: {
    needUseStore: false,
    belongTenantId: '0'
  }, //新增子门店 上级机构需要取 当前父级主体下所有的门店
  needBelongTenantId: true, //是否需要上级主体 门店需要 子门店不需要
  needParentId: false, //是否需要上级机构 门店不需要 子门店需要
  needOrganizationType: true, //是否需要 基本属性 机构类型 分公司/门店 才有
  needStoreSubtyping: false, //是否需要子门店类型 子门店需要
  storeType: organizationType.store, //门店 or 子门店
  parentId: null, //上级机构ID 新增子门店
  record: {}, //表格状态修改时存的整条数据 详细共用(修改)
  currentClickRecord: {}, //主体 选中的 table item
  majSelectedKeys: [], //主体树选中的
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
  loading: false, //表格加载中 主体
  loadingStore: false, //表格加载中 门店
  rawData: [], //表格数据 原始数据 未组树 主要用来过滤 判断父级状态是否开启
  tableDataList: [], //表格数据
  tableDataArr: [], //表格数据 Arr
  tableDataPseudoPaginationList: [], //表格数据 伪分页
  treeIconIndex: 0,

  rawDataStore: [], //表格数据 原始数据 未组树 主要用来过滤 判断父级状态是否开启 门店
  tableDataListStore: [], //表格数据  门店
  tableDataArrStore: [], //表格数据 Arr 门店
  tableDataPseudoPaginationListStore: [], //表格数据 伪分页 门店
  treeIconIndexStore: 0, //门店

  isExpandAll: false, //展开折叠 主体
  isExpandAllStore: false, //展开折叠 门店
  refreshTable: true, //v-if table
  refreshTableStore: true, //v-if table 门店
  isFullScreen: false, //全屏
  isShow: false, //新增编辑modal
  isShowStore: false, //新增编辑 门店
  isShowStoreDetails: false, //详情 门店
  isShowDomainCulture: false, //绑定域名/企业文化
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
  bindingDomainNameValidatorRules: [
    { required: true, message: `绑定域名不能为空` },
    { validator: bindingDomainNameValidator }
  ],
  contactMobileRules: [
    { required: true, message: `负责人电话不能为空` },
    { validator: contactMobileValidator }
  ],
  legalMobileRules: [{ validator: legalMobileValidator }],
  modalDomainCultureType: 'domain', // 绑定域名/企业文化
  modalType: 'add', //add新增edit编辑
  proMunAreaList: [], //省市区数据
  majorIndividualTypeOptions: [], //适用主体类型Options
  brandOptions: [], //品牌
  organizationTypeOptions: [], //机构类型列表
  childStoreOptions: [], //机构类型 子门店类型
  majorIndividualTypeOptionsClone: [], //适用主体类型Options Clone
  formState: {
    majorIndividualType: '', //主体类型
    belongTenantId: null, //上级主体编号
    code: '', //主体编码
    name: '', //主体名称
    abbreviate: '', //主体简称
    systemName: '', //系统名称
    logoUrl: '', //系统logo
    loginLogoUrl: '', //登录页logo
    contactName: '', //负责人
    contactMobile: '', //负责人电话
    effectiveStartEndTime: [], //有效期
    // forever: false, //永久有效
    accountCount: undefined, //可用名额
    bindingDomainName: '', //绑定域名
    bindingDomainNameBefore: 'https://', //绑定域名前缀
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
  selectAllFrontDesk: false, //权限配置 全选 成员端
  selectAll: false, //权限配置 全选 管理端
  isExpandAllTabFrontDesk: false, //权限配置 展开折叠 成员端
  isExpandAllTab: false, //权限配置 展开折叠
  menuTreeListFrontDesk: [], //权限配置 前台列表 树 过滤btn 成员端
  menuTreeList: [], //权限配置 前台列表 树 过滤btn 管理端
  menuTreeArrFrontDesk: [], //权限配置 前台列表 数组 过滤btn 成员端
  menuTreeArr: [], //权限配置 前台列表 数组 过滤btn 管理端
  allMenuTreeArrFrontDesk: [], //权限配置 前台列表 数组 不过滤btn 成员端
  allMenuTreeArr: [], //权限配置 前台列表 数组 不过滤btn 管理端
  fieldNames: { children: 'children', title: 'name', key: 'id' }, //权限配置 前台列表 tree的对应字段替换
  selectedKeysFrontDesk: [], //权限配置 前台列表 设置选中的树节点 成员端
  selectedKeys: [], //权限配置 前台列表 设置选中的树节点 管理端
  checkedKeysFrontDesk: [], //权限配置 前台列表 选中复选框的树节点 成员端
  checkedKeys: [], //权限配置 前台列表 选中复选框的树节点 管理端
  parentCheckedKeys: [], //权限配置 前台列表 所有一级菜单ID 用于 全选全不选
  defaultExpandAllFrontDesk: false, //权限配置 前台列表 默认展开折叠 成员端
  defaultExpandAll: false, //权限配置 前台列表 默认展开折叠 管理端
  isShowTree: false, //权限配置 前台列表 v-if 主要是配合用来 展开折叠的 成员端
  isShowTreeFrontDesk: false, //权限配置 前台列表 v-if 主要是配合用来 展开折叠的 管理端
  idArrFrontDesk: [], //权限配置 创建所需的 id 成员端
  idArr: [], //权限配置 创建所需的 id 管理端
  selectTree: [], //权限配置 选中的树 数据 右侧
  isShowRightTree: false, //权限配置 选中的树 是否显示
  permissionRecord: {}, //权限配置 操作 时 存的整条数据
  PermissionType: 'add', //权限配置 新增 修改
  operationCheckedListFrontDesk: [], //权限配置 当前选中的 菜单 的btn list checkbox 成员端
  operationCheckedList: [], //权限配置 当前选中的 菜单 的btn list checkbox 管理端
  selectAllOperationFrontDesk: false, //权限配置 当前选中的 菜单 的btn  全选 true/false 成员端
  selectAllOperation: false, //权限配置 当前选中的 菜单 的btn  全选 true/false 管理端
  operationCheckedValueFrontDesk: [], //权限配置 当前选中的 菜单 的btn checkbox 的选中值 当前菜单 成员端
  operationCheckedValue: [], //权限配置 当前选中的 菜单 的btn checkbox 的选中值 当前菜单 管理端
  operationCheckedAllValueFrontDesk: [], //权限配置 当前选中的 菜单 的btn checkbox 的选中值 所有菜单 成员端
  operationCheckedAllValue: [], //权限配置 当前选中的 菜单 的btn checkbox 的选中值 所有菜单 管理端
  editPermissionID: undefined, //编辑功能配置时的id
  isShowDetails: false, //详细modal
  detailsInfo: [], //详情内容
  isShowResetPassWord: false, //重置密码提示modal
  domainCultureTitle: '绑定域名', //绑定域名/企业文化 modal title
  resetPasswordTitle: '', //重置密码 modal title
  resetPasswordSuccessInfo: {}, //重置密码成功后
  closable: false, //重置密码 modal 右上角×
  isResetPasswordSuccessMark: false,
  resetModalStyle: {
    width: 488,
    height: 270
  }, //重置密码 modal样式
  isShowCustomColumnModal: false, //是否打开定制列modal
  isShowStoreCustomColumnModal: false, //是否打开定制列modal 门店
  columns: [], //表格 columns
  columnsStore: [], //表格 columns 门店
  optionalMenuList: [], //上级主体 List
  optionalMenuTree: [], //上级主体 treeList
  optionalMenuTreeChange: [], //上级主体 跟主体类型联动
  logoListUrl: [], //系统logo 上传 回显 - -
  logoUrlSuccess: '', //系统logo 新增编辑入参
  loginLogoUrlSuccess: '', //登录页logo 新增编辑入参
  legalPersonListUrl: [], //法人身份证 上传回显
  legalPersonUrlSuccess: '', //法人身份证 新增编辑入参
  businessLicenseListUrl: [], //营业执照 上传回显
  businessLicenseSuccess: '', //营业执照 新增编辑入参
  addEditLoading: false, //新增编辑 modal button 异步loading
  modalBtnLoading: false, //modal  button 异步loading 其实一个就行了 算了 写都写了
  tableStatusChangeInfo: {}, //存当前表格item项以及switch值
  tableStatusModalInfo: {}, //存当前表格item项 modal
  defaultKeys: ['name', 'code', 'majorIndividualType', 'usableAmount', 'statusSwitch', 'operation'], //定制列默认的keys
  changedColumnsObj: {}, //定制列组件接收到的当前列信息
  changedStoreColumnsObj: {}, //定制列组件接收到的当前列信息 门店
  defaultStoreKeys: [
    'name',
    'specialtyCode',
    'staffCount',
    'organizationTypeText',
    'statusSwitch',
    'operation'
  ] //定制列默认的keys
})

// //存放功能配置 选中的所有keys(包括父节点id)
// const checkedKeysBack = ref([])
// const checkedKeysDirIds = ref([])
const checkedKeysDirIds: Ref<(string | number)[]> = ref([])
const checkedKeysDirIdsFrontDesk: Ref<(string | number)[]> = ref([])

// 有效期组件
const effectiveRef = ref()
// 成立日期组件
const establishRef = ref()
// 公司地址
const companyAddressRef = ref()
/** 弹窗滚动事件 */
const handleModalScroll = () => {
  effectiveRef.value?.blur()
  establishRef.value?.blur()
  companyAddressRef.value?.blur()
}

//获取子节点的 父节点id 成员端
const testCheckFrontDesk = (checkedKeys, e) => {
  console.log('checkedKeys', checkedKeys)
  console.log('e', e)
  // //存放功能配置 选中的所有keys(包括父节点id)
  // checkedKeysBack.value = checkedKeys.concat(e.halfCheckedKeys)
  //存放功能配置 父节点id
  checkedKeysDirIdsFrontDesk.value = e.halfCheckedKeys
  console.log('checkedKeys', checkedKeys)
  console.log('checkedKeysDirIds.value', checkedKeysDirIds.value)
  if (e.checked === false) {
    // //  取消勾选 获取取消勾选的子节点项
    // // const currentNodeChildren = state.allMenuTreeArr.filter((item) => item.parentId === e.node.key)
    // const currentNodeChildren = getAllChildIds(e.node.key, state.allMenuTreeArr)
    // // 取消勾选 获取取消勾选的子节点项 id
    // const currentNodeChildrenIds = currentNodeChildren.map((item) => item.id)
    // 取消勾选 获取取消勾选的子节点项 id 递归
    const currentNodeChildrenIds: any = getAllChildIds(e.node.key, state.allMenuTreeArrFrontDesk)
    //清空当前操作权限 btn 选中的值
    // state.operationCheckedValue = []
    console.log('取消勾选的子节点项 idcurrentNodeChildrenIds', currentNodeChildrenIds)
    // console.log('currentNodeChildren ', currentNodeChildren)
    //过滤去除取消勾选的菜单 操作权限 对应的 btn
    state.operationCheckedValueFrontDesk = state.operationCheckedValueFrontDesk.filter(
      (item) => !currentNodeChildrenIds.includes(item)
    )
    //过滤去除取消勾选的菜单 操作权限 对应的 btn All
    state.operationCheckedAllValueFrontDesk = state.operationCheckedAllValueFrontDesk.filter(
      (item) => !currentNodeChildrenIds.includes(item)
    )
  } else {
    //  选中 需要 同步将操作权限对应的btn 显示出来 原本只是选节点 后面改需求了
    //权限btn
    state.operationCheckedListFrontDesk = state.allMenuTreeArrFrontDesk.filter(
      (item) => item.parentId === e.node.id && item.type === 3
    )
    //获取复选框所有的id数组
    const idList = state.operationCheckedListFrontDesk.map((item) => item.id)
    //操作权限 btn 选中回显
    state.operationCheckedValueFrontDesk = state.operationCheckedAllValueFrontDesk.filter((item) =>
      idList.includes(item)
    )
    nextTick(() => {
      state.selectedKeysFrontDesk = [e.node.id]
    })
  }
}

//获取子节点的 父节点id 管理端
const testCheck = (checkedKeys, e) => {
  console.log('checkedKeys', checkedKeys)
  console.log('e', e)
  // //存放功能配置 选中的所有keys(包括父节点id)
  // checkedKeysBack.value = checkedKeys.concat(e.halfCheckedKeys)
  //存放功能配置 父节点id
  checkedKeysDirIds.value = e.halfCheckedKeys
  console.log('checkedKeys', checkedKeys)
  console.log('checkedKeysDirIds.value', checkedKeysDirIds.value)
  if (e.checked === false) {
    // //  取消勾选 获取取消勾选的子节点项
    // // const currentNodeChildren = state.allMenuTreeArr.filter((item) => item.parentId === e.node.key)
    // const currentNodeChildren = getAllChildIds(e.node.key, state.allMenuTreeArr)
    // // 取消勾选 获取取消勾选的子节点项 id
    // const currentNodeChildrenIds = currentNodeChildren.map((item) => item.id)
    // 取消勾选 获取取消勾选的子节点项 id 递归
    const currentNodeChildrenIds: any = getAllChildIds(e.node.key, state.allMenuTreeArr)
    //清空当前操作权限 btn 选中的值
    // state.operationCheckedValue = []
    console.log('取消勾选的子节点项 idcurrentNodeChildrenIds', currentNodeChildrenIds)
    // console.log('currentNodeChildren ', currentNodeChildren)
    //过滤去除取消勾选的菜单 操作权限 对应的 btn
    state.operationCheckedValue = state.operationCheckedValue.filter(
      (item) => !currentNodeChildrenIds.includes(item)
    )
    //过滤去除取消勾选的菜单 操作权限 对应的 btn All
    state.operationCheckedAllValue = state.operationCheckedAllValue.filter(
      (item) => !currentNodeChildrenIds.includes(item)
    )
  } else {
    //  选中 需要 同步将操作权限对应的btn 显示出来 原本只是选节点 后面改需求了
    //权限btn
    state.operationCheckedList = state.allMenuTreeArr.filter(
      (item) => item.parentId === e.node.id && item.type === 3
    )
    //获取复选框所有的id数组
    const idList = state.operationCheckedList.map((item) => item.id)
    //操作权限 btn 选中回显
    state.operationCheckedValue = state.operationCheckedAllValue.filter((item) =>
      idList.includes(item)
    )
    nextTick(() => {
      state.selectedKeys = [e.node.id]
    })
  }
}

//成员端
const treeSelectFrontDesk = (selectedKeys, e) => {
  console.log('selectedKeys', selectedKeys)
  console.log('selectedKeys===>e', e)
  console.log('state.menuTreeArrFrontDesk', state.menuTreeArrFrontDesk)
  //权限btn
  state.operationCheckedListFrontDesk = state.allMenuTreeArrFrontDesk.filter(
    (item) => item.parentId === selectedKeys[0] && item.type === 3
  )
  //获取复选框所有的id数组
  const idList = state.operationCheckedListFrontDesk.map((item) => item.id)
  //操作权限 btn 选中回显
  state.operationCheckedValueFrontDesk = state.operationCheckedAllValueFrontDesk.filter((item) =>
    idList.includes(item)
  )
  console.log('state.operationCheckedListFrontDesk', state.operationCheckedListFrontDesk)
}

//管理端
const treeSelect = (selectedKeys, e) => {
  console.log('selectedKeys', selectedKeys)
  console.log('selectedKeys===>e', e)
  console.log('state.menuTreeArr', state.menuTreeArr)
  //权限btn
  state.operationCheckedList = state.allMenuTreeArr.filter(
    (item) => item.parentId === selectedKeys[0] && item.type === 3
  )
  //获取复选框所有的id数组
  const idList = state.operationCheckedList.map((item) => item.id)
  //操作权限 btn 选中回显
  state.operationCheckedValue = state.operationCheckedAllValue.filter((item) =>
    idList.includes(item)
  )
  console.log('state.operationCheckedList', state.operationCheckedList)
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
    // disabled: true,
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
    width: 50,
    dataIndex: 'operation',
    key: 'operation',
    fixed: 'right',
    ellipsis: true,
    sort: 13
  }
]

//ALL columns 用于定制列过滤 排序 门店
const allStoreColumns = [
  {
    title: '门店名称',
    width: 200,
    dataIndex: 'name',
    key: 'name',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 1
  },
  {
    title: '专营店编码',
    width: 100,
    dataIndex: 'specialtyCode',
    key: 'specialtyCode',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 2
  },
  {
    title: '在职成员',
    width: 100,
    dataIndex: 'staffCount',
    key: 'staffCount',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 2
  },
  {
    title: '机构类型',
    width: 100,
    dataIndex: 'organizationTypeText',
    key: 'organizationTypeText',
    resizable: true,
    ellipsis: true,
    disabled: true,
    sort: 3
  },
  {
    title: '机构ID',
    width: 100,
    dataIndex: 'id',
    key: 'id',
    resizable: true,
    ellipsis: true,
    sort: 2
  },
  {
    title: '机构编码',
    width: 100,
    dataIndex: 'code',
    key: 'code',
    resizable: true,
    ellipsis: true,
    sort: 2
  },
  {
    title: '品牌',
    width: 100,
    dataIndex: 'brandIdsText',
    key: 'brandIdsText',
    resizable: true,
    ellipsis: true,
    sort: 2
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
    width: 50,
    dataIndex: 'operation',
    key: 'operation',
    fixed: 'right',
    ellipsis: true,
    sort: 13
  }
]

/** 查询主体列表
 * @param isRefresh 右侧刷新图标进
 * */
const getList = async (isRefresh = false) => {
  //无查询按钮权限 不请求
  // if (!hasPermission('system:tenant:query')) {
  //   return
  // }
  state.loading = true
  const params = {
    // pageNo: queryParams.current,
    // pageSize: queryParams.pageSize,
    keyword: queryParams.keyword,
    specialtyCode: queryParams.specialtyCode,
    systemName: queryParams.systemName,
    status: queryParams.status,
    type: queryParams.type
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

    res.map((item) => {
      item.statusSwitch = item.status === 0
      item.bindingDomainName = item.domain
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
      // title key 用于 左侧主体 tree 虽然可以加个属性改 组件默认 算了 直接改数据
      item.title = item.name
      item.key = item.id

      const tempType = state.majorIndividualTypeOptions?.filter(
        (typeItem) => (typeItem as Record<string, any>).value === item.type
      )

      item.majorIndividualType = (tempType?.[0] as { label?: string } | undefined)?.label ?? ''

      // item.store = item.type === organizationType.store ? '门店' : ''
      switch (item.type) {
        case organizationType.store:
          item.store = organizationType.storeText
          item.name = `【${item.specialtyCode}】${item.name}`
          break
        case storeSubType.popStore:
          item.store = storeSubType.popStoreText
          item.name = `【${item.specialtyCode}】${item.name}`
          item.childStore = true
          break
        case storeSubType.cityHall:
          item.store = storeSubType.cityHallText
          item.name = `【${item.specialtyCode}】${item.name}`
          item.childStore = true
          break
        default:
          item.store = ''
      }

      if (item.organizationCategory === organizationCategory.childStore) {
        //  子门店 需要 知道父门店的 状态 关闭则禁用 子门店 状态switch
        const parentStoreItem = res.find((childItem) => childItem.id === item.parentId)
        if (parentStoreItem) {
          item.parentStoreStatusSwitch = parentStoreItem.status === 0
        }
      }
    })

    state.tableDataList = res

    // const tempChildStore = res.filter(
    //   (item) => item.type === storeSubType.popStore || item.type === storeSubType.cityHall
    // )
    //
    // const tempList = res.filter(
    //   (item) => item.type !== storeSubType.popStore || item.type !== storeSubType.cityHall
    // )
    // console.log('tempChildStore', tempChildStore)
    // console.log('tempList', tempList)

    // belongTenantId
    state.tableDataList = handleTree(
      state.tableDataList as any[],
      'id',
      'belongTenantId',
      'children'
    )
    state.total = res.total
    console.log('state.tableDataList ', state.tableDataList)
    //伪分页
    onPageChange(PageKeyObj.business)

    if (isRefresh) {
      message.success('刷新成功')
    }
  } finally {
    state.loading = false
  }

  await nextTick(() => {
    state.isShowTree = true
    state.isShowTreeFrontDesk = true
  })
}

/** 查询门店列表  其实可以合在getList 算了 拆开吧
 * @param isRefresh 右侧刷新图标进
 * */
const getListStoreFN = async (isRefresh = false) => {
  state.loadingStore = true
  let tempTenantId: any = null
  if (state.isShowTable) {
    //主体 table
    tempTenantId = state.currentClickRecord.id
  } else {
    //主体 selectTree
    tempTenantId = state.majSelectedKeys.length === 1 ? state.currentClickRecord.id : null
  }

  const params = {
    tenantId: tempTenantId,
    keyword: queryParamsStore.keyword,
    specialtyCode: queryParamsStore.specialtyCode,
    systemName: queryParamsStore.organizationType,
    type: queryParamsStore.brand,
    status: queryParamsStore.status
  }

  switch (state?.currentSelectArea?.level) {
    case 1:
      params['dataProvinceCode'] = state.currentSelectArea.key
      break
    case 2:
      params['dataCityCode'] = state.currentSelectArea.key
      break
    case 3:
      params['dataCountyCode'] = state.currentSelectArea.key
      break
  }

  try {
    const res = await getStoreList(params)
    state.rawDataStore = res
    state.tableDataArrStore = res

    res.map((item) => {
      item.statusSwitch = item.status === 0
      item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
      // item.store = item.type === organizationType.store ? '门店' : ''
      switch (item.organizationCategory) {
        case organizationCategory.store:
          item.store = item.organizationTypeText = organizationType.storeText
          break
        default:
          item.store = ''
      }

      //子门店类型
      switch (item.storeSubtyping) {
        case storeSubType.popStore:
          item.store = item.organizationTypeText = storeSubType.popStoreText
          break
        case storeSubType.cityHall:
          item.store = item.organizationTypeText = storeSubType.cityHallText
          break
      }

      if (item.organizationCategory === organizationCategory.childStore) {
        //  子门店 需要 知道父门店的 状态 关闭则禁用 子门店 状态switch
        const parentStoreItem = res.find((childItem) => childItem.id === item.parentId)
        if (parentStoreItem) {
          item.parentStoreStatusSwitch = parentStoreItem.status === 0
        }
      }
    })

    state.tableDataListStore = res

    state.tableDataListStore = handleTree(
      state.tableDataListStore as any[],
      'id',
      'parentId',
      'children'
    )
    state.total = res.total
    console.log('state.tableDataListStore ', state.tableDataListStore)
    //伪分页
    onPageChange(PageKeyObj.businessStore)

    if (isRefresh) {
      message.success('刷新成功')
    }
  } finally {
    state.loadingStore = false
  }

  await nextTick(() => {
    state.isShowTree = true
    state.isShowTreeFrontDesk = true
  })
}

/** 重置按钮操作 */
const resetQuery = (type = PageKeyObj.business) => {
  switch (type) {
    case PageKeyObj.business:
      //主体
      queryFormRef.value.resetFields()
      getList()
      break
    case PageKeyObj.businessStore:
      //门店
      queryFormStoreRef.value.resetFields()
      getListStoreFN()
      break
  }
}

//一键 展开 折叠 全部
const toggleExpandAll = (isStore) => {
  //由于antdV只提供了初始化时默认展开全部的 API 因此 此处利用v-if 来实现重新初始化
  if (isStore) {
    //  门店
    state.refreshTableStore = false
    state.isExpandAllStore = !state.isExpandAllStore
    nextTick(() => {
      state.refreshTableStore = true
    })
  } else {
    //  主体
    state.refreshTable = false
    state.isExpandAll = !state.isExpandAll
    nextTick(() => {
      state.refreshTable = true
    })
  }
}

//打开 修改上级主体 门店
const openEditParentMajorIndividual = (record) => {
  state.isShowParentMajorIndividual = true
  state.record = record
}

//打开Modal
const openModal = async (record: any = {}, isChildStore = false) => {
  console.log('record', record)
  console.log('isChildStore', isChildStore)
  //新增门店
  if (record.type === 'dealer' && state.modalType === 'add') {
    if (!(Object.keys(record).length === 0)) {
      if (record?.unNeedBelongTenantId) {
        //非空对象判断 新增子项时回显
        state.belongTenantId = null
      } else {
        //非空对象判断 新增子项时回显
        state.belongTenantId = record.id || record.tenantId
      }
      state.storeRecord = record
      state.needBelongTenantId = true
      state.needParentId = false
      state.isShowStore = true
      console.log('新增门店')
    }
    return
  }
  //新增子门店
  if (isChildStore && state.modalType === 'add') {
    console.log('record=======>', record)
    state.storeRecord = record
    state.parentId = record.id
    state.belongTenantId = record.belongTenantId || record.tenantId
    state.needBelongTenantId = false
    state.needParentId = true
    state.needOrganizationType = false
    state.needStoreSubtyping = true
    //这里随便了 只要不是 store 就判定为子门店
    state.storeType = storeSubType.popStore
    state.useStoreList = {
      needUseStore: true,
      belongTenantId: record.belongTenantId || record.tenantId
    }
    state.isShowStore = true
    console.log('新增子门店')
    return
  }
  const res = await getSimpleTenantList()
  state.record = record
  state.optionalMenuList = res

  state.optionalMenuTree = handleTree(res, 'id', 'belongTenantId', 'children')

  console.log('record', record)
  console.log('state.majorIndividualTypeOptions', state.majorIndividualTypeOptions)

  if (record.type === 'manufacturer' && state.modalType === 'add') {
    // 厂家 新增子项 主体类型只能为经销商，上级主体只能为自己
    state.majorIndividualTypeOptionsClone = state.majorIndividualTypeOptions.filter(
      (item) => item.value === 'dealer'
    )
  } else {
    state.majorIndividualTypeOptionsClone = state.majorIndividualTypeOptions
  }

  if (!(Object.keys(record).length === 0)) {
    //非空对象判断 新增子项时回显
    //上级主体
    if (state.formState && !state.formState.majorIndividualType) {
      state.formState.belongTenantId = null
    } else if (state.formState && 'belongTenantId' in record) {
      state.formState.belongTenantId = record.belongTenantId
    }
  } else {
    // state.formState.belongTenantId = state?.optionalMenuTree[0]
    //   ? state?.optionalMenuTree[0]?.id
    //   : null
    //不再取第一项了
    // state.formState.belongTenantId = null
    state.formState!.belongTenantId = null
  }
  state.isShow = true
}

//关闭Modal
const closeModal = () => {
  state.isShow = false
  formRef.value.resetFields()
  //级联选择器 需要单独清空
  state.formState!.companyAddress = []
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
    bindingDomainNameBefore: 'https://', //绑定域名 前缀
    status: true, //状态
    creditCode: '', //统一社会信用代码
    // organizationCode: '', //组织机构代码
    legalRepresentative: '', //法定代表人
    legalMobile: '', //法人联系电话
    legalIdentityUrl: '', //法人身份证
    establishDate: null, //成立日期
    companyAddress: [], //公司地址
    cascadeInfo: [], //选中的省市区全部信息
    detailedAddress: '', //公司地址 详细地址
    businessLicenseUrl: '' //营业执照
  }

  state.record = {}
  state.logoListUrl = [] //系统logo 上传 回显 - -
  state.logoUrlSuccess = '' //系统logo 新增编辑入参
  state.loginLogoUrlSuccess = '' //登录页logo
  state.legalPersonListUrl = [] //法人身份证 上传回显
  state.legalPersonUrlSuccess = '' //法人身份证 新增编辑入参
  state.businessLicenseListUrl = [] //营业执照 上传回显
  state.businessLicenseSuccess = '' //营业执照 新增编辑入参
  delete state.formState?.id
  state.modalTitle = '新增'
  state.modalType = 'add'
  state.selectTree = []
}

//关闭 新增/编辑门店 子门店
const closeStore = (isRefresh = false) => {
  state.isShowStore = false
  state.belongTenantId = null
  state.parentId = null
  state.needBelongTenantId = true
  state.needParentId = false
  state.needOrganizationType = true
  state.needStoreSubtyping = false
  state.storeType = organizationType.store
  state.useStoreList = {
    needUseStore: false,
    belongTenantId: '0'
  } //新增子门店 上级机构需要取 当前父级主体下所有的门店
  state.modalType = 'add'
  state.record = {}
  state.storeRecord = {}
  if (isRefresh) {
    getListStoreFN()
  }
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
  edit(record, false, record.organizationType === organizationType.store)
}

//打开 绑定域名/企业文化
const openDomainCulture = (record, type) => {
  state.modalDomainCultureType = type
  state.domainCultureTitle = type === 'domain' ? '绑定域名' : '企业文化'
  state.record = record
  if (record.domain) {
    //存在域名 回显
    if (record.domain.startsWith('http://')) {
      domainCultureForm!.bindingDomainNameBefore = 'http://'
      domainCultureForm!.bindingDomainName = record.domain.substring(7)
    } else if (record.domain.startsWith('https://')) {
      domainCultureForm!.bindingDomainNameBefore = 'https://'
      domainCultureForm!.bindingDomainName = record.domain.substring(8)
    }
    domainCultureForm.filingNumber = record.filingNumber
    domainCultureForm.securityNumber = record.securityNumber
  }

  if (record.corporateCulture) {
    domainCultureForm.corporateCulture = record.corporateCulture
  }
  state.isShowDomainCulture = true
}

//关闭 绑定域名/企业文化
const closeDomainCultureModal = () => {
  state.record = {}
  domainCultureForm.bindingDomainNameBefore = 'https://' //绑定域名前缀
  domainCultureForm.bindingDomainName = null //绑定域名
  domainCultureForm.filingNumber = null //备案编号
  domainCultureForm.securityNumber = null //公网安备号
  domainCultureForm.corporateCulture = null //经营理念

  state.isShowDomainCulture = false

  getList()
}

//绑定域名/企业文化 ok
const domainCultureOk = async () => {
  // 校验表单
  if (!domainCultureFormRef) return
  await domainCultureFormRef.value.validate()
  state.modalBtnLoading = true
  try {
    switch (state.modalDomainCultureType) {
      case 'domain':
        const params = {
          domain: `${domainCultureForm!.bindingDomainNameBefore}${
            domainCultureForm!.bindingDomainName
          }`, //绑定域名,
          filingNumber: domainCultureForm.filingNumber,
          id: state.record.id,
          securityNumber: domainCultureForm.securityNumber
        }
        await putBindDomain(params)
        message.success('绑定域名成功')
        break
      case 'culture':
        await putCulture({
          corporateCulture: domainCultureForm.corporateCulture,
          id: state.record.id
        })
        message.success('编辑企业文化成功')
        break
    }

    closeDomainCultureModal()
  } finally {
    state.modalBtnLoading = false
  }
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
  currentTabs = 'basicInformation',
  unNeedRecord = false
) => {
  state.modalType = 'edit'
  state.modalTitle = '编辑'
  console.log('修改record', record)
  console.log('isStore', isStore)
  // TODO: 有空重写一下 - - 判断 冗余了  一直叠一直改 没空处理
  if (isStore) {
    if (
      record.type === storeSubType.popStore ||
      record.type === storeSubType.cityHall ||
      record.organizationCategory === organizationCategory.childStore
    ) {
      // 子门店
      state.parentId = record.id
      state.belongTenantId = record.belongTenantId || record.tenantId
      state.needBelongTenantId = false
      state.needParentId = true
      state.needOrganizationType = false
      state.needStoreSubtyping = true
      //这里随便了 只要不是 store 就判定为子门店
      state.storeType = storeSubType.popStore
      state.useStoreList = {
        needUseStore: true,
        belongTenantId: record.belongTenantId || record.tenantId
      }
    } else {
      //门店
      state.needBelongTenantId = true
      state.needParentId = false
    }
    //门店
    state.currentTabs = currentTabs
    state.record = record
    state.storeRecord = record
    state.isShowStore = true

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
    // bindingDomainName: res.domain.substring(8), //绑定域名
    creditCode: res.creditCode, //统一社会信用代码
    // organizationCode: res.organizationCode, //组织机构代码
    legalRepresentative: res.legalRepresentative, //法定代表人
    legalMobile: res.legalMobile, //法人联系电话
    // legalIdentityUrl: res.legalIdentityUrl, //法人身份证
    detailedAddress: res.address //公司地址 详细地址
    // businessLicenseUrl: res.businessLicenseUrl //营业执照
  }
  console.log('state.optionalMenuTree', state.optionalMenuTree)
  console.log('state.formState.belongTenantId', state.formState!.belongTenantId)

  // if (res.domain.startsWith('http://')) {
  //   state.formState!.bindingDomainNameBefore = 'http://'
  //   state.formState!.bindingDomainName = res.domain.substring(7)
  // } else if (res.domain.startsWith('https://')) {
  //   state.formState!.bindingDomainNameBefore = 'https://'
  //   state.formState!.bindingDomainName = res.domain.substring(8)
  // }

  if (res.logoUrl) {
    state.logoListUrl = [
      {
        url: res.logoUrl //系统logo
      }
    ]
    state.logoUrlSuccess = res.logoUrl
  }

  if (res.loginLogoUrl) {
    state.loginLogoUrlSuccess = res.loginLogoUrl
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
    state.formState!.establishDate = dayjs(res.establishDate) //成立日期
  }

  //永久有效 起始时间为当前时间 结束时间为2099-12-31
  // state.formState.forever = res.expireTime === '2099-12-31'

  //状态0 开启 1关闭
  state.formState!.status = res.status === 0

  //省市区
  state.formState!.companyAddress = []
  state.formState!.cascadeInfo = []

  if (res?.provinceCode) {
    state.formState!.companyAddress.push(res?.provinceCode)
    state.formState!.cascadeInfo.push({
      label: res?.province,
      value: res?.provinceCode
    })
  }
  if (res?.cityCode) {
    state.formState!.companyAddress.push(res?.cityCode)
    state.formState!.cascadeInfo.push({
      label: res?.city,
      value: res?.cityCode
    })
  }
  if (res?.countyCode) {
    state.formState!.companyAddress.push(res?.countyCode)
    state.formState!.cascadeInfo.push({
      label: res?.county,
      value: res?.countyCode
    })
  }

  if (unNeedRecord) {
    //催命似的催 没空 直接打个mark 详情内进修改 其实整块都得重新处理一下 - - 之前催得太紧又一会改一下 一会改一下 叠得有点乱 最好是让产品重新罗列一下所有情况 重新整理
    state.record = {}
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

// //处理省市区数据
// // 树结构数据过滤 数组中嵌数组 里面的数组为需要替换的属性名以及替换后的属性名
// let needReplaceKey: any = [
//   ['label', 'fullname'],
//   ['value', 'code']
// ]
// state.proMunAreaList = reconstructedTreeData(provincesMunicipalitiesArea, needReplaceKey)

//新增主体
const addMajorIndividualFN = async () => {
  let params = {
    type: state.formState!.majorIndividualType, //主体类型
    belongTenantId: state.formState!.belongTenantId, //上级主体
    code: state.formState!.code, //主体编码
    name: state.formState!.name, //主体名称
    abbreviate: state.formState!.abbreviate, //主体简称
    systemName: state.formState!.systemName, //系统名称
    logoUrl: state.logoUrlSuccess, //系统logo
    loginLogoUrl: state.loginLogoUrlSuccess, //登录页logo
    contactName: state.formState!.contactName, //负责人
    contactMobile: state.formState!.contactMobile, //负责人电话
    // effectiveStartDate: state.formState!.effectiveStartEndTime[0]?.format('YYYY-MM-DD'), //有效期 开始时间
    effectiveStartDate: state.formState?.effectiveStartEndTime?.[0]?.format('YYYY-MM-DD') ?? null,
    expireTime: state.formState?.effectiveStartEndTime?.[1]?.format('YYYY-MM-DD') ?? null, //有效期 结束时间
    // effectiveStartDate: state.formState.effectiveStartEndTime[0]?.format('YYYY/MM/DD'), //有效期 开始时间
    // expireTime: state.formState.effectiveStartEndTime[1]?.format('YYYY/MM/DD'), //有效期 结束时间
    accountCount: state.formState!.accountCount, //可用名额
    // domain: `${state.formState!.bindingDomainNameBefore}${state.formState!.bindingDomainName}`, //绑定域名
    creditCode: state.formState!.creditCode, //统一社会信用代码
    // organizationCode: state.formState.organizationCode, //组织机构代码
    legalRepresentative: state.formState!.legalRepresentative, //法定代表人
    legalMobile: state.formState!.legalMobile, //法人联系电话
    legalIdentityUrl: state.legalPersonUrlSuccess, //法人身份证
    address: state.formState!.detailedAddress, //公司地址 详细地址
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
  if (state.modalType === 'add') {
    //新增默认 传开启
    params['status'] = 0
  } else {
    //状态0 开启 1关闭
    //修改 原路返回
    if (state.formState!.status) {
      params['status'] = 0
    } else {
      params['status'] = 1
    }
  }

  //省市区
  if (state.formState?.cascadeInfo?.[0]) {
    params['province'] = state.formState.cascadeInfo[0].label
    params['provinceCode'] = state.formState.cascadeInfo[0].value
  }
  if (state.formState?.cascadeInfo?.[1]) {
    params['city'] = state.formState.cascadeInfo[1].label
    params['cityCode'] = state.formState.cascadeInfo[1].value
  }
  if (state.formState?.cascadeInfo?.[2]) {
    params['county'] = state.formState.cascadeInfo[2].label
    params['countyCode'] = state.formState.cascadeInfo[2].value
  }

  if (state.formState?.establishDate) {
    params['establishDate'] = state.formState.establishDate?.format('YYYY-MM-DD') //成立日期
    // establishDate: state.formState.establishDate.format('YYYY/MM/DD'), //成立日期
  }

  //必填项 是否为空 判断的 array
  const paramsList = [
    {
      key: 'type',
      name: '主体类型'
    },
    {
      key: 'code',
      name: '主体编码'
    },
    {
      key: 'name',
      name: '主体名称'
    },
    {
      key: 'abbreviate',
      name: '主体简称'
    },
    {
      key: 'contactName',
      name: '负责人'
    },
    {
      key: 'contactMobile',
      name: '负责人电话'
    },
    {
      key: 'address',
      name: '公司地址'
    },
    {
      key: 'systemName',
      name: '系统名称'
    },
    {
      key: 'expireTime',
      name: '有效期'
    },
    {
      key: 'accountCount',
      name: '可用名额'
    }
  ]
  //message提示
  validateParams(params, paramsList)

  // 校验表单
  if (!formRef) return
  await formRef.value.validate()
  state.addEditLoading = true

  try {
    let res = ''
    if (state.modalType === 'add') {
      res = await addMajorIndividual(params)
      state.addSuccessId = res
      // message.success('新增成功')
      message.success('主体已建立成功！主体用户名和密码已发送到负责人手机号中，请注意查收！')
      //配置权限
      openPermissionModal(state.addSuccessId)
    } else {
      //前置校验改为后置
      // if (
      //   dayjs().isBetween(
      //     state.formState.effectiveStartEndTime[0],
      //     state.formState.effectiveStartEndTime[1],
      //     'day',
      //     []
      //   ) &&
      //   state.permissionRecord.statusSwitch === false
      // ) {
      //   state.dateTime = {
      //     startTime: state.formState.effectiveStartEndTime[0].format('YYYY-MM-DD'),
      //     endTime: state.formState.effectiveStartEndTime[1].format('YYYY-MM-DD')
      //   }
      //   openDateModal()
      //   closeModal()
      //   return
      // }

      params['id'] = state.formState!.id
      res = await updateEditMajorIndividual(params)
      message.success('修改成功')

      if (
        dayjs().isBetween(
          state.formState!.effectiveStartEndTime?.[0],
          state.formState!.effectiveStartEndTime?.[1],
          'day',
          []
        ) &&
        state.permissionRecord!.statusSwitch === false
      ) {
        state.dateTime = {
          startTime: state.formState!.effectiveStartEndTime?.[0].format('YYYY-MM-DD'),
          endTime: state.formState!.effectiveStartEndTime?.[1].format('YYYY-MM-DD')
        }
        openDateModal()
      }
    }

    closeModal()
    await getList()
  } finally {
    state.addEditLoading = false
  }
}

//级联选择器选中的内容 改变
const cascadeChange = (value, selectedOptions) => {
  state.formState!.cascadeInfo = selectedOptions
}

//关闭功能配置 modal
const closePermissionModal = () => {
  state.record = {}
  state.isShowPermission = false
  state.PermissionType = 'add'
  state.addSuccessId = undefined
  state.selectTree = []
  state.idArr = []
  state.idArrFrontDesk = []
  state.checkedKeys = []
  state.checkedKeysFrontDesk = []
  state.selectAll = false
  state.selectAllFrontDesk = false
  state.isExpandAllTab = false
  state.isExpandAllTabFrontDesk = false
  state.isShowTree = false
  state.isShowTreeFrontDesk = false
  state.selectedKeys = []
  state.selectedKeysFrontDesk = []
  state.operationCheckedList = [] //权限配置 当前选中的 菜单 的btn list checkbox 管理端
  state.operationCheckedListFrontDesk = [] //权限配置 当前选中的 菜单 的btn list checkbox 成员端
  state.selectAllOperation = false //权限配置 当前选中的 菜单 的btn  全选 true/false 管理端
  state.selectAllOperationFrontDesk = false //权限配置 当前选中的 菜单 的btn  全选 true/false 成员端
  state.operationCheckedValue = [] //权限配置 当前选中的 菜单 的btn checkbox 的选中值 当前菜单 管理端
  state.operationCheckedValueFrontDesk = [] //权限配置 当前选中的 菜单 的btn checkbox 的选中值 当前菜单 成员端
  state.operationCheckedAllValueFrontDesk = [] //权限配置 当前选中的 菜单 的btn checkbox 的选中值 所有菜单 成员端
  state.operationCheckedAllValue = [] //权限配置 当前选中的 菜单 的btn checkbox 的选中值 所有菜单 管理端
  state.activeKey = 'backstage'
}

//开启功能配置 modal
const openPermissionModal = async (id) => {
  //获取菜单列表
  const { managementEnd = [], memberSide = [] } = await MenuApi.getMajorIndividualSimpleMenusList({
    id
  })
  state.allMenuTreeArr = managementEnd
  state.allMenuTreeArrFrontDesk = memberSide

  //不要展示按钮 默认按钮全选 后端处理 成员端
  state.menuTreeArr = managementEnd.filter((item) => item.type !== 3)
  //不要展示按钮 默认按钮全选 后端处理 管理端
  state.menuTreeArrFrontDesk = memberSide.filter((item) => item.type !== 3)

  state.menuTreeList = handleTree(cloneDeep(state.menuTreeArr))
  state.menuTreeListFrontDesk = handleTree(cloneDeep(state.menuTreeArrFrontDesk))

  state.isShowPermission = true
}

//判断菜单是否存在选中 但是操作权限btn一个都没选 成员端
const hasSelectBtnFrontDesk = async () => {
  const tempIem: any = {
    isIncludes: true
  }
  //当前选中的菜单
  await state.checkedKeysFrontDesk.some((menuId) => {
    //当前菜单项所有的btn
    const tempBtnArr = state.allMenuTreeArrFrontDesk.filter(
      (item) => item.parentId === menuId && item.type === 3
    )
    //当前菜单所有的btn id
    const idList = tempBtnArr.map((obj) => obj.id)
    //判断当前菜单项 是否有选中的 至少一项 btn
    const isIncludes = state.operationCheckedAllValueFrontDesk.some((value) =>
      idList.includes(value)
    )
    if (!isIncludes && idList.length > 0) {
      //idList.length 没有配btn选项的 放行
      tempIem.isIncludes = false
      const currentMenu: any = state.allMenuTreeArrFrontDesk.find((item) => item.id === menuId)
      tempIem.currentMenu = currentMenu.name
      //当有一项不满足条件时 跳出整个循环
      return true
    }
  })
  return tempIem
}

//判断菜单是否存在选中 但是操作权限btn一个都没选 管理端
const hasSelectBtn = async () => {
  const tempIem: any = {
    isIncludes: true
  }
  //当前选中的菜单
  await state.checkedKeys.some((menuId) => {
    //当前菜单项所有的btn
    const tempBtnArr = state.allMenuTreeArr.filter(
      (item) => item.parentId === menuId && item.type === 3
    )
    //当前菜单所有的btn id
    const idList = tempBtnArr.map((obj) => obj.id)
    //判断当前菜单项 是否有选中的 至少一项 btn
    const isIncludes = state.operationCheckedAllValue.some((value) => idList.includes(value))
    if (!isIncludes && idList.length > 0) {
      //idList.length 没有配btn选项的 放行
      tempIem.isIncludes = false
      const currentMenu: any = state.allMenuTreeArr.find((item) => item.id === menuId)
      tempIem.currentMenu = currentMenu.name
      //当有一项不满足条件时 跳出整个循环
      return true
    }
  })
  return tempIem
}

//配置菜单 Modal 确认
const PermissionOk = async () => {
  const hasSelectBtnItem: any = await hasSelectBtn()
  const hasSelectBtnItemFrontDesk: any = await hasSelectBtnFrontDesk()

  if (!hasSelectBtnItem.isIncludes) {
    message.warning(`${hasSelectBtnItem.currentMenu} 菜单未选择操作权限`)
    return
  }

  if (!hasSelectBtnItemFrontDesk.isIncludes) {
    message.warning(`${hasSelectBtnItemFrontDesk.currentMenu} 菜单未选择操作权限`)
    return
  }
  const params = {
    menuIds: state.idArr,
    memberMenuIds: state.idArrFrontDesk,
    clientMenuIds: [],
    tenantId: state.addSuccessId || state.permissionRecord!.id, //主体id,新增权限模板从新增主体的res里取，修改时取当前列
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

const assignPermission = async (record) => {
  console.log('record)', record)
  state.permissionRecord = record
  state.PermissionType = 'edit'
  //TODO 有空改一下 - - 这里不大合适 需求一直改 这里改了好多次 - -
  await openPermissionModal(record.id)
  if (record.packageId != null) {
    const res = await getTenantPackage({ id: record.packageId })
    //... res 可能为null
    const {
      menuIds = [],
      dirIds = [],
      buttonIds = [],
      id,
      memberMenuIds = [],
      memberDirIds = [],
      memberButtonIds = []
    } = res || []
    state.editPermissionID = id
    state.checkedKeysFrontDesk = memberMenuIds
    state.checkedKeys = menuIds
    state.operationCheckedAllValueFrontDesk = memberButtonIds
    state.operationCheckedAllValue = buttonIds
    console.log('state.menuTreeList', state.menuTreeList)
    console.log('dirIds', dirIds)
    console.log('menuIds', menuIds)
    // nextTick(() => {
    //   state.selectTree = filterTree(state.menuTreeList, [...dirIds, ...menuIds])
    // })
    checkedKeysDirIdsFrontDesk.value = [...memberDirIds]
    checkedKeysDirIds.value = [...dirIds]
    console.log('state.selectTree', state.selectTree)
  } else {
    state.selectTree = []
    checkedKeysDirIds.value = []
    checkedKeysDirIdsFrontDesk.value = []
  }
  //右侧展开显示 左侧选中的数据
  state.isShowRightTree = false
  nextTick(() => {
    state.isShowRightTree = true
    state.isShowTree = true
    state.isShowTreeFrontDesk = true
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
    //直接调 没空加判断 TODO 后续最好是补一下
    getListStoreFN()
  }
}

//表格状态开关
const setTableStatusChangeInfo = async (value, record) => {
  state.tableStatusChangeInfo = {
    value,
    record
  }
  console.log('record)', record)

  if (value) {
    state.tableStatusChangeInfo['statusBtnText'] = '确认开启'
    state.tableStatusChangeInfo['statusTopText'] = `开启后`
    state.tableStatusChangeInfo['statusText'] = `开启`
    state.tableStatusChangeInfo['tempTreeNum'] = toTreeCount(record?.children)
    state.tableStatusChangeInfo['type'] =
      (record?.type || record?.organizationType) === organizationType.store ? '机构' : '主体'
  } else {
    state.tableStatusChangeInfo['statusBtnText'] = '确认关闭'
    state.tableStatusChangeInfo['statusTopText'] = `关闭后`
    state.tableStatusChangeInfo['statusText'] = `关闭`
    state.tableStatusChangeInfo['tempTreeNum'] = toTreeCount(record?.children)
    state.tableStatusChangeInfo['type'] =
      (record?.type || record?.organizationType) === organizationType.store ? '机构' : '主体'
  }

  console.log('record', record)
  console.log('state.tableStatusChangeInfo', state.tableStatusChangeInfo)
  if (
    record.organizationCategory === organizationCategory.store ||
    record.organizationCategory === organizationCategory.childStore
  ) {
    // 门店  子门店
    state.tableStatusChangeInfo['tempTreeNum'] = await getChildStoreNum({
      id: record.id,
      tenantId: record.belongTenantId || record.tenantId
    })
    console.log('state.tableStatusChangeInfo.tempTreeNum', state.tableStatusChangeInfo.tempTreeNum)
  }

  //主体都不需要 子机构数量提示 主体的状态开启 关闭 提示语 全部去掉 当门店状态为关闭时 子门店状态不可操作  null为主体   store: '1', //门店 childStore: '2' //子门店
  state.tableStatusChangeInfo['needChildNum'] = record.organizationCategory !== null

  //TODO 这里还得改 子门店的得单独判断
  //过滤得到父级项
  // const parentItem = state.rawData.filter((item) => item.id === record.belongTenantId)
  const parentItem: any[] =
    state.rawData?.filter((item) => (item as Record<string, any>).id === record.belongTenantId) ||
    []
  if (parentItem!.length > 0 && parentItem?.[0]?.status === 1) {
    record.statusSwitch = !record.statusSwitch
    return message.warning('请先开启父级状态')
  }

  openStatusModal()
}
//表格状态开关
const tableStatusChange = async (value, record) => {
  console.log('record', record)
  const tempText =
    (record.type || record.organizationType) === organizationType.store ? '门店' : '主体公司'
  if (value) {
    state.messageBtnText = '确认开启'
    state.messageText = `为了保护您的${tempText}业务数据安全，请通过安全验证：`
  } else {
    state.messageBtnText = '确认关闭'
    state.messageText = `因您的${tempText}还存在业务数据，如关闭则严重影响到业务，为了保护您的${tempText}业务数据安全，请通过安全验证：`
  }

  if (
    record.type === organizationType.store ||
    record.type === storeSubType.popStore ||
    record.type === storeSubType.cityHall ||
    record.organizationType === organizationType.store
  ) {
    console.log('9999999999999999')
    //门店 获取 顶层主体手机号  子门店
    state.messageContactMobile = await getTopPhone({ id: record.belongTenantId || record.tenantId })
  } else {
    state.messageContactMobile = record.contactMobile
  }

  state.record = record
  state.isShowMessage = true
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
      `验证码已发送至${state.messageContactMobile!.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2')}`
    )
  }
  state.canSendCode = false
  let codeIn = setInterval(() => {
    ;(state.codeCountdown as number) -= 1
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
  //直接调 没空加判断 TODO 后续最好是补一下
  getListStoreFN()
}
//短信 modal 确认
const statusOk = async () => {
  if (!state.messageCode) {
    message.warning('请输入短信验证码')
    return
  }
  try {
    if (
      state.record?.type === organizationType.store ||
      state.record?.type === storeSubType.popStore ||
      state.record?.type === storeSubType.cityHall ||
      state.record?.organizationType === organizationType.store
    ) {
      //门店 TODO 短信
      // await updateOrganizationStatus({
      //   id: state.record.id,
      //   status: state.record.statusSwitch === true ? 0 : 1
      // })
      const params = {
        tenantId: state.record!.belongTenantId || state.record!.tenantId, //上级主体
        id: state.record!.id,
        status: state.record!.statusSwitch === true ? 0 : 1
      }
      await updateStoreStatus(params)
      // await updateOrganizationStoreStatus({
      //   tenantId: state.record!.belongTenantId, //上级主体
      //   id: state.record!.id,
      //   status: state.record!.statusSwitch === true ? 0 : 1
      // })
    } else {
      //主体
      const params = {
        id: state.record!.id,
        code: state.messageCode,
        status: state.record!.statusSwitch === true ? 0 : 1
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
  state.permissionRecord!.statusSwitch = true
  tableStatusChange(true, state.permissionRecord)
  closeDateModal()
}

//配置菜单 前台 全选全不选 成员端
const selectAllFrontDesk = ({ target }) => {
  if (target.checked) {
    //全选
    // state.checkedKeys = state.parentCheckedKeys
    state.checkedKeysFrontDesk = getAllIds(state.menuTreeListFrontDesk)
  } else {
    //全不选
    state.checkedKeysFrontDesk = []
    checkedKeysDirIdsFrontDesk.value = []
    state.operationCheckedValueFrontDesk = []
    state.operationCheckedAllValueFrontDesk = []
  }
}

//配置菜单 前台 全选全不选 管理端
const selectAll = ({ target }) => {
  if (target.checked) {
    //全选
    // state.checkedKeys = state.parentCheckedKeys
    state.checkedKeys = getAllIds(state.menuTreeList)
  } else {
    //全不选
    state.checkedKeys = []
    checkedKeysDirIds.value = []
    state.operationCheckedValue = []
    state.operationCheckedAllValue = []
  }
}

//配置菜单 操作权限 btn 全选全不选 成员端
const selectAllOperationFrontDesk = ({ target }) => {
  if (target.checked) {
    //全选
    // state.checkedKeys = state.parentCheckedKeys
    state.operationCheckedValueFrontDesk = getAllIds(state.operationCheckedListFrontDesk)
    console.log('state.operationCheckedValueFrontDesk', state.operationCheckedValueFrontDesk)
    console.log('state.allMenuTreeArr!!!', state.allMenuTreeArr)
    //当前选中的 btn 第一项
    const currentItem =
      state.operationCheckedValueFrontDesk.length > 0 &&
      state.allMenuTreeArrFrontDesk.find(
        (item) => item.id === state.operationCheckedValueFrontDesk[0]
      )
    console.log('currentItem!!!', currentItem)

    //通过当前选中的 btn第一项获取 父级 项
    const parentItem =
      state.operationCheckedValueFrontDesk.length > 0 &&
      state.allMenuTreeArrFrontDesk.find((item) => item.id === currentItem.parentId)
    if (!state.checkedKeysFrontDesk.includes(parentItem.id)) {
      //选中了操作权限 btn 但是 左侧 菜单没有勾选 则勾选
      state.checkedKeysFrontDesk.push(parentItem.id)
      //  递归将上层父节点id 存入
      const tempIds = findParentIds(
        state.operationCheckedValueFrontDesk[0],
        state.allMenuTreeArrFrontDesk
      )
      //将所需的菜单id存入 直接去重
      checkedKeysDirIdsFrontDesk.value = [
        ...new Set(checkedKeysDirIdsFrontDesk.value.concat(tempIds))
      ]
      console.log('所有父级id', tempIds)
      console.log('checkedKeysDirIds.value', checkedKeysDirIds.value)
    }
  } else {
    //全不选
    state.operationCheckedValueFrontDesk = []
    // checkedKeysDirIds.value = []
  }
}

//配置菜单 操作权限 btn 全选全不选 管理端
const selectAllOperation = ({ target }) => {
  if (target.checked) {
    //全选
    // state.checkedKeys = state.parentCheckedKeys
    state.operationCheckedValue = getAllIds(state.operationCheckedList)
    console.log('state.operationCheckedValue', state.operationCheckedValue)
    console.log('state.allMenuTreeArr!!!', state.allMenuTreeArr)
    //当前选中的 btn 第一项
    const currentItem =
      state.operationCheckedValue.length > 0 &&
      state.allMenuTreeArr.find((item) => item.id === state.operationCheckedValue[0])
    console.log('currentItem!!!', currentItem)

    //通过当前选中的 btn第一项获取 父级 项
    const parentItem =
      state.operationCheckedValue.length > 0 &&
      state.allMenuTreeArr.find((item) => item.id === currentItem.parentId)
    if (!state.checkedKeys.includes(parentItem.id)) {
      //选中了操作权限 btn 但是 左侧 菜单没有勾选 则勾选
      state.checkedKeys.push(parentItem.id)
      //  递归将上层父节点id 存入
      const tempIds = findParentIds(state.operationCheckedValue[0], state.allMenuTreeArr)
      //将所需的菜单id存入 直接去重
      checkedKeysDirIds.value = [...new Set(checkedKeysDirIds.value.concat(tempIds))]
      console.log('所有父级id', tempIds)
      console.log('checkedKeysDirIds.value', checkedKeysDirIds.value)
    }
  } else {
    //全不选
    state.operationCheckedValue = []
    // checkedKeysDirIds.value = []
  }
}

//配置菜单 操作权限 btn change 成员端
const operationCheckedValueChangeFrontDesk = (checkedValue) => {
  console.log('checkedValue', checkedValue)
  if (checkedValue.length === 0) {
    return
  }
  //  左侧 菜单 没有勾选则 勾选上
  //当前选中的 btn 第一项
  const currentItem =
    checkedValue.length > 0 &&
    state.allMenuTreeArrFrontDesk.find((item) => item.id === checkedValue[0])
  //通过当前选中的 btn第一项获取 父级 项
  const parentItem =
    checkedValue.length > 0 &&
    state.allMenuTreeArrFrontDesk.find((item) => item.id === currentItem.parentId)
  if (!state.checkedKeysFrontDesk.includes(parentItem.id)) {
    //选中了操作权限 btn 但是 左侧 菜单没有勾选 则勾选
    state.checkedKeysFrontDesk.push(parentItem.id)
    //  递归将上层父节点id 存入
    const tempIds = findParentIds(checkedValue[0], state.allMenuTreeArrFrontDesk)
    //将所需的菜单id存入 直接去重
    checkedKeysDirIdsFrontDesk.value = [...new Set(checkedKeysDirIds.value.concat(tempIds))]
  }
}

//配置菜单 操作权限 btn change 管理端
const operationCheckedValueChange = (checkedValue) => {
  console.log('checkedValue', checkedValue)
  if (checkedValue.length === 0) {
    return
  }
  //  左侧 菜单 没有勾选则 勾选上
  //当前选中的 btn 第一项
  const currentItem =
    checkedValue.length > 0 && state.allMenuTreeArr.find((item) => item.id === checkedValue[0])
  //通过当前选中的 btn第一项获取 父级 项
  const parentItem =
    checkedValue.length > 0 && state.allMenuTreeArr.find((item) => item.id === currentItem.parentId)
  if (!state.checkedKeys.includes(parentItem.id)) {
    //选中了操作权限 btn 但是 左侧 菜单没有勾选 则勾选
    state.checkedKeys.push(parentItem.id)
    //  递归将上层父节点id 存入
    const tempIds = findParentIds(checkedValue[0], state.allMenuTreeArr)
    //将所需的菜单id存入 直接去重
    checkedKeysDirIds.value = [...new Set(checkedKeysDirIds.value.concat(tempIds))]
  }
}

//成员端
const operationCheckedChangeFrontDesk = (e) => {
  console.log('e', e)
  console.log('e.target.value', e.target.value)
  const dom = document.querySelector(`.right-tree-item-front-desk${e.target.value}`)
  dom && dom.scrollIntoView({ behavior: 'smooth' })
  console.log('dom !!!!!!!!!', dom)
  setTimeout(() => {
    const dom = document.querySelector(`.right-tree-item-front-desk${e.target.value}`)
    dom && dom.scrollIntoView({ behavior: 'smooth' })
    console.log('dom !!!!!!!!!', dom)
  }, 0)
}

//管理端
const operationCheckedChange = (e) => {
  console.log('e', e)
  console.log('e.target.value', e.target.value)
  const dom = document.querySelector(`.right-tree-item-${e.target.value}`)
  dom && dom.scrollIntoView({ behavior: 'smooth' })
  console.log('dom !!!!!!!!!', dom)
  setTimeout(() => {
    const dom = document.querySelector(`.right-tree-item-${e.target.value}`)
    dom && dom.scrollIntoView({ behavior: 'smooth' })
    console.log('dom !!!!!!!!!', dom)
  }, 0)
}

//配置菜单 前台 展开折叠 成员端
const expandAllFNFrontDesk = ({ target }) => {
  if (target.checked) {
    state.isShowTreeFrontDesk = false
    state.defaultExpandAllFrontDesk = true
    nextTick(() => {
      state.isShowTreeFrontDesk = true
    })
  } else {
    state.isShowTreeFrontDesk = false
    state.defaultExpandAllFrontDesk = false
    nextTick(() => {
      state.isShowTreeFrontDesk = true
    })
  }
}

//配置菜单 前台 展开折叠 管理端
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

// // 定义childArr存放所有子节点
// const childArr = ref([])
// // 遍历获取所有子节点
// function getChildArr(data) {
//   data.forEach((res) => {
//     if (res.children && res.children.length > 0) {
//       getChildArr(res.children)
//     } else {
//       childArr.value.push(res.id)
//     }
//   })
//   return childArr.value
// }

//详情(打开)
const detailsInfo = async (record) => {
  if (record?.organizationCategory === organizationCategory.store) {
    //门店
    state.record = record
    state.isShowStoreDetails = true
    return
  }
  if (record?.organizationCategory === organizationCategory.childStore) {
    //子门店
    state.record = record
    state.isShowStoreDetails = true
    return
  }
  // state.record = record
  //获取主体详情
  const res = await getMajorIndividualDetails({ id: record.id })
  //不要展示按钮 默认按钮全选 ... type===3 btn又说要了 去除过滤 res.menus?.filter((item) => item.type !== 3)
  const tempFrontDeskArr = res.memberMenus
  const tempBackstageArr = res.menus

  state.record = res

  let companyAddress = ''
  if (res?.province) {
    companyAddress = res?.province + res?.city + res?.county + res?.address
  }

  const tempRes = await getSimpleTenantList()
  const tempItem = tempRes.filter((item) => item.id === record.belongTenantId)
  console.log('tempRes', tempRes)
  console.log('tempItem', tempItem)

  const tempType = state.majorIndividualTypeOptions!.filter((item) => item?.value === res.type)

  state.detailsInfo = [
    {
      baseTitle: '基本信息',
      infoArr: [
        {
          textSpan: '上级主体：',
          text: tempItem.length === 0 ? '顶层主体' : tempItem[0]?.name
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
          textSpan: '负责人：',
          text: res.contactName
        },
        {
          textSpan: '负责人电话：',
          text: res.contactMobile
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
      baseTitle: '系统信息',
      infoArr: [
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
          textSpan: '登录页logo：',
          text: '暂无上传图片',
          imgUrl: res.loginLogoUrl
        },
        {
          textSpan: '有效期：',
          text:
            res.expireTime === '2099-12-31'
              ? '永久有效'
              : `${res.effectiveStartDate}-${res.expireTime}`
        },
        {
          textSpan: '可用名额：',
          text: res?.accountCount
        }
      ]
    },
    {
      baseTitle: '绑定域名',
      infoArr: [
        {
          textSpan: '绑定域名：',
          text: res?.domain
        },
        {
          textSpan: '备案编号：',
          text: res?.filingNumber
        },
        {
          textSpan: '公网安备号：',
          text: res?.securityNumber
        }
      ]
    },
    {
      baseTitle: '企业文化',
      infoArr: [
        {
          textSpan: '经营理念：',
          text: res?.corporateCulture
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
      frontDeskTreeArr: handleTree(tempFrontDeskArr),
      backstageTreeArr: handleTree(tempBackstageArr)
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
  state.resetPasswordSuccessInfo = await putResetPassWord({ id: state.record!.contactUserId })
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
    // let isTrue = false
    filereader.onload = (e: any) => {
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

//页码改变  伪分页
const onPageChange = (type = PageKeyObj.business) => {
  console.log('type===>', type)
  switch (type) {
    case PageKeyObj.business:
      // 计算要显示的数据的起始索引和结束索引
      const startIndex = (state.pageNo - 1) * state.pageSize
      const endIndex = startIndex + state.pageSize

      // 根据起始索引和结束索引提取要显示的数据
      state.tableDataPseudoPaginationList = state.tableDataList.slice(startIndex, endIndex)
      break
    case PageKeyObj.businessStore:
      // 计算要显示的数据的起始索引和结束索引
      const startIndexStore = (state.pageNoStore - 1) * state.pageSizeStore
      const endIndexStore = startIndexStore + state.pageSizeStore

      // 根据起始索引和结束索引提取要显示的数据
      state.tableDataPseudoPaginationListStore = state.tableDataListStore.slice(
        startIndexStore,
        endIndexStore
      )
      break
  }
}

//数据字典
const getAllType = async () => {
  //获取数据字典
  const dictRes = await getOrganizationTypeList()

  //适用主体类型
  state.majorIndividualTypeOptions = dictRes.filter((item) => item.dictType === 'tenant_type')
  //适用主体类型
  state.majorIndividualTypeOptionsClone = dictRes.filter((item) => item.dictType === 'tenant_type')
  //品牌
  state.brandOptions = dictRes.filter((item) => item.dictType === 'brand')
  //机构类型
  state.organizationTypeOptions = dictRes.filter(
    (item) => item.dictType === 'organization_type' && item.value === organizationType.store
  )
  //子门店类型
  state.childStoreOptions = dictRes.filter((item) => item.dictType === 'store_subtyping')
}

// 新增、修改 主体类型
const majorIndividualTypeChange = async () => {
  //TODO 这块有空得让产品重新 罗列 重新写 改来改去的 openModal()
  const res = await getSimpleTenantList()
  state.optionalMenuList = res

  //  超管
  if (state.formState.majorIndividualType === 'manufacturer') {
    //  厂家
    //  厂家 - -只有顶层
    state.optionalMenuTreeChange = state.optionalMenuList.filter((item) => item.id === 0)
  } else {
    //  经销商 - -顶层 跟厂家
    state.optionalMenuTreeChange = state.optionalMenuList.filter(
      (item) => item.id === 0 || item.type === 'manufacturer'
    )
  }
  console.log('state.record!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', state.record)
  console.log('state.record.type?????????????', state.record.type)
  console.log('state.record.type === manufacturer!!!', state.record.type === 'manufacturer')
  if (state.record.type === 'manufacturer') {
    // 厂家 新增子项 主体类型只能为经销商，上级主体只能为自己
    state.optionalMenuTreeChange = state.optionalMenuList.filter(
      (item) => item.id === state.record.id
    )
    state.formState.belongTenantId = state.record.id
  }
  console.log('state.optionalMenuTreeChange1111', state.optionalMenuTreeChange)
  state.optionalMenuTreeChange = handleTree(
    state.optionalMenuTreeChange,
    'id',
    'belongTenantId',
    'children'
  )

  console.log('state.optionalMenuTreeChange2222', state.optionalMenuTreeChange)
  state.formState.belongTenantId = state.optionalMenuTreeChange[0]?.id
  console.log('state.formState.belongTenantId', state.formState.belongTenantId)
}

//接收 定制列modal事件  - -关闭modal也一起吧 - -
const changeColumn = ({ columnsObj, isCloseModal = false, pageKey }) => {
  console.log(' pageKey', pageKey)
  switch (pageKey) {
    case PageKeyObj.business:
      if (isCloseModal) {
        state.isShowCustomColumnModal = false
        return
      }
      //主体
      state.columns = cloneDeep(columnsObj.currentColumns)
      state.changedColumnsObj = cloneDeep(columnsObj)
      state.refreshTable = false
      state.refreshTable = true
      state.isShowCustomColumnModal = false
      break
    case PageKeyObj.businessStore:
      if (isCloseModal) {
        state.isShowStoreCustomColumnModal = false
        return
      }
      console.log('门店columnsObj', columnsObj)
      //门店
      state.columnsStore = cloneDeep(columnsObj.currentColumns)
      state.changedStoreColumnsObj = cloneDeep(columnsObj)
      state.refreshTableStore = false
      state.refreshTableStore = true
      state.isShowStoreCustomColumnModal = false
      break
  }
}

//初始化 获取默认的 columns
allColumns.map((item, index) => {
  item.sort = index + 1
})
state.columns = getColumns(state, PageKeyObj.business, allColumns, state.defaultKeys)
//初始化 获取默认的 columns
allStoreColumns.map((item, index) => {
  item.sort = index + 1
})
state.columnsStore = getColumns(
  state,
  PageKeyObj.businessStore,
  allStoreColumns,
  state.defaultStoreKeys,
  'changedStoreColumnsObj'
)

//主体状态权限
state.majorIndividualHasPermission = hasPermission('system:tenant:update-status')
//门店状态权限
state.storeHasPermission = hasPermission('system:tenant:update-store-status')
//子门店状态权限
state.childStoreHasPermission = hasPermission('system:tenant:update-child-store-status')

//当前选中的主体改变
const currentSelectChange = async () => {
  const res = await getAreaList({
    tenantId: state.currentClickRecord.id
  })
  await res.some((item) => {
    item.title = item.name
    item.key = item.code
  })
  state.areaList = res
  state.areaListOptions = handleTree(res as any[], 'code', 'parentCode', 'children')
  console.log('res????????????', res)
  console.log('state.treeData', state.treeData)
  console.log('state.areaList', state.areaList)
}

const sendCurrentSelect = async (currentKey) => {
  if (currentKey.length > 0) {
    state.currentSelectArea = state.areaList.find((item) => item.key === currentKey[0])
    console.log('state.currentSelectArea', state.currentSelectArea)
  } else {
    state.currentSelectArea = null
  }
  await getListStoreFN()
}

currentSelectChange()

const getCurrentAreaListFN = async () => {
  const res = await getCurrentAreaList()
  //去除 国家 '100000'为中国 定值
  const tempRes = res.filter((item) => item.code !== '100000')
  await tempRes.some((item) => {
    item.label = item.name
    item.value = item.code
  })
  state.proMunAreaList = handleTree(tempRes as any[], 'code', 'parentCode', 'children')
}

//主体下拉框选中
const clickMaj = (record, selectedKeys, isFromTable = false) => {
  if (!isFromTable && selectedKeys.length === 0) {
    //清除当前选中的主体 回显 左侧树
    nextTick(() => {
      state.currentClickRecord = {}
    })
  } else {
    if (
      Object.keys(state.currentClickRecord).length >= 0 &&
      state.currentClickRecord.id === record.id
    ) {
      //  当为表格且当前选中的值 为再次点击时 清空
      state.currentClickRecord = {}
    } else {
      // 赋值
      state.currentClickRecord = record
    }
  }
  state.majSelectedKeys = selectedKeys

  console.log('state.currentClickRecord', state.currentClickRecord)
  currentSelectChange()
  getListStoreFN()
}

const clickRow = (record) => {
  return {
    onClick: () => {
      console.log('record', record)
      clickMaj(record, [], true)
    } // 点击行
  }
}

const setRowClassName = (record) => {
  return record.id === state.currentClickRecord.id ? 'clickRowStyle' : ''
}

//主体tree 操作
const clickOperation = ({ operationType, id }) => {
  //当前 record
  const record = state.tableDataArr.find((item) => item.id === id)
  switch (operationType) {
    case 'edit':
      //修改
      edit(record, false, record.type === organizationType.store)
      break
    case 'addStore':
      //新增门店
      openModal(record)
      break
    case 'addChild':
      //新增子项
      openModal(record)
      break
    case 'editMenu':
      //配置菜单
      assignPermission(record)
      break
    case 'detail':
      //详情
      detailsInfo(record)
      break
    case 'culture':
      //企业文化
      openDomainCulture(record, 'culture')
      break
    case 'domain':
      //绑定域名
      openDomainCulture(record, 'domain')
      break
  }
}

const fullScreenFN = (type) => {
  switch (type) {
    case 'majCardId':
      state.majCardId = 'card-content'
      state.storeId = ''
      break
    case 'storeId':
      state.majCardId = ''
      state.storeId = 'card-content'
      break
  }

  nextTick(() => {
    fullScreen()
  })
}

//成员端
watch(
  () => state.checkedKeysFrontDesk,
  (val) => {
    //权限配置 选中的菜单
    console.log('state.checkedKeys ---- change')
    console.log('state.checkedKeys, ------', state.checkedKeys)
    console.log('checkedKeysDirIds.value ---------', checkedKeysDirIds.value)
    console.log('state.menuTreeArr---------', state.menuTreeArr)
    state.selectAllFrontDesk = val.length > 0 && val.length === state.menuTreeArrFrontDesk.length
    if (
      [...state.checkedKeysFrontDesk, ...checkedKeysDirIdsFrontDesk.value].length ===
      state.menuTreeArrFrontDesk.length
    ) {
      //回显全选特殊处理 - - 目录 跟 菜单 length 等于 list length
      state.selectAllFrontDesk = true
    }
    //确认请求入参
    state.idArrFrontDesk = [
      ...new Set(
        checkedKeysDirIdsFrontDesk.value.concat(
          state.checkedKeysFrontDesk,
          state.operationCheckedAllValueFrontDesk
        )
      )
    ]
    //右侧树
    // state.selectTree = filterTree(state.menuTreeList, state.idArr)
    // state.selectTree = filterTree(handleTree(cloneDeep(state.allMenuTreeArr)), state.idArr)
    state.selectTreeFrontDesk = filterTree(
      handleTree(cloneDeep(state.allMenuTreeArrFrontDesk)),
      state.idArrFrontDesk
    )
    state.isShowRightTree = false
    //右侧展开显示 左侧选中的数据
    nextTick(() => {
      state.isShowRightTree = true
    })
  },
  {
    immediate: true
  }
)

//管理端
watch(
  () => state.checkedKeys,
  (val) => {
    //权限配置 选中的菜单
    console.log('state.checkedKeys ---- change')
    console.log('state.checkedKeys, ------', state.checkedKeys)
    console.log('checkedKeysDirIds.value ---------', checkedKeysDirIds.value)
    console.log('state.menuTreeArr---------', state.menuTreeArr)
    state.selectAll = val.length > 0 && val.length === state.menuTreeArr.length
    if ([...state.checkedKeys, ...checkedKeysDirIds.value].length === state.menuTreeArr.length) {
      //回显全选特殊处理 - - 目录 跟 菜单 length 等于 list length
      state.selectAll = true
    }
    //确认请求入参
    state.idArr = [
      ...new Set(checkedKeysDirIds.value.concat(state.checkedKeys, state.operationCheckedAllValue))
    ]
    //右侧树
    // state.selectTree = filterTree(state.menuTreeList, state.idArr)
    // state.selectTree = filterTree(handleTree(cloneDeep(state.allMenuTreeArr)), state.idArr)
    state.selectTree = filterTree(handleTree(cloneDeep(state.allMenuTreeArr)), state.idArr)
    state.isShowRightTree = false
    //右侧展开显示 左侧选中的数据
    nextTick(() => {
      state.isShowRightTree = true
    })
  },
  {
    immediate: true
  }
)

// const arr1 = [1, 2, 3, 4, 5, 6]
// const arr2 = [2, 3]
// const arr = arr1.filter((item) => !arr2.includes(item))
// console.log('arr!!!!!!!!!!!!', arr)

//成员端
watch(
  () => state.operationCheckedValueFrontDesk,
  (val) => {
    //  权限配置 操作权限 即 btn 当前选中的菜单的
    console.log('valBtn', val)
    state.selectAllOperationFrontDesk =
      val.length > 0 && val.length === state.operationCheckedListFrontDesk.length
    //获取复选框所有的id数组
    const idList = state.operationCheckedListFrontDesk.map((item) => item.id)
    //当前菜单没有选中的值
    console.log('state.operationCheckedListFrontDesk', state.operationCheckedListFrontDesk)
    const noSelectValue = idList.filter((item) => !val.includes(item))
    console.log('当前菜单没有选中的值noSelectValue', noSelectValue)
    //去重
    state.operationCheckedAllValueFrontDesk = [
      ...new Set(state.operationCheckedAllValueFrontDesk.concat(val))
    ]
    //通过未选中的值反向过滤  获取所有操作权限 选中的btn
    state.operationCheckedAllValueFrontDesk = state.operationCheckedAllValueFrontDesk.filter(
      (item) => !noSelectValue.includes(item)
    )
    console.log('state.operationCheckedAllValue', state.operationCheckedAllValue)
    //确认请求入参
    state.idArrFrontDesk = [
      ...new Set(
        state.idArrFrontDesk.concat(
          state.operationCheckedAllValueFrontDesk,
          checkedKeysDirIdsFrontDesk.value
        )
      )
    ]
    //通过未选中的值反向过滤
    state.idArrFrontDesk = state.idArrFrontDesk.filter((item) => !noSelectValue.includes(item))
    //右侧树
    state.selectTreeFrontDesk = filterTree(
      handleTree(cloneDeep(state.allMenuTreeArrFrontDesk)),
      state.idArrFrontDesk
    )
    console.log('state.idArr!!!', state.idArr)
    console.log('state.selectTree!!!', state.selectTree)
    state.isShowRightTree = false
    //右侧展开显示 左侧选中的数据
    nextTick(() => {
      state.isShowRightTree = true
    })
  }
)

//管理端
watch(
  () => state.operationCheckedValue,
  (val) => {
    //  权限配置 操作权限 即 btn 当前选中的菜单的
    console.log('valBtn', val)
    state.selectAllOperation = val.length > 0 && val.length === state.operationCheckedList.length
    //获取复选框所有的id数组
    const idList = state.operationCheckedList.map((item) => item.id)
    //当前菜单没有选中的值
    console.log('state.operationCheckedList', state.operationCheckedList)
    const noSelectValue = idList.filter((item) => !val.includes(item))
    console.log('当前菜单没有选中的值noSelectValue', noSelectValue)
    //去重
    state.operationCheckedAllValue = [...new Set(state.operationCheckedAllValue.concat(val))]
    //通过未选中的值反向过滤  获取所有操作权限 选中的btn
    state.operationCheckedAllValue = state.operationCheckedAllValue.filter(
      (item) => !noSelectValue.includes(item)
    )
    console.log('state.operationCheckedAllValue', state.operationCheckedAllValue)
    //确认请求入参
    state.idArr = [
      ...new Set(state.idArr.concat(state.operationCheckedAllValue, checkedKeysDirIds.value))
    ]
    //通过未选中的值反向过滤
    state.idArr = state.idArr.filter((item) => !noSelectValue.includes(item))
    //右侧树
    state.selectTree = filterTree(handleTree(cloneDeep(state.allMenuTreeArr)), state.idArr)
    console.log('state.idArr!!!', state.idArr)
    console.log('state.selectTree!!!', state.selectTree)
    state.isShowRightTree = false
    //右侧展开显示 左侧选中的数据
    nextTick(() => {
      state.isShowRightTree = true
    })
  }
)

watch(
  () => state.columns,
  (columns) => {
    const needItem = columns!.find((item) => item.key === 'name')
    state.treeIconIndex = needItem.sort - 1
  },
  {
    immediate: true,
    deep: true
  }
)

watch(
  () => state.columnsStore,
  (columns) => {
    const needItem = columns!.find((item) => item.key === 'name')
    console.log('needItem', needItem)
    state.treeIconIndexStore = needItem.sort - 1
  },
  {
    immediate: true,
    deep: true
  }
)

onMounted(async () => {
  await getAllType()
  await getList()
  await getListStoreFN()
  getCurrentAreaListFN()
  toggleExpandAll(true)
  toggleExpandAll(false)
  //仅超管 有新增 btn
  const { roles = [] } = wsCache.get(CACHE_KEY.USER)
  state.isSuperAdmin = roles.includes('super_admin')
})
</script>

<style lang="scss" scoped>
.clear-tag {
  margin-left: 5px;
}
.store-major-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.type-card-style {
  height: 65px;
}
.type-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.type-text {
  height: 100%;
  padding: 23px 0 17px 15px;
  color: rgba(51, 51, 51, 1);
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  font-family: PingFangSC-Medium;
}
.expand-narrow {
  height: 100%;
  padding: 23px 15px 17px 15px;
  cursor: pointer;
}
.expand-narrow-text {
  margin-left: 6px;
  color: rgba(0, 129, 255, 1);
  font-size: 14px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
.test {
  width: 100%;
  height: 200px;
  background: white;
}
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
  width: 150px;
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
  width: 232px;
  justify-content: space-between;
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
  width: 160px;
  display: flex;
  justify-content: flex-end;
}

.item-condition-date {
  width: 240px;
}

//主体 搜索 label
.total-search-content {
  :deep(.ant-form-item-no-colon) {
    width: 66px;
    display: flex;
    justify-content: flex-end;
  }
}
.store-total-search-content {
  :deep(.ant-form-item-no-colon) {
    width: 82px;
  }
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
  width: 100% !important;
}
.width-80 {
  width: 80% !important;
}
.width-20 {
  width: 20% !important;
}
.height-100 {
  height: 100%;
}
//.flex {
//  display: flex;
//  flex-direction: column;
//}
.flex-1 {
  flex: 1;
}

//========================== search end ==================================
.search-card {
  //min-width: 1700px;
  //min-height: 72px;
  padding: 0px 14px 10px 20px;
  //margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.width-715 {
  width: 715px;
}
.total-content {
  //width: 100%;
  width: 50%;
  min-width: 743px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.store-content {
  margin-left: 10px;
  min-width: 944px;
}
.right-store-content {
  display: flex;
}
.store-total-content {
  display: flex;
  height: 100%;
}
.store-tree-content {
  width: 209px !important;
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
  //主体名称可能是被全局哪里影响到了 之前都没有 现在少了1.5px 没空看 直接写死
  height: 23.5px;
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
  margin: auto;
  overflow: auto;
  padding: 24px;
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

.margin-left-14 {
  margin-left: 14px;
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
  width: 100%;
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

.overflow-auto {
  overflow: auto;
}

.right-card-content {
  width: 100%;
  height: 260px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(234, 235, 239, 1);
  overflow: auto;
}

.border-1 {
  border: 1px solid rgba(234, 235, 239, 1);
  overflow: auto;
}
.operation-checkbox-content {
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: auto;
}
.operation-checkbox-style {
  margin: 5px 26px 0 0;
}
.list-content {
  width: 100%;
  height: 620px;
  display: flex;
  flex-direction: column;
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
  //主体名称可能是被全局哪里影响到了 之前都没有 现在少了1.5px 没空看 直接写死
  height: 23.5px;
}
.store-tag {
  margin-left: 10px;
  padding: 8px;
  min-width: 40px;
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
.child-store-tag {
  background-color: rgba(253, 246, 235, 1);
  color: rgba(231, 162, 60, 1);
}
.right-top-text {
  width: 100%;
  height: 46px;
  padding-left: 18px;
  display: flex;
  align-items: center;
  background: rgba(246, 246, 246, 1);
}
.corporateCulture-text {
  margin-top: 8px;
  color: rgba(153, 153, 153, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
}
.logo-example {
  width: 24px;
  height: 17px;
  color: rgba(25, 137, 250, 1);
  font-size: 12px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
.margin-top-8 {
  margin-top: 8px;
}
.margin-bottom-8 {
  margin-bottom: 8px;
}
</style>

<style lang="scss">
.ant-table-tbody {
  .clickRowStyle {
    td {
      background-color: rgb(209, 230, 251) !important;
    }
  }
}
//所有modal title
.ant-modal-title {
  color: rgba(51, 51, 51, 1);
  font-size: 18px !important;
  font-weight: bold !important;
  font-family: PingFangSC-Medium;
}
//修改 详细 modal位置
.details-modal {
  overflow: hidden !important;

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

.backstage-tabs-tree {
  .ant-tree-treenode-selected {
    background: rgb(235, 245, 255) !important;
  }
  /*ant-tree-node-content-wrapper ant-tree-node-content-wrapper-close ant-tree-node-selected*/
  .ant-tree-node-selected {
    background: rgb(235, 245, 255) !important;
  }
}
//绑定域名/企业文化
.domain-Culture {
  .form-content {
    padding-top: 30px;
  }
  .footer-content {
    width: 100%;
    height: 62px;
    margin-top: 38px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid rgba(234, 235, 239, 1);
  }

  .footer-content-culture {
    margin-top: 30px;
  }
}
</style>
