<template>
  <div class="preview-phone">
    <el-dialog :visible.sync='previewData.isShow' title='课程预览' width='500px' :close-on-click-modal='false'>
      <div class="phone">
        <div class="content pr">

          <!-- 头部 -->
          <el-row class="wap-header tc">
            <el-col :span='2'><i class="el-icon-arrow-left"></i></el-col>
            <el-col :span='19'>
              <div class="tc ellpis">{{courseParams.name || 'xxx课程'}}</div>
            </el-col>
            <el-col :span='3'><i class="el-icon-more"></i></el-col>
          </el-row>
          <!-- 内容 -->
          <div class="wap-main box-phone">
            <!-- banner -->
            <el-row class="banner-cnt pr">
              <img class="w100" :src="courseParams.courseBanner || defaultImg" alt="课程图">
              <div class="my-share-btn col-blue pa" v-if="courseParams.sharePrice">
                <i class="el-icon-share col-danger"></i>
                赚￥${courseParams.sharePrice}
              </div>

            </el-row>
            <!-- 标题 -->
            <el-row class="">
              <div class="col3 lh24">{{courseParams.subhead || '这里是副标题'}}</div>
              <div class="courseDespruction  ft12 lh20" :class="showMore ? 'show10' : 'show3'">
                {{'课程简介:' + courseParams.briefIntro || '课程简介：这里是课程简介'}}
               </div>
               <span class="col-blue showMoreText" @click="showMore=!showMore" v-if="courseParams.briefIntro && courseParams.briefIntro.length>30">{{ showMore ? '折叠' : '展开更多'}}</span>
            </el-row>
            <!-- 专家栏 -->
            <el-row class="special-row">
              <el-col :span='4'>
                <img class="user-avatar" :src="expertInfo.avatar">
              </el-col>
              <el-col :span='18' class="ft12 ">
                <div class="col3 ellpis">专家名称：{{ expertInfo.name }}</div>
                <div class="ft12 ellpis">{{ expertInfo.hospital }} {{ expertInfo.department }} {{ expertInfo.jobTitle }}
                </div>
              </el-col>
              <el-col :span='2' class="tr">
                <i class="el-icon-arrow-right"></i>
              </el-col>
            </el-row>
            <el-row class="tc lh30 col3">
              <el-col :span='12' class="col-blue" style="text-align: left;">课程介绍</el-col>
              <!-- <el-col :span='12'>用户评价</el-col> -->
            </el-row>
            <el-row>
              <div class="preview-info" v-html='courseParams.info'></div>

            </el-row>
          </div>
          <!-- 底部 -->
          <el-row class="preview-footer">
            <el-button class="mr5" size='small' round @click='listen'
              v-if="courseParams.courseType===1 && courseParams.chapterStyle !== 1 && courseParams.tryInfoUuid">试听
            </el-button>
            <el-button class="buy w190" type='primary' size='small' v-if='courseParams.coursePermission !==1'>
              <span class="ft12">￥{{ courseParams.realPrice }},￥<del>{{ courseParams.originalPrice }}</del> </span>
              立即购买
            </el-button>
          </el-row>
        </div>
      </div>
      <el-row class="tc">
        <el-button type="primary" @click="previewData.isShow = false">关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      previewData: {
        type: Object,
        default: () => { return {} }
      }
    },
    data() {
      return {
        courseParams: {},
        expertInfo: {},
        showMore: false,
        defaultImg: require('@/images/bg.jpeg')
      }
    },
    methods: {
      listen() {
        let type = null;
        if (this.courseParams.chapterStyle == '2') {
          type = 'audio'
        }
        if (this.courseParams.chapterStyle == '3') {
          type = 'video'
        }
        this.$viewImage(this.courseParams.tryInfoUuid.sourceUrl, type)
      }
    },
    computed: {
      isShow() {
        return this.previewData.isShow
      }
    },
    watch: {
      isShow(a) {
        if (a) {
          this.courseParams = this.previewData.data;
          if (this.courseParams.expertUuid && this.previewData.expertList.length !== 0) {
            this.expertInfo = this.previewData.expertList.filter(val => val.uuid == this.courseParams.expertUuid)[0]
          }

        }
      }
    }
  }
</script>
<style lang="less">
  .preview-phone {
    /deep/ .el-dialog {
      margin-top: 5vh !important;
    }

    /deep/ .el-dialog__body {
      padding: 10px 20px 20px 20px;
    }

    .phone {
      width: 320px;
      height: 568px;
      margin: 0 auto 20px;
      background: url('../../images/phone.jpg') no-repeat;
      background-size: contain;
    }

    .content {
      width: 263px;
      height: 445px;
      /* background: #f7f7f7; */
      top: 60px;
      left: 15px;
      overflow: hidden;
    }

    .wap-main {
      /* background: pink; */
      overflow-y: auto;
      height: 383px;
      ;
      /* padding: 30px 0 32px; */
    }

    .wap-header {
      border-bottom: 1px solid #eee;
      background: #f9f9f9;
      line-height: 30px;
      margin-left: 0;
      margin-top: 0;
      z-index: 5;
      width: 263px;

      i {
        margin-top: 7px;
      }
    }

    .banner-cnt {
      width: 100%;
      height: 120px;
      overflow: hidden;
    }

    .courseDespruction {
      display: -webkit-box;
      -webkit-box-orient: vertical;


      overflow: hidden;
    }

    .show10 {
      -webkit-line-clamp: 10;
    }

    .show3 {
      -webkit-line-clamp: 3;
    }
    .showMoreText{
      font-size: 12px;
    /* width: 100%; */
    display: block;
    text-align: right;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-top: 10px;
    cursor: pointer;
    }
    .my-share-btn {
      padding: 5px;
      border: 1px solid #FAA453;
      border-right: 0px;
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
      right: 0;
      top: 5px;
      background: #fff;
      font-size: 12px;
    }

    .free {
      background: #FFCC33;
      color: #333;
      left: 0px;
      bottom: 0px;
      padding: 2px 5px;
      font-size: 12px;
    }

    .special-row {
      border: 1px solid #eee;
      background: #fff;
      padding: 2px 5px;
      height: 46px;

      i {
        margin-top: 10px;
      }
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
    }

    .preview-info img {
      max-width: 100% !important;
      width: auto !important;
    }

    .preview-info .ql-video {
      max-width: 100% !important;
    }

    .preview-footer {
      width: 263px;
      height: 32px;
      padding-top: 4px;
      margin-top: 0px;
      margin-left: 0;
      z-index: 5;
      position: fixed;
      text-align: center;
      background: #fff;

      .el-button--small {
        padding: 7px 15px !important;
      }

      .buy {
        padding: 7px 5px !important;
        border-radius: 5px;
      }
    }
  }
</style>