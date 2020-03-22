<template>
  <div class="coupon-detail">
    <el-dialog :visible.sync='detailObj.isShow' title='优惠券详情' width='900px' :close-on-click-modal='false'>
      <el-form label-position="right" label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="来源：">
              <span>{{detail.source===1?'好呗呗':''}}</span>
              <!-- <span>xx门店</span> -->
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="优惠券类型：">
              <span>{{detail.couponType | couponType}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="面值：">
              <span>{{ $math.divide(detail.money,100) }} 元</span>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="发放总量：">
              <span>{{detail.totalNumber || 0}} 张</span>
            </el-form-item>
          </el-col>
        </el-row>
          <el-form-item label="优惠券名称：">
            <span>{{detail.name}}</span>
          </el-form-item>
          <el-form-item label="使用条件：" v-if="[2,3].includes(detail.couponType)">
            <span>订单满 {{$math.divide(detail.accountMoney,100)}} 元可使用（<span class="col-danger">{{!detail.isPromotion?'':'不'}}</span>支持促销商品使用）</span>
          </el-form-item>
          <el-form-item label="有效期：">
            <span>{{detail.startTime | formatDate}} 至 {{detail.endTime | formatDate}}</span>
          </el-form-item>
      </el-form>
      <!-- 搜索结果 -->
      <el-table v-if='detail.couponType===1' :data="goodsInfo" border stripe class="mb20">
        <el-table-column label="商品图片/名称">
          <template slot-scope='{row}'>
            <el-row>{{row.name}}</el-row>
            <el-row><img class="avatar" :src="row.goodsImg" alt="" style="margin: 0 auto;"></el-row>
          </template>
        </el-table-column>
        <el-table-column prop="goodsType" label="商品分类"></el-table-column>
        <el-table-column prop="id" label="价格">
          <template slot-scope='{row}'>
            <el-row>{{ $math.divide(row.realPrice,100) }} 元  </el-row>
            <el-row><del>{{ $math.divide(row.originalPrice,100) }} 元 </del></el-row>
          </template>
        </el-table-column>
        <el-table-column prop="salesNum" label="销量"></el-table-column>
      </el-table>
      <el-row class="info-div">
        <span class="bold">领取记录</span>
        <span class="ml20 mr20">已领取数：{{detail.receivedNumber || 0}} 张</span>
        <span>已使用数：{{detail.usedNumber || 0}} 张</span>
      </el-row>
      <div class="mt20">
        <el-form inline>
          <el-form-item label="使用状态">
            <el-select size="small" v-model="searchParams.status" placeholder="请选择">
              <el-option v-for="(item,index) in useStatus" :key="index" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领取时间">
            <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format='yyyy-MM-dd' size="small"></el-date-picker>
          </el-form-item>
          <el-button @click="searchList" class="mb20" type="primary" size="small">查询</el-button>
        </el-form>
      </div>
      <el-table :data="recordList" border stripe class="mb20" v-loading="loading">
        <el-table-column prop="couponsUuid" label="优惠券编号" width='260px'></el-table-column>
        <el-table-column label="领取用户">
          <template slot-scope='{row}'>
            <el-row>{{row.nickName}}</el-row>
            <el-row>{{row.tel}}</el-row>
          </template>
        </el-table-column>
        <el-table-column label="领取时间" width='170px'>
          <template slot-scope='{row}'>
            <span>{{row.createTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用状态" width='250px'>
          <template slot-scope='{row}'>
            <div v-if='row.status===2'>
              <el-row class='col-danger'>已使用</el-row>
              <el-row>使用时间:{{row.orderInfo.usedTime | formatDate}}</el-row>
              <el-row>关联订单:{{row.orderInfo.orderNum}}</el-row>
            </div>
            <div class="col-sucs" v-if='row.status===1'>未使用</div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
      <!-- 编辑优惠券 -->
    </el-dialog>
  </div>
</template>
<script>
  import {sendCpnRecord} from '@/api/order'
  export default {
    props:{
      detailObj:{
        type:Object,
        default:()=>{return {}}
      },
    },
    data() {
      return {
        searchParams:{},
        goodsInfo:[],
        recordList: [],
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        loading:false,
        time:[],
        detail:{},
        useStatus:[
          { name: "全部", value: "" },
          { name: "未使用", value: "1" },
          { name: "已使用", value: "2" },
        ],
        shopList: [],
      }
    },
    methods: {
      //列表查询
      searchList() {

        let time = this.time || []
        time = this.$utils.formatRange(time)
        let param = {
          status: this.searchParams.status,
          page:this.page.page,
          pageSize:this.page.limit,
          couponsUuid: this.detail.uuid,
          searchTime_before: time[0],
          searchTime_after: time[1]
        }
        this.loading=true;
        sendCpnRecord(param).then(res => {
          this.loading=false;
          if(res.code === 200){
            this.recordList = res.data.results
            this.page.total = res.data.count
          }
        }).catch(err=>{
          this.loading=false;
        })
      },
      showEdit(row){
        this.couponObj = {
          isShow: true,
          isEdit: true,
          data: row
        }
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      openChapterManage() {
        this.chapterManageDia = true;
      }

    },
    mounted(){
    },
    computed:{
      isShow(){
        return this.detailObj.isShow
      }
    },
    watch:{
      isShow(a){
        if(a){
          this.detail = {...this.detailObj.data}
          //单品券才有商品详情
          if(this.detail.couponType === 1 && this.detail.goodsInfo !==null){
            this.goodsInfo=[];
            this.goodsInfo.push({
              name:this.detail.goodsInfo.name || '',
              realPrice:this.detail.goodsInfo.realPrice || '',
              originalPrice:this.detail.goodsInfo.originalPrice || '',
              goodsType:this.detail.goodsInfo.goodsType || '',
              goodsImg:this.detail.goodsInfo.goodsImg || '',
              salesNum:this.detail.goodsInfo.salesNum || '',
            })
          }
          this.searchList()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/.el-dialog{
    margin-top: 5vh !important;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  /deep/ .el-form-item__label,
  /deep/ .el-form-item__content{
    line-height: 30px;
  }
</style>