import { defineStore } from 'pinia'

import { cloneDeep, difference } from 'lodash-es'
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
