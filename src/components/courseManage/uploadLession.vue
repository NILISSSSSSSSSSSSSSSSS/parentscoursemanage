<template>
  <el-dialog :visible.sync="uploadLessionDia" title="上传课件" append-to-body :width="type=='live' ? '900px' : '600px'" :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="form" label-width="136px" v-loading="uploadLoading">
      <el-form-item label="课件名称：" prop="name" :rules="notEmptyBlur">
        <el-input size="small" v-model.trim="form.name" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="课程类型：" prop="mode" :rules="notEmptyChange">
        <el-radio-group v-model="form.mode" @change="form.fileListClass=form.bannerImg={}">
          <el-radio label="video" :disabled="type!=='video'">视频</el-radio>
          <el-radio label="audio" :disabled="type!=='audio'">音频</el-radio>
          <el-radio label="live" :disabled="type!=='live'">直播课</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 如果是直播，则上传课件内容有很多个 -->
      <el-form-item label="上传课件：" prop="fileListClass" :rules="notEmptyChange">
        <el-upload action="" :limit="12" ref="courseWear"
          :before-upload="(value)=> beforeDocumentUpload('fileListClass', value)" multiple
          :on-remove="(value)=> handleRemovecourseware('fileListClass', value)" :on-exceed="handleExceed"
          :file-list="form.mode!='live' ? form.fileListClass : []">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <span @click="$viewImage(operateImg,'picture')" style="cursor: pointer;">TXT格式文件编辑说明</span>
        <!-- 直播课用表格显示出来 -->
        <template v-if="form.mode=='live' && form.fileListClass.length!==0">
          <el-table :data="form.fileListClass" border stripe class="mt20 mb20">
            <el-table-column prop="name" label="文件名字"></el-table-column>
            <el-table-column label="文件内容">
              <template slot-scope="{ row }">
                  <img :src="row.sourceUrl"  v-if="row.sourceType==3" class="widthSet">
                  <video :src="row.sourceUrl"  v-if="row.sourceType==2" class="widthSet" controls></video>
                  <audio :src="row.sourceUrl"  v-if="row.sourceType==1" class="widthSet" controls></audio>
                  <span v-if="row.sourceType==4" class="widthSet">
                     {{ row.sourceUrl }}
                  </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="170px">
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.$index!=0" @click="changeWeight(scope.$index,scope.$index-1)"><span
                    class="el-icon-top"></span></el-button>
                <el-button type="text" v-if="scope.$index!=form.fileListClass.length-1"
                  @click="changeWeight(scope.$index,scope.$index+1)"><span class="el-icon-bottom"></span></el-button>
                <el-button type="text" class="mt10" size="small" @click="delLiveCoursewar(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="col-danger" v-if="form.mode=='live'">支持上传视频(mp4格式),音频(mp3格式),图片,文本(txt,只支持 UTF 8、16)</div>
     
      </el-form-item>
      <!-- 上传直播banner    支持视频，音频,ppt,图片 -->
      <template v-if="form.mode=='live'">
        <uploadLiveBanner v-model="form.bannerImg" />
      </template>
    </el-form>
    <div class="dialog-footer" style="text-align:center">
      <el-button size="small" type="primary" class="mr10" @click="save('form')" :loading="loadingButton">保存</el-button>
      <el-button size="small" type="primary" class="mr10" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { lessionStoreAdd, liveListAdd } from '@/api/home'
  import uploadLiveBanner from "@/components/courseManage/uploadLiveBanner"
  export default {
    components: {
      uploadLiveBanner
    },
    props: {
      uploadLessionDia: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
    },

    data() {

      return {
        limit: 1,
        current: "",
        form: {
          fileListClass: [],

          bannerImg: {},
        },
        loadingButton: false,
        uploadLoading: false,
        notEmptyBlur: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        notEmptyChange: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        rules: {},
        operateImg:require("../../images/20200103153540.gif")
      };
    },
    created() { },
    watch: {
      uploadLessionDia(val) {
        if (val) {
          this.form = {
            mode: this.type,
            cover: "",
            fileListClass: [],
            bannerImg: {},
          };
        }
      },

    },
    methods: {
      handleClose() {
        this.$refs['form'] ? this.$refs['form'].resetFields() : null;
        this.$emit("update:uploadLessionDia", false);
      },
      // 删除视频音频相关
      handleRemovecourseware(way, file, fileList) {
        console.log(file);
        if (file && file.status === "success") {
          let index = this.form[way].findIndex(val => val.sourceUrl == file.sourceUrl);
          this.form[way].splice(index, 1);
        }
      },
      //删除直播上传课件
      delLiveCoursewar(index) {
        this.form['fileListClass'].splice(index, 1);
      },
      //直播上传课件排序
      changeWeight(index1, index2) {
        let obj = JSON.parse(JSON.stringify(this.form.fileListClass));
        [obj[index1], obj[index2]] = [obj[index2], obj[index1]];
        this.$set(this.form, 'fileListClass', obj);
      },
      beforeDocumentUpload(way, file) {
        console.log(file);
        if (this.form.mode == 'video' && !file.type.includes('mp4')) {
          this.$message.error('请上传视频(MP4格式)的文件');
          return false;
        }
        if (this.form.mode == 'audio' && !file.type.includes('mp3')) {
          this.$message.error('请上传音频(MP3格式)的文件');
          return false;
        }
        if (this.form.mode == 'live') {
          // 如果是直播课课件，支持上传视频,音频,图片,文本
          if (way == 'fileListClass') {
            if (!(['video/mp4', 'audio/mp3'].includes(file.type) || file.type.includes('image') || file.type.includes('text/plain'))) {
              this.$message.error('请上传视频/音频/文本/图片格式的文件');
              return false;
            }
          }
          // 如果是直播课banner，支持上传视频/音频/ppt/图片
          // else {
          //   if (!(['video/mp4', 'audio/mp3'].includes(file.type) || file.type.includes('image') || file.type.includes('application'))) {
          //     this.$message.error('请上传视频(mp4格式)/音频(mp3格式)/ppt/图片格式的文件');
          //     return false;
          //   }
          // }
        }
        this.$uploadFile.checkedFileMD5ByFile(file, data => {
          if (data.url) {
            console.log(data);
            this.uploadLoading = true;
            let info = this.$utils.getFileInfo(file);
            this.$utils.getAudioDuration(data.url).then(duration => {
              let obj = { name: file.name, sourceUrl: data.url, sourceType: '', fileSize: Number((file.size / 1024).toFixed(0)), duration: duration };
              if (this.form.mode !== 'live') {
                const list1 = { 'audio': "2", "video": '1', 'live': "3" };
                obj.sourceType = list1[info.sourceType];
                this.form[way] = [obj];
              }
              else {
                if (way == 'fileListClass') {
                  let list2 = { 'audio': 1, 'video': 2, 'image': 3, 'txt': 4, }
                  obj.sourceType = list2[info.sourceType]; 
                  // 如果是txt文本，则需要解析成文字
                  if(info.sourceType=='txt'){
                    console.log(this.$utils.txtFileFormat(file));
                    this.$utils.txtFileFormat(file).then(res=>{
                       for(let item of res){
                        let cc=JSON.parse(JSON.stringify(obj));
                        cc.name=cc.fileSize=cc.duration=null;cc.sourceUrl=item;
                        this.form[way].push(cc)
                       }
                    });
                  }
                  // 如果是直播课的其他
                  else{
                    this.form[way].push(obj);
                  }
                }
              }
              this.uploadLoading = false;
            })
          }
        });
        return false;
      },
      save(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.form.fileListClass.length == 0) {
              this.$message.error("必须上传课件"); return;
            }
            let apiName = null; let param = null;
            if (this.form.mode !== 'live') {
              apiName = lessionStoreAdd;
              param = {
                ... this.form.fileListClass[0],
              };
              param.name = this.form.name;
            }
            // 如果是直播
            else {
              apiName = liveListAdd;
              let courseList = []; let banner = {};
              for (let item of this.form.fileListClass) {
                courseList.push({ ...item })
              }
              if (this.form.bannerImg && this.form.bannerImg.sourceType) {
                banner = {
                  ...this.form.bannerImg,
                }
              }
              param = {
                name: this.form.name,
                courseList: courseList,
                banner: banner
              }
            }
            console.log(param);
            this.loadingButton = true;
            apiName(param).then(res => {
              this.loadingButton = false;
              if (res.code === 200) {
                this.$message.success("成功");
                this.handleClose();
                this.$emit("freshParent");
              }
            }).catch(res => {
              this.loadingButton = false;
            })
          } else {
            return false;
          }
        });
      },
      handleExceed(files, fileList) {
        this.$message.warning(`最多只能上传一个文件`);
      },
    }
  };
</script>

<style scoped lang="less">
  .el-dialog {
    max-height: 85vh;
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
  .widthSet{
    max-width: 210px;max-height: 210px;
  }
</style>