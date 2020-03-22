<template>
  <div class="all-user">
    <el-form inline  @keyup.enter.native="searchList">
      <el-form-item label='关键词'>
        <el-input placeholder='关键词' size='small' v-model="searchParams.keyword" clearable></el-input>
      </el-form-item>
      <el-form-item label='状态'>
        <el-select size='small' v-model="searchParams.status">
          <el-option label='全部' value=''></el-option>
          <el-option label='停用' value='2'></el-option>
          <el-option label='启用' value='1'></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="searchList" class="ml40 mt5 mb20" type='success' icon='el-icon-search' size='small'>查询</el-button>
      <el-button @click="resetParams" class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>
          重置</el-button>
      <el-button @click='showEdit(0)' class="ml40 mt5 mb20" type='primary' icon='el-icon-plus' size='small'>添加</el-button>
    </el-form>
    <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mt20 mb20" v-loading="loading">
      <el-table-column prop="sortNum" label="排序"></el-table-column>
      <el-table-column prop="keyword" label="关键词"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{row}">
          {{ row.createTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="是否是热搜词">
        <template slot-scope="{row}">
          {{ row.icon ? '是' :  '否'}}
        </template>
      </el-table-column>
      <el-table-column label="是否是默认词">
        <template slot-scope="{row}">
          {{ row.isDefault ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          {{ row.status | bannerStatus}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="360px">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="向上" placement="top">
            <el-button @click="changeWeight(row,'up')" class="" icon="el-icon-top" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="向下" placement="top">
            <el-button @click="changeWeight(row,'down')" class="" icon="el-icon-bottom" circle></el-button>
          </el-tooltip>
          <el-button icon="el-icon-edit" type="primary" class="mt10" size="small" @click='showEdit(1,row)'>编辑</el-button>
          <el-button @click='changeStatus(row)' icon="el-icon-info" type="warning" class="mt10" size="small">
            {{ row.status===1 ? '停用' : "启用"}}</el-button>
          <el-button icon="el-icon-delete" type="danger" class="mt10" size="small" @click="del(row.uuid)">删除</el-button>
          <el-button v-if="!row.isDefault" icon="el-icon-setting" type="primary" class="mt10" size="small" @click="setDefault(row.uuid)">设置为默认词</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增编辑弹框 -->
    <addKeyWord   :menuObj='menuObj' @closeMain="closeMain" @freshParent="searchList()" />
  </div>
</template>
<script>
  import addKeyWord from "@/components/fixedSettings/addKeyWord";
  import { keyworldList, keyworldChange, keyworldDel ,keyworlOrder,setDefaultWord} from '@/api/home'
  export default {
    components: {
      addKeyWord
    },
    data() {
      return {
        list: [],
        searchParams: {},
        loading:false,
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
          pageSize: 1000,
          status: this.searchParams.status,
          keyword: this.searchParams.keyword,
        }
        this.loading = true;
        keyworldList(param).then(res => {
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
      // 排序
      changeWeight(row, type) {
        let index = this.list.findIndex(val => val.uuid == row.uuid);
        let param = { uuid: row.uuid };
        if (type == 'up') {
          if (index - 1 < 0) {
            this.$message.error("已经是第一个了"); return;
          }
          else {
            param.swapHotSearchUuid = this.list[index - 1].uuid;
          }
        }
        else {
          if (index + 1 > this.list.length - 1) {
            this.$message.error("已经是最后一个了"); return;
          }
          else {
            param.swapHotSearchUuid = this.list[index + 1].uuid;
          }
        }
        keyworlOrder(param).then(res => {
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
      changeStatus(row) {
        this.loading = true;
        let param = {
          uuid: row.uuid
        }
        keyworldChange(param).then(res => {
          if (res.code === 200) {
            this.searchList();
          }
          this.loading = false;
        }).catch(res => {
          this.loading = false;
        })
      },
      setDefault(val){
        let param = {
            uuid:val,
          }
          setDefaultWord(param).then(res => {
            if (res.code === 200) {
              this.$message.success("成功");
              this.searchList();
            }
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
          keyworldDel(param).then(res => {
            if (res.code === 200) {
              this.$message.success("成功");
              this.searchList();
            }
          })

        }).catch(() => {

        });
      },
      resetParams() {
        this.page.page=1;
        this.searchParams = {};
        this.searchList()
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