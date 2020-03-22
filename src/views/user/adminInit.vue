<template>
    <div class="hederclass pr">
      <div class="login-bg pa"></div>
      <div class="title tc pa">
        好呗呗爸妈学院后台
        <div class="ft20 mt10">添加超级管理员</div>
      </div>
      <div class="loginFromClass pa" >
        <el-form :model="loginForm"  :rules="rules" ref="loginForm" labelPosition='right' label-width="80px" class="demo-ruleForm">
          <el-form-item prop="nickName" label='　用户名'>
            <el-input placeholder="用户名" v-model.trim="loginForm.nickName"></el-input>
          </el-form-item>
          <el-form-item prop="tel" label='　手机号'>
            <el-input placeholder="手机号" v-model.trim="loginForm.tel" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item  prop="code" label='　验证码'>
            <el-input placeholder="验证码" v-model.trim="loginForm.code">
                  <!-- 验证码插件 -->
                  <vertify-code  slot="append" :vertifyBox="getBindVertify">
                    </vertify-code>
            </el-input>
          </el-form-item>
          <el-form-item  prop="password" label='初始密码'>
            <el-input type="password" placeholder="密码不少于6位" v-model.trim="loginForm.password" @keyup.enter.native="submitForm(loginForm)"></el-input>
          </el-form-item>
          <div class="login-btn block">
            <el-button class="w190" type="primary" :loading='isLoading' @click="submitForm('loginForm')">提交</el-button>
          </div>
        </el-form>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import { addSuperAdmin} from '@/api/home'
import VertifyCode from "@/components/VertifyCode.vue"
export default {
  data () {
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
      loginForm: {
        nickName:'',
        tel: '',
        password: '',
        code:''
      },
      isLoading:false,
      rules: {
        nickName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        tel: [
          { required: true,validator: checkPhone,trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { required: true,validator: checkPassword, trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
      //获取验证码
      getBindVertify() {
                return {
                    tel: this.loginForm.tel,
                    isDisabled:false
                }
            },
  },
  methods: {
    //登录
    submitForm (loginForm) {
      this.$refs['loginForm'].validate((valid) => {
        if(valid){
          //帐号密码登录
          let param = JSON.parse(JSON.stringify(this.loginForm));
          this.isLoading = true;
          addSuperAdmin(param).then(res => {
            this.isLoading = false
              if(res.code === 200){
                this.$message.success(res.msg);
                this.$router.push({ path: "/login" });
              }
          }).catch(res => {
            this.isLoading = false
            if(res.code==400){
              this.$router.push({ path: "/login" });
            }
           
          })
        }else{
          return false
        }
      })
     
    },
    

  },
  created(){
    
  },
  components:{
    VertifyCode
  }
}
</script>

<style>
  .mr10{margin-right: 10px;}
  .w217{width: 217px!important;}
  .login-bg{
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
    padding:50px 20px 20px 20px;
    border-radius: 10px;
    top: 30%;
    left: 50%;
    margin-left: -200px;
    background: rgba(255,255,255,0.3);
  }
  .title {
    top: 20%;
    left:50%;
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
  .login-btn{
     text-align: center;
   }
</style>
