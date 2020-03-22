<template>
  <div class="all-user">
    <el-row class="tc mt20">
      <el-button @click='showEdit(0)' class="mb20" type='primary' icon='el-icon-plus' size='small'>新增栏目</el-button>
    </el-row>
    <el-table :data="list" border stripe class="mt20 mb20" v-loading="loading">
      <el-table-column prop="name" label="栏目名称"></el-table-column>
      <el-table-column prop="intro" label="栏目说明"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{row}">
          <span>{{ row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="栏目状态">
        <template slot-scope="{row}">
          <span :class="row.enable?'col-sucs':'col-danger'">{{ row.enable ? '启用' : '停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="360px">
        <template slot-scope="{row}">
          <el-button @click='showEdit(1,row)' icon="el-icon-edit" type="primary" class="mt10" size="small">编辑
          </el-button>
          <el-button @click='changeStatus(row)' icon="el-icon-info" type="warning" class="mt10" size="small">
            {{ row.enable ? '停用' : "启用"}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <editColumn :columnObj='columnObj' @closeColumn="closeColumn" @freshParent='searchList' />
  </div>
</template>

<script>
  import { columnList, changeSta } from '@/api/home.js'
  import editColumn from '@/components/columnManage/editColumn';

  export default {
    components: {
      editColumn,
    },
    data() {
      return {
        columnObj: {
          isShow: false,
          isEdit: false,
          data: {}
        },
        list: [],
        loading: false,
      }
    },
    watch: {

    },
    mounted() {
      this.searchList();
    },
    methods: {
     
      //列表查询
      searchList() {
        let param = {
          pageSize: 10000,
        }
        this.loading = true;
        columnList(param).then(res => {
          if (res.code === 200) {
            if (res.data && res.data.count > 0) {
              console.log("数据：" + JSON.stringify(res.data.results));
              this.list = res.data.results;
            }
            else {
              this.list = [];
            }
          }
          this.loading = false;
        }).catch(res => {
          this.loading = false;
        })
      },
      showEdit(type, row) {
        this.columnObj = {
          isShow: true,
          isEdit: !!type,
          data: !!type ? row : {}
        }
      },
      changeStatus(row) {
        this.loading = true;
        let param = {
          uuid: row.uuid
        }
        changeSta(param).then(res => {
          if (res.code === 200) {
            this.searchList();
          }
          this.loading = false;
        }).catch(res => {
          this.loading = false;
        })
      },
      closeColumn(obj) {
        this.columnObj.isShow = false;
      }
    }
  }
</script>

<style lang="less" scoped>

</style>