(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0973c638"],{2262:function(t,e,a){"use strict";var l=a("de4f"),s=a.n(l);s.a},"8d6f":function(t,e,a){"use strict";a.r(e);var l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"all-user"},[a("el-form",{attrs:{inline:"","label-position":"right","label-width":"80px"}},[a("el-row",[a("el-form-item",{attrs:{label:"用户名"}},[a("el-input",{attrs:{placeholder:"用户名",size:"small"}})],1),a("el-form-item",{attrs:{label:"用户ID"}},[a("el-input",{attrs:{placeholder:"用户ID",size:"small"}})],1),a("el-form-item",{attrs:{label:"电话"}},[a("el-input",{attrs:{placeholder:"电话",size:"small"}})],1)],1),a("el-row",[a("el-form-item",{attrs:{label:"地区"}},[a("el-input",{attrs:{placeholder:"地区",size:"small"}})],1),a("el-form-item",{attrs:{label:"注册时间"}},[a("el-date-picker",{attrs:{type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",size:"small"},model:{value:t.time,callback:function(e){t.time=e},expression:"time"}})],1),a("el-button",{staticClass:"ml40 mb20",attrs:{type:"primary",icon:"el-icon-search",size:"small"},on:{click:t.searchList}},[t._v("查询")])],1)],1),a("el-table",{staticClass:"mb20",attrs:{data:t.list,border:"",stripe:""}},[a("el-table-column",{attrs:{prop:"id",label:"用户ID"}}),a("el-table-column",{attrs:{prop:"id",label:"用户名"}}),a("el-table-column",{attrs:{prop:"name",label:"电话"}}),a("el-table-column",{attrs:{prop:"id",label:"地区"}}),a("el-table-column",{attrs:{prop:"id",label:"注册时间"}}),a("el-table-column",{attrs:{prop:"id",label:"邀请好友数"}}),a("el-table-column",{attrs:{prop:"id",label:"成功购买好友"}}),a("el-table-column",{attrs:{prop:"id",label:"操作",width:"150px"}},[[a("el-button",{attrs:{icon:"el-icon-view",type:"primary",size:"small"},on:{click:function(e){t.isShowDetail=!0}}},[t._v("查看明细")])]],2)],1),a("el-pagination",{attrs:{background:"",layout:"total,prev, pager, next",total:100}}),a("el-dialog",{attrs:{visible:t.isShowDetail,title:"好友邀请明细",width:"700px"},on:{"update:visible":function(e){t.isShowDetail=e}}},[a("el-row",{staticClass:"mb20"},[a("el-col",{attrs:{span:3}},[a("div",{staticClass:"user-cover"},[a("img",{staticClass:"author-avator",attrs:{src:"http://f.hiphotos.baidu.com/image/pic/item/0e2442a7d933c8956c0e8eeadb1373f08202002a.jpg",alt:""}})])]),a("el-col",{staticClass:"compet-desc",attrs:{span:18}},[a("div",{staticClass:"mb10"},[a("span",{staticClass:"mr20"},[t._v("用户名：XXX")]),a("span",{staticClass:"mr20"},[t._v("注册时间：XXX")])]),a("div",{staticClass:"mb10"},[a("span",{staticClass:"mr20"},[t._v("邀请好友数：XXX 人")]),a("span",{staticClass:"mr20"},[t._v("成功交易好友数：XXX 人")])])])],1),a("el-table",{staticClass:"mb20",attrs:{data:t.list,border:"",stripe:""}},[a("el-table-column",{attrs:{prop:"id",label:"序号",align:"center"}}),a("el-table-column",{attrs:{prop:"id",label:"用户名",align:"center"}}),a("el-table-column",{attrs:{prop:"name",label:"电话",align:"center"}}),a("el-table-column",{attrs:{prop:"id",label:"注册时间",align:"center"}}),a("el-table-column",{attrs:{prop:"id",label:"是否交易",align:"center"}})],1),a("el-row",{staticClass:"tc mt20"},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.isShowDetail=!1}}},[t._v("确 定")])],1)],1)],1)},s=[],i=(a("cc57"),{components:{},data:function(){return{activeName:"0",value6:"",time:[],list:[{id:1,name:"seine"},{id:12,name:"wanqn"}],status:[{value:0,label:"进行中"},{value:1,label:"未开始"},{value:2,label:"已结束"}],isShowDetail:!1}},methods:{searchList:function(){var t={startTime:new Date(this.time[0]).getTime()||"",endTime:this.$utils.formatEndTime(this.time[1])||""};console.log(t)},deleteUser:function(t){var e=this;this.$confirm("确定删除用户"+t.name+"?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){})).catch((function(){e.$message({type:"info",message:"已取消删除"})}))}}}),r=i,n=(a("2262"),a("5511")),o=Object(n["a"])(r,l,s,!1,null,"3e08a6ee",null);e["default"]=o.exports},de4f:function(t,e,a){}}]);
//# sourceMappingURL=chunk-0973c638.c1ab63df.js.map