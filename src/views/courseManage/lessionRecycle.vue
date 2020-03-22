<template>
  <div class="all-user">
    <!-- 搜索条件 -->
    <el-form  @keyup.enter.native="searchList" inline label-position="right" label-width="100px">
      <el-row>
        <el-form-item label="课程名称">
          <el-input v-model.trim="searchParams.name" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="专家名称">
          <el-input v-model.trim="searchParams.expertName" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="标签名称">
          <el-input v-model.trim="searchParams.tagName" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="课程权限">
          <el-select size="small" v-model="searchParams.coursePermission" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in PermissionList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-select size="small" v-model="searchParams.status" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in stateList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型">
            <el-select size="small" v-model="searchParams.courseType" placeholder="请选择" clearable>
                <el-option  label="单次课" value="1">
                </el-option>
                <el-option  label="系列课" value="2">
                  </el-option>
              </el-select>

        </el-form-item>
        <el-form-item label="创建时间范围">
          <el-date-picker v-model="createTime" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format='yyyy-MM-dd' size="small" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="开课时间范围">
          <el-date-picker v-model="updateTime" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format='yyyy-MM-dd' size="small" clearable></el-date-picker>
        </el-form-item>
        <el-button @click="searchList" class="ml40 mb20 mt4" icon="el-icon-search" type="success" size="small">查询
        </el-button>
        <el-button class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" @click="resetParams" plain>
          重置</el-button>
      </el-row>
    </el-form>
    <!-- 搜索结果 -->
    <el-table :data="dataList" border stripe class="mb20" v-loading="loading">
      <el-table-column label="封面" width='120px'>
        <template slot-scope='{row}'>
          <div class="course-img">
            <img :src="row.courseBanner" class="w100" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="课程名称" width='180px'></el-table-column>
      <el-table-column label="课程状态">
        <template slot-scope='{row}'>
          <span :class="row.updateStatus!==2 ? 'col-sucs' :'col-danger'">{{row.updateStatus | updateStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="课程权限">
        <template slot-scope='{row}'>
          <span>{{row.coursePermission | courseRights}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="experts.name" label="专家"></el-table-column>
      <el-table-column prop="id" label="创建时间" width="160px">
        <template slot-scope='{row}'>
          <span>{{row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开课时间" width="160px">
        <template slot-scope='{row}'>
          <span>{{row.startTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realPrice" label="定价(元)">
        <template slot-scope='{row}'>
          <span>{{$math.divide(row.realPrice,100)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="课程时长">
        <template slot-scope='scope'>
          <span>{{scope.row.duration | TimestampToTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用状态">
        <template slot-scope='{row}'>
          <span :class="row.status===1 ? 'col-sucs' :'col-danger'">{{row.status | courseStatus}}</span>
        </template></el-table-column>
     
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope" style="text-align:center;">
          <el-button icon="el-icon-view" type="primary" size="small" @click="change(scope.row,1)">还原</el-button>
          <el-button icon="el-icon-delete" type="danger" size="small" @click="change(scope.row,4)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
  </div>
</template>
<script>
  import { getRecyList, changeCourseStu } from "@/api/home";
  const config = require('@/config')
  export default {
    components: {
    },
    data() {
      return {
        searchParams: {
         
        },
        dataList: [],
       
        stateList: config.courseStatus,//课程状态
        // courseTypeList: config.courseModality,//课程形式
        createTime: [],
        updateTime: [],
        PermissionList: config.courseRights,//课程权限
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        loading:false,
      }
    },
    methods: {
      resetParams() {
        this.page.page = 1;
        this.searchParams = {
         
        };
        this.updateTime=[];
        this.createTime=[];
        this.searchList()
      },

      //列表查询
      searchList() {
        let createTime = this.createTime || [],
          updateTime = this.updateTime || []
        createTime = this.$utils.formatRange(createTime)
        updateTime = this.$utils.formatRange(updateTime)
        this.searchParams.createTime_after = createTime[0]
        this.searchParams.createTime_before = createTime[1]
        this.searchParams.startTime_after = updateTime[0]
        this.searchParams.startTime_before = updateTime[1]
        let param = {
          ... this.searchParams,
          page: this.page.page,
          courseType:this.searchParams.courseType,
          pageSize: this.page.limit
        }
        this.loading=true;
        getRecyList(param).then(res => {
          this.loading=false;
          if (res.code === 200) {
            this.dataList = res.data.results
            this.page.total = res.data.count
          }
        }).catch(err=>{
          this.loading=false;
        })
      },
      change(row, str) {
        if (str === 1) {
          this.changeApi(row, str)
        } else {
          this.$confirm('确定删除课程【' + row.name + '】吗?该操作不可恢复！', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.changeApi(row, str)
          }).catch(() => {
            this.$message.info('已取消')
          });
        }
      },
      changeApi(row, str) {
        let param = {
          uuid: row.uuid,
          status: str
        }
        changeCourseStu(param).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg || '操作成功')
            this.searchList()
          }
        }).catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
    },
    created() {
      this.searchList()
    }
  }
</script>
<style lang="less" scoped>
</style>