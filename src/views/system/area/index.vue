<!--  行政区划  -->
<template>
  <div class="total-content">
    <!--  -1显示全部区划item 100000中国  -->
    <LeftSelectTree
      :treeData="state.areaList.filter((item) => item.code !== '-1')"
      @sendCurrentSelect="sendCurrentSelect"
    />
    <el-card class="right-card" body-style="padding:0">
      <div class="btn-content">
        <XButton
          title="新增下级"
          v-hasPermi="['system:tenant-area:create']"
          type="primary"
          iconSize="10"
          preIcon="svg-icon:add"
          @click="addEditArea('add')"
        />
        <XButton
          title="编辑"
          v-hasPermi="['system:tenant-area:update']"
          type="primary"
          iconSize="10"
          preIcon="svg-icon:add"
          @click="addEditArea('edit')"
        />
        <!--  导入导出 又说先不做  -->
        <XButton
          v-if="false"
          title="导入"
          v-hasPermi="['system:tenant:update-store']"
          type="primary"
          iconSize="10"
          preIcon="svg-icon:add"
        />
        <XButton
          v-if="false"
          title="导出"
          v-hasPermi="['system:tenant:update-store']"
          type="primary"
          iconSize="10"
          preIcon="svg-icon:add"
        />
        <XButton title="删除" v-hasPermi="['system:tenant-area:delete']" @click="openDeleteModal" />
        <div class="switch-content" v-hasPermi="['system:tenant-area:visible-all']">
          <div>显示全部区划</div>
          <el-switch v-model="state.statusValue" @change="statusChange" class="switch-style" />
        </div>
      </div>
      <div class="form-content">
        <el-form
          :model="form"
          label-width="120px"
          ref="formRef"
          :rules="state.useDefRules ? rules : rulesNoParent"
        >
          <el-form-item label="父区划编号" prop="parentCode">
            <el-input
              v-model="form.parentCode"
              placeholder="请输入父区划编号"
              class="input-width"
              :disabled="true"
            />
          </el-form-item>

          <el-form-item label="父区划名称" prop="parentName">
            <el-input
              v-model="form.parentName"
              placeholder="请输入父区划名称"
              class="input-width"
              :disabled="true"
            />
          </el-form-item>

          <el-form-item label="区划编号" prop="code">
            <el-input
              v-model="form.code"
              :disabled="state.isDisabled"
              placeholder="请输入区划编号"
              class="input-width"
            >
              <!--              <template #prepend>{{ form.name }}</template>-->
            </el-input>
          </el-form-item>

          <el-form-item label="区划名称" prop="name">
            <el-input
              v-model="form.name"
              :disabled="state.isDisabled"
              placeholder="请输入区划名称"
              class="input-width"
            />
          </el-form-item>

          <el-form-item label="区划等级" prop="level">
            <el-radio-group v-model="form.level" :disabled="state.isDisabled">
              <el-radio :label="0" class="margin-right-20">国家</el-radio>
              <el-radio :label="1" class="margin-right-20">省份/直辖市</el-radio>
              <el-radio :label="2" class="margin-right-20">地市</el-radio>
              <el-radio :label="3" class="margin-right-20">区县</el-radio>
              <el-radio :label="4" class="margin-right-20">乡镇</el-radio>
              <el-radio :label="5" class="margin-right-20">村委</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否显示区划" props="visible">
            <el-switch v-model="form.visible" :disabled="state.isDisabled" />
          </el-form-item>

          <el-form-item label="区划排序" props="sort">
            <el-input v-model="form.sort" :disabled="state.isDisabled" class="input-width" />
          </el-form-item>
          <el-form-item label="区划备注" props="remark">
            <el-input
              v-model="form.remark"
              :disabled="state.isDisabled"
              type="textarea"
              class="input-width"
            />
          </el-form-item>
          <el-form-item v-if="state.operationType">
            <el-button type="primary" @click="onSubmit" :loading="state.loading">提交</el-button>
            <el-button @click="resetForm">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-dialog v-model="state.isShow" title="提示" width="424" custom-class="delete-modal">
      <div class="message-text">
        <img :src="warningImg" alt="" class="tip-img message-img" />
        是否删除所选数据？
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="modalDelete"> 确定 </el-button>
          <el-button @click="state.isShow = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!--  导入导出 又说先不做  -->
  <imExModal v-if="false" />
</template>

<script lang="ts" setup>
// do not use same name with ref
import {
  addChildArea,
  deleteArea,
  getAreaList,
  updateArea,
  visibleAllArea
} from '@/api/system/area'
import { handleTree } from '@/utils/tree'
import type { FormRules } from 'element-plus'
import warningImg from '@/assets/imgs/system/warning.png'
import imExModal from '@/views/system/area/imExModal.vue'
const message = useMessage() // 消息弹窗

const form = reactive({
  parentCode: '', //父区划编号
  parentName: '', //父区划名称
  code: '', //区划编号
  name: '', //区划名称
  level: '', //区划等级
  visible: true, //是否显示区划
  sort: '', //区划排序
  remark: '' //区划备注
})

const state: any = reactive({
  areaList: [], //行政区划 tree
  isVisibleAllArea: {}, //显示全部区划item
  currentNode: {}, //当前选中的树节点
  operationType: '', //当前操作类型 add edit
  isShow: false, //删除modal
  statusValue: false,
  isDisabled: true,
  useDefRules: true, //使用默认校验
  loading: false //提交加载中
})

const formRef = ref()
const rules = reactive<FormRules>({
  parentCode: [{ required: true, message: '请选择' }],
  parentName: [
    {
      required: true,
      message: '请选择'
    }
  ],
  code: [
    {
      required: true,
      message: '请输入区划编号'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入区划名称'
    }
  ],
  level: [
    {
      required: true,
      message: '请选择区划等级'
    }
  ]
})

