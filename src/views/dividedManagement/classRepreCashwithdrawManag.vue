<template>
  <div class="all-user">
    <!-- 搜索条件 -->
    <el-form  @keyup.enter.native="searchList" :model='searchParams' inline label-position="right" label-width="130px">
      <el-row>
        <el-form-item label="课代表名称">
          <el-input size="small" v-model.trim="searchParams.nickName" clearable></el-input>
        </el-form-item>
        <el-form-item label="课代表手机号">
          <el-input v-model.trim="searchParams.tel" size="small" clearable></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申请提现时间范围">
      
          <el-date-picker v-model="searchParams.timeBox" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format='yyyy-MM-dd' size="small"></el-date-picker>
          </el-form-item>
        <el-button @click="searchList" class="ml40 mb20 mt4" icon="el-icon-search" type="primary" size="small">查询
        </el-button>
        <el-button @click='reset' class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>重置</el-button>
      </el-row>
    </el-form>
    <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20" v-loading="loading">
      <el-table-column label="课代表id">
          <template slot-scope="{ row }" v-if="row.courseRepreInfo">
              {{ row.courseRepreInfo.userNum }}
          </template>
      </el-table-column>
      <el-table-column label="课代表昵称">
          <template slot-scope="{ row }" v-if="row.courseRepreInfo">
              {{ row.courseRepreInfo.nickName }}
          </template>
    </el-table-column>
      <el-table-column label="课代表手机号">
          <template slot-scope="{ row }" v-if="row.courseRepreInfo">
              {{ row.courseRepreInfo.tel }}
          </template>
      </el-table-column>
      <el-table-column  label="申请提现金额">
          <template slot-scope="{row}">
              {{ $math.divide(row.withdrawalMoney,100) }}
            </template>
      </el-table-column>
      <el-table-column label="到款时间">
          <template slot-scope="{row}">
              {{ row.arrivalAccountTime | formatDate}}
            </template>
      </el-table-column>
      <el-table-column label="申请提款时间">
          <template slot-scope="{row}">
              {{ row.createTime | formatDate}}
            </template>
      </el-table-column>
      <el-table-column label="提现状态">
          <template slot-scope="{row}">
              {{ row.withdrawalStatus | withdrawalStatus}}
            </template>
      </el-table-column>
      <el-table-column  label="操作" width="240px">
        <template slot-scope="{row}" style="text-align:center;">
            <el-button icon="el-icon-view" type="success" class="mt10" size="small"  @click="showEdit(row,0)">
               查看详情
            </el-button>
            <el-button v-if="row.withdrawalStatus===1" icon="el-icon-view" type="success" class="mt10" size="small"  @click="showEdit(row,1)">
              审核
            </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <cashwith-drawDetail :editData='editData' @closeMain="closeMain" @refreshParent="searchList">
      </cashwith-drawDetail>
  </div>
</template>
<script>
   import { classRepreCashwithdrawManag } from '@/api/order'
  import cashwithDrawDetail from '@/components/dividedManagement/cashwithDrawDetail.vue'

  export default {
    components: {
      cashwithDrawDetail
    },
    data() {
      return {
        searchParams:{timeBox:[]},
        list: [],
       
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        editData: {
          isShow: false,
          type: 'look',
          data: {}
        },
        loading:false,


      }
    },
    mounted() {
      this.searchList();
    },
    methods: {
      //列表查询gln
      searchList() {
        let time = this.$utils.formatRange(this.searchParams.timeBox);
           let param = {
              page: this.page.page,
              pageSize: this.page.limit,
              searchTime_before: this.searchParams.timeBox ? time[1] : null,
              searchTime_after: this.searchParams.timeBox ? time[0] : null,
              tel: this.searchParams.tel,
              nickName: this.searchParams.nickName,
            }
    
        this.loading = true;
        classRepreCashwithdrawManag(param).then(res => {
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
      showEdit(row,ctype) {
        console.log(row);
        this.editData = {
          isShow: true,
          data:row,
          type: ctype===1 ? 'ediet' : 'look'
        }
      },
      closeMain(obj) {
        this.editData.isShow = false;
      },
      //重置
      reset(){
        this.searchParams = {}
        this.searchList()
      }
    }
  }
</script>
<style lang="less" scoped>
</style>