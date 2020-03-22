<template>
  <div>
    <el-dialog :visible.sync='editData.isShow' :title='editData.isEdit ? "编辑购买须知":"新增购买须知"' width='500px'
      :before-close="closeDialog" :close-on-click-modal='false'>
      <el-form :model="editForm" ref='editForm' labelPosition='right' labelWidth='100px'>
        <el-form-item prop='name' label='模板名称' :rules="notEmptyBlur">
          <el-input v-model.trim='editForm.name' placeholder='模板名称' size='small' clearable></el-input>
        </el-form-item>
        <el-form-item label='课程类型' prop="mustReadType" :disabled="editData.isEdit" :rules="notEmptyChange">
          <el-select size="small" v-model.number='editForm.mustReadType' clearable :disabled="editData.isEdit">
            <el-option v-for='(itm,index) in courseTypeList' :key='index' :value='itm.value' :label='itm.label'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='购买说明' prop="content" :rules="notEmptyBlur">
          <el-input v-model.trim='editForm.content' type='textarea' :rows='5' placeholder='购买说明' size='small' clearable>
          </el-input>
        </el-form-item>
      </el-form>
      <el-row class="tc">
        <el-button type="primary" @click="saveBtn()">确 定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import { purchaseInstructAdd, purchaseInstructEdiet} from '@/api/home.js'
  export default {
    props: {
      editData: {
        type: Object,
        default: () => { return {} }
      },
    },
    components: {
    },
    data() {
      return {
        courseTypeList: require('@/config').courseTypeList,
        editForm: {
        
        },
        notEmptyBlur: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        notEmptyChange: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
      };
    },
    methods: {
      saveBtn() {
        this.$refs['editForm'].validate(valid => {
          if (valid) {
            let param = {
              name: this.editForm.name,
              content: this.editForm.content,
              mustReadType:this.editForm.mustReadType
            }
            let apiName = null;
            this.editData.isEdit ? (apiName = purchaseInstructEdiet, param.uuid = this.editData.data.uuid) : apiName = purchaseInstructAdd;
            apiName(param).then(res => {
              if (res.code === 200) {
                this.closeDialog();
                this.$message.success("成功");
              
                this.$emit("freshParent");
              }
            }).catch(res => {

            })
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      closeDialog() {
        this.$refs['editForm'].resetFields();
        let obj = {
          isShowEdit: false, //是否显示编辑弹框
        }
        this.$emit('closeMain', obj)
      },
    },
    watch: {
      'editData.isShow'(val, oldVal) {
        if (val) {
          this.$refs['editForm'] ? this.$refs['editForm'].resetFields() : null;
          if (this.editData.isEdit) {
            this.editForm=JSON.parse(JSON.stringify(this.editData.data));
            this.editForm.mustReadType=this.editForm.mustReadType;
          }
          else {
            this.editForm = {
              name: '',
              content: '',
              mustReadType:''
            }
          }
        }
      }

    }
  };
</script>
<style lang="less" scoped>
  .el-input,
  .el-textarea {
    width: 100%;
  }
</style>