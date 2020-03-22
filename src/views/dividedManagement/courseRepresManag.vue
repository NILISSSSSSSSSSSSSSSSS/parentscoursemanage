<template>
  <div class="all-user">
    <!-- 搜索条件 -->
    <el-form  @keyup.enter.native="searchList" :model='searchParams' inline label-position="right" label-width="100px">
      <el-row>
        <el-form-item label="身份">
          <el-select size="small" v-model.trim="searchParams.isShopper" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in idList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input size="small" v-model.trim="searchParams.nickName" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input size="small" v-model.trim="searchParams.tel" clearable></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="分销权限">
          <el-select size="small" v-model="searchParams.shareStatus" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in authorityList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchList" class="ml40 mb20 mt4" icon="el-icon-search" type="primary" size="small">查询
        </el-button>
        <el-button @click='reset' class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>重置
        </el-button>
      </el-row>
    </el-form>
  
    <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20" v-loading="loading">
      <el-table-column prop="userNum" label="课代表id"></el-table-column>
      <el-table-column prop="nickName" label="课代表昵称"></el-table-column>
      <el-table-column label="首次交易时间">
        <template slot-scope="{row}">
          {{ row.firstTime  | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="身份">
        <template slot-scope="{row}">
          {{ row.isShopper  | isShopper }}
        </template>
      </el-table-column>
      <el-table-column label="分销权限">
        <template slot-scope="{row}">
          {{ row.shareStatus  | shareStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="distributionNum" label="累计分销人数"></el-table-column>
      <el-table-column prop="orderNum" label="累计成交笔数"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="{row}" style="text-align:center;">
          <el-button icon="el-icon-view" type="success" class="mt10" size="small" @click="showEdit(row)">查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <classRepre-detail :editData='editData' @closeMain="closeMain" @freshParent="searchList()">
    </classRepre-detail>
  </div>
</template>
<script>
  import { courseRepresManageList } from '@/api/order'
  import classRepreDetail from '@/components/dividedManagement/classRepreDetail.vue'
  export default {
    components: {
      classRepreDetail
    },
    data() {
      return {
        idList: [
          { value: '', label: "全部" },
          { value: '0', label: "普通课代表" },
          { value: '1', label: "店主课代表" },
        ],
        authorityList: [
          { value: '', label: "全部" },
          { value: '1', label: "开通" },
          { value: '2', label: "冻结" },
        ],
        searchParams: {},
        list: [],

        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        loading: false,
        editData: {
          isShow: false,
          data: {}
        },
      }
    },
    watch: {
      'editData.isShow'(val, oldVal) {
        if (val) {

        }
      }
    },
    mounted() {
      this.searchList();
    },
    methods: {
      //列表查询
      searchList() {
        let param = JSON.parse(JSON.stringify(this.searchParams));
        [param.page, param.pageSize] = [this.page.page, this.page.limit];
        this.loading = true;
        courseRepresManageList(param).then(res => {
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
     
      //重置
      reset() {
        this.searchParams = {}
        this.searchList()
      },
      //新增编辑弹框展示
      showEdit(row) {
        console.log(row);
        this.editData = {
          isShow: true,
          data:row
        }
      },
      closeMain(obj) {
        this.editData.isShow = false;
      }
    }
  }
</script>
<style lang="less" scoped>
</style>