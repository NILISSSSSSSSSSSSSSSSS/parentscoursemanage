<template>
  <div>
    <el-dialog :visible.sync='menuObj.isShow' title='编辑任务' width='670px' :close-on-click-modal='false'>
      <el-form :rules='rules' inline :model="editForm" ref='editForm' labelPosition='right' labelWidth='100px'>
        <el-form-item label='任务类型：'>
          每日任务
        </el-form-item>
        <el-form-item label='任务名称：'>
          签到任务
        </el-form-item>
        <el-form-item label='任务说明：'>
          <el-input v-model="editForm.des" size="small"></el-input>
        </el-form-item>
        <el-form-item label='任务数值：'>
          <el-input v-model="editForm.des" size="small"></el-input>
        </el-form-item>
        <el-form-item label='积分奖励值：'>
          <el-input v-model="editForm.des" size="small"></el-input>
        </el-form-item>
        <el-form-item label='显示位置：'>
          <el-radio-group v-model="editForm.chapterStyle">
            <el-radio label="1">h5</el-radio>
            <el-radio label="2">app</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label='任务图标：'>
          <el-upload class="avatar-uploader" action="" accept="image/png, image/jpeg" :before-upload="beforeBgUpload">
            <img v-if="editForm.icon" :src="editForm.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  export default {
    props: {
      menuObj: {
        type: Object,
        default: () => { return {} }
      },
    },
    components: {
    },
    data() {
      return {
        editForm: {

        },
        goodsList: [],
        notEmptyBlur: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        notEmptyChange: [
          { required: true, message: "不能为空", trigger: "change" }
        ],

        rules: {

        }
      };
    },
    methods: {
      beforeBgUpload(file) {
        if (!file.type.includes('image')) {
          this.$message.error('请上传图片');
          return false;
        }
        this.uploadLoading = true;
        this.$uploadFile.checkedFileMD5ByFile(file, data => {
          if (data.url) {
            this.$set(this.editForm, 'icon', data.url);
            this.uploadLoading = false;
          }
        });
        return false;
      },
      save() {
        this.$refs['editForm'].validate(valid => {
          if (valid) {


          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },

      closeDialog() {
        let obj = {
          isShowEdit: false, //是否显示编辑弹框
        }
        this.$emit('closeMain', obj)
      },
      resetForm() {
        this.editForm = {

        };
      },

    },
    mounted() {
    },

    watch: {
      'menuObj.isShow'(val, oldVal) {
        if (val) {
          this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
          this.editForm = JSON.parse(JSON.stringify(this.menuObj.data));
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  .banner-avatar {
    width: 192px;
    height: 108px;
  }
</style>