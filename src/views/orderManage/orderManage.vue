<template>
  <div class="all-user">
     <!-- 搜索条件 -->
    <el-form :model='searchParams' inline label-position="right" label-width="80px">
      <el-form-item label="订单编号">
        <el-input v-model.trim='searchParams.detailNum' @keyup.enter.native='searchList' placeholder="订单编号" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model.trim='searchParams.goodsName' @keyup.enter.native='searchList' placeholder="商品名称" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="买家">
        <el-input v-model.trim='searchParams.buyerName' @keyup.enter.native='searchList' placeholder="买家昵称" size="small" clearable></el-input>
      </el-form-item>
      <el-row>
        <el-form-item label="支付状态">
          <el-select v-model.trim='searchParams.payStatus' @keyup.enter.native='searchList' size='small' clearable>
            <el-option v-for='(itm,index) in payStatus' :key='index' :label='itm.label' :value='itm.value'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
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
        <el-button @click="searchList" class="ml40 mb20" type="primary" icon="el-icon-search" size="small">查询</el-button>
        <el-button @click="reset" class="ml40 mb20" type="primary" icon="el-icon-setting" size="small" plain>重置</el-button>
      </el-row>
    </el-form>
     <!-- 搜索结果 -->
    <el-table :data="orderList" border stripe class="mb20" v-loading="loading">
      <el-table-column prop="detailNum" label="子订单编号"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width='220px'></el-table-column>
      <el-table-column prop="goodsType" label="商品类型">
        <template slot-scope='scope'>
          <div v-for='(itm,index) in goodsTypeList' :key='index'>
            <span v-if='scope.row.goodsType === itm.value'>{{itm.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="isGift" label="是否是赠品">
        <template slot-scope='scope'>
          <span>{{scope.row.isGift ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="buyerInfo.nickName" label="买家昵称"></el-table-column>
      <el-table-column label="支付状态">
        <template slot-scope='scope'>
          <span :class="scope.row.orderInfo.payStatus!==2 ? 'col-danger':'col-sucs'">{{scope.row.orderInfo.payStatus | payStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payPrice" label="实付金额(元)">
        <template slot-scope='scope'>
          <span>{{$math.divide(scope.row.payPrice,100)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间" width='170px'>
        <template slot-scope='scope'>
          <span>{{scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" icon="el-icon-view" type="success" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <!-- 订单详情 -->
    <orderDetail :orderObj='orderObj' @freshParent="searchList()" @closeMain="closeMain"/>
  </div>
</template>
<script>
import orderDetail from '@/components/orderManage/orderDetail'
import {payStatus,courseTypeList} from'@/config'
import {getOrderList} from '@/api/order'

export default {
  components:{
    orderDetail
  },
  data(){
    return{
      loading:false,
      searchParams:{},
      time:[],
      orderList: [],
      status: [
        { value: 0, label: "进行中" },
        { value: 1, label: "未开始" },
        { value: 2, label: "已结束" }
      ], //状态
      payStatus:payStatus,//支付状态
      goodsTypeList:courseTypeList,//商品类型
      orderObj:{
        isShow:false,
        data:{}
      },
      page: {
        page: 1,
        limit: 10,
        total: 0
      },
    }
  },
  methods:{
     //列表查询
    searchList(){
      this.time = this.time || []
      let time = this.$utils.formatRange(this.time)
      this.searchParams.searchTime_after = time[0]
      this.searchParams.searchTime_before = time[1]
      let param = {
        ... this.searchParams,
        page: this.page.page,
        pageSize: this.page.limit
      }
      this.loading=true;
      getOrderList(param).then(res => {
        this.loading=false;
        if(res.code === 200) {
          this.orderList = res.data.results
          this.page.total = res.data.count
        }
      }).catch(err=>{
        this.loading=false;
      })
    },
    showDetail(row){
      this.orderObj = {
        isShow: true,
        data: row
      }
    },
    changePage(page, pageSize) {
      this.page.limit = pageSize;
      this.page.page = page;
      this.searchList();
    },
    reset(){
      this.page.page = 1,
      this.page.limit = 10
      this.page.total = 0
      this.searchParams = {}
      this.time = []
      this.searchList()
    },
    closeMain(obj) {
        this.orderObj.isShow = false;
      }
  },
  created(){
    this.searchList()
  },
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
