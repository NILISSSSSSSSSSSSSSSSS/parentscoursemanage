<template>
  <div class="all-user">
    <!-- 搜索条件 -->
    <el-form inline label-position="right" label-width="100px">
      <el-row>
        <el-form-item label="用户昵称">
          <el-input size="small" v-model="searchParams.nickName" @keyup.enter.native='searchList'></el-input>
        </el-form-item>
        <el-form-item label="注册手机号">
          <el-input size="small" v-model="searchParams.tel" @keyup.enter.native='searchList'></el-input>
        </el-form-item>
        <el-form-item label="授权状态">
          <el-select size="small" v-model="searchParams.status" placeholder="请选择" @keyup.enter.native='searchList'>
            <el-option v-for='(itm,index) in userStatus' :key='index' :value='itm.value' :label='itm.label'></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="注册时间范围">
          <el-date-picker v-model="searchParams.timBox" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format='yyyy-MM-dd' size="small"></el-date-picker>
        </el-form-item>
        <el-button @click="searchList" class="ml40 mb20 mt4" icon="el-icon-search" type="primary" size="small">查询
        </el-button>
        <el-button @click="resetParams" class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>
          重置</el-button>
      </el-row>
    </el-form>
    <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20" v-loading="loading">
      <el-table-column prop="userNum" label="id"></el-table-column>
      <el-table-column  label="用户昵称">
        <template slot-scope="{row}">
          {{ row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="{row}" class="tableAvaterBox">
          <div class="tableAvaterBox">
            <img :src="row.avatar" alt="" class="tableAvater">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册日期">
        <template slot-scope="{row}">
          {{ row.createTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="手机号"></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="{row}">
          {{ row.gender | gender}}
        </template>
      </el-table-column>
      <el-table-column label="授权状态" width="150px">
        <template slot-scope="{row}">
          {{ row.status | status}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320px">
        <template slot-scope="{row}" style="text-align:center;">
          <el-button icon="el-icon-view" type="success" class="mt10" size="small" @click="showUserDetail(row)">查看用户
          </el-button>
          <el-button @click="changeStatus(row)" icon="el-icon-view" type="warning" class="mt10" size="small">
            {{ row.status ===1 ? '禁用' : '启用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <user-detail :userDetailDia.sync="userDetailDia">
    </user-detail>
  </div>
</template>
<script>
  import { checkUser, changeUserSta } from '@/api/home'
  import userDetail from "@/components/userManage/userDetail.vue";
  export default {
    components: {
      userDetail
    },
    data() {
      return {
        searchParams: { timBox: [] },
        loading: false,
        list: [],
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        userDetailDia: {
          uuid: '',
          isShow: false
        },
        userStatus: [
          { label: '全部', value: '' },
          { label: '禁用', value: '3' },
          { label: '启用', value: '1' },],
      }
    },
    mounted() {
      this.searchList();
    },
    methods: {
      //列表查询gln
      searchList() {
        this.time = this.time || []
        let time = this.$utils.formatRange(this.searchParams.timBox),
          param = {
            page: this.page.page,
            pageSize: this.page.limit,
            searchTime_after: this.searchParams.timBox ? time[0] : null,
            searchTime_before: this.searchParams.timBox ? time[1] : null,
            tel: this.searchParams.tel,
            status: this.searchParams.status,
            nickName: this.searchParams.nickName,
          }
        this.loading = true;
        checkUser(param).then(res => {
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
      changeStatus(row) {
        let param = { uuid: row.uuid, status: row.status === 1 ? 3 : 1 }
        changeUserSta(param).then(res => {
          if (res.code === 200) {
            this.$message.success("成功");
            this.searchList();
          }
        })
      },
      //用户详情
      showUserDetail(row) {
        this.userDetailDia = {
          data: row,
          isShow: true
        }
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      resetParams() {
        this.page.page = 1;
        this.searchParams = { timBox: [] };
        this.searchList()
      },
    }
  }
</script>
<style lang="less" scoped>
</style>