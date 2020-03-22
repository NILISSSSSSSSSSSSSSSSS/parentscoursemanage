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
        <el-form-item label="课程形式">
          <el-select size="small" v-model="searchParams.chapterStyle" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in courseTypeList" :key="index" :label="item.label" :value="item.value">
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
        <el-button @click="resetParams" class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>
          重置</el-button>
      </el-row>
    </el-form>
    <!-- 搜索结果 -->
    <el-table v-loading="loading" :data="dataList" border stripe class="mb20">
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
      <el-table-column label="课程形式">
        <template slot-scope='{row}'>
          <span>{{row.chapterStyle | courseStyle}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" fixed='right'>
        <template slot-scope="scope" style="text-align:center;">
          <el-dropdown @command="changeStatus" size="small" type="warning" split-button class="mr10">
            <span>{{scope.row.status | courseStatus}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="(scope.row.uuid+',1')">启用</el-dropdown-item>
              <el-dropdown-item :command="(scope.row.uuid+',2')">停用</el-dropdown-item>
              <el-dropdown-item :command="(scope.row.uuid+',3')">下架</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button  @click='goEdit(scope.row.uuid)'
            icon="el-icon-edit" type="primary" size="small">编辑</el-button>
          <el-button @click='setTop(scope.row.uuid)' icon="el-icon-top" type="success" size="small" plain
            v-if="scope.$index!=0">置顶</el-button>
          <router-link v-if='scope.row.chapterStyle===1' class="el-button el-button--text el-button--small" style="vertical-align: middle;
          padding-bottom: 0;" :to="{path:'/liveRoom/',query:{uuid:scope.row.uuid,type:'course'}}">进入直播间</router-link>
          <a v-if="scope.row.courseSource && scope.row.courseSource.sourceUrl" download
            class="el-button el-button--text el-button--small" style="padding-bottom: 0; vertical-align: middle;"
            :href="scope.row.courseSource.sourceUrl" target="_blank">
            下载课件
          </a>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
  </div>
</template>
<script>
  import { courseList, changeCourseStu, courseTop } from '@/api/home'
  const config = require('@/config')
  export default {
    components: {
    },
    data() {
      return {
        searchParams: {
          courseType: 1,
          name: ''
        },
        loading: false,
        dataList: [],

        stateList: [
          { value: 1, label: "启用" },
         { value: 2, label: "停用" },
        ],
        courseTypeList: config.courseModality,//课程形式
        createTime: [],
        updateTime: [],
        PermissionList: config.courseRights,//课程权限
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
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
        this.searchParams.startTime_after = updateTime[0]
        this.searchParams.startTime_before = updateTime[1]
        let param = {
          ... this.searchParams,
          page: this.page.page,
          pageSize: this.page.limit
        }
        this.loading = true;
        courseList(param).then(res => {
          this.loading = false;
          if (res.code === 200) {
            this.dataList = res.data.results
            this.page.total = res.data.count
          }
        }).catch(err => {
          this.loading = false;
        })
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      //编辑
      goEdit(uuid) {
        this.$router.push({
          path: 'createCourse?courseType=1',
          query: {
            uuid: uuid
          }
        })
      },
      //停启用 | 下架 操作
      changeStatus(obj) {
        obj = obj.split(',')
        let param = {
          uuid: obj[0],
          status: Number(obj[1])
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
      //置顶
      setTop(id) {
        courseTop({ uuid: id }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg || '操作成功')
            this.page = {
              page: 1,
              pageSize: 10,
              total: 0
            }
            this.searchList()
          }
        }).catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
      }
    },
    mounted() {
      this.searchList()
    }
  }
</script>
<style lang="less" scoped>
</style>