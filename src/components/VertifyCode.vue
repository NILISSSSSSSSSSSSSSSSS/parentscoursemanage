<template>
        <el-button size="small"   @click="getVertifyCode()" :disabled="vertifyBox.isDisabled" ref="code">
            {{ codeText }}
        </el-button>
</template>
<script>
    import { getCode } from '@/api/home'
    export default {
        props: {
            vertifyBox: {
                tel: "",
                isDisabled: false,//时候能点击
            },
        },
        watch: {

        },
        data() {
            return {
                codeText: "发送验证码",
            }
        },
        destroyed() {
            this._countOver();
        },
        methods: {
            destroyed() {
                this._countOver();
            },
            // 验证码相关
            getVertifyCode() {
                console.log(this.vertifyBox.tel)
                if (this.vertifyBox.tel == "" || this.vertifyBox.tel == undefined) {
                    this.$message.error("请输入手机号");
                    return;
                }
                if (!this.$utils.PHONE_REG.test(this.vertifyBox.tel)) {
                    this.$message.error('手机号格式不正确');
                    return false
                }

                let data = {
                    tel: this.vertifyBox.tel,
                };

                console.log(data)
                getCode(data).then(res => {
                    if (res.code === 200) {
                        this.$message.success("验证码发送成功");
                        this._countDown();
                    }
                }).catch((res) => {
                    // this.$message.error(res.msg);
                    this._countOver();
                });

            },
            _countDown(second = 60) {
                window.timmer = setInterval(() => {
                    this.vertifyBox.isDisabled = true;
                    second = second - 1;
                    this.codeText = `重新获取(${second})`;
                    if (second < 1) {
                        this._countOver();
                    }
                }, 1000);
            },
            _countOver() {
                this.vertifyBox.isDisabled = false;
                this.codeText = "获取验证码";
                clearInterval(window.timmer);
            },
        }
    }
</script>
<style scoped>
  .el-button{
      display: inline-block;
  }
  
</style>