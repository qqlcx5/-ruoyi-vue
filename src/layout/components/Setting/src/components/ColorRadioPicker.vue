<template>
  <div :class="prefixCls" class="total-content flex flex-wrap">
    <span
      v-for="(item, i) in schema"
      :key="`radio-${i}`"
      class="checkbox w-20px h-20px cursor-pointer rounded-2px border-solid border-gray-300 border-1px text-center leading-20px mb-5px flex justify-center items-center"
      :class="{ 'is-active': colorVal === item }"
      :style="{
        background: item
      }"
      @click="selectColor(item)"
    >
      <!-- 选中的颜色 -->
      <Icon
        v-if="colorVal === item && item !== '#D8D8D8' && item !== '#fff'"
        color="#fff"
        icon="svg-icon:tick"
        :size="12"
      />
      <!-- 选中的颜色非取色器 -->
      <Icon
        v-if="colorVal === item && item !== '#D8D8D8' && item === '#fff'"
        color="#0081FF"
        icon="svg-icon:tick"
        :size="12"
      />
    </span>
    <span
      v-if="!state.isShow"
      @mouseenter="handleEnterFN"
      @mouseleave="handleLeaveFN"
      key="`radio-7`"
      class="checkbox w-20px h-20px cursor-pointer rounded-2px border-solid border-gray-300 border-1px text-center leading-20px mb-5px flex justify-center items-center"
      :class="{ 'is-active': colorVal === state.selectColor }"
      :style="{
        background: state.selectColor
      }"
    >
      <!-- 颜色选择器选中后的颜色 -->
      <Icon v-if="state.isSelect" color="#fff" icon="svg-icon:tick" :size="12" />
      <Icon v-else color="#fff" icon="ep:arrow-down" :size="12" />
    </span>
    <!-- 颜色选择器 -->
    <color-picker
      v-if="state.isShow"
      @mouseenter="handleEnter"
      @mouseleave="handleLeave"
      :default-color="state.defaultColor"
      :standard-color="bColor"
      :btnStyle="state.btnStyle"
      @change="finish"
      @finish="finish"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('color-radio-picker')

const props = defineProps({
  schema: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  modelValue: propTypes.string.def('')
})

const emit = defineEmits(['update:modelValue', 'change'])

const colorVal = ref(props.modelValue)

const selectColor = (color, isDefault = true) => {
  console.log('isDefault', isDefault)
  if (isDefault) {
    state.isSelect = false
  }
  colorVal.value = color
}

const state = reactive({
  btnStyle: { width: `40px`, height: `30px` }, //颜色选择器样式
  defaultColor: '#D8D8D8', //颜色选择器默认值
  isShow: false, //是否需要显示颜色选择器
  selectColor: '#D8D8D8', //颜色选择器选中的值
  isSelect: false //是否手动选择了颜色
})

//颜色选择器 改变/完成
const finish = (e) => {
  console.log('点击完成', e)
  state.selectColor = e.hex
  state.isSelect = true
  selectColor(e.hex, false)
}

//颜色选择器选中的颜色显示 鼠标移入
const handleEnterFN = () => {
  state.isShow = true
  // console.log('移入FN')
}
//颜色选择器选中的颜色显示 鼠标移出
const handleLeaveFN = () => {
  // console.log('移出FN')
}

//颜色选择器鼠标移入
const handleEnter = () => {
  // state.isShow = false
  // console.log('移入')
}
//颜色选择器鼠标移出
const handleLeave = () => {
  // state.isShow = true
  state.isShow = false
  // console.log('移出')
}

//判断是否手动选择了颜色
if (props.schema?.includes(props.modelValue)) {
  // eslint-disable-next-line vue/no-setup-props-destructure
  state.defaultColor = props.modelValue
} else {
  state.isSelect = true
}

const bColor = [
  '#c21401',
  '#ff1e02',
  '#ffc12a',
  '#ffff3a',
  '#90cf5b',
  '#00af57',
  '#00afee',
  '#0071be',
  '#00215f',
  '#72349d'
]

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(colorVal)) return
    colorVal.value = val
  }
)

// 监听
watch(
  () => colorVal.value,
  (val: string) => {
    emit('update:modelValue', val)
    emit('change', val)
  }
)
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-color-radio-picker;

.#{$prefix-cls} {
  .is-active {
    box-shadow: 0 0 4px 0 var(--el-color-primary);
  }
}

.checkbox {
  width: 40px;
  height: 30px;
  border-radius: 4px;
}
.total-content {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-column-gap: 14px;
  grid-row-gap: 8px;
}

:deep(.zs-color-picker-panel) {
  right: 0;
  z-index: 999;
}
</style>
