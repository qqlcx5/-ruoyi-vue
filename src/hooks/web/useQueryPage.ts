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
  let cfmParams = option.params
  const getList = async (params?) => {
    try {
      if (params) {
        cfmParams = params
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
