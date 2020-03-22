<template>
  <div class="all-user">
     <!-- 搜索条件 -->
    <el-form inline label-position="right" label-width="80px">
      <el-row>
        <el-form-item label="用户名">
          <el-input placeholder="用户名" size="small"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input placeholder="用户ID" size="small"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input placeholder="电话" size="small"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="地区">
          <el-input placeholder="地区" size="small"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-button @click="searchList" class="ml40 mb20" type="primary" icon="el-icon-search" size="small">查询</el-button>
      </el-row>
    </el-form>
     <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20">
      <el-table-column prop="id" label="用户ID"></el-table-column>
      <el-table-column prop="id" label="用户名"></el-table-column>
      <el-table-column prop="name" label="电话"></el-table-column>
      <el-table-column prop="id" label="地区"></el-table-column>
      <el-table-column prop="id" label="注册时间"></el-table-column>
      <el-table-column prop="id" label="邀请好友数"></el-table-column>
      <el-table-column prop="id" label="成功购买好友"></el-table-column>
      <el-table-column prop="id" label="操作" width="150px">
        <template slot-scope="">
          <el-button @click="isShowDetail=true" icon="el-icon-view" type="primary" size="small">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total,prev, pager, next" :total="100"></el-pagination>
    <!-- 详情弹框 -->
    <el-dialog :visible.sync="isShowDetail" title="好友邀请明细" width="700px">
      <el-row class="mb20">
        <el-col :span="3">
          <div class="user-cover">
            <img class="author-avator" src='http://f.hiphotos.baidu.com/image/pic/item/0e2442a7d933c8956c0e8eeadb1373f08202002a.jpg' alt=''>
          </div>
        </el-col>
        <el-col :span="18" class="compet-desc">
          <div class="mb10">
            <span class="mr20">用户名：XXX</span>  
            <span class="mr20">注册时间：XXX</span>
          </div>
          <div class="mb10">
            <span class="mr20">邀请好友数：XXX 人</span>  
            <span class="mr20">成功交易好友数：XXX 人</span>
          </div>
        </el-col>
      </el-row>
      <el-table :data="list" border stripe class="mb20">
      <el-table-column prop="id" label="序号" align="center"></el-table-column>
      <el-table-column prop="id" label="用户名" align="center"></el-table-column>
      <el-table-column prop="name" label="电话" align="center"></el-table-column>
      <el-table-column prop="id" label="注册时间" align="center"></el-table-column>
      <el-table-column prop="id" label="是否交易" align="center"></el-table-column>
    </el-table>
      <el-row class="tc mt20">
        <el-button type="primary" @click="isShowDetail = false">确 定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
// import model from '@/components/story/model'
export default {
  components:{
    // model
  },
  data(){
    return{
      activeName:'0',
      value6:'',
      time:[],
      list: [{ id: 1, name: "seine" },{ id: 12, name: "wanqn" }],
      status: [
        { value: 0, label: "进行中" },
        { value: 1, label: "未开始" },
        { value: 2, label: "已结束" }
      ], //状态
      isShowDetail:false,
    }
  },
  methods:{
     //列表查询
    searchList(){
      let time = {
        startTime: new Date(this.time[0]).getTime() || '',
        endTime: this.$utils.formatEndTime(this.time[1]) || ''
      }
      console.log(time)
    },
       //删除用户
    deleteUser(row) {
       this.$confirm('确定删除用户'+ row.name +'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
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
