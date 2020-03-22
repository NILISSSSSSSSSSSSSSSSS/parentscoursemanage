<template>
  <div class="hederclass pr">
    <div class="login-bg pa"></div>
    <div class="title tc pa">好呗呗爸妈学院后台</div>
    <!-- 登录 -->
    <div class="loginFromClass pa">
      <el-form :model="loginForm"  :rules="rules" ref="loginForm" labelPosition='right' label-width="80px"
        class="demo-ruleForm">
        <el-form-item prop="phone" label='帐号'>
          <el-input placeholder="手机号" v-model.trim="loginForm.phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item v-if='!isPwdLogin' class="item-btm-10" prop="code" label='验证码'>
          <el-input class=" mr10" placeholder="验证码" v-model.trim="loginForm.code">
            <!-- 验证码插件 -->
            <vertify-code slot="append" :vertifyBox="getBindVertifyLogin">
            </vertify-code>
          </el-input>
        </el-form-item>
        <el-form-item v-if='isPwdLogin' class="item-btm-10" prop="password" label='密码'>
          <el-input type="password" placeholder="密码不少于6位" v-model.trim="loginForm.password"
            @keyup.enter.native="submitForm(loginForm)"></el-input>
        </el-form-item>
        <el-row class="mb20">
          <el-col :span='12' class="tc">
            <el-button @click='editDialog.isShowEdit = true' type='text' size='small'>忘记密码</el-button>
          </el-col>
          <el-col :span='12' class="tr">
            <el-button @click='isPwdLogin=!isPwdLogin' type='text' size='small'>{{isPwdLogin ? '手机验证码登录' :'账号密码登录'}}
            </el-button>
          </el-col>
        </el-row>
        <div class="login-btn block">
          <el-button type="primary" :loading='isLoading' @click="submitForm('loginForm')">登录</el-button>
        </div>
      </el-form>
    </div>
    <!-- 忘记密码 -->
    <forgetPassword :editDialog='editDialog' @closeMain="closeMain" />
  </div>
</template>

<script>
  import axios from 'axios'
  import { hasSuperAdmin, login } from '@/api/home'
  import VertifyCode from "@/components/VertifyCode.vue"
  import forgetPassword from "@/components/login/forgetPassword.vue"
  export default {
    components: {
      VertifyCode,
      forgetPassword
    },
    data() {
      const checkPhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入手机号"));
        }
        if (!this.$utils.PHONE_REG.test(value)) {
          callback(new Error("手机号格式不正确"));
        }
        callback();
      };
      const checkPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入密码"));
        }
        if (value.length < 6) {
          callback(new Error("密码不少于6位数"));
        }
        callback();
      };

      return {
        editDialog: {
          isShowEdit: false, //是否显示修改密码弹框
          data: {}
        },
        loginForm: {
          phone: '',
          password: '',
          code: ''
        },
        isPwdLogin: true,// true 密码登录 false 验证码登录
        isLoading: false,
        rules: {
          phone: [
            { required: true, validator: checkPhone, trigger: 'blur' }
          ],
          password: [
            { required: true, validator: checkPassword, trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        },
      }
    },
    computed: {
      getBindVertifyLogin() {
        return {
          tel: this.loginForm.phone,
          isDisabled: false
        }
      },

    },
    mounted() {
      //判断是否跳转到超级管理员界面
      hasSuperAdmin({}).then(res => {
        if (res.code === 200) {
          if (res.data.initAdmin == 2)
            this.$router.push({ path: "/adminInit" });
        }
      })
    },
    methods: {
      //登录
      submitForm(loginForm) {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            let param = {
              tel: this.loginForm.phone,    // 登录账号
            }
            if (this.isPwdLogin) {
              [param.loginType, param.password] = ['pwd', this.loginForm.password];

            } else {
              [param.loginType, param.code] = ['phone', this.loginForm.code];
            }
            this.isLoading = true;
            login(param).then(res => {
              this.isLoading = false
              if (res.code === 200) {
                if (res.data.managerStatus === 1) {
                 
                 
                  let info = {
                    name: res.data.nickName || '',
                    phone: res.data.tel,
                    avatar: res.data.avatar || '',
                    uuid: res.data.uuid,
                    token: res.data.token
                  }
                  sessionStorage.setItem('userInfo', JSON.stringify(info));
                  

                  this.$router.push({ path: '/' });
                }
              } else {
                this.$message.error('用户名或密码错误~')
              }
            }).catch(res => {
              this.isLoading = false;
              // this.$message.error(res.msg);
            })

          } else {
            return false
          }
        })
      },
      //校验权限
      // checkUserRole() {
      //   let token = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).token : '';
      //   if (token) {
      //     checkRole().then(res => {
      //       if (res.code === 200) {
      //         if (res.data.managerStatus === 1) {
      //           let info = {
      //             name: res.data.nickName || '',
      //             phone: res.data.tel,
      //             avatar: res.data.avatar,
      //             uuid: res.data.uuid
      //           }
      //           sessionStorage.setItem('userInfo', JSON.stringify(info))
      //           this.$router.push({ path: '/' })
      //         }
      //       } else {
      //         this.$message.warning('暂无权限登录管理系统~')
      //       }
      //     });
      //   }
      // },
      closeMain() {
        this.editDialog.isShowEdit = false;
      },


    },
    created() {

    }
  }
</script>

<style scoped>
  /deep/ .el-input {
    width: 250px;
}
  .mr10 {
    margin-right: 10px;
  }

  .w217 {
    width: 217px !important;
  }

  .login-bg {
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: url('../../images/bg.jpeg') no-repeat center;
    background-size: cover;
    filter: blur(3px);
  }

  .loginFromClass {
    width: 360px;
    padding: 50px 20px 20px 20px;
    border-radius: 10px;
    top: 30%;
    left: 50%;
    margin-left: -200px;
    background: rgba(255, 255, 255, 0.3);
  }

  .title {
    top: 20%;
    left: 50%;
    width: 420px;
    margin: 0 0 50px -210px;
    color: #fff;
    font-size: 28px;
  }

  .hederclass {
    -webkit-background-size: cover;
    -o-background-size: cover;
    width: 100%;
    height: 100vh;
  }

  .login-btn {
    text-align: center;
  }

  .item-btm-10.el-form-item {
    margin-bottom: 10px;
  }

  .resetPwd {
    margin-top: 10vh;
  }
</style>