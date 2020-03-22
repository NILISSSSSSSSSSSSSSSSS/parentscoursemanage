(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0ab1a4"],{"149d":function(e,a,t){"use strict";t.r(a);var l=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"all-user"},[t("el-form",{attrs:{inline:"","label-position":"right","label-width":"140px"},nativeOn:{keyup:function(a){return!a.type.indexOf("key")&&e._k(a.keyCode,"enter",13,a.key,"Enter")?null:e.searchList(a)}}},[t("el-row",[t("el-form-item",{attrs:{label:"课程名称"}},[t("el-input",{attrs:{size:"small"},model:{value:e.searchParams.courseName,callback:function(a){e.$set(e.searchParams,"courseName",a)},expression:"searchParams.courseName"}})],1),t("el-form-item",{attrs:{label:"用户昵称"}},[t("el-input",{attrs:{size:"small"},model:{value:e.searchParams.nickName,callback:function(a){e.$set(e.searchParams,"nickName",a)},expression:"searchParams.nickName"}})],1),t("el-form-item",{attrs:{label:"人工审核状态"}},[t("el-select",{attrs:{size:"small",placeholder:"请选择"},model:{value:e.searchParams.checkStatus,callback:function(a){e.$set(e.searchParams,"checkStatus",a)},expression:"searchParams.checkStatus"}},e._l(e.peopleCheckList,(function(e,a){return t("el-option",{key:a,attrs:{label:e.label,value:e.value}})})),1)],1),t("el-form-item",{attrs:{label:"智能审核状态"}},[t("el-select",{attrs:{size:"small",placeholder:"请选择"},model:{value:e.searchParams.interfaceStatus,callback:function(a){e.$set(e.searchParams,"interfaceStatus",a)},expression:"searchParams.interfaceStatus"}},e._l(e.interfaceStatus,(function(e,a){return t("el-option",{key:a,attrs:{label:e.label,value:e.value}})})),1)],1),t("div",[t("el-button",{staticClass:"ml40 mb20 mt4",attrs:{icon:"el-icon-search",type:"primary",size:"small"},on:{click:e.searchList}},[e._v("查询\n            ")]),t("el-button",{staticClass:"ml40 mb20 mt4",attrs:{icon:"el-icon-setting",type:"primary",size:"small",plain:""},on:{click:e.resetParams}},[e._v("重置")])],1)],1)],1),t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",staticClass:"mb20",attrs:{data:e.list,border:"",stripe:""}},[t("el-table-column",{attrs:{prop:"content",label:"评论内容"}}),t("el-table-column",{attrs:{label:"用户昵称"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return t.userInfo?[e._v("\n              "+e._s(t.userInfo.nickName)+"\n          ")]:void 0}}],null,!0)}),t("el-table-column",{attrs:{label:"评论时间"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return[e._v("\n            "+e._s(e._f("formatDate")(t.createTime))+"\n          ")]}}])}),t("el-table-column",{attrs:{label:"课程名称"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return t.courseInfo?[e._v("\n            "+e._s(t.courseInfo.name)+"\n        ")]:void 0}}],null,!0)}),t("el-table-column",{attrs:{label:"人工审核"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return[e._v("\n            "+e._s(e._f("peopleCheck")(t.checkStatus))+"\n          ")]}}])}),t("el-table-column",{attrs:{label:"智能审核"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return[e._v("\n            "+e._s(e._f("interfaceCheck")(t.interfaceStatus))+"\n          ")]}}])}),t("el-table-column",{attrs:{label:"审核状态"},scopedSlots:e._u([{key:"default",fn:function(a){var t=a.row;return[e._v("\n            "+e._s(e._f("finalCheckStatus")(t.finalCheckStatus))+"\n          ")]}}])}),t("el-table-column",{attrs:{label:"操作",width:"350px"},scopedSlots:e._u([{key:"default",fn:function(a){var l=a.row;return["1"==l.checkStatus?[t("el-button",{attrs:{icon:"el-icon-info",type:"primary",size:"small"},on:{click:function(a){return e.checkSta(l,"yes")}}},[e._v("审核通过")]),t("el-button",{attrs:{icon:"el-icon-info",type:"primary",size:"small"},on:{click:function(a){return e.checkSta(l,"not")}}},[e._v("审核不通过")])]:e._e(),t("el-button",{attrs:{icon:"el-icon-delete",type:"danger",size:"small"},on:{click:function(a){return e.del(l)}}},[e._v("删除")])]}}])})],1),t("pagination",{attrs:{currentPage:e.page.page,pageSize:e.page.limit,total:e.page.total},on:{change:e.changePage}})],1)},s=[],n=t("3191"),c={components:{},data:function(){return{list:[],peopleCheckList:[{value:"",label:"全部"},{value:1,label:"待审核"},{value:2,label:"审核通过"},{value:3,label:"审核未通过"}],interfaceStatus:[{value:"",label:"全部"},{value:1,label:"待审核"},{value:2,label:"审核通过"},{value:3,label:"审核未通过"},{value:4,label:"建议人工复审"}],searchParams:{timeBox:[]},page:{page:1,limit:10,total:0},loading:!1}},mounted:function(){this.searchList()},methods:{checkSta:function(e,a){var t=this,l={uuid:e.uuid},s=null;s="not"==a?n["L"]:n["M"],s(l).then((function(e){200===e.code&&(t.$message.success("更改成功"),t.searchList()),t.loading=!1})).catch((function(e){t.loading=!1}))},searchList:function(){var e=this;this.time=[];var a=this.$utils.formatRange(this.searchParams.timBox),t={page:this.page.page,pageSize:this.page.limit,searchTime_after:this.searchParams.timBox?a[0]:null,searchTime_before:this.searchParams.timBox?a[1]:null,interfaceStatus:this.searchParams.interfaceStatus,checkStatus:this.searchParams.checkStatus,nickName:this.searchParams.nickName,courseName:this.searchParams.courseName};this.loading=!0,Object(n["R"])(t).then((function(a){if(200===a.code)if(a.data&&a.data.count>0){var t=[a.data.results,a.data.count];e.list=t[0],e.page.total=t[1]}else{var l=[[],0];e.list=l[0],e.page.total=l[1]}e.loading=!1})).catch((function(a){e.loading=!1}))},resetParams:function(){this.page.page=1,this.searchParams={timBox:[]},this.searchList()},changePage:function(e,a){this.page.limit=a,this.page.page=e,this.searchList()},del:function(e){var a=this;this.$confirm("确定删除?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var t={uuid:e.uuid};Object(n["Q"])(t).then((function(e){200===e.code&&(a.$message.success("删除成功"),a.searchList()),a.loading=!1})).catch((function(e){a.loading=!1}))})).catch((function(){}))}}},r=c,i=t("5511"),o=Object(i["a"])(r,l,s,!1,null,"119bc1de",null);a["default"]=o.exports}}]);
//# sourceMappingURL=chunk-2d0ab1a4.92726e89.js.map