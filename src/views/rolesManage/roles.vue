<template>
  <div class="all-user">
     <!-- 搜索条件 -->
    <el-form inline @submit.native.prevent label-position="right" label-width="100px">
      <el-form-item label='角色名称：'>
        <el-input v-model.trim='name' @keyup.enter.native='searchList' placeholder='角色名称' clearable></el-input>
        <!-- <el-select v-model='roleId' size='small' clearable>
          <el-option v-for='(itm,index) in roleList' :key='index' :label='itm.name' :value='itm.value'></el-option>
        </el-select> -->
      </el-form-item>
      <el-button @click="searchList" class="ml40 mb20" type="success" icon="el-icon-search">查询</el-button>
      <el-button @click="showEdit(0)" class="ml40 mb20" type="primary" icon="el-icon-plus">添加角色</el-button>
    </el-form>
     <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20" v-loading="loading">
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="remark" label="角色描述"></el-table-column>
      <el-table-column prop="id" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button  @click="showEdit(1,scope.row)" icon="el-icon-edit" type="success" size="small">编辑</el-button>
          <el-button @click="deleteRole(scope.row)" icon="el-icon-delete" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <editRoles :editData='editData' @closeMain='closeMain' @freshParent="searchList"/>
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
  </div>
</template>
<script>
import { getRoles,removeRoles } from '@/api/home'
import editRoles from '@/components/rolesManage/editRoles'
export default {
  components:{
    editRoles
  },
  data(){
    return{
      roleList:[],
      name:'',//角色名称
      roleId:'',
      list: [],
      editData:{
        isShow:false, //是否显示
        isEdit:false, //是否编辑 
        data:{}
      },
      page: {
        page: 1,
        limit: 10,
        total: 0
      },
      loading:false,
    }
  },
  methods:{
    searchList(){
      let param = {
        name: this.name,
        page: this.page.page,
        pageSize: this.page.limit,
      }
      this.loading=true;
      getRoles(param).then(res =>{
        this.loading=false;
        if(res.code === 200) {
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
        data: !!type ? JSON.parse(JSON.stringify(row)) : {},
      }
    },
    closeMain(data){
      this.editData.isShow = false
    },
    //删除角色
    deleteRole(row) {
      this.$confirm('确定删除角色【'+ row.name +'】?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeRoles({uuid:row.uuid}).then(res => {
          if(res.code === 200){
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
    }
  },
  mounted(){
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
