<template>
  <color-picker
    :hex="color"
    @change="change"
    :standard-color="bColor"
    default-color="#D8D8D8"
    :btnStyle="state.btnStyle"
    @close="close"
    @finish="finish"
  />
</template>
<script lang="ts" setup>
const color = ref('')
const colorValue = ref({})
const state = reactive({
  btnStyle: { width: `230px`, height: `230px` }
})

//  颜色值改变
const change = (e) => {
  // console.log("e", e)
  colorValue.value = e
}

// 颜色面板关闭
const close = (e) => {
  console.log('关闭了', e)
}

const finish = (e) => {
  console.log('点击完成', e)
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
</script>
<style lang="less" scoped></style>
