(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-860ccb98"],{1148:function(e,t,a){},"1dd8":function(e,t,a){"use strict";var n=a("e069"),r=a.n(n);r.a},3669:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-dialog",{staticClass:"refound-dia small-form-item",attrs:{visible:e.refoundObj.isShow,title:"主动申请退款",width:"500px","close-on-click-modal":!1},on:{"update:visible":function(t){return e.$set(e.refoundObj,"isShow",t)}}},[a("el-form",{ref:"editForm",attrs:{rules:e.rules,model:e.editForm,labelPosition:"right",labelWidth:"100px"}},[a("el-form-item",{attrs:{label:"商品名称："}},[a("span",[e._v(e._s(e.editForm.goodsName))])]),a("el-form-item",{attrs:{label:"可退金额："}},[a("span",[e._v("￥"+e._s(e.$math.divide(e.editForm.payPrice,100))+"元")])]),a("el-form-item",{attrs:{prop:"refundMoney",label:"退款金额："}},[a("el-input",{attrs:{size:"small",placeholder:"请输入退款金额"},model:{value:e.editForm.refundMoney,callback:function(t){e.$set(e.editForm,"refundMoney",t)},expression:"editForm.refundMoney"}})],1),a("el-form-item",{attrs:{label:"退款原因：",prop:"refundReason"}},[a("el-input",{attrs:{size:"small",type:"textarea",rows:3,placeholder:"请输入退款原因"},model:{value:e.editForm.refundReason,callback:function(t){e.$set(e.editForm,"refundReason",t)},expression:"editForm.refundReason"}})],1)],1),a("el-row",[a("span",{staticClass:"ml20 tl"},[e._v("合计退款："),a("span",{staticClass:"col-danger"},[e._v(e._s(e.allMoney)+"元")])]),a("el-button",{staticClass:"ml40",attrs:{type:"primary",disabled:e.isExtra},on:{click:function(t){return e.save()}}},[e._v("确 定")])],1)],1)],1)},r=[],o=(a("163d"),a("f8b7")),s={props:{refoundObj:{type:Object,default:function(){return{}}}},data:function(){var e=this,t=function(t,a,n){a||n(new Error("请输入退款金额")),e.$utils.limitNumber.test(a)||n(new Error("价格为整数或最多两位小数的数值"));var r=e.$math.divide(e.editForm.payPrice,100);Number(a)>r?(e.allMoney="超出退款金额",e.isExtra=!0):(e.allMoney=a,e.isExtra=!1),n()};return{dataList:[],editForm:{},allMoney:0,isExtra:!1,rules:{refundMoney:[{required:!0,validator:t,trigger:"blur"}],refundReason:[{required:!0,message:"请输入退款原因",trigger:"blur"}]}}},methods:{changePrice:function(){},closeDialog:function(){this.$emit("closeMain")},save:function(){var e=this;this.$refs["editForm"].validate((function(t){if(t){var a={refundMoney:+e.editForm.refundMoney,refundReason:e.editForm.refundReason,orderDetailUuid:e.editForm.uuid};Object(o["b"])(a).then((function(t){200===t.code&&(e.$message.success("成功"),e.$emit("freshParent"),e.closeDialog())})).catch((function(e){}))}}))}},mounted:function(){},watch:{"refoundObj.isShow":function(e,t){e?this.editForm=JSON.parse(JSON.stringify(this.refoundObj.data)):(this.editForm.refundReason=this.editForm.refundMoney="",this.allMoney=0,this.isExtra=!1)}}},l=s,i=(a("1dd8"),a("5511")),u=Object(i["a"])(l,n,r,!1,null,"e50468b0",null);t["a"]=u.exports},"4f67":function(e,t,a){"use strict";var n=a("9c66"),r=a.n(n);r.a},"9c66":function(e,t,a){},c54c:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"all-user"},[a("el-form",{attrs:{model:e.searchParams,inline:"","label-position":"right","label-width":"80px"}},[a("el-form-item",{attrs:{label:"订单编号"}},[a("el-input",{attrs:{placeholder:"订单编号",size:"small",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.searchList(t)}},model:{value:e.searchParams.detailNum,callback:function(t){e.$set(e.searchParams,"detailNum","string"===typeof t?t.trim():t)},expression:"searchParams.detailNum"}})],1),a("el-form-item",{attrs:{label:"商品名称"}},[a("el-input",{attrs:{placeholder:"商品名称",size:"small",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.searchList(t)}},model:{value:e.searchParams.goodsName,callback:function(t){e.$set(e.searchParams,"goodsName","string"===typeof t?t.trim():t)},expression:"searchParams.goodsName"}})],1),a("el-form-item",{attrs:{label:"买家"}},[a("el-input",{attrs:{placeholder:"买家昵称",size:"small",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.searchList(t)}},model:{value:e.searchParams.buyerName,callback:function(t){e.$set(e.searchParams,"buyerName","string"===typeof t?t.trim():t)},expression:"searchParams.buyerName"}})],1),a("el-row",[a("el-form-item",{attrs:{label:"支付状态"}},[a("el-select",{attrs:{size:"small",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.searchList(t)}},model:{value:e.searchParams.payStatus,callback:function(t){e.$set(e.searchParams,"payStatus","string"===typeof t?t.trim():t)},expression:"searchParams.payStatus"}},e._l(e.payStatus,(function(e,t){return a("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1)],1),a("el-form-item",{attrs:{label:"下单时间"}},[a("el-date-picker",{attrs:{type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","value-format":"yyyy-MM-dd",size:"small"},model:{value:e.time,callback:function(t){e.time=t},expression:"time"}})],1),a("el-button",{staticClass:"ml40 mb20",attrs:{type:"primary",icon:"el-icon-search",size:"small"},on:{click:e.searchList}},[e._v("查询")]),a("el-button",{staticClass:"ml40 mb20",attrs:{type:"primary",icon:"el-icon-setting",size:"small",plain:""},on:{click:e.reset}},[e._v("重置")])],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"mb20",attrs:{data:e.orderList,border:"",stripe:""}},[a("el-table-column",{attrs:{prop:"detailNum",label:"子订单编号"}}),a("el-table-column",{attrs:{prop:"goodsName",label:"商品名称",width:"220px"}}),a("el-table-column",{attrs:{prop:"goodsType",label:"商品类型"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(e.goodsTypeList,(function(n,r){return a("div",{key:r},[t.row.goodsType===n.value?a("span",[e._v(e._s(n.label))]):e._e()])}))}}])}),a("el-table-column",{attrs:{prop:"isGift",label:"是否是赠品"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.isGift?"是":"否"))])]}}])}),a("el-table-column",{attrs:{prop:"buyerInfo.nickName",label:"买家昵称"}}),a("el-table-column",{attrs:{label:"支付状态"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{class:2!==t.row.orderInfo.payStatus?"col-danger":"col-sucs"},[e._v(e._s(e._f("payStatus")(t.row.orderInfo.payStatus)))])]}}])}),a("el-table-column",{attrs:{prop:"payPrice",label:"实付金额(元)"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.$math.divide(t.row.payPrice,100)))])]}}])}),a("el-table-column",{attrs:{prop:"createTime",label:"下单时间",width:"170px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("formatDate")(t.row.createTime)))])]}}])}),a("el-table-column",{attrs:{label:"操作",width:"150px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{icon:"el-icon-view",type:"success",size:"small"},on:{click:function(a){return e.showDetail(t.row)}}},[e._v("查看详情")])]}}])})],1),a("pagination",{attrs:{currentPage:e.page.page,pageSize:e.page.limit,total:e.page.total},on:{change:e.changePage}}),a("orderDetail",{attrs:{orderObj:e.orderObj},on:{freshParent:function(t){return e.searchList()},closeMain:e.closeMain}})],1)},r=[],o=(a("5ab2"),a("6d57"),a("e10e"),a("9d37")),s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"coupon-detail"},[a("el-dialog",{attrs:{visible:e.orderObj.isShow,title:"订单详情",width:"1000px","close-on-click-modal":!1},on:{"update:visible":function(t){return e.$set(e.orderObj,"isShow",t)}}},[a("el-row",{staticClass:"bold"},[e._v("订单信息")]),a("el-row",{staticClass:"lh40 bor-btm mb20"},[a("span",{staticClass:"ml20"},[e._v("订单号："+e._s(e.obj.detailNum))]),a("span",{staticClass:"ml20"},[e._v("订单时间："+e._s(e._f("formatDate")(e.obj.createTime)))]),a("span",{staticClass:"ml20"},[e._v("订单状态：\n        "),a("span",{class:2!==e.obj.orderInfo.payStatus?"col-danger":"col-sucs"},[e._v(e._s(e._f("payStatus")(e.obj.orderInfo.payStatus)))])]),a("span",{staticClass:"ml20"},[e._v("实付金额："+e._s(e.$math.divide(e.obj.payPrice,100))+"元")])]),a("el-row",{staticClass:"mb10 bold"},[e._v("商品信息")]),a("el-table",{staticClass:"mb20",attrs:{data:e.googsList,border:"",stripe:""}},[a("el-table-column",{attrs:{prop:"goodsName",label:"商品名称",width:"220"}}),a("el-table-column",{attrs:{prop:"goodsType",label:"商品类型"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(e.goodsTypeList,(function(n,r){return a("div",{key:r},[t.row.goodsType===n.value?a("span",[e._v(e._s(n.label))]):e._e()])}))}}])}),a("el-table-column",{attrs:{prop:"shareMoneyStatus",label:"状态分销"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("shareMoneyStatus")(t.row.shareMoneyStatus)))])]}}])}),a("el-table-column",{attrs:{label:"商品划线价"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.$math.divide(t.row.originalPrice,100))+"元")])]}}])}),a("el-table-column",{attrs:{label:"商品单价"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.$math.divide(t.row.goodsPrice,100))+"元")])]}}])}),a("el-table-column",{attrs:{prop:"goodsCount",label:"购买数量"}}),a("el-table-column",{attrs:{label:"商品总价"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.$math.divide(t.row.totalPrice,100))+"元")])]}}])}),a("el-table-column",{attrs:{label:"实付金额"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.$math.divide(t.row.payPrice,100))+"元")])]}}])}),a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return["2"==e.obj.orderInfo.payStatus?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){return e.showRefound(t.row)}}},[e._v("申请退款")]):e._e(),"3"==e.obj.orderInfo.payStatus?a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){return e.cancelRefound(t.row)}}},[e._v("取消退款申请")]):e._e()]}}])})],1),a("div",{staticClass:"bor-btm"},[a("el-row",{staticClass:"mt10 bold"},[e._v("付款信息")]),a("el-row",{staticClass:"lh30 mt5 ml20"},[a("span",[e._v("商品总价：")]),a("span",[e._v("￥"+e._s(e.$math.divide(e.obj.totalPrice,100))+"元")])]),a("el-row",{staticClass:"lh30 ml20"},[a("span",[e._v("　优惠券：")]),a("span",[e._v("￥"+e._s(e.$math.divide(e.obj.couponPrice,100))+"元")])]),a("el-row",{staticClass:"lh30 ml20"},[a("span",[e._v("付款方式：")]),a("span",[e._v(e._s(e.obj.orderInfo.payInfo.payWayName))])]),a("el-row",{staticClass:"lh30 ml20"},[a("span",[e._v("付款时间：")]),a("span",[e._v(e._s(e._f("formatDate")(e.obj.orderInfo.payInfo.payTime)))])]),a("el-row",{staticClass:"lh30 ml20"},[a("span",{staticClass:"bold"},[e._v("实付金额：")]),a("span",{staticClass:"col-danger"},[e._v("￥"+e._s(e.$math.divide(e.obj.payPrice,100))+"元")])])],1),a("el-row",{staticClass:"bold mt20"},[e._v("用户信息")]),a("div",{staticClass:"mt10 pb10 bor-btm"},[a("span",{staticClass:"mr20 ml20"},[e._v("\n        用户："),e.obj.buyerInfo.avatar?a("img",{staticClass:"user-avatar middle",attrs:{src:e.obj.buyerInfo.avatar,alt:"用户头像"}}):e._e(),e._v("\n        "+e._s(e.obj.buyerInfo.nickName)+"\n      ")]),a("span",{staticClass:"mr20 ml20"},[e._v("用户手机号："+e._s(e.obj.buyerInfo.tel))]),a("span",{staticClass:"mr20 ml20"},[e._v("用户身份：\n        "),a("span",{staticClass:"mr5"},[e._v(e._s(e.obj.buyerInfo.isShopper?"店主":""))]),a("span",{staticClass:"mr5"},[e._v(e._s(e.obj.buyerInfo.vipInfo.isVip?"VIP":""))]),e.obj.buyerInfo.isShopper||e.obj.buyerInfo.vipInfo.isVip?e._e():a("span",[e._v("普通用户")])]),a("span",{staticClass:"mr20 ml20"},[e._v("用户来源：\n        "),e._l(e.userSource,(function(t,n){return a("span",{key:n},[e.obj.buyerInfo.registerPlatform===t.value?a("span",[e._v(e._s(t.label))]):e._e()])}))],2)]),e.obj.refundInfo&&e.obj.refundInfo.refundMoneyStatus?[a("el-row",{staticClass:"mt20 mb20 bold"},[e._v("退款信息")]),2!=e.obj.refundInfo.refundMoneyStatus?a("div",[a("el-row",{staticClass:"mb20"},[a("span",{staticClass:"ml20"},[e._v("退款状态："+e._s(e._f("refundMoneyStatus")(e.obj.refundInfo.refundMoneyStatus)))]),a("span",{staticClass:"ml20"},[e._v("退款编号："+e._s(e.obj.refundInfo.refundNum))]),a("span",{staticClass:"ml20"},[e._v("退款金额："+e._s(e.$math.divide(e.obj.refundInfo.refundMoney,100))+"元")])]),a("el-col",[a("el-col",{staticClass:"lh40 mb20"},[a("div",{staticClass:"ml20",staticStyle:{height:"200px"}},[a("el-steps",{attrs:{direction:"vertical",active:1}},e._l(e.obj.refundOperationInfo,(function(t,n){return a("el-step",{key:n,attrs:{title:e.$utils.formatDate(t.createTime,"yyyy-MM-dd hh:mm:ss"),description:t.operation+" 备注："+t.remark}})})),1)],1)])],1)],1):a("el-row",{staticClass:"lh30 mb20"},[e.obj.refundInfo?[a("el-row",{staticClass:"ml20"},[e._v("退款编号："+e._s(e.obj.refundInfo.refundNum))]),a("el-row",{staticClass:"ml20"},[e._v("退款发起人："+e._s(e.obj.refundInfo.creator))]),a("el-row",{staticClass:"ml20"},[e._v("申请退款时间："+e._s(e._f("formatDate")(e.obj.refundInfo.createTime)))]),a("el-row",{staticClass:"ml20"},[e._v("退款状态："+e._s(e._f("refundMoneyStatus")(e.obj.refundInfo.refundMoneyStatus)))]),a("el-row",{staticClass:"ml20"},[e._v("受理人："+e._s(e.obj.refundInfo.receiver))]),a("el-row",{staticClass:"ml20"},[e._v("退款金额："+e._s(e.$math.divide(e.obj.refundInfo.refundMoney,100))+"元（退还至买家余额账户）")]),a("el-row",{staticClass:"ml20"},[e._v("退款原因："+e._s(e.obj.refundInfo.refundReason))])]:e._e()],2)]:e._e(),a("el-row",{staticClass:"tc mt20"},[a("el-button",{attrs:{type:"success"},on:{click:function(t){e.orderObj.isShow=!1}}},[e._v("关闭详情")])],1)],2),a("editRefound",{attrs:{refoundObj:e.refoundObj},on:{closeMain:e.closeRefund,freshParent:function(t){return e.$emit("freshParent")}}})],1)},l=[],i=a("3669"),u=a("db49"),c=a("f8b7"),d={props:{orderObj:{type:Object,default:function(){return{}}}},components:{editRefound:i["a"]},data:function(){return{googsList:[],obj:{orderInfo:{payInfo:{}},buyerInfo:{isShopper:!1,vipInfo:{isVip:!1}},refundInfo:{}},payStatusList:u["payStatus"],goodsTypeList:u["courseTypeList"],shareMoneyStatus:u["shareMoneyStatus"],userSource:u["userSource"],page:{page:1,limit:10,total:0},time:[],couponTypes:[{name:"全部",value:""},{name:"通用券",value:"1"},{name:"品类券",value:"2"},{name:"单品券",value:"3"}],useStatus:[{name:"全部",value:""},{name:"未使用",value:"1"},{name:"已使用",value:"2"}],shopList:[],refoundObj:{isShow:!1,data:{}}}},methods:{closeDialog:function(){this.$emit("closeMain")},closeRefund:function(){this.refoundObj.isShow=!1,this.closeDialog()},cancelRefound:function(){var e=this,t={uuid:this.obj.uuid};Object(c["c"])(t).then((function(t){200===t.code&&(e.$message.success("成功"),e.$emit("freshParent"),e.closeDialog())})).catch((function(e){}))},showRefound:function(e){e.uuid=this.obj.uuid,this.refoundObj={isShow:!0,data:e}}},mounted:function(){},computed:{showObj:function(){return this.orderObj.isShow}},watch:{showObj:function(e){e?(this.obj=this.orderObj.data,this.obj.buyerInfo||(this.obj.buyerInfo={vipInfo:{}}),this.obj.orderInfo.payInfo||(this.obj.orderInfo.payInfo={}),this.googsList.push({goodsName:this.obj.goodsName,goodsType:this.obj.goodsType,shareMoneyStatus:this.obj.orderInfo.shareMoneyStatus,originalPrice:this.obj.originalPrice,goodsPrice:this.obj.goodsPrice,goodsCount:this.obj.goodsCount,totalPrice:this.obj.totalPrice,payPrice:this.obj.payPrice})):(this.obj={orderInfo:{payInfo:{}},buyerInfo:{isShopper:!1,vipInfo:{isVip:!1}},refundInfo:{}},this.googsList=[])}}},f=d,b=(a("4f67"),a("5511")),p=Object(b["a"])(f,s,l,!1,null,"402e9c90",null),m=p.exports;function v(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function h(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?v(Object(a),!0).forEach((function(t){Object(o["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):v(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var y={components:{orderDetail:m},data:function(){return{loading:!1,searchParams:{},time:[],orderList:[],status:[{value:0,label:"进行中"},{value:1,label:"未开始"},{value:2,label:"已结束"}],payStatus:u["payStatus"],goodsTypeList:u["courseTypeList"],orderObj:{isShow:!1,data:{}},page:{page:1,limit:10,total:0}}},methods:{searchList:function(){var e=this;this.time=this.time||[];var t=this.$utils.formatRange(this.time);this.searchParams.searchTime_after=t[0],this.searchParams.searchTime_before=t[1];var a=h({},this.searchParams,{page:this.page.page,pageSize:this.page.limit});this.loading=!0,Object(c["n"])(a).then((function(t){e.loading=!1,200===t.code&&(e.orderList=t.data.results,e.page.total=t.data.count)})).catch((function(t){e.loading=!1}))},showDetail:function(e){this.orderObj={isShow:!0,data:e}},changePage:function(e,t){this.page.limit=t,this.page.page=e,this.searchList()},reset:function(){this.page.page=1,this.page.limit=10,this.page.total=0,this.searchParams={},this.time=[],this.searchList()},closeMain:function(e){this.orderObj.isShow=!1}},created:function(){this.searchList()}},g=y,_=(a("fbbe"),Object(b["a"])(g,n,r,!1,null,"c0041712",null));t["default"]=_.exports},db49:function(e,t,a){"use strict";a.r(t),a.d(t,"orderStatus",(function(){return n})),a.d(t,"refundStatus",(function(){return r})),a.d(t,"payStatus",(function(){return o})),a.d(t,"couponType",(function(){return s})),a.d(t,"courseTypes",(function(){return l})),a.d(t,"courseRights",(function(){return i})),a.d(t,"courseModality",(function(){return u})),a.d(t,"courseStatus",(function(){return c})),a.d(t,"checkStatus",(function(){return d})),a.d(t,"userStatus",(function(){return f})),a.d(t,"adminStatus",(function(){return b})),a.d(t,"userSource",(function(){return p})),a.d(t,"courseTypeList",(function(){return m})),a.d(t,"shareMoneyStatus",(function(){return v}));var n=[{value:1,label:"未发货"},{value:2,label:"已发货"},{value:3,label:"已完成"},{value:4,label:"申请退货中"},{value:5,label:"已退货"}],r=[{value:1,label:"等待处理"},{value:2,label:"退款成功"},{value:3,label:"退款财务不通过"},{value:4,label:"取消申请退款"}],o=[{value:1,label:"未付款"},{value:2,label:"已付款"},{value:3,label:"退款中"},{value:4,label:"已退款"},{value:5,label:"支付超时"},{value:6,label:"用户取消"},{value:7,label:"管理员取消"}],s=[{value:1,label:"单品券"},{value:2,label:"品类券"},{value:3,label:"通用券"}],l=[{value:1,label:"单次课"},{value:2,label:"系列课"}],i=[{value:1,label:"免费课"},{value:2,label:"VIP"},{value:3,label:"精品课"}],u=[{value:1,label:"直播课"},{value:2,label:"音频课"},{value:3,label:"视频课"}],c=[{value:1,label:"启用"},{value:2,label:"停用"},{value:3,label:"下架"}],d=[{value:1,label:"待审核"},{value:2,label:"审核通过"},{value:3,label:"审核未通过"},{value:4,label:"建议人工复审"}],f=[{value:1,label:"正常"},{value:2,label:"删除"},{value:3,label:"禁止登录"},{value:4,label:"禁止发言"}],b=[{value:1,label:"正常"},{value:2,label:"删除"},{value:3,label:"禁用"},{value:4,label:"非管理员"}],p=[{value:1,label:"H5"},{value:2,label:"App"},{value:3,label:"小程序"},{value:4,label:"老数据用户"}],m=[{value:1,label:"单次课"},{value:2,label:"系列课"},{value:3,label:"会员卡"},{value:4,label:"虚拟物品"},{value:5,label:"实物"},{value:6,label:"专题"}],v=[{value:1,label:"无分销"},{value:2,label:"未结算"},{value:3,label:"已结算"},{value:4,label:"已取消"}]},e069:function(e,t,a){},f8b7:function(e,t,a){"use strict";a.d(t,"n",(function(){return r})),a.d(t,"b",(function(){return o})),a.d(t,"c",(function(){return s})),a.d(t,"o",(function(){return l})),a.d(t,"p",(function(){return i})),a.d(t,"j",(function(){return u})),a.d(t,"m",(function(){return c})),a.d(t,"a",(function(){return d})),a.d(t,"l",(function(){return f})),a.d(t,"k",(function(){return b})),a.d(t,"q",(function(){return p})),a.d(t,"i",(function(){return m})),a.d(t,"h",(function(){return v})),a.d(t,"g",(function(){return h})),a.d(t,"f",(function(){return y})),a.d(t,"e",(function(){return g})),a.d(t,"d",(function(){return _}));a("82c6");var n=a("c1fb"),r=function(e){return Object(n["c"])("".concat(n["a"],"/manage/orderManage/orderManage/"),e)},o=function(e){return Object(n["e"])("".concat(n["a"],"/manage/orderManage/orderManage/"),e)},s=function(e){return Object(n["b"])("".concat(n["a"],"/manage/orderManage/orderManage/").concat(e.uuid,"/"),e)},l=function(e){return Object(n["c"])("".concat(n["a"],"/manage/orderManage/refundManage/"),e)},i=function(e){return Object(n["c"])("".concat(n["a"],"/manage/orderManage/refundManage/").concat(e.uuid,"/detailInfo/"),e)},u=function(e){return Object(n["f"])("".concat(n["a"],"/manage/orderManage/refundManage/").concat(e.uuid,"/"),e)},c=function(e){return Object(n["c"])("".concat(n["a"],"/manage/couponManage/"),e)},d=function(e){return Object(n["e"])("".concat(n["a"],"/manage/couponManage/"),e)},f=function(e){return Object(n["f"])("".concat(n["a"],"/manage/couponManage/").concat(e.uuid,"/"),e)},b=function(e){return Object(n["b"])("".concat(n["a"],"/manage/couponManage/").concat(e.uuid,"/"),e)},p=function(e){return Object(n["c"])("".concat(n["a"],"/manage/couponManage/userCoupon/detail/"),e)},m=function(e){return Object(n["c"])("".concat(n["a"],"/manage/dividedManagement/courseRepresManag/"),e)},v=function(e){return Object(n["c"])("".concat(n["a"],"/manage/dividedManagement/courseRepresManagOrderDetail/"),e)},h=function(e){return Object(n["b"])("".concat(n["a"],"/manage/dividedManagement/courseRepresManag/").concat(e.uuid,"/"),e)},y=function(e){return Object(n["c"])("".concat(n["a"],"/manage/dividedManagement/classRepreDivideTradeManag/"),e)},g=function(e){return Object(n["c"])("".concat(n["a"],"/manage/dividedManagement/classRepreCashwithdrawManag/"),e)},_=function(e){return Object(n["f"])("".concat(n["a"],"/manage/dividedManagement/classRepreCashwithdrawManag/").concat(e.uuid,"/"),e)}},fbbe:function(e,t,a){"use strict";var n=a("1148"),r=a.n(n);r.a}}]);
//# sourceMappingURL=chunk-860ccb98.a44066be.js.map