<template>
  <ContentWrap class="visit-config">
    <NotAssociatedRecord />
    <TimeBucket />
    <!--    <ServicePersonnel />-->
  </ContentWrap>
</template>

<script lang="ts" setup>
import NotAssociatedRecord from './components/notAssociatedRecord.vue'
// import ServicePersonnel from './components/servicePersonnel.vue'
import TimeBucket from './components/timeBucket.vue'
</script>

<style lang="scss" scoped>
.visit-config {
  :deep(.card-header) {
    font-size: 18px;
    font-weight: bold;
    color: $title-color;
  }

  :deep(.tip-text) {
    font-size: 14px;
    color: $tip-color;
  }

  :deep(.danger-text) {
    font-size: 14px;
    color: #f24236;
  }
}
</style>
