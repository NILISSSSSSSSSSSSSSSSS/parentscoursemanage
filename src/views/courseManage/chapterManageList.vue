<template>
  <div>
    <div class="all-user">
      <div class="buttonRow mb10">
        <el-button class="mr10" icon="el-icon-back" type="primary" size="small" @click="$router.push('/seriesLession')">
          返回系列课列表
        </el-button>
        <el-button class="mb2" icon="el-icon-plus" type="primary" size="small" @click='showEdit(0,{})'>添加章节
        </el-button>
      </div>
      <!-- 搜索条件 -->
      <el-form inline label-position="right" label-width="100px">
        <el-row>
          <el-form-item label="章节名称">
            <el-input size="small" v-model="searchParams.chapterName"></el-input>
          </el-form-item>
          <el-form-item label="章节排号">
            <el-input size="small" v-model="searchParams.serialNumber"></el-input>
          </el-form-item>
          <el-form-item label="开启状态">
            <el-select size="small" v-model="searchParams.status" placeholder="请选择">
              <el-option v-for="(item,index) in stateList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间范围">
            <el-date-picker v-model="createTime" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format='yyyy-MM-dd' size="small"></el-date-picker>
          </el-form-item>
          <el-form-item label="开课时间范围">
            <el-date-picker v-model="startTime" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format='yyyy-MM-dd' size="small"></el-date-picker>
          </el-form-item>
          <el-button @click="searchList" class="ml40 mt4 mb20" icon="el-icon-search" type="primary" size="small">查询
          </el-button>
          <el-button class="ml40 mb20 mt4" @click="resetParams" icon="el-icon-setting" type="primary" size="small"
            plain>重置</el-button>
        </el-row>
        <el-row>

        </el-row>
      </el-form>

      <!-- 搜索结果 -->
      <el-table v-loading="loading" :data="list" border stripe class="mb20">
        <el-table-column prop="serialNumber" label="章节排号" width="80px">
        </el-table-column>
        <el-table-column label="封面">
          <template slot-scope="{row}" class="tableAvaterBox">
            <div class="tableAvaterBox">
              <img :src="row.chapterBanner" alt="" class="tableAvater">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="章节名称"></el-table-column>
        <el-table-column label="课程形式">
          <template slot-scope="{row}">
            {{ row.chapterStyle | courseStyle}}
          </template>
        </el-table-column>
        <el-table-column label="专家" width="80px">
          <template slot-scope="{row}" v-if="row.expert">
            {{ row.expert.name }}
          </template>
        </el-table-column>
        <el-table-column label="启用状态" width="80px">
          <template slot-scope="{row}">
            {{ row.status | chapterStatus}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="{row}">
            {{ row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="课程开始时间">
          <template slot-scope="{row}">
            {{ row.startTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="课程时长" width="150px">
          <template slot-scope="{row}">
            {{ $utils.TimestampToTime(row.duration) }}
          </template>
        </el-table-column>
        <el-table-column label="课程状态">
          <template slot-scope='{row}'>
            <span :class="row.updateStatus!==2 ? 'col-sucs' :'col-danger'">{{row.updateStatus | updateStatus}}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="340px" fixed="right">
          <template slot-scope="scope" style="text-align:center;">
            <el-tooltip class="item" effect="dark" content="向上" placement="top" v-if="scope.$index!=0">
              <el-button @click="changeWeight(scope.row,'up')" class="" icon="el-icon-top" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="向下" placement="top">
              <el-button @click="changeWeight(scope.row,'down')" class="" icon="el-icon-bottom" circle></el-button>
            </el-tooltip>

            <el-button icon="el-icon-edit" type="primary" class="mr10" size="small" @click='showEdit(1,scope.row)'
              :loading="scope.row.loading">编辑
            </el-button>
            <el-dropdown size="small" @command="changeStatus" split-button type="warning" class="mr10">
              <span>{{scope.row.status | chapterStatus}}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="(scope.row.uuid+',1')" :disabled="scope.row.status==1">启用</el-dropdown-item>
                <el-dropdown-item :command="(scope.row.uuid+',2')" :disabled="scope.row.status==2">停用</el-dropdown-item>
                <el-dropdown-item :command="(scope.row.uuid+',3')" :disabled="scope.row.status==3">下架</el-dropdown-item>
                <el-dropdown-item :command="(scope.row.uuid+',4')" :disabled="scope.row.status==4">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <router-link  v-if="scope.row.chapterStyle==1" class="el-button el-button--text el-button--small" :to="{path:'/liveRoom/',query:{uuid:scope.row.uuid,type:'chapter'}}">进入直播间
            </router-link>
             <div>
                <a v-if="scope.row.courseSource" class="aLink" :href="scope.row.courseSource.sourceUrl" target="_blank"
                style="color: #409EFF;">
                <span class="el-icon-download"></span> 下载授课内容
              </a>
              <el-button icon="el-icon-headset" :loading="scope.row.loading2" type="text" size="small" @click="freeListen(scope.row)">
                {{ scope.row.isTry ? '取消试听' : '免费试听' }} </el-button>
             </div>
          
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
    </div>
    <add-chapter :menuObj='menuObj' @closeMain="closeMain" @freshParent="searchList()">

    </add-chapter>
  </div>
</template>
<script>

  import addChapter from "@/components/courseManage/addChapter.vue";
  import { chapterList, chapterDetail, chapterOrder, chapterChangeSta, chapterListenSta } from '@/api/home'
  export default {
    components: {
      addChapter
    },
    computed: {
    },

    data() {
      return {
        loading: false,
        addChapterDia: false,
        searchParams: {},
        list: [],
        stateList: [
          { label: "全部", value: "" },
          { label: "启用", value: "1" },
          { label: "停用", value: "2" },
          { label: "下架", value: "3" },
          { label: "删除", value: "4" }
        ],
        createTime: [],
        startTime: [],
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
        detail: {},
        courseUuid: null,
        menuObj: {
          isShow: false,
          isEdit: false,
          data: {}
        },
      };
    },
    mounted() {
      this.courseUuid = this.$route.query.courseUuid;
      this.searchList();
    },
    watch: {

    },
    methods: {
      closeMain(obj) {
        this.menuObj.isShow = false;
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      //列表查询gln
      searchList() {
        let createTime = this.createTime || [],
          startTime = this.startTime || []
        createTime = this.$utils.formatRange(createTime)
        startTime = this.$utils.formatRange(startTime)
        this.searchParams.createTime_after = createTime[0]
        this.searchParams.createTime_before = createTime[1]
        this.searchParams.startTime_after = startTime[0]
        this.searchParams.startTime_before = startTime[1]
        let param = {
          ... this.searchParams,
          courseUuid: this.courseUuid,
          page: this.page.page,
          pageSize: this.page.limit
        }

        this.loading = true;
        chapterList(param).then(res => {
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
            param.objUuid = this.list[index - 1].uuid;
          }
        }
        else {
          if (index + 1 > this.list.length - 1) {
            this.$message.error("已经是最后一个了"); return;
          }
          else {
            param.objUuid = this.list[index + 1].uuid;
          }
        }
        chapterOrder(param).then(res => {
          if (res.code === 200) {
            this.$message.success("成功");
            this.searchList();
          }
        })
      },
      //停启用 | 下架 操作
      changeStatus(obj) {
        obj = obj.split(',')
        let param = {
          uuid: obj[0],
          status: Number(obj[1])
        }
        chapterChangeSta(param).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg || '操作成功')
            this.searchList()
          }
        }).catch(err => {
          this.$message.error(err.msg || '操作失败')
        })
      },

      showEdit(type, row) {
        let obj = null;
        if (!!type) {
          let param = {
            uuid: row.uuid
          }
          this.$set(row, 'loading', true)
          chapterDetail(param).then(res => {
            this.$set(row, 'loading', false);
            if (res.code === 200) {
              console.log("章节详情：" + JSON.stringify(res.data));
              obj = res.data;
              this.menuObj = {
                isShow: true,
                isEdit: !!type,
                data: obj
              }
            }

          }).catch(err => {
            this.$set(row, 'loading', false);
          })
        }
        else {
          this.menuObj = {
            isShow: true,
            isEdit: !!type,
            data: {}
          }
        }
      },
      resetParams() {
        this.page.page = 1;
        this.searchParams = {}; this.createTime = this.startTime = [];
        this.searchList()
      },
      freeListen(row) {
        let text = row.isTry ? '确定取消?' : '免费后用户无需购买即可看到此章节全部内容，确定免费吗?';
        this.$confirm(text, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            uuid: row.uuid
          }
          this.$set(row, 'loading2', true)
          chapterListenSta(param).then(res => {
            if (res.code === 200) {
              this.$message.success("成功");
              this.searchList();
            }
            this.$set(row, 'loading2', false);
          }).catch(err => {
            this.$set(row, 'loading2', false);
          })
        }).catch(() => {

        });
      }
    }
  };
</script>

<style scoped lang="less">
  .el-dialog {
    max-height: 85vh;
    overflow: auto;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>