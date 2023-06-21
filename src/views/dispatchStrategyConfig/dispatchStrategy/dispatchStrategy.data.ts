import type { VxeCrudSchema } from '@/hooks/web/useVxeCrudSchemas'

// 表单校验
export const rules = reactive({
  clueChannelId: [required]
})
// CrudSchema
const crudSchemas = reactive<VxeCrudSchema>({
  action: true,
  actionWidth: '300px',
  columns: [
    {
      title: '线索渠道',
      field: 'clueChannelId',
      form: {
        colProps: {
          span: 24
        }
      },
      disabled: true
    },
    {
      title: '线索清洗员',
      field: 'filterUserId',
      form: {
        colProps: {
          span: 24
        }
      },
      disabled: true
    },
    {
      title: '派发门店配置',
      field: 'distributeShopIdList',
      form: {
        colProps: {
          span: 24
        }
      },
      disabled: true
    }
  ]
})
export const { allSchemas } = useVxeCrudSchemas(crudSchemas)

export const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          },
          {
            value: 'efficiency',
            label: 'Efficiency'
          },
          {
            value: 'controllability',
            label: 'Controllability'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation'
          },
          {
            value: 'top nav',
            label: 'Top Navigation'
          }
        ]
      }
    ]
  }
]

export const oa_source_res = {
  total: 1,
  list: [
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '官网活动',
              clueSourceId: '1670003',
              parentId: '1670002'
            },
            {
              children: [],
              clueName: '官网试驾',
              clueSourceId: '1670004',
              parentId: '1670002'
            },
            {
              children: [],
              clueName: '官网在线客服',
              clueSourceId: '1670005',
              parentId: '1670002'
            }
          ],
          clueName: '厂家官网',
          clueSourceId: '1670002',
          parentId: '1670001'
        },
        {
          children: [
            {
              children: [],
              clueName: '金融-官网',
              clueSourceId: '1670007',
              parentId: '1670006'
            },
            {
              children: [],
              clueName: '金融-微信',
              clueSourceId: '1670008',
              parentId: '1670006'
            }
          ],
          clueName: '长城金融',
          clueSourceId: '1670006',
          parentId: '1670001'
        },
        {
          children: [
            {
              children: [],
              clueName: '400语音自助',
              clueSourceId: '1670010',
              parentId: '1670009'
            },
            {
              children: [],
              clueName: '厂家400咨询',
              clueSourceId: '1670011',
              parentId: '1670009'
            }
          ],
          clueName: '厂家400',
          clueSourceId: '1670009',
          parentId: '1670001'
        },
        {
          children: [
            {
              children: [],
              clueName: 'APP在线客服',
              clueSourceId: '1670013',
              parentId: '1670012'
            }
          ],
          clueName: 'APP',
          clueSourceId: '1670012',
          parentId: '1670001'
        },
        {
          children: [
            {
              children: [],
              clueName: '天猫优惠活动',
              clueSourceId: '1670015',
              parentId: '1670014'
            },
            {
              children: [],
              clueName: '天猫订单',
              clueSourceId: '1670016',
              parentId: '1670014'
            },
            {
              children: [],
              clueName: '天猫精品',
              clueSourceId: '1670017',
              parentId: '1670014'
            }
          ],
          clueName: '天猫',
          clueSourceId: '1670014',
          parentId: '1670001'
        },
        {
          children: [
            {
              children: [],
              clueName: '网上4S店-活动',
              clueSourceId: '1670019',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城-置换',
              clueSourceId: '1670020',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城在线客服',
              clueSourceId: '1670021',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城配件',
              clueSourceId: '1670022',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城精品',
              clueSourceId: '1670023',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '网上4S店-置换',
              clueSourceId: '1670024',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城-询价',
              clueSourceId: '1670025',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城-400',
              clueSourceId: '1670026',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城-试驾',
              clueSourceId: '1670027',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城-预售',
              clueSourceId: '1670028',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: 'ECP订单',
              clueSourceId: '1670029',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '微店-订单',
              clueSourceId: '1670030',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '微店-活动',
              clueSourceId: '1670031',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '微店-试驾',
              clueSourceId: '1670032',
              parentId: '1670018'
            },
            {
              children: [],
              clueName: '商城优惠活动',
              clueSourceId: '1670033',
              parentId: '1670018'
            }
          ],
          clueName: '商城',
          clueSourceId: '1670018',
          parentId: '1670001'
        }
      ],
      clueName: '厂家线索',
      clueSourceId: '1670001',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '老客户介绍',
              clueSourceId: '1670036',
              parentId: '1670035'
            },
            {
              children: [],
              clueName: '亲友介绍',
              clueSourceId: '1670037',
              parentId: '1670035'
            }
          ],
          clueName: '主动开发',
          clueSourceId: '1670035',
          parentId: '1670034'
        }
      ],
      clueName: '主动开发',
      clueSourceId: '1670034',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '老客户介绍',
              clueSourceId: '1670040',
              parentId: '1670039'
            }
          ],
          clueName: '老客户介绍',
          clueSourceId: '1670039',
          parentId: '1670038'
        }
      ],
      clueName: '老客户介绍',
      clueSourceId: '1670038',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '市场活动',
              clueSourceId: '1670043',
              parentId: '1670042'
            },
            {
              children: [],
              clueName: '万达类商超定展',
              clueSourceId: '1670044',
              parentId: '1670042'
            }
          ],
          clueName: '市场活动',
          clueSourceId: '1670042',
          parentId: '1670041'
        }
      ],
      clueName: '市场活动',
      clueSourceId: '1670041',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '其他',
              clueSourceId: '1670047',
              parentId: '1670046'
            }
          ],
          clueName: '其他',
          clueSourceId: '1670046',
          parentId: '1670045'
        }
      ],
      clueName: '其他',
      clueSourceId: '1670045',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '自然进店',
              clueSourceId: '1670050',
              parentId: '1670049'
            }
          ],
          clueName: '自然进店',
          clueSourceId: '1670049',
          parentId: '1670048'
        }
      ],
      clueName: '自然进店',
      clueSourceId: '1670048',
      parentId: '0'
    },
    {
      children: [
        {
          children: [
            {
              children: [],
              clueName: '易车网-置换',
              clueSourceId: '1670053',
              parentId: '1670052'
            },
            {
              children: [],
              clueName: '易车网-试驾',
              clueSourceId: '1670054',
              parentId: '1670052'
            },
            {
              children: [],
              clueName: '易车网-询价',
              clueSourceId: '1670055',
              parentId: '1670052'
            },
            {
              children: [],
              clueName: '易车网-400',
              clueSourceId: '1670056',
              parentId: '1670052'
            }
          ],
          clueName: '易车网',
          clueSourceId: '1670052',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '优信车伯乐',
              clueSourceId: '1670058',
              parentId: '1670057'
            }
          ],
          clueName: '优信车伯乐',
          clueSourceId: '1670057',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '爱卡汽车-询价',
              clueSourceId: '1670060',
              parentId: '1670059'
            },
            {
              children: [],
              clueName: '爱卡汽车-400',
              clueSourceId: '1670061',
              parentId: '1670059'
            }
          ],
          clueName: '爱卡汽车',
          clueSourceId: '1670059',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '汽车之家-试驾',
              clueSourceId: '1670063',
              parentId: '1670062'
            },
            {
              children: [],
              clueName: '汽车之家-400',
              clueSourceId: '1670064',
              parentId: '1670062'
            },
            {
              children: [],
              clueName: '汽车之家-询价',
              clueSourceId: '1670065',
              parentId: '1670062'
            }
          ],
          clueName: '汽车之家',
          clueSourceId: '1670062',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '太平洋-400',
              clueSourceId: '1670067',
              parentId: '1670066'
            },
            {
              children: [],
              clueName: '太平洋-询价',
              clueSourceId: '1670068',
              parentId: '1670066'
            },
            {
              children: [],
              clueName: '太平洋-试驾',
              clueSourceId: '1670069',
              parentId: '1670066'
            },
            {
              children: [],
              clueName: '太平洋-促销',
              clueSourceId: '1670070',
              parentId: '1670066'
            },
            {
              children: [],
              clueName: '太平洋-置换',
              clueSourceId: '1670071',
              parentId: '1670066'
            }
          ],
          clueName: '太平洋汽车网',
          clueSourceId: '1670066',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '懂车帝-询价',
              clueSourceId: '1670073',
              parentId: '1670072'
            },
            {
              children: [],
              clueName: '懂车帝-400',
              clueSourceId: '1670074',
              parentId: '1670072'
            }
          ],
          clueName: '懂车帝',
          clueSourceId: '1670072',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '腾讯汽车',
              clueSourceId: '1670076',
              parentId: '1670075'
            }
          ],
          clueName: '腾讯汽车',
          clueSourceId: '1670075',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '新浪汽车',
              clueSourceId: '1670078',
              parentId: '1670077'
            }
          ],
          clueName: '新浪汽车',
          clueSourceId: '1670077',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '行圆-置换',
              clueSourceId: '1670080',
              parentId: '1670079'
            },
            {
              children: [],
              clueName: '行圆智慧云',
              clueSourceId: '1670081',
              parentId: '1670079'
            },
            {
              children: [],
              clueName: '行圆-新车',
              clueSourceId: '1670082',
              parentId: '1670079'
            },
            {
              children: [
                {
                  children: [],
                  clueName: '行圆-试驾-test',
                  clueSourceId: '1670090',
                  parentId: '1670083'
                }
              ],
              clueName: '行圆-试驾',
              clueSourceId: '1670083',
              parentId: '1670079'
            }
          ],
          clueName: '行圆',
          clueSourceId: '1670079',
          parentId: '1670051'
        },
        {
          children: [
            {
              children: [],
              clueName: '百度有驾-询价',
              clueSourceId: '1670085',
              parentId: '1670084'
            }
          ],
          clueName: '百度有驾',
          clueSourceId: '1670084',
          parentId: '1670051'
        }
      ],
      clueName: '垂直媒体',
      clueSourceId: '1670051',
      parentId: '0'
    },
    {
      children: [],
      clueName: '销售热线',
      clueSourceId: '1670086',
      parentId: '0'
    }
  ],
  message: 'SUCCESS',
  sign: '',
  status: 200,
  timestamp: 0
}

