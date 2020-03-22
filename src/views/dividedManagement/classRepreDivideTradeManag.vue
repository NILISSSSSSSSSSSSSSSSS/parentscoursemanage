<template>
  <div class="all-user">
    <!-- 搜索条件 -->
    <el-form :model='searchParams' inline label-position="right" label-width="100px" @keyup.enter.native="searchList">

      <el-row>
        <el-form-item label="课程类型">
          <el-select size="small" v-model="searchParams.goodsType" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in classTypeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input size="small" v-model.trim="searchParams.goodsName" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input size="small" v-model.trim="searchParams.detailNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model.trim="searchParams.nickName" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model.trim="searchParams.tel" size="small" clearable></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="结算状态">
          <el-select size="small" v-model="searchParams.shareMoneyStatus" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in settlementStatusList" :key="index" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="交易时间">
          <el-date-picker v-model="searchParams.timBox" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="交易时间" value-format='yyyy-MM-dd' size="small"></el-date-picker>
        </el-form-item>
        </el-form-item>
        <el-button @click="searchList" class="ml40 mb20 mt4" icon="el-icon-search" type="primary" size="small">查询
        </el-button>
        <el-button @click='reset' class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>重置
        </el-button>
      </el-row>
    </el-form>
    <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20" v-loading="loading">
      <el-table-column label="交易时间">
        <template slot-scope="{row}">
          {{ row.orderTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="detailNum" label="订单编号"></el-table-column>
      <el-table-column prop="goodsName" label="课程名称"></el-table-column>
      <el-table-column label="课程类型">
        <template slot-scope="{row}">
          {{ row.goodsType | courseType}}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="实际分成金额">
        <template slot-scope="{row}">
          {{ $math.divide(row.shareMoney,100) }}
        </template>
      </el-table-column>
      <el-table-column label="课代表id">
        <template slot-scope="{row}" v-if="row.courseRepreInfo">
          {{ row.courseRepreInfo.userNum }}
        </template>
      </el-table-column>
      <el-table-column label="课代表昵称">
        <template slot-scope="{row}" v-if="row.courseRepreInfo">
          {{ row.courseRepreInfo.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="结算状态" width="150px">
        <template slot-scope="{row}">
          {{ row.shareMoneyStatus | shareMoneyStatus }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="{row}" style="text-align:center;">
          <el-button icon="el-icon-view" type="success" class="mt10" size="small" @click="showEdit(row)">查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <classRepre-divideTradeDetail :editData='editData' @closeMain="closeMain" @freshParent="searchList">
    </classRepre-divideTradeDetail>
  </div>
</template>
<script>
  import { classRepreDivideTradeManag } from '@/api/order'
  import classRepreDivideTradeDetail from '@/components/dividedManagement/classRepreDivideTradeDetail.vue'

  export default {
    components: {
      classRepreDivideTradeDetail
    },
    data() {
      return {
        classTypeList: require("@/config").courseTypeList,
        settlementStatusList: require("@/config").shareMoneyStatus,
        searchParams: {timBox:[]},
        list: [],

        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        editData: {
          isShow: false,
          isEdit: false,
          data: {}
        },
        loading: false,
      }
    },
    mounted() {
      this.searchList()
    },
    methods: {
      //列表查询gln
      searchList() {
        let param = JSON.parse(JSON.stringify(this.searchParams));
        let time = this.$utils.formatRange(this.searchParams.timBox);
        let searchTime_before = this.searchParams.timBox ? time[1] : null;
        let searchTime_after = this.searchParams.timBox ? time[0] : null;
        [param.page, param.pageSize, param.searchTime_before, param.searchTime_after] = [this.page.page, this.page.limit, searchTime_before, searchTime_after];
       delete param.timBox;
        this.loading = true;
        classRepreDivideTradeManag(param).then(res => {
          if (res.code === 200) {
            if (res.data && res.data.count > 0) {
              [this.list, this.page.total] = [res.data.results, res.data.count]
            }
            else {
              [this.list, this.page.total] = [[], 0]
            }
          }
          this.loading = false;
        }).catch(res => {
          this.loading = false;
        })
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      showEdit(row) {
        console.log(row);
        this.editData = {
          isShow: true,
          data: row
        }
      },
      closeMain(obj) {
        this.editData.isShow = false;
      },
      //重置
      reset() {
        this.searchParams = {timBox:[]}
        this.searchList()
      }
    }
  }
</script>
<style lang="less" scoped>
</style>