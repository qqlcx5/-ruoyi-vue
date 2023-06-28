import { useCache } from '@/hooks/web/useCache'
import { isEmpty } from 'lodash-es'
import { computed } from 'vue'

/**
 * 切换展开树形层级
 * @param treeList 树形列表
 * @returns
 */
export const useExpandTree = (treeList: Recordable[]) => {
  const route = useRoute()
  const { wsCache } = useCache()
  // 展开的层级
  const expandLevel = ref<number>(wsCache.get(route.path) || 2)
  // 需要展开的层级id
  const expandRowKeys = ref<string[]>([])
  const dataList = computed(() => (isEmpty(treeList) ? [] : treeList))
  // 是否为树形结构
  const isTree = computed(() => {
    return dataList.value.some((item) => item.hasOwnProperty('children'))
  })
  const getExpandConfig = (showLevel?: number) =>
    computed(() => {
      const list = dataList.value
      // 每条数据的层级
      const level: number[] = []
      // 需要展开的层级id
      const rowKeys: string[] = []

      const getLevel = (n: number, list: Recordable[], showLevel?: number) => {
        const forFunc = () => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].hasOwnProperty('children')) {
              rowKeys.push(`${list[i].id}`)
              getLevel(n + 1, list[i].children, showLevel)
            } else {
              level.push(n)
            }
          }
          if (list.length === 0) {
            level.push(n)
          }
        }

        if (!n) n = 1
        if (showLevel) {
          if (n <= showLevel) {
            forFunc()
          }
        } else {
          forFunc()
        }
      }
      getLevel(0, list, showLevel)

      return {
        // 最大层级
        levelMax: level.length === 0 ? 0 : Math.max(...level),
        rowKeys
      }
    })
  watch(
    expandLevel,
    (val: number) => {
      if (!isTree.value) return
      const data = getExpandConfig(val)
      expandRowKeys.value = data.value.rowKeys
      wsCache.set(route.path, val)
    },
    { immediate: true }
  )
  // 获取最大层级数
  const expandLevelMax = computed(() => {
    if (!isTree.value) return []
    return getExpandConfig().value.levelMax
  })

  return {
    /** 最大层级数 */
    expandLevelMax,
    /** 当前展开层级 */
    expandLevel,
    /** 是否为树形 */
    isTree,
    /** 展开的层级id */
    expandKeys: expandRowKeys
  }
}
