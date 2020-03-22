<template>
  <div class="all-user">
     <!-- 搜索条件 -->
    <el-form inline label-position="right" label-width="100px">
      <el-form-item label='用户名：'>
        <el-input v-model.trim='searchParam.nickName' @keyup.enter.native='searchList' placeholder='用户名' size='small' clearable></el-input>
      </el-form-item> 
      <el-form-item label='用户ID：'>
        <el-input v-model.trim='searchParam.userNum' @keyup.enter.native='searchList' placeholder='用户ID' size='small' clearable></el-input>
      </el-form-item> 
      <el-form-item label='手机号：'>
        <el-input v-model.trim='searchParam.tel' @keyup.enter.native='searchList' placeholder='手机号' size='small' clearable></el-input>
      </el-form-item> 
      <el-form-item label='用户角色：'>
        <el-select v-model='searchParam.roles'  @keyup.enter.native='searchList' size='small' clearable>
          <el-option v-for='(itm,index) in roleList' :key='index' :label='itm.name' :value='itm.name'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='用户状态：'>
        <el-select v-model.number='searchParam.managerStatus' @keyup.enter.native='searchList' size='small' clearable>
          <el-option 
          v-if="itm.value=== 1 || itm.value=== 3" 
          v-for='(itm,index) in userStatus' 
          :key='index' 
          :label='itm.label' 
          :value='itm.value'>
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='创建时间：'>
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format='yyyy-MM-dd'
            size="small"
          ></el-date-picker>
      </el-form-item>
      <el-button @click="searchList" class="ml40 mb20" type="success" icon="el-icon-search" size="small">查询</el-button>
      <el-button @click="resetForm" class="ml40 mb20" type="primary" icon="el-icon-setting" size="small" plain>重置</el-button>
      <el-button @click="showEdit(0)" class="ml40 mb20" type="primary" icon="el-icon-plus" size="small">添加管理员</el-button>
    </el-form>
     <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20" v-loading="loading">
      <el-table-column prop="userNum" label="用户ID"></el-table-column>
      <el-table-column prop="nickName" label="用户名"></el-table-column>
      <el-table-column prop="roles" label="用户角色" width='200px'>
        <template slot-scope='scope'>
          <span class="mr10" v-for='(itm,index) in scope.row.roles' :key='index'>{{itm.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="手机号" width='150px'></el-table-column>
      <el-table-column prop="managerStatus" label="状态">
        <template slot-scope='scope'>
          <div v-for='(itm,index) in userStatus' :key='index'>
            <span 
            :class="scope.row.managerStatus===1? 'col-sucs' : 'col-danger'" 
            v-if="itm.value === scope.row.managerStatus">{{itm.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width='170px'>
        <template slot-scope='scope'>
          <span>{{scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="200px">
          <!-- v-if='scope.row.uuid !== adminUuid' -->
        <template slot-scope="scope">
          <el-button  @click="showEdit(1,scope.row)" icon="el-icon-edit" type="success" size="small">编辑</el-button>
          <el-button @click="deleteRole(scope.row)" icon="el-icon-delete" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <editUserRoles :editData='editData' @closeMain='closeMain' @refresh="searchList"/>
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
  </div>
</template>
<script>
import {getAdminRoles,getRoles,removeUserRoles} from '@/api/home'
import editUserRoles from '@/components/rolesManage/editUserRoles'
export default {
  components:{
    editUserRoles
  },
  data(){
    return{
      loading:false,
      searchParam:{},
      roleList:[],
      roleId:'',
      adminUuid: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')).uuid : '',
      list: [],//管理员权限列表
      roleList:[],//角色列表
      userStatus: require('@/config').adminStatus,
      editData:{
        isShow:false, //是否显示
        isEdit:false, //是否编辑 
        data:{}
      },
      time:[],
      page: {
        page: 1,
        limit: 10,
        total: 0
      },
    }
  },
  methods:{
    searchList(){
      this.time = this.time || []
      this.searchParam.searchTime_after = this.$utils.formatRange(this.time)[0]
      this.searchParam.searchTime_before = this.$utils.formatRange(this.time)[1]
      let param = {
        ... this.searchParam,
        pageSize: this.page.limit,
        page: this.page.page
      }
      this.loading=true;
      getAdminRoles(param).then(res => {
        this.loading=false;
        if(res.code === 200){
          this.list = res.data.results
          this.page.total = res.data.count
        }
      }).catch(err=>{
        this.loading=false;
      })
    },
    //新增编辑弹框
    showEdit(type,row){
      this.editData.isShow = true
      this.editData = {
        isShow: true,
        isEdit : !!type,
        data: !!type ? row : {},
      }
    },
    closeMain(){
      this.editData.isShow = false;
   
    },
    //删除用户
    deleteRole(row) {
      this.$confirm('确定删除管理员【'+ row.nickName +'】?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUserRoles({uuid:row.uuid}).then(res => {
          if(res.code === 200) {
            this.$message.success(res.msg || '删除成功')
            this.searchList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    changePage(page, pageSize) {
      this.page.limit = pageSize;
      this.page.page = page;
      this.searchList();
    },
    //获取用户角色列表
    getRolesList(){
      let param = {
        page: 1,
        pageSize: 100000,
      }
      getRoles(param).then(res =>{
        if(res.code === 200) {
          this.roleList = res.data.results
        }
      })
    },
    resetForm(){
      this.searchParam = {}
      this.time = []
      this.searchList()
    }

  },
  created(){
    this.getRolesList()
    this.searchList()
  }
}
</script>
<style lang="less" scoped>
   /deep/ .el-table th {
    background: #e9eef3;
  }
  .author-avator{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .my-audio{
    height: 40px;
    width: 400px;
    margin: 10px auto;
  }
</style>
