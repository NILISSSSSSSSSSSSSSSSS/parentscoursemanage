<template>
  <el-dialog :visible.sync="userDetailDia.isShow" title="用户详情 " top="20px" append-to-body width="1100px"
    :before-close="handleClose">
    <div>
      <!-- 账号信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>账号信息</span>
        </div>
        <div class="text item">
          <el-row>
            <el-col :span="5">
              <img :src="user.avatar" class="userLogo">
            </el-col>
            <el-col :span="19">
              <el-row>
                <el-col :span="24" class="mb10">昵称：{{user.nickName}} 
                  <span v-if='user.vipInfo.isVip' class="ml20">{{user.vipInfo.isVip ? 'VIP' :'' }} {{user.vipInfo.msg}}</span>
                </el-col>
                <el-col :span="24" class="mb10">性别：{{user.gender | gender}}</el-col>
                <el-col :span="24" class="mb10">注册时间：{{user.createTime | formatDate}}</el-col>
                <el-col :span="24">id：{{user.userNum}}</el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!-- 消费记录 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>消费记录</span>
          <el-button @click="consumptionRecordsDia=!consumptionRecordsDia" style="float: right; padding: 3px 0"
            type="text"> {{ consumptionRecordsDia ? "收起" : '展开'}}</el-button>
        </div>
        <div class="text item" v-if="consumptionRecordsDia">
          <el-table :data="consumptionRecords" border stripe class="mb20">
            <el-table-column label="消费时间">
              <template slot-scope='{row}'>
                <span>{{row.createTime | formatDate}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="项目"></el-table-column>
            <el-table-column label="金额">
              <template slot-scope='{row}'>
                <span>{{row.payPrice/100}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope='{row}'>
                <span>{{row.orderInfo.payStatus | payStatus}}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination :currentPage="shoppingPage.page" :pageSize="shoppingPage.limit" :total="shoppingPage.total" @change="changeShoppingPage"></pagination>
        </div>
      </el-card>
      <!-- 分销记录 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>分销记录</span>
          <el-button @click="distributionRecordsDia=!distributionRecordsDia" style="float: right; padding: 3px 0"
            type="text">{{ distributionRecordsDia ? "收起" : '展开'}}</el-button>
        </div>
        <div class="text item" v-if="distributionRecordsDia">
          <el-table :data="distributionRecords" border stripe class="mb20">
            <el-table-column prop="nickName" label="购买人账号"></el-table-column>
            <el-table-column prop="id" label="下单时间">
              <template slot-scope='{row}'>
                <span>{{row.createTime | formatDate}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="分销项目"></el-table-column>
            <el-table-column label="付款金额">
              <template slot-scope='{row}'>
                <span>{{row.payPrice/100}}</span>
              </template>
            </el-table-column>
            <el-table-column label="分销提成">
              <template slot-scope='{row}'>
                <span>{{row.shareMoney/100}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope='{row}'>
                <span>{{row.shareMoneyStatus | shareMoneyStatus}}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination :currentPage="sharePage.page" :pageSize="sharePage.limit" :total="sharePage.total" @change="changeSharePage"></pagination>
        </div>
      </el-card>
    </div>

  </el-dialog>
</template>
<script>
import {getConsumeList,getShareList} from "@/api/home"
  export default {
    components: {
    },
    props: {
      userDetailDia: {
        type: Object,
        default: {}
      },

    },
    data() {
      return {
        consumptionRecords: [],
        distributionRecords: [],
        consumptionRecordsDia: true,
        distributionRecordsDia: true,
        user:{
          vipInfo:{
            isVip:false
          }
        },
        shoppingPage:{
          page:1,
          limit:10,
          total:0
        },
        sharePage:{
          page:1,
          limit:10,
          total:0
        }
      };
    },
    computed:{
      isShow(){
        return this.userDetailDia.isShow
      }
    },
    created() { },
    watch: {
      isShow(val) {
        if (val) {
          this.user = this.userDetailDia.data
          this.getShopping()
          this.getShare()
        }else{
          this.user = {
            vipInfo:{}
          }
        }
      },
      // 深度观察监听
      deep: true,
      immediate: true,
    },
    methods: {
      //消费记录
      getShopping(){
        let param = {
          uuid: this.userDetailDia.data.uuid,
          page: this.shoppingPage.page,
          pageSize: this.shoppingPage.limit
        }
        getConsumeList(param).then( res => {
          console.log(param);
          
          if(res.code === 200) {
            this.consumptionRecords = res.data.results
            this.shoppingPage.total = res.data.count
          }
        })
      },
      //分销记录
      getShare(){
        let param = {
          uuid: this.userDetailDia.data.uuid,
          page: this.sharePage.page,
          pageSize: this.sharePage.limit
        }
        getShareList(param).then( res => {
          if(res.code === 200) {
            this.distributionRecords = res.data.results
            this.sharePage.total = res.data.count
          }
        })
      },
      //消费记录翻页
      changeShoppingPage(page, pageSize) {
        this.shoppingPage.limit = pageSize;
        this.shoppingPage.page = page;
        this.getShopping();
      },
      //分销记录翻页
      changeSharePage(page, pageSize) {
        this.sharePage.limit = pageSize;
        this.sharePage.page = page;
        this.getShare();
      },
      handleClose() {
        this.userDetailDia.isShow = false
        this.user = {
          vipInfo:{}
        }
        this.$emit("update:userDetailDia", {});
      },
    }
  };
</script>

<style scoped lang="less">
  /deep/ .el-dialog__body {
    max-height: 80vh;
    overflow: auto;
  }

  .logo {
    width: 100px;
    height: 100px;
  }

  .box-card {
    margin-bottom: 20px
  }
</style>