<template>
  <div style="width:1200px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button icon="el-icon-back" type="primary" size="small" @click="$router.go(-1)">
          {{ type=='course' ? ' 返回课程列表' : '返回章节列表'}}
        </el-button>
        <el-form inline class="fr">
          <el-form-item label="切换发言身份" v-if="liveDetail.updateStatus==5">
            <el-select class="ml10" v-model='roleLive' size='small' clearable @change="changeRole">
              <el-option label='专家' value='expert'></el-option>
              <el-option label='主持人' value='compere'></el-option>
              <el-option label='普通用户' value='normal'></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="6">
            课程名称：{{ liveDetail.name}}
          </el-col>
          <el-col :span="6" v-if="liveDetail.experts">
            主讲专家：{{ liveDetail.experts.name}}
          </el-col>
          <el-col :span="6">
            直播时间：{{ liveDetail.startTime | formatDate}}
          </el-col>
          <el-col :span="6">
            
            <el-button v-if="liveDetail.updateStatus=='6'" icon="el-icon-info" type="primary" size="small"
              class="fl mr10" @click="changeLive(1)">开始直播
            </el-button>
            <el-button v-if="liveDetail.updateStatus=='5'" icon="el-icon-info" type="primary" size="small" class="fl"
              @click="changeLive(0)">结束直播
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <div class="mt20 liveBody">
      <!-- 聊天 -->
      <chat></chat>
      <component :is="componentsName"></component>

    </div>
  </div>
</template>
<script>
  import chat from "@/components/courseManage/chat/chat.vue";
  import waistCoat from "@/components/courseManage/chat/waistCoat.vue";
  import manageCourseware from "@/components/courseManage/chat/manageCourseware.vue";
  import { startLive, endLive, getCourseDetail, chapterDetail } from "@/api/home";
  import { mapState } from 'vuex'
  export default {
    components: {
      chat,
      waistCoat,
      manageCourseware
    },
    watch: {

    },
    computed: {
      ...mapState({
        liveDetail: state => state.imInfo.liveDetail,
        isSDKReady: state => state.imInfo.isSDKReady,
        role: state => state.imInfo.role,
        currentUserProfile: state => state.imInfo.currentUserProfile,
      }),
    },
    data() {
      return {
        form: {},
        rules: {},
        // 后台身份：1.专家  可以添加课件    2.主持人：马甲功能     3.普通用户：只能聊天
        componentsName: "",
        roleLive: "normal",
        type: ""
      }
    },
    mounted() {
      this.type = this.$route.query.type;
      // 刷新页面时重置一些信息
      this.$store.commit('resetIm');
      this.getLiveDetail();
    },
    beforeDestroy: function () {
      $vm.$store.dispatch('logoutIm');
    },
    methods: {
      // 能够进入专家直播间
      canGoExpert(val) {
        this.componentsName = 'manageCourseware';
        this.$store.commit('setRole', val);
        this.$store.dispatch('changeIdUpdateInfo');
      },
      //  切换角色
      changeRole(val) {
        let that = this;
        if (['normal', 'compere'].includes(val)) {
          this.componentsName = val == 'normal' ? '' : 'waistCoat';
          this.$store.commit('setRole', val);
          // 更新当前用户im信息
          this.$store.dispatch('changeIdUpdateInfo');
        }
        else if (val == 'expert') {
          //查询h5端直播间是否有专家
          this.$store.dispatch('hasExpert').then(res => {
            // 如果专家在线
            if (res.status == 'Online') {
              this.$confirm('当前直播间已有专家在线，是否继续进入并以专家身份同时使用？', '提示', {
                confirmButtonText: '进入',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 如果允许进入专家直播间
                this.canGoExpert(val)
              }).catch(() => {
                // 如果不允许
                that.roleLive = that.role;
                that.componentsName = that.role == 'normal' ? '' : that.role == 'compere' ? 'waistCoat' : 'manageCourseware';
              })
            }
            // 如果其他端专家不在线，允许进入专家页面
            else {
             this.canGoExpert(val)
            }

          }).catch(err => {
            this.roleLive = this.role;
            this.componentsName = this.role == 'normal' ? '' : this.role == 'compere' ? 'waistCoat' : 'manageCourseware';
          });
        }
      },
      aboutLive(objDetail) {
        let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        if (objDetail.updateStatus == 5) {
          //登录im
          this.$store.dispatch('loginIm', userInfo.uuid);
        }
        if (objDetail.updateStatus == 4) {
          this.$store.dispatch('getJieKouMessageList', objDetail.liveRoomId);
        }
        if (objDetail.updateStatus == 6) {
          this.$store.commit('setCurrentMessageList', []);
          this.$store.state.imInfo.loadingChat = false;
        }
      },
      getLiveDetail() {
        this.$store.state.imInfo.loadingChat = true;
        let apiName = this.type == 'course' ? getCourseDetail : chapterDetail;
        apiName({ uuid: this.$route.query.uuid }).then(res => {
          if (res.code === 200) {
            console.log("直播课详情" + JSON.stringify(res.data));
            this.$store.commit('setLiveDetail', res.data);
            let objDetail = res.data;
            this.aboutLive(objDetail);
          }
          else {
            this.$store.commit('setLiveDetail', {});
            this.$store.state.imInfo.loadingChat = false;
          }
        }).catch(err => {
          this.$store.commit('setLiveDetail', {});
          this.$store.state.imInfo.loadingChat = false;
        })
      },
      changeLive(type) {
        let apiName = !!type ? startLive : endLive;
        apiName({ liveRoomId: this.liveDetail.liveRoomId }).then(res => {
          if (res.code == 200) {
            this.$message.success("成功");
            this.getLiveDetail();
          }
        }).catch(err => {

        })
      }
    },
  }
</script>
<style scoped lang="less">
  .liveBody {
    display: flex;
    justify-content: space-between;
  }
</style>