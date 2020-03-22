<template>
  <el-dialog :visible.sync="editData.isShow" title="课件详情 " append-to-body width="700px" :before-close="closeDialog">
    <div>
      <div class="text item">
        <el-row class="detailRow">
          <el-col :span="24"> 课程名称：{{ detail.name }}</el-col>
          <el-row>
            <el-col :span="8"> 课程类型：{{ editData.type =='video' ? '视频课' : editData.type =='audio' ?  '音频课' : '直播课' }}
            </el-col>
            <el-col :span="8"> 课程时长：
              <span v-if="editData.type!=='live'"> {{ $utils.TimestampToTime(detail.duration) }}</span>
              <span v-else>{{ $utils.TimestampToTime(detail.courseDuration) }}</span>
            </el-col>
            <el-col :span="8"> 上传时间： {{ detail.createTime | formatDate}} </el-col>
          </el-row>
          <!-- 上传课件 -->
          <el-col :span="24">
            上传课件：
            <!-- 视频课音频课的预览 -->
            <span v-if="['video','audio'].includes(editData.type)" @click='$viewImage(detail.sourceUrl,editData.type)'
              class="linkSet">预览</span>
            <!-- 如果是直播 有视频，音频，文本，图片-->
            <template v-else>
              <el-table v-loading="loading" :data="list" border stripe class="mb20">
                <el-table-column prop="name" label="名字"></el-table-column>
                <el-table-column label="大小">
                  <template slot-scope="{row}">
                     <span v-if="row.fileSize">{{ row.fileSize}}kb</span>
                  </template>
                </el-table-column>
                <el-table-column label="时长">
                  <template slot-scope="{row}">
                     <span v-if="row.duration"> {{ $utils.TimestampToTime(row.duration) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180px" >
                  <template slot-scope="{row}" style="text-align:center;">
                    <el-button  type="text" size="small" @click="previewLiveCourseware(row)">预览</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页组件-->
              <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage">
              </pagination>
            </template>
          </el-col>
          <!-- 直播banner 有视频，音频，ppt，图片-->
          <el-col :span="24" v-if="editData.type=='live' && detail.bannerInfo &&  detail.bannerInfo.sourceUrl">
            直播banner：
            <el-button  type="text" size="small" @click='previewBanner'>预览</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <previewSwiper :menuObj="menuObj" @closeMain="menuObj.isShow=false" />
  </el-dialog>
</template>
<script>
  import { liveCouseware } from '@/api/home';
  import previewSwiper from "@/components/previewSwiper"
  export default {
    components: {
      previewSwiper
    },
    props: {
      editData: {
        type: Object,
        default: () => { return {} }
      },
    },

    data() {
      return {
        menuObj: { isShow: false, data: [] },
        detail: {},
        list:[],
        loading:false,
        // 分页相关
        page: {
          page: 1,
          limit: 10,
          total: 0
        },
      };
    },
    created() { },
    watch: {
      'editData.isShow'(val) {
        if (val) {
          this.detail = this.editData.data;
          if(this.editData.type=='live'){
            this.getLiveCouseware();
          }
        }
      }

    },
    methods: {
      // 获取直播课上传的课件
      getLiveCouseware() {
        let param = {
          page: this.page.page,
          pageSize: this.page.limit,
          liveCourseUuid: this.editData.data.uuid
        }
        this.loading = true;
        liveCouseware(param).then(res => {
          if (res.code === 200) {
            if (res.data && res.data.count > 0) {
              console.log("直播课上传的课件：" + JSON.stringify(res.data.results));
              [this.list, this.page.total] = [res.data.results, res.data.count]
            }
            else {
              [this.list, this.page.total] = [[], 0]
            }
          }
          this.loading = false;
        }).catch(err=>{
          this.loading = false;
        })
      },
      //预览直播课课件
      previewLiveCourseware(row){
        // 视频，音频，图片
        if ([1, 2, 3,4].includes(row.sourceType)) {
          let list = { 1: "audio", 2: 'video', 3: 'picture',4:"txt" }
          this.$viewImage(row.sourceUrl, list[row.sourceType])
        }
    
      },
      // 预览直播课banner
      previewBanner() {
        //  如果banner类型是视频，音频，图片
        if ([1, 2, 4].includes(this.detail.bannerInfo.sourceType)) {
          let list = { 1: "video", 2: 'audio', 4: 'picture' }
          this.$viewImage(this.detail.bannerInfo.sourceUrl, list[this.detail.bannerInfo.sourceType])
        }
        // <!-- 如果banner类型是ppt -->
        if ([3].includes(this.detail.bannerInfo.sourceType)) {
          // 如果ppt是新数据
          if (this.detail.bannerInfo.pptType == 1) {
            window.open(`http://view.officeapps.live.com/op/view.aspx?src=${this.detail.bannerInfo.sourceUrl}`);
          }
          // 如果是老数据
          else {
            this.menuObj = {
              isShow: true,
              data: this.detail.bannerInfo.pptUrlList
            }
          }

        }
      },
      changePage(page, pageSize) {
        this.page.limit = pageSize;
        this.page.page = page;
        this.searchList();
      },
      closeDialog() {
        let obj = {
          isShowEdit: false, //是否显示编辑弹框
        }
        this.$emit('closeMain', obj)
      },

    }
  };
</script>

<style scoped lang="less">
  /deep/ .el-dialog__body {
    max-height: 85vh;
    overflow: auto;
  }

  .detailRow {
    .el-col {
      margin-bottom: 15px;
    }
  }

  .linkSet {
    color: #409EFF;
    cursor: pointer;
  }
  .widthSet{
    max-width: 210px;max-height: 210px;
  }
</style>