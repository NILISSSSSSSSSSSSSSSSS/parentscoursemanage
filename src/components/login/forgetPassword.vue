<template>
  <div>
    <el-dialog :visible.sync='editDialog.isShowEdit' title="重置密码" class="resetPwd" width='450px'
      :close-on-click-modal='false'>
      <el-form :rules='rules' :model="editForm" ref='editForm' inline labelPosition='right' label-width="80px">
        <el-form-item prop="tel" label='帐号' >
          <el-input class="w280"  placeholder="手机号" v-model.trim="editForm.tel" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item prop="code" label='验证码' >
          <el-input class="" placeholder="验证码" v-model.trim="editForm.code">
            <!-- 验证码插件 -->
            <vertify-code v-if="editDialog.isShowEdit" slot="append" :vertifyBox="getBindVertifyUpdate">
            </vertify-code>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label='新密码' >
          <el-input class="w280" type="password" placeholder="密码不少于6位" v-model.trim="editForm.password"
            @keyup.enter.native="submitForm(editForm)"></el-input>
        </el-form-item>
        <div class="login-btn block">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading='isLoading' @click="submitForm('editForm')">提交</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import { resetPassword } from '@/api/home'
  import VertifyCode from "@/components/VertifyCode.vue"
  export default {
    components: {
      VertifyCode,
    },
    props: {
      editDialog: {
        type: Object,
        default: () => { return {} }
      },
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
        editForm: {
          tel: "",
          code: '',
          password: ""
        },
        rules: {
          tel: [
            { required: true, validator: checkPhone, trigger: 'blur' }
          ],
          password: [
            { required: true, validator: checkPassword, trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入验证码',  trigger: 'blur' }
          ]
        },
     
        isLoading: false
      }
    },
    computed: {
      getBindVertifyUpdate() {
        return {
          tel: this.editForm.tel,
          isDisabled: false
        }
      },
    },
    methods: {
      closeDialog() {
        this.$emit('closeMain')
      },
      submitForm() {
        this.$refs['editForm'].validate(valid => {
          if (valid) {
            let param = JSON.parse(JSON.stringify(this.editForm));
            resetPassword(param).then(res => {
              this.isLoading = false
              if (res.code === 200) {
                this.$message.success("重置密码成功");
                this.closeDialog();
              }
            })

          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    mounted() {
    },
    watch: {
      'editDialog.isShowEdit'(val, oldVal) {
        if (val) {
          this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
          this.editForm = {
            tel: "",
            code: '',
            password: ""
          }
        }
      }
    },

  };
</script>
<style scoped>
   /deep/ .el-input {
    width: 250px;
}
</style>