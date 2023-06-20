<!-- 基于 ruoyi-vue3 的 Pagination 重构，核心是简化无用的属性，并使用 ts 重写 -->
<template>
  <el-pagination
    :small="small"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :background="false"
    :page-sizes="[10, 20, 30, 50, 100, 200, 300, 500, 1000]"
    :pager-count="pagerCount"
    :total="total"
    class="custom-pagination float-right mt-15px mb-15px"
    :layout="`${small ? 'prev, pager, next' : 'sizes, total, prev, pager, next, jumper'} `"
    :hide-on-single-page="false"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script name="Pagination" setup>
import { computed } from 'vue'

const props = defineProps({
  small: {
    type: Boolean,
    default: false
  },
  // 总条目数
  total: {
    required: true,
    type: Number
  },
  // 当前页数：pageNo
  page: {
    type: Number,
    default: 1
  },
  // 每页显示条目个数：pageSize
  limit: {
    type: Number,
    default: 10
  },
  // 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠
  // 移动端页码按钮的数量端默认值 5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  }
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    // 触发 update:page 事件，更新 limit 属性，从而更新 pageNo
    emit('update:page', val)
  }
})
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    // 触发 update:limit 事件，更新 limit 属性，从而更新 pageSize
    emit('update:limit', val)
  }
})
const handleSizeChange = (val) => {
  // 如果修改后超过最大页面，强制跳转到第 1 页
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  // 触发 pagination 事件，重新加载列表
  emit('pagination', { pageNo: currentPage.value, pageSize: val })
}
const handleCurrentChange = (val) => {
  // 触发 pagination 事件，重新加载列表
  emit('pagination', { pageNo: val, pageSize: pageSize.value })
}

onMounted(() => {
  try {
    document
      .getElementsByClassName('el-pagination__goto')
      .forEach((el) => (el.innerHTML = '跳转至'))
  } catch (e) {
    console.error(e.message)
  }
})
</script>
<style lang="scss" scoped>
.custom-pagination {
  background-color: #ffffff;
}
:deep(.el-pager) {
  li {
    border-radius: 50%;
  }
  .is-active {
    background-color: #e8f4ff;
  }
}
</style>
