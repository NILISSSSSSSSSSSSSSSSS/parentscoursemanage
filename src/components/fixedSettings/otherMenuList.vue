<template>
  <div class="all-user">
    <el-row class="tc mt20">
      <el-button @click='showEdit(0)' class="mb20" type='primary' icon='el-icon-setting' size='small'>新增栏目</el-button>
    </el-row>
    <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mt20 mb20" v-loading="loading">
      <el-table-column type="index" width="60" label="排序">
      </el-table-column>
      <el-table-column prop="name" label="栏目名称"></el-table-column>
      <el-table-column prop="showNum" label="首页展示数量"></el-table-column>
      <el-table-column label="缩略图">
        <template slot-scope="{row}">
          <div class="tableAvaterBox">
            <img :src="row.courses[0].courseThumbnail" alt="" class="tableAvater" v-if="row.courses && row.courses[0]">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{row}">
          {{ row.updateTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="360px">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="向上" placement="top">
            <el-button class="" icon="el-icon-top" circle @click="changeWeight(row,'up')"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="向下" placement="top">
            <el-button  class="" icon="el-icon-bottom" circle  @click="changeWeight(row,'down')"></el-button>
          </el-tooltip>
          <el-button @click='showEdit(1,row)' icon="el-icon-edit" type="primary" class="mt10" size="small">编辑
          </el-button>

          <el-button icon="el-icon-delete" type="danger" class="mt10" size="small" @click="del(row.uuid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增编辑弹框 -->
    <editOtherMenu :menuObj='menuObj' @closeMain="closeMain" @freshParent="searchList()" />
  </div>
</template>
<script>
  import editOtherMenu from "@/components/fixedSettings/editOtherMenu";
  import { otherMenuList, delOtherMenu,changeWeightMenuList } from '@/api/home'
  export default {
    components: {
      editOtherMenu
    },
    data() {
      return {
        loading: false,
        list: [{ id: 1, name: "seine" }, { id: 12, name: "wanqn" }],
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
        chapterManageDia: false,
      }
    },
    mounted() {
      this.searchList();
    },
    methods: {
      del(val) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            uuid:val,
          }
          delOtherMenu(param).then(res => {
            if (res.code === 200) {
              this.$message.success("成功");
              this.searchList();
            }
          })

        }).catch(() => {

        });
      },
      //列表查询
      searchList() {
        let param = {
          page: this.page.page,
          pageSize: this.page.limit,
        }
        this.loading = true;
        otherMenuList(param).then(res => {
          if (res.code === 200) {
            console.log("非固定栏目配置列表数据："+JSON.stringify(res.data.results));
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
      changeWeight(row,type) {
        let index=this.list.findIndex(val=>val.uuid==row.uuid);
        let param={uuid:row.uuid};
        if(type == 'up'){
          if(index - 1 < 0 ){
            this.$message.error("已经是第一个了");return;
          }
          else{
            param.objUuid=this.list[index-1].uuid;
          }
        }
        else{
          if(index + 1 > this.list.length - 1){
            this.$message.error("已经是最后一个了");return;
          }
          else{
            param.objUuid=this.list[index+1].uuid;
          }
        }
        changeWeightMenuList(param).then(res => {
            if (res.code === 200) {
              this.$message.success("成功");
              this.searchList();
            }
          })
      },
      showEdit(type, row) {
        this.menuObj = {
          isShow: true,
          isEdit: !!type,
          data: !!type ? row : {}
        }
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      openChapterManage() {
        this.chapterManageDia = true;
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