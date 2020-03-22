<template>
    <div class="all-user">
      <el-table :data="list" border stripe class="mt20 mb20" v-loading="loading">
        <el-table-column prop="sortNum" label="任务名称"></el-table-column>
        <el-table-column prop="name" label="任务描述"></el-table-column>
        <el-table-column prop="name" label="积分奖励"></el-table-column>
        <el-table-column prop="name" label="状态"></el-table-column>

        <el-table-column label="操作" width="360px">
          <template slot-scope="{row}">
            <el-button @click='showEdit(1,row)' icon="el-icon-edit" type="primary" class="mt10" size="small">编辑
            </el-button>
            <el-button @click='changeStatus(row)' icon="el-icon-info" type="warning" class="mt10" size="small">
              {{ row.status===1 ? '停用' : "启用"}}</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!--分页组件-->
       <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
       <edietTask :menuObj="menuObj" @freshParent="searchList" @closeMain="closeMain"/>
    </div>
  </template>
  <script>
   
    // import {  } from '@/api/home'
    import edietTask from '@/components/IntegralTask/edietTask'
    export default {
      components: {
        edietTask
      },
      data() {
        return {
          list: [{}],
          // 分页相关
          page: {
            page: 1,
            limit: 10,
            total: 0
          },
          menuObj: {
            isShow: false,
            isEdit: false,
            data: {}
          },
          loading:false
        }
      },
      mounted() {
        this.searchList();
      },
      methods: {
        //列表查询
        searchList() {
          // let param = {
          //   page: this.page.page,
          //   pageSize: this.page.limit,
          // }
          // this.loading = true;
          // bigCoffeeList(param).then(res => {
          //   if (res.code === 200) {
          //     console.log("大咖直播" + JSON.stringify(res.data.results));
          //     if (res.data && res.data.count > 0) {
          //       [this.list, this.page.total] = [res.data.results, res.data.count]
          //     }
          //     else {
          //       [this.list, this.page.total] = [[], 0]
          //     }
          //   }
          //   this.loading = false;
          // }).catch(res => {
          //   this.loading = false;
          // })
        },
        closeMain(){
          this.menuObj.isShow=false;
        },
        changeStatus(row) {
          // this.loading = true;
          // let param = {
          //   uuid: row.uuid
          // }
          // bigCoffeeChangeSta(param).then(res => {
          //   if (res.code === 200) {
          //     this.searchList();
          //   }
          //   this.loading = false;
          // }).catch(res => {
          //   this.loading = false;
          // })
        },
        showEdit(type, row) {
          this.menuObj = {
            isShow: true,
            data: !!type ? row : {}
          }
        },
   
  
        changePage(page, pageSize) {
          this.page.limit = pageSize;
          this.page.page = page;
          this.searchList();
        },
        closeMain(obj) {
          this.menuObj.isShow = false;
        }
  
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