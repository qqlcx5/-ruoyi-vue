import { getAllStoreList } from '@/api/system/organization'
import {
  getMemberDataList,
  getPostDataList,
  MemberListParams,
  getShopDataList,
  getUserMemberDataList,
  UserMemberList,
  getMemberTreeDataList
} from '@/api/common'
import { listToTree } from '@/utils/tree'
import { ref } from 'vue'

export const useCommonList = () => {
  /** 获取门店数据范围数据 */
  const getShopList = () => {
    const shopTreeList = ref<Recordable[]>([])
    const getList = async () => {
      const data = await getAllStoreList()
      shopTreeList.value = listToTree(data || [], { pid: 'parentId' })
    }
    getList()
    return shopTreeList
  }

  /** 获取成员数据 */
  const getMemberList = (params: MemberListParams) => {
    const memberList = ref<Recordable[]>([])
    const getList = async () => {
      const data = await getMemberDataList(params)
      memberList.value = data
    }
    getList()
    return memberList
  }

  // 获取成员数据(树形)
  const getMemberTreeList = (params: MemberListParams) => {
    const memberTreeList = ref<Recordable[]>([])
    const getTreeList = async () => {
      const data = await getMemberTreeDataList(params)
      memberTreeList.value = data
    }
    getTreeList()
    return memberTreeList
  }

  /** 获取岗位数据 */
  const getPostList = () => {
    const postList = ref<Recordable[]>([])
    const getList = async () => {
      const data = await getPostDataList()
      postList.value = data
    }
    getList()
    return postList
  }

  /** 获取适用门店数据 */
  const getSuitableShopList = () => {
    const shopList = ref<Recordable[]>([])
    const getList = async () => {
      const data = await getShopDataList()
      shopList.value = data
    }
    getList()
    return shopList
  }

  /** 获取用户精简信息列表(成员列表) */
  const getUserMemberList = (params?: UserMemberList) => {
    const userMemberList = ref<Recordable[]>([])
    const getList = async () => {
      const data = await getUserMemberDataList(params)
      userMemberList.value = data
    }
    getList()
    return userMemberList
  }

  return {
    getShopList,
    getMemberList,
    getPostList,
    getUserMemberList,
    getSuitableShopList,
    getMemberTreeList
  }
}
