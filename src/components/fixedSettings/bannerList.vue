<template>
  <div class="all-user">
    <el-row class="tc mt20">
      <el-button @click='showEdit(0)' class="mb20" type='primary' icon='el-icon-plus' size='small'>新增轮播图</el-button>
    </el-row>
    <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mt20 mb20" v-loading="loading">
      <el-table-column prop="sortNum" label="排序"></el-table-column>
      <el-table-column prop="name" label="标题"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="{row}">
          <div class="tableAvaterBox">
            <img :src="row.icon" alt="" class="tableAvater"  @click='$viewImage(row.icon,"picture")'>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="轮播类型">
        <template slot-scope="{row}">
          {{ row.type | bannerType}}
        </template>
      </el-table-column>
      <el-table-column  label="显示时间">
        <template slot-scope="{row}">
          {{ row.startTime | formatDate  }} - {{ row.endTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          {{ row.status | bannerStatus}}
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="360px">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="向上" placement="top">
            <el-button @click="changeWeight(row,'up')" class="" icon="el-icon-top" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="向下" placement="top">
            <el-button @click="changeWeight(row,'down')" class="" icon="el-icon-bottom" circle></el-button>
          </el-tooltip>
          <el-button @click='showEdit(1,row)' icon="el-icon-edit" type="primary" class="mt10" size="small">编辑</el-button>
          <el-button @click='changeStatus(row)' icon="el-icon-info" type="warning" class="mt10" size="small">
            {{ row.status===1 ? '停用' : "启用"}}</el-button>

          <el-button icon="el-icon-delete" type="danger" class="mt10" size="small" @click="del(row.uuid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增编辑弹框 -->
    <editBanner :menuObj='menuObj' @closeMain="closeMain" @freshParent="searchList()"/>
  </div>
</template>
<script>
  import editBanner from "@/components/fixedSettings/editBanner";
  import { bannerList, bannerChange,bannerDel,bannerOrder } from '@/api/home'
  export default {
    components: {
      editBanner
    },
    data() {
      return {
        list: [],
        // 分页相关
        page: {
          page: 1,
          limit: 1000,
          total: 0
        },
        menuObj:{
          isShow:false,
          isEdit:false,
          data:{}
        },
        loading:false,
      }
    },
    mounted() {
      this.searchList();
    },
    methods: {
      //列表查询
      searchList() {
        let param = {
          page: this.page.page,
          pageSize: this.page.limit,
        }
        this.loading = true;
        bannerList(param).then(res => {
          if (res.code === 200) {
            console.log("banner数据："+JSON.stringify(res.data.results));
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
      // 排序
      changeWeight(row,type) {
        let index=this.list.findIndex(val=>val.uuid==row.uuid);
        let param={uuid:row.uuid};
        if(type == 'up'){
          if(index - 1 < 0 ){
            this.$message.error("已经是第一个了");return;
          }
          else{
            param.swapBannerUuid=this.list[index-1].uuid;
          }
        }
        else{
          if(index + 1 > this.list.length - 1){
            this.$message.error("已经是最后一个了");return;
          }
          else{
            param.swapBannerUuid=this.list[index+1].uuid;
          }
        }
        bannerOrder(param).then(res => {
            if (res.code === 200) {
              this.$message.success("成功");
              this.searchList();
            }
          })
      },
      showEdit(type,row){
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
     
      changeStatus(row) {
        this.loading = true;
        let param = {
          uuid: row.uuid
        }
        bannerChange(param).then(res => {
          if (res.code === 200) {
            this.searchList();
          }
          this.loading = false;
        }).catch(res => {
          this.loading = false;
        })
      },

      del(val) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            uuid:val,
          }
          bannerDel(param).then(res => {
            if (res.code === 200) {
              this.$message.success("成功");
              this.searchList();
            }
          })

        }).catch(() => {

        });
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