<script setup lang="ts">
import { ref, watch, computed, onMounted, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import userImg from '@/assets/imgs/user.png'
import { CACHE_KEY } from '@/hooks/web/useCache'
import { useCache } from '@/hooks/web/useCache'
import { useRoute } from 'vue-router'

const { wsCache } = useCache()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('logo')

const appStore = useAppStore()

const show = ref(true)

const layout = computed(() => appStore.getLayout)

const collapse = computed(() => appStore.getCollapse)

const $route = useRoute() // 用于接收路由参数的

const isShowEditUserInfo = computed(() => appStore.getIsShowEditUserInfo)

const state = reactive({
  isShowEditUserInfo: false
})

//原本的从 pinia 里获取有问题 刷新就没了 或者做持久化存储 - - 算了 懒得搞 - -直接换取localStorage
let userInfo = wsCache.get(CACHE_KEY.USER)

onMounted(() => {
  if (unref(collapse)) show.value = false
})

watch(
  () => collapse.value,
  (collapse: boolean) => {
    if (unref(layout) === 'topLeft') {
      show.value = true
      return
    }
    if (!collapse) {
      setTimeout(() => {
        show.value = !collapse
      }, 400)
    } else {
      show.value = !collapse
    }
  }
)

watch(
  () => layout.value,
  (layout) => {
    if (layout === 'top') {
      show.value = true
    } else {
      if (unref(collapse)) {
        show.value = false
      } else {
        show.value = true
      }
    }
  }
)

const editUserInfo = () => {
  console.log('跳转至修个个人信息')
  state.isShowEditUserInfo = true
  appStore.setIsShowEditUserInfo(!appStore.getIsShowEditUserInfo)
}

watch(
  () => appStore.getIsShowEditUserInfo,
  (val) => {
    if (!val) {
      userInfo = wsCache.get(CACHE_KEY.USER)
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div>
    <!-- to="/"  -->
    <router-link
      :class="[
        prefixCls,
        layout !== 'classic' ? `${prefixCls}__Top` : '',
        'flex !h-[var(--logo-height)] items-center cursor-pointer justify-center relative',
        'dark:bg-[var(--left-menu-bg-color)]'
      ]"
      :to="state.isShowEditUserInfo ? { path: $route.fullPath } : { path: '/' }"
    >
      <!-- 头像  title  -->
      <img
        :src="userInfo?.tenant?.logoUrl || userImg"
        alt=""
        class="w-[calc(var(--logo-height)-30px)] rounded-[50%]"
        @error="
          (e) => {
            e.target.src = userImg
          }
        "
      />
      <div
        v-if="show"
        :class="[
          'w-100px ml-8px text-16px font-700 text-[var(--left-menu-text-color)] overflow-hidden overflow-ellipsis whitespace-nowrap'
          // {
          //   'text-[var(--left-menu-text-color)]': layout === 'classic',
          //   'text-[var(--left-menu-text-color)]':
          //     layout === 'topLeft' || layout === 'top' || layout === 'cutMenu'
          // }
        ]"
      >
        {{ userInfo?.tenant?.systemName || '万国投资管理系统' }}
      </div>
      <Icon
        :size="18"
        icon="svg-icon:edit"
        color="#fff"
        class="cursor-pointer ml-8px"
        @click.stop="editUserInfo"
      />
    </router-link>
  </div>
</template>
