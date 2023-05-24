<template>
  <VxeGrid
    v-bind="getProps"
    ref="xGrid"
    :class="`${prefixCls} ${themeCLass}`"
    class="xtable-scrollbar"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #toolbar_tools>
      <!-- 操作：操作table columns -->
      <WGTools v-bind="getProps" @toolClick="handleToolClick" />
    </template>
    <template #empty>
      <Empty />
    </template>
  </VxeGrid>
  <WGColumnDrawer
    v-model="drawerVisible"
    :table-key="getTableKey"
    :columns="getColumnSchema"
    @columnChange="handleColumnChange"
    @confirm="handleColumnChange"
    @reset="handleReset"
  />
</template>
<script setup lang="ts" name="XTable">
import { nextTick, PropType } from 'vue'
import { SizeType, VxeGridInstance } from 'vxe-table'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { XTableProps } from './type'
import { isBoolean, isFunction } from '@/utils/is'

import download from '@/utils/download'
import WGTools from '@/components/XTable/src/WGTools.vue'
import { getTableColumnConfig } from '@/utils/tableColumn'

const { t } = useI18n()
const message = useMessage() // 消息弹窗

const appStore = useAppStore()

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('x-vxe-table')

const attrs = useAttrs()
const emit = defineEmits(['register'])

let themeCLass = ref<String>('light')

watch(
  () => appStore.getIsDark,
  () => {
    if (appStore.getIsDark == true) {
      themeCLass.value = 'dark'
    } else {
      themeCLass.value = 'light'
    }
  },
  { immediate: true }
)

const currentSize = computed(() => {
  let resSize: SizeType = 'small'
  const appsize = appStore.getCurrentSize
  switch (appsize) {
    case 'large':
      resSize = 'medium'
      break
    case 'default':
      resSize = 'small'
      break
    case 'small':
      resSize = 'mini'
      break
  }
  return resSize
})

const props = defineProps({
  options: {
    type: Object as PropType<XTableProps>,
    default: () => {}
  }
})
const innerProps = ref<Partial<XTableProps>>()

const getProps = computed(() => {
  const options = innerProps.value || props.options

  options.size = currentSize as any
  options.height = innerProps.value?.height || 700
  getOptionInitConfig(options)
  getColumnsConfig(options)
  getProxyConfig(options)
  getPageConfig(options)
  getToolBarConfig(options)
  return {
    ...options,
    ...attrs
  }
})

const xGrid = ref<VxeGridInstance>() // 列表 Grid Ref

const getColumnSchema = computed(() => {
  return getProps.value?.allSchemas?.columnSchema
})
const getTableKey = computed(() => {
  return getProps.value?.tableKey
})

let drawerVisible = ref<boolean>(false)

const handleReset = async () => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  let originColumn = getProps.value?.allSchemas?.columnSchema
  let currentColumns = reactive<any>(g.columns)
  let newColumn: any[] = []
  originColumn.map((col) => {
    currentColumns.map((item) => {
      if (col.defaultShow !== false && item.field === col.field) {
        newColumn.push(item)
      }
    })
  })
  g.reloadColumn(newColumn)
  drawerVisible.value = false
}

const handleColumnChange = (columns): void => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  function sort(prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop]
      var val2 = obj2[prop]
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1)
        val2 = Number(val2)
      }
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    }
  }
  let currentColumns = reactive<any>(g.columns)
  currentColumns.forEach((item) => {
    let index = columns.findIndex((c) => c.field === item.field)
    item.sort = index
    item.check = index !== -1 ? columns[index].check : true
  })
  currentColumns = currentColumns.filter((col) => col.check).sort(sort('sort'))
  g.reloadColumn(currentColumns)
  drawerVisible.value = false
}

let proxyForm = false

const getOptionInitConfig = (options: XTableProps) => {
  options.size = currentSize as any
  options.rowConfig = {
    keyField: 'id',
    isCurrent: true, // 当鼠标点击行时，是否要高亮当前行
    isHover: true // 当鼠标移到行时，是否要高亮当前行
  }
}

// columns
const getColumnsConfig = (options: XTableProps) => {
  const { allSchemas } = options
  if (!allSchemas) return
  if (allSchemas.printSchema) {
    options.printConfig = {
      columns: allSchemas.printSchema
    }
  }
  if (allSchemas.formSchema) {
    proxyForm = true
    options.formConfig = {
      enabled: true,
      titleWidth: 100,
      titleAlign: 'right',
      items: allSchemas.searchSchema
    }
  }
  if (allSchemas.tableSchema) {
    options.columns = allSchemas.tableSchema
  }
}

