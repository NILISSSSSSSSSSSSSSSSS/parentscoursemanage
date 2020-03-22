<template>
  <div class="all-user pr">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程" name="1">
        <lable-manage current="1" ref="1">
        </lable-manage>
      </el-tab-pane>
      <el-tab-pane label="看点" name="3">
        <lable-manage current="3" ref="3">
        </lable-manage>
      </el-tab-pane>
      <el-tab-pane label="专家" name="2">
        <lable-manage current="2" ref="2">
        </lable-manage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import lableManage from '@/components/lableManage/lableManage';
  export default {
    components: {
      lableManage,
    },
    data() {
      return {
        activeName: '1',
      }
    },


    methods: {
      //点击时请求接口
      handleClick(tab, event) {
        // this.$refs[tab.name].resetForm();
        // this.$refs[tab.name].getList();
      },
    }
  }
</script>

<style lang="less" scoped>
  .creat-btn {
    right: 0px;
    z-index: 5;
  }
</style>