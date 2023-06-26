<template>
  <el-radio-group v-bind="$attrs">
    <el-radio v-for="item in options" :key="item.label" :label="item.value">
      <template #default>
        <div :class="{ checked: modelValue === item.value }" class="radio">
          <Icon :size="8" icon="svg-icon:check" class="mr-1" v-if="modelValue === item.value" />
          <span class="overflow-hidden"> {{ item.label }}</span>
        </div>
      </template>
    </el-radio>
  </el-radio-group>
</template>

<script lang="ts" setup>
import { withDefaults } from 'vue'

withDefaults(
  defineProps<{
    options: { label: string; value: number }[]
    modelValue: number
    marginRight: string
  }>(),
  {
    marginRight: '20px'
  }
)
</script>

<style lang="scss" scoped>
$no-select-color: #dddfe5;

.radio {
  display: flex;
  padding: 5px 12px;
  font-size: 12px;
  line-height: initial;
  color: #666;
  border: 1px solid $no-select-color;
  border-radius: 4px;
  box-sizing: border-box;
  align-items: center;
}

.checked {
  padding: 5px 7px;
  color: var(--el-color-primary);
  border-color: 1px solid var(--el-color-primary);
}

:deep(.el-radio) {
  margin-right: v-bind(marginRight);

  &:last-of-type {
    margin-right: 0;
  }

  .el-radio__input {
    display: none;
  }

  .el-radio__label {
    padding-left: 0;
  }
}
</style>
