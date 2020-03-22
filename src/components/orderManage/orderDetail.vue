<template>
  <div class="coupon-detail">
    <el-dialog :visible.sync='orderObj.isShow' title='订单详情' width='1000px' :close-on-click-modal='false'>
      <!-- 订单信息 -->
      <el-row class="bold">订单信息</el-row>
      <el-row class="lh40 bor-btm mb20">
        <span class="ml20">订单号：{{obj.detailNum}}</span>
        <span class="ml20">订单时间：{{obj.createTime | formatDate}}</span>
        <span class="ml20">订单状态：
          <span
            :class="obj.orderInfo.payStatus!==2 ? 'col-danger':'col-sucs'">{{obj.orderInfo.payStatus | payStatus}}</span>
        </span>
        <span class="ml20">实付金额：{{$math.divide(obj.payPrice,100)}}元</span>
      </el-row>
      <!-- 商品信息 -->
      <el-row class="mb10 bold">商品信息</el-row>
      <el-table :data="googsList" border stripe class="mb20">
        <el-table-column prop="goodsName" label="商品名称" width='220'></el-table-column>
        <el-table-column prop="goodsType" label="商品类型">
          <template slot-scope='scope'>
            <div v-for='(itm,index) in goodsTypeList' :key='index'>
              <span v-if='scope.row.goodsType === itm.value'>{{itm.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="shareMoneyStatus" label="状态分销">
          <template slot-scope='scope'>
            <span>{{scope.row.shareMoneyStatus | shareMoneyStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品划线价">
          <template slot-scope='scope'>
            <span>{{$math.divide(scope.row.originalPrice,100)}}元</span>
          </template>
        </el-table-column>
        <el-table-column label="商品单价">
          <template slot-scope='scope'>
            <span>{{$math.divide(scope.row.goodsPrice,100)}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsCount" label="购买数量"></el-table-column>
        <el-table-column label="商品总价">
          <template slot-scope='scope'>
            <span>{{$math.divide(scope.row.totalPrice,100)}}元</span>
          </template>
        </el-table-column>
        <el-table-column label="实付金额">
          <template slot-scope='scope'>
            <span>{{$math.divide(scope.row.payPrice,100)}}元</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope='scope'>
            <el-button v-if="obj.orderInfo.payStatus=='2'" @click='showRefound(scope.row)' type='text' size='small'>申请退款</el-button>
            <el-button v-if="obj.orderInfo.payStatus=='3'" @click='cancelRefound(scope.row)' type='text' size='small'>取消退款申请</el-button>
            
          </template>
        </el-table-column>
      </el-table>
      <!-- 付款信息 -->
      <div class="bor-btm">
        <el-row class="mt10 bold">付款信息</el-row>
        <el-row class="lh30 mt5 ml20">
          <span>商品总价：</span>
          <span>￥{{$math.divide(obj.totalPrice,100)}}元</span>
        </el-row>
        <!-- <el-row class="lh30 ml20">
          <span>　　运费：</span>
          <span>￥{{$math.divide(obj.totalPrice,100)}}元</span>
        </el-row> -->
        <el-row class="lh30 ml20">
          <span>　优惠券：</span>
          <span>￥{{$math.divide(obj.couponPrice,100)}}元</span>
        </el-row>
        <el-row class="lh30 ml20">
          <span>付款方式：</span>
          <span>{{obj.orderInfo.payInfo.payWayName}}</span>
        </el-row>
        <el-row class="lh30 ml20">
          <span>付款时间：</span>
          <span>{{obj.orderInfo.payInfo.payTime | formatDate}}</span>
        </el-row>
        <el-row class="lh30 ml20">
          <span class="bold">实付金额：</span>
          <span class="col-danger">￥{{$math.divide(obj.payPrice,100)}}元</span>
        </el-row>
      </div>
      <!-- 用户信息 -->
      <el-row class="bold mt20">用户信息</el-row>
      <div class="mt10 pb10 bor-btm">
        <span class="mr20 ml20">
          用户：<img v-if='obj.buyerInfo.avatar' class="user-avatar middle" :src="obj.buyerInfo.avatar" alt="用户头像">
          {{obj.buyerInfo.nickName}}
        </span>
        <span class="mr20 ml20">用户手机号：{{obj.buyerInfo.tel}}</span>
        <span class="mr20 ml20">用户身份：
          <span class="mr5">{{obj.buyerInfo.isShopper ? '店主':''}}</span>
          <span class="mr5">{{obj.buyerInfo.vipInfo.isVip ? 'VIP':''}}</span>
          <span v-if='!obj.buyerInfo.isShopper && !obj.buyerInfo.vipInfo.isVip'>普通用户</span>
        </span>
        <span class="mr20 ml20">用户来源：
          <span v-for='(itm,index) in userSource' :key='index'>
            <span v-if='obj.buyerInfo.registerPlatform===itm.value'>{{itm.label}}</span>
          </span>
        </span>
      </div>

      <!-- 退款信息 若发起退款申请则展示 -->
      <template v-if="obj.refundInfo && obj.refundInfo.refundMoneyStatus">
        <el-row class="mt20 mb20 bold">退款信息</el-row>
        <!-- 未受理 -->
        <div v-if="obj.refundInfo.refundMoneyStatus!=2">
          <el-row class="mb20">
            <span class="ml20">退款状态：{{ obj.refundInfo.refundMoneyStatus | refundMoneyStatus}}</span>
            <span class="ml20">退款编号：{{ obj.refundInfo.refundNum }}</span>
            <span class="ml20">退款金额：{{$math.divide(obj.refundInfo.refundMoney,100)}}元</span>
          </el-row>
          <el-col>
            <el-col class="lh40 mb20">
              <div class="ml20" style="height: 200px;">
                <el-steps direction="vertical" :active="1">
                  <el-step v-for="(item,index) in obj.refundOperationInfo" :key="index"  :title="$utils.formatDate(item.createTime,'yyyy-MM-dd hh:mm:ss')"
                    :description='item.operation+" 备注："+item.remark'></el-step>
                </el-steps>
              </div>
            </el-col>
          </el-col>

        </div>
        <!-- 已受理 -->
        <el-row class="lh30 mb20" v-else>
          <template v-if="obj.refundInfo">
            <el-row class="ml20">退款编号：{{ obj.refundInfo.refundNum }}</el-row>
            <el-row class="ml20">退款发起人：{{ obj.refundInfo.creator }}</el-row>
            <el-row class="ml20">申请退款时间：{{ obj.refundInfo.createTime | formatDate }}</el-row>
            <el-row class="ml20">退款状态：{{ obj.refundInfo.refundMoneyStatus | refundMoneyStatus}}</el-row>
            <el-row class="ml20">受理人：{{ obj.refundInfo.receiver }}</el-row>
            <el-row class="ml20">退款金额：{{$math.divide(obj.refundInfo.refundMoney,100)}}元（退还至买家余额账户）</el-row>
            <el-row class="ml20">退款原因：{{ obj.refundInfo.refundReason }}</el-row>
          </template>
        </el-row>
      </template>
      <el-row class="tc mt20">
        <el-button @click='orderObj.isShow = false' type='success'>关闭详情</el-button>
      </el-row>
    </el-dialog>
    <!-- 申请退款 -->
    <editRefound :refoundObj='refoundObj'  @closeMain="closeRefund" @freshParent="$emit('freshParent')" />
  </div>
</template>
<script>
  import editRefound from './editRefound'
  import { payStatus, courseTypeList, shareMoneyStatus, userSource } from '@/config'
  import { cancelRefund } from '@/api/order'
  export default {
    props: {
      orderObj: {
        type: Object,
        default: () => { return {} }
      },
    },
    components: {
      editRefound
    },
    data() {
      return {
        googsList: [],
        obj: {
          orderInfo: {
            payInfo: {}
          },
          buyerInfo: {
            isShopper: false,
            vipInfo: {
              isVip: false
            }
          },
          refundInfo: {}
        },
        payStatusList: payStatus,//支付状态
        goodsTypeList: courseTypeList,//商品类型
        shareMoneyStatus: shareMoneyStatus,//分销状态
        userSource: userSource,//用户来源
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        time: [],
        couponTypes: [
          { name: "全部", value: "" },
          { name: "通用券", value: "1" },
          { name: "品类券", value: "2" },
          { name: "单品券", value: "3" }
        ],
        useStatus: [
          { name: "全部", value: "" },
          { name: "未使用", value: "1" },
          { name: "已使用", value: "2" },
        ],
        shopList: [],
        refoundObj: {
          isShow: false,
          data: {}
        }
      }
    },
    methods: {
      closeDialog() {
        this.$emit('closeMain')
      },
      closeRefund(){
        this.refoundObj.isShow = false;
        this.closeDialog();
      },
      //取消申请退款
      cancelRefound() {
        let param = {
          uuid: this.obj.uuid
        }
        cancelRefund(param).then(res => {
          if (res.code === 200) {
            this.$message.success("成功");
            this.$emit("freshParent");
            this.closeDialog();
          }

        }).catch(res => {


        })
      },
      showRefound(row) {
        row.uuid=this.obj.uuid;
        this.refoundObj = {
          isShow: true,
          data: row
        }
      },


    },
    mounted() {
    },
    computed: {
      showObj() {
        return this.orderObj.isShow
      }
    },
    watch: {
      showObj(a) {
        if (a) {
          this.obj = this.orderObj.data
          if (!this.obj.buyerInfo) {
            this.obj.buyerInfo = {
              vipInfo: {}
            }
          }
        
          if (!this.obj.orderInfo.payInfo) {
            this.obj.orderInfo.payInfo = {}
          }
          this.googsList.push({
            goodsName: this.obj.goodsName,
            goodsType: this.obj.goodsType,
            shareMoneyStatus: this.obj.orderInfo.shareMoneyStatus,
            originalPrice: this.obj.originalPrice,
            goodsPrice: this.obj.goodsPrice,
            goodsCount: this.obj.goodsCount,
            totalPrice: this.obj.totalPrice,
            payPrice: this.obj.payPrice
          })
        } else {
          this.obj = {
            orderInfo: {
              payInfo: {}
            },
            buyerInfo: {
              isShopper: false,
              vipInfo: {
                isVip: false
              }
            },
            refundInfo: {}
          }
          this.googsList = []
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/.el-dialog {
    margin-top: 5vh !important;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  /deep/ .el-form-item__label,
  /deep/ .el-form-item__content {
    line-height: 30px;
  }

  .finacal-div {
    border: 1px dashed #ccc;
    padding: 10px;
    border-radius: 5px;
  }
</style>