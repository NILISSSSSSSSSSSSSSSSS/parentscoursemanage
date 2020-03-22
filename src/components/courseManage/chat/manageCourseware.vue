<template>
  <div style="width:560px">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="overflow: hidden;">
        <el-upload action="" :limit="12" ref="courseWear"
          :before-upload="(value)=> beforeDocumentUpload('fileInfo', value)" multiple>
          <el-button size="small" type="primary">添加课件</el-button>
        </el-upload>
      </div>
      <el-table :data="fileListClass" border stripe class="mt20 mb20">
        <el-table-column prop="name" label="文件名字"></el-table-column>
        <el-table-column label="文件大小">
          <template slot-scope="scope">
            {{scope.row.fileSize }}kb
          </template>
        </el-table-column>
        <el-table-column label="时长">
          <template slot-scope="scope">
            <span v-if="scope.row.duration"> {{scope.row.duration  }}s</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170px">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.$index!=0" @click="changeWeight(scope.row,'up')"><span
                class="el-icon-top"></span></el-button>
            <el-button type="text" v-if="scope.$index!=fileListClass.length-1"
            @click="changeWeight(scope.row,'down')"><span class="el-icon-bottom"></span></el-button>
            <el-button type="text" class="mt10" size="small" @click="delLiveCoursewar(scope.row)">删除</el-button>
            <el-button type="text" class="mt10" size="small" @click="send(scope.$index,scope.row)"
              :loading="scope.row.sendLoading">{{ scope.row.txtName}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
    import { mapState } from 'vuex'
  import { addLiveCourse, getLiveCourse, delLiveCourse,changeLiveOrder } from "@/api/home";
  export default {
    data() {
      return {
        fileListClass: [],
       fileInfo:[],
      }
    },
    computed: {
      ...mapState({
        liveDetail: state => state.imInfo.liveDetail,
      }),
    },
    mounted() {
      this.searchList();
    },
    methods: {
      //列表查询gln
      searchList() {
        //获取讨论区列表
        let param = {
          uuid: this.liveDetail.liveRoomId,
        };
        this.loadingAll = true;
        getLiveCourse(param).then(res => {
          this.loadingAll = false;
          console.log("获取到接口的课件列表：" + JSON.stringify(res));
          if (res.code == 200 && res.data.results) {
            let newArr=[];
            for(let item of res.data.results){
              item.txtName='发送';
              newArr.push(item);
            }
            this.fileListClass=newArr;
          } else {
            this.fileListClass=[]
          }
        }).catch(err => {
          this.loadingAll = false;
          this.fileListClass=[]
          this.$message.error(err.msg);
        })
      },
      beforeDocumentUpload(way, file) {
        console.log(file);
        if (!(['video/mp4', 'audio/mp3'].includes(file.type) || file.type.includes('image'))) {
          this.$message.error('请上传视频(mp4格式)/音频(mp3格式)/图片格式的文件');
          return false;
        }

        this.$uploadFile.checkedFileMD5ByFile(file, data => {
          if (data.url) {
            console.log(data);
            this.uploadLoading = true;
            let info = this.$utils.getFileInfo(file);
            this.$utils.getAudioDuration(data.url).then(duration => {
              let ccList = {
                image: 3,
                audio: 1,
                video: 2,
                txt: 4,
              }
              let param = { roomId: this.liveDetail.liveRoomId, name: file.name, sourceUrl: data.url, sourceType: ccList[info.sourceType], fileSize: Number((file.size / 1024).toFixed(0)), duration: duration };
              addLiveCourse(param).then(res => {
                this.uploadLoading = false;
                if (res.code == 200) {
                  this.$message.success("上传成功"); 
                  this.searchList();
                }
              }).catch(err => {
                this.uploadLoading = false;
                this.$message.success(err.msg);
              })
            })
          }
        });
        return false;
      },
      //直播上传课件排序
    // 排序
    changeWeight(row, type) {
        let index = this.fileListClass.findIndex(val => val.uuid == row.uuid);
        let param = { uuid: row.uuid };
        if (type == 'up') {
          param.swapUuid = this.fileListClass[index - 1].uuid;
        }
        else {
          param.swapUuid = this.fileListClass[index + 1].uuid;
        }
        changeLiveOrder(param).then(res => {
          if (res.code === 200) {
            this.$message.success("成功");
            this.searchList();
          }
        })
      },
      //删除直播上传课件
      delLiveCoursewar(row) {
        delLiveCourse({uuid:row.uuid}).then(res=>{
          if(res.code==200){
            this.$message.success("删除成功");
            this.searchList();
          }
        }).catch(err=>{
          this.$message.success(err.msg);
        })
       
      },
      send(index, row) {
        console.log("当前索引：" + index);
        let typeList = {
          3: "img",
          1: "voice",
          2: "video",
          4: "txt",
        }
        this.sendLoading = true;
        this.$set(row, 'sendLoading', true);
        // h5那边需要毫秒显示，这里乘以1000
        this.$store.dispatch('send', { type: typeList[row.sourceType], content: row.url, duration: row.duration }).then(res => {
          this.$set(row, 'sendLoading', false);
          row.txtName = '重新发送';
        }).catch(err => {
          this.$set(row, 'sendLoading', false);
          row.txtName = '重新发送';
        });
      }
    }
  }
</script>
<style scoped lang="less">
  .listInfo {
    .listItem {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;

      padding: 10px 0;

      .documentInfo {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;

        img {
          width: 40px;
          height: 40px;
        }
      }

    }

    .listItem:not(:last-child) {
      border-bottom: 1px solid gainsboro;
    }


  }

  /deep/ .el-card__body {
    padding: 5px 10px;

  }
</style>