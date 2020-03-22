<template>
    <div>
      <el-dialog :visible.sync='menuObj.isShow' title="ppt预览" class="resetPwd" width='750px' append-to-body :before-close="closeDialog" >
        <el-carousel height="400px" :interval="5000" arrow="always">
            <el-carousel-item v-for="(item,index) in bannerList" :key="index">
               <img :src="item.imgUrl" alt="" style="width: 100%;height: 100%;">
            </el-carousel-item>
          </el-carousel>
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
      data() {
        return {
          bannerList:[
         
          ],
        }
      },
      methods: {
        closeDialog() {
          this.$emit('closeMain')
        },
      },
      mounted() {
      
      },
      watch: {
        'menuObj.isShow'(val, oldVal) {
          if (val) {
            this.bannerList=this.menuObj.data;
          }
          else{
            this.bannerList=[];
          }
        }
      },
      
    };
  </script>
  <style scoped>
  /deep/ .el-carousel__button {
   
    width: 23px;
  
    background-color: #688baf;
    
}
  </style>