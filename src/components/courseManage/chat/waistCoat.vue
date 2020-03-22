<template>
  <div class="waitCoat mr20">
    <el-card class="box-card" style="width:540px;">
      <div slot="header" class="clearfix">
        <span>马甲用户</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="creatWaistCoat">创建</el-button>
      </div>

      <div class="text item">
        <el-form :model="form" :rules="rules" ref="form" label-width="136px">
          <el-form-item label="发送用户" prop="nickName" :rules="notEmptyBlur">
            <div>
              <el-input style="width:130px" v-model="form.nickName"></el-input>
              <el-button type="primary" size="small" class="ml10" @click="random">随机马甲用户</el-button>
              <el-button type="primary" size="small" @click="chooseDia=true">选择马甲用户</el-button>
            </div>
            <img :src="form.avatar" alt="" class="avater" v-if="form.avatar">
          </el-form-item>
          <el-form-item label="消息" prop="content" :rules="notEmptyBlur">
            <el-input type="textarea" rows='5' v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="是否提问">
            <el-checkbox v-model="form.checked"></el-checkbox>
          </el-form-item>
          <div class="tc">
            <el-button type="primary" @click="send" :loading="sendLoading">发送</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
    <!-- 创建马甲用户 -->
    <el-dialog title="创建马甲用户" :visible.sync="creatForm.creatDia" width="30%" :before-close="handleCloseCreat">
      <el-form :model="creatForm" :rules="creatrules" ref="creatForm" label-width="136px">
        <el-form-item label="上传头像：" :rules="notEmptyChange" prop="avatar">

          <el-upload class="avatar-uploader" action="" accept="image/png, image/jpeg" :before-upload="beforeBgUpload">
            <img v-if="creatForm.avatar" :src="creatForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户昵称" :rules="notEmptyBlur" prop="nickName">
          <el-input v-model="creatForm.nickName" rows='5'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseCreat">取 消</el-button>
        <el-button type="primary" @click="creat">保存</el-button>
      </span>
    </el-dialog>
    <!-- 选择马甲用户弹框 -->
    <choose-waistCoat :chooseDia.sync="chooseDia" @tellPar="tellPar" :chooseData="chooseData"></choose-waistCoat>
  </div>
</template>
<script>
  import { newMaJia, randomMaJia } from "@/api/home";
  import chooseWaistCoat from "@/components/courseManage/chat/chooseWaistCoat.vue"
  export default {
    components: {
      chooseWaistCoat
    },
    data() {
      return {
        form: {
          checked: false
        },
        rules: {},

        creatForm: {
          creatDia: false,
          avatar: ""
        },
        creatrules: {},
        // 选择随机用户相关
        chooseData: {

        },
        notEmptyBlur: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        notEmptyChange: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        sendLoading:false,
        chooseDia: false,
      }
    },
    methods: {
      send() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (!this.form.uuid) {
              this.$message.error("请先选择一个马甲用户"); return;
            }
            let avatar = this.form.avatar;
            let nickName = this.form.nickName;
            let uuid = this.form.uuid;

            //发送,马甲用户不需要切换身份
            this.sendLoading=true;
            this.$store.dispatch('send', { type: "txt", content: this.form.content, duration: 0, maJia: true, avatar: avatar, username: nickName, from_uid: uuid, checked: this.form.checked }).then(res=>{
              this.sendLoading=false;
            }).catch(err=>{
              this.sendLoading=false;
            });
          } else {
            return false;
          }
        });
      },
      handleCloseCreat() {
        this.creatForm.creatDia = false;
      },
      //随机马甲
      random() {
        randomMaJia({}).then(res => {
          if (res.code === 200) {
            this.$message.success("成功");
            this.form = JSON.parse(JSON.stringify(res.data[0]));
          }
        }).catch(res => {

        })
      },
      creatWaistCoat() {
        this.creatForm = {
          creatDia: true,
          avatar: "",

        }
      },
      //头上传之前
      beforeBgUpload(file) {
        if (!file.type.includes('image')) {
          this.$message.error('请上传图片');
          return false;
        }

        this.uploadLoading = true;
        this.$uploadFile.checkedFileMD5ByFile(file, data => {
          if (data.url) {
            console.log(this.creatForm);
            this.$set(this.creatForm, "avatar", data.url);
            this.uploadLoading = false;
          }
        });
        return false;
      },
      tellPar(val) {
        this.form = val;
      },
      //创建马甲用户
      creat() {
        this.$refs['creatForm'].validate(valid => {
          if (valid) {
            let param = {
              nickName: this.creatForm.nickName,
              avatar: this.creatForm.avatar,
            }
            newMaJia(param).then(res => {
              if (res.code === 200) {
                this.$message.success("成功");
                this.creatForm.creatDia = false;
              }
            }).catch(res => {

            })
          } else {
            return false;
          }
        });
      },
      // beforeUploadImg(file) {
      //   if (!file.type.includes('image')) {
      //     this.$message.error('请上传图片');
      //     return false;
      //   }
      //   this.uploadLoading = true;
      //   this.$uploadFile.checkedFileMD5ByFile(file, data => {
      //     if (data.url) {
      //       console.log(data.url)
      //     }
      //   });
      //   return false;
      // }
    }
  }
</script>
<style scoped lang="less">
  .waitCoat {
    height: 460px;
  }

  .avater {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-top: 20px;
  }
</style>