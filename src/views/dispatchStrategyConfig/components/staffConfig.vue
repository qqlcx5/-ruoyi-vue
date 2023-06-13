<template>
  <XModal title="选择成员" width="50%">
    <el-table :data="list">
      <el-table-column label="门店">
        <template #default="{ row }">
          <span>{{ `${row.companyName ? row.companyName + '-' : ''}${row.shopName}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成员">
        <template #default="{ row }">
          <template>
            <span>{{ row.staffName }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="成员平台昵称">
        <template #default="{ row }">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售品牌">
        <template #default="{ row }">
          <template v-if="row.brandIds.length > 0">
            <span>{{ row.brandNames.join(',') }} </span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="销售车系" show-overflow-tooltip>
        <template #default="{ row }">
          <template>
            <template v-if="row.seriesNames.length > 0">
              <span>{{ row.seriesNames.join(',') }} </span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="派单状态">
        <template #default="{ row }">
          <span>{{ row.status ? '开启' : '关闭' }}</span>
        </template>
      </el-table-column>
    </el-table>
  </XModal>
</template>

<script setup lang="ts" name="staffConfig">
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  dbList: propTypes.any.def([])
})

type StaffObj = {
  brandIds: []
  seriesNames: ''
  brandNames: ''
  companyName: ''
  shopName: ''
  staffName: ''
  nickname: ''
  staffId: ''
  shopId: ''
  id: ''
  brands: []
  status: ''
}
let list = ref<StaffObj[]>([])
watch(
  () => props.dbList,
  (val) => {
    list.value = []
    if (val.length > 0) {
      val.forEach((item) => {
        const brands = JSON.parse(item.autoBrandIds)
        const brandIds = brands.map((brand) => {
          return brand.brandId
        })
        list.value.push({
          brandIds: brandIds,
          seriesNames: JSON.parse(item.autoSeriesNames),
          brandNames: JSON.parse(item.autoBrandNames),
          companyName: '',
          shopName: item.distributeShopName,
          staffName: item.distributeUserName,
          nickname: item.nickname,
          staffId: item.distributeUserId,
          shopId: item.distributeShopId,
          id: item.id,
          brands: brands,
          status: item.status
        })
      })
    }
  },
  { deep: true, immediate: true }
)
</script>
<style lang="scss" scoped></style>