// 动态请求
const getProxyConfig = (options: XTableProps) => {
  const { getListApi, proxyConfig, data, isList } = options
  if (proxyConfig || data) return
  if (getListApi && isFunction(getListApi)) {
    if (!isList) {
      options.proxyConfig = {
        seq: true, // 启用动态序号代理（分页之后索引自动计算为当前页的起始序号）
        form: proxyForm, // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
        props: { result: 'list', total: 'total' },
        ajax: {
          query: async ({ page, form }) => {
            let queryParams: any = Object.assign({}, JSON.parse(JSON.stringify(form)))
            if (options.params) {
              queryParams = Object.assign(queryParams, options.params)
            }
            if (!options?.treeConfig) {
              queryParams.pageSize = page.pageSize
              queryParams.pageNo = page.currentPage
            }
            return new Promise(async (resolve) => {
              resolve(await getListApi(queryParams))
            })
          },
          delete: ({ body }) => {
            return new Promise(async (resolve) => {
              if (options.deleteApi) {
                resolve(await options.deleteApi(JSON.stringify(body)))
              } else {
                Promise.reject('未设置deleteApi')
              }
            })
          },
          queryAll: ({ form }) => {
            const queryParams = Object.assign({}, JSON.parse(JSON.stringify(form)))
            return new Promise(async (resolve) => {
              if (options.getAllListApi) {
                resolve(await options.getAllListApi(queryParams))
              } else {
                resolve(await getListApi(queryParams))
              }
            })
          }
        }
      }
    } else {
      options.proxyConfig = {
        seq: true, // 启用动态序号代理（分页之后索引自动计算为当前页的起始序号）
        form: true, // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
        props: { result: 'data' },
        ajax: {
          query: ({ form }) => {
            let queryParams: any = Object.assign({}, JSON.parse(JSON.stringify(form)))
            if (options?.params) {
              queryParams = Object.assign(queryParams, options.params)
            }
            return new Promise(async (resolve) => {
              resolve(await getListApi(queryParams))
            })
          }
        }
      }
    }
  }
  if (options.exportListApi) {
    options.exportConfig = {
      filename: options?.exportName,
      // 默认选中类型
      type: 'csv',
      // 自定义数据量列表
      modes: options?.getAllListApi ? ['current', 'all'] : ['current'],
      columns: options?.allSchemas?.printSchema
    }
  }
}

// 分页
const getPageConfig = (options: XTableProps) => {
  const { pagination, pagerConfig, treeConfig, isList } = options
  if (isList) return
  if (treeConfig) {
    options.treeConfig = options.treeConfig
    return
  }
  if (pagerConfig) return
  if (pagination) {
    if (isBoolean(pagination)) {
      options.pagerConfig = {
        border: false, // 带边框
        background: false, // 带背景颜色
        perfect: false, // 配套的样式
        pageSize: 10, // 每页大小
        pagerCount: 7, // 显示页码按钮的数量
        autoHidden: false, // 当只有一页时自动隐藏
        pageSizes: [5, 10, 20, 30, 50, 100], // 每页大小选项列表
        layouts: [
          'PrevJump',
          'PrevPage',
          'JumpNumber',
          'NextPage',
          'NextJump',
          'Sizes',
          'FullJump',
          'Total'
        ]
      }
      return
    }
    options.pagerConfig = pagination
  } else {
    if (pagination != false) {
      options.pagerConfig = {
        border: false, // 带边框
        background: false, // 带背景颜色
        perfect: false, // 配套的样式
        pageSize: 10, // 每页大小
        pagerCount: 7, // 显示页码按钮的数量
        autoHidden: false, // 当只有一页时自动隐藏
        pageSizes: [5, 10, 20, 30, 50, 100], // 每页大小选项列表
        // pageSizes: [
        //   { label: '5条/页', value: 5 },
        //   { label: '10条/页', value: 10 },
        //   { label: '15条/页', value: 15 },
        //   { label: '20条/页', value: 20 },
        //   { label: '25条/页', value: 25 },
        //   { label: '30条/页', value: 30 },
        //   { label: '35条/页', value: 35 },
        //   { label: '40条/页', value: 40 },
        //   { label: '45条/页', value: 45 },
        //   { label: '50条/页', value: 50 },
        //   { label: '100条/页', value: 100 },
        //   { label: '200条/页', value: 200 },
        //   { label: '300条/页', value: 300 },
        //   { label: '500条/页', value: 500 },
        //   { label: '1000条/页', value: 1000 }
        // ], // 每页大小选项列表
        // className: 'wg-xtable-pagination',
        layouts: [
          'Sizes',
          'Total',
          'PrevJump',
          'PrevPage',
          'Number',
          'NextPage',
          'NextJump',
          'FullJump'
        ]
      }
    }
  }
}

// tool bar
const getToolBarConfig = (options: XTableProps) => {
  const { toolBar, toolbarConfig, topActionSlots } = options
  if (toolbarConfig) return
  if (toolBar) {
    if (!isBoolean(toolBar)) {
      options.toolbarConfig = toolBar
      return
    }
  } else if (topActionSlots != false) {
    options.toolbarConfig = {
      slots: { buttons: 'toolbar_buttons', tools: 'toolbar_tools' }
    }
  } else {
    options.toolbarConfig = {
      enabled: true
    }
  }
}

