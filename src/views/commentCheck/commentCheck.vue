<template>
  <div class="all-user">
    <!-- 搜索条件 -->
    <el-form  @keyup.enter.native="searchList" inline label-position="right" label-width="140px">
      <el-row>
        <el-form-item label="课程名称">
          <el-input size="small" v-model="searchParams.courseName"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input size="small" v-model="searchParams.nickName"></el-input>
        </el-form-item>
        <el-form-item label="人工审核状态">
          <el-select size="small" v-model="searchParams.checkStatus" placeholder="请选择">
            <el-option v-for="(item,index) in peopleCheckList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="智能审核状态">
          <el-select size="small" v-model="searchParams.interfaceStatus" placeholder="请选择">
            <el-option v-for="(item,index) in interfaceStatus" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div>
            <el-button @click="searchList" class="ml40 mb20 mt4" icon="el-icon-search" type="primary" size="small">查询
              </el-button>
              <el-button class="ml40 mb20 mt4" @click="resetParams" icon="el-icon-setting" type="primary" size="small" plain>重置</el-button>
        </div>
      </el-row>

    </el-form>
    <!-- 搜索结果 -->
    <el-table v-loading="loading" ref="multipleTable" :data="list" border stripe class="mb20">
      <el-table-column prop="content" label="评论内容"></el-table-column>
      <el-table-column  label="用户昵称">
          <template slot-scope="{ row }" v-if="row.userInfo">
                {{ row.userInfo.nickName}}
            </template>
      </el-table-column>
      <el-table-column label="评论时间">
          <template slot-scope="{row}">
              {{ row.createTime | formatDate}}
            </template>
      </el-table-column>
      <el-table-column label="课程名称">
          <template slot-scope="{ row }" v-if="row.courseInfo">
              {{ row.courseInfo.name}}
          </template>
      </el-table-column>
      <el-table-column label="人工审核">
          <template slot-scope="{row}">
              {{ row.checkStatus | peopleCheck}}
            </template>
      </el-table-column>
      <el-table-column label="智能审核">
          <template slot-scope="{row}">
              {{ row.interfaceStatus | interfaceCheck}}
            </template>
      </el-table-column>
      <el-table-column label="审核状态">
          <template slot-scope="{row}">
              {{ row.finalCheckStatus | finalCheckStatus }}
            </template>
      </el-table-column>
      <el-table-column label="操作" width="350px">
        <template slot-scope="{row}" style="text-align:center;">
          <!-- 人工审核待审核状态才显示 -->
          <template v-if="row.checkStatus=='1'">
              <el-button icon="el-icon-info" type="primary" size="small" @click="checkSta(row,'yes')">审核通过</el-button>
              <el-button icon="el-icon-info" type="primary" size="small" @click="checkSta(row,'not')">审核不通过</el-button>
          </template>
          <el-button icon="el-icon-delete" type="danger" size="small" @click="del(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>

  </div>
</template>
<script>
    import { commentList, commentDel,checkPass,checkNotPass } from '@/api/home'
  export default {
    components: {

    },

    data() {
      return {
        list: [],
        peopleCheckList: [
          { value: '', label: "全部" },
          { value: 1, label: "待审核" },
          { value: 2, label: "审核通过" },
          { value: 3, label: "审核未通过" }
        ],
        interfaceStatus: [
          { value: '', label: "全部" },
          { value: 1, label: "待审核" },
          { value: 2, label: "审核通过" },
          { value: 3, label: "审核未通过" },
          { value: 4, label: "建议人工复审" }
        ],
        searchParams: { timeBox: [] },
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        loading: false
      }
    },

    mounted() {
      this.searchList();
    },
    methods: {
  
      checkSta(row,sta){
         let param={
           uuid:row.uuid
         }
         let apiName=null;
         apiName=sta=='not' ? checkNotPass : checkPass;
         apiName(param).then(res => {
          if (res.code === 200) {
            this.$message.success("更改成功");
            this.searchList();
          }
          this.loading = false;
        }).catch(res => {
          this.loading = false;
        })
      },
      //列表查询gln
      searchList() {
        this.time = [];
        let time = this.$utils.formatRange(this.searchParams.timBox),
          param = {
            page: this.page.page,
            pageSize: this.page.limit,
            searchTime_after: this.searchParams.timBox ? time[0] : null,
            searchTime_before: this.searchParams.timBox ? time[1] : null,
            interfaceStatus: this.searchParams.interfaceStatus,
            checkStatus: this.searchParams.checkStatus,
            nickName: this.searchParams.nickName,
            courseName: this.searchParams.courseName,
          }
        this.loading = true;
        commentList(param).then(res => {
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
      resetParams() {
        this.page.page=1;
        this.searchParams = {timBox: [] };
        this.searchList()
      },

      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      del(row) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param={
           uuid:row.uuid
         }
         commentDel(param).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.searchList();
          }
          this.loading = false;
        }).catch(res => {
          this.loading = false;
        })

        }).catch(() => {

        });
      },
    }
  }
</script>
<style lang="less" scoped>
</style>