const rulesNoParent = reactive<FormRules>({
  code: [
    {
      required: true,
      message: '请输入区划编号'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入区划名称'
    }
  ],
  level: [
    {
      required: true,
      message: '请选择区划等级'
    }
  ]
})

//提交
const onSubmit = async () => {
  console.log('form.level', typeof form.level)
  console.log(' form.level', form.level)
  if (!formRef.value) return
  await formRef.value.validate()

  const params: any = {
    parentCode: form.parentCode, //父区划编号
    code: form.code, //区划编号
    name: form.name, //区划名称
    level: form.level, //区划等级
    visible: form.visible ? 0 : 1, //是否显示区划
    sort: form.sort, //区划排序
    remark: form.remark //区划备注
  }

  state.loading = true
  try {
    switch (state.operationType) {
      case 'add':
        await addChildArea(params)
        message.success('新增子项成功')
        getList()
        break
      case 'edit':
        if (state.currentNode.level === 0) {
          //国家无父级 编辑的时候 前端不显示 但是 接口要传回去
          params['parentCode'] = state.currentNode.parentCode //父区划编号
        }
        params['id'] = state.currentNode.id
        await updateArea(params)
        message.success('编辑成功')
        delete params.id
        getList()
        break
    }
  } finally {
    state.loading = false
  }

  console.log('form', form)
  console.log('submit!!!!')
}

//重置
const resetForm = () => {
  // formRef.value.resetFields()
  // //TODO 这有坑 表单清空 这两玩意没被清空 有空再看看
  form.code = '' //区划编号
  form.name = '' //区划名称
  form.level = '' //区划等级
  form.visible = true //是否显示区划

  form.sort = ''
  form.remark = ''
  console.log('form', form)
}

//接收选中的省市区节点
const sendCurrentSelect = (currentSelectNode) => {
  if (currentSelectNode.level === 0) {
    //国家 无父级 特殊处理
    state.useDefRules = false
    form.parentCode = '' //父区划编号
  } else {
    state.useDefRules = true
    form.parentCode = currentSelectNode.parentCode //父区划编号
  }
  console.log('currentSelectNode', currentSelectNode)
  state.operationType = ''
  state.isDisabled = true
  state.currentNode = currentSelectNode

  form.parentName = currentSelectNode.parentName //父区划名称
  form.code = currentSelectNode.code //区划编号
  form.name = currentSelectNode.name //区划名称
  form.level = currentSelectNode.level //区划等级
  form.visible = currentSelectNode.visible === 0 //是否显示区划
  form.sort = currentSelectNode.sort //区划排序
  form.remark = currentSelectNode.remark //区划备注
}

const addEditArea = (type) => {
  state.operationType = type
  console.log('state.currentNode===>', state.currentNode)
  switch (type) {
    case 'add':
      state.useDefRules = true
      form.parentCode = state.currentNode.code
      form.parentName = state.currentNode.name
      form.level = state.currentNode.level + 1
      form.code = ''
      form.name = ''
      break
    case 'edit':
      // form.parentCode = state.currentNode.parentCode //父区划编号
      if (state.currentNode.level === 0) {
        //国家无父级
        state.useDefRules = false
        form.parentCode = '' //父区划编号
      }
      form.parentName = state.currentNode.parentName //父区划名称
      form.code = state.currentNode.code //区划编号
      form.name = state.currentNode.name //区划名称
      form.level = state.currentNode.level //区划等级
      form.visible = state.currentNode.visible === 0 //是否显示区划
      form.sort = state.currentNode.sort //区划排序
      form.remark = state.currentNode.remark //区划备注
  }
  state.isDisabled = false
}

//open 删除 modal
const openDeleteModal = () => {
  state.isShow = true
}
//删除 modal ok
const modalDelete = async () => {
  await deleteArea(state.currentNode.id)
  message.success('删除成功')
  state.isShow = false
  getList()
}

//显示全部区划
const statusChange = async () => {
  await visibleAllArea({
    id: state.isVisibleAllArea.id,
    visible: state.statusValue ? 0 : 1
  })
  message.success('编辑显示全部区划成功')
  getList()
}

const getList = async () => {
  state.areaList = await getAreaList()
  const tempArr = handleTree(state.areaList, 'code', 'parentCode', 'children')
  state.isVisibleAllArea = state.areaList.find((item) => item.code === '-1')
  state.statusValue = state.isVisibleAllArea.visible === 0 ? true : false
  console.log('isVisibleAllArea', state.isVisibleAllArea)
  console.log('state.areaList', state.areaList)
  console.log('tempArr', tempArr)
}
getList()
</script>

<style lang="scss" scoped>
.total-content {
  width: 100%;
  height: 100%;
  display: flex;
  background: rgb(245, 247, 249);
}
.right-card {
  width: 100%;
}
.btn-content {
  height: 61px;
  padding: 15px 0 14px 15px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(235, 236, 240, 1);
}
.form-content {
  padding: 30px 47px;
}
.input-width {
  width: 442px;
}
.margin-right-20 {
  margin-right: 20px;
}
.message-text {
  display: flex;
  color: rgba(51, 51, 51, 1);
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  font-family: PingFangSC-Medium;
}
//提示弹窗 img
.tip-img {
  width: 20px;
  height: 20px;
  margin-right: 16px;
}
.message-img {
  margin-top: 3px;
}
.switch-content {
  margin-left: 100px;
  display: flex;
  align-items: center;
}
.switch-style {
  margin-left: 9px;
}
</style>

<style lang="scss">
.delete-modal {
  .el-dialog__body {
    padding-top: 0px;
  }
}
</style>
