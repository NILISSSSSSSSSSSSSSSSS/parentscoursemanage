<template>
  <div>
    <el-form :model="form" ref="form" label-width="136px" class="demo-ruleForm">
      <el-form-item label="上传直播banner：">
        <!-- 支持视频，音频,ppt,图片 -->
        <el-upload action="" :limit="1"  :before-upload="(value)=> beforeDocumentUpload('liveCourseBanner', value)">
          <el-button size="small" type="primary" :loading='loadingAll'>点击上传</el-button>
        </el-upload>
        <div v-if="form.liveCourseBanner.name" style="line-height:1.7">
          上传结果: {{form.liveCourseBanner.name }}
        </div>
        <div class="col-danger">支持上传视频(mp4格式),音频(mp3格式),ppt,图片</div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    components: {
    
    },
    props: {
      value: {
        type: Object,
        default: () => { return {} }
      },

    },
    data() {
      return {
        form:{
          liveCourseBanner: {}
        },
        loadingAll:false,
      }
    },
    created() {
    },
    watch: {
      value(res) {
        if (res) {
          this.form.liveCourseBanner = res;
        }
      },

    },
    methods: {
      // 直播banner
      beforeDocumentUpload(way, file) {
        console.log(file);
        if (!(['video/mp4', 'audio/mp3'].includes(file.type) || file.type.includes('image') || file.name.includes('.ppt') || file.name.includes('.pptx'))) {
          this.$message.error('请上传视频(mp4格式)/音频(mp3格式)/ppt/图片格式的文件');
          return false;
        }
        this.loadingAll = true;
        this.$uploadFile.checkedFileMD5ByFile(file, data => {
          if (data.url) {
            console.log(data);
            let info = this.$utils.getFileInfo(file);
            this.$utils.getAudioDuration(data.url).then(duration => {
              let obj = { name: file.name, sourceUrl: data.url, sourceType: info.sourceType, fileSize: Number((file.size / 1024).toFixed(0)), duration: duration };
              const list2 = { 'video': 1, 'audio': 2, 'ppt': 3, 'image': 4 }; // debugger;
              obj.sourceType = list2[obj.sourceType];
              this.form[way] = obj;
              this.loadingAll = false;
              this.$emit('input', this.form[way]);
            })
          }
        });
        return false;
      },



    }
  }

</script>