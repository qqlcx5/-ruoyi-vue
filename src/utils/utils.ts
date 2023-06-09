import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import { MenuTreeList } from '@/views/system/business/business'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()

/**
 * 过滤树形结构 更改对应的属性值
 * @param    treeData array              树结构数组对象 其中对象 children属性可有可无
 * @param    reconstructedKey array     数组中嵌数组 里面的数组为需要替换的属性名以及替换后的属性名 举个例子 reconstructedKey= 第二个数组的值为为字符串
 * @returns  result array           result为传进来处理后的树 其中 children属性值至少为空数组
 *
 * */
export const reconstructedTreeData = (treeData, reconstructedKey = []) => {
  if (Array.isArray(reconstructedKey) && reconstructedKey.length < 2) {
    //非数组
    console.log('请传入正确的reconstructedKey')
    return []
  } else {
    //数组但长度不为2
    const isTure = reconstructedKey.every((item) => {
      return item.length === 2
    })
    if (!isTure) {
      console.log('请传入正确的reconstructedKey')
      return []
    }
  }
  const mapTree = (org) => {
    //children为非空数组
    const haveChildren = Array.isArray(org.children) && org.children.length > 0
    let treeObj = {}
    reconstructedKey.map((item) => {
      treeObj[item[0]] = org[item[1]]
      treeObj['children'] = haveChildren ? org.children.map((i) => mapTree(i)) : []
    })
    return treeObj
  }
  let result = []
  result = treeData.map((org) => mapTree(org))
  return result
}

/**
 * 过滤数组对象 更改对应的属性值
 * @param arr  array             数组对象
 * @param reconstructedKey array 该数组为需要替换的属性名以及替换后的属性名 举个例子[['text','categoryName'],['value','warehouseId']] 第二个数组的值为为字符串
 * @returns [{}]           array  返回数组对象
 */
export const reconstructionArrayObject = (arr, reconstructedKey) => {
  return arr.map((item) => {
    let treeObj = {}
    reconstructedKey.map((reconstructedKeyItem) => {
      treeObj[reconstructedKeyItem[0]] = item[reconstructedKeyItem[1]]
    })
    return treeObj
  })
}

/**
 * 使用indexof方法实现模糊查询
 * @param  {Array}  list     进行查询的数组
 * @param  {String} keyWord  查询的关键词
 * @return {Array}           查询的结果
 */
export const fuzzyQuery = (list, keyWord) => {
  let arr = []
  for (let i = 0; i < list.length; i++) {
    if (list[i].text.indexOf(keyWord) >= 0) {
      arr.push(list[i])
    }
  }
  return arr
}

//获取树结构所有id
export const getAllIds = (tree) => {
  let result = []
  if (!Array.isArray(tree)) {
    return result
  }
  tree.forEach((node) => {
    // @ts-ignore
    result.push(node.id)
    if (Array.isArray(node.children)) {
      result = result.concat(getAllIds(node.children))
    }
  })
  return result
}

//过滤树结构 获取新树
// export function filterTree(tree = [], map = [], arr = []) {
export function filterTree(
  tree: MenuTreeList[] = [],
  map: number[] = [],
  arr: MenuTreeList[] = []
) {
  if (!tree.length) return []
  for (let item of tree) {
    if (!map.includes(item.id)) continue
    let node = { ...item, children: [] }
    arr.push(node)
    if (item.children && item.children.length) filterTree(item.children, map, node.children)
  }
  return arr
}

//获取默认的columns
/**
 * @param state[changedColumnsObj]   Array[Object]   定制列组件接收到的当前列信息
 * @param pageKey                    String          页面pageKey
 * @param allColumns                 Array[Object]   table columns
 * @param defaultKeys                Array[String]   定制列默认的keys
 * */
export const getColumns = (state, pageKey, allColumns, defaultKeys) => {
  //pageKey 为当前存储的页面
  const columnsObj = wsCache.get(CACHE_KEY.TABLE_COLUMNS_OBJ) || {}
  //有缓存 取缓存
  if (columnsObj[pageKey]) {
    state.changedColumnsObj = columnsObj[pageKey]
    return columnsObj[pageKey].currentColumns
  }
  const currentColumns = allColumns.filter((columnsItem) => {
    return defaultKeys.some((item) => columnsItem.key === item)
  })
  return currentColumns
}

// @ts-ignore
/**
 * 用于统计所有树节点和 并向树节点添加子节点的数量
 * @param  data 树
 * @param  countField  计数名 默认为count
 * */
// 设置每个节点的统计字段,并返回所有节点总数。
export const toTreeCount = (data = [], countField = 'count') =>
  data.reduce(
    (total, cur) => total + (cur[countField] = toTreeCount(cur.children || [], countField)),
    data.length
  )

//全屏/退出
export const fullScreen = () => {
  const elem = document.getElementById('card-content')
  // TODO ESC 与F11  退出全屏需要监听
  // if (state.isFullScreen === false) {
  if (!appStore.getIsFullScreen) {
    if (elem?.requestFullscreen) {
      elem?.requestFullscreen()
      appStore.setIsFullScreen(!appStore.getIsFullScreen)
    }
  } else {
    document.exitFullscreen()
    appStore.setIsFullScreen(!appStore.getIsFullScreen)
  }
}
