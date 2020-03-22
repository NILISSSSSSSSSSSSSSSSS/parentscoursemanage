import Qs from 'qs'
import { post ,get,put,del,baseUrl} from './http'

/**  订单管理 **/ 
export const getOrderList = v => get(`${baseUrl}/manage/orderManage/orderManage/`,v)            //订单列表
export const applyRefund = v => post(`${baseUrl}/manage/orderManage/orderManage/`,v)            //申请退款
export const cancelRefund = v => del(`${baseUrl}/manage/orderManage/orderManage/${v.uuid}/`,v)            //取消申请退款
// 退款管理
export const getRefundList = v => get(`${baseUrl}/manage/orderManage/refundManage/`,v)  
export const refundDetail = v => get(`${baseUrl}/manage/orderManage/refundManage/${v.uuid}/detailInfo/`,v)  
export const dealRefund = v => put(`${baseUrl}/manage/orderManage/refundManage/${v.uuid}/`,v)  

/**  优惠券管理 **/
export const getCouponList = v => get(`${baseUrl}/manage/couponManage/`,v)                    //优惠券列表
export const addCoupon = v => post(`${baseUrl}/manage/couponManage/`,v)                       //优惠券新增
export const editCoupon = v => put(`${baseUrl}/manage/couponManage/${v.uuid}/`,v)             //优惠券编辑
export const delCoupon = v => del(`${baseUrl}/manage/couponManage/${v.uuid}/`,v)              //优惠券删除
export const sendCpnRecord = v => get(`${baseUrl}/manage/couponManage/userCoupon/detail/`,v)  //优惠券领取记录

// 课代表分成
export const courseRepresManageList = v => get(`${baseUrl}/manage/dividedManagement/courseRepresManag/`,v)     //课代表管理
export const courseRepresManageDetail = v => get(`${baseUrl}/manage/dividedManagement/courseRepresManagOrderDetail/`,v)     //课代表详情
export const courseRepresManageChangeSta = v => del(`${baseUrl}/manage/dividedManagement/courseRepresManag/${v.uuid}/`,v)     //冻结或者解冻
export const classRepreDivideTradeManag = v => get(`${baseUrl}/manage/dividedManagement/classRepreDivideTradeManag/`,v)     //课代表分成交易管理
export const classRepreCashwithdrawManag = v => get(`${baseUrl}/manage/dividedManagement/classRepreCashwithdrawManag/`,v)     //课代表提现交易管理
export const classRepreCashwithdraCheck = v => put(`${baseUrl}/manage/dividedManagement/classRepreCashwithdrawManag/${v.uuid}/`,v)     //财务审核通过 、 不通过提现
