import { Layout } from '@/utils/routerHelper'

const routes: AppRouteRecordRaw = {
  path: '/basic-config',
  component: Layout,
  name: 'BasicConfigIndex',
  meta: {
    hidden: true
  },
  children: [
    {
      path: 'distribute',
      component: () => import('@/views/basicConfig/distribute/index.vue'),
      name: 'Distribute',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ep:user',
        title: '派发设置'
      }
    },
    {
      path: 'order-receiving',
      component: () => import('@/views/basicConfig/orderReceiving/index.vue'),
      name: 'OrderReceiving',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ep:user',
        title: '接单设置'
      }
    },
    {
      path: 'follow',
      component: () => import('@/views/basicConfig/follow/index.vue'),
      name: 'Follow',
      meta: {
        canTo: true,
        hidden: true,
        noTagsView: false,
        icon: 'ep:user',
        title: '跟进设置'
      }
    }
  ]
}

export default routes
