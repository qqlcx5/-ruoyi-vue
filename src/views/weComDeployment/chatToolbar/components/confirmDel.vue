<template>
  <Dialog title="提示" :confirmConfig="{ show: false }" :cancelConfig="{ name: '确定' }">
    <div>
      <Icon icon="ep:warning" color="orange" />
      删除将导致配置应用的聊天工具栏功能无法正常使用。</div
    >
  </Dialog>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
