<template>
  <el-dialog :visible.sync='editData.isShow' title="提现详情 " append-to-body width="600px">
    <div>
      <!-- 课代表详情 -->
      <el-card class="box-card">
        <div class="text item">
          <el-row class="mb20">
            <el-col :span="12" v-if="detail.courseRepreInfo">
              <img :src="detail.courseRepreInfo.avatar" class="logo">
              <span> {{ detail.courseRepreInfo.nickName }}</span>
              <span class="ml10">{{ detail.courseRepreInfo.isShopper | isShopper }}</span>
            </el-col>
          </el-row>
          <el-row class="mb20">
            <el-col :span="12"> 分销总金额：{{ $math.divide(detail.totalMoney,100) }} 元 </el-col>
            <el-col :span="12"> 有效分销总金额：{{ $math.divide(detail.income,100) }} 元 </el-col>
          </el-row>
          <el-row class="mb20">
            <el-col :span="12">剩余提现金额：{{ $math.divide(detail.enableMoney,100) }}元 </el-col>
          </el-row>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>本次提现详情</span>
        </div>
        <div class="text item">
          <el-row class="mb20">
            <el-col :span="12"> 账户名称：{{ detail.realName}} </el-col>
            <el-col :span="12"> 身份证号：{{ detail.idCard}}</el-col>
          </el-row>
          <!-- <el-row class="mb20">
            <el-col :span="12"> 开户行：{{ detail.bank}} </el-col>
            <el-col :span="12"> 卡号：{{ detail.bankCardNo}}</el-col>
          </el-row> -->
          <el-row class="mb20">
            <el-col :span="12"> 申请提现金额：{{ $math.divide(detail.withdrawalMoney,100) }}元</el-col>
          </el-row>
          <el-row class="mb20">
            <el-col :span="24" class="mb10"> 受理结果:</el-col>
            <el-col :span="24" class="mb10">
              <!-- //如果是待审核状态，并且是审核页面，则不显示待审核状态 -->
              <el-radio v-model="detail.withdrawalStatus" v-if="type!=='ediet'" :label="1" :disabled="type=='look'">待审核
              </el-radio>
              <el-radio v-model="detail.withdrawalStatus" :label="2" :disabled="type=='look'">审核通过</el-radio>
              <el-radio v-model="detail.withdrawalStatus" :label="3" :disabled="type=='look'">审核不通过</el-radio>
            </el-col>
            <el-col :span="24" class="mb10" v-if="detail.withdrawalStatus===3">
              <el-input type="textarea" :rows="2" :disabled="type=='look'" placeholder="请输入原因" v-model="detail.remarks">
              </el-input>
            </el-col>
          </el-row>
          <el-row class="mb20">
            <el-col :span="12">预计到款时间：{{ detail.preArrivalAccountTime  }}</el-col>
            <el-col :span="12"> 到款时间：{{ detail.arrivalAccountTime | formatDate}}</el-col>
          </el-row>
        </div>
        <div class="tc mt20" v-if="type=='ediet'">
          <el-button type="primary" class="mr20" @click="save" :loading="saveLoding">提交</el-button>
          <el-button type="primary" @click="closeDialog">取消</el-button>
        </div>
      </el-card>
    </div>

  </el-dialog>
</template>
<script>
  import { classRepreCashwithdraCheck } from '@/api/order'
  export default {
    components: {

    },
    props: {
      editData: {
        type: Object,
        default: () => { return {} }
      },
    },

    data() {
      return {
        detail: {

        },
        type: "look",
        saveLoding:false,


      };
    },
    created() { },
    watch: {
      'editData.isShow'(val, oldVal) {
        if (val) {

          this.detail = JSON.parse(JSON.stringify(this.editData.data));
          this.type = this.editData.type;
        }
      }
    },
    methods: {
      closeDialog() {

        this.$emit('closeMain')
      },
      save() {
        if (![2, 3].includes(this.detail.withdrawalStatus)) {
          this.$message.error("请选择受理结果"); return;
        }
        if (this.detail.withdrawalStatus === 3 && !this.detail.remarks) {
          this.$message.error("请输入未通过原因"); return;
        }
        let param = {
          withdrawalStatus: +this.detail.withdrawalStatus,
          uuid:this.detail.uuid
        }
        this.saveLoding=true;
        this.detail.withdrawalStatus === 3 ? param.remarks = this.detail.remarks : null;
        classRepreCashwithdraCheck(param).then(res => {
          this.saveLoding=false;
          this.$message.success("成功");
          this.closeDialog();
          this.$emit("refreshParent");
        }).catch(err=>{
          this.saveLoding=false;
        })
        // this.closeDialog();
        // this.$emit("refreshParent");
      }

    }
  };
</script>

<style scoped lang="less">
  /deep/ .el-dialog {
    max-height: 85vh;
    overflow: auto;
  }

  .logo {
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }

  .box-card {
    margin-bottom: 20px
  }
</style>