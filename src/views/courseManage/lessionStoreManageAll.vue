<template>
  <div class="all-user pr">
    <el-tabs v-model="activeName">
      <el-tab-pane label="视频" name="video" :disabled="!['video'].includes(componentObj.mode) && componentObj.isSelect">
        <lession-storeManage type="video" :isSelect="componentObj.isSelect" @selectSuccess="selectSuccess">
        </lession-storeManage>
      </el-tab-pane>
      <el-tab-pane label="音频" name="audio" :disabled="!['audio'].includes(componentObj.mode) && componentObj.isSelect">
        <lession-storeManage type="audio" :isSelect="componentObj.isSelect" @selectSuccess="selectSuccess">
        </lession-storeManage>
      </el-tab-pane>
      <el-tab-pane label="直播课" name="live" :disabled="!['live'].includes(componentObj.mode) && componentObj.isSelect">
        <lession-storeManage type="live" :isSelect="componentObj.isSelect" @selectSuccess="selectSuccess">
        </lession-storeManage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import lessionStoreManage from '@/components/courseManage/lessionStoreManage';
  export default {
    components: {
      lessionStoreManage,
    },
    props: {
      // 单独做为一个页面时，isSelect为false,mode为live, 若是做为组件使用,则需要从外面传值
      componentObj: {
        type: Object,
        default: () => {
          return {
            isSelect: false,
            mode: "live", 
            dialogFormVisible:false
          }
        }
      }
    },
    mounted() {
      this.activeName=this.componentObj.mode ;
    },
    watch: {
      'componentObj.dialogFormVisible'(val){
        if(val){
          this.activeName=this.componentObj.mode ;
        }
        else{
          this.activeName="video";
        }     
      }
    },
    data() {
      return {
        activeName: 'video',
      }
    },
    methods: {
      selectSuccess(obj) {
        this.$emit('tellPar', obj)
      },
      handleClick() {

      }
    }
  }
</script>

<style lang="less" scoped>
  .creat-btn {
    right: 0px;
    z-index: 5;
  }
</style>