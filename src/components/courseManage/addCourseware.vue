<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-26 14:19:34
 * @LastEditTime: 2019-09-26 14:19:34
 * @LastEditors: your name
 -->

<template>
  <div>
    
    <el-form :model="form" ref="form" :label-width="labelWidth" class="demo-ruleForm">
      <el-form-item :label="labels" :class="labels.includes('上传课件') ? 'formRedStar left40' : ''">
        <el-tabs v-model="activeName" @tab-click="$emit('input', {});$emit('getUploadType',activeName )">
          <!-- 只有视频课，音频课才有直接上传功能 -->
          <el-tab-pane label="从课件库选择" name="fromCourseware">
              <el-button size="small" type="primary" @click="chooseCourseware">点击上传</el-button>
            </el-tab-pane>
          <el-tab-pane label="直接上传" name="direceUpload" v-if="mode!=='live'">
            <el-upload action="" :limit="1" :on-exceed="handleExceed" :before-upload="beforeDocumentUpload"
              :on-remove="handleRemovecourseware">
              <el-button size="small" type="primary" :loading="loadingButton">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
        
          <div v-if="fileListClass && fileListClass.name" style="line-height:1.7">
            上传结果: {{fileListClass.name }} 
          </div>
          <template>
            <div class="tips" v-if="mode=='live'">可上传音频(mp3)、视频(mp4)、图片、文本(txt) </div>
            <div class="tips" v-if="mode=='video'">可上传视频(mp4)</div>
            <div class="tips" v-if="mode=='audio'">可上传音频(mp3)</div>
          </template>
        </el-tabs>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-dialog title="选择课件" :visible.sync="dialogFormVisible" id="chooseMask" append-to-body :before-close="close">
      <lession-storeManageAll @tellPar="tellPar" :componentObj="componentObj">
      </lession-storeManageAll>
      <div class="tc mt20">
        <el-button type="primary" @click="save" size="small">确定</el-button>
        <el-button type="primary" @click="close" size="small">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import lessionStoreManageAll from "@/views/courseManage/lessionStoreManageAll.vue"
  import { lessionStoreAdd } from '@/api/home'
  export default {
    components: {
      lessionStoreManageAll
    },
    props: {
      labelWidth: {
        type: String,
        default: '130px'
      },
      labels: {
        type: String,
        default: '添加课件：'
      },
      value: {
        type: Object,
        default: () => { return {} }
      },
      // mode:上课模式
      mode: {
        type: String,
        default: 'video'
      },
      /**
      * @param uploadType上课模式：direceUpload 直接上传；fromCourseware：从课件库上传
      */

      uploadType: {
        type: String,
        default: 'fromCourseware'
      },
    },
    data() {
      return {
        activeName: this.uploadType,
        form: {},
        fileListClass: this.value,
        dialogFormVisible: false,
        isSelect: true,
        selectData: [],
        componentObj: {
          isSelect: true,
          mode: this.mode,
          dialogFormVisible: this.dialogFormVisible
        },
     
        loadingButton: false,

      }
    },
    created() {
    },
    watch: {
      value(res) {
        if (res) {
          this.fileListClass = res;
        }
      },
      mode(val) {
        this.componentObj.mode = val;
      },
      dialogFormVisible(val) {
        this.componentObj.dialogFormVisible = val;
      }
    },
    methods: {

      close() {
        this.dialogFormVisible = false;
      },
      save() {
        if (this.selectData.length > 1) {
          this.$message.error("最多只能选择一个"); return;
        }
        if (this.selectData.length < 1) {
          this.$message.error("必须选择一个"); return;
        }
        this.dialogFormVisible = false;
         let bannerInfo=this.selectData[0].bannerInfo ? this.selectData[0].bannerInfo : {};
        this.fileListClass ={uuid:this.selectData[0].uuid,name:this.selectData[0].name,sourceUrl:this.selectData[0].sourceUrl,bannerInfo:bannerInfo};
        this.$emit('input', this.fileListClass);
        this.dialogFormVisible = false;
      },
      tellPar(obj) {
        this.selectData = obj;
      },
      chooseCourseware() {
        this.isSelect = true;
        this.dialogFormVisible = true;
      },
      handleRemovecourseware(file, fileList) {
        this.fileListClass ={};
        this.$emit('input', this.fileListClass);
      },
      checkType(ctype) {
        if (this.mode == 'video' && !ctype.includes('mp4')) {
          this.$message.error('请上传视频(MP4格式)的文件');
          return false;
        }
        if (this.mode == 'audio' && !ctype.includes('mp3')) {
          this.$message.error('请上传音频(MP3格式)的文件');
          return false;
        }
        return true;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`最多只能上传一个文件`);
      },

      //直接上传 课件和试听上传之前
      beforeDocumentUpload(file, type) {
        console.log(file);
        if (this.checkType(file.type)) {
          this.loadingButton = true;
          this.$uploadFile.checkedFileMD5ByFile(file, data => {
            if (data.url) {
              const sourceList = { 'audio': "2", "video": '1' };
              let info = this.$utils.getFileInfo(file);
              let param = {
                  name: file.name,
                  sourceUrl: data.url,
                  fileSize: Number((file.size / 1024).toFixed(0)),
                  sourceType: sourceList[info.sourceType],
                };
              this.$utils.getAudioDuration(data.url).then(duration => {
                param.duration=duration;
                lessionStoreAdd(param).then(res => {
                  this.loadingButton = false;
                  if (res.code === 200) {
                    this.fileListClass = {name:res.data.name,uuid:res.data.uuid,sourceUrl:res.data.sourceUrl};
                    this.$emit('input', this.fileListClass);
                  }
                }).catch(res => {
                  this.loadingButton = false;
                })
              })
            }
          });
        };
        return false;
      },

    }
  }
</script>

<style scoped lang="less">
  .tips {
    color: #F56C6C;
  }

  /deep/ .el-tabs__content {

    /* padding-left: 32px; */
  }

  /deep/ .el-tabs__header {

    margin: 0 0 0px;
  }
</style>