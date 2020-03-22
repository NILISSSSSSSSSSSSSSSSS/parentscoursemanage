<template>
  <div class="all-user">
    <!-- 搜索条件 -->
    <el-form  @keyup.enter.native="searchList" inline label-position="right" label-width="100px">
      <el-form-item label="模版名称">
        <el-input size="small" v-model="searchParams.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="课程类型">
        <el-select size="small" v-model='searchParams.mustReadType' clearable>
          <el-option v-for='(itm,index) in courseTypeList' :key='index' :value='itm.value' :label='itm.label'></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="searchList" class="ml40 mb20 mt4" icon="el-icon-search" type="success" size="small">查询
      </el-button>
      <el-button @click="resetParams" class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>重置
      </el-button>
      <el-button @click="showEdit(0)" class="ml40 mb20 mt4" icon="el-icon-plus" type="primary" size="small">创建模板
      </el-button>
    </el-form>
    <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20" v-loading="loading">
      <el-table-column prop="name" label="模版名称"></el-table-column>
      <el-table-column label="课程类型">
        <template slot-scope="{row}">
          {{ row.mustReadType | courseType}}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="购买须知"></el-table-column>
      <el-table-column label="操作" width="320px">
        <template slot-scope="{row}">
          <el-button :loading="row.loading" icon="el-icon-edit" type="primary" class="mt10" size="small"
            @click="showEdit(1,row)">编辑
          </el-button>
          <!-- <el-button icon="el-icon-info" type="danger" class="mt10" size="small"  @click="changeStatus(row)">{{ row.enable ? '暂停' : '启用'}}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <creat-template :editData='editData' @freshParent="page.page=1;searchList()" @closeMain="closeMain" />
  </div>
</template>
<script>
  import { purchaseInstructList, purchaseInstructDetail,changePurchaseSta } from '@/api/home'
  import creatTemplate from "@/components/fixedSettings/creatTemplate.vue";
  export default {
    components: {
      creatTemplate
    },
    data() {
      return {
        loading: false,
        searchParams: {},
        list: [],
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        courseTypeList: require('@/config').courseTypeList,
        editData: {
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
      //列表查询gln
      searchList() {
        let param = {
          page: this.page.page,
          pageSize: this.page.limit,
          name: this.searchParams.name,
          mustReadType: this.searchParams.mustReadType,
        }
        this.loading = true;
        purchaseInstructList(param).then(res => {
          if (res.code === 200) {
            if (res.data && res.data.count > 0) {
              console.log("数据：" + JSON.stringify(res.data.results));
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
 
      //新增编辑弹框展示
      showEdit(type, row) {
        console.log(row);
        this.editData = {
          isShow: true,
          isEdit: !!type,
          data: !!type ? row : {}
        }
      },
      // changeStatus(row){
      //   let param = { uuid: row.uuid }
      //   changePurchaseSta(param).then(res => {
			// 			if (res.code === 200 ) {
      //         this.$message.success("成功");
      //         this.searchList();
			// 			}
			// 		})
      // },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      resetParams() {
        this.searchParams = {}
        this.searchList()
      },
      closeMain(obj) {
        this.editData.isShow = false;
      }
    }
  }
</script>
<style lang="less" scoped>
</style>