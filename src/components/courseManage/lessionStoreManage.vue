<template>
  <div class="all-user">
      <div class="tr">
          <el-button  v-if="!isSelect" @click="uploadLessionDia=true" class="ml40 mb20 mt4" icon="el-icon-plus" type="primary" size="small">
            上传课件
          </el-button>
        </div>
    <!-- 搜索条件 -->
    <el-form  @keyup.enter.native="searchList" inline label-position="right" label-width="140px">
      <el-row>
        <el-form-item label="课件名称">
          <el-input size="small" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="课件生产时间范围">
            <el-date-picker v-model="form.timBox" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format='yyyy-MM-dd' size="small"></el-date-picker>
        </el-form-item>
        <el-button @click="searchList" class="ml40 mb20 mt4" icon="el-icon-search" type="primary" size="small">查询
        </el-button>
        <el-button  @click="resetParams" class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>重置</el-button>
      </el-row>
      <el-row>
      </el-row>
    </el-form>
    <!-- 搜索结果 -->
    <el-table v-loading="loading" ref="multipleTable" :data="list" border stripe class="mb20" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" v-if="isSelect">
      </el-table-column>
      <el-table-column prop="name" label="课件名称"></el-table-column>
      <el-table-column label="上传时间/备份时间">
        <template slot-scope="{row}">
           {{ row.createTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="课件时长" >
          <template slot-scope="{row}">
              <span v-if="type!=='live'"> {{ $utils.TimestampToTime(row.duration) }}</span>
              <span v-else>{{ $utils.TimestampToTime(row.courseDuration) }}</span>
           </template>
      </el-table-column>
      <el-table-column label="banner" v-if="type=='live'">
          <template slot-scope="{row}" v-if="row.bannerInfo">
           {{ row.bannerInfo.sourceType | liveBannerType }}
              <span v-if="[1,2].includes(row.bannerInfo.sourceType)"> ({{ $utils.TimestampToTime(row.bannerInfo.duration) }})</span>
              <span v-if="[3].includes(row.bannerInfo.sourceType)">( {{row.bannerInfo.pages }}页 )</span>
           </template>
      </el-table-column>
      <el-table-column label="操作" width="180px" v-if="!isSelect">
        <template slot-scope="{row}" style="text-align:center;">
          <el-button icon="el-icon-view" type="primary" size="small" @click="show(row)">查看</el-button>
          <el-button icon="el-icon-info" type="danger" size="small" @click="changeSta(row)">{{ row.enable == false ? '启用' : '停用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <lessionStore-detail :editData="editData" @closeMain="closeMain"></lessionStore-detail>
    <upload-lession :uploadLessionDia.sync="uploadLessionDia" :type="type" @freshParent="searchList()"></upload-lession>
  </div>
</template>
<script>
  const sourceList={'audio':"2","video":'1','live':"3"};
  import { lessionStoreList,lessionStoreChangeSta,liveList,liveListChangeSta } from '@/api/home';
  import lessionStoreDetail from "@/components/courseManage/lessionStoreDetail";
  import uploadLession from "@/components/courseManage/uploadLession";
  export default {
    components: {
      lessionStoreDetail,
      uploadLession
    },
    props: {
      type: {
        type: String,
        default: ''
      },
      /*isSelect:是否显示复选框
      */
      isSelect: {
        type: Boolean,
        default: false,
      },
     
    },
    data() {
      return {
        loading:false,
        list: [],
        form: { timeBox: [] },
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },

        editData: {
          isShow: false,
          type: this.type,
          data:{}
        },
        detailDia: false,
        uploadLessionDia: false,
      }
    },
 
    mounted() {
      // alert("开始价值");
       this.searchList();
    },
    methods: {
      handleSelectionChange(arr) {
        this.$emit("selectSuccess", arr);
      },
      //列表查询gln
      searchList() {
   
        let time = this.$utils.formatRange(this.form.timBox);
          let  param = {
              page: this.page.page,
              pageSize: this.page.limit,
              sourceType:sourceList[this.type],
              searchTime_before: this.form.timBox ? time[1] : null,
              searchTime_after: this.form.timBox ? time[0] : null,
              name: this.form.name,
            }
        this.loading = true;
        this.isSelect ? param.enable=1 : null;
        let apiName=this.type=='live' ? liveList : lessionStoreList;
        apiName(param).then(res => {
          if (res.code === 200) {
            if (res.data && res.data.count > 0) {
              console.log("课程库数据：" + JSON.stringify(res.data.results));
              [this.list, this.page.total] = [res.data.results, res.data.count]
            }
            else {
              [this.list, this.page.total] = [[], 0]
            }
          }
          this.loading = false;
        }).catch(res => {
          this.loading = false;
        })
      },
      reset() {
        this.form = { timeBox: [] };
        this.page.page = 1;
        this.searchList();
      },

      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      changeSta(row) {
       let param={
         uuid:row.uuid
       }
       let apiName=this.type=='live' ? liveListChangeSta : lessionStoreChangeSta;
       apiName(param).then(res => {
          if (res.code === 200) {
           this.$message.success("更改成功");
           this.searchList();
          }
        })
      },
      resetParams() {
        this.page.page=1;
        this.form = {timBox: [] };
        this.searchList()
      },
      closeMain(obj) {
        this.editData.isShow = false;
      },
      show(row){
        this.editData={
          isShow:true,
          type:this.type,
          data:row
        }
      }
    }
  }
</script>
<style lang="less" scoped>
</style>