import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import { MenuTreeList } from '@/views/system/business/business'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
/**
 * 过滤树形结构 更改对应的属性值
 * @param    treeData array              树结构数组对象 其中对象 children属性可有可无
 * @param    reconstructedKey array     数组中嵌数组 里面的数组为需要替换的属性名以及替换后的属性名 举个例子 reconstructedKey= 第二个数组的值为为字符串
 * @returns  result array           result为传进来处理后的树 其中 children属性值至少为空数组
 *
 * */
export const reconstructedTreeData = (treeData: any, reconstructedKey: any = []) => {
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
  const mapTree = (org: any) => {
    //children为非空数组
    const haveChildren = Array.isArray(org.children) && org.children.length > 0
    const treeObj = {}
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
    const treeObj = {}
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
export const fuzzyQuery = (list: any, keyWord) => {
  const arr = []
  for (let i = 0; i < list.length; i++) {
    if (list[i].text.indexOf(keyWord) >= 0) {
      // @ts-ignore
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

//获取树结构所有自定义key
export const getAllCustomKeys = (tree, customKey) => {
  let result = []
  if (!Array.isArray(tree)) {
    return result
  }
  tree.forEach((node) => {
    // @ts-ignore
    result.push(node[customKey])
    if (Array.isArray(node.children)) {
      result = result.concat(getAllCustomKeys(node.children, customKey))
    }
  })
  return result
}

/**
 * 获取树结构所有自定义key
 * @param childId 当前自定义的 key 如id
 * @param treeData tree
 * @param customKey 自定义的 key
 * @return list 所有父节点id 不包括本身
 * */
export const getTreeAllCustomKeys = (
  childId: string | number,
  treeData: any,
  customKey: string | number
) => {
  const keys = []

  const traverse = (node) => {
    if (node[customKey] === childId) {
      return true
    }

    if (node.children) {
      for (const child of node.children) {
        if (traverse(child)) {
          keys.push(node[customKey])
          return true
        }
      }
    }

    return false
  }

  for (const node of treeData) {
    traverse(node)
  }

  return keys
}

/**
 * 获取当前节点的 所有子id
 * @param nodeId 当前id
 * @param menuItems 存在id与parentId的数组
 * @return list 所有父节点id
 * */
export const getAllChildIds = (nodeId: any, menuItems: any) => {
  const childIds: any = []
  menuItems.forEach((item) => {
    if (item.parentId === nodeId) {
      childIds.push(item.id)
      childIds.push(...getAllChildIds(item.id, menuItems))
    }
  })
  return childIds
}

/**
 * 获取所有父节点id
 * @param itemId 子级id
 * @param allMenuTreeArr 存在id与parentId的数组
 * @return list 所有父节点id
 * */
export const findParentIds = (itemId, allMenuTreeArr) => {
  const item = allMenuTreeArr.find((item) => item.id === itemId)
  return item && item.parentId !== null
    ? [item.id, ...findParentIds(item.parentId, allMenuTreeArr)]
    : []
}

//过滤树结构 获取新树
// export function filterTree(tree = [], map = [], arr = []) {
export function filterTree(
  tree: MenuTreeList[] = [],
  map: number[] = [],
  arr: MenuTreeList[] = []
) {
  if (!tree.length) return []
  for (const item of tree) {
    if (!map.includes(item.id)) continue
    const node = { ...item, children: [] }
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
 * @param changedColumnsObjKey       string          changedColumnsObj 自定义key
 * */
export const getColumns = (
  state: any,
  pageKey,
  allColumns,
  defaultKeys,
  changedColumnsObjKey = 'changedColumnsObj'
) => {
  //pageKey 为当前存储的页面
  const columnsObj = wsCache.get(CACHE_KEY.TABLE_COLUMNS_OBJ) || {}
  //有缓存 取缓存
  if (columnsObj[pageKey]) {
    state[changedColumnsObjKey] = columnsObj[pageKey]
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

/**
 * @param  permission   要判断的权限
 * @return  true/false
 * */
export const hasPermission = (permission: string) => {
  const permissionsList = wsCache.get(CACHE_KEY.USER).permissions
  return permissionsList.includes(permission)
}

interface ITimeList {
  startTime: string
  endTime: string
}
export const judgeTimeList = (dateArr: ITimeList[]) => {
  for (const k in dateArr) {
    if (!judge(k, dateArr)) {
      return false
    }
  }
  return true
}
const judge = (idx: any, dateArr: any) => {
  for (const k in dateArr) {
    if (idx !== k) {
      if (
        dateArr[k].startTime <= dateArr[idx].startTime &&
        dateArr[k].endTime > dateArr[idx].startTime
      ) {
        return false
      }
      if (
        dateArr[k].startTime < dateArr[idx].endTime &&
        dateArr[k].endTime >= dateArr[idx].endTime
      ) {
        return false
      }
    }
  }
  return true
}

export const dateFormat = (val, format = 'YYYY-MM-DD HH:mm:ss') => {
  try {
    return dayjs(val).format(format)
  } catch (e) {
    return val
  }
}

/**
 * @param  params       obj{key}  要判断K对应的V是否为空的对象
 * @param  paramsList   Array[obj{key,name}] key要判断的key name中文
 * @return  true/false
 * */
export const validateParams = (params, paramsList) => {
  const errors: any = []
  paramsList.forEach(({ key, name }) => {
    if (!params[key] || params[key] === '') {
      errors.push(name)
    }
  })
  if (errors.length > 0) {
    message.warning(`以下字段不能为空：${errors.join(', ')}`)
    return false
  }
  return true
}

/**
 * 数组对象查找 字符串(如、分割) 存在的项
 * @param  arr          []{any} 数组对象
 * @param  propName     string  要查找的键名
 * @param  propValue    x,x     要匹配的字符串
 * @param  separator    string  分隔符
 * @return []{any}
 * */
export const findByProperty = (arr, propName, propValue, separator = ',') => {
  const propArray = propValue.split(separator).map((item) => item.trim())
  return arr.filter((item) => propArray.includes(item[propName]))
}

/**
 * 数组对象 拼接字符串
 * @param   arr          []{any} 数组对象
 * @param   propName     string  要查找的键名
 * @param   separator    string  分割符
 * @return  string
 * */
export const joinProperty = (arr, propName, separator = ',') => {
  return arr.map((item) => item[propName]).join(separator)
}

/**
 * 过滤字典
 * @param   dictList    []{any} 数组对象
 * @param   dictKey     string  要过滤的键名
 * @return  Array       []{any} 数组对象
 * */
export const dictFilter = (dictList, dictKey) => {
  return dictList.filter((item) => item.dictType === dictKey)
}

/**
 * 将树形数据结构中符合自定义属性条件的节点的 needEs 属性设置为 true，其他节点的 needEs 属性设置为 false。
 * @param   treeData  []{any}  - 要更新的树形数据结构。
 * @param   customPropName string - 要匹配的自定义属性名称。
 * @param   customPropValue any - 要匹配的自定义属性值。
 * @param   needEsPropName string - 要设置的自定义属性名称。
 * @returns void
 */
export const setNeedEsPropertyByCustomProp = (
  treeData,
  customPropName,
  customPropValue,
  needEsPropName
) => {
  let nodeFound = false

  const traverse = (node) => {
    if (node[customPropName] === customPropValue) {
      node[needEsPropName] = true
      nodeFound = true
    } else if (node.hasOwnProperty(needEsPropName)) {
      node[needEsPropName] = false
    } else {
      node[needEsPropName] = false
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((childNode) => {
        traverse(childNode)
      })
    }
  }

  if (!customPropValue || customPropValue === '') {
    // If the custom property value is empty, set all needEs properties to false
    treeData.forEach((node) => {
      if (node.hasOwnProperty(needEsPropName)) {
        node[needEsPropName] = false
      } else {
        node[needEsPropName] = false
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((childNode) => {
          traverse(childNode)
        })
      }
    })
  } else {
    // Set the needEs property for the node with the given custom property value
    treeData.forEach((node) => {
      traverse(node)
    })

    if (!nodeFound) {
      console.warn(`Node with ${customPropName}=${customPropValue} not found`)
    }
  }
}
