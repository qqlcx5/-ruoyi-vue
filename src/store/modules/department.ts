import { defineStore } from 'pinia'
import { store } from '@/store'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { getSimpleOrganizationList } from '@/api/system/organization'

const { wsCache } = useCache('sessionStorage')

export interface departmentState {
  departmentMap: object | null
}

export const useDepartmentStore = defineStore('department', {
  state: (): departmentState => ({
    departmentMap: null
  }),
  getters: {
    getDepartmentMap(): object | null {
      return this.departmentMap
    }
  },
  actions: {
    async setDepartment() {
      const departmentMap = wsCache.get(CACHE_KEY.DEPARTMENT)
      if (!departmentMap) {
        const result = await getSimpleOrganizationList({})
        const map = {}
        result.map((item) => {
          map[item.id] = item.name
        })
        this.departmentMap = map
        wsCache.set(CACHE_KEY.DEPARTMENT, map)
      }
    }
  }
})

export const useDepartmentStoreWithOut = () => {
  return useDepartmentStore(store)
}
