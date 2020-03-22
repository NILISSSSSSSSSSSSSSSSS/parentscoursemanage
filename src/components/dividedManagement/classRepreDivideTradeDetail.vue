<template>
  <el-dialog  :visible.sync='editData.isShow'  title="详情 " append-to-body width="500px" :before-close="closeDialog"
    >
    <div>
        <div class="text item">
          <el-row class="detailRow">
            <el-col :span="24"> 交易时间：{{ detail.orderTime | formatDate}}</el-col>
            <el-col :span="24" v-if="detail.courseRepreInfo"> 课代表：<img :src="detail.courseRepreInfo.avatar" alt="" style="width: 50px;height:50px;">  {{ detail.courseRepreInfo.nickName}} </el-col>
            <el-col :span="24">订单编号：{{ detail.detailNum}} </el-col>
            <el-col :span="24" >课程名称:{{ detail.goodsName}}</el-col>
            <el-col :span="24" v-if="detail.courseRepreInfo">电话:{{ detail.courseRepreInfo.tel}}</el-col>
            <el-col :span="24">课程类型：  {{ detail.goodsType | courseType}} </el-col>
            <el-col :span="24" >订单金额:  {{ $math.divide(detail.goodsPrice,100) }}</el-col>
            <el-col :span="24">实际分成金额：{{ $math.divide(detail.shareMoney,100) }} </el-col>
            <el-col :span="24" >结算状态: {{ detail.shareMoneyStatus | shareMoneyStatus }}</el-col>
          </el-row>
        </div>
    </div>

  </el-dialog>
</template>
<script>
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
       detail:{}
      };
    },
    created() { },
    watch: {
      'editData.isShow'(val, oldVal) {
				if (val) {
				  this.detail=this.editData.data;
				}
    }},
    methods: {
      closeDialog() {
				let obj = {
					isShowEdit: false, //是否显示编辑弹框
				}
				this.$emit('closeMain', obj)
			},
    }
  };
</script>

<style scoped lang="less">
  /deep/ .el-dialog {
    max-height: 85vh;
    overflow: auto;
  }

  .detailRow{
   .el-col {
     margin-bottom: 15px;
   }
  }
</style>