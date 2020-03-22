// 订单状态
export const orderStatus = [
  { value: 1, label: '未发货'},
  { value: 2, label: '已发货'},
  { value: 3, label: '已完成'},
  { value: 4, label: '申请退货中'},
  { value: 5, label: '已退货'}
]
// 退款状态
export const refundStatus = [
  { value: 1, label: '等待处理'},
  { value: 2, label: '退款成功'},
  { value: 3, label: '退款财务不通过'},
  { value: 4, label: '取消申请退款'},
]
// 支付状态 (use)
export const payStatus = [
  { value: 1, label: '未付款'},
  { value: 2, label: '已付款'},
  { value: 3, label: '退款中'},
  { value: 4, label: '已退款'},
  { value: 5, label: '支付超时'},
  { value: 6, label: '用户取消'},
  { value: 7, label: '管理员取消'}
]
//优惠券类型 (use)
export const couponType = [
  { value: 1, label: "单品券"},
  { value: 2, label: "品类券"},
  { value: 3, label: "通用券"}
]
//课程类型 (use)
export const courseTypes = [
  { value: 1, label: "单次课" },
  { value: 2, label: "系列课" },
  // { value: 3, label: "专题课" }
]
//课程权限 (use)
export const courseRights = [
  { value: 1, label: "免费课" },
  { value: 2, label: "VIP" },
  { value: 3, label: "精品课" }
]
//课程形式 (use)
export const courseModality = [
  { value: 1, label: "直播课" },
  { value: 2, label: "音频课" },
  { value: 3, label: "视频课" }
]
// //课程类型 (use)
// export const courseTypeList = [
//   { label: '单次课', value: '1' },
//   { label: '系列课', value: '2' },
//   { label: '专题课', value: '3' },
//   // { label: '训练营', value: '4' },
//   { label: '活动', value: '5' },
//   { label: '实物', value: '6' },
//   { label: '会员', value: '7' },
// ]
//课程状态 (use)
export const courseStatus = [
  { value: 1, label: "启用"},
  { value: 2, label: "停用"},
  { value: 3, label: "下架"},
  // { value: 4, label: "删除"}
]
//审核状态
export const checkStatus = [
  { value: 1, label: "待审核"},
  { value: 2, label: "审核通过"},
  { value: 3, label: "审核未通过"},
  { value: 4, label: "建议人工复审"}
]
//用户状态 
export const userStatus = [
  { value: 1, label: "正常"},
  { value: 2, label: "删除"},
  { value: 3, label: "禁止登录"},
  { value: 4, label: "禁止发言"}
]
//后台管理员状态 (use)
export const adminStatus = [
  { value: 1, label: "正常"},
  { value: 2, label: "删除"},
  { value: 3, label: "禁用"},
  { value: 4, label: "非管理员"}
]
//用户来源 (use)
export const userSource = [
  { value: 1, label: "H5"},
  { value: 2, label: "App"},
  { value: 3, label: "小程序"},
  { value: 4, label: "老数据用户"}
]
//商品类型 (use)
export const courseTypeList = [
  {value:1, label: "单次课"},
  {value:2, label: "系列课"},
  {value:3, label: "会员卡"},
  {value:4, label: "虚拟物品"},
  {value:5, label: "实物"},
  {value:6, label: "专题"},
  // {value:7, label: "训练营"}
]
//分销状态 (use)
export const shareMoneyStatus = [
  {value:1, label: "无分销"},
  {value:2, label: "未结算"},
  {value:3, label: "已结算"},
  {value:4, label: "已取消"}
]