export const dispatch_strategy_res = {
  data: {
    endRow: 10,
    hasNextPage: true,
    hasPreviousPage: false,
    isFirstPage: true,
    isLastPage: false,
    list: [
      {
        autoBrandNames: '',
        autoSeriesNames: '',
        clueChannelId: '168154',
        clueChannelName: '垂直媒体-汽车之家',
        clueDistributeUserDTOList: [],
        createBy: '沈月凤',
        createTime: '2022-06-29 14:25:25',
        distributeShopList: [
          {
            distributeShopId: '140656',
            distributeShopName: '同安哈弗蓝标4S店',
            distributeUserNum: 3,
            isExternalDistribute: 1,
            status: 1
          },
          {
            distributeShopId: '140634',
            distributeShopName: '后溪哈弗红蓝标4S店',
            distributeUserNum: 4,
            isExternalDistribute: 1,
            status: 1
          },
          {
            distributeShopId: '140612',
            distributeShopName: '中埔哈弗红蓝标4S店',
            distributeUserNum: 6,
            isExternalDistribute: 0,
            status: 1
          }
        ],
        distributeShopName: '',
        distributeUserName: '',
        filterUserId: '180001',
        filterUserName: '沈月凤-销售顾问(oa)',
        id: '176731',
        parentId: '140611',
        parentName: '厦门分公司',
        receivePattern: 3,
        receivePatternName: '团队接单模式',
        shopId: '140612',
        shopName: '中埔哈弗红蓝标4S店'
      },
      {
        autoBrandNames: '',
        autoSeriesNames: '',
        clueChannelId: '168155',
        clueChannelName: '垂直媒体-懂车帝',
        clueDistributeUserDTOList: [],
        createBy: '沈月凤',
        createTime: '2022-07-06 17:54:24',
        distributeShopList: [
          {
            distributeShopId: '140656',
            distributeShopName: '同安哈弗蓝标4S店',
            distributeUserNum: 3,
            isExternalDistribute: 1,
            status: 1
          },
          {
            distributeShopId: '140634',
            distributeShopName: '后溪哈弗红蓝标4S店',
            distributeUserNum: 4,
            isExternalDistribute: 0,
            status: 1
          },
          {
            distributeShopId: '140612',
            distributeShopName: '中埔哈弗红蓝标4S店',
            distributeUserNum: 6,
            isExternalDistribute: 1,
            status: 1
          }
        ],
        distributeShopName: '',
        distributeUserName: '',
        filterUserId: '148474',
        filterUserName: '赵梦交-电销专员',
        id: '263634',
        parentId: '140611',
        parentName: '厦门分公司',
        receivePattern: 3,
        receivePatternName: '团队接单模式',
        shopId: '140634',
        shopName: '后溪哈弗红蓝标4S店'
      },
      {
        autoBrandNames: '',
        autoSeriesNames: '',
        clueChannelId: '263641',
        clueChannelName: '垂直媒体-汽车之家',
        clueDistributeUserDTOList: [],
        createBy: '沈月凤',
        createTime: '2022-07-06 17:58:32',
        distributeShopList: [
          {
            distributeShopId: '140656',
            distributeShopName: '同安哈弗蓝标4S店',
            distributeUserNum: 3,
            isExternalDistribute: 1,
            status: 1
          },
          {
            distributeShopId: '140634',
            distributeShopName: '后溪哈弗红蓝标4S店',
            distributeUserNum: 4,
            isExternalDistribute: 0,
            status: 1
          },
          {
            distributeShopId: '140612',
            distributeShopName: '中埔哈弗红蓝标4S店',
            distributeUserNum: 6,
            isExternalDistribute: 1,
            status: 1
          }
        ],
        distributeShopName: '',
        distributeUserName: '',
        filterUserId: '148474',
        filterUserName: '赵梦交-电销专员',
        id: '263642',
        parentId: '140611',
        parentName: '厦门分公司',
        receivePattern: 3,
        receivePatternName: '团队接单模式',
        shopId: '140634',
        shopName: '后溪哈弗红蓝标4S店'
      },
      {
        autoBrandNames: '',
        autoSeriesNames: '',
        clueChannelId: '6364140612',
        clueChannelName: '自媒体-抖音',
        clueDistributeUserDTOList: [],
        createBy: '董建强',
        createTime: '2022-10-10 08:59:47',
        distributeShopList: [
          {
            distributeShopId: '140612',
            distributeShopName: '中埔哈弗红蓝标4S店',
            distributeUserNum: 6,
            isExternalDistribute: 0,
            status: 1
          }
        ],
        distributeShopName: '',
        distributeUserName: '',
        filterUserId: '148164',
        filterUserName: '池小妹-电销专员',
        id: '897759',
        parentId: '140611',
        parentName: '厦门分公司',
        receivePattern: 3,
        receivePatternName: '团队接单模式',
        shopId: '140612',
        shopName: '中埔哈弗红蓝标4S店'
      },
      {
        autoBrandNames: '',
        autoSeriesNames: '',
        clueChannelId: '967599',
        clueChannelName: '主动开发-线下外拓-商超展示',
        clueDistributeUserDTOList: [],
        createBy: '沈月凤',
        createTime: '2022-10-21 11:18:57',
        distributeShopList: [
          {
            distributeShopId: '140612',
            distributeShopName: '中埔哈弗红蓝标4S店',
            distributeUserNum: 6,
            isExternalDistribute: 0,
            status: 1
          }
        ],
        distributeShopName: '',
        distributeUserName: '',
        filterUserId: '548002',
        filterUserName: 'H5-清洗员-线索清洗员',
        id: '967604',
        parentId: '140611',
        parentName: '厦门分公司',
        receivePattern: 2,
        receivePatternName: '混合模式',
        shopId: '140612',
        shopName: '中埔哈弗红蓝标4S店'
      },
      {
        autoBrandNames: '',
        autoSeriesNames: '',
        clueChannelId: '980470',
        clueChannelName: '垂直媒体-有驾',
        clueDistributeUserDTOList: [],
        createBy: '陈海疆',
        createTime: '2022-10-22 17:24:13',
        distributeShopList: [
          {
            distributeShopId: '140612',
            distributeShopName: '中埔哈弗红蓝标4S店',
            distributeUserNum: 6,
            isExternalDistribute: 0,
            status: 1
          }
        ],
        distributeShopName: '',
        distributeUserName: '',
        filterUserId: '548005',
        filterUserName: '测试-清洗员-线索清洗员',
        id: '980500',
        parentId: '140611',
        parentName: '厦门分公司',
        receivePattern: 2,
        receivePatternName: '混合模式',
        shopId: '140612',
        shopName: '中埔哈弗红蓝标4S店'
      },
      {
        autoBrandNames: '',
        autoSeriesNames: '',
        clueChannelId: '168152',
        clueChannelName: '主动开发-老客户介绍',
        clueDistributeUserDTOList: [],
        createBy: '董建强',
        createTime: '2022-10-26 09:03:15',
        distributeShopList: [
          {
            distributeShopId: '140612',
            distributeShopName: '中埔哈弗红蓝标4S店',
            distributeUserNum: 6,
            isExternalDistribute: 0,
            status: 1
          }
        ],
        distributeShopName: '',
        distributeUserName: '',
        filterUserId: '548003',
        filterUserName: 'Android-清洗员-线索清洗员',
        id: '994651',
        parentId: '140611',
        parentName: '厦门分公司',
        receivePattern: 1,
        receivePatternName: '配置模式',
        shopId: '140612',
        shopName: '中埔哈弗红蓝标4S店'
      },
      {
        autoBrandNames: '',
        autoSeriesNames: '',
        clueChannelId: '6366140612',
        clueChannelName: '自媒体-微博',
        clueDistributeUserDTOList: [],
        createBy: '董建强',
        createTime: '2022-10-26 09:05:07',
        distributeShopList: [
          {
            distributeShopId: '140612',
            distributeShopName: '中埔哈弗红蓝标4S店',
            distributeUserNum: 6,
            isExternalDistribute: 0,
            status: 1
          }
        ],
        distributeShopName: '',
        distributeUserName: '',
        filterUserId: '148164',
        filterUserName: '池小妹-电销专员',
        id: '994669',
        parentId: '140611',
        parentName: '厦门分公司',
        receivePattern: 3,
        receivePatternName: '团队接单模式',
        shopId: '140612',
        shopName: '中埔哈弗红蓝标4S店'
      },
      {
        autoBrandNames: '',
        autoSeriesNames: '',
        clueChannelId: '1023151',
        clueChannelName: '主动开发-线下外拓-商超展示',
        clueDistributeUserDTOList: [],
        createBy: '小坤',
        createTime: '2022-10-27 19:33:02',
        distributeShopList: [
          {
            distributeShopId: '140656',
            distributeShopName: '同安哈弗蓝标4S店',
            distributeUserNum: 3,
            isExternalDistribute: 0,
            status: 1
          }
        ],
        distributeShopName: '',
        distributeUserName: '',
        filterUserId: '148649',
        filterUserName: '黄凤华-销售顾问(oa)',
        id: '1023152',
        parentId: '140611',
        parentName: '厦门分公司',
        receivePattern: 2,
        receivePatternName: '混合模式',
        shopId: '140656',
        shopName: '同安哈弗蓝标4S店'
      },
      {
        autoBrandNames: '',
        autoSeriesNames: '',
        clueChannelId: '913552',
        clueChannelName: '垂直媒体-汽车之家',
        clueDistributeUserDTOList: [],
        createBy: '柯圣杰',
        createTime: '2022-12-09 09:15:30',
        distributeShopList: [
          {
            distributeShopId: '140656',
            distributeShopName: '同安哈弗蓝标4S店',
            distributeUserNum: 3,
            isExternalDistribute: 0,
            status: 1
          },
          {
            distributeShopId: '140634',
            distributeShopName: '后溪哈弗红蓝标4S店',
            distributeUserNum: 4,
            isExternalDistribute: 0,
            status: 1
          },
          {
            distributeShopId: '140612',
            distributeShopName: '中埔哈弗红蓝标4S店',
            distributeUserNum: 6,
            isExternalDistribute: 0,
            status: 1
          }
        ],
        distributeShopName: '',
        distributeUserName: '',
        filterUserId: '548004',
        filterUserName: 'iOS-清洗员-线索清洗员',
        id: '1346756',
        parentId: '140611',
        parentName: '厦门分公司',
        receivePattern: 1,
        receivePatternName: '配置模式',
        shopId: '140656',
        shopName: '同安哈弗蓝标4S店'
      }
    ],
    navigateFirstPage: 1,
    navigateLastPage: 7,
    navigatePages: 8,
    navigatepageNums: [1, 2, 3, 4, 5, 6, 7],
    nextPage: 2,
    pageNum: 1,
    pageSize: 10,
    pages: 7,
    prePage: 0,
    size: 10,
    startRow: 1,
    total: 64
  },
  message: 'SUCCESS',
  sign: '',
  status: 200,
  timestamp: null
}

