<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-24 09:55:12
 * @LastEditTime: 2019-09-27 10:46:00
 * @LastEditors: Please set LastEditors
 -->
<template>
  <el-dialog :visible.sync="chooseDia" title="选择用户" append-to-body width="800px" :before-close="handleClose">

    <!-- 搜索条件 -->
    <el-form inline label-position="right" label-width="100px">
      <el-row>
        <el-form-item label="查询关键字">
          <el-input size="small" v-model="nickName"></el-input>
        </el-form-item>
        <el-button @click="searchList" class="ml40 mt4 mb20" icon="el-icon-search" type="primary" size="small">查询
        </el-button>
        <el-button class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>重置</el-button>
      </el-row>
      <el-row>
      </el-row>
    </el-form>
    <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20" highlight-current-row @current-change="handleCurrentChange">
      <!-- <el-table-column type="selection" width="55">
      </el-table-column> -->
      <el-table-column prop="userNum" label="ID">
      </el-table-column>
      <el-table-column prop="nickName" label="昵称">
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="{row}" >
          <div class="tableAvaterBox" >
              <img :src="row.avatar" alt="" class="tableAvater" >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <div class="dialog-footer mt20 tc">
      <el-button type="primary" class="mr10" @click="save">确定</el-button>
      <el-button type="primary" class="mr10" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { majiaList, newMaJia, randomMaJia } from "@/api/home";

  export default {
    components: {
    },
    watch: {
      chooseDia(val) {
        if (val) {
          this.searchList();
        }
      }
    },
    props: {
      chooseData: {

      },
      chooseDia: false
    },

    data() {
      return {
        nickName:"",
        list: [{ id: 1, name: "seine" }, { id: 12, name: "wanqn" }],
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        selectData: []
      };
    },
    created() { },

    methods: {
      handleClose() {
        this.$emit("update:chooseDia", false);
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      //列表查询gln
      searchList() {
        majiaList({ nickName: this.nickName}).then(res => {
          this.loading = false;
          if (res.code === 200) {
            this.list = res.data.results
            this.page.total = res.data.count
          }
          else{
            this.list=[];
          }
        }).catch(err => {
          this.list=[];
        })
      },
      handleCurrentChange(val) {
        
        this.selectData = [val];
      },
      save() {
        if (this.selectData.length !== 1) {
          this.$message.error("必须选择一个用户"); return;
        }
        this.$emit("tellPar", this.selectData[0]);
        this.handleClose();
      }
    }
  };
</script>

<style scoped lang="less">
  /deep/ .el-dialog__body {
    max-height: 80vh;
    overflow: auto;
  }

  .operateButton {
    margin: 0 10px 0 7px;
    padding: 9px 12px;
    border: 0px;
  }

  /deep/ .avatar,
  /deep/ .avatar-uploader-icon {
    width: 147px;
    height: 147px;
    line-height: 147px;
  }

  /deep/ tbody .el-table__row{
    cursor: pointer;
  }
</style>