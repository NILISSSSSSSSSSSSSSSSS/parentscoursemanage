<template>
  <div class="chatWrapper" v-loading="loadingChat">
    <el-card class="box-card" style="width:600px;">
      <div class="chatHeader">
        {{ liveDetail.name}}
      </div>
      <!-- 直播ppt -->
      <div class="liveTopBox">
        <div class="noText" v-if="!liveDetail.liveCourseBanner">当前没有课件</div>
        <template v-else>
          <!-- 如果是视频 -->
          <video :src="liveDetail.liveCourseBanner.sourceUrl" v-if="liveDetail.liveCourseBanner.sourceType==1" controls
            class="widthSet"></video>
          <!-- 如果是音频 -->
          <audio :src="liveDetail.liveCourseBanner.sourceUrl" v-if="liveDetail.liveCourseBanner.sourceType==2" controls
            class="widthSet"></audio>
          <!-- 如果是图片 -->
          <img :src="liveDetail.liveCourseBanner.sourceUrl" alt="" v-if="liveDetail.liveCourseBanner.sourceType==4"
            class="widthSet">
          <!-- 如果是ppt -->
          <template v-if="liveDetail.liveCourseBanner.sourceType==3">
            <el-carousel indicator-position="none" :autoplay="false" height="100%" :initial-index="currentIndex"
              @change="changePPT">
              <el-carousel-item v-for="(item,index) in liveDetail.liveCourseBanner.pptUrlList" :key="index">
                <img :src="item.imgUrl" alt="">
              </el-carousel-item>
            </el-carousel>
            <div class="pptNum"> {{ currentIndex+1 }}/{{ liveDetail.liveCourseBanner.pptUrlList.length}}</div>
          </template>
        </template>
      </div>
      <div class="chatCon">
        <div class="divTip" v-if="liveDetail.updateStatus == 6">直播未开始</div>
        <div class="divTip" v-if="liveDetail.updateStatus == 5">直播中</div>
        <div v-for="(item,index) in currentMessageList" :key="index" v-if="item.type !== 'ppt-pos'">
          <div class="chatRow" :class="currentUserProfile.userID == item.from_uid ? 'self' : 'other'">
            <div class="messageRow mt20">
              <img :src="item.avatar" alt="" class="avater">
              <div class="info">
                <el-dropdown size="small" class="mt2" @command="operate">
                  <span class="el-dropdown-link">
                    <span style="cursor:pointer">{{ item.username }}</span>
                  </span>
                  <!-- 这里需要判断身份，管理员和群主 -->
                  <el-dropdown-menu slot="dropdown" v-if="liveDetail.updateStatus == 5">
                    <el-dropdown-item :command="(index+',1')">禁言</el-dropdown-item>
                    <el-dropdown-item :command="(index+',2')">取消禁言</el-dropdown-item>
                    <!-- <el-dropdown-item :command="(index+',3')">撤回</el-dropdown-item> -->
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- 文本 -->
                <div class="con mt2 txtBg" v-if="item.type == 'txt'">
                  {{ item.content}}
                </div>
                <!-- 图片 -->
                <div class="con mt2" v-if="item.type == 'img'">
                  <img :src="item.content" class="imgMsg" @click='$viewImage(item.content,"picture")' />
                </div>
                <!-- 上墙 -->
                <div class="con mt2 txtBg" v-if="item.type == 'qna'">
                  <p v-if="item.question">@{{ item.question.username }} {{ item.question.content }}</p>
                  <p>{{ item.content }}</p>
                </div>
                <!-- 视频 -->
                <div class="con mt2" v-if="item.type == 'video'">
                  <video :src="item.content" class="imgMsg video" playsinline="isiPhoneShowPlaysinline"
                    x5-video-player-type="h5-page" t7-video-player-type="inline"
                    webkit-playsinline="isiPhoneShowPlaysinline" x-webkit-airplay="allow" controls="controls" preload />
                </div>
                <!-- 音频 -->
                <div class="con mt2" v-if="item.type == 'voice'">
                  <audio :src="item.content" controls style="width: 200px;height: 35px;"></audio>
                </div>
                <div class="time mt2">
                  {{ item.msg_time | formatDate }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="divTip" v-if="liveDetail.updateStatus == 4">直播结束</div>
      </div>
      <!-- 直播中才能发送消息 -->
      <div class="chatInput" v-if="liveDetail.updateStatus==5" @keyup.enter="sendCon">
        <div class="chatInput_left">
          <el-input v-model.trim="content" class="chatInputBox"></el-input>
        </div>
        <el-button type="primary" class="chatInput_Button" @click="sendCon" :loading="sendLoading">发送</el-button>
        <!-- 专家端才有上墙 -->
        <el-button type="primary" class="chatInput_Button" v-if="role=='expert'" @click="detailDia=true">讨论区
        </el-button>
      </div>
    </el-card>
    <!-- 专家讨论区 -->

    <compereDiscussArea :detailDia.sync="detailDia" />
  </div>
</template>
<!-- 如果直播已结束，则很多按钮不显示，历史记录拉取后端的，否则历史记录拉取im -->
<script>
  import { mapState } from 'vuex'
  import compereDiscussArea from "@/components/courseManage/chat/compereDiscussArea.vue";
  export default {
    data() {
      return {
        content: "",
        sendLoading: false,
        currentIndex: 0,
        detailDia: false,
      }
    },
    components: {
      compereDiscussArea
    },
    props: {
    },
    mounted() {

    },
    computed: {
      ...mapState({
        isSDKReady: state => state.imInfo.isSDKReady,
        currentMessageList: state => state.imInfo.currentMessageList,
        currentUserProfile: state => state.imInfo.currentUserProfile,
        liveDetail: state => state.imInfo.liveDetail,
        loadingChat: state => state.imInfo.loadingChat,
        role: state => state.imInfo.role,
      }),

    },
    methods: {
      //改变ppt
      changePPT(val) {
        console.log(val);
        this.currentIndex = val;
        // 如果是专家，并且是在直播中则要上报到im
        if (['expert'].includes(this.role) && this.liveDetail.updateStatus == 5) {
          this.$store.dispatch('send', { type: "ppt-pos", content: val, duration: 0 })
        }

      },
      operate(val) {
        let obj = val.split(',')
        // 禁言
        if (obj[1] == 1) {
          this.$store.dispatch('MutePeople', { userId: this.currentMessageList[obj[0]].from_uid, expire: 600 });
        }
        // 取消禁言
        if (obj[1] == 2) {
          this.$store.dispatch('MutePeople', { userId: this.currentMessageList[obj[0]].from_uid, expire: 0 });
        }
        // 撤销
        // else {
        //   this.$store.dispatch('reCallCurrent',this.currentMessageList[obj[0]].sequence).then(success=>{
        //     this.currentMessageList.splice([obj[0]],1);
        //     this.$store.commit('setCurrentMessageList', this.currentMessageList)
        //   });  
        // }

      },
      // 发送消息，所有发送消息调用后端接口
      sendCon() {
        this.sendLoading = true;
        this.$store.dispatch('send', { type: "txt", content: this.content, duration: 0 }).then(res => {
          this.content = "";
          $(".chatInputBox input")[0].focus();
          this.sendLoading = false;
        }).catch(err => {
          this.sendLoading = false;
        });
      },
    }
  }
</script>
<style scoped lang="less">
  .el-card {
    background: #f5f5f5;

  }

  /deep/ .el-card__body {
    padding: 0px;
  }

  .chatHeader {
    line-height: 30px;
    font-size: 20px;
    padding: 10px 9px;
    border-bottom: 1px solid #e0e5ea;
    color: #409EFF;
  }


  .chatCon {
    height: 420px;
    overflow: auto;
    padding: 8px 20px;
  }

  .time {
    color: rgba(194, 186, 188)
  }

  .systemInfo {
    text-align: center;

    span {
      background: rgba(229, 244, 255);
      padding: 3px 12px;
      display: inline-block;
      border-radius: 7px;
    }
  }

  .messageRow {
    display: flex;
    align-items: flex-start;

    .avater {
      height: 40px;
      width: 40px;
      border-radius: 50%;
    }

    .info {
      display: flex;
      flex-direction: column;


      .messageImg {
        max-width: 120px;
        max-height: 120px;
      }

      .txtBg {
        background: rgba(234, 238, 239);
        padding: 6px 13px;
        border-radius: 8px;

        &::before {
          position: absolute;
          content: "";
          top: 50%;
          margin-top: -10px;
          width: 0;
          height: 0;
          border: 10px solid;
          border-color: transparent transparent #eaeeef;

        }
      }

      .con {
        margin-top: 6px;
        position: relative;
        /* width: fit-content; */
        word-break: break-word;
      }
    }
  }

  .chatRow {
    display: flex;
  }

  .self {
    justify-content: flex-end;

    .time {
      text-align: right;
      ;
    }

    .messageRow {
      flex-direction: row-reverse;
    }

    .info {
      margin-right: 10px;
      align-items: flex-end;

      .txtBg {
        text-align: right;
        &:before {
          right: -16px;
          transform: rotate(90deg);
        }
      }
    }

  }

  .other {
    justify-content: flex-start;

    .time {
      text-align: left;
      ;
    }

    .info {
      margin-left: 10px;

      .txtBg {
        text-align: left;
        &:before {
          left: -16px;
          transform: rotate(-90deg);
        }
      }
    }
  }

  .chatInput {
    padding: 8px 20px;
    background: #e5f4ff;
    display: flex;
    justify-content: space-around;

    .chatInput_left {
      flex: 1;
      display: flex;
      align-items: center;

      .el-input {
        width: 90%;
      }
    }
  }

  .video {
    width: 200px;
    height: 200px;
  }

  .imgMsg {
    max-width: 200px;
    max-height: 150px;
  }

  .divTip {
    font-size: 13px;
    text-align: center;
    margin-top: 30px;
    font-weight: 500;
    color: #999;
    background-color: #eee;
    border-radius: 10px;
    width: 100px;
    padding: 6px 12px;
    display: block;
    margin: 0 auto;

  }

  .liveTopBox {
    height: 300px;
    background-color: black;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .noText {
      text-align: center;
      color: white;
      font-size: 20px;
      height: 300px;
      line-height: 300px;
    }

    .el-carousel,
    .widthSet {
      width: 70%;
      max-height: 280px;
    }

    .el-carousel {
      height: 280px;
    }


    .el-carousel__item {
      img {
        width: 100%;
        height: 100%;
      }
    }

    /deep/ .el-carousel__button {
      display: block;
      opacity: 1;
      width: 8px;
    }

    .pptNum {
      position: absolute;
      z-index: 111;
      font-size: 20px;
      -webkit-transform: translateX(-50%);
      color: white;
      top: 50%;
      transform: translateY(-50%);
      right: 25px;
    }

  }
</style>