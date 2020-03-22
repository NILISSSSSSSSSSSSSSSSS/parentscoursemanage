<template>
  <div>
    <el-dialog :visible.sync='editDialog.isShowEdit' title="修改密码" class="resetPwd" width='450px'
      :close-on-click-modal='false'>
      <el-form :rules='rules' :model="editForm" ref='editForm' inline labelPosition='right' label-width="80px">
        <el-form-item  label='帐号'>
          {{  phone }}
        </el-form-item>
        <el-form-item prop="password" label='原密码' :rules="notEmptyBlur">
          <el-input class="w280" type="password" placeholder="密码不少于6位" v-model.trim="editForm.password"
            @keyup.enter.native="submitForm(editForm)"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label='新密码' :rules="notEmptyBlur">
          <el-input class="w280" type="password" placeholder="密码不少于6位" v-model.trim="editForm.newPassword"
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
  import { updatePassword } from '@/api/home'
  export default {
    props: {
      editDialog: {
        type: Object,
        default: () => { return {} }
      },
    },
    data() {
      return {
        editForm: {
          password: '',
          newPassword: ""
        },
        rules: {},
        notEmptyBlur: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        isLoading: false,
        phone:""
      }
    },
    methods: {
      closeDialog() {
        this.$emit('closeMain')
      },
      submitForm() {
        this.$refs['editForm'].validate(valid => {
          if (valid) {
            let param = JSON.parse(JSON.stringify(this.editForm));
            updatePassword(param).then(res => {
              this.isLoading = false
              if (res.code === 200) {
                this.$alert('密码修改成功，请重新登录！', {
                  confirmButtonText: '确定',
                  showClose: false,
                  callback: action => {
                    this.$utils.loginOutClear()
                  }
                });
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
      this.phone=sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')).phone : '';
    },
    watch: {
      'editDialog.isShowEdit'(val, oldVal) {
        if (val) {
          this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
          this.editForm = {
            password: '',
            newPassword: ""
          }
        }
      }
    },
    
  };
</script>
<style>

</style>