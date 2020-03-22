<template>
  <div class="all-user">
    <!-- 搜索条件 -->
    <el-form  inline label-position="right" label-width="100px">
      <el-row>
        <el-form-item label="优惠券名称">
          <el-input v-model.trim='searchParams.name' @keyup.enter.native='searchList' size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select size="small" v-model="searchParams.couponType" @keyup.enter.native='searchList' placeholder="请选择" clearable>
            <el-option label='全部' value=''></el-option>
            <el-option v-for="(item,index) in couponTypes" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="couponData==='shop'" label="所属门店">
          <el-select size="small" v-model="value1" placeholder="请选择">
            <el-option v-for="(item,index) in shopList" :key="index" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchList" class="ml40 mb20 mt4"  type="primary" size="small">查询
        </el-button>
        <el-button @click="showEdit({},0)"  class="ml40 mb20" type='primary' size='small'>创建优惠券</el-button>
      </el-row>
    </el-form>
    <!-- 搜索结果 -->
    <el-table :data="couponList" border stripe class="mb20" v-loading="loading">
      <el-table-column label="券类型">
        <template slot-scope='{row}'>
          <span>{{row.couponType | couponType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="优惠券名称" width='200px'></el-table-column>
      <el-table-column prop="money" label="面值">
        <template slot-scope='{row}'>
          <span>{{($math.divide(row.money,100))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期" width='170px'>
        <template slot-scope='scope'>
          <span>{{scope.row.startTime | formatDate}} ~ {{scope.row.endTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width='170px'>
        <template slot-scope='{row}'>
          <span>{{row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalNumber" label="发放数量"></el-table-column>
      <el-table-column prop="receivedNumber" label="领取数"></el-table-column>
      <el-table-column prop="usedNumber" label="使用数"></el-table-column>
      <!-- <el-table-column prop="id" label="所属门店" v-if="couponData==='shop'"></el-table-column> -->
      <el-table-column prop="id" label="操作" width="380px">
        <template slot-scope="scope">
          <el-button v-if='!scope.row.receivedNumber' icon="el-icon-edit" type="primary" size="small" @click="showEdit(scope.row,1)">编辑</el-button><!--未领取-->
          <el-button icon="el-icon-view" type="success" size="small" @click="showDetail(scope.row)">查看详情</el-button>
          <!-- <el-button v-if='!scope.row.receivedNumber || (scope.row.receivedNumber && !scope.row.isPast)' 
          icon="el-icon-share" type="success" class="mt10" @click="shareCoupon(scope.row)" size="small">分享</el-button>  -->
          <el-button v-if='!scope.row.receivedNumber' icon="el-icon-delete" type="danger" size="small" @click="deleteCoupon(scope.row)">删除</el-button> <!--未领取-->
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <!-- 编辑优惠券 -->
    <editCoupon :couponObj='couponObj' @closemain='closemain' @refresh="searchList"/>
    <!-- 优惠券详情 -->
    <couponDetail :detailObj='detailObj'/>
    <!-- 分享优惠券 -->
    <el-dialog id='code-div' class="tc" :visible.sync="isShowCode" :title="codeTitle+ ' 的二维码'" width="400px" :close-on-click-modal='false'>
      <qrcodeVue class="mb20" :value="codeValue" :size="size" level="H"/>
      <el-button type='primary' class="mt20" @click='downCode' icon='el-icon-download' plain>下载二维码</el-button>
    </el-dialog>
  </div>
</template>
<script>
import editCoupon from '@/components/couponManage/editCoupon';
import couponDetail from '@/components/couponManage/couponDetail';
import qrcodeVue from 'qrcode.vue';
import {couponType} from '@/config'
import {getCouponList,delCoupon} from '@/api/order'
  export default {
    props:{
      couponData:{
        type:String,
        default:'hbb'
      },
    },
    components:{
      editCoupon,
      couponDetail,
      qrcodeVue
    },
    data() {
      return {
        loading:false,
        searchParams:{},
        couponList: [],
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        couponObj:{
          isShow:false,
          isEdit:false,
          data:{}
        },
        detailObj:{
          isShow:false,
          data:{}
        },
        couponTypes: couponType,
        shopList: [],
        codeTitle:'',
        isShowCode:false,
        codeValue:'',
        size:200,
      }
    },
    methods: {
      //列表查询
      searchList() {
        let param = {
          ... this.searchParams,
          page: this.page.page,
          pageSize: this.page.limit
        }
        this.loading=true;
        getCouponList(param).then(res => {
          this.loading=false;
          if(res.code === 200){
            this.couponList = res.data.results
            this.page.total = res.data.count
          }
        }).catch(err=>{
          this.loading=false;
        })
      },
      //新增编辑弹框展示
      showEdit(row,type){
        this.couponObj = {
          isShow: true,
          isEdit: !!type,
          data: !!type ? row : {}
        }
      },
      //详情展示
      showDetail(row){
        this.detailObj = {
          isShow: true,
          data: row
        }
      },
      closemain(data){
        this.couponObj.isShow = false
      },
      //分享优惠券
      shareCoupon(row){
        this.codeTitle = '【' + row.name + '】'
        this.isShowCode = true
        this.codeValue = row.uuid.toString() //inviteUrl + '/' + row.id
      },
      //删除优惠券
      deleteCoupon(row){
        this.$confirm('确定删除优惠券【'+ row.name + '】?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type: 'warning'
        }).then(()=>{
          delCoupon({uuid:row.uuid}).then(res => {
            if(res.code === 200){
              this.$message.success(res.msg || '删除成功')
              this.searchList()
            }
          })
        }).catch(()=>{
          this.$message.info('已取消删除')
        })
        
      },
      //下载二维码
      downCode(){
        //找到canvas标签
        let myCanvas = document.getElementById('code-div').getElementsByTagName('canvas');
        //创建一个a标签节点
        let a = document.createElement("a")
        //设置a标签的href属性（将canvas变成png图片）
        a.href = myCanvas[0].toDataURL('image/png').replace('image/png', 'image/octet-stream')
        //设置下载文件的名字
        a.download = this.codeTitle + '.jpg'
        //点击
        a.click()
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
      this.searchList()
    }
  }
</script>
<style lang="less" scoped>
  .allClass {
    span {
      margin-right: 20px;
      cursor: pointer;
    }

    .typeActived {
      color: #409EFF;
    }

    margin-bottom:25px;
  }
</style>