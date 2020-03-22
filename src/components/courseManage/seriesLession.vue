<template>
  <div class="all-user" >
    <!-- 搜索条件 -->
    <el-form   @keyup.enter.native="searchList" :model='searchParams' inline label-position="right" label-width="100px">
      <el-row>
        <el-form-item label="系列课名称">
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
        <el-form-item label="创建时间范围">
          <el-date-picker v-model="createTime" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format='yyyy-MM-dd' size="small"></el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间范围">
          <el-date-picker v-model="updateTime" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format='yyyy-MM-dd' size="small"></el-date-picker>
        </el-form-item>
        <el-button  @click="searchList" class="ml40 mt4 mb20" icon="el-icon-search" type="success" size="small">查询
        </el-button>
        <el-button @click="resetParams" class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>重置</el-button>
      </el-row>
      <el-row>

      </el-row>
    </el-form>
    <!-- 搜索结果 -->
    <el-table :data="dataList" border v-loading="loading" stripe class="mb20">
      <el-table-column  label="封面"  width="120px">
        <template slot-scope='{row}'>
          <div class="course-img">
            <img :src="row.courseBanner" class="w100" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="系列课名称" width='160px'></el-table-column>
      <el-table-column  label="课程状态">
        <template slot-scope='{row}'>
          <span :class="row.updateStatus===1 ? 'col-sucs' :'col-danger'">{{row.updateStatus === 1 ?'已完结' :'更新中'}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="课程权限">
        <template slot-scope='{row}'>
          <span>{{row.coursePermission | courseRights}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="experts.name" label="专家名称"></el-table-column>
      <el-table-column  label="创建时间" width="160px">
        <template slot-scope='{row}'>
          <span>{{row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="更新时间" width="160px">
        <template slot-scope='{row}'>
          <span>{{row.updateTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="定价(元)">
        <template slot-scope='{row}'>
          <span>{{$math.divide(row.realPrice,100)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="chapters" label="章节数量"></el-table-column>
      <el-table-column label="启用状态">
        <template slot-scope='{row}'>
          <span :class="row.status===1 ? 'col-sucs' :'col-danger'">{{row.status | courseStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="420px" fixed='right'>
        <template slot-scope="scope" style="text-align:center;">
          <el-dropdown size="small"  @command="changeStatus" split-button type="warning" class="mr10">
              <span>{{scope.row.status | courseStatus}}</span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="(scope.row.uuid+',1')">启用</el-dropdown-item>
                <el-dropdown-item :command="(scope.row.uuid+',2')">停用</el-dropdown-item>
                <el-dropdown-item :command="(scope.row.uuid+',3')">下架</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button  @click='goEdit(scope.row.uuid)' icon="el-icon-edit" class="mr10" type="primary" size="small">编辑</el-button>
          <el-dropdown size="small"  @command="changeSerStu" split-button type="success" class="mr10">
            更新中
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="(scope.row.uuid+',2')">更新中</el-dropdown-item>
              <el-dropdown-item :command="(scope.row.uuid+',1')">已完成</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button icon="el-icon-tickets" type="primary" size="small"  @click="openChapterManage(scope.row.uuid)" plain>章节管理
            </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>

  </div>
</template>
<script>
  import {courseList,changeCourseStu,changeSeriesStu} from '@/api/home'
  const config = require('@/config')
  export default {
    components: {
    },
    data() {
      return {
        searchParams:{
          courseType: 2
        },
        loading:false,
        dataList: [],
        stateList: [
          { value: 1, label: "启用" },
         { value: 2, label: "停用" },
        ],
        createTime: [],
        updateTime: [],
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        PermissionList: config.courseRights,
      }
    },
    methods: {
      resetParams() {
        this.page.page = 1;
        this.searchParams = {}; this.createTime = this.updateTime = [];
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
        this.searchParams.updateTime_after = updateTime[0]
        this.searchParams.updateTime_before = updateTime[1]
        let param = {
          ... this.searchParams,
          page: this.page.page,
          pageSize: this.page.limit
        }
        this.loading=true;
        courseList(param).then(res => {
          this.loading=false;
          if(res.code === 200){
            this.dataList = res.data.results
            this.page.total = res.data.count
          }
        }).catch(err=>{
          this.loading=false;
        })
      },
      //编辑
      goEdit(uuid){
        this.$router.push({
          path:'createCourse?courseType=2',
          query:{
            uuid:uuid
          }
        })
      },
      //停启用 | 下架 操作
      changeStatus(obj){
        obj = obj.split(',')
        let param = {
          uuid: obj[0],
          status: Number(obj[1])
        }
        changeCourseStu(param).then(res => {
          if(res.code === 200){
            this.$message.success(res.msg || '操作成功')
            this.searchList()
          }
        }).catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
      },
      //更新状态更改
      changeSerStu(obj){
        obj = obj.split(',')
        let param = {
          uuid: obj[0],
          updateStatus: Number(obj[1])
        }
        changeSeriesStu(param).then(res => {
          if(res.code === 200){
            this.$message.success(res.msg || '操作成功')
            this.page = {
              page:1,
              pageSize:10,
              total:0
            }
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
      openChapterManage(uuid) {
        this.$router.push({ path: "/chapterManageList",query:{"courseUuid":uuid} })
      }

    },
    mounted(){
      this.searchList()
    }
  }
</script>
<style lang="less" scoped>
  .allClass {
    span {
      margin-right: 20px;
      cursor: pointer;
    }

    .typeActived {
      color: #409EFF;
    }

    margin-bottom:25px;
  }
</style> 