const handleToolClick = (key): void => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  g.setCheckboxRow([{ id: 146 }], true)
  switch (key) {
    case 'print':
      exportList()
      break
    case 'refresh':
      reload()
      break
    case 'fullScreen':
      g.zoom()
      break
    case 'custom':
      drawerVisible.value = true
      break
  }
}

// 刷新列表
const reload = () => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  g.commitProxy('query')
}

// 删除
const deleteData = async (id: string | number, msg?: string | VNode | (() => VNode)) => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  const options = innerProps.value || props.options
  if (!options.deleteApi) {
    console.error('未传入delListApi')
    return
  }
  return new Promise(async () => {
    message.delConfirm(msg).then(async () => {
      await (options?.deleteApi && options?.deleteApi(id))
      message.success(t('common.delSuccess'))
      // 刷新列表
      reload()
    })
  })
}

// 删除api
const deleteReq = async (id: string | number) => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  const options = innerProps.value || props.options
  if (!options.deleteApi) {
    console.error('未传入delListApi')
    return
  }
  await (options?.deleteApi && options?.deleteApi(id))
  message.success(t('common.delSuccess'))
  // 刷新列表
  await reload()
}

// 批量删除
const deleteBatch = async () => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  const rows = g.getCheckboxRecords() || g.getRadioRecord()
  let ids: any[] = []
  if (rows.length == 0) {
    message.error('请选择数据')
    return
  } else {
    rows.forEach((row) => {
      ids.push(row.id)
    })
  }
  const options = innerProps.value || props.options
  if (options.deleteListApi) {
    return new Promise(async () => {
      message.delConfirm().then(async () => {
        await (options?.deleteListApi && options?.deleteListApi(ids))
        message.success(t('common.delSuccess'))
        // 刷新列表
        reload()
      })
    })
  } else if (options.deleteApi) {
    return new Promise(async () => {
      message.delConfirm().then(async () => {
        ids.forEach(async (id) => {
          await (options?.deleteApi && options?.deleteApi(id))
        })
        message.success(t('common.delSuccess'))
        // 刷新列表
        reload()
      })
    })
  } else {
    console.error('未传入delListApi')
    return
  }
}

// 导出
const exportList = async (fileName?: string) => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  const options = innerProps.value || props.options
  if (!options?.exportListApi) {
    console.error('未传入exportListApi')
    return
  }
  const queryParams = Object.assign({}, JSON.parse(JSON.stringify(g.getProxyInfo()?.form)))
  message.exportConfirm().then(async () => {
    const res = await (options?.exportListApi && options?.exportListApi(queryParams))
    download.excel(res as unknown as Blob, fileName ? fileName : 'excel.xls')
  })
}

// 获取查询参数
const getSearchData = () => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  const queryParams = Object.assign({}, JSON.parse(JSON.stringify(g.getProxyInfo()?.form)))
  return queryParams
}

// 获取当前列
const getCurrentColumn = () => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  return g.getCurrentColumn()
}

// 获取当前选中列，redio
const getRadioRecord = () => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  return g.getRadioRecord() || g.getRadioReserveRecord()
}

// 获取当前选中列，checkbox
const getCheckboxRecords = () => {
  const g = unref(xGrid)
  if (!g) {
    return []
  }
  const currentRecords = g.getCheckboxRecords()
  const reserveRecords = g.getCheckboxReserveRecords()
  return [...currentRecords, ...reserveRecords]
}

// 设置选中行
const setCheckboxRow = (row) => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  g.setCheckboxRow(row, true)
}

// 设置选中行
const setRadioRow = (row) => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  g.setRadioRow(row)
}

const setProps = (prop: Partial<XTableProps>) => {
  innerProps.value = { ...unref(innerProps), ...prop }
}

const columnInit = () => {
  nextTick(() => {
    if (getTableKey.value) {
      const columnConfig = getTableColumnConfig(getTableKey.value, getColumnSchema.value)
      if (columnConfig) {
        handleColumnChange(columnConfig)
      } else {
        // handleReset()
      }
    }
  })
}

onMounted(() => {
  columnInit()
})

defineExpose({
  reload,
  Ref: xGrid,
  getSearchData,
  deleteData,
  exportList,
  deleteReq,
  setCheckboxRow,
  setRadioRow
})
emit('register', {
  reload,
  getSearchData,
  setProps,
  deleteData,
  deleteReq,
  deleteBatch,
  exportList,
  getCurrentColumn,
  getRadioRecord,
  getCheckboxRecords,
  setCheckboxRow,
  setRadioRow
})
</script>
<style lang="scss">
@import './style/index.scss';
.xtable-scrollbar {
  .vxe-toolbar {
    padding: 0 0 16px 0;
  }
}
</style>
