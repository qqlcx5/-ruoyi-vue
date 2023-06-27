import { defineStore } from 'pinia'
import { getAllStoreList } from '@/api/system/organization'
import { cloneDeep, difference } from 'lodash-es'
import { listToTree } from '@/utils/tree'

type IOptionState<T> = {
  [K in keyof T]: T[K]
}

export const useOption = defineStore('options', {
  state: (): IOptionState<any> => {
    return {
      shopList: [],
      shopTreeList: []
    }
  },
  getters: {},
  actions: {
    async getShopList() {
      try {
        if (this.shopList.length && this.shopTreeList.length) {
          return cloneDeep({ shopList: this.shopList, shopTreeList: this.shopTreeList })
        }
        const data = await getAllStoreList()
        const shopList = cloneDeep(data || [])
        const shopTreeList = listToTree(data || [], { pid: 'parentId' })
        this.shopList = shopList
        this.shopTreeList = shopTreeList
        return cloneDeep({ shopList, shopTreeList })
      } catch (e) {
        return { shopList: [], shopTreeList: [] }
      }
    },

    dealShopList(list, arr1, arr2) {
      const shopList = cloneDeep(list)
      arr1 = arr1.map((d) => +d)
      arr2 = arr2.map((d) => +d)
      const checkedIds = difference(arr1, arr2)
      const recursionFn = (ops) => {
        ops.forEach((item) => {
          item['disabled'] = checkedIds.includes(+item['id'])
          if (item.children && item.children.length) {
            recursionFn(item.children)
          }
        })
      }
      recursionFn(shopList)
      return shopList
    }
  }
})