export const aaaaa = {
  data: [
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '三明分公司-三明哈弗红蓝标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140403',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140402',
          companyName: '三明分公司',
          companyShopName: '',
          id: '74',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140403',
          shopName: '三明哈弗红蓝标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '柑温泉州分公司-柑温汽车常泰店1',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '813676',
          clueChannelName: '',
          clueSourceId: '44',
          companyId: '358004',
          companyName: '柑温泉州分公司',
          companyShopName: '',
          id: '53',
          isShow: 0,
          list: [],
          needFilter: 0,
          shopId: '358006',
          shopName: '柑温汽车常泰店1',
          sourceCode: 'qczj',
          sourceName: '汽车之家'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '厦门分公司-中埔哈弗红蓝标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '168152',
          clueChannelName: '',
          clueSourceId: '47',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '43',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'zdkf01',
          sourceName: '老客户介绍'
        },
        {
          clueChannelId: '168153',
          clueChannelName: '',
          clueSourceId: '43',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '44',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'dcd',
          sourceName: '懂车帝'
        },
        {
          clueChannelId: '168154',
          clueChannelName: '',
          clueSourceId: '44',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '45',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'qczj',
          sourceName: '汽车之家'
        },
        {
          clueChannelId: '327751',
          clueChannelName: '',
          clueSourceId: '49',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '51',
          isShow: 1,
          list: [],
          needFilter: 1,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'tpy',
          sourceName: '太平洋汽车网'
        },
        {
          clueChannelId: '967599',
          clueChannelName: '',
          clueSourceId: '67',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '60',
          isShow: 0,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'xxwtsczs',
          sourceName: '线下外拓-商超展示'
        },
        {
          clueChannelId: '980470',
          clueChannelName: '',
          clueSourceId: '68',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '61',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'youjia',
          sourceName: '有驾'
        },
        {
          clueChannelId: '980472',
          clueChannelName: '',
          clueSourceId: '69',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '62',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'aika',
          sourceName: '爱卡'
        },
        {
          clueChannelId: '1500808',
          clueChannelName: '',
          clueSourceId: '74',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '69',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'GDZYD',
          sourceName: '京东自营店'
        },
        {
          clueChannelId: '1500809',
          clueChannelName: '',
          clueSourceId: '72',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '70',
          isShow: 1,
          list: [],
          needFilter: 1,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'TBQJD',
          sourceName: '淘宝旗舰店'
        },
        {
          clueChannelId: '1820049',
          clueChannelName: '',
          clueSourceId: '55',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '105',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'zrjd01',
          sourceName: '自然进店'
        },
        {
          clueChannelId: '2516557',
          clueChannelName: '',
          clueSourceId: '80',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '111',
          isShow: 1,
          list: [],
          needFilter: 1,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'afafaffa2222',
          sourceName: '经纪人推荐'
        },
        {
          clueChannelId: '6364140612',
          clueChannelName: '',
          clueSourceId: '64',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '55',
          isShow: 1,
          list: [],
          needFilter: 1,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'dy',
          sourceName: '抖音'
        },
        {
          clueChannelId: '6365140612',
          clueChannelName: '',
          clueSourceId: '65',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '56',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'wx',
          sourceName: '微信'
        },
        {
          clueChannelId: '6366140612',
          clueChannelName: '',
          clueSourceId: '66',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '57',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'wb',
          sourceName: '微博'
        },
        {
          clueChannelId: '7576140612',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '82',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140612',
          shopName: '中埔哈弗红蓝标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '厦门分公司-同安WEY 4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140677',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '85',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140677',
          shopName: '同安WEY 4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '厦门分公司-后溪哈弗红蓝标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '168155',
          clueChannelName: '',
          clueSourceId: '43',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '46',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140634',
          shopName: '后溪哈弗红蓝标4S店',
          sourceCode: 'dcd',
          sourceName: '懂车帝'
        },
        {
          clueChannelId: '263641',
          clueChannelName: '',
          clueSourceId: '44',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '49',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140634',
          shopName: '后溪哈弗红蓝标4S店',
          sourceCode: 'qczj',
          sourceName: '汽车之家'
        },
        {
          clueChannelId: '1882750',
          clueChannelName: '',
          clueSourceId: '55',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '108',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140634',
          shopName: '后溪哈弗红蓝标4S店',
          sourceCode: 'zrjd01',
          sourceName: '自然进店'
        },
        {
          clueChannelId: '7576140634',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '83',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140634',
          shopName: '后溪哈弗红蓝标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '厦门分公司-同安哈弗红标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140706',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '86',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140706',
          shopName: '同安哈弗红标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '厦门分公司-同安哈弗蓝标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '913552',
          clueChannelName: '',
          clueSourceId: '44',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '58',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140656',
          shopName: '同安哈弗蓝标4S店',
          sourceCode: 'qczj',
          sourceName: '汽车之家'
        },
        {
          clueChannelId: '1023151',
          clueChannelName: '',
          clueSourceId: '67',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '63',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140656',
          shopName: '同安哈弗蓝标4S店',
          sourceCode: 'xxwtsczs',
          sourceName: '线下外拓-商超展示'
        },
        {
          clueChannelId: '2662026',
          clueChannelName: '',
          clueSourceId: '55',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '112',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140656',
          shopName: '同安哈弗蓝标4S店',
          sourceCode: 'zrjd01',
          sourceName: '自然进店'
        },
        {
          clueChannelId: '7576140656',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140611',
          companyName: '厦门分公司',
          companyShopName: '',
          id: '84',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140656',
          shopName: '同安哈弗蓝标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '漳州分公司-漳州吉马哈弗城市展厅',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140495',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140452',
          companyName: '漳州分公司',
          companyShopName: '',
          id: '102',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140495',
          shopName: '漳州吉马哈弗城市展厅',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '漳州分公司-龙文WEY 4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140453',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140452',
          companyName: '漳州分公司',
          companyShopName: '',
          id: '100',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140453',
          shopName: '龙文WEY 4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '漳州分公司-龙文哈弗红蓝标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140474',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140452',
          companyName: '漳州分公司',
          companyShopName: '',
          id: '101',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140474',
          shopName: '龙文哈弗红蓝标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '厦门领克分公司-厦门万晟业领克4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '913565',
          clueChannelName: '',
          clueSourceId: '59',
          companyId: '306003',
          companyName: '厦门领克分公司',
          companyShopName: '',
          id: '59',
          isShow: 0,
          list: [],
          needFilter: 1,
          shopId: '306004',
          shopName: '厦门万晟业领克4S店',
          sourceCode: 'czmt04',
          sourceName: '腾讯汽车'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '福州分公司-福州青口WEY 4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140544',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '77',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140544',
          shopName: '福州青口WEY 4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '福州分公司-福州白湖亭哈弗红蓝标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '193806',
          clueChannelName: '',
          clueSourceId: '55',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '48',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140502',
          shopName: '福州白湖亭哈弗红蓝标4S店',
          sourceCode: 'zrjd01',
          sourceName: '自然进店'
        },
        {
          clueChannelId: '837901',
          clueChannelName: '',
          clueSourceId: '47',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '54',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140502',
          shopName: '福州白湖亭哈弗红蓝标4S店',
          sourceCode: 'zdkf01',
          sourceName: '老客户介绍'
        },
        {
          clueChannelId: '2020674',
          clueChannelName: '',
          clueSourceId: '43',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '110',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140502',
          shopName: '福州白湖亭哈弗红蓝标4S店',
          sourceCode: 'dcd',
          sourceName: '懂车帝'
        },
        {
          clueChannelId: '7576140502',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '75',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140502',
          shopName: '福州白湖亭哈弗红蓝标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '福州分公司-福州青口哈弗红标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '1537582',
          clueChannelName: '',
          clueSourceId: '64',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '71',
          isShow: 1,
          list: [],
          needFilter: 1,
          shopId: '140565',
          shopName: '福州青口哈弗红标4S店',
          sourceCode: 'dy',
          sourceName: '抖音'
        },
        {
          clueChannelId: '1537583',
          clueChannelName: '',
          clueSourceId: '65',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '72',
          isShow: 0,
          list: [],
          needFilter: 1,
          shopId: '140565',
          shopName: '福州青口哈弗红标4S店',
          sourceCode: 'wx',
          sourceName: '微信'
        },
        {
          clueChannelId: '1537690',
          clueChannelName: '',
          clueSourceId: '47',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '73',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140565',
          shopName: '福州青口哈弗红标4S店',
          sourceCode: 'zdkf01',
          sourceName: '老客户介绍'
        },
        {
          clueChannelId: '7576140565',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '78',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140565',
          shopName: '福州青口哈弗红标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '福州分公司-福州皮卡专营店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140587',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '79',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140587',
          shopName: '福州皮卡专营店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '福州分公司-福州白湖亭WEY 4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140524',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '76',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140524',
          shopName: '福州白湖亭WEY 4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '福州分公司-福州青口哈弗蓝标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '591858',
          clueChannelName: '',
          clueSourceId: '44',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '52',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140599',
          shopName: '福州青口哈弗蓝标4S店',
          sourceCode: 'qczj',
          sourceName: '汽车之家'
        },
        {
          clueChannelId: '1925630',
          clueChannelName: '',
          clueSourceId: '49',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '109',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140599',
          shopName: '福州青口哈弗蓝标4S店',
          sourceCode: 'tpy',
          sourceName: '太平洋汽车网'
        },
        {
          clueChannelId: '2662372',
          clueChannelName: '',
          clueSourceId: '55',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '113',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140599',
          shopName: '福州青口哈弗蓝标4S店',
          sourceCode: 'zrjd01',
          sourceName: '自然进店'
        },
        {
          clueChannelId: '7576140599',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '81',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140599',
          shopName: '福州青口哈弗蓝标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '福州分公司-福州欧拉专营店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140596',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140501',
          companyName: '福州分公司',
          companyShopName: '',
          id: '80',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140596',
          shopName: '福州欧拉专营店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '集团总部-运营中心',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '1851076',
          clueChannelName: '',
          clueSourceId: '47',
          companyId: '140282',
          companyName: '集团总部',
          companyShopName: '',
          id: '106',
          isShow: null,
          list: [],
          needFilter: 1,
          shopId: '140283',
          shopName: '运营中心',
          sourceCode: 'zdkf01',
          sourceName: '老客户介绍'
        },
        {
          clueChannelId: '1851088',
          clueChannelName: '',
          clueSourceId: '80',
          companyId: '140282',
          companyName: '集团总部',
          companyShopName: '',
          id: '107',
          isShow: 0,
          list: [],
          needFilter: 1,
          shopId: '140283',
          shopName: '运营中心',
          sourceCode: 'afafaffa2222',
          sourceName: '经纪人推荐'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '莆田分公司-莆田哈弗蓝标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140365',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140344',
          companyName: '莆田分公司',
          companyShopName: '',
          id: '88',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140365',
          shopName: '莆田哈弗蓝标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '莆田分公司-莆田哈弗蓝标城市展厅',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140387',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140344',
          companyName: '莆田分公司',
          companyShopName: '',
          id: '89',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140387',
          shopName: '莆田哈弗蓝标城市展厅',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '莆田分公司-莆田哈弗红标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140390',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140344',
          companyName: '莆田分公司',
          companyShopName: '',
          id: '90',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140390',
          shopName: '莆田哈弗红标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '莆田分公司-莆田WEY 4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140345',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140344',
          companyName: '莆田分公司',
          companyShopName: '',
          id: '87',
          isShow: 1,
          list: [],
          needFilter: 1,
          shopId: '140345',
          shopName: '莆田WEY 4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '泉州分公司-晋江哈弗红蓝标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140746',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140718',
          companyName: '泉州分公司',
          companyShopName: '',
          id: '92',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140746',
          shopName: '晋江哈弗红蓝标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '泉州分公司-洛江哈弗红标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140811',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140718',
          companyName: '泉州分公司',
          companyShopName: '',
          id: '95',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140811',
          shopName: '洛江哈弗红标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '泉州分公司-常泰哈弗蓝标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140768',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140718',
          companyName: '泉州分公司',
          companyShopName: '',
          id: '93',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140768',
          shopName: '常泰哈弗蓝标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '泉州分公司-泉州欧拉专营店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140833',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140718',
          companyName: '泉州分公司',
          companyShopName: '',
          id: '96',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140833',
          shopName: '泉州欧拉专营店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '泉州分公司-泉州皮卡专营店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140837',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140718',
          companyName: '泉州分公司',
          companyShopName: '',
          id: '97',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140837',
          shopName: '泉州皮卡专营店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '泉州分公司-泉州wey城市展厅',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140841',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140718',
          companyName: '泉州分公司',
          companyShopName: '',
          id: '98',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140841',
          shopName: '泉州wey城市展厅',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '泉州分公司-晋江WEY 4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140719',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140718',
          companyName: '泉州分公司',
          companyShopName: '',
          id: '91',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140719',
          shopName: '晋江WEY 4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '泉州分公司-洛江WEY 4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140790',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140718',
          companyName: '泉州分公司',
          companyShopName: '',
          id: '94',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140790',
          shopName: '洛江WEY 4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '泉州分公司-常泰哈弗红标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '7576140855',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140718',
          companyName: '泉州分公司',
          companyShopName: '',
          id: '99',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140855',
          shopName: '常泰哈弗红标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '雷司酒业厦门总部-厦门总经办',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '3991587',
          clueChannelName: '',
          clueSourceId: '57',
          companyId: '140878',
          companyName: '雷司酒业厦门总部',
          companyShopName: '',
          id: '115',
          isShow: 0,
          list: [],
          needFilter: 1,
          shopId: '140879',
          shopName: '厦门总经办',
          sourceCode: 'xsrx01',
          sourceName: '电话预约'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    },
    {
      clueChannelId: null,
      clueChannelName: '',
      clueSourceId: null,
      companyId: null,
      companyName: '',
      companyShopName: '宁德分公司-宁德哈弗红标4S店',
      id: null,
      isShow: null,
      list: [
        {
          clueChannelId: '270885',
          clueChannelName: '',
          clueSourceId: '43',
          companyId: '140430',
          companyName: '宁德分公司',
          companyShopName: '',
          id: '50',
          isShow: 1,
          list: [],
          needFilter: 1,
          shopId: '140431',
          shopName: '宁德哈弗红标4S店',
          sourceCode: 'dcd',
          sourceName: '懂车帝'
        },
        {
          clueChannelId: '2662683',
          clueChannelName: '',
          clueSourceId: '55',
          companyId: '140430',
          companyName: '宁德分公司',
          companyShopName: '',
          id: '114',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140431',
          shopName: '宁德哈弗红标4S店',
          sourceCode: 'zrjd01',
          sourceName: '自然进店'
        },
        {
          clueChannelId: '7576140431',
          clueChannelName: '',
          clueSourceId: '76',
          companyId: '140430',
          companyName: '宁德分公司',
          companyShopName: '',
          id: '103',
          isShow: 1,
          list: [],
          needFilter: 0,
          shopId: '140431',
          shopName: '宁德哈弗红标4S店',
          sourceCode: 'cjxs',
          sourceName: '厂家线索'
        }
      ],
      needFilter: null,
      shopId: null,
      shopName: '',
      sourceCode: '',
      sourceName: ''
    }
  ],
  message: 'SUCCESS',
  sign: '',
  status: 200,
  timestamp: null
}
