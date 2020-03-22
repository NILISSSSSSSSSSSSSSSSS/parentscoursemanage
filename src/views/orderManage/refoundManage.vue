<template>
  <div class="all-user">
     <!-- 搜索条件 -->
    <el-form  @keyup.enter.native="searchList" inline label-position="right" label-width="80px">
      <el-form-item label="订单编号">
        <el-input placeholder="订单编号"  v-model="searchParams.detailNum" size="small"></el-input>
      </el-form-item>
      <el-form-item label="买家">
        <el-input placeholder="买家昵称" v-model="searchParams.buyerName"  size="small"></el-input>
      </el-form-item>
      <el-row>
          <el-form-item label="退款状态">
              <el-select v-model='searchParams.refundMoneyStatus' size='small' clearable>
                <el-option v-for='(itm,index) in refundStatus' :key='index' :label='itm.label' :value='itm.value'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请时间">
              <el-date-picker
              v-model="searchParams.timBox"
                type="daterange"
                value-format='yyyy-MM-dd'
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
              ></el-date-picker>
            </el-form-item>
            <el-button @click="searchList" class="ml40 mb20" type="primary" icon="el-icon-search" size="small">查询</el-button>
            <el-button @click="resetParams" class="ml40 mb20" type="primary" icon="el-icon-setting" size="small" plain>重置</el-button>
      </el-row>
    </el-form>
     <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20" v-loading="loading">
      <el-table-column prop="refundNum" label="退款编号"></el-table-column>
      <el-table-column prop="orderNum" label="订单编号"></el-table-column>
      <el-table-column prop="buyerName" label="买家"></el-table-column>
      <el-table-column  label="订单金额">
        <template slot-scope='{row}'>
          <span>{{$math.divide(row.goodsPrice,100)}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="退款金额">
        <template slot-scope='{row}'>
          <span>{{$math.divide(row.refundMoney,100)}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="申请时间">
        <template slot-scope='{row}'>
          <span>{{row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款状态">
        <template slot-scope='{row}'>
          <span>{{row.refundMoneyStatus | refundMoneyStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="实付金额">
        <template slot-scope='{row}'>
          <span>{{$math.divide(row.payPrice,100)}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="250px">
        <template slot-scope="{row}">
          <el-button @click="showDetail(row,0)" icon="el-icon-view" type="success" size="small">查看详情</el-button>
          <el-button v-if="row.refundMoneyStatus==1" @click="showDetail(row,1)" icon="el-icon-s-check" type="warning" size="small">财务审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <!-- 订单详情 -->
    <refoundDetail :orderObj='orderObj' @closeMain="closeMain" @freshParent="searchList()"/>
  </div>
</template>
<script>
import refoundDetail from '@/components/orderManage/refoundDetail'
import {refundStatus} from'@/config'
import { getRefundList } from '@/api/order'
export default {
  components:{
    refoundDetail
  },
  data(){
    return{
      searchParams: { timBox: [] },
      loading:false,
      list: [],
      
      refundStatus:refundStatus,
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
  mounted() {
    this.searchList();
  },
  methods:{
     //列表查询
    searchList(){
        let time = this.$utils.formatRange(this.searchParams.timBox),
            param = {
              page: this.page.page,
              pageSize: this.page.limit,
              searchTime_after: this.searchParams.timBox ? time[0] : null,
              searchTime_before: this.searchParams.timBox ? time[1] : null,
              detailNum: this.searchParams.detailNum,
              buyerName: this.searchParams.buyerName,
              refundMoneyStatus: this.searchParams.refundMoneyStatus,
            }
        this.loading = true;
        getRefundList(param).then(res => {
          this.loading = false;
          if (res.code === 200) {
            if (res.data && res.data.count > 0) {
              [this.list, this.page.total] = [res.data.results, res.data.count]
            }
            else {
              [this.list, this.page.total] = [[], 0]
            }
          }
        
        }).catch(res => {
          this.loading = false;
        })
    },
    showDetail(row,check){
      this.orderObj = {
        isShow: true,
        data: row.uuid,
        check: check ? true : false
      }
    },
    changePage(page, pageSize) {
      this.page.limit = pageSize;
      this.page.page = page;
      this.searchList();
    },
    resetParams() {
        this.page.page=1;
        this.searchParams = {timBox: [] };
        this.searchList()
      },
      closeMain(obj) {
        this.orderObj.isShow = false;
      }
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
