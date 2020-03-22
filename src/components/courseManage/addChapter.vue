<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-24 09:55:12
 * @LastEditTime: 2019-09-27 10:46:00
 * @LastEditors: Please set LastEditors
 -->
<template>
  <el-dialog :visible.sync='menuObj.isShow' :title='menuObj.isEdit ? "编辑章节":"新增章节"' top="20px" append-to-body
    width="800px">
    <el-form :model="form" :rules="rules" ref="form" label-width="136px" >
      <el-form-item label="章节名称：" prop="name" :rules="notEmptyBlur">
        <el-input size="small" v-model.trim="form.name"></el-input>
      </el-form-item>
     
      <el-form-item label="课程模式：" prop="chapterStyle" :rules="notEmptyChange">
        <el-radio-group v-model="form.chapterStyle" @change="form.courseSourceUuid=form.tryInfoUuid={}">
          <el-radio label="3" :disabled="menuObj.isEdit">视频课</el-radio>
          <el-radio label="2" :disabled="menuObj.isEdit">音频课</el-radio>
          <el-radio label="1" :disabled="menuObj.isEdit">直播课</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop='expertUuid' label='主讲专家：' :rules="notEmptyChange">
          <el-select :remote-method="getExpertList" v-model='form.expertUuid' placeholder='请输入专家名称搜索' filterable remote
            reserve-keyword size='small' clearable>
            <el-option v-for='(itm,index) in expertList' :key='index' :label='itm.name' :value='itm.uuid'>
            </el-option>
          </el-select>
        </el-form-item>
      <!-- 直播课特有字段 -->
      <template v-if="form.chapterStyle=='1'">
        <el-form-item prop='startTime' label="直播时间：" :rules="notEmptyChange">
          <el-date-picker class="w200"  v-model="form.startTime" type="datetime" size='small' :editable='false'
            :picker-options='pickerOptions' ></el-date-picker>
        </el-form-item>
        <el-form-item prop='mc' label='主持人：'>
          <el-select :remote-method="getAllUserMC" v-model='form.mc' placeholder='请输入用户名搜索' filterable remote
            reserve-keyword size='small' clearable>
            <el-option v-for='(itm,index) in mcList' :key='index' :label='itm.nickName' :value='itm.uuid'></el-option>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='嘉宾：'>
          <el-select :remote-method="getAllUser" v-model='form.inviter' size='small' placeholder='请输入用户名搜索' multiple
            filterable remote reserve-keyword clearable>
            <el-option v-for='(itm,index) in inviterList' :key='index' :label='itm.nickName' :value='itm.uuid'>
            </el-option>
          </el-select>
        </el-form-item>
      </template>

      <!-- 
        mode:"课程模式" 视频课，音频课，直播课
        uploadType：上传类型，直接上传还是从课件库选择
       -->
      <add-courseware :mode="mode" labels="上传课件：" v-model="form.courseSourceUuid"></add-courseware>
      <add-courseware :mode="mode" labels="上传试听：" v-model="form.tryInfoUuid" v-if="form.chapterStyle!='1'">
      </add-courseware>
         <!--直播banner 直播特有字段 -->
         <template v-if="form.chapterStyle=='1'">
          <uploadLiveBanner v-model="form.liveCourseBanner"/>
        </template>

      <el-form-item label="上传封面图：" prop="chapterBanner" :rules="notEmptyChange">
        <el-upload class="avatar-uploader" action="" accept="image/png, image/jpeg" :before-upload="beforeBgUpload">
          <img v-if="form.chapterBanner" :src="form.chapterBanner" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="tips">建议最佳尺寸<span class="col-danger">111*111px</span></div>
      </el-form-item>
      <el-form-item label='关键词设置：'>
        <el-tag :key="tag" v-for="tag in form.keywords" closable :disable-transitions="false" class="mr10"
          @close="delKeyWorlds(tag)">
          {{tag}}
        </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
          @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增关键词</el-button>
      </el-form-item>

      <el-form-item label="启用状态：" :rules="notEmptyChange" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="1"> 启用</el-radio>
          <el-radio label="2">停用</el-radio>
          <el-radio label="3">下架</el-radio>
          <el-radio label="4">删除</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" style="text-align:center">
      <el-button type="primary" class="mr10" @click="save('form')" :loading="saveLoding">保存</el-button>
      <el-button type="primary" class="mr10" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { specialList, getAllUserByName, chapterDetail, chapterCreate,chapterUpdate} from '@/api/home'
  import addCourseware from "@/components/courseManage/addCourseware"
  import uploadLiveBanner from "@/components/courseManage/uploadLiveBanner"
  export default {
    components: {
      addCourseware,
      uploadLiveBanner
    },
    props: {
      menuObj: {
        type: Object,
        default: () => { return {} }
      },

    },

    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 1000 * 3600 * 24;
          },
        },
        loadingAll:false,
        saveLoding:false,
        current: "",
        form: {
          liveCourseBanner:{},
          liveCourseUuid:'',
          chapterStyle: "3",
          chapterBanner: "",
          courseSourceUuid: {},
          tryInfoUuid: {},
          keywords: []
        },
        mode: 'video',
        expertList: [],//专家列表
        mcList: [],//主持人列表
        inviterList: [],//嘉宾列表
        inputVisible: false,//是否展示关键词输入框
        inputValue: '',//关键词输入框
        uploadLoading: false,
        notEmptyBlur: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        notEmptyChange: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        rules: {

        },

      };
    },
    created() { },

    methods: {

      //获取专家列表
      getExpertList(e) {
        return new Promise((resolve, reject) => {
          let param = {
            name: e,
            page: 1,
            pageSize: 10000,
            enable:true
          }
          specialList(param).then(res => {
            if (res.code === 200) {
              this.expertList = res.data.results;
              resolve()
            }
            else {
              reject();
            }
          }).catch(err => {
            reject();
          })
        })
      },
      //获取主持人列表
      getAllUserMC(e) {
        return new Promise((resolve, reject) => {
          let param = {
            nickName: e,
            page: 1,
            pageSize: 10000
          }
          getAllUserByName(param).then(res => {
            if (res.code === 200) {
              this.mcList = res.data.results;
              resolve()
            }
            else {
              reject();
            }
          }).catch(err => {
            reject();
          })
        })
      },
      //获取嘉宾
      getAllUser(e) {
        return new Promise((resolve, reject) => {
          let param = {
            nickName: e,
            page: 1,
            pageSize: 10000
          }
          getAllUserByName(param).then(res => {
            if (res.code === 200) {
              this.inviterList = res.data.results;
              resolve()
            }
            else {
              reject();
            }
          }).catch(err => {
            reject();
          })
        })
      },

      closeDialog() {
        let obj = {
          isShowEdit: false, //是否显示编辑弹框
        }
        this.$emit('closeMain', obj)
      },

      resetForm() {
        this.form = {
          liveCourseBanner:{},
          liveCourseUuid:'',
          chapterStyle: "3",
          chapterBanner: "",
          courseSourceUuid: {},
          tryInfoUuid: {},
          keywords: []
        }
        this.mode = 'video';
      },

      save(formName) {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let param = JSON.parse(JSON.stringify(this.form));
            if (!this.form.expertUuid) {
                this.$message.error("必须选择一个主持人"); return;
              }
            if (this.form.chapterStyle == '1') {
              if (!this.form.mc) {
                this.$message.error("必须选择一个专家"); return;
              }
              param.liveCourseBanner = !param.liveCourseBanner.name ? null : param.liveCourseBanner;
              param.liveCourseUuid = param.courseSourceUuid.uuid || null;
              delete param.courseSourceUuid; delete param.tryInfoUuid;
            } else {
              param.courseSourceUuid = param.courseSourceUuid.uuid || null;
              param.tryInfoUuid = param.tryInfoUuid.uuid || null;
              delete param.liveCourseBanner; delete param.liveCourseUuid;
            }
          
            if (this.form.chapterStyle !== '1'){
              if(this.form.courseSourceUuid.length==0){
                this.$message.error("必须上传课件"); return;
              };
              this.form.mc=null;
            }
            if(!this.form.chapterBanner){
              this.$message.error("必须上传封面"); return;
            }
          
            param.startTime =  param.startTime ? this.$utils.formatDate(param.startTime,'yyyy-MM-dd hh:mm:ss') : null;
            param.courseUuid = this.$route.query.courseUuid;
            [param.chapterStyle, param.status] = [+param.chapterStyle, +param.status];

            console.log('参数' + JSON.stringify(param));
            let apiName = null;
            this.menuObj.isEdit ? (apiName = chapterUpdate, param.uuid = this.form.uuid) : apiName = chapterCreate;
            this.saveLoding=true;
            apiName(param).then(res => {
              this.saveLoding=false;
              if (res.code === 200) {
                this.$message.success("成功");
                this.$emit("freshParent");
                this.closeDialog();

              }
            }).catch(res => {
              this.saveLoding=false;
            })


          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },

      //封面上传之前
      beforeBgUpload(file) {
        if (!file.type.includes('image')) {
          this.$message.error('请上传图片');
          return false;
        }
        this.uploadLoading = true;
        this.$uploadFile.checkedFileMD5ByFile(file, data => {
          if (data.url) {
            this.$set(this.form, 'chapterBanner', data.url);
            this.uploadLoading = false;
          }
        });
        return false;
      },

      //删除关键词
      delKeyWorlds(tag) {
        this.form.keywords.splice(this.form.keywords.indexOf(tag), 1);
      },
      //展示关键词输入框
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //关键词输入
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.form.keywords.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
    },
    watch: {
      'menuObj.isShow'(val, oldVal) {
        if (val) {
          this.$refs['form'] ? this.$refs['form'].resetFields() : null;
          if (this.menuObj.isEdit) {
            let newObj=JSON.parse(JSON.stringify(this.menuObj.data));
           this.form=JSON.parse(JSON.stringify(this.menuObj.data));
          
           [ this.form.chapterStyle,  this.form.status] = [ this.form.chapterStyle+'', + this.form.status+''];
           this.expertList= [newObj.experts];//专家列表
           this.$set(this.form,'expertUuid',this.form.experts.uuid);
          //  主持人，嘉宾赋值
          if(this.form.chapterStyle=='1'){
            this.form.courseSourceUuid = newObj.liveCourseUuid;
            this.form.liveCourseBanner = newObj.liveCourseBanner ? newObj.liveCourseBanner : {};
         
            this.mcList=[newObj.mc];//主持人列表
            this.inviterList=newObj.inviter;//嘉宾列表
            [this.form.mc]=[this.form.mc.uuid];
            this.form.inviter=this.form.inviter.map(val=>val.uuid);
          }
          }
          else {
            this.resetForm();
            this.expertList = this.mcList = this.inviterList = [];
          }
        }
      },
      'form.courseSourceUuid':function(val){
        if(val.bannerInfo && JSON.stringify(val.bannerInfo)!=="{}"){
          console.log('赋值');
          this.$set(this.form,'liveCourseBanner',val.bannerInfo)
        }
      },
      //课程形式变化处理
      'form.chapterStyle'(val) {
        if (val == '1') {
          this.mode = 'live'
        } else if (val == '2') {
          this.mode = 'audio'
        } else if (val == '3') {
          this.mode = 'video'
        }
      },

    },
  };
</script>

<style scoped lang="less">
  /deep/ .el-dialog__body {
    max-height: 80vh;
    overflow: auto;
  }

  .operateButton {
    margin: 0 10px 0 7px;
    padding: 9px 12px;
    border: 0px;
  }

  /deep/ .avatar,
  /deep/ .avatar-uploader-icon {
    width: 147px;
    height: 147px;
    line-height: 147px;
  }
</style>