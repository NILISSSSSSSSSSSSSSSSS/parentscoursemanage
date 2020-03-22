
import Vue from 'vue';

// 是否是明星专家
Vue.filter('isStar', (value) => {
     const list={"true":"是","false":"否"};
     return list[value] ? list[value] : ""
})

Vue.filter('enable', (value) => {
     const list={"true":"启用","false":"禁用"};
     return list[value] ? list[value] : ""
})
Vue.filter('gender', (value) => {
     const list={"1":"男","2":"女","3":"保密"};
     return list[value] ? list[value] : ""
})
Vue.filter('status', (value) => {
     const list={"1":"正常","2":"删除","3":"禁止登录","4":"禁止发言"};
     return list[value] ? list[value] : ""
})
Vue.filter('courseType', (value) => {
     const list={"1":"单次课","2":"系列课","3":"会员卡","4":"虚拟物品","5":"实物","6":"专题","7":"训练营"};
     return list[value] ? list[value] : ""
})
//支付状态
Vue.filter('payStatus',value => {
     const list = {1:'未付款',2:'已付款',3:'退款中',4:'已退款',5:'支付超时',6:'用户取消',7:'管理员取消'}
     return list[value] ? list[value] : ""
})
//退款状态
Vue.filter('refundMoneyStatus',value => {
     const list = {1:'等待处理',2:'退款成功',3:'退款财务不通过',4:'取消申请退款'}
     return list[value] ? list[value] : ""
})
//用户来源
Vue.filter('registerPlatform',value => {
     const list = {1:'h5',2:'app',3:'小程序',4:'老数据用户'}
     return list[value] ? list[value] : ""
})

//分销状态
Vue.filter('shareMoneyStatus',value => {
     const list = {1:'无分销',2:'未结算',3:'已结算',4:'已取消'}
     return list[value] ? list[value] : ""
})
//优惠券类型
Vue.filter('couponType',value => {
     const list = {1:'单品券',2:'品类券',3:'通用券'}
     return list[value] ? list[value] : ""
})
//是否是店主
Vue.filter('isShopper',value => {
     const list = {true:'店主课代表',false:'普通课代表'}
     return list[value] ? list[value] : ""
})
//分销权限
Vue.filter('shareStatus',value => {
     const list = {1:'启动',2:'冻结'};
     return list[value] ? list[value] : ""
})
//课程状态
Vue.filter('courseStatus',value => {
     const list = {1:'启用',2:'停用',3:'下架',4:'删除'}
     return list[value] ? list[value] : ""
})
//直播课banner类型
Vue.filter('liveBannerType',value => {
     const list = {1:'视频',2:'音频',3:'ppt',4:'图片'}
     return list[value] ? list[value] : ""
})

//课程形式
Vue.filter('courseStyle',value => {
     const list = {1:'直播课',2:'音频课',3:'视频课'}
     return list[value] ? list[value] : ""
})
//课程形式
Vue.filter('courseRights',value => {
     const list = {1:'免费课',2:'VIP',3:'精品课'}
     return list[value] ? list[value] : ""
})
//课程更新状态
Vue.filter('updateStatus',value => {
     const list = {1:'已完结',2:'更新中',3:'未开始',4:"直播已结束",5:"直播中",6:"直播未开始"}
     return list[value] ? list[value] : ""
})
//章节状态
Vue.filter('chapterStatus',value => {
     const list = {1:'启用',2:'停用',3:'下架',4:'删除'}
     return list[value] ? list[value] : ""
})
//提现状态
Vue.filter('withdrawalStatus',value => {
     const list = {1:'待受理',2:'受理成功',3:'未通过'}
     return list[value] ? list[value] : ""
})
//轮播类型
Vue.filter('bannerType',value => {
     const list = {1:'课程',2:'外部链接'}
     return list[value] ? list[value] : ""
})
//轮播状态
Vue.filter('bannerStatus',value => {
     const list = {1:'启用',2:'停用'}
     return list[value] ? list[value] : ""
})
//评论人工审核状态
Vue.filter('peopleCheck',value => {
     const list = {1:'待审核',2:'审核通过',3:'审核未通过'}
     return list[value] ? list[value] : ""
})
//评论智能审核状态
Vue.filter('interfaceCheck',value => {
     const list = {1:'待审核',2:'审核通过',3:'审核未通过',4:"建议人工复审"}
     return list[value] ? list[value] : ""
})
//评论最终审核状态
Vue.filter('finalCheckStatus',value => {
     const list = {1:'待审核',2:'审核通过',3:'审核未通过',4:"建议人工复审"}
     return list[value] ? list[value] : ""
})