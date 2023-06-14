import { store } from '../index'
import { defineStore } from 'pinia'
import { getAccessToken, removeToken } from '@/utils/auth'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { getInfoApi, loginOutApi } from '@/api/login'
import { useWatermark } from '@/hooks/web/useWatermark'

const { wsCache } = useCache()
const { setWatermark, clear } = useWatermark()

interface UserVO {
  id: number
  avatar: string
  nickname: string
  username: string
  isAdmin?: number
}
interface TenantVO {
  systemName?: string
  logoUrl?: string
  watermark?: string
  watermarkVisible?: number
}
interface UserInfoVO {
  permissions: string[]
  roles: string[]
  isSetUser: boolean
  user: UserVO
  tenant: TenantVO
}

export const useUserStore = defineStore('admin-user', {
  state: (): UserInfoVO => ({
    permissions: [],
    roles: [],
    isSetUser: false,
    user: {
      id: 0,
      avatar: '',
      nickname: '',
      username: '',
      isAdmin: 0
    },
    tenant: {}
  }),
  getters: {
    getPermissions(): string[] {
      return this.permissions
    },
    getRoles(): string[] {
      return this.roles
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUser(): UserVO {
      return this.user
    },
    getTenant(): TenantVO {
      return this.tenant
    }
  },
  actions: {
    setTenantAction(watermark?: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      userInfo.tenant.watermark = watermark || ''
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async setUserInfoAction() {
      if (!getAccessToken()) {
        this.resetState()
        return null
      }
      let userInfo = wsCache.get(CACHE_KEY.USER)
      if (!userInfo) {
        userInfo = await getInfoApi()
      }
      this.permissions = userInfo.permissions
      this.roles = userInfo.roles
      this.user = userInfo.user
      this.tenant = userInfo.tenant
      this.isSetUser = true
      // 设置系统水印
      userInfo.tenant?.watermarkVisible === 0 && setWatermark(userInfo.tenant?.watermark)
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async loginOut() {
      await loginOutApi()
      clear()
      removeToken()
      wsCache.clear()
      this.resetState()
    },
    resetState() {
      this.permissions = []
      this.roles = []
      this.isSetUser = false
      this.user = {
        id: 0,
        avatar: '',
        nickname: '',
        username: '',
        isAdmin: 0
      }
      this.tenant = {}
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
