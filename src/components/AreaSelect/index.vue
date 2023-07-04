<template>
  <el-form-item prop="province">
    <el-select
      :model-value="province"
      placeholder="省份"
      filterable
      clearable
      @change="handleChange($event, 1)"
    >
      <el-option
        v-for="item in proviceList"
        :label="item.name"
        :key="item.code"
        :value="item.code"
      />
    </el-select>
  </el-form-item>
  <el-form-item prop="city">
    <el-select
      :model-value="city"
      placeholder="城市"
      filterable
      clearable
      @change="handleChange($event, 2)"
    >
      <el-option v-for="item in cityList" :label="item.name" :key="item.code" :value="item.code" />
    </el-select>
  </el-form-item>
  <el-form-item prop="county">
    <el-select
      :model-value="county"
      placeholder="区县"
      filterable
      clearable
      @change="handleChange($event, 3)"
    >
      <el-option
        v-for="item in countyList"
        :label="item.name"
        :key="item.code"
        :value="item.code"
      />
    </el-select>
  </el-form-item>
</template>

<script setup lang="ts">
import { getCurrentAreaList } from '@/api/system/organization'

interface IProps {
  province: string
  city: string
  county: string
}
const props = withDefaults(defineProps<IProps>(), {
  province: '',
  city: '',
  county: ''
})
interface IEmit {
  (event: 'update:province', province: string): void
  (event: 'update:city', city: string): void
  (event: 'update:county', county: string): void
  (event: 'change', value: object): void
}
const emit = defineEmits<IEmit>()

const proviceList = ref<object[]>([])
const cityList = ref<object[]>([])
const countyList = ref<object[]>([])
let allList = []
const getList = async () => {
  allList = await getCurrentAreaList()
  proviceList.value = allList.filter((d) => d['parentCode'] === '100000')
  if (props.province) {
    cityList.value = allList.filter((d) => d['parentCode'] === props.province)
  }
  if (props.city) {
    countyList.value = allList.filter((d) => d['parentCode'] === props.city)
  }
}
getList()
const handleChange = async (value, type = 1) => {
  if (type === 1) {
    emit('update:province', value)
    emit('update:city', '')
    emit('update:county', '')
    cityList.value = allList.filter((d) => d['parentCode'] === value)
    countyList.value = []
  }
  if (type === 2) {
    emit('update:city', value)
    emit('update:county', '')
    countyList.value = allList.filter((d) => d['parentCode'] === value)
  }
  if (type === 3) {
    emit('update:county', value)
  }
  await nextTick()
  const { province, city, county } = props
  emit('change', { province, city, county })
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-right: 0;
  & + .el-form-item {
    margin-left: 10px;
  }
}
.el-select {
  width: 72px;
}
</style>
