<template>
  <div class="all-user">
    <!-- 搜索条件 -->
    <el-form inline label-position="right" label-width="100px">
      <el-form-item label="专家名">
        <el-input size="small" v-model="searchParams.name" @keyup.enter.native='searchList' clearable></el-input>
      </el-form-item>
      <el-form-item label="科室/专业">
        <el-input size="small" v-model="searchParams.department" @keyup.enter.native='searchList' clearable></el-input>
      </el-form-item>
      <el-form-item label="所在医院">
        <el-input size="small" v-model="searchParams.hospital" @keyup.enter.native='searchList' clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input size="small" v-model="searchParams.tel" @keyup.enter.native='searchList' clearable></el-input>
      </el-form-item>
      <el-form-item label="职称">
        <el-input size="small" v-model="searchParams.jobTitle" @keyup.enter.native='searchList' clearable></el-input>
      </el-form-item>
      <el-form-item label="是否明星专家">
        <el-select size="small" v-model='searchParams.isStar' @keyup.enter.native='searchList' clearable>
          <el-option v-for='(itm,index) in starList' :key='index' :value='itm.value' :label='itm.label'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select size="small" v-model='searchParams.enable' @keyup.enter.native='searchList' clearable>
          <el-option v-for='(itm,index) in status' :key='index' :value='itm.value' :label='itm.label'></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="searchList" class="ml40 mb20 mt4" icon="el-icon-search" type="success" size="small">查询
      </el-button>
      <el-button @click="resetParams" class="ml40 mb20 mt4" icon="el-icon-setting" type="primary" size="small" plain>重置
      </el-button>
      <el-button @click="showEdit(0)" class="ml40 mb20 mt4" icon="el-icon-plus" type="primary" size="small">新增专家
      </el-button>
    </el-form>
    <!-- 搜索结果 -->
    <el-table :data="list" border stripe class="mb20" v-loading="loading">
      <el-table-column label="专家头像">
        <template slot-scope="{row}">
          <div class="tableAvaterBox">
            <img :src="row.avatar" alt="" class="tableAvater">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="专家名称"></el-table-column>
      <el-table-column prop="jobTitle" label="职称"></el-table-column>
      <el-table-column prop="department" label="科室/专业"></el-table-column>
      <el-table-column prop="hospital" label="所在医院"></el-table-column>
      <el-table-column prop="tel" label="手机号"></el-table-column>
      <el-table-column label="明星医师" width="150px">
        <template slot-scope="{row}">
          {{ row.isStar | isStar}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <span :class="row.enable?'col-sucs':'col-danger'">{{ row.enable | enable}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320px">
        <template slot-scope="{row}">
          <el-button :loading="row.loading" icon="el-icon-edit" type="primary" class="mt10" size="small"
            @click="showEdit(1,row)">编辑
          </el-button>
          <el-button icon="el-icon-info" type="danger" class="mt10" size="small" @click="changeStatus(row)">
            {{ row.enable ? '禁用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    <editSpecial :editData='editData' @freshParent="page.page=1;searchList()" @closeMain="closeMain" />
  </div>
</template>
<script>
  import { specialList, changeSpecialSta } from '@/api/home'
  import editSpecial from "@/components/userManage/editSpecialist.vue";
 
  export default {
    components: {
      editSpecial
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
        starList:[
          { label: '全部', value: '' },
          { label: '是', value: 'True' },
          { label: '否', value: 'False' },
        ],
        status: [
          { label: '全部', value: '' },
          { label: '禁用', value: 'False' },
          { label: '启用', value: 'True' },
        ],
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
          hospital: this.searchParams.hospital,
          department: this.searchParams.department,
          jobTitle: this.searchParams.jobTitle,
          tel: this.searchParams.tel,
          enable: this.searchParams.enable,
          isStar:this.searchParams.isStar
        }
        this.loading = true;
        specialList(param).then(res => {
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
        let param = { uuid: row.uuid }
        changeSpecialSta(param).then(res => {
          if (res.code === 200) {
            this.$message.success("成功");
            this.searchList();
          }
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