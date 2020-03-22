<template>
  <div class="all-user pr">
    <!-- <el-button @click='showEdit' class="creat-btn pa" type='primary' icon='el-icon-plus' size='small'>创建优惠券</el-button> -->
    <el-tabs v-model="activeName" @tab-click='handleClick'>
      <el-tab-pane label="好呗呗优惠券" name="hbb">
          <couponList :couponData='activeName'/>
      </el-tab-pane>
      <!-- <el-tab-pane label="门店优惠券" name="shop"  >
          <couponList :couponData='activeName'/>
      </el-tab-pane> -->
    </el-tabs>
   
  </div>
</template>

<script>
import couponList from '@/components/couponManage/couponList';


export default {
  components:{
    couponList,
    
  },
  data(){
    return{
      activeName: 'hbb',
     
    }
  },
  watch: {
    
  },

  methods:{
   
    handleClick(e){

    }
  }
}
</script>

<style lang="less" scoped>
  .creat-btn{
    right: 0px;
    z-index: 5;
  }
</style>
