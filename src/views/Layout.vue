<template>
  <div id="app">
    <el-container>
      <el-aside class="box bg-dark tl">
        <div class="home-title">好呗呗爸妈学院后台</div>
        <Sidebar></Sidebar>
      </el-aside>
      <el-container>
        <el-header class="bg-gary">
          <el-row>
            <el-col :span="12">
              <el-breadcrumb separator-class="el-icon-arrow-right" class="el-header">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item}}</el-breadcrumb-item>
              </el-breadcrumb>
            </el-col>
            <el-col :span="12" class="tr header-user">
              <img class="user-avatar mt10 mr10 iblock" :src="userInfo.avatar">
              <div class="iblock tl">
                <div class="mr20">{{userInfo.phone}}</div>
                <div class="mr20">{{userInfo.name}}</div>
              </div>
              <el-dropdown @command="handleCommand" class="top-setting col-blue">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon-setting"></i>
                  设置<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                
                  <el-dropdown-item command="pwd">修改密码 </el-dropdown-item>
                  <el-dropdown-item command="out">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <el-main class="box">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <!-- 更改密码 -->
    <updatePwd :editDialog='editDialog' @closeMain="closeMain" />
  </div>
</template>
<script>
  import { loginOut } from "@/api/home";
  import { routes } from "@/router";
  import updatePwd from '@/components/login/updatePwd'
  import Sidebar from '@/components/menu/Sidebar'
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        userInfo: {},
        breadcrumb: [],
        editDialog: {
          isShowEdit: false, //是否显示修改密码弹框
          data: {}
        },

        routerAlive: true,
      };
    },
    mounted() {
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

      // 用于刷新页面时重新登录
      // window.addEventListener("load", () => {
      //   if (sessionStorage.getItem('userInfo')) {
      //     this.$store.dispatch('loginIm',this.currentUserProfile.userID);
      //   }

      // })
    },
    computed: {
      ...mapState({
        currentUserProfile: state => state.imInfo.currentUserProfile,
        isSDKReady:state => state.imInfo.isSDKReady,
      }),

    },
    watch: {
      $route: {
        handler: function (val, oldVal) {
          if (val.path === '/createCourse' && val.query.uuid) {
            this.breadcrumb = ['课程管理', '编辑课程']
            return
          } else if (val.path === '/createCourse') {
            this.breadcrumb = ['课程管理', '创建课程']
            return
          }
          this.breadcrumb = this.findAllIdsById(val.meta.name, routes).filter(item => item);

        },
        // 深度观察监听
        deep: true,
        immediate: true,
      }
    },
    methods: {
      closeMain() {
        this.editDialog.isShowEdit = false;
      },
      handleSelect(e) {
        this.$router.push({ path: e });
      },
      //退出登录
      loginOutHandle() {
        loginOut().then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg);
            this.$utils.loginOutClear()
          }
        });
      },
      //下拉菜单操作
      handleCommand(a) {
        if (a === 'out') {
          this.loginOutHandle()
        } else if (a === 'pwd') {
          this.editDialog.isShowEdit = true
        }
      },
      //递归获取菜单名
      findAllIdsById(id, arr, path = []) {
        for (let i = 0, l = arr.length; i < l; i++) {
          let _tpath = path.concat();
          _tpath.push(arr[i].meta.name);
          if (id === arr[i].meta.name) {
            return _tpath;
          }
          if ("children" in arr[i]) {
            let res = this.findAllIdsById(id, arr[i].children, _tpath);
            if (res) {
              return res;
            }
          }
        }
      }

    },
    components: {
      updatePwd,
      Sidebar
    },
  };
</script>
<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .el-main {
    height: calc(100vh - 60px);
  }

  .header-user {
    font-size: 14px;
    color: #409eff;
    font-weight: 400;
  }

  .el-menu,
  .el-menu-item,
  .el-menu-item.is-active,
  .el-submenu__title {
    background-color: #1b2733 !important;
  }

  .el-menu-item:hover {
    background-color: #3a4653 !important;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .top-setting {
    vertical-align: text-bottom;
    padding-bottom: 10px;
    cursor: pointer;
  }
</style>