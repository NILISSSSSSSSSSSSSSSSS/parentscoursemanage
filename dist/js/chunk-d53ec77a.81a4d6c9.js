(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d53ec77a"],{"1eb3":function(e,a,t){},"53b5":function(e,a,t){"use strict";t.r(a);var l=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"all-user"},[t("el-form",{attrs:{model:e.searchParams,inline:"","label-position":"right","label-width":"100px"},nativeOn:{keyup:function(a){return!a.type.indexOf("key")&&e._k(a.keyCode,"enter",13,a.key,"Enter")?null:e.searchList(a)}}},[t("el-row",[t("el-form-item",{attrs:{label:"课程类型"}},[t("el-select",{attrs:{size:"small",placeholder:"请选择",clearable:""},model:{value:e.searchParams.goodsType,callback:function(a){e.$set(e.searchParams,"goodsType",a)},expression:"searchParams.goodsType"}},e._l(e.classTypeList,(function(e,a){return t("el-option",{key:a,attrs:{label:e.label,value:e.value}})})),1)],1),t("el-form-item",{attrs:{label:"课程名称"}},[t("el-input",{attrs:{size:"small",clearable:""},model:{value:e.searchParams.goodsName,callback:function(a){e.$set(e.searchParams,"goodsName","string"===typeof a?a.trim():a)},expression:"searchParams.goodsName"}})],1),t("el-form-item",{attrs:{label:"订单编号"}},[t("el-input",{attrs:{size:"small",clearable:""},model:{value:e.searchParams.detailNum,callback:function(a){e.$set(e.searchParams,"detailNum","string"===typeof a?a.trim():a)},expression:"searchParams.detailNum"}})],1),t("el-form-item",{attrs:{label:"昵称"}},[t("el-input",{attrs:{size:"small",clearable:""},model:{value:e.searchParams.nickName,callback:function(a){e.$set(e.searchParams,"nickName","string"===typeof a?a.trim():a)},expression:"searchParams.nickName"}})],1),t("el-form-item",{attrs:{label:"电话"}},[t("el-input",{attrs:{size:"small",clearable:""},model:{value:e.searchParams.tel,callback:function(a){e.$set(e.searchParams,"tel","string"===typeof a?a.trim():a)},expression:"searchParams.tel"}})],1)],1),t("el-row",[t("el-form-item",{attrs:{label:"结算状态"}},[t("el-select",{attrs:{size:"small",placeholder:"请选择",clearable:""},model:{value:e.searchParams.shareMoneyStatus,callback:function(a){e.$set(e.searchParams,"shareMoneyStatus",a)},expression:"searchParams.shareMoneyStatus"}},e._l(e.settlementStatusList,(function(e,a){return t("el-option",{key:a,attrs:{label:e.label,value:e.value}})})),1)],1),t("el-form-item",{attrs:{label:"交易时间"}},[t("el-date-picker",{attrs:{type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"交易时间","value-format":"yyyy-MM-dd",size:"small"},model:{value:e.searchParams.timBox,callback:function(a){e.$set(e.searchParams,"timBox",a)},expression:"searchParams.timBox"}})],1),t("el-button",{staticClass:"ml40 mb20 mt4",attrs:{icon:"el-icon-search",type:"primary",size:"small"},on:{click:e.searchList}},[e._v("查询\n      ")]),t("el-button",{staticClass:"ml40 mb20 mt4",attrs:{icon:"el-icon-setting",type:"primary",size:"small",plain:""},on:{click:e.reset}},[e._v("重置\n      ")])],1)],1),t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"mb20",attrs:{data:e.list,border:"",stripe:""}},[t("el-table-column",{attrs:{label:"交易时间"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return[e._v("\n        "+e._s(e._f("formatDate")(t.orderTime))+"\n      ")]}}])}),t("el-table-column",{attrs:{prop:"detailNum",label:"订单编号"}}),t("el-table-column",{attrs:{prop:"goodsName",label:"课程名称"}}),t("el-table-column",{attrs:{label:"课程类型"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return[e._v("\n        "+e._s(e._f("courseType")(t.goodsType))+"\n      ")]}}])}),t("el-table-column",{attrs:{prop:"id",label:"实际分成金额"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return[e._v("\n        "+e._s(e.$math.divide(t.shareMoney,100))+"\n      ")]}}])}),t("el-table-column",{attrs:{label:"课代表id"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return t.courseRepreInfo?[e._v("\n        "+e._s(t.courseRepreInfo.userNum)+"\n      ")]:void 0}}],null,!0)}),t("el-table-column",{attrs:{label:"课代表昵称"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return t.courseRepreInfo?[e._v("\n        "+e._s(t.courseRepreInfo.nickName)+"\n      ")]:void 0}}],null,!0)}),t("el-table-column",{attrs:{label:"结算状态",width:"150px"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return[e._v("\n        "+e._s(e._f("shareMoneyStatus")(t.shareMoneyStatus))+"\n      ")]}}])}),t("el-table-column",{attrs:{label:"操作",width:"120px"},scopedSlots:e._u([{key:"default",fn:function(a){var l=a.row;return[t("el-button",{staticClass:"mt10",attrs:{icon:"el-icon-view",type:"success",size:"small"},on:{click:function(a){return e.showEdit(l)}}},[e._v("查看详情\n        ")])]}}])})],1),t("pagination",{attrs:{currentPage:e.page.page,pageSize:e.page.limit,total:e.page.total},on:{change:e.changePage}}),t("classRepre-divideTradeDetail",{attrs:{editData:e.editData},on:{closeMain:e.closeMain,freshParent:e.searchList}})],1)},n=[],r=t("f8b7"),s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("el-dialog",{attrs:{visible:e.editData.isShow,title:"详情 ","append-to-body":"",width:"500px","before-close":e.closeDialog},on:{"update:visible":function(a){return e.$set(e.editData,"isShow",a)}}},[t("div",[t("div",{staticClass:"text item"},[t("el-row",{staticClass:"detailRow"},[t("el-col",{attrs:{span:24}},[e._v(" 交易时间："+e._s(e._f("formatDate")(e.detail.orderTime)))]),e.detail.courseRepreInfo?t("el-col",{attrs:{span:24}},[e._v(" 课代表："),t("img",{staticStyle:{width:"50px",height:"50px"},attrs:{src:e.detail.courseRepreInfo.avatar,alt:""}}),e._v("  "+e._s(e.detail.courseRepreInfo.nickName)+" ")]):e._e(),t("el-col",{attrs:{span:24}},[e._v("订单编号："+e._s(e.detail.detailNum)+" ")]),t("el-col",{attrs:{span:24}},[e._v("课程名称:"+e._s(e.detail.goodsName))]),e.detail.courseRepreInfo?t("el-col",{attrs:{span:24}},[e._v("电话:"+e._s(e.detail.courseRepreInfo.tel))]):e._e(),t("el-col",{attrs:{span:24}},[e._v("课程类型：  "+e._s(e._f("courseType")(e.detail.goodsType))+" ")]),t("el-col",{attrs:{span:24}},[e._v("订单金额:  "+e._s(e.$math.divide(e.detail.goodsPrice,100)))]),t("el-col",{attrs:{span:24}},[e._v("实际分成金额："+e._s(e.$math.divide(e.detail.shareMoney,100))+" ")]),t("el-col",{attrs:{span:24}},[e._v("结算状态: "+e._s(e._f("shareMoneyStatus")(e.detail.shareMoneyStatus)))])],1)],1)])])},o=[],c={components:{},props:{editData:{type:Object,default:function(){return{}}}},data:function(){return{detail:{}}},created:function(){},watch:{"editData.isShow":function(e,a){e&&(this.detail=this.editData.data)}},methods:{closeDialog:function(){var e={isShowEdit:!1};this.$emit("closeMain",e)}}},i=c,u=(t("7ec7"),t("5511")),d=Object(u["a"])(i,s,o,!1,null,"7ba97711",null),m=d.exports,f={components:{classRepreDivideTradeDetail:m},data:function(){return{classTypeList:t("db49").courseTypeList,settlementStatusList:t("db49").shareMoneyStatus,searchParams:{timBox:[]},list:[],page:{page:1,limit:10,total:0},editData:{isShow:!1,isEdit:!1,data:{}},loading:!1}},mounted:function(){this.searchList()},methods:{searchList:function(){var e=this,a=JSON.parse(JSON.stringify(this.searchParams)),t=this.$utils.formatRange(this.searchParams.timBox),l=this.searchParams.timBox?t[1]:null,n=this.searchParams.timBox?t[0]:null,s=[this.page.page,this.page.limit,l,n];a.page=s[0],a.pageSize=s[1],a.searchTime_before=s[2],a.searchTime_after=s[3],delete a.timBox,this.loading=!0,Object(r["f"])(a).then((function(a){if(200===a.code)if(a.data&&a.data.count>0){var t=[a.data.results,a.data.count];e.list=t[0],e.page.total=t[1]}else{var l=[[],0];e.list=l[0],e.page.total=l[1]}e.loading=!1})).catch((function(a){e.loading=!1}))},changePage:function(e,a){this.page.limit=a,this.page.page=e,this.searchList()},showEdit:function(e){console.log(e),this.editData={isShow:!0,data:e}},closeMain:function(e){this.editData.isShow=!1},reset:function(){this.searchParams={timBox:[]},this.searchList()}}},b=f,p=Object(u["a"])(b,l,n,!1,null,"cd715b64",null);a["default"]=p.exports},"7ec7":function(e,a,t){"use strict";var l=t("1eb3"),n=t.n(l);n.a},db49:function(e,a,t){"use strict";t.r(a),t.d(a,"orderStatus",(function(){return l})),t.d(a,"refundStatus",(function(){return n})),t.d(a,"payStatus",(function(){return r})),t.d(a,"couponType",(function(){return s})),t.d(a,"courseTypes",(function(){return o})),t.d(a,"courseRights",(function(){return c})),t.d(a,"courseModality",(function(){return i})),t.d(a,"courseStatus",(function(){return u})),t.d(a,"checkStatus",(function(){return d})),t.d(a,"userStatus",(function(){return m})),t.d(a,"adminStatus",(function(){return f})),t.d(a,"userSource",(function(){return b})),t.d(a,"courseTypeList",(function(){return p})),t.d(a,"shareMoneyStatus",(function(){return v}));var l=[{value:1,label:"未发货"},{value:2,label:"已发货"},{value:3,label:"已完成"},{value:4,label:"申请退货中"},{value:5,label:"已退货"}],n=[{value:1,label:"等待处理"},{value:2,label:"退款成功"},{value:3,label:"退款财务不通过"},{value:4,label:"取消申请退款"}],r=[{value:1,label:"未付款"},{value:2,label:"已付款"},{value:3,label:"退款中"},{value:4,label:"已退款"},{value:5,label:"支付超时"},{value:6,label:"用户取消"},{value:7,label:"管理员取消"}],s=[{value:1,label:"单品券"},{value:2,label:"品类券"},{value:3,label:"通用券"}],o=[{value:1,label:"单次课"},{value:2,label:"系列课"}],c=[{value:1,label:"免费课"},{value:2,label:"VIP"},{value:3,label:"精品课"}],i=[{value:1,label:"直播课"},{value:2,label:"音频课"},{value:3,label:"视频课"}],u=[{value:1,label:"启用"},{value:2,label:"停用"},{value:3,label:"下架"}],d=[{value:1,label:"待审核"},{value:2,label:"审核通过"},{value:3,label:"审核未通过"},{value:4,label:"建议人工复审"}],m=[{value:1,label:"正常"},{value:2,label:"删除"},{value:3,label:"禁止登录"},{value:4,label:"禁止发言"}],f=[{value:1,label:"正常"},{value:2,label:"删除"},{value:3,label:"禁用"},{value:4,label:"非管理员"}],b=[{value:1,label:"H5"},{value:2,label:"App"},{value:3,label:"小程序"},{value:4,label:"老数据用户"}],p=[{value:1,label:"单次课"},{value:2,label:"系列课"},{value:3,label:"会员卡"},{value:4,label:"虚拟物品"},{value:5,label:"实物"},{value:6,label:"专题"}],v=[{value:1,label:"无分销"},{value:2,label:"未结算"},{value:3,label:"已结算"},{value:4,label:"已取消"}]},f8b7:function(e,a,t){"use strict";t.d(a,"n",(function(){return n})),t.d(a,"b",(function(){return r})),t.d(a,"c",(function(){return s})),t.d(a,"o",(function(){return o})),t.d(a,"p",(function(){return c})),t.d(a,"j",(function(){return i})),t.d(a,"m",(function(){return u})),t.d(a,"a",(function(){return d})),t.d(a,"l",(function(){return m})),t.d(a,"k",(function(){return f})),t.d(a,"q",(function(){return b})),t.d(a,"i",(function(){return p})),t.d(a,"h",(function(){return v})),t.d(a,"g",(function(){return h})),t.d(a,"f",(function(){return g})),t.d(a,"e",(function(){return y})),t.d(a,"d",(function(){return _}));t("82c6");var l=t("c1fb"),n=function(e){return Object(l["c"])("".concat(l["a"],"/manage/orderManage/orderManage/"),e)},r=function(e){return Object(l["e"])("".concat(l["a"],"/manage/orderManage/orderManage/"),e)},s=function(e){return Object(l["b"])("".concat(l["a"],"/manage/orderManage/orderManage/").concat(e.uuid,"/"),e)},o=function(e){return Object(l["c"])("".concat(l["a"],"/manage/orderManage/refundManage/"),e)},c=function(e){return Object(l["c"])("".concat(l["a"],"/manage/orderManage/refundManage/").concat(e.uuid,"/detailInfo/"),e)},i=function(e){return Object(l["f"])("".concat(l["a"],"/manage/orderManage/refundManage/").concat(e.uuid,"/"),e)},u=function(e){return Object(l["c"])("".concat(l["a"],"/manage/couponManage/"),e)},d=function(e){return Object(l["e"])("".concat(l["a"],"/manage/couponManage/"),e)},m=function(e){return Object(l["f"])("".concat(l["a"],"/manage/couponManage/").concat(e.uuid,"/"),e)},f=function(e){return Object(l["b"])("".concat(l["a"],"/manage/couponManage/").concat(e.uuid,"/"),e)},b=function(e){return Object(l["c"])("".concat(l["a"],"/manage/couponManage/userCoupon/detail/"),e)},p=function(e){return Object(l["c"])("".concat(l["a"],"/manage/dividedManagement/courseRepresManag/"),e)},v=function(e){return Object(l["c"])("".concat(l["a"],"/manage/dividedManagement/courseRepresManagOrderDetail/"),e)},h=function(e){return Object(l["b"])("".concat(l["a"],"/manage/dividedManagement/courseRepresManag/").concat(e.uuid,"/"),e)},g=function(e){return Object(l["c"])("".concat(l["a"],"/manage/dividedManagement/classRepreDivideTradeManag/"),e)},y=function(e){return Object(l["c"])("".concat(l["a"],"/manage/dividedManagement/classRepreCashwithdrawManag/"),e)},_=function(e){return Object(l["f"])("".concat(l["a"],"/manage/dividedManagement/classRepreCashwithdrawManag/").concat(e.uuid,"/"),e)}}}]);
//# sourceMappingURL=chunk-d53ec77a.81a4d6c9.js.map