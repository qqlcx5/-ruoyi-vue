import { cloneDeep } from 'lodash-es'

interface IOption {
  path: (val: object) => Promise<unknown>
  params: object
}
interface IResult {
  list: object[]
  total: number
}
export default function (option: IOption) {
  const loading = ref<boolean>(false)
  const list = ref<object[]>([])
  let cfmParams = cloneDeep(option.params)
  const getList = async (params?) => {
    try {
      if (params) {
        cfmParams = cloneDeep(params)
      }
      loading.value = true
      const resultData: IResult = (await option.path(cfmParams)) as IResult
      list.value = resultData.list
      option.params['total'] = resultData.total
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  getList()
  const pageChange = ({ pageNo, pageSize }) => {
    cfmParams = { ...cfmParams, pageNo, pageSize }
    console.log(cfmParams)
    getList()
  }

  return {
    loading,
    getList,
    pageChange,
    list,
    option
  }
}
