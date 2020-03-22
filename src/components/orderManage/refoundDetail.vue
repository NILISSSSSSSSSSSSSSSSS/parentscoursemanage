<template>
  <div class="coupon-detail" v-loading="loading">
    <el-dialog :visible.sync='orderObj.isShow' :title='orderObj.check ? "审核": "退款详情"' width='900px'
      :close-on-click-modal='false'>
      <el-row class="bold">退款状态：<span class="col-danger">{{ detail.refundMoneyStatus | refundMoneyStatus}}</span>
      </el-row>
      <!-- 退款信息 若发起退款申请则展示 -->
      <el-row class="mt20 bold">退款信息</el-row>
      <div v-if='isOpen'>
        <!-- 已受理 -->
        <el-row class="lh30">
          <el-row class="ml20">退款编号：{{ detail.refundNum}}</el-row>
          <el-row class="ml20" v-if="detail.refundOperationInfo && detail.refundOperationInfo.length!==0">
            退款发起人：{{ detail.refundOperationInfo[0].operationUser}}</el-row>
          <el-row class="ml20">申请退款时间：{{ detail.createTime | formatDate}}</el-row>
          <el-row class="ml20">退款状态：{{ detail.refundMoneyStatus | refundMoneyStatus}}</el-row>
          <el-row class="ml20">退款金额：{{$math.divide(detail.refundMoney,100)}}元</el-row>
          <el-row class="ml20">退款原因：{{ detail.refundReason}}</el-row>
         
        </el-row>
      </div>
      <el-row class="tr">
        <el-button :icon='isOpen ? "el-icon-arrow-up":"el-icon-arrow-down"' type='text' @click='isOpen = !isOpen'>
          {{isOpen? '收起信息' : '展开信息'}}
        </el-button>
      </el-row>
      <!-- 退款协议处理记录 -->
      <el-row class="mb10 bold">退款协议处理记录</el-row>
      <el-table :data="detail.refundOperationInfo" v-if="detail.refundOperationInfo" border stripe class="mb20">
        <el-table-column label="处理时间">
          <template slot-scope='{row}'>
            <span>{{row.createTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="处理信息"></el-table-column>
        <el-table-column prop="operationUser" label="操作人"></el-table-column>
      </el-table>
      <!-- 订单信息 -->
      <el-row class="bold">订单信息</el-row>
      <el-row class="lh40 bor-btm mb20">
        <template v-if="detail.orderDetailInfo && detail.orderDetailInfo.length!==0">
          <span class="ml20">订单号：{{ detail.orderDetailInfo[0].detailNum }}</span>
          <span class="ml20">订单时间：{{ detail.orderDetailInfo[0].createTime | formatDate }}</span>
        </template>
        <span class="ml20">支付状态：<span class="col-danger">{{  detail.orderInfo.payStatus  | payStatus}}</span></span>
        <span class="ml20"
          v-if="detail.orderDetailInfo && detail.orderDetailInfo.length!==0">实付金额：{{$math.divide(detail.orderDetailInfo[0].payPrice,100)}}元</span>
      </el-row>
      <!-- 商品信息 -->
      <el-row class="mb10 bold">商品信息</el-row>
      <el-table :data="detail.orderDetailInfo" v-if="detail.orderDetailInfo" border stripe class="mb20">
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column label="商品类型">
          <template slot-scope='{row}'>
            {{row.goodsType | courseType}}
          </template>
        </el-table-column>
        <el-table-column label="是否分销">
          <template slot-scope='{row}'>
            {{row.rewardStatus==1 ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column label="商品划线价">
          <template slot-scope='{row}'>
            {{$math.divide(row.originalPrice,100)}}元
          </template>
        </el-table-column>
        <el-table-column label="商品单价">
          <template slot-scope='{row}'>
            {{$math.divide(row.goodsPrice,100)}}元
          </template>
        </el-table-column>
        <el-table-column prop="goodsCount" label="购买数量"></el-table-column>
        <el-table-column label="商品总价">
          <template slot-scope='{row}'>
            {{$math.divide(row.totalPrice,100)}}元
          </template>
        </el-table-column>
        <el-table-column label="运费">
          <template slot-scope='{row}'>
            {{$math.divide(row.expressPrice,100)}}元
          </template>
        </el-table-column>
        <el-table-column label="优惠券">
          <template slot-scope='{row}'>
            {{$math.divide(row.couponPrice,100)}}元
          </template>
        </el-table-column>
        <el-table-column label="实付金额">
          <template slot-scope='{row}'>
            {{$math.divide(row.payPrice,100)}}元
          </template>
        </el-table-column>
      </el-table>

      <!-- 用户信息 -->
      <el-row class="bold mt20">买家信息</el-row>
      <div class="mt10 pb10 bor-btm" v-if="detail.buyerInfo">
        <span class="mr20 ml20">
          用户：<img class="user-avatar middle" :src="detail.buyerInfo.avatar" alt="">
          {{ detail.buyerInfo.nickName}}
        </span>
        <span class="mr20 ml20">用户手机号：{{ detail.buyerInfo.tel}}</span>
        <span class="mr20 ml20">用户身份：{{ detail.buyerInfo.isShopper ? '店主' : '非店主'}}</span>
        <span>用户来源：{{ detail.buyerInfo.registerPlatform | registerPlatform }}</span>
      </div>
      <!-- 财务受理 -->
      <el-row class="mt20" v-if="orderObj.check">
        <span class="bold">受理结果：</span>
        <el-radio v-model='checkForm.refundMoneyStatus' label='2'>通过受理</el-radio>
        <el-radio v-model='checkForm.refundMoneyStatus' label='3'>暂不受理</el-radio>
        <div class="mt20">
          <el-input type='textarea' v-model="checkForm.remark" :rows='4' placeholder='备注'></el-input>
        </div>
      </el-row>
      <el-row class="tc mt20">
        <el-button @click='closeDialog()' type='success'>关闭详情</el-button>
        <el-button @click='save' :loading="saveLoading" v-if="orderObj.check" type='primary'>提交受理结果</el-button>
      </el-row>
    </el-dialog>

  </div>
</template>
<script>
  import editRefound from './editRefound'
  import { refundDetail, dealRefund } from '@/api/order'
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
        loading: false,
        detail: {
          refundOperationInfo: [],
          orderDetailInfo: [],
          buyerInfo: {},
          orderInfo: {}
        },
        checkForm: {
          refundMoneyStatus: "",
          remark: ""
        },
        saveLoading: false,
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        isOpen: true,//是否展开详情

    
      }
    },
    methods: {
      closeDialog() {
      this.$emit('closeMain')
    },
      save() {
        if (!this.checkForm.refundMoneyStatus) {
          this.$message.error("请选择受理结果"); return;
        }
        if (!this.checkForm.remark) {
          this.$message.error("请填写备注"); return;
        }
        let param = { ...this.checkForm };
        param.uuid = this.detail.uuid;
        this.saveLoading = true;
        dealRefund(param).then(res => {
          this.saveLoading = false;
          if (res.code === 200) {
            this.$message.success("成功");
            this.$emit("freshParent");
            this.closeDialog();
          }

        }).catch(res => {

          this.saveLoading = false;
        })

      },
      getDetail() {
        let param = {
          uuid: this.orderObj.data
        }
        this.loading = true;
        refundDetail(param).then(res => {
          if (res.code === 200) {
            console.log("详情数据" + JSON.stringify(res.data));
            this.detail = res.data;
            this.detail.orderDetailInfo = [this.detail.orderDetailInfo];
            // if(!this.detail.refundOperationInfo && )
            if(!this.detail.buyerInfo){
              this.detail.buyerInfo={};
            }
            if(!this.detail.orderInfo){
              this.detail.orderInfo={};
            }
          }
          else {
            this.detail = {
              refundOperationInfo: [],
              orderDetailInfo: [],
              buyerInfo: {},
              orderInfo: {}
            }
          }
          this.loading = false;
        }).catch(res => {
          this.detail = {};
          this.loading = false;
        })

      },

  
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },

    },
    watch: {
      'orderObj.isShow'(val, oldVal) {
        if (val) {
          this.getDetail();
        }
      }
    },
    mounted() {
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