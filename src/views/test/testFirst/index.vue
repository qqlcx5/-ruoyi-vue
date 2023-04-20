<!--<template>-->
<!--  <color-picker-->
<!--    :hex="color"-->
<!--    @change="change"-->
<!--    :standard-color="bColor"-->
<!--    default-color="#D8D8D8"-->
<!--    :btnStyle="state.btnStyle"-->
<!--    @close="close"-->
<!--    @finish="finish"-->
<!--  />-->
<!--</template>-->
<!--<script lang="ts" setup>-->
<!--const color = ref('')-->
<!--const colorValue = ref({})-->
<!--const state = reactive({-->
<!--  btnStyle: { width: `230px`, height: `230px` }-->
<!--})-->

<!--//  颜色值改变-->
<!--const change = (e) => {-->
<!--  // console.log("e", e)-->
<!--  colorValue.value = e-->
<!--}-->

<!--// 颜色面板关闭-->
<!--const close = (e) => {-->
<!--  console.log('关闭了', e)-->
<!--}-->

<!--const finish = (e) => {-->
<!--  console.log('点击完成', e)-->
<!--}-->

<!--const bColor = [-->
<!--  '#c21401',-->
<!--  '#ff1e02',-->
<!--  '#ffc12a',-->
<!--  '#ffff3a',-->
<!--  '#90cf5b',-->
<!--  '#00af57',-->
<!--  '#00afee',-->
<!--  '#0071be',-->
<!--  '#00215f',-->
<!--  '#72349d'-->
<!--]-->
<!--</script>-->
<!--<style lang="less" scoped></style>-->

<template>
  <div @click="testFN"> 切换11111 </div>

  <a-table :columns="columns" :data-source="data">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <down-outlined />
          </a>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts">
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
const columns = [
  {
    name: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags'
  },
  {
    title: 'Action',
    key: 'action'
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]

export default defineComponent({
  components: {
    SmileOutlined,
    DownOutlined
  },
  setup() {
    return {
      data,
      columns
    }
  }
})
</script>

<script setup lang="ts">
import { DarkMode } from '@/styles/antdVTheme/changAntdModal'

const state = reactive({
  theme: true
})

const testFN = () => {
  state.theme = !state.theme
  DarkMode(state.theme)
}
</script>
